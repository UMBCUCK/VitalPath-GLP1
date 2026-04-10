"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, AlertCircle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { cn } from "@/lib/utils";

type Result = "likely" | "possible" | "unlikely" | null;

export function EligibilityChecker() {
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(8);
  const [weight, setWeight] = useState(230);
  const [checked, setChecked] = useState(false);

  const totalInches = heightFeet * 12 + heightInches;
  const bmi = ((weight / (totalInches * totalInches)) * 703);
  const bmiRounded = bmi.toFixed(1);

  let result: Result = null;
  if (checked) {
    if (bmi >= 30) result = "likely";
    else if (bmi >= 27) result = "possible";
    else result = "unlikely";
  }

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-sage/20">
      <SectionShell>
        <AnimateOnView>
          <div className="mx-auto max-w-2xl rounded-3xl border border-navy-100/60 bg-white p-6 shadow-premium-lg sm:p-10">
            <div className="text-center mb-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 mb-4">
                <Scale className="h-6 w-6 text-teal" />
              </div>
              <h2 className="text-2xl font-bold text-navy">
                Quick eligibility check
              </h2>
              <p className="mt-2 text-sm text-graphite-500">
                See if you may qualify for GLP-1 treatment in 10 seconds.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Height feet */}
              <div>
                <label className="block text-xs font-semibold text-graphite-500 mb-1">
                  Height (feet)
                </label>
                <select
                  value={heightFeet}
                  onChange={(e) => { setHeightFeet(Number(e.target.value)); setChecked(false); }}
                  className="w-full rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
                >
                  {[4, 5, 6, 7].map((f) => (
                    <option key={f} value={f}>{f} ft</option>
                  ))}
                </select>
              </div>

              {/* Height inches */}
              <div>
                <label className="block text-xs font-semibold text-graphite-500 mb-1">
                  Height (inches)
                </label>
                <select
                  value={heightInches}
                  onChange={(e) => { setHeightInches(Number(e.target.value)); setChecked(false); }}
                  className="w-full rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>{i} in</option>
                  ))}
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-graphite-500 mb-1">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  min={100}
                  max={500}
                  value={weight}
                  onChange={(e) => { setWeight(Number(e.target.value)); setChecked(false); }}
                  className="w-full rounded-xl border border-navy-100 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
                />
              </div>
            </div>

            {!checked ? (
              <Button
                onClick={() => setChecked(true)}
                className="mt-6 w-full gap-2"
                size="lg"
              >
                Check My Eligibility
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="mt-6 space-y-4">
                {/* BMI result */}
                <div className={cn(
                  "rounded-2xl p-5 text-center",
                  result === "likely" && "bg-teal-50 border border-teal-100",
                  result === "possible" && "bg-gold-50 border border-gold-200",
                  result === "unlikely" && "bg-navy-50 border border-navy-100",
                )}>
                  <p className="text-sm text-graphite-500">Your BMI</p>
                  <p className={cn(
                    "text-4xl font-bold",
                    result === "likely" && "text-teal",
                    result === "possible" && "text-gold-700",
                    result === "unlikely" && "text-navy",
                  )}>
                    {bmiRounded}
                  </p>

                  {result === "likely" && (() => {
                    const projLoss = Math.round(weight * 0.15);
                    const projWeight = weight - projLoss;
                    const months = Math.max(3, Math.round(projLoss / 6));
                    const savings = (1349 - 279) * months;
                    return (
                      <div className="mt-3">
                        <Badge variant="success" className="text-sm gap-1.5">
                          <Check className="h-3.5 w-3.5" />
                          You likely qualify
                        </Badge>
                        <p className="mt-2 text-sm text-graphite-500">
                          With a BMI of {bmiRounded}, you meet the general clinical guidelines for GLP-1 treatment.
                        </p>

                        {/* Personalized projection */}
                        <div className="mt-4 rounded-xl bg-teal-50/50 border border-teal-100 p-4 text-left">
                          <p className="text-xs font-semibold text-teal-700 mb-2">Your personalized estimate:</p>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-lg font-bold text-navy">{projLoss} lbs</p>
                              <p className="text-[10px] text-graphite-400">Projected loss</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-teal">{projWeight} lbs</p>
                              <p className="text-[10px] text-graphite-400">Goal weight</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-navy">${savings.toLocaleString()}</p>
                              <p className="text-[10px] text-graphite-400">Saved vs retail</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {result === "possible" && (
                    <div className="mt-3">
                      <Badge variant="gold" className="text-sm gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        You may qualify
                      </Badge>
                      <p className="mt-2 text-sm text-graphite-500">
                        With a BMI of {bmiRounded}, you may qualify if you have weight-related health conditions
                        (high blood pressure, type 2 diabetes, etc.). A provider evaluation will determine eligibility.
                      </p>
                    </div>
                  )}

                  {result === "unlikely" && (
                    <div className="mt-3">
                      <Badge variant="secondary" className="text-sm">
                        Below typical threshold
                      </Badge>
                      <p className="mt-2 text-sm text-graphite-500">
                        GLP-1 medication is typically prescribed for BMI 30+ (or 27+ with health conditions).
                        A provider evaluation can discuss alternative options for your goals.
                      </p>
                    </div>
                  )}
                </div>

                <Link href="/qualify" className="block">
                  <Button size="lg" className="w-full gap-2">
                    {result === "likely"
                      ? "Start My Assessment Now"
                      : result === "possible"
                        ? "Check Full Eligibility"
                        : "Explore Your Options"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <button
                  onClick={() => setChecked(false)}
                  className="w-full text-center text-xs text-graphite-400 hover:text-graphite-600 transition-colors"
                >
                  Recalculate
                </button>
              </div>
            )}

            <p className="mt-4 text-center text-[10px] text-graphite-300">
              This is a preliminary check only. Treatment eligibility is determined by a licensed medical provider.
            </p>
          </div>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
