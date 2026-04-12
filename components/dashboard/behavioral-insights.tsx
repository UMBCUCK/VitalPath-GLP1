"use client";

import { TrendingUp, Target, Flame, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface InsightsProps {
  streak: number;
  logsThisWeek: number;
  weightTrend: "down" | "up" | "flat";
  proteinDaysHit: number;
  waterDaysHit: number;
}

export function BehavioralInsights({
  streak = 0,
  logsThisWeek = 0,
  weightTrend = "flat",
  proteinDaysHit = 0,
  waterDaysHit = 0,
}: InsightsProps) {
  const insights = generateInsights({ streak, logsThisWeek, weightTrend, proteinDaysHit, waterDaysHit });

  if (insights.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-bold text-navy">Your Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.slice(0, 3).map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-navy-50/50 p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <insight.icon className={`h-4 w-4 ${insight.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-navy leading-snug">{insight.message}</p>
                {insight.cta && (
                  <Link href={insight.cta.href} className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-teal hover:underline">
                    {insight.cta.label} <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface Insight {
  icon: typeof TrendingUp;
  color: string;
  message: string;
  cta?: { label: string; href: string };
}

function generateInsights(data: InsightsProps): Insight[] {
  const insights: Insight[] = [];

  // Streak insights
  if (data.streak >= 7) {
    insights.push({
      icon: Flame,
      color: "text-orange-500",
      message: `${data.streak}-day streak! Members who maintain a 7+ day streak lose 2.3x more weight on average.`,
    });
  } else if (data.streak >= 3) {
    insights.push({
      icon: Flame,
      color: "text-orange-400",
      message: `${data.streak}-day streak! Keep going — you're ${7 - data.streak} days from hitting the 7-day milestone.`,
      cta: { label: "Log today", href: "/dashboard/progress" },
    });
  } else if (data.streak === 0) {
    insights.push({
      icon: Flame,
      color: "text-graphite-300",
      message: "Start a new streak today! Members who log daily see 40% better results.",
      cta: { label: "Log now", href: "/dashboard/progress" },
    });
  }

  // Logging consistency
  if (data.logsThisWeek >= 5) {
    insights.push({
      icon: Target,
      color: "text-teal",
      message: `You logged ${data.logsThisWeek}/7 days this week — you're in the top 20% of members for consistency.`,
    });
  } else if (data.logsThisWeek >= 3) {
    insights.push({
      icon: Target,
      color: "text-navy",
      message: `${data.logsThisWeek}/7 days logged this week. Log ${5 - data.logsThisWeek} more days to hit the "consistency sweet spot" that predicts long-term success.`,
      cta: { label: "Log today", href: "/dashboard/progress" },
    });
  }

  // Weight trend
  if (data.weightTrend === "down") {
    insights.push({
      icon: TrendingUp,
      color: "text-emerald-500",
      message: "Your weight is trending down! At this rate, you're on track to hit your next milestone.",
    });
  }

  // Protein tracking
  if (data.proteinDaysHit >= 5) {
    insights.push({
      icon: Award,
      color: "text-gold",
      message: `Protein goal hit ${data.proteinDaysHit}/7 days! High protein intake preserves muscle during weight loss — you're doing it right.`,
    });
  }

  return insights;
}
