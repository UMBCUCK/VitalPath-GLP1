"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Flame, Sparkles, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { plans as defaultPlans } from "@/lib/pricing";
import type { PricingPlan } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { cn } from "@/lib/utils";

function DailyCost({ cents }: { cents: number }) {
  const daily = (cents / 100 / 30).toFixed(2);
  return (
    <span className="text-sm text-graphite-400">
      Just ${daily}/day
    </span>
  );
}

export function PricingSection({ plans = defaultPlans }: { plans?: PricingPlan[] }) {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-20 lg:py-28" id="pricing">
      <SectionShell>
        <SectionHeading
          eyebrow="Plans & Pricing"
          title="Complete GLP-1 care. Starting at $279/mo."
          description="Every plan includes provider evaluation, personalized treatment plan, and medication if prescribed. Up to 79% less than brand-name retail."
        />

        {/* Billing toggle */}
        <AnimateOnView className="mb-10 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-navy-100/60 bg-white p-1.5 shadow-premium">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                !annual
                  ? "bg-navy text-white shadow-premium"
                  : "text-graphite-500 hover:text-navy"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
                annual
                  ? "bg-navy text-white shadow-premium"
                  : "text-graphite-500 hover:text-navy"
              )}
            >
              Annual
              {/* Savings badge */}
              <span className="absolute -top-2 -right-2 flex h-5 items-center rounded-full bg-teal px-2 text-[10px] font-bold text-white">
                -20%
              </span>
            </button>
          </div>
        </AnimateOnView>

        {/* Retail price anchor */}
        <AnimateOnView className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-teal-100 bg-teal-50/50 px-6 py-3">
            <Flame className="h-5 w-5 text-teal" />
            <span className="text-sm text-graphite-600">
              Brand-name GLP-1 retail:{" "}
              <span className="font-bold text-graphite-400 line-through">$1,349+/mo*</span>
              {" "}&rarr;{" "}
              Nature&apos;s Journey from{" "}
              <span className="font-bold text-teal">
                {annual ? "$223/mo" : "$279/mo"}
              </span>
            </span>
          </div>
        </AnimateOnView>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const monthlyEquivalent = annual && plan.priceAnnual
              ? Math.round(plan.priceAnnual / 12)
              : plan.priceMonthly;
            const monthlySavings = annual && plan.priceAnnual
              ? plan.priceMonthly - Math.round(plan.priceAnnual / 12)
              : 0;
            const annualSavings = annual && plan.priceAnnual
              ? plan.priceMonthly * 12 - plan.priceAnnual
              : 0;

            return (
              <AnimateOnView key={plan.id} delay={i * 0.1}>
                <Card
                  className={cn(
                    "relative flex h-full flex-col transition-all duration-300",
                    plan.highlighted &&
                      "border-teal ring-2 ring-teal/20 shadow-glow scale-[1.02] lg:scale-105"
                  )}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="gold" className="shadow-gold-glow">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className={cn(plan.badge && "pt-8")}>
                    {plan.imageUrl && (
                      <div className="mb-3 overflow-hidden rounded-xl aspect-video bg-graphite-50">
                        <img
                          src={plan.imageUrl}
                          alt={plan.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                        />
                      </div>
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-navy">
                          {formatPrice(monthlyEquivalent)}
                        </span>
                        <span className="text-sm text-graphite-400">/month</span>
                      </div>

                      {/* Annual savings callout */}
                      {annual && annualSavings > 0 ? (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm text-graphite-400 line-through">
                            {formatPrice(plan.priceMonthly)}/mo
                          </span>
                          <Badge variant="success" className="text-[10px]">
                            Save {formatPrice(annualSavings)}/year
                          </Badge>
                        </div>
                      ) : (
                        <DailyCost cents={monthlyEquivalent} />
                      )}

                      {annual && (
                        <p className="mt-1 text-xs text-graphite-400">
                          Billed as {formatPrice(plan.priceAnnual || 0)}/year
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    {/* Medication included callout */}
                    <div className="mb-4 rounded-lg bg-teal-50/60 border border-teal-100 px-3 py-2">
                      <p className="text-xs font-semibold text-teal-700">
                        Includes provider evaluation + GLP-1 medication (if prescribed) + ongoing support
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                          <span className="text-sm text-graphite-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="flex-col gap-3">
                    <Link href={`/qualify?plan=${plan.slug}`} className="w-full">
                      <Button
                        variant={plan.highlighted ? "emerald" : "outline"}
                        size="lg"
                        className={cn("w-full gap-2", plan.highlighted && "rounded-full")}
                      >
                        {plan.highlighted ? "See If I Qualify" : "Get Started"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>

                    <p className="text-xs text-center text-graphite-400">
                      Cancel anytime &middot; No hidden fees
                    </p>
                  </CardFooter>
                </Card>
              </AnimateOnView>
            );
          })}
        </div>

        {/* Cost comparison callout */}
        <AnimateOnView className="mt-10" delay={0.4}>
          <div className="mx-auto max-w-3xl rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium">
            <div className="grid gap-4 text-center sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400">Your daily coffee</p>
                <p className="mt-1 text-xl font-bold text-graphite-600">$6.50/day</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400">Gym you don&apos;t use</p>
                <p className="mt-1 text-xl font-bold text-graphite-600">$75/month</p>
              </div>
              <div className="rounded-xl bg-teal-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal">Nature&apos;s Journey Essential</p>
                <p className="mt-1 text-xl font-bold text-teal">
                  {annual ? "$7.44/day" : "$9.30/day"}
                </p>
                <p className="text-xs text-teal-600">That actually works</p>
              </div>
            </div>
          </div>
        </AnimateOnView>

        {/* Provider capacity urgency — factual, not fake scarcity */}
        <AnimateOnView className="mt-8" delay={0.5}>
          <div className="mx-auto max-w-lg rounded-xl border border-gold-200 bg-gold-50/50 p-4 text-center">
            <p className="text-sm text-graphite-600">
              <span className="font-semibold text-navy">Our providers evaluate new patients Mon-Fri.</span>
              {" "}Complete your assessment today to be reviewed this week.
            </p>
          </div>
        </AnimateOnView>

        <p className="mt-6 text-center text-xs text-graphite-400">
          All plans include a licensed provider evaluation. Treatment eligibility is determined by your provider.
          Medication is only available to eligible patients. Cancel or adjust anytime.
        </p>
        <p className="mt-2 text-center text-xs text-graphite-400">
          Membership fees cover the program, provider evaluation, and care team access. <strong>Medication pricing is separate</strong> and determined at the time of prescribing based on dose, formulation, and pharmacy. Your provider will discuss medication costs before prescribing.
        </p>
        <p className="mt-2 text-center text-[10px] text-graphite-300">
          *Brand-name retail price based on published U.S. cash-pay pricing for FDA-approved GLP-1 medications as of 2025. Prices vary by pharmacy and location. Compounded medications are not FDA-approved drug products and are not the same as branded medications.
        </p>
      </SectionShell>
    </section>
  );
}
