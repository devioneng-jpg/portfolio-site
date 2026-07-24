import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getClientIdentifier } from "./request-security";

interface RateLimitOptions {
  scope: "challenge" | "chat" | "voice";
  identifier: string;
  limit: number;
  windowSeconds: number;
  globalLimit?: number;
}

export interface RateLimitResult {
  success: boolean;
  retryAfterSeconds: number;
  configured: boolean;
}

interface MemoryWindow {
  count: number;
  resetAt: number;
}

const memoryWindows = new Map<string, MemoryWindow>();
const durableLimiters = new Map<string, Ratelimit>();

export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function hashIdentifier(identifier: string): string | null {
  const salt = process.env.RATE_LIMIT_SALT;
  if (process.env.NODE_ENV === "production" && !salt) return null;

  return createHash("sha256")
    .update(`${salt ?? "local-development"}:${identifier}`)
    .digest("hex");
}

function checkMemoryLimit(
  key: string,
  limit: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const existing = memoryWindows.get(key);

  if (!existing || now >= existing.resetAt) {
    memoryWindows.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000,
    });
    return { success: true, retryAfterSeconds: windowSeconds, configured: true };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      configured: true,
    };
  }

  existing.count += 1;
  return {
    success: true,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    configured: true,
  };
}

export async function checkRateLimit({
  scope,
  identifier,
  limit,
  windowSeconds,
  globalLimit,
}: RateLimitOptions): Promise<RateLimitResult> {
  const hashedIdentifier = hashIdentifier(identifier);
  if (!hashedIdentifier) {
    return { success: false, retryAfterSeconds: 60, configured: false };
  }

  const redis = getRedis();
  if (!redis) {
    if (process.env.NODE_ENV === "production") {
      return { success: false, retryAfterSeconds: 60, configured: false };
    }
    const individualResult = checkMemoryLimit(
      `${scope}:${hashedIdentifier}`,
      limit,
      windowSeconds
    );
    if (!individualResult.success || !globalLimit) return individualResult;

    return checkMemoryLimit(
      `${scope}:global`,
      globalLimit,
      windowSeconds
    );
  }

  try {
    const individualLimiter = getDurableLimiter({
      redis,
      scope,
      kind: "individual",
      limit,
      windowSeconds,
    });
    const checks = [individualLimiter.limit(hashedIdentifier)];

    if (globalLimit) {
      const globalLimiter = getDurableLimiter({
        redis,
        scope,
        kind: "global",
        limit: globalLimit,
        windowSeconds,
      });
      checks.push(globalLimiter.limit("all-visitors"));
    }

    const results = await Promise.all(checks);
    const blockedResult = results.find((result) => !result.success);
    const resetAt = blockedResult?.reset ?? Math.max(...results.map((r) => r.reset));

    return {
      success: !blockedResult,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((resetAt - Date.now()) / 1000)
      ),
      configured: true,
    };
  } catch {
    return { success: false, retryAfterSeconds: 60, configured: false };
  }
}

function getDurableLimiter({
  redis,
  scope,
  kind,
  limit,
  windowSeconds,
}: {
  redis: Redis;
  scope: RateLimitOptions["scope"];
  kind: "individual" | "global";
  limit: number;
  windowSeconds: number;
}) {
  const limiterKey = `${scope}:${kind}:${limit}:${windowSeconds}`;
  let limiter = durableLimiters.get(limiterKey);
  if (limiter) return limiter;

  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(limit, `${windowSeconds} s`),
    prefix: `portfolio:${scope}:${kind}`,
    analytics: true,
  });
  durableLimiters.set(limiterKey, limiter);
  return limiter;
}

export { getClientIdentifier };

export function resetMemoryRateLimitsForTests() {
  memoryWindows.clear();
  durableLimiters.clear();
}
