"use client";

/**
 * NextActionCard
 * ─────────────────────────────────────────────────────────────
 * Tier 10.2 — Shows the single most valuable thing the member should
 * do right now. Ranks candidates by priority and picks the top one
 * so the dashboard always has a clear, un-ambiguous next step.
 *
 * Priority stack (first match wins):
 *   1. No-weight-logged → "Log your starting weight" (onboarding)
 *   2. Refill due in ≤3 days → "Confirm your shipping address"
 *   3. Upcoming provider check-in ≤2 days → "Prep for your check-in"
 *   4. No meals viewed → "Browse this week's meal plan"
 *   5. Top upsell suggestion from the engine → context-aware add-on
 *   6. No referral sent and ≥7 days in → "Invite a friend, earn $50"
 *   7. Fallback → "Log today's check-in"
 *
 * All inputs come from the existing DashboardData shape so we don't
 * add server round-trips. The component renders nothing when there's
 * nothing meaningful to recommend.
 */
import Link from "next/link";
import {
  TrendingUp,
  Package,
  Stethoscope,
  Utensils,
  Sparkles,
  Gift,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

interface NextActionInput {
  onboarding: {
    hasFirstWeight: boolean;
    hasViewedMeals: boolean;
  };
  treatment: {
    nextRefillDaysAway: number | null;
    nextCheckInDaysAway?: number | null;
  } | null;
  upsellSuggestions: Array<{
    id: string;
    productSlug: string;
    productName: string;
    headline: string;
    description: string;
    priority: number;
  }>;
  referralsSent: number;
  daysInProgram: number;
  stats: {
    logsThisWeek: number;
  };
}

export interface NextActionCardProps {
  input: NextActionInput;
}

interface Action {
  id: string;
  eyebrow: string;
  title: string;
  sub: string;
  href: string;
  cta: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "teal" | "gold" | "amber" | "navy" | "emerald";
}

function pickAction(input: NextActionInput): Action | null {
  // 1 — Foundational onboarding
  if (!input.onboarding.hasFirstWeight) {
    return {
      id: "log_first_weight",
      eyebrow: "Start strong",
      title: "Log your starting weight",
      sub: "Your baseline anchors every progress chart going forward. Takes 10 seconds.",
      href: "/dashboard/progress",
      cta: "Log starting weight",
      icon: TrendingUp,
      accent: "teal",
    };
  }

  // 2 — Imminent refill
  if (
    input.treatment?.nextRefillDaysAway !== null &&
    input.treatment?.nextRefillDaysAway !== undefined &&
    input.treatment.nextRefillDaysAway <= 3 &&
    input.treatment.nextRefillDaysAway >= 0
  ) {
    return {
      id: "confirm_refill",
      eyebrow: `Refill in ${input.treatment.nextRefillDaysAway}d`,
      title: "Confirm shipping before your refill",
      sub: "A 30-second address + payment check now avoids a delivery delay.",
      href: "/dashboard/settings",
      cta: "Review shipping",
      icon: Package,
      accent: "amber",
    };
  }

  // 3 — Upcoming provider check-in
  if (
    input.treatment?.nextCheckInDaysAway !== null &&
    input.treatment?.nextCheckInDaysAway !== undefined &&
    input.treatment.nextCheckInDaysAway <= 2 &&
    input.treatment.nextCheckInDaysAway >= 0
  ) {
    return {
      id: "prep_checkin",
      eyebrow: `Check-in in ${input.treatment.nextCheckInDaysAway}d`,
      title: "Prep notes for your provider",
      sub: "Send anything you want to discuss — side effects, dose, energy — so your provider can pre-read.",
      href: "/dashboard/messages",
      cta: "Message care team",
      icon: Stethoscope,
      accent: "navy",
    };
  }

  // 4 — Engagement: top upsell from the engine (if any are live)
  const topUpsell = input.upsellSuggestions[0];
  if (topUpsell && input.daysInProgram >= 3) {
    return {
      id: `upsell_${topUpsell.id}`,
      eyebrow: "Recommended for you",
      title: topUpsell.headline,
      sub: topUpsell.description,
      href: `/dashboard/shop?product=${topUpsell.productSlug}`,
      cta: `Explore ${topUpsell.productName}`,
      icon: Sparkles,
      accent: "gold",
    };
  }

  // 5 — Nutrition
  if (!input.onboarding.hasViewedMeals) {
    return {
      id: "browse_meals",
      eyebrow: "Nutrition matters most",
      title: "Browse this week's meal plan",
      sub: "GLP-1 works best with 100g+ protein/day. Your plans are tailored for that.",
      href: "/dashboard/meals",
      cta: "See meal plan",
      icon: Utensils,
      accent: "emerald",
    };
  }

  // 6 — Referral nudge
  if (input.referralsSent === 0 && input.daysInProgram >= 7) {
    return {
      id: "invite_friend",
      eyebrow: "Earn $50",
      title: "Invite a friend — both save",
      sub: "Members who refer in their first month have 40% higher adherence at month 6.",
      href: "/dashboard/referrals",
      cta: "Get my referral link",
      icon: Gift,
      accent: "gold",
    };
  }

  // 7 — Fallback: light check-in
  if (input.stats.logsThisWeek < 3) {
    return {
      id: "weekly_checkin",
      eyebrow: "Keep the streak",
      title: "Log today's check-in",
      sub: "Members who log 3+ times a week lose 2× more weight. Takes 20 seconds.",
      href: "/dashboard/check-in",
      cta: "Log now",
      icon: ClipboardCheck,
      accent: "teal",
    };
  }

  return null;
}

export function NextActionCard({ input }: NextActionCardProps) {
  const action = pickAction(input);
  if (!action) return null;

  const accentMap = {
    teal: "bg-teal text-white",
    gold: "bg-gradient-to-br from-gold to-amber-600 text-white",
    amber: "bg-amber-500 text-white",
    navy: "bg-navy text-white",
    emerald: "bg-emerald-600 text-white",
  } as const;

  return (
    <Card className="overflow-hidden border-teal-100/60 shadow-premium">
      <div className={`px-5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${accentMap[action.accent]}`}>
        Your next move · {action.eyebrow}
      </div>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accentMap[action.accent]}`}
          >
            <action.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-navy">{action.title}</h3>
            <p className="mt-1 text-sm text-graphite-500 leading-relaxed">{action.sub}</p>
            <div className="mt-3 flex items-center gap-2">
              <Link
                href={action.href}
                onClick={() =>
                  track(ANALYTICS_EVENTS.CTA_CLICK, {
                    cta: "next_action",
                    action_id: action.id,
                  })
                }
              >
                <Button size="sm" className="gap-1.5">
                  {action.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Badge variant="secondary" className="text-[10px]">
                1 minute
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
