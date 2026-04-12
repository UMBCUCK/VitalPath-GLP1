"use client";

import { Gift, Star, Crown, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tiers = [
  { name: "Standard", min: 0, perRef: 50, icon: Gift, color: "bg-navy-200" },
  { name: "Silver", min: 5, perRef: 60, icon: Star, color: "bg-slate-400" },
  { name: "Gold", min: 10, perRef: 75, icon: Award, color: "bg-gold" },
  { name: "Ambassador", min: 25, perRef: 100, icon: Crown, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
];

interface ReferralTierProgressProps {
  totalReferred: number;
  totalEarned: number;
}

export function ReferralTierProgress({ totalReferred, totalEarned }: ReferralTierProgressProps) {
  // Determine current tier
  let currentTierIdx = 0;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (totalReferred >= tiers[i].min) { currentTierIdx = i; break; }
  }
  const currentTier = tiers[currentTierIdx];
  const nextTier = tiers[currentTierIdx + 1];

  // Progress to next tier
  const progressToNext = nextTier
    ? ((totalReferred - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;
  const referralsToNext = nextTier ? nextTier.min - totalReferred : 0;

  return (
    <div className="rounded-2xl border border-navy-100/60 bg-gradient-to-br from-white to-navy-50/30 p-5">
      {/* Current tier */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", currentTier.color)}>
            <currentTier.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-graphite-400">Your tier</p>
            <p className="text-sm font-bold text-navy">{currentTier.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-graphite-400">Earned</p>
          <p className="text-sm font-bold text-navy">${(totalEarned / 100).toFixed(0)}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="rounded-lg bg-white p-2 text-center shadow-sm">
          <p className="text-lg font-bold text-navy">{totalReferred}</p>
          <p className="text-[10px] text-graphite-400">Referrals</p>
        </div>
        <div className="rounded-lg bg-white p-2 text-center shadow-sm">
          <p className="text-lg font-bold text-teal">${currentTier.perRef}</p>
          <p className="text-[10px] text-graphite-400">Per referral</p>
        </div>
        <div className="rounded-lg bg-white p-2 text-center shadow-sm">
          <p className="text-lg font-bold text-navy">${(totalEarned / 100).toFixed(0)}</p>
          <p className="text-[10px] text-graphite-400">Total earned</p>
        </div>
      </div>

      {/* Progress to next tier */}
      {nextTier && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-graphite-400">Progress to {nextTier.name}</span>
            <span className="text-[10px] font-medium text-navy">
              {referralsToNext} more referral{referralsToNext !== 1 ? "s" : ""} needed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-navy-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal to-atlantic transition-all duration-500"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-graphite-400">
            Reach {nextTier.name} tier to earn <span className="font-bold text-navy">${nextTier.perRef}/referral</span> (${nextTier.perRef - currentTier.perRef} more per referral)
          </p>
        </div>
      )}

      {/* Tier roadmap */}
      <div className="mt-4 flex items-center justify-between">
        {tiers.map((tier, i) => (
          <div key={tier.name} className="flex flex-col items-center">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-white text-[10px]",
              i <= currentTierIdx ? tier.color : "bg-navy-100"
            )}>
              <tier.icon className="h-3.5 w-3.5" />
            </div>
            <p className={cn(
              "mt-1 text-[9px] font-medium",
              i <= currentTierIdx ? "text-navy" : "text-graphite-300"
            )}>
              {tier.name}
            </p>
            <p className="text-[8px] text-graphite-400">{tier.min}+ refs</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href="/dashboard/referrals" className="mt-4 block">
        <div className="flex items-center justify-center gap-1.5 rounded-lg bg-teal-50 py-2 text-xs font-semibold text-teal hover:bg-teal-100 transition-colors">
          Share your referral link <ArrowRight className="h-3 w-3" />
        </div>
      </Link>
    </div>
  );
}
