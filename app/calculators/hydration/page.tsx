"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { calculateHydration } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { WaterFill } from "@/components/calculators/water-fill";
import { AnimatedCounter } from "@/components/calculators/animated-counter";

export default function HydrationCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<"low" | "moderate" | "high">("moderate");
  const [result, setResult] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (isNaN(w) || w < 50) return;

    const oz = calculateHydration(w, activity);
    setResult(oz);
    track(ANALYTICS_EVENTS.CALCULATOR_COMPLETE, { calculator: "hydration" });
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  const bottles = result ? Math.round(result / 16.9) : 0;

  const timeSlots = result
    ? [
        { time: "Morning", pct: 0.25, tip: "Start with water before coffee" },
        { time: "Midday", pct: 0.3, tip: "Sip consistently with meals" },
        { time: "Afternoon", pct: 0.25, tip: "Refill after any exercise" },
        { time: "Evening", pct: 0.2, tip: "Moderate before bedtime" },
      ]
    : [];

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

            <AnimatePresence>
              {result && (
                <motion.div
                  ref={resultRef}
                  className="mt-8 calculator-result"
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Water fill visual */}
                  <WaterFill
                    percentage={Math.min((result / 150) * 100, 100)}
                    ozValue={result}
                    size={180}
                    className="mx-auto"
                  />

                  <div className="mt-3 text-center">
                    <p className="text-sm text-graphite-400">
                      That&apos;s about <strong className="text-navy">{Math.round(result / 8)} glasses</strong> or{" "}
                      <strong className="text-navy">{(result * 0.0296).toFixed(1)}L</strong>
                    </p>
                  </div>

                  {/* Water bottle count */}
                  <motion.div
                    className="mt-5 rounded-xl bg-white/80 p-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-xs font-medium text-graphite-500 mb-2">
                      That&apos;s about <strong className="text-navy">{bottles} standard water bottles</strong> (16.9 oz)
                    </p>
                    <div className="flex justify-center gap-1 flex-wrap">
                      {Array.from({ length: Math.min(bottles, 10) }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="text-2xl"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 300 }}
                        >
                          💧
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Hourly timeline */}
                  <motion.div
                    className="mt-4 rounded-xl bg-white/80 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <p className="text-sm font-medium text-navy mb-3">Spread throughout your day</p>
                    <div className="space-y-3">
                      {timeSlots.map((slot, i) => {
                        const oz = Math.round(result * slot.pct);
                        const barPct = slot.pct * 100 * 3.3; // Scale for visual
                        return (
                          <div key={slot.time}>
                            <div className="flex items-center justify-between mb-1">
                              <div>
                                <p className="text-sm font-medium text-navy">{slot.time}</p>
                                <p className="text-[10px] text-graphite-400">{slot.tip}</p>
                              </div>
                              <span className="text-sm font-bold text-teal">{oz} oz</span>
                            </div>
                            <div className="h-2 rounded-full bg-navy-50 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-teal to-teal-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${barPct}%` }}
                                transition={{ duration: 0.6, delay: 0.8 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>

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
                </motion.div>
              )}
            </AnimatePresence>
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
