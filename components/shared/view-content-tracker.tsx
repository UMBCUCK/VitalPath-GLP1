"use client";

/**
 * ViewContentTracker
 * ─────────────────────────────────────────────────────────────
 * Tier 5.1 — Drops a single ViewContent ping to Meta CAPI (server-side
 * via /api/meta-view-content) when a tracked page mounts. Also fires the
 * client-side event for PostHog/GA4 so both pipelines stay in sync.
 *
 * Use on pages that represent real buying-intent content:
 *   <ViewContentTracker contentName="Qualify Funnel" contentCategory="funnel" />
 *
 * Deduped per-session using sessionStorage so SPA-style re-mounts don't
 * spam the pixel.
 */
import { useEffect } from "react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export interface ViewContentTrackerProps {
  contentName: string;
  contentCategory?: string;
  contentIds?: string[];
  value?: number;
  currency?: string;
}

export function ViewContentTracker({
  contentName,
  contentCategory,
  contentIds,
  value,
  currency = "USD",
}: ViewContentTrackerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `vc:${contentName}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    // Client-side (PostHog, GA4)
    track(ANALYTICS_EVENTS.PAGE_VIEW, {
      content_name: contentName,
      content_category: contentCategory,
    });

    // Server-side (Meta CAPI) — fire-and-forget, never blocks render
    fetch("/api/meta-view-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content_name: contentName,
        content_category: contentCategory,
        content_ids: contentIds,
        value,
        currency,
      }),
      keepalive: true,
    }).catch(() => {
      // Swallow — tracking is best-effort
    });
  }, [contentName, contentCategory, contentIds, value, currency]);

  return null;
}
