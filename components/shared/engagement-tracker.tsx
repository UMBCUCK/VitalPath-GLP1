"use client";

/**
 * EngagementTracker
 * ─────────────────────────────────────────────────────────────
 * Tier 11.8 — Mounts once globally and emits scroll-depth +
 * time-on-page milestones as analytics events. Powers content
 * optimization decisions like:
 *
 *   - Which blog posts hold attention vs. bounce immediately
 *   - Whether long-form LP pages get scrolled to the CTA
 *   - Median time-to-form-submit on /qualify
 *
 * Events:
 *   • engagement_scroll  { depth_pct: 25 | 50 | 75 | 100, path }
 *   • engagement_time    { seconds: 15 | 30 | 60 | 120 | 300, path }
 *
 * Each milestone fires AT MOST ONCE per page visit (Set dedupe).
 * Cleans up on unmount and on pathname change so SPA navigations
 * reset cleanly.
 */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

const TIME_MILESTONES = [15, 30, 60, 120, 300];
const DEPTH_MILESTONES = [25, 50, 75, 100];

export function EngagementTracker() {
  const pathname = usePathname();
  const seenScroll = useRef<Set<number>>(new Set());
  const seenTime = useRef<Set<number>>(new Set());
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reset milestone caches on every pathname change so SPA-routed
    // visitors get a fresh engagement window per page.
    seenScroll.current = new Set();
    seenTime.current = new Set();
    startedAt.current = Date.now();

    function depthPct(): number {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) return 100;
      const y = window.scrollY || doc.scrollTop;
      return Math.min(100, Math.max(0, Math.round((y / total) * 100)));
    }

    function checkScroll() {
      const pct = depthPct();
      for (const m of DEPTH_MILESTONES) {
        if (pct >= m && !seenScroll.current.has(m)) {
          seenScroll.current.add(m);
          track("engagement_scroll", { depth_pct: m, path: pathname });
        }
      }
    }

    // Throttled scroll listener — passive for paint perf
    let scrollTicking = false;
    function onScroll() {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        checkScroll();
        scrollTicking = false;
      });
    }

    function onTimeTick() {
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      for (const m of TIME_MILESTONES) {
        if (seconds >= m && !seenTime.current.has(m)) {
          seenTime.current.add(m);
          track("engagement_time", { seconds: m, path: pathname });
        }
      }
    }

    // Time milestones tick every 5s — cheap and avoids drift from setTimeout
    const timeInterval = setInterval(onTimeTick, 5000);

    // Scroll milestones
    window.addEventListener("scroll", onScroll, { passive: true });

    // Fire one initial scroll check (in case the page is short and the user
    // has already seen 100% on render)
    checkScroll();

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
