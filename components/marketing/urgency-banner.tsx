"use client";

import Link from "next/link";
import { ShieldCheck, Package, ArrowRight, Star } from "lucide-react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export function UrgencyBanner() {
  return (
    <div className="bg-gradient-to-r from-[#005066] via-[#0077A8] to-[#005066] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-5 gap-y-1 flex-wrap px-4 py-2">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Star className="h-3.5 w-3.5 fill-gold text-gold shrink-0" />
          <span className="font-bold">GLP-1 from $179/mo</span>
          <span className="text-white/60 hidden sm:inline">— save 79% vs. brand-name</span>
        </div>

        <span className="hidden text-white/30 sm:inline">|</span>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <Package className="h-3.5 w-3.5 shrink-0 text-teal-300" />
          <span>Free 2-day delivery</span>
        </div>

        <span className="hidden text-white/30 sm:inline">|</span>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span>30-day money-back guarantee</span>
        </div>

        <Link
          href="/qualify"
          onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "urgency_banner", target: "/qualify" })}
          className="hidden items-center gap-1 rounded-full bg-emerald px-3 py-1 text-xs font-bold text-white transition-transform hover:scale-105 hover:bg-emerald-700 sm:inline-flex"
        >
          Get Started Free <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
