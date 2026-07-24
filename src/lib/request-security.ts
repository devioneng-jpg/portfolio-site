import { randomUUID } from "node:crypto";
import { ipAddress } from "@vercel/functions";

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

export function getMissingProductionSecurityConfig(): string[] {
  if (!isProduction()) return [];

  return [
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "RATE_LIMIT_SALT",
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

