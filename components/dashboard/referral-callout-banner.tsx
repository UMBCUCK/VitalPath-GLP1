"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Copy, Check, TrendingUp, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  { name: "Standard", min: 0, perRef: 50 },
  { name: "Silver", min: 5, perRef: 60 },
  { name: "Gold", min: 10, perRef: 75 },
  { name: "Ambassador", min: 25, perRef: 100 },
];

interface ReferralCalloutBannerProps {
  totalReferred: number;
  totalEarned: number; // in cents
  referralCode: string;
  onOpenReseller: () => void;
}

export function ReferralCalloutBanner({
  totalReferred,
  totalEarned,
  referralCode,
  onOpenReseller,
}: ReferralCalloutBannerProps) {
  const [copied, setCopied] = useState(false);

  // Determine current tier
  let tierIdx = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (totalReferred >= TIERS[i].min) { tierIdx = i; break; }
  }
  const currentTier = TIERS[tierIdx];
  const nextTier = TIERS[tierIdx + 1] || null;
  const referralsToNext = nextTier ? nextTier.min - totalReferred : 0;
  const progressPct = nextTier
    ? Math.min(100, ((totalReferred - currentTier.min) / (nextTier.min - currentTier.min)) * 100)
    : 100;

  const referralUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/ref/${referralCode}`
      : `/ref/${referralCode}`;

  function copyLink() {
    navigator.clipboard.writeText(referralUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-teal/20 bg-gradient-to-r from-teal-50 via-white to-navy-50/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: earnings + tier */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-atlantic text-white">
            <Gift className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-navy">
                ${(totalEarned / 100).toFixed(0)} earned
              </p>
              <span className="text-graphite-300">·</span>
              <p className="text-sm text-graphite-500">
                {totalReferred} referral{totalReferred !== 1 ? "s" : ""}
              </p>
              <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-bold text-teal">
                {currentTier.name} · ${currentTier.perRef}/ref
              </span>
            </div>

            {/* Progress to next tier */}
            {nextTier && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 w-28 rounded-full bg-navy-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal to-atlantic transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-graphite-400 whitespace-nowrap">
                  {referralsToNext} more to {nextTier.name} (${nextTier.perRef}/ref)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copyLink}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
              copied
                ? "border-teal/30 bg-teal-50 text-teal"
                : "border-navy-200 bg-white text-navy hover:border-teal/40 hover:bg-teal-50/50"
            )}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <Link
            href="/dashboard/referrals"
            className="flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-teal/40 hover:bg-teal-50/50"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Analytics
          </Link>

          <button
            onClick={onOpenReseller}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-navy to-atlantic px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 hover:shadow"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Earn 3× More
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
