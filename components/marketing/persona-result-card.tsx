"use client";

import { RefreshCw, Brain, TrendingUp, Sparkles, Target, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PersonaResult } from "@/lib/funnel";
import { cn } from "@/lib/utils";

const iconMap: Record<string, typeof RefreshCw> = {
  RefreshCw, Brain, TrendingUp, Sparkles, Target,
};

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", badge: "bg-teal" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-600" },
  navy: { bg: "bg-navy-50", text: "text-navy-700", border: "border-navy-200", badge: "bg-navy" },
};

interface PersonaResultCardProps {
  persona: PersonaResult;
  projectedLoss?: number;
  recommendedPlan?: string;
}

export function PersonaResultCard({ persona, projectedLoss, recommendedPlan }: PersonaResultCardProps) {
  const Icon = iconMap[persona.icon] || Sparkles;
  const colors = colorMap[persona.color] || colorMap.teal;

  return (
    <div className={cn("rounded-2xl border-2 p-6 sm:p-8", colors.border, colors.bg)}>
      {/* Persona badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-white", colors.badge)}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-graphite-400">Your Profile</p>
          <h3 className={cn("text-lg font-bold", colors.text)}>{persona.name}</h3>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-base font-semibold text-navy">{persona.tagline}</p>
      <p className="mt-2 text-sm text-graphite-600 leading-relaxed">{persona.description}</p>

      {/* Projected results */}
      {projectedLoss && (
        <div className="mt-4 rounded-xl bg-white/70 p-4 border border-white/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-graphite-400">Projected weight loss</p>
              <p className="text-2xl font-bold text-navy">{projectedLoss} lbs</p>
            </div>
            {recommendedPlan && (
              <div>
                <p className="text-xs text-graphite-400">Recommended plan</p>
                <p className="text-sm font-bold text-navy capitalize">{recommendedPlan}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips for your type */}
      <div className="mt-5">
        <p className="text-xs font-bold text-navy uppercase tracking-wide mb-2">Tips for your profile</p>
        <div className="space-y-1.5">
          {persona.tips.map((tip) => (
            <div key={tip} className="flex items-start gap-2">
              <Check className={cn("h-3.5 w-3.5 shrink-0 mt-0.5", colors.text)} />
              <span className="text-xs text-graphite-600">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <Link href="/checkout">
          <Button size="lg" className="w-full gap-2">
            Continue to Your Plan <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
