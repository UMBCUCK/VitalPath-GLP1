"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign, ArrowRight, Check, TrendingDown, ShieldCheck,
  Building2, Calendar, Calculator, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/shared/section-shell";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { cn } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

const brandPrices = [
  { name: "Wegovy (semaglutide)", monthly: 1349, annual: 16188, type: "Brand-name" },
  { name: "Ozempic (semaglutide)", monthly: 935, annual: 11220, type: "Brand-name (off-label)" },
  { name: "Zepbound (tirzepatide)", monthly: 1060, annual: 12720, type: "Brand-name" },
  { name: "Mounjaro (tirzepatide)", monthly: 1070, annual: 12840, type: "Brand-name (off-label)" },
];

const compoundedPrices = [
  { name: "Nature's Journey Essential", monthly: 279, annual: 279 * 12 * 0.8, features: ["Provider evaluation", "Medication", "Free shipping", "Care team messaging"] },
  { name: "Nature's Journey Premium", monthly: 379, annual: 379 * 12 * 0.8, features: ["Everything in Essential", "Meal plans & recipes", "Coaching check-ins", "Progress tracking"] },
  { name: "Nature's Journey Complete", monthly: 599, annual: 599 * 12 * 0.8, features: ["Everything in Premium", "Lab work coordination", "Supplements included", "Maintenance planning"] },
];

const insuranceFacts = [
  { stat: "< 25%", label: "of insurance plans cover GLP-1 for weight loss" },
  { stat: "$150-300", label: "typical copay even with coverage" },
  { stat: "6-12 weeks", label: "average prior authorization wait" },
  { stat: "42%", label: "of covered claims are initially denied" },
];

export default function CostCalculatorPage() {
  const [duration, setDuration] = useState(6); // months
  const [hasInsurance, setHasInsurance] = useState(false);

  const vitalPathCost = 279 * duration;
  const avgBrandCost = 1100 * duration;
  const savings = avgBrandCost - vitalPathCost;
  const dailyCost = (279 / 30).toFixed(2);

  return (
    <MarketingShell>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">
            <Calculator className="mr-1 h-3 w-3" /> Cost Calculator
          </Badge>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            How Much Does GLP-1 Weight Loss<br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              Actually Cost?
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Brand-name GLP-1 medication costs $935–$1,349/month. Compounded versions from licensed pharmacies
            start at $279/month. Use this calculator to see your total cost and savings.
          </p>
        </SectionShell>
      </section>

      {/* Interactive calculator */}
      <section className="py-16">
        <SectionShell className="max-w-4xl">
          <Card className="overflow-hidden">
            <CardContent className="p-6 sm:p-10">
              <h2 className="text-xl font-bold text-navy mb-6">
                <DollarSign className="inline h-5 w-5 text-teal" /> Calculate Your Cost
              </h2>

              {/* Duration slider */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-navy mb-2">
                  How long do you plan to be on treatment?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min={3} max={24} step={1} value={duration}
                    onChange={(e) => { setDuration(Number(e.target.value)); track(ANALYTICS_EVENTS.CALCULATOR_COMPLETE, { type: "cost", months: Number(e.target.value) }); }}
                    className="flex-1 h-2 rounded-full appearance-none bg-navy-100 accent-teal cursor-pointer"
                  />
                  <div className="flex h-14 w-28 items-center justify-center rounded-xl border-2 border-teal bg-teal-50 text-center">
                    <div>
                      <p className="text-xl font-bold text-teal">{duration}</p>
                      <p className="text-[10px] text-teal-600">months</p>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex justify-between text-xs text-graphite-400">
                  <span>3 months</span>
                  <span>24 months</span>
                </div>
              </div>

              {/* Insurance toggle */}
              <div className="mb-8 flex items-center gap-3">
                <button
                  onClick={() => setHasInsurance(!hasInsurance)}
                  className={cn(
                    "flex h-6 w-11 items-center rounded-full px-0.5 transition-colors",
                    hasInsurance ? "bg-teal" : "bg-navy-200"
                  )}
                >
                  <div className={cn(
                    "h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                    hasInsurance && "translate-x-5"
                  )} />
                </button>
                <span className="text-sm text-navy">I have insurance that covers GLP-1 for weight loss</span>
              </div>

              {hasInsurance && (
                <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div className="text-xs text-amber-800">
                      <p className="font-semibold mb-1">Insurance coverage for GLP-1 weight loss is limited</p>
                      <p>Only ~25% of plans cover it, approvals take 6-12 weeks, and 42% of claims are initially denied.
                        Even with coverage, copays average $150-300/month. Many members start with compounded medication
                        while pursuing insurance approval.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Results */}
              <div className="grid gap-4 sm:grid-cols-2 mb-8">
                {/* Brand-name cost */}
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-5">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">Brand-Name Average</p>
                  <p className="text-3xl font-bold text-red-500 line-through">${avgBrandCost.toLocaleString()}</p>
                  <p className="text-xs text-graphite-500 mt-1">{duration} months × ~$1,100/mo average</p>
                  {hasInsurance && (
                    <p className="text-[10px] text-amber-600 mt-2">With insurance copay: ~${(200 * duration).toLocaleString()}</p>
                  )}
                </div>

                {/* VitalPath cost */}
                <div className="rounded-xl border-2 border-teal bg-teal-50/50 p-5">
                  <p className="text-xs font-semibold text-teal uppercase tracking-wider mb-2">Nature&apos;s Journey</p>
                  <p className="text-3xl font-bold text-teal">${vitalPathCost.toLocaleString()}</p>
                  <p className="text-xs text-graphite-500 mt-1">{duration} months × $279/mo (Essential plan)</p>
                  <p className="text-xs text-teal font-medium mt-2">That&apos;s ${dailyCost}/day — less than a coffee</p>
                </div>
              </div>

              {/* Savings callout */}
              <div className="rounded-xl bg-gradient-to-r from-navy to-atlantic p-5 text-center text-white mb-6">
                <p className="text-sm text-navy-300">You save</p>
                <p className="text-4xl font-bold">${savings.toLocaleString()}</p>
                <p className="text-sm text-navy-300 mt-1">
                  over {duration} months vs. brand-name retail
                </p>
              </div>

              <Link href="/qualify">
                <Button size="xl" className="w-full gap-2 h-14 text-lg">
                  See If I Qualify to Save ${savings.toLocaleString()}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <p className="mt-3 text-center text-[10px] text-graphite-400">
                Free assessment · No commitment · Cancel anytime
              </p>
            </CardContent>
          </Card>
        </SectionShell>
      </section>

      {/* Brand price comparison table */}
      <section className="bg-navy-50/30 py-16">
        <SectionShell>
          <h2 className="text-2xl font-bold text-navy text-center mb-2">Brand-Name GLP-1 Prices (2026)</h2>
          <p className="text-center text-sm text-graphite-500 mb-8">Retail prices without insurance coverage</p>

          <div className="overflow-x-auto rounded-2xl border border-navy-100/60 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40">
                  <th className="px-5 py-3 text-left font-semibold text-navy">Medication</th>
                  <th className="px-5 py-3 text-center font-semibold text-navy">Type</th>
                  <th className="px-5 py-3 text-right font-semibold text-navy">Monthly</th>
                  <th className="px-5 py-3 text-right font-semibold text-navy">Annual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {brandPrices.map((med) => (
                  <tr key={med.name} className="hover:bg-navy-50/30">
                    <td className="px-5 py-3 font-medium text-navy">{med.name}</td>
                    <td className="px-5 py-3 text-center text-xs text-graphite-500">{med.type}</td>
                    <td className="px-5 py-3 text-right text-red-500 line-through">${med.monthly.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-red-500 line-through">${med.annual.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-teal-50/50 font-semibold">
                  <td className="px-5 py-3 text-teal">Nature&apos;s Journey (compounded)</td>
                  <td className="px-5 py-3 text-center text-xs text-teal">All-inclusive</td>
                  <td className="px-5 py-3 text-right text-teal">$279</td>
                  <td className="px-5 py-3 text-right text-teal">${(279 * 12 * 0.8).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionShell>
      </section>

      {/* Insurance reality check */}
      <section className="py-16">
        <SectionShell>
          <h2 className="text-2xl font-bold text-navy text-center mb-2">The Insurance Reality</h2>
          <p className="text-center text-sm text-graphite-500 mb-8">Why most people pay out of pocket for GLP-1 weight loss</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {insuranceFacts.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-navy-100/60 bg-white p-5 text-center">
                <p className="text-2xl font-bold text-navy">{fact.stat}</p>
                <p className="mt-1 text-xs text-graphite-500">{fact.label}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* What's included */}
      <section className="bg-gradient-to-b from-sage/20 to-white py-16">
        <SectionShell>
          <h2 className="text-2xl font-bold text-navy text-center mb-2">What&apos;s Included at Every Price</h2>
          <p className="text-center text-sm text-graphite-500 mb-8">No hidden fees — medication, provider, and support all included</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {compoundedPrices.map((plan) => (
              <Card key={plan.name} className={cn(plan.monthly === 379 && "border-2 border-teal ring-4 ring-teal/10")}>
                <CardContent className="p-5">
                  {plan.monthly === 379 && (
                    <Badge variant="gold" className="mb-3 text-[10px]">Most Popular</Badge>
                  )}
                  <h3 className="text-base font-bold text-navy">{plan.name}</h3>
                  <p className="mt-2">
                    <span className="text-3xl font-bold text-navy">${plan.monthly}</span>
                    <span className="text-sm text-graphite-400">/mo</span>
                  </p>
                  <p className="text-xs text-teal font-medium">or ${Math.round(plan.annual / 12)}/mo annual</p>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-graphite-600">
                        <Check className="h-3.5 w-3.5 text-teal shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Trust signals */}
      <section className="py-8 border-y border-navy-100/40">
        <SectionShell>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-graphite-500">
            <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-navy" /> Licensed 503B Pharmacies</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-navy" /> HIPAA Compliant</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-navy" /> Cancel Anytime</span>
            <span className="flex items-center gap-1.5"><TrendingDown className="h-4 w-4 text-navy" /> 30-Day Money-Back Guarantee</span>
          </div>
        </SectionShell>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <SectionShell className="text-center max-w-xl">
          <h2 className="text-2xl font-bold text-navy">
            Ready to save ${savings.toLocaleString()}?
          </h2>
          <p className="mt-3 text-sm text-graphite-500">
            Take a free 2-minute assessment to see if you qualify for GLP-1 treatment at a fraction of the retail cost.
          </p>
          <div className="mt-6">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 h-14 text-lg">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-[10px] text-graphite-400">
            Nature&apos;s Journey uses compounded medications from FDA-regulated, licensed 503A/503B pharmacies.
            Compounded medications are not FDA-approved. Eligibility determined by licensed providers.
          </p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
