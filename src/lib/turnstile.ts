import { z } from "zod";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_ACTION = "portfolio-access";
const VERIFY_TIMEOUT_MS = 5_000;

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  hostname: z.string().optional(),
  action: z.string().optional(),
  "error-codes": z.array(z.string()).optional(),
});

function expectedHostname(): string | null {
  const appUrl = process.env.APP_URL;
  if (!appUrl) return null;

  try {
    return new URL(appUrl).hostname;
  } catch {
    return null;
  }
}

export async function verifyTurnstileToken({
  token,
  remoteIp,
}: {
  token: string;
  remoteIp: string;
}): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: remoteIp,
        idempotency_key: crypto.randomUUID(),
      }),
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return false;

    const parsed = turnstileResponseSchema.safeParse(await response.json());
    if (!parsed.success || !parsed.data.success) return false;
    if (parsed.data.action && parsed.data.action !== TURNSTILE_ACTION) {
      return false;
    }

    const hostname = expectedHostname();
    if (
      process.env.NODE_ENV === "production" &&
      hostname &&
      parsed.data.hostname !== hostname
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export { TURNSTILE_ACTION };

