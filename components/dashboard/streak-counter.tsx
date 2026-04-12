"use client";

import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  if (streak === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-navy-50/80 px-3 py-1.5 text-xs font-medium text-graphite-500">
        <span className="text-sm opacity-50">&#128293;</span>
        Start your streak today
      </div>
    );
  }

  const isHot = streak >= 7;
  const isOnFire = streak >= 14;
  const isLegendary = streak >= 30;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
        isLegendary
          ? "bg-gold-100 text-gold-800 shadow-sm"
          : isOnFire
          ? "bg-orange-100 text-orange-700"
          : isHot
          ? "bg-teal-100 text-teal-700"
          : "bg-navy-100 text-navy-600"
      )}
    >
      <span
        className={cn(
          "text-sm",
          isHot && "animate-pulse"
        )}
        role="img"
        aria-label="fire"
      >
        &#128293;
      </span>
      {streak} day streak
      {isLegendary && (
        <span className="ml-0.5 text-sm" role="img" aria-label="star">&#11088;</span>
      )}
    </div>
  );
}
