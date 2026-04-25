"use client";

/**
 * DaysToGoalChip
 * ─────────────────────────────────────────────────────────────
 * Tier 11.4 — Compact countdown chip showing the projected days
 * remaining to reach the user's goal weight, based on their
 * actual rolling 14-day weight-loss rate.
 *
 * Math:
 *   - lossPerDay = (weight 14d ago − today's weight) / days actually tracked
 *   - daysRemaining = (currentWeight − goalWeight) / max(lossPerDay, 0.05)
 *
 * Edge cases:
 *   - No goal set → render nothing
 *   - At/below goal → render celebration chip
 *   - Insufficient data (<3 logs) → render neutral "tracking starts now" chip
 *   - Negative slope (gaining) → show "trend reversing" chip without scary numbers
 */
import { TrendingDown, Target, Flag, Activity } from "lucide-react";

export interface DaysToGoalChipProps {
  currentWeight: number;
  goalWeight: number;
  recentEntries: Array<{ date: Date | string; weight: number | null }>;
}

function parseDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(d);
}

function computeLossPerDay(
  entries: Array<{ date: Date | string; weight: number | null }>,
): { lossPerDay: number; samples: number } {
  // Last 14 days, weight not null, sorted newest first
  const cutoff = Date.now() - 14 * 86400000;
  const usable = entries
    .filter((e) => e.weight !== null && parseDate(e.date).getTime() >= cutoff)
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

  if (usable.length < 3) return { lossPerDay: 0, samples: usable.length };

  const newest = usable[0];
  const oldest = usable[usable.length - 1];
  const days =
    (parseDate(newest.date).getTime() - parseDate(oldest.date).getTime()) / 86400000;
  if (days <= 0) return { lossPerDay: 0, samples: usable.length };

  const lossPerDay = ((oldest.weight as number) - (newest.weight as number)) / days;
  return { lossPerDay, samples: usable.length };
}

export function DaysToGoalChip({
  currentWeight,
  goalWeight,
  recentEntries,
}: DaysToGoalChipProps) {
  if (!goalWeight || goalWeight <= 0 || !currentWeight || currentWeight <= 0) {
    return null;
  }

  // Already at/below goal — celebrate
  if (currentWeight <= goalWeight) {
    return (
      <Chip accent="emerald" Icon={Flag} label="Goal reached">
        Maintenance mode 🎉
      </Chip>
    );
  }

  const { lossPerDay, samples } = computeLossPerDay(recentEntries);
  const remaining = currentWeight - goalWeight;

  if (samples < 3) {
    return (
      <Chip accent="navy" Icon={Activity} label="Tracking starts now">
        Log 3+ days for a projection
      </Chip>
    );
  }

  if (lossPerDay <= 0) {
    return (
      <Chip accent="amber" Icon={Activity} label="Trend reversing">
        14d trend up — message care team
      </Chip>
    );
  }

  // Healthy range floor: 0.05 lb/day (~0.35 lb/week) prevents wild projections
  const effectiveRate = Math.max(lossPerDay, 0.05);
  const daysRemaining = Math.ceil(remaining / effectiveRate);

  // Format as days / weeks / months for readability
  const display =
    daysRemaining < 60
      ? `${daysRemaining} days`
      : daysRemaining < 365
        ? `${Math.round(daysRemaining / 30)} months`
        : `${(daysRemaining / 365).toFixed(1)} years`;

  return (
    <Chip accent="teal" Icon={TrendingDown} label="Projected to goal">
      {display} at {effectiveRate.toFixed(2)} lb/day
    </Chip>
  );
}

function Chip({
  accent,
  Icon,
  label,
  children,
}: {
  accent: "emerald" | "teal" | "navy" | "amber";
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  const accentMap = {
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    teal: "bg-teal-50 border-teal-200 text-teal",
    navy: "bg-navy-50 border-navy-200 text-navy",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
  } as const;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${accentMap[accent]}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="font-bold">{label}:</span>
      <span className="font-medium text-navy">{children}</span>
      <Target className="h-3 w-3 opacity-50" />
    </div>
  );
}
