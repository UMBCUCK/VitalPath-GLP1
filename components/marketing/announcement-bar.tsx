"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Zap, Copy, Check } from "lucide-react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (dismissed) return null;

  function copyPromo() {
    navigator.clipboard.writeText("SAVE50");
    setCopied(true);
    track(ANALYTICS_EVENTS.CTA_CLICK, { location: "announcement_bar", action: "copy_promo", code: "SAVE50" });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative bg-gradient-to-r from-[#0077A8] via-[#0098D4] to-[#0077A8] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-3 px-4 py-2.5 pr-12 sm:px-6 sm:pr-14">
        <Zap className="h-4 w-4 shrink-0 text-gold animate-pulse" />
        <p className="text-center text-xs font-medium sm:text-sm">
          <span className="hidden sm:inline">Limited time: </span>
          Use code{" "}
          <button
            onClick={copyPromo}
            className="inline-flex items-center gap-1 rounded bg-white/15 px-2 py-0.5 font-bold tracking-wider hover:bg-white/25 transition-colors"
          >
            SAVE50
            {copied ? <Check className="h-3 w-3 text-emerald-300" /> : <Copy className="h-3 w-3 opacity-60" />}
          </button>
          {" "}for <span className="font-bold text-gold">$50 off</span> your first month.
          {" "}
          <Link
            href="/qualify"
            onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "announcement_bar", target: "/qualify" })}
            className="inline-flex items-center gap-1 font-bold underline underline-offset-2 decoration-gold hover:decoration-white transition-colors"
          >
            Claim offer &rarr;
          </Link>
        </p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
