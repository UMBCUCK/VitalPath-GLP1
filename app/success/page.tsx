"use client";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { UpsellModal } from "@/components/checkout/upsell-modal";
import { ReferralPrompt } from "@/components/checkout/referral-prompt";
import { ProviderPreview } from "@/components/checkout/provider-preview";
import { OnboardingSteps } from "@/components/checkout/onboarding-steps";
import { RequestPhoneCard } from "@/components/checkout/request-phone-card";
import { PushOptInPrompt } from "@/components/dashboard/push-opt-in-prompt";
import { readLpAttribution } from "@/components/shared/lp-attribution-tracker";
import { useSearchParams } from "next/navigation";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Calendar, MessageCircle, BookOpen, ShieldCheck, TrendingUp, Utensils, Mail, Package, ClipboardList, Stethoscope, HeartHandshake, Zap, Sparkles as SparklesIcon } from "lucide-react";
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
  const searchParams = useSearchParams();

  // Track success page view — critical for conversion attribution.
  // Tier 5.8 — enrich with plan slug + selected add-ons + purchase value
  // so GA4/PostHog revenue dashboards populate. Meta CAPI Purchase fires
  // authoritatively from /api/stripe/webhook (amount_total from Stripe).
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Pull everything we know locally without a server round-trip
    let planSlug: string | undefined;
    let addOns: string[] = [];
    let estimatedValue: number | undefined;
    try {
      const funnelRaw = localStorage.getItem("nj-funnel");
      if (funnelRaw) {
        const funnel = JSON.parse(funnelRaw) as {
          recommendedPlan?: string;
          email?: string;
        };
        planSlug = funnel.recommendedPlan;
      }
      const addOnsRaw = localStorage.getItem("nj-qualify-addons");
      if (addOnsRaw) addOns = JSON.parse(addOnsRaw);

      // Rough value estimate from plan slug
      const planValues: Record<string, number> = {
        essential: 297,
        premium: 397,
        complete: 529,
      };
      estimatedValue = planSlug ? planValues[planSlug] : undefined;
    } catch {
      // Non-blocking — telemetry is best-effort
    }

    // Tier 8.8 — enrich conversion event with first-touch LP attribution
    const lpAttr = readLpAttribution();

    track(ANALYTICS_EVENTS.CHECKOUT_COMPLETE, {
      source: "success_page",
      session_id: searchParams?.get("session_id") || undefined,
      plan_slug: planSlug,
      addon_count: addOns.length,
      addons: addOns.join(",") || undefined,
      value: estimatedValue,
      currency: "USD",
      lp_attr_theme: lpAttr?.theme,
      lp_attr_path: lpAttr?.path,
      lp_attr_days_ago: lpAttr
        ? Math.floor((Date.now() - lpAttr.firstSeen) / 86400000)
        : undefined,
    });

    // GA4 ecommerce purchase event (separate from PostHog) — powers GA4 revenue reporting
    if (typeof window !== "undefined" && "gtag" in window && estimatedValue) {
      try {
        (
          window as unknown as {
            gtag: (cmd: string, event: string, params: Record<string, unknown>) => void;
          }
        ).gtag("event", "purchase", {
          transaction_id: searchParams?.get("session_id") || `success-${Date.now()}`,
          value: estimatedValue,
          currency: "USD",
          items: [
            { item_id: planSlug, item_name: planSlug, price: estimatedValue, quantity: 1 },
            ...addOns.map((slug) => ({ item_id: slug, item_name: slug, quantity: 1 })),
          ],
        });
      } catch {
        // ignore
      }
    }

    // Clean up transient funnel state once we've converted
    try {
      localStorage.removeItem("nj-qualify-addons");
      localStorage.removeItem("nj-qualify-expires");
    } catch {
      // ignore
    }
  }, [searchParams]);

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

        {/* Tier 6.8 — Request phone if not already on file
            (rendered early so it's prominent; self-hides if phone exists) */}
        <RequestPhoneCard />

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
              <Link href="/dashboard/settings?tab=addons&upsell=meal-plans" className="inline-block w-full sm:w-auto">
                <Button variant="gold" className="gap-2 w-full sm:w-auto">
                  Add Meal Plans &mdash; $15/mo first month
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-2 text-xs text-graphite-400">
              Regular price $19/mo after first month. Cancel anytime.
            </p>
          </CardContent>
        </Card>

        {/* Tier 3.6 — Peptides / Anti-aging teaser (unlocks at day 30) */}
        <Card className="mt-10 bg-gradient-to-br from-navy to-atlantic text-white border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-teal/20 blur-2xl" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <SparklesIcon className="h-4 w-4 text-gold" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
                Unlocks at day 30
              </span>
            </div>
            <h3 className="text-lg font-bold">
              After your first month — anti-aging &amp; recovery peptides from $89/mo
            </h3>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">
              Once you're stabilized on your GLP-1 protocol, members can add provider-supervised
              peptides like BPC-157 (recovery), NAD+ (energy), Glow Stack (skin/hair), and
              Sermorelin (sleep) — all prescribed, compounded, and shipped from the same
              licensed pharmacy.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: Zap, label: "NAD+", price: "$149" },
                { icon: HeartHandshake, label: "BPC-157", price: "$129" },
                { icon: SparklesIcon, label: "Glow Stack", price: "$89" },
              ].map((p) => (
                <div key={p.label} className="rounded-lg bg-white/10 backdrop-blur px-2 py-2 text-center">
                  <p.icon className="mx-auto h-3.5 w-3.5 text-gold mb-1" />
                  <p className="text-[10px] font-semibold">{p.label}</p>
                  <p className="text-[9px] text-white/70">{p.price}/mo</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-white/60">
              Eligibility and dosing determined by your provider. Available after 30 days on GLP-1 protocol.
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
    {/* Tier 4.4 — Push-notification opt-in (auto-shows 10s after load) */}
    <PushOptInPrompt />
  </MarketingShell>
  );
}
