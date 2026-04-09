/**
 * In-memory token bucket rate limiter.
 * For production, use Redis-backed rate limiting (e.g., @upstash/ratelimit).
 */

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();

// Clean up old buckets periodically (avoid memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > 3600000) { // 1 hour
      buckets.delete(key);
    }
  }
}, 60000);

export function rateLimit(
  key: string,
  { maxTokens = 10, refillRate = 10, windowMs = 60000 } = {}
): { success: boolean; remaining: number } {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: maxTokens, lastRefill: now };
    buckets.set(key, bucket);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  const refillAmount = (elapsed / windowMs) * refillRate;
  bucket.tokens = Math.min(maxTokens, bucket.tokens + refillAmount);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    return { success: false, remaining: 0 };
  }

  bucket.tokens -= 1;
  return { success: true, remaining: Math.floor(bucket.tokens) };
}

/**
 * Helper to extract a rate limit key from a request.
 * Uses IP address or forwarded-for header.
 */
export function getRateLimitKey(req: Request, prefix: string = "api"): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
}
