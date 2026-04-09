"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { calculateProtein } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function ProteinCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<"low" | "moderate" | "high">("moderate");
  const [goal, setGoal] = useState<"maintain" | "lose" | "gain">("lose");
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (isNaN(w) || w < 50) return;

    const res = calculateProtein(w, activity, goal);
    setResult(res);
    track(ANALYTICS_EVENTS.CALCULATOR_COMPLETE, { calculator: "protein" });
  }

  return (
    <>
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-20">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Health Calculator</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">Protein Calculator</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-graphite-500">
            Find your ideal daily protein range. Adequate protein is especially important during weight management.
          </p>
        </SectionShell>
      </section>

      <section className="py-12">
        <SectionShell className="max-w-2xl">
          <div className="rounded-2xl border border-navy-100/60 bg-white p-8 shadow-premium-md">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Body Weight</label>
                <div className="relative">
                  <input type="number" placeholder="180" value={weight} onChange={(e) => setWeight(e.target.value)} className="calculator-input pr-12" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">lbs</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Activity Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["low", "moderate", "high"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setActivity(a)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-medium capitalize transition-all ${
                        activity === a ? "border-teal bg-teal-50 text-teal-800" : "border-navy-200 text-graphite-500 hover:border-navy-300"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Goal</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: "lose", label: "Lose Weight" },
                    { value: "maintain", label: "Maintain" },
                    { value: "gain", label: "Build Muscle" },
                  ] as const).map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setGoal(g.value)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                        goal === g.value ? "border-teal bg-teal-50 text-teal-800" : "border-navy-200 text-graphite-500 hover:border-navy-300"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleCalculate}>
                Calculate Protein
              </Button>
            </div>

            {result && (
              <div className="mt-8 calculator-result">
                <div className="text-center">
                  <p className="text-sm font-medium text-teal-700">Daily Protein Target</p>
                  <p className="mt-1 text-5xl font-bold text-navy">
                    {result.min}&ndash;{result.max}g
                  </p>
                  <p className="mt-1 text-sm text-graphite-400">grams per day</p>
                </div>

                <div className="mt-6 rounded-xl bg-white/80 p-4">
                  <p className="text-sm font-medium text-navy mb-3">Spread across your day</p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-lg font-bold text-navy">{Math.round(result.min / 3)}g</p>
                      <p className="text-xs text-graphite-400">per meal (3 meals)</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-navy">{Math.round(result.min / 4)}g</p>
                      <p className="text-xs text-graphite-400">per meal (4 meals)</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-navy">{Math.round(result.min / 5)}g</p>
                      <p className="text-xs text-graphite-400">per meal (5 meals)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/80 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
                  <p className="text-xs leading-relaxed text-graphite-400">
                    Protein needs vary by individual. During GLP-1-supported weight management,
                    adequate protein intake is important for preserving lean muscle mass. Your
                    provider and care team can help personalize your targets.
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/quiz">
                    <Button className="gap-2">
                      Get personalized nutrition support
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* SEO content + internal links */}
          <div className="mt-10 space-y-6 rounded-2xl border border-navy-100/40 bg-navy-50/20 p-6">
            <h2 className="text-lg font-bold text-navy">Why Protein Matters During Weight Loss</h2>
            <p className="text-sm leading-relaxed text-graphite-500">
              Protein is the most critical nutrient during active weight loss. Without adequate protein
              intake, your body breaks down muscle tissue for energy — slowing your metabolism and
              making weight regain more likely. GLP-1 patients need to be especially intentional about
              protein since appetite suppression can make it easy to under-eat.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link href="/blog/best-high-protein-foods-weight-loss" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                20 best high-protein foods →
              </Link>
              <Link href="/blog/7-day-high-protein-meal-plan-weight-loss" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                7-day meal plan →
              </Link>
              <Link href="/meals" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                GLP-1-friendly recipes →
              </Link>
              <Link href="/blog/what-to-eat-first-week-glp1" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                What to eat week 1 →
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
