"use client";

import { useEffect, useState } from "react";
import { Check, MapPin, X } from "lucide-react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Member stories — individual results, not typical
const notifications = [
  { name: "Rachel W.", location: "Denver, CO", action: "lost 28 lbs on the Essential plan", time: "Member story · Results not typical" },
  { name: "James L.", location: "Dallas, TX", action: "lost 45 lbs on the Premium plan", time: "Member story · Results not typical" },
  { name: "Robert J.", location: "Tampa, FL", action: "lost 58 lbs on the Premium plan", time: "Member story · Results not typical" },
  { name: "Nicole M.", location: "Portland, OR", action: "lost 22 lbs in her first 3 months", time: "Member story · Results not typical" },
  { name: "Priya S.", location: "Seattle, WA", action: "reached her goal weight over 7 months", time: "Member story · Results not typical" },
  { name: "Marcus D.", location: "Atlanta, GA", action: "lost 19 lbs over 4 months on the program", time: "Member story · Results not typical" },
  { name: "Amanda R.", location: "Nashville, TN", action: "lost 34 lbs over 6 months", time: "Member story · Results not typical" },
  { name: "Chris B.", location: "Phoenix, AZ", action: "lost 27 lbs over 5 months on the program", time: "Member story · Results not typical" },
];

export function SocialProofToasts() {
  const [current, setCurrent] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Honor reduced-motion: don't auto-display moving social proof.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let initialTimer: ReturnType<typeof setTimeout> | null = null;
    let intervalTimer: ReturnType<typeof setInterval> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    function scheduleNext(delay: number) {
      if (dismissed) return;
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      hideTimer = setTimeout(() => setVisible(false), 5000);
      const idx = Math.floor(Math.random() * notifications.length);
      setCurrent(idx);
      setVisible(true);
    }

    // First notification after 8 seconds
    initialTimer = setTimeout(() => scheduleNext(8000), 8000);

    // Recurring — pause when tab hidden (saves battery + avoids "popping in" mid-stream)
    intervalTimer = setInterval(() => {
      if (dismissed) return;
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      const idx = Math.floor(Math.random() * notifications.length);
      setCurrent(idx);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 5000);
    }, 25000 + Math.random() * 15000);

    return () => {
      if (initialTimer) clearTimeout(initialTimer);
      if (intervalTimer) clearInterval(intervalTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [dismissed]);

  if (dismissed || current === null) return null;

  const notification = notifications[current];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "fixed left-4 right-4 z-50 max-w-sm transition-all duration-500 bottom-[calc(env(safe-area-inset-bottom)+5rem)] sm:right-auto sm:bottom-6 md:bottom-6",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-navy-100/60 bg-white p-4 shadow-premium-lg">
        {/* Green check avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50">
          <Check className="h-5 w-5 text-teal" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-navy">
            <span className="font-semibold">{notification.name}</span>{" "}
            {notification.action}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-graphite-400">
            <span className="flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {notification.location}
            </span>
            <span>&middot;</span>
            <span>{notification.time}</span>
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg p-1 text-graphite-300 hover:bg-navy-50 hover:text-graphite-500 transition-colors"
          aria-label="Dismiss notifications"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
