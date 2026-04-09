/**
 * Shared constants for authentication and session management.
 * Single source of truth — imported by both lib/auth.ts and middleware.ts.
 */

const secret = process.env.NEXTAUTH_SECRET;

if (!secret && process.env.NODE_ENV === "production") {
  throw new Error(
    "NEXTAUTH_SECRET environment variable is required in production. " +
    "Generate one with: openssl rand -base64 32"
  );
}

export const JWT_SECRET = new TextEncoder().encode(
  secret || "vitalpath-dev-secret-change-in-production"
);

export const COOKIE_NAME = "vp-session";

/** 7 days in seconds */
export const SESSION_DURATION = 7 * 24 * 60 * 60;
