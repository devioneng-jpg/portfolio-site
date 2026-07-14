import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimitOptions {
  scope: "chat" | "voice";
  identifier: string;
  limit: number;
  windowSeconds: number;
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

function getRedis(): Redis | null {
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
    return checkMemoryLimit(
      `${scope}:${hashedIdentifier}`,
      limit,
      windowSeconds
    );
  }

  const limiterKey = `${scope}:${limit}:${windowSeconds}`;
  let limiter = durableLimiters.get(limiterKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(limit, `${windowSeconds} s`),
      prefix: `portfolio:${scope}`,
      analytics: true,
    });
    durableLimiters.set(limiterKey, limiter);
  }

  const result = await limiter.limit(hashedIdentifier);
  return {
    success: result.success,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000)
    ),
    configured: true,
  };
}

export function getClientIdentifier(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function resetMemoryRateLimitsForTests() {
  memoryWindows.clear();
}
