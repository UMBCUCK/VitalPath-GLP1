"use client";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { UpsellModal } from "@/components/checkout/upsell-modal";
import { ReferralPrompt } from "@/components/checkout/referral-prompt";
import { ProviderPreview } from "@/components/checkout/provider-preview";
import { OnboardingSteps } from "@/components/checkout/onboarding-steps";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Calendar, MessageCircle, BookOpen, ShieldCheck, TrendingUp, Utensils, Mail, Package, ClipboardList, Stethoscope, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function FirstWeekTimeline() {
  const steps = useMemo(() => {
    const today = new Date();
    return [
      {
        label: "Today",
        date: formatShort(today),
        action: "Your provider begins reviewing your health profile",
        Icon: ClipboardList,
        done: true,
      },
      {
        label: "By",
        date: formatShort(addBusinessDays(today, 1)),
        action: "Personalized treatment plan created by your provider",
        Icon: Stethoscope,
        done: false,
      },
      {
        label: "By",
        date: formatShort(addBusinessDays(today, 2)),
        action: "Medication ships from licensed pharmacy — free 2-day delivery",
        Icon: Package,
        done: false,
      },
      {
        label: "By",
        date: formatShort(addBusinessDays(today, 4)),
        action: "Medication arrives — first-dose guide sent to your inbox",
        Icon: HeartHandshake,
        done: false,
      },
      {
        label: "By",
        date: formatShort(addBusinessDays(today, 7)),
        action: "First care-team check-in to review how you're feeling",
        Icon: MessageCircle,
        done: false,
      },
    ];
  }, []);

  return (
    <Card className="mt-10 text-left">
      <CardContent className="p-6">
        <h3 className="text-base font-bold text-navy mb-5">Your first week at a glance</h3>
        <div className="relative space-y-5">
          <div className="absolute left-3.5 top-2 bottom-2 w-px bg-gradient-to-b from-teal via-atlantic/40 to-navy-200" />
          {steps.map((step, i) => (
            <div key={i} className="relative flex gap-4">
              <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${step.done ? "bg-teal" : "bg-navy-100"}`}>
                <step.Icon className={`h-3.5 w-3.5 ${step.done ? "text-white" : "text-graphite-400"}`} />
              </div>
              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-baseline gap-1.5">
                  <span className="text-xs font-bold text-teal">{step.label === "Today" ? "Today" : `${step.label} ${step.date}`}</span>
                  {step.label === "Today" && <span className="text-[10px] text-graphite-400">({step.date})</span>}
                </div>
                <p className="text-sm text-graphite-600 mt-0.5">{step.action}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-graphite-400">
          Dates are business-day estimates. Your provider may complete the review sooner.
        </p>
      </CardContent>
    </Card>
  );
}

export default function SuccessPage() {
  const [showUpsell, setShowUpsell] = useState(false);

  // Track success page view — critical for conversion attribution
  useEffect(() => {
    track(ANALYTICS_EVENTS.CHECKOUT_COMPLETE, { source: "success_page" });
  }, []);

  // Delay upsell 3.5s so the user absorbs the success moment first
  useEffect(() => {
    const timer = setTimeout(() => setShowUpsell(true), 3500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <MarketingShell><section className="min-h-[80vh] bg-gradient-to-b from-cloud to-sage/20 py-16">
      <SectionShell className="max-w-2xl text-center">
        {/* Success icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal to-atlantic shadow-glow">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>

        <h1 className="mt-8 text-3xl font-bold text-navy sm:text-4xl">
          Welcome to Nature's Journey
        </h1>

        <p className="mt-4 text-lg text-graphite-500">
          Your membership is active. Here&apos;s what happens next.
        </p>

        {/* Email confirmation notice */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/60 px-5 py-3.5 text-left">
          <Mail className="h-5 w-5 shrink-0 text-teal" />
          <div>
            <p className="text-sm font-semibold text-navy">Check your inbox</p>
            <p className="text-xs text-graphite-500 mt-0.5">We sent your order confirmation and welcome guide. Check spam if you don&apos;t see it within 5 minutes.</p>
          </div>
        </div>

        {/* Guarantee reassurance */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-emerald-700">
            Protected by our 30-day money-back guarantee
          </span>
        </div>

        {/* What happens next — onboarding timeline */}
        <Card className="mt-10 text-left">
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-lg font-bold text-navy mb-6">What happens next</h3>
            <OnboardingSteps />
          </CardContent>
        </Card>

        {/* Your provider */}
        <div className="mt-6 text-left">
          <ProviderPreview />
        </div>

        {/* What your first week looks like — reduces anxiety, increases activation */}
        <FirstWeekTimeline />

        {/* Activation CTAs — drive immediate engagement */}
        <Card className="mt-10 text-left">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-navy mb-1">Get started while you wait</h3>
            <p className="text-xs text-graphite-400 mb-4">Members who complete these in day 1 see 2x better results</p>
            <div className="space-y-3">
              <Link href="/dashboard/progress" className="flex items-center gap-3 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-teal group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-teal group-hover:text-white transition-colors">
                  <TrendingUp className="h-5 w-5 text-teal group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-navy">Log your starting weight</p>
                  <p className="text-xs text-graphite-400">Track your baseline for accurate progress</p>
                </div>
                <ArrowRight className="h-4 w-4 text-graphite-300" />
              </Link>
              <Link href="/dashboard/messages" className="flex items-center gap-3 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-teal group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-teal group-hover:text-white transition-colors">
                  <MessageCircle className="h-5 w-5 text-teal group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-navy">Introduce yourself to your care team</p>
                  <p className="text-xs text-graphite-400">They respond within 4 hours on average</p>
                </div>
                <ArrowRight className="h-4 w-4 text-graphite-300" />
              </Link>
              <Link href="/dashboard/meals" className="flex items-center gap-3 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-teal group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 group-hover:bg-teal group-hover:text-white transition-colors">
                  <Utensils className="h-5 w-5 text-teal group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-navy">Browse this week&apos;s meal plan</p>
                  <p className="text-xs text-graphite-400">High-protein recipes designed for GLP-1</p>
                </div>
                <ArrowRight className="h-4 w-4 text-graphite-300" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Post-purchase offer teaser */}
        <Card className="mt-10 bg-gradient-to-r from-gold-50 to-linen border-gold-200">
          <CardContent className="p-6">
            <Badge variant="gold" className="mb-3">Member Exclusive</Badge>
            <h3 className="text-base font-bold text-navy">
              Add nutrition support to your plan
            </h3>
            <p className="mt-2 text-sm text-graphite-500">
              Members who add meal plans and recipes to their program report higher satisfaction
              with the program. Add it now and get your first month at 20% off.
            </p>
            <div className="mt-4">
              <Button variant="gold" className="gap-2">
                Add Meal Plans &mdash; $15/mo first month
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-[10px] text-graphite-300">
              Regular price $19/mo after first month. Cancel anytime.
            </p>
          </CardContent>
        </Card>

        {/* Referral prompt — viral growth lever */}
        <div className="mt-10">
          <ReferralPrompt />
        </div>

        <div className="mt-8">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Go to Your Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionShell>
    </section>
    <UpsellModal show={showUpsell} onClose={() => setShowUpsell(false)} />
  </MarketingShell>
  );
}
