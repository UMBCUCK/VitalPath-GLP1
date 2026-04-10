"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Scale, Flame, Target, Droplets, TrendingDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  calculateBMI,
  bmiCategory,
  calculateTDEE,
  calculateMacros,
  calculateProtein,
  calculateHydration,
  generateDietAloneProjection,
} from "@/lib/utils";
import { generateProjection } from "@/lib/weight-projection";
import { AnimatedCounter } from "@/components/calculators/animated-counter";
import { AnimatedGauge, type GaugeZone } from "@/components/calculators/animated-gauge";
import { DonutChart } from "@/components/calculators/donut-chart";
import { TimelineChart, type TimelineDataPoint } from "@/components/calculators/timeline-chart";
import { WaterFill } from "@/components/calculators/water-fill";

const bmiZones: GaugeZone[] = [
  { from: 0, to: 18.5, color: "#60A5FA", label: "Underweight" },
  { from: 18.5, to: 25, color: "#10B981", label: "Normal" },
  { from: 25, to: 30, color: "#F59E0B", label: "Overweight" },
  { from: 30, to: 35, color: "#F97316", label: "Obese I" },
  { from: 35, to: 40, color: "#EF4444", label: "Obese II" },
  { from: 40, to: 55, color: "#B91C1C", label: "Obese III" },
];

const MACRO_COLORS = { protein: "#1F6F78", carbs: "#D4A853", fat: "#163A63" };

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface Results {
  bmi: number;
  bmiCat: string;
  tdee: number;
  protein: { min: number; max: number };
  waterOz: number;
  macros: { protein: { grams: number; pct: number }; carbs: { grams: number; pct: number }; fat: { grams: number; pct: number } };
  chartData: TimelineDataPoint[];
  weeksToGoal: number;
  totalLoss: number;
  targetDate: string;
}

export default function EmbedCalculatorPage() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "";
  const theme = searchParams.get("theme") || "light";
  const hideTimeline = searchParams.get("hideTimeline") === "1";
  const partnerName = searchParams.get("partner") || "";

  const [step, setStep] = useState<"input" | "results">("input");
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("female");
  const [activity, setActivity] = useState<"sedentary" | "moderate" | "active">("moderate");
  const [results, setResults] = useState<Results | null>(null);

  // Build the CTA URL with referral attribution
  const ctaUrl = `${APP_URL}/qualify${refCode ? `?ref=${refCode}` : ""}`;

  function handleCalculate() {
    const ft = parseInt(heightFeet);
    const inc = parseInt(heightInches || "0");
    const w = parseFloat(currentWeight);
    const gw = parseFloat(goalWeight);
    const a = parseInt(age);
    if (isNaN(ft) || isNaN(w) || isNaN(a) || ft < 3 || w < 80) return;

    const totalInches = ft * 12 + inc;
    const bmi = calculateBMI(w, totalInches);
    const tdee = calculateTDEE(w, totalInches, a, sex, activity === "active" ? "active" : activity === "moderate" ? "moderate" : "sedentary");
    const macros = calculateMacros(tdee - 500, "lose");
    const proteinAct = activity === "active" ? "high" : activity === "moderate" ? "moderate" : "low";
    const protein = calculateProtein(w, proteinAct, "lose");
    const waterAct = activity === "active" ? "high" : activity === "moderate" ? "moderate" : "low";
    const waterOz = calculateHydration(w, waterAct);

    const validGoal = !isNaN(gw) && gw < w ? gw : undefined;
    const projection = generateProjection({
      currentWeight: w,
      heightInches: totalInches,
      age: a,
      sex,
      activityLevel: activity === "active" ? "active" : activity === "moderate" ? "moderate" : "sedentary",
      goalWeight: validGoal,
    });
    const dietAlone = generateDietAloneProjection(w, 18);
    const chartData: TimelineDataPoint[] = projection.monthlyData.map((dp, i) => ({
      month: dp.month,
      date: dp.date,
      withGlp1: dp.withPlan,
      dietAlone: dietAlone[i] ?? dietAlone[dietAlone.length - 1],
    }));

    setResults({
      bmi: Math.round(bmi * 10) / 10,
      bmiCat: bmiCategory(bmi),
      tdee,
      protein,
      waterOz,
      macros,
      chartData,
      weeksToGoal: Math.round(projection.summary.timelineMonths * 4.3),
      totalLoss: Math.round(projection.summary.totalLossWithPlan),
      targetDate: projection.summary.targetDate,
    });
    setStep("results");

    // Notify parent window about calculation for analytics
    if (window.parent !== window) {
      window.parent.postMessage({ type: "vitalpath-calculator", event: "calculated", ref: refCode }, "*");
    }
  }

  const isDark = theme === "dark";
  const bg = isDark ? "bg-[#1a1f2e]" : "bg-white";
  const text = isDark ? "text-white" : "text-navy";
  const subtext = isDark ? "text-gray-400" : "text-graphite-500";
  const border = isDark ? "border-gray-700" : "border-navy-100/60";
  const inputBg = isDark ? "bg-gray-800 border-gray-600 text-white placeholder:text-gray-500" : "calculator-input";

  return (
    <div className={`min-h-screen ${bg} p-4 sm:p-6`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          {partnerName && (
            <p className={`text-xs ${subtext} mb-1`}>Powered by VitalPath &middot; via {partnerName}</p>
          )}
          <h1 className={`text-2xl sm:text-3xl font-bold ${text}`}>
            {step === "input" ? "Health Profile Calculator" : "Your Health Numbers"}
          </h1>
          <p className={`mt-2 text-sm ${subtext}`}>
            {step === "input"
              ? "Enter your stats to get your personalized BMI, calories, protein, hydration, and weight loss timeline."
              : "Here are your personalized health targets based on clinical formulas."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "input" ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className={`rounded-2xl border ${border} ${isDark ? "bg-gray-800/50" : "bg-white"} p-6 shadow-sm`}
            >
              <div className="space-y-5">
                {/* Weight */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold ${text} mb-1.5`}>Current Weight</label>
                    <div className="relative">
                      <input type="number" placeholder="200" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)}
                        className={`${inputBg} w-full rounded-xl px-4 py-3 text-lg font-medium pr-12 focus:outline-none focus:ring-2 focus:ring-teal/30`} min={80} max={600} />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${subtext}`}>lbs</span>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold ${text} mb-1.5`}>Goal Weight <span className={`font-normal ${subtext}`}>(optional)</span></label>
                    <div className="relative">
                      <input type="number" placeholder="160" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value)}
                        className={`${inputBg} w-full rounded-xl px-4 py-3 text-lg font-medium pr-12 focus:outline-none focus:ring-2 focus:ring-teal/30`} min={80} max={500} />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${subtext}`}>lbs</span>
                    </div>
                  </div>
                </div>

                {/* Height */}
                <div>
                  <label className={`block text-xs font-semibold ${text} mb-1.5`}>Height</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input type="number" placeholder="5" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)}
                        className={`${inputBg} w-full rounded-xl px-4 py-3 text-lg font-medium pr-10 focus:outline-none focus:ring-2 focus:ring-teal/30`} min={3} max={8} />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${subtext}`}>ft</span>
                    </div>
                    <div className="relative flex-1">
                      <input type="number" placeholder="8" value={heightInches} onChange={(e) => setHeightInches(e.target.value)}
                        className={`${inputBg} w-full rounded-xl px-4 py-3 text-lg font-medium pr-10 focus:outline-none focus:ring-2 focus:ring-teal/30`} min={0} max={11} />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${subtext}`}>in</span>
                    </div>
                  </div>
                </div>

                {/* Age + Sex */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold ${text} mb-1.5`}>Age</label>
                    <input type="number" placeholder="35" value={age} onChange={(e) => setAge(e.target.value)}
                      className={`${inputBg} w-full rounded-xl px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-teal/30`} min={18} max={99} />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold ${text} mb-1.5`}>Sex</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["female", "male"] as const).map((s) => (
                        <button key={s} type="button" onClick={() => setSex(s)}
                          className={`rounded-xl border-2 py-3 text-sm font-medium transition-all ${
                            sex === s ? "border-teal bg-teal-50 text-teal-800" : `${border} ${subtext}`
                          }`}>
                          {s === "female" ? "Female" : "Male"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <label className={`block text-xs font-semibold ${text} mb-1.5`}>Activity Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "sedentary", label: "Low" },
                      { value: "moderate", label: "Moderate" },
                      { value: "active", label: "Active" },
                    ] as const).map((a) => (
                      <button key={a.value} type="button" onClick={() => setActivity(a.value)}
                        className={`rounded-xl border-2 py-3 text-sm font-medium transition-all ${
                          activity === a.value ? "border-teal bg-teal-50 text-teal-800" : `${border} ${subtext}`
                        }`}>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button size="lg" className="w-full text-lg py-5" onClick={handleCalculate}>
                  Get My Results
                </Button>
              </div>
            </motion.div>
          ) : results && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Back button */}
              <button onClick={() => setStep("input")} className={`text-sm ${subtext} hover:text-teal transition-colors`}>
                &larr; Edit my stats
              </button>

              {/* Quick summary row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Scale, label: "BMI", value: `${results.bmi}`, sub: results.bmiCat, color: "from-teal-50 to-sage" },
                  { icon: Flame, label: "Calories", value: `${results.tdee}`, sub: "TDEE/day", color: "from-gold-50 to-linen" },
                  { icon: Target, label: "Protein", value: `${results.protein.min}-${results.protein.max}g`, sub: "per day", color: "from-atlantic/5 to-navy-50" },
                  { icon: Droplets, label: "Water", value: `${results.waterOz}oz`, sub: `${Math.round(results.waterOz / 8)} glasses`, color: "from-blue-50 to-teal-50" },
                ].map((card, i) => (
                  <motion.div
                    key={card.label}
                    className={`rounded-xl bg-gradient-to-br ${card.color} p-3 text-center`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <card.icon className="mx-auto h-4 w-4 text-teal mb-1" />
                    <p className="text-lg font-bold text-navy">{card.value}</p>
                    <p className="text-[10px] text-graphite-400">{card.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* BMI Gauge */}
              <div className={`rounded-2xl border ${border} ${isDark ? "bg-gray-800/50" : "bg-gradient-to-br from-teal-50 to-sage"} p-5`}>
                <AnimatedGauge value={results.bmi} min={12} max={50} zones={bmiZones} size={240} label={results.bmiCat} className="mx-auto" />
              </div>

              {/* Macro donut */}
              <div className={`rounded-2xl border ${border} ${isDark ? "bg-gray-800/50" : "bg-white"} p-5`}>
                <p className={`text-sm font-semibold ${text} text-center mb-2`}>Macro Breakdown (Weight Loss)</p>
                <DonutChart
                  data={[
                    { name: "Protein", value: results.macros.protein.grams, color: MACRO_COLORS.protein },
                    { name: "Carbs", value: results.macros.carbs.grams, color: MACRO_COLORS.carbs },
                    { name: "Fat", value: results.macros.fat.grams, color: MACRO_COLORS.fat },
                  ]}
                  size={180}
                  centerValue={`${(results.tdee - 500).toLocaleString()}`}
                  centerLabel="cal/day"
                />
              </div>

              {/* Timeline chart */}
              {!hideTimeline && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-semibold ${text}`}>Weight Loss Projection</p>
                    <Badge variant="default" className="text-[10px]">
                      ~{results.totalLoss} lbs by {results.targetDate}
                    </Badge>
                  </div>
                  <TimelineChart
                    data={results.chartData}
                    currentWeight={parseFloat(currentWeight)}
                    goalWeight={parseFloat(goalWeight) || undefined}
                    showComparison={true}
                  />
                </div>
              )}

              {/* CTA */}
              <motion.div
                className="rounded-2xl bg-gradient-to-r from-teal to-atlantic p-6 text-white text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-lg font-bold">Ready to start your weight loss journey?</p>
                <p className="text-sm text-white/70 mt-1 mb-4">
                  GLP-1 medication from $279/mo &middot; Licensed providers &middot; Delivered to your door
                </p>
                <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-white text-navy hover:bg-white/90 gap-2 text-base px-8">
                    See If I Qualify <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                <p className="text-[10px] text-white/50 mt-3">
                  Free assessment &middot; No commitment &middot; HIPAA protected
                </p>
              </motion.div>

              {/* Powered by */}
              <div className="text-center pt-2">
                <a href={APP_URL} target="_blank" rel="noopener noreferrer" className={`text-[10px] ${subtext} hover:text-teal transition-colors`}>
                  Powered by VitalPath
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
