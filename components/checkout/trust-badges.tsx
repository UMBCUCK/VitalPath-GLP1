"use client";

import { Shield, Lock, Star, CreditCard } from "lucide-react";

const badges = [
  { icon: Shield, label: "HIPAA Compliant" },
  { icon: Lock, label: "256-bit Encrypted" },
  { icon: Star, label: "4.9/5 from 18,000+ patients" },
  { icon: CreditCard, label: "Secure payment by Stripe" },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-xl border border-navy-100/40 bg-white/60 px-4 py-3">
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-1.5">
          <badge.icon className="h-3.5 w-3.5 text-graphite-300" />
          <span className="text-[11px] font-medium text-graphite-400">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
