/**
 * Environment validation — fails fast with clear errors if required vars are missing.
 * Two tiers: build-time required and runtime-required.
 */

// Build-time required — these must be set for `next build` to succeed
function requireBuildEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Set it in your .env file or Vercel dashboard.`
    );
  }
  return value;
}

// Runtime-required — only validated when accessed (not during build)
function requireRuntimeEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. This is needed at runtime. Set it in your Vercel dashboard.`
    );
  }
  return value;
}

/**
 * Returns the base URL with no trailing slash.
 * Throws if NEXT_PUBLIC_APP_URL is not set.
 * In development, falls back to localhost.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  throw new Error(
    "NEXT_PUBLIC_APP_URL is required in production. Set it in your Vercel dashboard."
  );
}

/**
 * Validated environment accessors.
 * Use these instead of reading process.env directly.
 */
export const env = {
  /** Base URL — required in production, falls back to localhost in dev */
  get baseUrl() {
    return getBaseUrl();
  },

  /** Database connection string — required at build + runtime */
  get databaseUrl() {
    return requireBuildEnv("DATABASE_URL");
  },

  /** JWT signing secret — required at runtime for auth */
  get authSecret() {
    return requireRuntimeEnv("NEXTAUTH_SECRET");
  },

  /** Stripe secret key — required at runtime for payments */
  get stripeSecretKey() {
    return requireRuntimeEnv("STRIPE_SECRET_KEY");
  },

  /** Stripe webhook secret — required at runtime for webhook verification */
  get stripeWebhookSecret() {
    return requireRuntimeEnv("STRIPE_WEBHOOK_SECRET");
  },

  /** Upstash Redis URL — optional, for rate limiting */
  get upstashRedisUrl() {
    return process.env.UPSTASH_REDIS_REST_URL || "";
  },

  /** Upstash Redis token — optional, for rate limiting */
  get upstashRedisToken() {
    return process.env.UPSTASH_REDIS_REST_TOKEN || "";
  },

  /** Resend API key — optional, for emails */
  get resendApiKey() {
    return process.env.RESEND_API_KEY || "";
  },
} as const;
