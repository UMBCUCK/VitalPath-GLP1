"use client";

/**
 * LpAttributionTracker
 * ─────────────────────────────────────────────────────────────
 * Tier 8.8 — Drop-in tracker for landing pages. On first view it
 * persists { theme, path, firstSeen } to localStorage under
 * `nj-lp-attr`. Later, on the success page (or any conversion
 * surface), we read that attribution and attach it to the
 * checkout-complete event so we can A/B compare LPs on actual
 * revenue — not just clicks.
 *
 * Usage:
 *   <LpAttributionTracker theme="belly-fat-women" path="/lp/belly-fat" />
 *
 * Session-scoped: once stored, don't overwrite within the same
 * session — the first LP that landed the user wins attribution
 * credit (standard first-touch model). Expires after 30 days so
 * long-returning visitors don't get stale credit.
 */
import { useEffect } from "react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export interface LpAttributionTrackerProps {
  theme: string;
  path: string;
}

const STORAGE_KEY = "nj-lp-attr";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface StoredAttribution {
  theme: string;
  path: string;
  firstSeen: number;
}

export function LpAttributionTracker({ theme, path }: LpAttributionTrackerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Fire the LP view event (PostHog/GA4) every time, not just first-touch.
    // Matches the existing LP_THEME_VIEW pattern already in ANALYTICS_EVENTS.
    track(ANALYTICS_EVENTS.LP_THEME_VIEW, { theme, path });

    // First-touch attribution — only write if empty or expired
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAttribution;
        if (parsed.firstSeen && Date.now() - parsed.firstSeen < TTL_MS) {
          // Still fresh — keep the original first-touch
          return;
        }
      }
      const next: StoredAttribution = {
        theme,
        path,
        firstSeen: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage might be blocked (safari private) — non-blocking
    }
  }, [theme, path]);

  return null;
}

/**
 * readLpAttribution — Client-only helper for conversion surfaces.
 * Returns the stored attribution object or null if none/expired.
 */
export function readLpAttribution(): StoredAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed.firstSeen || Date.now() - parsed.firstSeen >= TTL_MS) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
