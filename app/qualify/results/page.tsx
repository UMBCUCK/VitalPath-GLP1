"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Star, Shield, Clock, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { plans } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function QualifyResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal border-t-transparent" />
      </div>
    }>
      <QualifyResultsContent />
    </Suspense>
  );
}

function QualifyResultsContent() {
  const searchParams = useSearchParams();
  const recommended = searchParams.get("plan") || "premium";
  const currentWeight = parseInt(searchParams.get("weight") || "200");
  const projectedWeight = parseInt(searchParams.get("projected") || String(Math.round(currentWeight * 0.8)));
  const plan = plans.find((p) => p.slug === recommended) || plans[1];

  const totalLoss = currentWeight - projectedWeight;

  // Target date estimate (based on ~6 lbs/month)
  const monthsToGoal = Math.max(3, Math.round(totalLoss / 6));
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + monthsToGoal);
  const targetMonth = targetDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    track(ANALYTICS_EVENTS.QUALIFY_COMPLETE, { recommendedPlan: recommended });
    const timer = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(timer);
  }, [recommended]);

  if (!revealed) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cloud to-white">
        <SectionShell className="max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
            <Check className="h-10 w-10 text-teal animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-navy">Finalizing your plan...</h1>
        </SectionShell>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-cloud to-white py-12">
      <SectionShell className="max-w-3xl">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 animate-fade-in-up">
            <Check className="h-8 w-8 text-teal" />
          </div>
          <h1 className="text-3xl font-bold text-navy animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            You&apos;re in! Your intake has been submitted.
          </h1>
          <p className="mt-2 text-lg text-graphite-500 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            A licensed provider will review your health profile within 24 hours.
          </p>
        </div>

        {/* Recommended plan card */}
        <div className="animate-fade-in-up rounded-3xl border-2 border-teal bg-white p-8 shadow-glow sm:p-10" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="gold" className="text-sm shadow-gold-glow">Recommended for you</Badge>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-navy">{plan.name} Plan</h2>
          <p className="mt-2 text-base text-graphite-500">{plan.description}</p>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-5xl font-bold text-navy">{formatPrice(plan.priceMonthly)}</span>
            <span className="text-lg text-graphite-400">/month</span>
            <span className="ml-2 text-sm text-graphite-300 line-through">$1,349/mo retail</span>
          </div>
          <p className="mt-1 text-sm text-teal font-semibold">
            Save {Math.round((1 - plan.priceMonthly / 134900) * 100)}% vs brand-name pricing
          </p>

          {/* Projection summary */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-navy to-atlantic p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">Your personalized projection</p>
            <p className="mt-2 text-2xl font-bold sm:text-3xl">
              You could reach ~{projectedWeight} lbs by {targetMonth}
            </p>
            <p className="mt-1 text-sm text-navy-300">
              That&apos;s approximately {totalLoss} lbs based on your health profile and clinical data
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <p className="text-xl font-bold">{currentWeight}</p>
                <p className="text-[10px] text-navy-300">Current</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <p className="text-xl font-bold text-teal-300">-{totalLoss}</p>
                <p className="text-[10px] text-navy-300">Projected loss</p>
              </div>
              <div className="rounded-xl bg-teal/30 p-3 text-center">
                <p className="text-xl font-bold text-teal-200">{projectedWeight}</p>
                <p className="text-[10px] text-teal-300">Goal weight</p>
              </div>
            </div>
          </div>

          {/* Why medication matters */}
          <div className="mt-5 rounded-xl bg-navy-50/50 p-4">
            <p className="text-xs font-semibold text-navy mb-3">Why GLP-1 medication makes the difference</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white p-2.5">
                <p className="text-[10px] text-graphite-400">Diet &amp; Exercise</p>
                <p className="text-sm font-bold text-graphite-400">~{Math.round(currentWeight * 0.05)} lbs</p>
              </div>
              <div className="rounded-lg bg-white p-2.5">
                <p className="text-[10px] text-graphite-500">GLP-1 Only</p>
                <p className="text-sm font-bold text-navy">~{Math.round(currentWeight * 0.15)} lbs</p>
              </div>
              <div className="rounded-lg bg-teal-50 border border-teal-100 p-2.5">
                <p className="text-[10px] text-teal-600">GLP-1 + VitalPath</p>
                <p className="text-sm font-bold text-teal">~{totalLoss} lbs</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-navy mb-3">What&apos;s included:</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-teal" />
                  <span className="text-sm text-graphite-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/checkout?plan=${plan.slug}`} className="flex-1">
              <Button size="xl" className="w-full gap-2 text-lg h-14 rounded-2xl shadow-glow hover:shadow-premium-lg transition-all hover:scale-[1.01]">
                Start My {plan.name} Plan
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="xl" className="h-14 rounded-2xl">
                Compare All Plans
              </Button>
            </Link>
          </div>

          {/* What happens next */}
          <div className="mt-6 rounded-xl bg-navy-50/50 p-5">
            <p className="text-sm font-semibold text-navy mb-3">What happens next</p>
            <div className="space-y-3">
              {[
                { step: "1", label: "Provider reviews your health profile", time: "Within 24 hours" },
                { step: "2", label: "Personalized treatment plan created", time: "Day 1-2" },
                { step: "3", label: "Medication ships with free 2-day shipping", time: "Day 2-3" },
                { step: "4", label: "First check-in with your care team", time: "Day 7" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal">{item.step}</span>
                  <div className="flex-1">
                    <p className="text-sm text-navy font-medium">{item.label}</p>
                    <p className="text-xs text-graphite-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-graphite-400">
            Cancel anytime &middot; No hidden fees &middot; Treatment eligibility confirmed by your provider
          </p>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-graphite-400">
          <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-teal" /> HIPAA Compliant</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal" /> Licensed Providers</span>
          <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal" /> Free 2-Day Shipping</span>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-xs text-graphite-300">
          {siteConfig.compliance.eligibilityDisclaimer}
        </p>
      </SectionShell>
    </section>
  );
}
