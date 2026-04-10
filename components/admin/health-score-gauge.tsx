"use client";

import { cn } from "@/lib/utils";

interface HealthScoreGaugeProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score <= 30) return "text-red-500";
  if (score <= 60) return "text-amber-500";
  if (score <= 80) return "text-teal";
  return "text-emerald-500";
}

function getStrokeColor(score: number): string {
  if (score <= 30) return "#ef4444";  // red-500
  if (score <= 60) return "#f59e0b";  // amber-500
  if (score <= 80) return "#0d9488";  // teal
  return "#10b981";                   // emerald-500
}

function getTrackColor(score: number): string {
  if (score <= 30) return "#fef2f2";  // red-50
  if (score <= 60) return "#fffbeb";  // amber-50
  if (score <= 80) return "#f0fdfa";  // teal-50
  return "#ecfdf5";                   // emerald-50
}

export function HealthScoreGauge({ score }: HealthScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // SVG circle math
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getTrackColor(clampedScore)}
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor(clampedScore)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center score number */}
      <span className={cn("absolute text-lg font-bold", getScoreColor(clampedScore))}>
        {clampedScore}
      </span>
    </div>
  );
}
