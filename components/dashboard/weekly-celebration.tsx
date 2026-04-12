"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyProgress {
  thisWeek: number | null;
  lastWeek: number | null;
  change: number | null;
}

interface WeeklyCelebrationProps {
  weeklyProgress: WeeklyProgress;
}

export function WeeklyCelebration({ weeklyProgress }: WeeklyCelebrationProps) {
  const [visible, setVisible] = useState(true);
  const { thisWeek, lastWeek, change } = weeklyProgress;

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // No data — don't render
  if (thisWeek === null || lastWeek === null || change === null) return null;
  if (!visible) return null;

  const lost = change < 0;
  const maintained = change === 0;
  const lostAmount = Math.abs(change);

  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all hover:shadow-premium-md",
        lost
          ? "border-teal/30 bg-gradient-to-r from-teal-50/50 to-sage/30"
          : "border-navy-100/40 bg-gradient-to-r from-navy-50/30 to-sage/20"
      )}
      onClick={() => setVisible(false)}
    >
      {lost && <CelebrationOverlay />}
      <CardContent className="relative z-10 p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              lost ? "bg-teal text-white" : "bg-navy-100"
            )}
          >
            {lost ? (
              <TrendingDown className="h-5 w-5" />
            ) : (
              <Minus className="h-5 w-5 text-navy-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {lost ? (
              <>
                <p className="text-sm font-bold text-navy">
                  You lost {lostAmount} {lostAmount === 1 ? "lb" : "lbs"} this week!
                </p>
                <p className="text-xs text-graphite-400">
                  Last week: {lastWeek} lbs &rarr; This week: {thisWeek} lbs
                </p>
              </>
            ) : maintained ? (
              <>
                <p className="text-sm font-bold text-navy">Holding steady — that&apos;s progress too!</p>
                <p className="text-xs text-graphite-400">
                  Consistent at {thisWeek} lbs this week
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-navy">Stay the course</p>
                <p className="text-xs text-graphite-400">
                  Up {change} lbs this week — fluctuations are normal
                </p>
              </>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setVisible(false); }}
            className="shrink-0 rounded-lg p-1 text-graphite-300 hover:text-graphite-500 hover:bg-white/50 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

function CelebrationOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute block rounded-full opacity-60"
          style={{
            width: `${4 + Math.random() * 4}px`,
            height: `${4 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `-5%`,
            backgroundColor: ["#0D9488", "#D4A853", "#22D3EE", "#10B981"][i % 4],
            animation: `confetti-fall ${2 + Math.random() * 2}s ease-in forwards`,
            animationDelay: `${Math.random() * 1}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { top: -5%; opacity: 0.7; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
