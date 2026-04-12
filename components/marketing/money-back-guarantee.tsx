"use client";

import { ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export function MoneyBackGuarantee({ variant = "full" }: { variant?: "full" | "compact" | "badge" }) {
  if (variant === "badge") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-bold text-emerald-700">30-Day Money-Back Guarantee</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-navy">30-Day Money-Back Guarantee</p>
            <p className="mt-0.5 text-xs text-graphite-500">
              Not satisfied within 30 days? Contact us and we&apos;ll refund your membership fee in full.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 sm:p-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <ShieldCheck className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-navy sm:text-2xl">
          100% Money-Back Guarantee
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-graphite-500 leading-relaxed">
          Try Nature&apos;s Journey risk-free. If you&apos;re not satisfied with your membership
          within the first 30 days, contact our care team and we&apos;ll make it right — including
          a full refund of your membership fee if we can&apos;t resolve your concern.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-graphite-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            30-day satisfaction window
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            No cancellation fees ever
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Cancel in 2 clicks
          </span>
        </div>
        <p className="mt-3 text-[10px] text-graphite-300 max-w-sm mx-auto">
          Applies to membership fees only. Medication costs are non-refundable once dispensed. Contact care@naturesjourneyhealth.com within 30 days of your first charge.
        </p>
        <div className="mt-6">
          <Link href="/qualify">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "money_back_guarantee", target: "/qualify" })}
            >
              Start Risk-Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
