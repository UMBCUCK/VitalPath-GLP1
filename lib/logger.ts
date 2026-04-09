/**
 * Safe logging utilities that prevent PHI/PII leakage in production logs.
 */

const SENSITIVE_KEYS = /email|password|phone|ssn|dob|dateOfBirth|token|secret/i;

function stripSensitive(data: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.test(key)) {
      cleaned[key] = "[REDACTED]";
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Log an error safely. In production, only logs the error message — never
 * the full object, stack trace, or data properties that may contain PHI.
 */
export function safeError(tag: string, error: unknown): void {
  if (process.env.NODE_ENV === "production") {
    if (error instanceof Error) {
      console.error(tag, error.message);
    } else if (typeof error === "string") {
      console.error(tag, error);
    } else {
      console.error(tag, "Unknown error");
    }
  } else {
    console.error(tag, error);
  }
}

/**
 * Log a message safely. In production, strips sensitive keys from the
 * optional data object before logging.
 */
export function safeLog(tag: string, message: string, data?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") {
    if (data) {
      console.log(tag, message, stripSensitive(data));
    } else {
      console.log(tag, message);
    }
  } else {
    console.log(tag, message, data);
  }
}
