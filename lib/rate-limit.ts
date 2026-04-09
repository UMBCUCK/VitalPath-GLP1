/**
 * Rate limiter with Upstash Redis backend for production.
 * Falls back to in-memory for local development.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Use Upstash Redis if configured, otherwise fall back to in-memory
const hasRedis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Cache of Upstash limiters keyed by "maxTokens:windowSeconds"
const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(maxTokens: number, windowSeconds: number): Ratelimit {
  const key = `${maxTokens}:${windowSeconds}`;
  let limiter = upstashLimiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(maxTokens, `${windowSeconds} s`),
      analytics: true,
    });
    upstashLimiters.set(key, limiter);
  }
  return limiter;
}

// In-memory fallback for development
const memoryBuckets = new Map<string, { tokens: number; lastRefill: number }>();

function memoryRateLimit(key: string, maxTokens: number, windowMs: number) {
  const now = Date.now();
  let bucket = memoryBuckets.get(key);

  if (!bucket) {
    bucket = { tokens: maxTokens, lastRefill: now };
    memoryBuckets.set(key, bucket);
  }

  const elapsed = now - bucket.lastRefill;
  const refillAmount = (elapsed / windowMs) * maxTokens;
  bucket.tokens = Math.min(maxTokens, bucket.tokens + refillAmount);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    return { success: false, remaining: 0 };
  }

  bucket.tokens -= 1;
  return { success: true, remaining: Math.floor(bucket.tokens) };
}

/**
 * Rate limit a request by key.
 * Uses Upstash Redis in production, in-memory in development.
 */
export async function rateLimit(
  key: string,
  { maxTokens = 10, windowSeconds = 60 } = {}
): Promise<{ success: boolean; remaining: number }> {
  if (hasRedis) {
    const limiter = getUpstashLimiter(maxTokens, windowSeconds);
    const result = await limiter.limit(key);
    return { success: result.success, remaining: result.remaining };
  }
  return memoryRateLimit(key, maxTokens, windowSeconds * 1000);
}

/**
 * Extract rate limit key from request using IP headers.
 */
export function getRateLimitKey(req: Request, prefix = "api"): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return `${prefix}:${ip}`;
}
