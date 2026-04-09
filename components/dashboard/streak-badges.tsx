"use client";

import { Badge } from "@/components/ui/badge";
import { Flame, Zap, Star } from "lucide-react";

interface StreakBadgesProps {
  trackingStreak: number;
  checkInStreak: number;
}

const STREAK_MILESTONES = [7, 14, 30, 60, 90];

export function StreakBadges({ trackingStreak, checkInStreak }: StreakBadgesProps) {
  if (trackingStreak < 3 && checkInStreak < 1) return null;

  const trackingMilestone = STREAK_MILESTONES.reduce((best, m) => trackingStreak >= m ? m : best, 0);
  const badges: Array<{ icon: typeof Flame; label: string; color: string }> = [];

  if (trackingStreak >= 3) {
    badges.push({
      icon: Flame,
      label: `${trackingStreak}d streak`,
      color: trackingStreak >= 30 ? "bg-gold-100 text-gold-700" : trackingStreak >= 14 ? "bg-teal-100 text-teal-700" : "bg-navy-100 text-navy-600",
    });
  }

  if (trackingMilestone >= 7) {
    badges.push({
      icon: Star,
      label: `${trackingMilestone}d milestone`,
      color: "bg-gold-50 text-gold-600",
    });
  }

  if (checkInStreak >= 2) {
    badges.push({
      icon: Zap,
      label: `${checkInStreak} check-ins`,
      color: "bg-teal-50 text-teal-600",
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      {badges.map((b, i) => (
        <div key={i} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${b.color}`}>
          <b.icon className="h-3 w-3" />
          {b.label}
        </div>
      ))}
    </div>
  );
}
