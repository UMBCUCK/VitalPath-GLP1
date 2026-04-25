"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { UpsellCards } from "@/components/dashboard/upsell-cards";
import { MilestoneShare } from "@/components/dashboard/milestone-share";
import { AnnualNudge } from "@/components/dashboard/annual-nudge";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { StreakTierUpModal } from "@/components/dashboard/streak-tier-up-modal";
import { NextActionCard } from "@/components/dashboard/next-action-card";
import { DaysToGoalChip } from "@/components/dashboard/days-to-goal-chip";
import { OpenLoopConnectPrompt } from "@/components/dashboard/openloop-connect-prompt";
import { WeeklyCelebration } from "@/components/dashboard/weekly-celebration";
import { MilestoneBadges } from "@/components/dashboard/milestone-badges";
import { BehavioralInsights } from "@/components/dashboard/behavioral-insights";
import { ReferralTierProgress } from "@/components/dashboard/referral-tier-progress";
import { CohortChallenge } from "@/components/dashboard/cohort-challenge";
import { ResellerPromoModal } from "@/components/dashboard/reseller-promo-modal";
import { OrderTrackingWidget } from "@/components/dashboard/order-tracking-widget";
import { ReferralCalloutBanner } from "@/components/dashboard/referral-callout-banner";
import {
  TrendingDown, Droplets, Target, Calendar, ArrowRight,
  Utensils, Camera, MessageCircle, ChevronRight, Pill, Scale, Bell, Calculator,
} from "lucide-react";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date | string;
}

interface WeeklyProgress {
  thisWeek: number | null;
  lastWeek: number | null;
  change: number | null;
}

interface DashboardData {
  user: { id: string; firstName: string | null; lastName: string | null; email: string } | null;
  subscription: { planName: string; status: string; currentPeriodEnd: Date | null } | null;
  stats: {
    startWeight: number; currentWeight: number; goalWeight: number;
    weightLost: number; monthNumber: number; streakDays: number; logsThisWeek: number; proteinDaysHit: number; waterDaysHit: number;
    todayProtein: number; todayWater: number; proteinTarget: number; waterTarget: number;
  };
  weightChartData: Array<{ date: string; weight: number | null }>;
  notifications: Array<{ id: string; type: string; title: string; body: string | null; link: string | null }>;
  referralCode: { code: string; totalReferred: number; totalEarned: number } | null;
  onboarding: { hasProfile: boolean; hasIntake: boolean; hasGoalWeight: boolean; hasFirstWeight: boolean; hasViewedMeals: boolean };
  upsellSuggestions: Array<{ id: string; productSlug: string; productName: string; headline: string; description: string; discountPct?: number; priority: number }>;
  treatment: {
    medicationName: string | null;
    medicationDose: string | null;
    status: string | null;
    nextRefillDaysAway: number | null;
    nextRefillLabel: string | null;
    shipmentStep: number;
  } | null;
}

interface DashboardClientProps {
  data: DashboardData;
  streak: number;
  badges: BadgeData[];
  weeklyProgress: WeeklyProgress;
}

export function DashboardClient({ data, streak, badges, weeklyProgress }: DashboardClientProps) {
  const { user, subscription, stats, notifications, referralCode } = data;
  const name = user?.firstName || "there";
  const weightProgress = stats.goalWeight > 0 && stats.startWeight > stats.goalWeight
    ? (stats.weightLost / (stats.startWeight - stats.goalWeight)) * 100
    : 0;

  const [resellerOpen, setResellerOpen] = useState(false);

  // Auto-show reseller modal once ever, but only on 2nd+ dashboard visit and after 30s
  useEffect(() => {
    const shownKey = "reseller-modal-shown-v1";
    const visitKey = "dashboard-visit-count";

    // Increment and persist visit count
    const visitCount = parseInt(localStorage.getItem(visitKey) || "0") + 1;
    localStorage.setItem(visitKey, String(visitCount));

    // Only show on second or later visit, and only once ever
    if (visitCount >= 2 && !localStorage.getItem(shownKey)) {
      const t = setTimeout(() => {
        setResellerOpen(true);
        localStorage.setItem(shownKey, "1");
      }, 30000);
      return () => clearTimeout(t);
    }
  }, []);

  const quickActions = [
    { label: "Log Weight", icon: Scale, href: "/dashboard/progress", color: "from-teal-50 to-sage" },
    { label: "Log Meals", icon: Utensils, href: "/dashboard/meals", color: "from-gold-50 to-linen" },
    { label: "Add Photo", icon: Camera, href: "/dashboard/photos", color: "from-atlantic/5 to-navy-50" },
    { label: "Messages", icon: MessageCircle, href: "/dashboard/messages", color: "from-blue-50 to-teal-50" },
  ];

  // Empty state — no subscription
  if (!subscription) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-teal-50 to-sage p-8 text-center">
          <h2 className="text-2xl font-bold text-navy">Welcome, {name}!</h2>
          <p className="mt-3 text-graphite-500 max-w-md mx-auto">
            Complete your intake and choose a plan to start your weight management journey.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/qualify"><Button className="gap-2">Complete Intake <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/pricing"><Button variant="outline">View Plans</Button></Link>
          </div>
        </div>
        <OnboardingChecklist hasProfile={data.onboarding.hasProfile} hasIntake={data.onboarding.hasIntake} hasGoalWeight={data.onboarding.hasGoalWeight} hasFirstWeight={data.onboarding.hasFirstWeight} hasViewedMeals={data.onboarding.hasViewedMeals} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.label} href={a.href} className="flex flex-col items-center gap-2 rounded-2xl border border-navy-100/60 bg-white p-4 shadow-premium opacity-50 pointer-events-none">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${a.color}`}><a.icon className="h-5 w-5 text-teal" /></div>
              <span className="text-xs font-medium text-navy">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Tier 7.4 — fires at most once per milestone tier per user */}
      <StreakTierUpModal streak={streak} userEmail={data.user?.email} />

      {/* Reseller modal */}
      <ResellerPromoModal
        open={resellerOpen}
        onClose={() => setResellerOpen(false)}
        currentReferrals={referralCode?.totalReferred || 0}
      />

      <div className="space-y-6">
        {/* Tier 13.6 — Connect-to-OpenLoop prompt for orphaned accounts.
            Renders nothing if the member is already linked. */}
        <OpenLoopConnectPrompt />

        {/* Tier 10.2 — Personalized "next action" — picks the single most
            valuable thing the member should do right now based on their
            state (onboarding, refill, provider check-in, upsell, referral). */}
        <NextActionCard
          input={{
            onboarding: {
              hasFirstWeight: data.onboarding.hasFirstWeight,
              hasViewedMeals: data.onboarding.hasViewedMeals,
            },
            treatment: data.treatment
              ? {
                  nextRefillDaysAway: data.treatment.nextRefillDaysAway,
                  nextCheckInDaysAway:
                    (data.treatment as { nextCheckInDaysAway?: number | null })
                      .nextCheckInDaysAway ?? null,
                }
              : null,
            upsellSuggestions: data.upsellSuggestions,
            referralsSent: data.referralCode?.totalReferred ?? 0,
            daysInProgram: stats.monthNumber * 30,
            stats: { logsThisWeek: stats.logsThisWeek },
          }}
        />

        {/* Onboarding checklist — shows for new users */}
        <OnboardingChecklist
          hasProfile={data.onboarding.hasProfile}
          hasIntake={data.onboarding.hasIntake}
          hasGoalWeight={data.onboarding.hasGoalWeight}
          hasFirstWeight={data.onboarding.hasFirstWeight}
          hasViewedMeals={data.onboarding.hasViewedMeals}
        />

        {/* Welcome banner — WCAG AA contrast on text/numbers over the navy gradient */}
        <div className="rounded-2xl bg-gradient-to-r from-navy to-atlantic p-5 sm:p-6 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <p className="text-xs sm:text-sm font-medium text-white/80">Month {stats.monthNumber} of your journey</p>
                <StreakCounter streak={streak} />
              </div>
              <h2 className="mt-1.5 text-xl sm:text-2xl font-bold leading-tight">Welcome back, {name}</h2>
              {stats.weightLost > 0 && (
                <p className="mt-2 text-sm font-medium text-white/90">
                  <span className="text-gold-300 font-bold">{Math.round(stats.weightLost * 10) / 10} lbs</span> lost — keep building momentum.
                </p>
              )}
            </div>
            <Badge variant="gold" className="shrink-0">{subscription.planName}</Badge>
          </div>

          {stats.goalWeight > 0 && stats.startWeight > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium text-white/80">
                <span>Start <span className="font-semibold text-white">{Math.round(stats.startWeight)} lbs</span></span>
                <span>Goal <span className="font-semibold text-gold-300">{stats.goalWeight} lbs</span></span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-gold-300 to-gold transition-all duration-700" style={{ width: `${Math.min(100, Math.max(0, weightProgress))}%` }} />
              </div>
              <p className="mt-2.5 text-center text-sm font-semibold text-white">
                {Math.round(Math.max(0, weightProgress))}% there
                {stats.goalWeight < stats.currentWeight && (
                  <span className="ml-1.5 font-normal text-white/80">· {Math.round(stats.currentWeight - stats.goalWeight)} lbs to go</span>
                )}
              </p>

              {/* Tier 11.4 — projected days-to-goal chip based on rolling 14d weight loss rate */}
              <div className="mt-3 flex justify-center">
                <DaysToGoalChip
                  currentWeight={stats.currentWeight}
                  goalWeight={stats.goalWeight}
                  recentEntries={data.weightChartData}
                />
              </div>
            </div>
          )}
        </div>

        {/* Always-visible referral callout */}
        {referralCode && (
          <ReferralCalloutBanner
            totalReferred={referralCode.totalReferred}
            totalEarned={referralCode.totalEarned}
            referralCode={referralCode.code}
            onOpenReseller={() => setResellerOpen(true)}
          />
        )}

        {/* Weekly celebration */}
        <WeeklyCelebration weeklyProgress={weeklyProgress} />

        {/* Annual upgrade nudge */}
        {subscription && subscription.planName !== "Complete" && (
          <AnnualNudge planName={subscription.planName} monthlyPrice={stats.startWeight > 0 ? 39700 : 29700} monthNumber={stats.monthNumber} />
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="group flex flex-col items-center gap-2 rounded-2xl border border-navy-100/60 bg-white p-4 shadow-premium transition-all hover:shadow-premium-md hover:-translate-y-0.5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color}`}><action.icon className="h-5 w-5 text-teal" /></div>
              <span className="text-xs font-medium text-navy">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Behavioral Insights */}
        <BehavioralInsights
          streak={streak}
          logsThisWeek={Math.min(7, stats.logsThisWeek)}
          weightTrend={weeklyProgress.change !== null ? (weeklyProgress.change < 0 ? "down" : weeklyProgress.change > 0 ? "up" : "flat") : "flat"}
          proteinDaysHit={Math.min(7, stats.proteinDaysHit)}
          waterDaysHit={Math.min(7, stats.waterDaysHit)}
        />

        {/* My Health Numbers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-4 w-4 text-teal" /> My Health Numbers
              </CardTitle>
              <Link href="/calculators/complete">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  Update <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-gradient-to-br from-teal-50 to-sage p-3 text-center">
                <Scale className="mx-auto h-4 w-4 text-teal mb-1" />
                <p className="text-lg font-bold text-navy">
                  {stats.currentWeight > 0 ? (((stats.currentWeight / ((stats.startWeight > 60 ? Math.round(Math.sqrt(stats.startWeight * 703 / 25) * 12) : 68) ** 2)) * 703).toFixed(1)) : "\u2014"}
                </p>
                <p className="text-[10px] text-graphite-400">BMI</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-gold-50 to-linen p-3 text-center">
                <Target className="mx-auto h-4 w-4 text-gold-600 mb-1" />
                <p className="text-lg font-bold text-navy">{stats.proteinTarget || "\u2014"}g</p>
                <p className="text-[10px] text-graphite-400">Protein goal</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-3 text-center">
                <Droplets className="mx-auto h-4 w-4 text-blue-500 mb-1" />
                <p className="text-lg font-bold text-navy">{stats.waterTarget || "\u2014"}oz</p>
                <p className="text-[10px] text-graphite-400">Water goal</p>
              </div>
              <Link href="/calculators/complete" className="rounded-xl bg-gradient-to-br from-navy-50 to-sage/30 p-3 text-center hover:shadow-sm transition-shadow">
                <Calculator className="mx-auto h-4 w-4 text-atlantic mb-1" />
                <p className="text-sm font-semibold text-teal">Calculate</p>
                <p className="text-[10px] text-graphite-400">All numbers</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Tracking + notifications grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Daily tracking */}
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Today&apos;s Tracking</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-gradient-to-br from-teal-50 to-sage p-4">
                  <div className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-teal" /><span className="text-xs font-medium text-teal-700">Weight</span></div>
                  <p className="mt-2 text-3xl font-bold text-navy">{stats.currentWeight > 0 ? Math.round(stats.currentWeight) : "\u2014"}</p>
                  <p className="text-xs text-graphite-400">{stats.weightLost > 0 ? `down ${Math.round(stats.weightLost)} lbs` : "lbs"}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-gold-50 to-linen p-4">
                  <div className="flex items-center gap-2"><Target className="h-4 w-4 text-gold-600" /><span className="text-xs font-medium text-gold-700">Protein</span></div>
                  <p className="mt-2 text-3xl font-bold text-navy">{stats.todayProtein || "\u2014"}g</p>
                  <p className="text-xs text-graphite-400">of {stats.proteinTarget}g goal</p>
                  {stats.todayProtein > 0 && <Progress value={(stats.todayProtein / stats.proteinTarget) * 100} className="mt-2 h-1.5" />}
                </div>
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-4">
                  <div className="flex items-center gap-2"><Droplets className="h-4 w-4 text-blue-500" /><span className="text-xs font-medium text-blue-600">Water</span></div>
                  <p className="mt-2 text-3xl font-bold text-navy">{stats.todayWater || "\u2014"}oz</p>
                  <p className="text-xs text-graphite-400">of {stats.waterTarget}oz goal</p>
                  {stats.todayWater > 0 && <Progress value={(stats.todayWater / stats.waterTarget) * 100} className="mt-2 h-1.5" />}
                </div>
              </div>
              {stats.streakDays > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-xl bg-navy-50/50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">&#128293;</span>
                    <div><p className="text-sm font-medium text-navy">{stats.streakDays}-day tracking streak</p></div>
                  </div>
                  <Link href="/dashboard/progress"><Button variant="ghost" size="sm">Log Today</Button></Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-teal" /> Updates</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {notifications.length === 0 ? (
                <p className="py-4 text-center text-sm text-graphite-300">No new notifications</p>
              ) : (
                notifications.slice(0, 4).map((n) => (
                  <Link key={n.id} href={n.link || "#"} className="flex items-start gap-3 rounded-xl bg-navy-50/50 p-3 hover:bg-navy-50 transition-colors">
                    <Bell className="mt-0.5 h-4 w-4 text-teal shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-navy">{n.title}</p>
                      {n.body && <p className="text-xs text-graphite-400 line-clamp-2">{n.body}</p>}
                    </div>
                  </Link>
                ))
              )}
              <Link href="/dashboard/progress" className="flex items-center justify-between rounded-xl bg-white border border-navy-100/40 p-3 hover:bg-navy-50/30 transition-colors">
                <span className="text-sm font-medium text-navy">View Full Progress</span>
                <ChevronRight className="h-4 w-4 text-graphite-400" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Order tracking */}
        {data.treatment && (
          <OrderTrackingWidget
            medicationName={data.treatment.medicationName}
            medicationDose={data.treatment.medicationDose}
            status={data.treatment.status}
            nextRefillDaysAway={data.treatment.nextRefillDaysAway}
            nextRefillLabel={data.treatment.nextRefillLabel}
            shipmentStep={data.treatment.shipmentStep}
          />
        )}

        {/* Monthly Challenges */}
        <CohortChallenge />

        {/* Achievement badges */}
        {badges.length > 0 && <MilestoneBadges badges={badges} />}

        {/* Smart upsell suggestions */}
        {data.upsellSuggestions.length > 0 && <UpsellCards suggestions={data.upsellSuggestions} />}

        {/* Milestone share */}
        {stats.weightLost >= 5 && (
          <MilestoneShare weightLost={Math.round(stats.weightLost)} daysOnProgram={stats.monthNumber * 30} streakDays={stats.streakDays} />
        )}

        {/* Referral Tier Progress — always at bottom */}
        <ReferralTierProgress
          totalReferred={referralCode?.totalReferred || 0}
          totalEarned={referralCode?.totalEarned || 0}
        />
      </div>
    </>
  );
}
