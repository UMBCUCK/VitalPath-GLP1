"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { calculateBMI, bmiCategory } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function BMICalculatorPage() {
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<{ bmi: number; category: string } | null>(null);

  function handleCalculate() {
    const ft = parseInt(heightFeet);
    const inc = parseInt(heightInches || "0");
    const w = parseFloat(weight);

    if (isNaN(ft) || isNaN(w) || ft < 3 || w < 50) return;

    const totalInches = ft * 12 + inc;
    const bmi = calculateBMI(w, totalInches);
    const category = bmiCategory(bmi);
    setResult({ bmi: Math.round(bmi * 10) / 10, category });

    track(ANALYTICS_EVENTS.CALCULATOR_COMPLETE, {
      calculator: "bmi",
      bmi_result: Math.round(bmi * 10) / 10,
      bmi_category: category,
    });
  }

  const bmiRanges = [
    { label: "Underweight", range: "< 18.5", color: "bg-blue-100 text-blue-700" },
    { label: "Normal weight", range: "18.5 - 24.9", color: "bg-emerald-100 text-emerald-700" },
    { label: "Overweight", range: "25 - 29.9", color: "bg-amber-100 text-amber-700" },
    { label: "Obesity Class I", range: "30 - 34.9", color: "bg-orange-100 text-orange-700" },
    { label: "Obesity Class II", range: "35 - 39.9", color: "bg-red-100 text-red-700" },
    { label: "Obesity Class III", range: "40+", color: "bg-red-200 text-red-800" },
  ];

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
            {result && (
              <div className="mt-8 calculator-result">
                <div className="text-center">
                  <p className="text-sm font-medium text-teal-700">Your BMI</p>
                  <p className="mt-1 text-5xl font-bold text-navy">{result.bmi}</p>
                  <Badge
                    variant={result.bmi < 25 ? "success" : result.bmi < 30 ? "warning" : "destructive"}
                    className="mt-3"
                  >
                    {result.category}
                  </Badge>
                </div>

                {/* BMI ranges */}
                <div className="mt-6 space-y-2">
                  {bmiRanges.map((r) => (
                    <div
                      key={r.label}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-4 py-2 text-sm transition-all",
                        result.category === r.label ? r.color + " font-semibold ring-2 ring-offset-1 ring-navy-200" : "bg-white text-graphite-500"
                      )}
                    >
                      <span>{r.label}</span>
                      <span className="font-mono text-xs">{r.range}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-start gap-2 rounded-xl bg-white/80 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
                  <p className="text-xs leading-relaxed text-graphite-400">
                    BMI is a screening tool, not a diagnostic measure. It does not account for
                    muscle mass, bone density, body composition, or other health factors. A licensed
                    provider considers multiple factors when evaluating treatment options.
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <Link href="/quiz">
                    <Button className="gap-2">
                      See if you qualify for treatment
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
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
