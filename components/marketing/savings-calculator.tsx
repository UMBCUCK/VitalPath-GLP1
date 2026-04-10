"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { cn } from "@/lib/utils";

export function SavingsCalculator() {
  const [weight, setWeight] = useState(230);
  const [calculated, setCalculated] = useState(false);

  // Projected results based on 15% avg body weight loss from clinical data
  const projectedLoss = Math.round(weight * 0.15);
  const projectedWeight = weight - projectedLoss;
  const monthsToGoal = Math.max(3, Math.round(projectedLoss / 6)); // ~6 lbs/month avg

  // Cost comparison
  const vitalPathCost = 279 * monthsToGoal;
  const brandedCost = 1349 * monthsToGoal;
  const savings = brandedCost - vitalPathCost;

  // BMI estimate (assume 5'8" average)
  const heightInches = 68;
  const currentBMI = ((weight / (heightInches * heightInches)) * 703).toFixed(1);
  const projectedBMI = ((projectedWeight / (heightInches * heightInches)) * 703).toFixed(1);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-sage/20 to-white">
      <SectionShell>
        <SectionHeading
          eyebrow="Personal Projection"
          title="See what's possible for you"
          description="Enter your current weight to see projected results based on average clinical outcomes."
        />

        <AnimateOnView>
          <div className="mx-auto max-w-4xl rounded-3xl border border-navy-100/60 bg-white p-6 shadow-premium-lg sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Input side */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">
                  Your current weight (lbs)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={150}
                    max={400}
                    step={5}
                    value={weight}
                    onChange={(e) => {
                      setWeight(Number(e.target.value));
                      setCalculated(true);
                    }}
                    className="flex-1 h-2 rounded-full appearance-none bg-navy-100 accent-teal cursor-pointer"
                  />
                  <div className="flex h-14 w-20 items-center justify-center rounded-xl border-2 border-teal bg-teal-50 text-xl font-bold text-teal">
                    {weight}
                  </div>
                </div>

                <div className="mt-1 flex justify-between text-xs text-graphite-400">
                  <span>150 lbs</span>
                  <span>400 lbs</span>
                </div>

                {/* Projected results */}
                <div className={cn("mt-8 space-y-4 transition-all duration-500", calculated ? "opacity-100" : "opacity-60")}>
                  <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-teal" />
                    Your projected results
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-navy-50 p-3 text-center">
                      <p className="text-2xl font-bold text-navy">{projectedLoss}</p>
                      <p className="text-xs text-graphite-400">lbs to lose</p>
                    </div>
                    <div className="rounded-xl bg-teal-50 p-3 text-center">
                      <p className="text-2xl font-bold text-teal">{projectedWeight}</p>
                      <p className="text-xs text-teal-600">projected weight</p>
                    </div>
                    <div className="rounded-xl bg-navy-50 p-3 text-center">
                      <p className="text-2xl font-bold text-navy">{currentBMI}</p>
                      <p className="text-xs text-graphite-400">current BMI</p>
                    </div>
                    <div className="rounded-xl bg-teal-50 p-3 text-center">
                      <p className="text-2xl font-bold text-teal">{projectedBMI}</p>
                      <p className="text-xs text-teal-600">projected BMI</p>
                    </div>
                  </div>

                  <p className="text-xs text-graphite-400">
                    Based on {monthsToGoal} months at ~6 lbs/month (15% avg body weight loss from clinical trials)
                  </p>
                </div>
              </div>

              {/* Savings side */}
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-gold" />
                  Your savings with Nature's Journey
                </h3>

                <div className="mt-4 space-y-3 flex-1">
                  {/* Brand-name cost */}
                  <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-graphite-600">Brand-name GLP-1</p>
                        <p className="text-xs text-graphite-400">{monthsToGoal} months &times; $1,349/mo</p>
                      </div>
                      <p className="text-xl font-bold text-red-500 line-through">
                        ${brandedCost.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Nature's Journey cost */}
                  <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-teal">Nature's Journey</p>
                        <p className="text-xs text-teal-600">{monthsToGoal} months &times; $279/mo</p>
                      </div>
                      <p className="text-xl font-bold text-teal">
                        ${vitalPathCost.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Savings callout */}
                  <div className="rounded-xl bg-gradient-to-r from-teal to-atlantic p-4 text-center text-white">
                    <p className="text-sm">You save</p>
                    <p className="text-3xl font-bold">${savings.toLocaleString()}</p>
                    <p className="text-xs text-teal-100">
                      That&apos;s ${Math.round(savings / monthsToGoal).toLocaleString()}/month back in your pocket
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Link href="/qualify" className="mt-6">
                  <Button size="lg" className="w-full gap-2">
                    See If I Qualify to Save ${savings.toLocaleString()}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="mt-2 text-center text-[10px] text-graphite-400">
                  Projections based on published clinical trial averages. Individual results vary.
                </p>
              </div>
            </div>
          </div>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
