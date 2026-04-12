"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  streak: number;
  weekDays?: boolean[];  // [Mon, Tue, Wed, Thu, Fri, Sat, Sun] — true if logged
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakDisplay({ streak, weekDays = [] }: StreakDisplayProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Streak counter */}
      <div className="flex items-center gap-1.5">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          streak > 0 ? "bg-gradient-to-br from-orange-400 to-red-500" : "bg-navy-100"
        )}>
          <Flame className={cn("h-5 w-5", streak > 0 ? "text-white" : "text-graphite-400")} />
        </div>
        <div>
          <p className="text-lg font-bold text-navy leading-none tabular-nums">{streak}</p>
          <p className="text-[10px] text-graphite-400 leading-none">day streak</p>
        </div>
      </div>

      {/* Week dots */}
      {weekDays.length > 0 && (
        <div className="flex gap-1.5">
          {weekDays.map((logged, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all",
                logged
                  ? "bg-teal text-white shadow-sm"
                  : "bg-navy-50 text-graphite-300"
              )}>
                {logged ? "✓" : DAY_LABELS[i]}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
