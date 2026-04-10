"use client";
import { MarketingShell } from "@/components/layout/marketing-shell";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Shield, Tag, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/shared/section-shell";
import { plans as defaultPlans, addOns as defaultAddOns } from "@/lib/pricing";
import type { PricingPlan, AddOn } from "@/lib/pricing";
import { formatPrice, cn } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { BillingToggle, getIntervalPrice, type BillingInterval } from "@/components/marketing/billing-toggle";
import { useFunnelStore } from "@/hooks/use-funnel-store";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state: funnelState } = useFunnelStore();
  const selectedPlanSlug = searchParams.get("plan") || funnelState.recommendedPlan || "premium";

  const [plans, setPlans] = useState<PricingPlan[]>(defaultPlans);
  const [addOns, setAddOns] = useState<AddOn[]>(defaultAddOns);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(
    defaultPlans.find((p) => p.slug === selectedPlanSlug) || defaultPlans[1]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discountPct: number } | null>(null);
  const [email, setEmail] = useState(funnelState.email || "");
  const [loading, setLoading] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Fetch live plans + add-ons from DB on mount
  useEffect(() => {
    fetch("/api/products/plans")
      .then((r) => r.json())
      .then((data: { plans?: PricingPlan[]; addOns?: AddOn[] }) => {
        if (data.plans?.length) {
          setPlans(data.plans);
          // Re-sync selectedPlan to the fetched version
          const match = data.plans.find((p) => p.slug === selectedPlanSlug);
          if (match) setSelectedPlan(match);
        }
        if (data.addOns?.length) setAddOns(data.addOns);
      })
      .catch(() => { /* silently keep defaults */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    track(ANALYTICS_EVENTS.CHECKOUT_START, { plan: selectedPlan.slug });
  }, [selectedPlan.slug]);

  // Track checkout abandonment
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    track(ANALYTICS_EVENTS.CHECKOUT_ABANDON, { plan: selectedPlan.slug, addOns: selectedAddOns.length, hasEmail: !!email });
    e.preventDefault();
  }, [selectedPlan.slug, selectedAddOns.length, email]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  function toggleAddOn(id: string) {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, planSlug: selectedPlan.slug }),
      });
      const data = await res.json();
      if (data.valid && data.coupon) {
        setCouponApplied({ code: data.coupon.code, discountPct: data.coupon.valuePct || 0 });
      }
    } catch {
      // Validation failed silently
    }
  }

  const intervalPricing = getIntervalPrice(selectedPlan.priceMonthly, billingInterval);
  const addOnTotal = selectedAddOns.reduce((sum, id) => {
    const addon = addOns.find((a) => a.id === id);
    return sum + (addon?.priceMonthly || 0);
  }, 0);

  const subtotal = intervalPricing.price + (billingInterval === "monthly" ? addOnTotal : billingInterval === "quarterly" ? addOnTotal * 3 : addOnTotal * 12);
  const discount = couponApplied ? Math.round(subtotal * (couponApplied.discountPct / 100)) : 0;
  const total = subtotal - discount;

  async function handleCheckout() {
    setLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planSlug: selectedPlan.slug,
          interval: billingInterval,
          addOnSlugs: selectedAddOns.map(id => addOns.find(a => a.id === id)?.slug).filter(Boolean),
          email: email || undefined,
        }),
      });

      const data = await res.json();
      if (data.url) {
        track(ANALYTICS_EVENTS.CHECKOUT_COMPLETE, { plan: selectedPlan.slug, total: total / 100 });
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Unable to start checkout. Please try again.");
      }
    } catch {
      setCheckoutError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MarketingShell><section className="min-h-[80vh] bg-gradient-to-b from-cloud to-white py-12">
      <SectionShell className="max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Complete Your Membership</h1>
          <p className="mt-2 text-sm text-graphite-400">Review your plan and start your journey</p>
          <div className="mt-6">
            <BillingToggle value={billingInterval} onChange={setBillingInterval} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Plan selection + add-ons */}
          <div className="lg:col-span-3 space-y-6">
            {/* Plan selector */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-base font-bold text-navy mb-4">Select Your Plan</h2>
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => { setSelectedPlan(plan); track(ANALYTICS_EVENTS.PLAN_SELECTED, { plan: plan.slug }); }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all",
                        selectedPlan.id === plan.id
                          ? "border-teal bg-teal-50/50"
                          : "border-navy-200 hover:border-navy-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2",
                          selectedPlan.id === plan.id ? "border-teal bg-teal" : "border-navy-300"
                        )}>
                          {selectedPlan.id === plan.id && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-navy">{plan.name}</span>
                            {plan.badge && <Badge variant="gold" className="text-[10px]">{plan.badge}</Badge>}
                          </div>
                          <span className="text-xs text-graphite-400">{plan.description}</span>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-navy">{formatPrice(plan.priceMonthly)}<span className="text-xs font-normal text-graphite-400">/mo</span></span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order bump — pre-checked high-value add-on */}
            <div className="rounded-2xl border-2 border-dashed border-gold-300 bg-gradient-to-r from-gold-50 to-linen p-5">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleAddOn("meal-plan-subscription")}
                  className={cn(
                    "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all",
                    selectedAddOns.includes("meal-plan-subscription") ? "border-teal bg-teal" : "border-navy-300"
                  )}
                >
                  {selectedAddOns.includes("meal-plan-subscription") && <Check className="h-3 w-3 text-white" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="gold" className="text-[10px]">
                      <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                      68% of members add this
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm font-bold text-navy">
                    Add Weekly Meal Plans &amp; Recipes — <span className="text-teal">+$19/mo</span>
                  </p>
                  <p className="mt-1 text-xs text-graphite-500">
                    GLP-1 changes your appetite. Our plans adapt to that — high-protein recipes, grocery lists,
                    and 4 meal modes designed specifically for patients on GLP-1 medication. Members with meal
                    plans report <span className="font-semibold">2x better adherence</span> to treatment.
                  </p>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-base font-bold text-navy mb-4">More Add-Ons</h2>
                <div className="space-y-2">
                  {addOns.map((addon) => (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition-all",
                        selectedAddOns.includes(addon.id)
                          ? "border-teal bg-teal-50/30"
                          : "border-navy-100 hover:border-navy-200"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center rounded border-2",
                          selectedAddOns.includes(addon.id) ? "border-teal bg-teal" : "border-navy-300"
                        )}>
                          {selectedAddOns.includes(addon.id) && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-navy">{addon.name}</span>
                          <p className="text-xs text-graphite-400">{addon.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-navy shrink-0">+{formatPrice(addon.priceMonthly)}/mo</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coupon */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-base font-bold text-navy mb-3">Promo Code</h2>
                {couponApplied ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">{couponApplied.code} — {couponApplied.discountPct}% off</span>
                    </div>
                    <button onClick={() => setCouponApplied(null)} className="text-graphite-400 hover:text-navy">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter promo code" className="flex-1" />
                    <Button variant="outline" onClick={applyCoupon}>Apply</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-base font-bold text-navy mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-graphite-500">{selectedPlan.name} Plan ({billingInterval})</span>
                    <span className="font-medium text-navy">{formatPrice(intervalPricing.price)}{intervalPricing.label}</span>
                  </div>
                  {intervalPricing.savings > 0 && (
                    <div className="flex justify-between text-teal">
                      <span className="text-xs">Billing savings</span>
                      <span className="text-xs font-medium">-{formatPrice(intervalPricing.savings)} vs monthly</span>
                    </div>
                  )}

                  {selectedAddOns.map((id) => {
                    const addon = addOns.find((a) => a.id === id);
                    return addon ? (
                      <div key={id} className="flex justify-between">
                        <span className="text-graphite-400">{addon.name}</span>
                        <span className="text-navy">+{formatPrice(addon.priceMonthly)}/mo</span>
                      </div>
                    ) : null;
                  })}

                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({couponApplied.discountPct}%)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="border-t border-navy-100/40 pt-3 flex justify-between">
                    <span className="font-bold text-navy">
                      {billingInterval === "monthly" ? "Monthly" : billingInterval === "quarterly" ? "Quarterly" : "Annual"} Total
                    </span>
                    <span className="text-xl font-bold text-navy">
                      {formatPrice(total)}{billingInterval === "monthly" ? "/mo" : billingInterval === "quarterly" ? "/qtr" : "/yr"}
                    </span>
                  </div>

                  {/* Retail savings callout */}
                  <div className="rounded-lg bg-teal-50/60 px-3 py-2 text-center">
                    <p className="text-xs font-semibold text-teal-700">
                      You save {formatPrice(134900 - selectedPlan.priceMonthly)}/mo vs brand-name retail
                    </p>
                  </div>

                  {/* Annual plan nudge — only shown for monthly billing */}
                  {billingInterval === "monthly" && (
                    <button
                      onClick={() => setBillingInterval("annual")}
                      className="w-full rounded-lg border border-gold-200 bg-gold-50/50 px-3 py-2.5 text-left transition-all hover:border-gold"
                    >
                      <p className="text-xs font-bold text-navy">
                        Switch to annual &amp; save {formatPrice(selectedPlan.priceMonthly * 12 - (selectedPlan.priceAnnual || 0))}/year
                      </p>
                      <p className="text-[10px] text-graphite-400">
                        That&apos;s like getting 2.4 months free. Most committed members choose annual.
                      </p>
                    </button>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                  </div>
                  <Button size="lg" className="w-full gap-2" onClick={handleCheckout} disabled={loading}>
                    {loading ? "Redirecting..." : "Continue to Payment"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                  {checkoutError && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 text-center">
                      {checkoutError}
                    </p>
                  )}
                  <p className="text-center text-[10px] text-graphite-400">
                    Join 18,000+ members &middot; 4.9/5 average rating
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-graphite-300">
                  <Shield className="h-3.5 w-3.5" />
                  <span>256-bit encrypted &middot; Cancel anytime</span>
                </div>

                <ul className="mt-4 space-y-1.5 text-xs text-graphite-400">
                  <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Licensed provider evaluation included</li>
                  <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />GLP-1 medication included if prescribed</li>
                  <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Medication ships 24-48hrs if prescribed</li>
                  <li className="flex items-start gap-1.5"><Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />Cancel, pause, or change plan anytime</li>
                </ul>

                {/* Mini testimonial near purchase */}
                <div className="mt-5 rounded-xl bg-navy-50/50 p-3">
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(i => <Sparkles key={i} className="h-2.5 w-2.5 text-gold fill-gold" />)}
                  </div>
                  <p className="text-xs text-graphite-500 italic">
                    &ldquo;Best decision I&apos;ve made for my health. Down 39 lbs in 5 months.&rdquo;
                  </p>
                  <p className="mt-1 text-[10px] text-graphite-400">— Marcus D., Atlanta, GA</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionShell>
    </section>
  </MarketingShell>
  );
}
