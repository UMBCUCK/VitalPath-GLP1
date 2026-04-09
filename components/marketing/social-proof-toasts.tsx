"use client";

import { useEffect, useState } from "react";
import { Check, MapPin, X } from "lucide-react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Realistic notifications — these feel like real people starting their journey
const notifications = [
  { name: "Jessica T.", location: "Austin, TX", action: "just started her assessment", time: "2 min ago" },
  { name: "Marcus D.", location: "Atlanta, GA", action: "qualified for treatment", time: "4 min ago" },
  { name: "Rachel W.", location: "Denver, CO", action: "lost 28 lbs on the Essential plan", time: "verified member" },
  { name: "David K.", location: "Chicago, IL", action: "received his first shipment", time: "6 min ago" },
  { name: "Amanda R.", location: "Nashville, TN", action: "just started her assessment", time: "3 min ago" },
  { name: "Chris B.", location: "Phoenix, AZ", action: "qualified for treatment", time: "5 min ago" },
  { name: "Nicole M.", location: "Portland, OR", action: "just started her assessment", time: "1 min ago" },
  { name: "James L.", location: "Dallas, TX", action: "lost 45 lbs on the Premium plan", time: "verified member" },
  { name: "Priya S.", location: "Seattle, WA", action: "qualified for treatment", time: "2 min ago" },
  { name: "Lisa C.", location: "San Diego, CA", action: "just started her assessment", time: "4 min ago" },
  { name: "Anthony V.", location: "Miami, FL", action: "qualified for treatment", time: "3 min ago" },
  { name: "Robert J.", location: "Tampa, FL", action: "lost 58 lbs on the Premium plan", time: "verified member" },
];

export function SocialProofToasts() {
  const [current, setCurrent] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // First notification after 8 seconds, then every 25-40 seconds
    const initialDelay = setTimeout(() => {
      const idx = Math.floor(Math.random() * notifications.length);
      setCurrent(idx);
      setVisible(true);

      // Auto-hide after 5 seconds
      setTimeout(() => setVisible(false), 5000);
    }, 8000);

    const interval = setInterval(() => {
      if (dismissed) return;
      const idx = Math.floor(Math.random() * notifications.length);
      setCurrent(idx);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }, 25000 + Math.random() * 15000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed || current === null) return null;

  const notification = notifications[current];

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 z-50 max-w-sm transition-all duration-500 md:bottom-6",
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
