import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import { ipAddress } from "@vercel/functions";

const SECURITY_COOKIE_NAME = "__Host-portfolio_verified";
const SECURITY_SESSION_TTL_SECONDS = 60 * 60;

interface SecuritySessionPayload {
  id: string;
  expiresAt: number;
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function parseOrigin(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(request: Request): boolean {
  if (!isProduction()) return true;
  if (
    process.env.VERCEL_ENV === "preview" &&
    process.env.ALLOW_PREVIEW_ORIGINS !== "true"
  ) {
    return false;
  }

  const requestOrigin = parseOrigin(request.url);
  const suppliedOrigin = parseOrigin(request.headers.get("origin"));
  if (!requestOrigin || !suppliedOrigin) return false;

  const allowedOrigins = new Set(
    [
      requestOrigin,
      parseOrigin(process.env.APP_URL),
      parseOrigin(
        process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : undefined
      ),
    ].filter((origin): origin is string => Boolean(origin))
  );

  return allowedOrigins.has(suppliedOrigin);
}

export function getClientIdentifier(request: Request): string {
  const platformIp = ipAddress(request);
  if (platformIp) return platformIp;

  if (!isProduction()) {
    return (
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local-development"
    );
  }

  return "unknown";
}

export function isSecuritySessionRequired(): boolean {
  return (
    isProduction() ||
    Boolean(
      process.env.TURNSTILE_SECRET_KEY ||
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    )
  );
}

function getSessionSecret(): string | null {
  return process.env.SECURITY_SESSION_SECRET?.trim() || null;
}

function signPayload(encodedPayload: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");
}

export function createSecuritySession(): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("Security session signing is not configured");
  }

  const payload: SecuritySessionPayload = {
    id: randomUUID(),
    expiresAt: Math.floor(Date.now() / 1000) + SECURITY_SESSION_TTL_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  return `${encodedPayload}.${signPayload(encodedPayload, secret)}`;
}

function getCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const [cookieName, ...valueParts] = cookie.trim().split("=");
    if (cookieName === name) {
      return valueParts.join("=") || null;
    }
  }

  return null;
}

export function hasValidSecuritySession(request: Request): boolean {
  if (!isSecuritySessionRequired()) return true;

  const secret = getSessionSecret();
  const session = getCookie(request, SECURITY_COOKIE_NAME);
  if (!secret || !session) return false;

  const [encodedPayload, suppliedSignature, ...extraParts] =
    session.split(".");
  if (!encodedPayload || !suppliedSignature || extraParts.length > 0) {
    return false;
  }

  const expectedSignature = signPayload(encodedPayload, secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  if (
    expectedBuffer.length !== suppliedBuffer.length ||
    !timingSafeEqual(expectedBuffer, suppliedBuffer)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as Partial<SecuritySessionPayload>;

    return (
      typeof payload.id === "string" &&
      typeof payload.expiresAt === "number" &&
      payload.expiresAt > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

export function createSecuritySessionCookie(session: string): string {
  return [
    `${SECURITY_COOKIE_NAME}=${session}`,
    "Path=/",
    `Max-Age=${SECURITY_SESSION_TTL_SECONDS}`,
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
  ].join("; ");
}

export function getMissingProductionSecurityConfig(): string[] {
  if (!isProduction()) return [];

  return [
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "RATE_LIMIT_SALT",
    "TURNSTILE_SECRET_KEY",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    "SECURITY_SESSION_SECRET",
  ].filter((name) => !process.env[name]?.trim());
}

export function logRouteError(
  scope: string,
  error: unknown,
  requestId = randomUUID()
) {
  if (!isProduction()) {
    console.error(`[${scope}]`, error);
    return;
  }

  const name = error instanceof Error ? error.name : "UnknownError";
  console.error(JSON.stringify({ scope, requestId, name }));
}

