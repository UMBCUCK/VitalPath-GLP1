"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Droplets, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { calculateHydration } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function HydrationCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<"low" | "moderate" | "high">("moderate");
  const [result, setResult] = useState<number | null>(null);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (isNaN(w) || w < 50) return;

    const oz = calculateHydration(w, activity);
    setResult(oz);
    track(ANALYTICS_EVENTS.CALCULATOR_COMPLETE, { calculator: "hydration" });
  }

  return (
    <>
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-20">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Health Calculator</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">Hydration Calculator</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-graphite-500">
            Calculate your optimal daily water intake. Proper hydration supports metabolism, energy, and recovery.
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
                  {([
                    { value: "low", label: "Low", desc: "Mostly sedentary" },
                    { value: "moderate", label: "Moderate", desc: "Regular exercise" },
                    { value: "high", label: "High", desc: "Intense training" },
                  ] as const).map((a) => (
                    <button
                      key={a.value}
                      type="button"
                      onClick={() => setActivity(a.value)}
                      className={`rounded-xl border-2 px-4 py-3 text-left transition-all ${
                        activity === a.value ? "border-teal bg-teal-50" : "border-navy-200 hover:border-navy-300"
                      }`}
                    >
                      <p className={`text-sm font-medium ${activity === a.value ? "text-teal-800" : "text-navy"}`}>{a.label}</p>
                      <p className="text-[11px] text-graphite-400">{a.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleCalculate}>
                Calculate Hydration
              </Button>
            </div>

            {result && (
              <div className="mt-8 calculator-result">
                <div className="text-center">
                  <Droplets className="mx-auto h-8 w-8 text-teal" />
                  <p className="mt-2 text-sm font-medium text-teal-700">Daily Water Goal</p>
                  <p className="mt-1 text-5xl font-bold text-navy">{result} oz</p>
                  <p className="mt-1 text-sm text-graphite-400">
                    That&apos;s about {Math.round(result / 8)} glasses or {(result * 0.0296).toFixed(1)}L
                  </p>
                </div>

                <div className="mt-6 rounded-xl bg-white/80 p-4">
                  <p className="text-sm font-medium text-navy mb-3">Spread throughout your day</p>
                  <div className="space-y-2">
                    {[
                      { time: "Morning", amount: Math.round(result * 0.25), tip: "Start with water before coffee" },
                      { time: "Midday", amount: Math.round(result * 0.3), tip: "Sip consistently with meals" },
                      { time: "Afternoon", amount: Math.round(result * 0.25), tip: "Refill after any exercise" },
                      { time: "Evening", amount: Math.round(result * 0.2), tip: "Moderate before bedtime" },
                    ].map((slot) => (
                      <div key={slot.time} className="flex items-center justify-between rounded-lg bg-gradient-to-r from-teal-50/50 to-transparent px-4 py-2">
                        <div>
                          <p className="text-sm font-medium text-navy">{slot.time}</p>
                          <p className="text-[11px] text-graphite-400">{slot.tip}</p>
                        </div>
                        <p className="text-sm font-bold text-teal">{slot.amount} oz</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/80 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
                  <p className="text-xs leading-relaxed text-graphite-400">
                    Hydration needs vary by individual, climate, and medication. Some GLP-1 medications
                    may increase the importance of adequate hydration. Follow your provider's guidance.
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/qualify">
                    <Button className="gap-2">
                      Get hydration tracking tools
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* SEO content + internal links */}
          <div className="mt-10 space-y-6 rounded-2xl border border-navy-100/40 bg-navy-50/20 p-6">
            <h2 className="text-lg font-bold text-navy">Why Hydration Matters During Weight Loss</h2>
            <p className="text-sm leading-relaxed text-graphite-500">
              Water plays a critical role in weight loss — it supports metabolism, aids digestion,
              helps your body process fat, and can reduce hunger when mistaken for thirst. GLP-1
              patients need extra hydration since reduced food intake means less water from meals
              and some medication side effects can cause fluid loss.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link href="/blog/hydration-guide" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Complete hydration guide →
              </Link>
              <Link href="/blog/what-to-eat-first-week-glp1" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                First week eating guide →
              </Link>
              <Link href="/blog/managing-side-effects" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Managing side effects →
              </Link>
              <Link href="/calculators/protein" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Protein calculator →
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
