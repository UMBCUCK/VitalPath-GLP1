"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Zap } from "lucide-react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-navy via-atlantic to-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-3 px-4 py-2.5 sm:px-6">
        <Zap className="h-4 w-4 shrink-0 text-gold" />
        <p className="text-center text-xs font-medium sm:text-sm">
          <span className="hidden sm:inline">GLP-1 medication from </span>
          <span className="font-bold">$279/mo</span>
          <span className="hidden sm:inline"> — that&apos;s</span>
          <span className="sm:hidden"> &middot;</span>
          {" "}<span className="font-bold">79% less</span> than brand-name retail.
          {" "}
          <Link
            href="/quiz"
            onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "announcement_bar", target: "/quiz" })}
            className="inline-flex items-center gap-1 font-bold underline underline-offset-2 decoration-gold hover:decoration-white transition-colors"
          >
            Check eligibility &rarr;
          </Link>
        </p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/60 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
