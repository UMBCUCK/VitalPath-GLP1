"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { UpsellCards } from "@/components/dashboard/upsell-cards";
import { MilestoneShare } from "@/components/dashboard/milestone-share";
import { AnnualNudge } from "@/components/dashboard/annual-nudge";
import {
  TrendingDown, Droplets, Target, Package, Calendar, ArrowRight,
  Utensils, Camera, MessageCircle, Gift, ChevronRight, Pill, Scale, Bell, Calculator,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface DashboardData {
  user: { id: string; firstName: string | null; lastName: string | null; email: string } | null;
  subscription: { planName: string; status: string; currentPeriodEnd: Date | null } | null;
  stats: {
    startWeight: number; currentWeight: number; goalWeight: number;
    weightLost: number; monthNumber: number; streakDays: number;
    todayProtein: number; todayWater: number; proteinTarget: number; waterTarget: number;
  };
  weightChartData: Array<{ date: string; weight: number | null }>;
  notifications: Array<{ id: string; type: string; title: string; body: string | null; link: string | null }>;
  referralCode: { code: string; totalReferred: number; totalEarned: number } | null;
  onboarding: { hasProfile: boolean; hasIntake: boolean; hasGoalWeight: boolean; hasFirstWeight: boolean; hasViewedMeals: boolean };
  upsellSuggestions: Array<{ id: string; productSlug: string; productName: string; headline: string; description: string; discountPct?: number; priority: number }>;
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const { user, subscription, stats, notifications, referralCode } = data;
  const name = user?.firstName || "there";
  const weightProgress = stats.goalWeight > 0 && stats.startWeight > stats.goalWeight
    ? (stats.weightLost / (stats.startWeight - stats.goalWeight)) * 100
    : 0;

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
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-navy to-atlantic p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-navy-300">Month {stats.monthNumber} of your journey</p>
            <h2 className="mt-1 text-2xl font-bold">Welcome back, {name}</h2>
            {stats.weightLost > 0 && (
              <p className="mt-2 text-sm text-navy-300">
                You&apos;ve lost {Math.round(stats.weightLost * 10) / 10} lbs so far. Keep building momentum.
              </p>
            )}
          </div>
          <Badge variant="gold" className="shrink-0">{subscription.planName}</Badge>
        </div>

        {stats.goalWeight > 0 && stats.startWeight > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs">
              <span>Start: {Math.round(stats.startWeight)} lbs</span>
              <span>Goal: {stats.goalWeight} lbs</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/20">
              <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-400 transition-all duration-700" style={{ width: `${Math.min(100, Math.max(0, weightProgress))}%` }} />
            </div>
            <p className="mt-2 text-center text-xs text-navy-300">
              {Math.round(Math.max(0, weightProgress))}% toward your goal
              {stats.goalWeight < stats.currentWeight && ` · ${Math.round(stats.currentWeight - stats.goalWeight)} lbs to go`}
            </p>
          </div>
        )}
      </div>

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
                {stats.currentWeight > 0 ? (((stats.currentWeight / ((stats.startWeight > 60 ? Math.round(Math.sqrt(stats.startWeight * 703 / 25) * 12) : 68) ** 2)) * 703).toFixed(1)) : "—"}
              </p>
              <p className="text-[10px] text-graphite-400">BMI</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-gold-50 to-linen p-3 text-center">
              <Target className="mx-auto h-4 w-4 text-gold-600 mb-1" />
              <p className="text-lg font-bold text-navy">{stats.proteinTarget || "—"}g</p>
              <p className="text-[10px] text-graphite-400">Protein goal</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-3 text-center">
              <Droplets className="mx-auto h-4 w-4 text-blue-500 mb-1" />
              <p className="text-lg font-bold text-navy">{stats.waterTarget || "—"}oz</p>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Daily tracking */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Today&apos;s Tracking</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-teal-50 to-sage p-4">
                <div className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-teal" /><span className="text-xs font-medium text-teal-700">Weight</span></div>
                <p className="mt-2 text-3xl font-bold text-navy">{stats.currentWeight > 0 ? Math.round(stats.currentWeight) : "—"}</p>
                <p className="text-xs text-graphite-400">{stats.weightLost > 0 ? `down ${Math.round(stats.weightLost)} lbs` : "lbs"}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-gold-50 to-linen p-4">
                <div className="flex items-center gap-2"><Target className="h-4 w-4 text-gold-600" /><span className="text-xs font-medium text-gold-700">Protein</span></div>
                <p className="mt-2 text-3xl font-bold text-navy">{stats.todayProtein || "—"}g</p>
                <p className="text-xs text-graphite-400">of {stats.proteinTarget}g goal</p>
                {stats.todayProtein > 0 && <Progress value={(stats.todayProtein / stats.proteinTarget) * 100} className="mt-2 h-1.5" />}
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 p-4">
                <div className="flex items-center gap-2"><Droplets className="h-4 w-4 text-blue-500" /><span className="text-xs font-medium text-blue-600">Water</span></div>
                <p className="mt-2 text-3xl font-bold text-navy">{stats.todayWater || "—"}oz</p>
                <p className="text-xs text-graphite-400">of {stats.waterTarget}oz goal</p>
                {stats.todayWater > 0 && <Progress value={(stats.todayWater / stats.waterTarget) * 100} className="mt-2 h-1.5" />}
              </div>
            </div>
            {stats.streakDays > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-navy-50/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <div><p className="text-sm font-medium text-navy">{stats.streakDays}-day tracking streak</p></div>
                </div>
                <Link href="/dashboard/progress"><Button variant="ghost" size="sm">Log Today</Button></Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications + upcoming */}
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

      {/* Smart upsell suggestions */}
      {data.upsellSuggestions.length > 0 && <UpsellCards suggestions={data.upsellSuggestions} />}

      {/* Milestone share */}
      {stats.weightLost >= 5 && (
        <MilestoneShare weightLost={Math.round(stats.weightLost)} daysOnProgram={stats.monthNumber * 30} streakDays={stats.streakDays} />
      )}

      {/* Referral CTA */}
      <Card className="bg-gradient-to-r from-teal-50 to-sage border-teal-100">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-premium"><Gift className="h-6 w-6 text-teal" /></div>
            <div>
              <p className="text-base font-bold text-navy">Share Nature's Journey, earn credit</p>
              <p className="text-sm text-graphite-500">
                {referralCode ? `${referralCode.totalReferred} referrals · ${formatPrice(referralCode.totalEarned)} earned` : "Get $50 for every friend who subscribes"}
              </p>
            </div>
          </div>
          <Link href="/dashboard/referrals"><Button variant="default" className="gap-2">Referrals <ArrowRight className="h-4 w-4" /></Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}
