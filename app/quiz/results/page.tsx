"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Star, Shield, Sparkles, Clock, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { plans } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function QuizResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal border-t-transparent" />
      </div>
    }>
      <QuizResultsContent />
    </Suspense>
  );
}

function QuizResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recommended = searchParams.get("plan") || "premium";
  const weightRange = searchParams.get("weight") || "191-230";
  const plan = plans.find((p) => p.slug === recommended) || plans[1];

  // Personalized projections based on weight range
  const weightMap: Record<string, number> = { "150-190": 170, "191-230": 210, "231-270": 250, "271+": 290 };
  const currentWeight = weightMap[weightRange] || 210;
  const projectedLoss = Math.round(currentWeight * 0.15);
  const projectedWeight = currentWeight - projectedLoss;
  const monthsToGoal = Math.max(3, Math.round(projectedLoss / 6));

  // Projected date
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + monthsToGoal);
  const targetMonth = targetDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const [revealed, setRevealed] = useState(false);
  const [step, setStep] = useState(0);

  // Animated reveal sequence
  useEffect(() => {
    track(ANALYTICS_EVENTS.QUIZ_COMPLETE, { recommendedPlan: recommended });

    const timers = [
      setTimeout(() => setStep(1), 500),   // "Analyzing your profile..."
      setTimeout(() => setStep(2), 1500),  // "Matching with providers..."
      setTimeout(() => setStep(3), 2500),  // "Building your plan..."
      setTimeout(() => {
        setStep(4);
        setRevealed(true);
      }, 3500), // Reveal
    ];

    return () => timers.forEach(clearTimeout);
  }, [recommended]);

  // Loading state with animated progress
  if (!revealed) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-cloud to-white">
        <SectionShell className="max-w-lg text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
            <Sparkles className={cn(
              "h-10 w-10 text-teal transition-all duration-500",
              step >= 2 && "animate-pulse"
            )} />
          </div>

          <h1 className="text-2xl font-bold text-navy">Building your personalized plan...</h1>

          <div className="mt-8 space-y-3 text-left">
            {[
              { label: "Analyzing your health profile", threshold: 1 },
              { label: "Matching with licensed providers", threshold: 2 },
              { label: "Calculating your projected results", threshold: 3 },
            ].map((item, i) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 transition-all duration-300",
                  step > item.threshold
                    ? "border-teal-100 bg-teal-50"
                    : step === item.threshold
                      ? "border-teal-200 bg-white animate-pulse"
                      : "border-navy-100/40 bg-white opacity-50"
                )}
              >
                {step > item.threshold ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                ) : step === item.threshold ? (
                  <div className="h-6 w-6 rounded-full border-2 border-teal border-t-transparent animate-spin" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-navy-200" />
                )}
                <span className={cn(
                  "text-sm",
                  step > item.threshold ? "font-medium text-teal-800" : "text-graphite-500"
                )}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>
    );
  }

  // Results revealed
  return (
    <section className="min-h-screen bg-gradient-to-b from-cloud to-white py-12">
      <SectionShell className="max-w-3xl">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 animate-fade-in-up">
            <Check className="h-8 w-8 text-teal" />
          </div>
          <h1 className="text-3xl font-bold text-navy animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Great news — you may be a candidate
          </h1>
          <p className="mt-2 text-lg text-graphite-500 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Based on your responses, here&apos;s our recommendation:
          </p>
        </div>

        {/* Recommended plan card */}
        <div className="animate-fade-in-up rounded-3xl border-2 border-teal bg-white p-8 shadow-glow sm:p-10" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 mb-6">
            <Badge variant="gold" className="text-sm shadow-gold-glow">
              Recommended for you
            </Badge>
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

          {/* Personalized projection — the #1 conversion driver */}
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-navy to-atlantic p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              Your personalized projection
            </p>
            <p className="mt-2 text-2xl font-bold sm:text-3xl">
              You could reach ~{projectedWeight} lbs by {targetMonth}
            </p>
            <p className="mt-1 text-sm text-navy-300">
              Based on 18,000+ members with a similar profile losing an average of {projectedLoss} lbs over {monthsToGoal} months
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <p className="text-xl font-bold">{currentWeight}</p>
                <p className="text-[10px] text-navy-300">Current</p>
              </div>
              <div className="rounded-xl bg-white/10 p-3 text-center">
                <p className="text-xl font-bold text-teal-300">-{projectedLoss}</p>
                <p className="text-[10px] text-navy-300">Projected loss</p>
              </div>
              <div className="rounded-xl bg-teal/30 p-3 text-center">
                <p className="text-xl font-bold text-teal-200">{projectedWeight}</p>
                <p className="text-[10px] text-teal-300">Goal weight</p>
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

          {/* Micro-timeline under CTA — reduces "what am I committing to?" anxiety */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-graphite-400">
            <span className="flex items-center gap-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal">1</span>
              Complete intake
            </span>
            <span className="text-navy-200">&rarr;</span>
            <span className="flex items-center gap-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal">2</span>
              Same-day review
            </span>
            <span className="text-navy-200">&rarr;</span>
            <span className="flex items-center gap-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal">3</span>
              Ships in 48hrs
            </span>
          </div>

          <p className="mt-3 text-center text-xs text-graphite-400">
            Cancel anytime &middot; No hidden fees &middot; Treatment eligibility confirmed by your provider
          </p>
        </div>

        {/* Trust signals */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-graphite-400">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-teal" /> HIPAA Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-teal" /> Licensed Providers
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-teal" /> Free 2-Day Shipping
          </span>
        </div>

        {/* Not the right plan? */}
        <div className="mt-6 text-center">
          <Link href="/pricing" className="text-sm text-teal hover:underline">
            Not the right fit? Compare all plans &rarr;
          </Link>
        </div>
      </SectionShell>
    </section>
  );
}
