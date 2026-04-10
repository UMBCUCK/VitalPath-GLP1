"use client";

import { cn } from "@/lib/utils";

interface Recommendation {
  action: string;
  type: "payment" | "engagement" | "upgrade" | "winback";
  priority: "high" | "medium" | "low";
}

const typeStyles: Record<Recommendation["type"], string> = {
  payment: "bg-red-50 text-red-700 border-red-200",
  engagement: "bg-amber-50 text-amber-700 border-amber-200",
  upgrade: "bg-teal-50 text-teal-700 border-teal-200",
  winback: "bg-blue-50 text-blue-700 border-blue-200",
};

export function ActionChip({ recommendation }: { recommendation: Recommendation }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-tight",
        typeStyles[recommendation.type]
      )}
    >
      {recommendation.action}
    </span>
  );
}
