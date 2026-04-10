"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { calculateBMI, bmiCategory } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { AnimatedGauge, type GaugeZone } from "@/components/calculators/animated-gauge";
import { AnimatedCounter } from "@/components/calculators/animated-counter";

const bmiZones: GaugeZone[] = [
  { from: 0, to: 18.5, color: "#60A5FA", label: "Underweight" },
  { from: 18.5, to: 25, color: "#10B981", label: "Normal" },
  { from: 25, to: 30, color: "#F59E0B", label: "Overweight" },
  { from: 30, to: 35, color: "#F97316", label: "Obese I" },
  { from: 35, to: 40, color: "#EF4444", label: "Obese II" },
  { from: 40, to: 55, color: "#B91C1C", label: "Obese III" },
];

// CDC population distribution by BMI category (approximate)
const populationStats: Record<string, string> = {
  Underweight: "1.5% of U.S. adults",
  "Normal weight": "31% of U.S. adults",
  Overweight: "34% of U.S. adults",
  "Obesity Class I": "20% of U.S. adults",
  "Obesity Class II": "9% of U.S. adults",
  "Obesity Class III": "5.5% of U.S. adults",
};

export default function BMICalculatorPage() {
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    healthyWeight: { min: number; max: number };
    toLose: number;
  } | null>(null);

  function handleCalculate() {
    const ft = parseInt(heightFeet);
    const inc = parseInt(heightInches || "0");
    const w = parseFloat(weight);

    if (isNaN(ft) || isNaN(w) || ft < 3 || w < 50) return;

    const totalInches = ft * 12 + inc;
    const bmi = calculateBMI(w, totalInches);
    const category = bmiCategory(bmi);

    // Calculate healthy weight range for this height
    const healthyMin = Math.round((18.5 * totalInches * totalInches) / 703);
    const healthyMax = Math.round((24.9 * totalInches * totalInches) / 703);
    const toLose = bmi >= 25 ? Math.round(w - healthyMax) : 0;

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      healthyWeight: { min: healthyMin, max: healthyMax },
      toLose,
    });

    track(ANALYTICS_EVENTS.CALCULATOR_COMPLETE, {
      calculator: "bmi",
      bmi_result: Math.round(bmi * 10) / 10,
      bmi_category: category,
    });
  }

  return (
    <>
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-20">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">
            Health Calculator
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            BMI Calculator
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-graphite-500">
            Calculate your body mass index. BMI is one of many factors providers consider
            when evaluating treatment options.
          </p>
        </SectionShell>
      </section>

      <section className="py-12">
        <SectionShell className="max-w-2xl">
          <div className="rounded-2xl border border-navy-100/60 bg-white p-8 shadow-premium-md">
            <div className="space-y-6">
              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Height</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="5"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        className="calculator-input pr-10"
                        min={3}
                        max={8}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">ft</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="8"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        className="calculator-input pr-10"
                        min={0}
                        max={11}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">in</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="180"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="calculator-input pr-12"
                    min={50}
                    max={700}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">lbs</span>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleCalculate}>
                Calculate My BMI
              </Button>
              <p className="mt-2 text-center text-xs text-graphite-400">
                87% of adults with BMI 27+ qualify for GLP-1 treatment
              </p>
            </div>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  className="mt-8 calculator-result"
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Animated Gauge */}
                  <AnimatedGauge
                    value={result.bmi}
                    min={12}
                    max={50}
                    zones={bmiZones}
                    size={280}
                    label={result.category}
                    className="mx-auto"
                  />

                  {/* Population context */}
                  <motion.div
                    className="mt-5 rounded-xl bg-white/80 p-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-sm text-graphite-500">
                      <span className="font-semibold text-navy">{populationStats[result.category]}</span>{" "}
                      are in this BMI range
                    </p>
                  </motion.div>

                  {/* Healthy weight insight */}
                  {result.toLose > 0 ? (
                    <motion.div
                      className="mt-4 rounded-xl border border-teal-100 bg-teal-50/60 p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-sm text-graphite-600 text-center">
                        Healthy weight for your height:{" "}
                        <strong className="text-navy">{result.healthyWeight.min}&ndash;{result.healthyWeight.max} lbs</strong>
                      </p>
                      <p className="mt-2 text-center text-2xl font-bold text-teal">
                        <AnimatedCounter value={result.toLose} /> lbs
                      </p>
                      <p className="text-xs text-graphite-400 text-center mt-1">to reach the healthy BMI range</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-sm font-medium text-emerald-700">
                        You&apos;re within the healthy weight range for your height
                      </p>
                      <p className="text-xs text-graphite-400 mt-1">
                        Healthy range: {result.healthyWeight.min}&ndash;{result.healthyWeight.max} lbs
                      </p>
                    </motion.div>
                  )}

                  <div className="mt-6 flex items-start gap-2 rounded-xl bg-white/80 p-4">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
                    <p className="text-xs leading-relaxed text-graphite-400">
                      BMI is a screening tool, not a diagnostic measure. It does not account for
                      muscle mass, bone density, body composition, or other health factors. A licensed
                      provider considers multiple factors when evaluating treatment options.
                    </p>
                  </div>

                  <div className="mt-6 text-center">
                    <Link href="/qualify">
                      <Button className="gap-2">
                        See if you qualify for treatment
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
            <h2 className="text-lg font-bold text-navy">Understanding Your BMI</h2>
            <p className="text-sm leading-relaxed text-graphite-500">
              Body Mass Index is a screening tool that uses your height and weight to estimate body fat.
              While BMI doesn&apos;t measure body fat directly, it correlates with more direct measures
              and is used by healthcare providers as an initial assessment tool.
            </p>
            <p className="text-sm leading-relaxed text-graphite-500">
              A BMI of 27 or higher with weight-related health conditions, or 30 or higher, may indicate
              eligibility for medical weight management programs including GLP-1 medication.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link href="/eligibility" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Check eligibility criteria →
              </Link>
              <Link href="/calculators/tdee" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Calculate daily calories →
              </Link>
              <Link href="/calculators/protein" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Find your protein target →
              </Link>
              <Link href="/blog/how-to-lose-30-pounds" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                How to lose 30 pounds →
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
