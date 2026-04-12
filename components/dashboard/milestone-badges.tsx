"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardCheck, Flame, TrendingDown, Award, Target, Droplets,
  Calendar, Trophy, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date | string;
}

interface MilestoneBadgesProps {
  badges: Badge[];
}

const ICON_MAP: Record<string, typeof Flame> = {
  ClipboardCheck,
  Flame,
  TrendingDown,
  Award,
  Target,
  Droplets,
  Calendar,
  Trophy,
};

const BADGE_COLORS: Record<string, { bg: string; icon: string; ring: string }> = {
  first_log: { bg: "from-teal-100 to-teal-50", icon: "text-teal-600", ring: "ring-teal-200" },
  week_warrior: { bg: "from-orange-100 to-orange-50", icon: "text-orange-600", ring: "ring-orange-200" },
  ten_lb_club: { bg: "from-blue-100 to-blue-50", icon: "text-blue-600", ring: "ring-blue-200" },
  twenty_five_lb_club: { bg: "from-gold-100 to-gold-50", icon: "text-gold-600", ring: "ring-gold-200" },
  protein_pro: { bg: "from-emerald-100 to-emerald-50", icon: "text-emerald-600", ring: "ring-emerald-200" },
  hydration_hero: { bg: "from-cyan-100 to-cyan-50", icon: "text-cyan-600", ring: "ring-cyan-200" },
  month_strong: { bg: "from-violet-100 to-violet-50", icon: "text-violet-600", ring: "ring-violet-200" },
  quarter_champion: { bg: "from-amber-100 to-amber-50", icon: "text-amber-600", ring: "ring-amber-200" },
};

export function MilestoneBadges({ badges }: MilestoneBadgesProps) {
  const earnedCount = badges.filter((b) => b.earned).length;

  if (badges.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold-600" /> Achievements
          </CardTitle>
          <span className="text-xs font-semibold text-graphite-400">{earnedCount}/{badges.length} earned</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {badges.map((badge) => {
            const IconComponent = ICON_MAP[badge.icon] || Trophy;
            const colors = BADGE_COLORS[badge.id] || { bg: "from-gray-100 to-gray-50", icon: "text-gray-600", ring: "ring-gray-200" };

            return (
              <div
                key={badge.id}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all",
                  badge.earned
                    ? `bg-gradient-to-br ${colors.bg} ring-1 ${colors.ring}`
                    : "bg-gray-50 opacity-50"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    badge.earned
                      ? `bg-white shadow-sm`
                      : "bg-gray-100"
                  )}
                >
                  {badge.earned ? (
                    <IconComponent className={cn("h-5 w-5", colors.icon)} />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className={cn(
                    "text-xs font-bold",
                    badge.earned ? "text-navy" : "text-gray-400"
                  )}>
                    {badge.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-graphite-400 leading-tight">
                    {badge.earned && badge.earnedAt
                      ? new Date(badge.earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : badge.earned
                      ? "Earned"
                      : "Keep going!"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
