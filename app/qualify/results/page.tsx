"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Star, Shield, Clock, TrendingDown, ChefHat, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { plans } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

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
  const recommended = searchParams?.get("plan") || "premium";
  const currentWeight = parseInt(searchParams?.get("weight") || "200");
  const projectedWeight = parseInt(searchParams?.get("projected") || String(Math.round(currentWeight * 0.8)));
  const plan = plans.find((p) => p.slug === recommended) || plans[1];

  const totalLoss = currentWeight - projectedWeight;

  // Target date estimate (based on ~6 lbs/month)
  const monthsToGoal = Math.max(3, Math.round(totalLoss / 6));
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + monthsToGoal);
  const targetMonth = targetDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const [revealed, setRevealed] = useState(false);

  // Tier 4.2 — soft-urgency countdown (24h hold window per qualify).
  // Stored in localStorage so refresh doesn't reset; expires gracefully.
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    track(ANALYTICS_EVENTS.QUALIFY_COMPLETE, { recommendedPlan: recommended });
    const timer = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(timer);
  }, [recommended]);

  // Tier 5.4 — Pre-checkout upsell selections (add-ons the user can
  // include in their Stripe checkout). Persisted in localStorage so
  // selections survive the click into /checkout.
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("nj-qualify-addons");
    if (raw) {
      try {
        setSelectedAddOns(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("nj-qualify-addons", JSON.stringify(selectedAddOns));
  }, [selectedAddOns]);

  function toggleAddOn(slug: string) {
    setSelectedAddOns((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      track(next.includes(slug) ? ANALYTICS_EVENTS.ADDON_ADDED : ANALYTICS_EVENTS.ADDON_REMOVED, {
        slug,
        location: "qualify_results",
      });
      return next;
    });
  }

  // Countdown effect — 24h from first visit (stored in localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const KEY = "nj-qualify-expires";
    let expiresAt = Number(localStorage.getItem(KEY));
    if (!expiresAt || isNaN(expiresAt) || expiresAt <= Date.now()) {
      expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(KEY, String(expiresAt));
    }
    const tick = () => {
      const remaining = Math.max(0, expiresAt - Date.now());
      setTimeLeft({
        hours: Math.floor(remaining / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

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
            A licensed provider will review your health profile within 1 business day.
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
                <p className="text-[10px] text-teal-600">GLP-1 + Nature's Journey</p>
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

          {/* Tier 5.4 — Pre-checkout upsell strip.
              Only 2 offers here (meal plans + lab) to avoid decision fatigue
              at the moment of commitment. Peptides are intentionally excluded
              — they're post-month-1 per the upsell engine rules. */}
          {(() => {
            const addOns = [
              {
                slug: "meal-plans",
                name: "Meal Plans & Recipes",
                description: "Weekly GLP-1-tailored meals, auto grocery lists, 4 modes",
                priceCents: 1500,
                originalCents: 1900,
                badge: "68% of members add this",
                icon: ChefHat,
              },
              {
                slug: "protein-hydration",
                name: "Protein & Hydration Bundle",
                description: "Daily targets + supplements to support GLP-1 side effects",
                priceCents: 3400,
                badge: "Reduces nausea",
                icon: Plus,
              },
            ];
            return (
              <div className="mt-6 rounded-2xl border border-navy-100/60 bg-navy-50/30 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-navy">
                  Boost your results — add to your plan
                </p>
                <p className="mt-0.5 text-xs text-graphite-500">
                  Members who add these average 35% higher adherence in month 1.
                </p>
                <div className="mt-3 space-y-2">
                  {addOns.map((a) => {
                    const active = selectedAddOns.includes(a.slug);
                    return (
                      <button
                        type="button"
                        key={a.slug}
                        onClick={() => toggleAddOn(a.slug)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border-2 bg-white px-4 py-3 text-left transition-all",
                          active
                            ? "border-teal bg-teal-50/40"
                            : "border-navy-100 hover:border-navy-200",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            active ? "bg-teal text-white" : "bg-gold-50 text-gold-700",
                          )}
                        >
                          {active ? <Check className="h-4 w-4" /> : <a.icon className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-sm font-bold text-navy">{a.name}</span>
                            {a.badge && (
                              <span className="rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-semibold text-gold-700">
                                {a.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-graphite-500 line-clamp-1">
                            {a.description}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          {a.originalCents && (
                            <p className="text-[10px] text-graphite-400 line-through">
                              ${(a.originalCents / 100).toFixed(0)}/mo
                            </p>
                          )}
                          <p className="text-sm font-bold text-navy">
                            +${(a.priceCents / 100).toFixed(0)}
                            <span className="text-[10px] font-normal text-graphite-400">/mo</span>
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedAddOns.length > 0 && (
                  <p className="mt-3 text-[11px] text-teal font-semibold">
                    ✓ {selectedAddOns.length} add-on{selectedAddOns.length > 1 ? "s" : ""} will be
                    included in your checkout. You can remove them anytime from your dashboard.
                  </p>
                )}
              </div>
            );
          })()}

          {/* Tier 4.2 — soft-urgency 24h countdown (this-assessment-holds-your-spot) */}
          {timeLeft && (timeLeft.hours + timeLeft.minutes + timeLeft.seconds > 0) && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
              <Clock className="h-4 w-4 shrink-0 text-amber-600" />
              <p className="flex-1 text-xs text-navy">
                Your provider-reviewed plan is held for{" "}
                <span className="font-bold text-amber-700 tabular-nums">
                  {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
                .{" "}Complete checkout now and your provider can begin reviewing today.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/checkout?plan=${plan.slug}${selectedAddOns.length ? `&addons=${selectedAddOns.join(",")}` : ""}`}
              className="flex-1"
            >
              <Button size="xl" className="w-full gap-2 text-lg h-14 rounded-2xl shadow-glow hover:shadow-premium-lg transition-all hover:scale-[1.01]">
                Start My {plan.name} Plan
                {selectedAddOns.length > 0 && (
                  <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                    + {selectedAddOns.length}
                  </span>
                )}
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
                { step: "1", label: "Provider reviews your health profile", time: "Within 1 business day" },
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
