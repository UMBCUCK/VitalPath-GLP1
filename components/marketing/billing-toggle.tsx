"use client";

import { cn } from "@/lib/utils";

export type BillingInterval = "monthly" | "quarterly" | "annual";

interface BillingToggleProps {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
}

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  const options: { value: BillingInterval; label: string; savings?: string }[] = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly", savings: "Save 10%" },
    { value: "annual", label: "Annual", savings: "Save 20%" },
  ];

  return (
    <div className="inline-flex rounded-xl border border-navy-200 bg-white p-1 shadow-premium">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "relative rounded-lg px-4 py-2 text-sm font-medium transition-all",
            value === opt.value
              ? "bg-navy text-white shadow-sm"
              : "text-graphite-500 hover:text-navy"
          )}
        >
          {opt.label}
          {opt.savings && value === opt.value && (
            <span className="absolute -top-2 -right-1 rounded-full bg-teal px-1.5 py-0.5 text-[9px] font-bold text-white">
              {opt.savings}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function getIntervalPrice(
  monthlyPrice: number,
  interval: BillingInterval
): { price: number; perMonth: number; savings: number; label: string } {
  switch (interval) {
    case "quarterly": {
      const total = Math.round(monthlyPrice * 3 * 0.9);
      return { price: total, perMonth: Math.round(total / 3), savings: Math.round(monthlyPrice * 3 * 0.1), label: "/quarter" };
    }
    case "annual": {
      const total = Math.round(monthlyPrice * 12 * 0.8);
      return { price: total, perMonth: Math.round(total / 12), savings: Math.round(monthlyPrice * 12 * 0.2), label: "/year" };
    }
    default:
      return { price: monthlyPrice, perMonth: monthlyPrice, savings: 0, label: "/month" };
  }
}
