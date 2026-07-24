import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  createSecuritySession,
  createSecuritySessionCookie,
  getClientIdentifier,
  getMissingProductionSecurityConfig,
  hasValidSecuritySession,
  isAllowedOrigin,
} from "@/lib/request-security";
import { verifyTurnstileToken } from "@/lib/turnstile";

const challengeSchema = z
  .object({
    token: z.string().min(1).max(2_048),
  })
  .strict();

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  return Response.json(
    { verified: hasValidSecuritySession(request) },
    { headers: noStoreHeaders }
  );
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return Response.json(
      { error: "Origin is not allowed" },
      { status: 403, headers: noStoreHeaders }
    );
  }

  if (getMissingProductionSecurityConfig().length > 0) {
    return Response.json(
      { error: "Verification is temporarily unavailable" },
      { status: 503, headers: noStoreHeaders }
    );
  }

  const identifier = getClientIdentifier(request);
  const limit = await checkRateLimit({
    scope: "challenge",
    identifier,
    limit: 10,
    globalLimit: 500,
    windowSeconds: 3600,
  });
  if (!limit.configured) {
    return Response.json(
      { error: "Verification is temporarily unavailable" },
      { status: 503, headers: noStoreHeaders }
    );
  }
  if (!limit.success) {
    return Response.json(
      { error: "Too many verification attempts. Try again later." },
      {
        status: 429,
        headers: {
          ...noStoreHeaders,
          "Retry-After": String(limit.retryAfterSeconds),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid request" },
      { status: 400, headers: noStoreHeaders }
    );
  }

  const parsed = challengeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid verification token" },
      { status: 400, headers: noStoreHeaders }
    );
  }

  const verified = await verifyTurnstileToken({
    token: parsed.data.token,
    remoteIp: identifier,
  });
  if (!verified) {
    return Response.json(
      { error: "Verification failed. Please try again." },
      { status: 403, headers: noStoreHeaders }
    );
  }

  const session = createSecuritySession();
  return Response.json(
    { verified: true },
    {
      headers: {
        ...noStoreHeaders,
        "Set-Cookie": createSecuritySessionCookie(session),
      },
    }
  );
}

