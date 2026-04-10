"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Info,
  Save,
  Check,
  Scale,
  Flame,
  Target,
  Droplets,
  TrendingDown,
  Calendar,
  Zap,
  LogIn,
  Copy,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
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
import type { ProjectionResult } from "@/lib/weight-projection";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { AnimatedCounter } from "@/components/calculators/animated-counter";
import { AnimatedGauge, type GaugeZone } from "@/components/calculators/animated-gauge";
import { WeightSlider } from "@/components/calculators/weight-slider";
import { DonutChart } from "@/components/calculators/donut-chart";
import { TimelineChart, type TimelineDataPoint } from "@/components/calculators/timeline-chart";
import { WaterFill } from "@/components/calculators/water-fill";

// ─── Constants ────────────────────────────────────────────────

const bmiZones: GaugeZone[] = [
  { from: 0, to: 18.5, color: "#60A5FA", label: "Underweight" },
  { from: 18.5, to: 25, color: "#10B981", label: "Normal" },
  { from: 25, to: 30, color: "#F59E0B", label: "Overweight" },
  { from: 30, to: 35, color: "#F97316", label: "Obese I" },
  { from: 35, to: 40, color: "#EF4444", label: "Obese II" },
  { from: 40, to: 55, color: "#B91C1C", label: "Obese III" },
];

const MACRO_COLORS = { protein: "#1F6F78", carbs: "#D4A853", fat: "#163A63" };

const foodEquivalents = [
  { icon: "🍗", name: "Chicken breasts", grams: 31 },
  { icon: "🥚", name: "Eggs", grams: 6 },
  { icon: "🥛", name: "Greek yogurt cups", grams: 17 },
  { icon: "💪", name: "Protein scoops", grams: 25 },
];

// ─── Types ────────────────────────────────────────────────────

interface AllResults {
  bmi: number;
  bmiCategory: string;
  healthyWeight: { min: number; max: number };
  toLose: number;
  tdee: number;
  macros: { protein: { grams: number; pct: number }; carbs: { grams: number; pct: number }; fat: { grams: number; pct: number } };
  protein: { min: number; max: number };
  waterOz: number;
  projection: ProjectionResult;
  chartData: TimelineDataPoint[];
  dietAlone: number[];
  weeksToGoal: number;
  targetDate: string;
}

// ─── Component ────────────────────────────────────────────────

export default function CompleteCalculatorPage() {
  // Inputs
  const [currentWeight, setCurrentWeight] = useState(200);
  const [goalWeight, setGoalWeight] = useState(160);
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("6");
  const [age, setAge] = useState("35");
  const [sex, setSex] = useState<"male" | "female">("female");
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "active">("moderate");
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("lose");

  // State
  const [results, setResults] = useState<AllResults | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Pre-fill from account on mount
  useEffect(() => {
    fetch("/api/health-profile")
      .then((r) => {
        if (!r.ok) throw new Error("not ok");
        return r.json();
      })
      .then((data) => {
        if (data?.profile) {
          setIsLoggedIn(true);
          const p = data.profile;
          if (p.weightLbs) setCurrentWeight(Math.round(p.weightLbs));
          if (p.goalWeightLbs) setGoalWeight(Math.round(p.goalWeightLbs));
          if (p.heightInches) {
            setHeightFeet(String(Math.floor(p.heightInches / 12)));
            setHeightInches(String(p.heightInches % 12));
          }
        }
        setProfileLoaded(true);
      })
      .catch(() => setProfileLoaded(true));
  }, []);

  function calculateAll() {
    const ft = parseInt(heightFeet);
    const inc = parseInt(heightInches || "0");
    const a = parseInt(age);
    if (isNaN(ft) || isNaN(a)) return;
    setCalculating(true);

    const totalInches = ft * 12 + inc;
    const bmi = calculateBMI(currentWeight, totalInches);
    const category = bmiCategory(bmi);
    const healthyMin = Math.round((18.5 * totalInches * totalInches) / 703);
    const healthyMax = Math.round((24.9 * totalInches * totalInches) / 703);
    const toLose = bmi >= 25 ? Math.round(currentWeight - healthyMax) : 0;

    const tdeeActivity = activity === "active" ? "active" : activity === "moderate" ? "moderate" : activity === "light" ? "light" : "sedentary";
    const tdee = calculateTDEE(currentWeight, totalInches, a, sex, tdeeActivity);
    const lossCal = tdee - 500;
    const macros = calculateMacros(lossCal, "lose");

    const proteinActivity = activity === "active" || activity === "moderate" ? "moderate" : "low";
    const protein = calculateProtein(currentWeight, proteinActivity, goal);
    const waterActivity = activity === "active" ? "high" : activity === "moderate" ? "moderate" : "low";
    const waterOz = calculateHydration(currentWeight, waterActivity);

    const projection = generateProjection({
      currentWeight,
      heightInches: totalInches,
      age: a,
      sex,
      activityLevel: activity,
      goalWeight: goalWeight < currentWeight ? goalWeight : undefined,
    });
    const dietAlone = generateDietAloneProjection(currentWeight, 18);
    const chartData: TimelineDataPoint[] = projection.monthlyData.map((dp, i) => ({
      month: dp.month,
      date: dp.date,
      withGlp1: dp.withPlan,
      dietAlone: dietAlone[i] ?? dietAlone[dietAlone.length - 1],
    }));

    const weeksToGoal = Math.round(projection.summary.timelineMonths * 4.3);

    setResults({
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory: category,
      healthyWeight: { min: healthyMin, max: healthyMax },
      toLose,
      tdee,
      macros,
      protein,
      waterOz,
      projection,
      chartData,
      dietAlone,
      weeksToGoal,
      targetDate: projection.summary.targetDate,
    });

    setSaved(false);
    track(ANALYTICS_EVENTS.CALCULATOR_COMPLETE, { calculator: "complete" });
    setTimeout(() => {
      setCalculating(false);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }

  function copyResults() {
    if (!results) return;
    const text = [
      `My Health Profile (Nature's Journey)`,
      `BMI: ${results.bmi} (${results.bmiCategory})`,
      `Daily Calories (TDEE): ${results.tdee}`,
      `Weight Loss Target: ${results.tdee - 500} cal/day`,
      `Protein: ${results.protein.min}-${results.protein.max}g/day`,
      `Water: ${results.waterOz}oz/day (${Math.round(results.waterOz / 8)} glasses)`,
      `Macros (loss): ${results.macros.protein.grams}g protein, ${results.macros.carbs.grams}g carbs, ${results.macros.fat.grams}g fat`,
      results.weeksToGoal > 0 ? `Projected timeline: ~${results.weeksToGoal} weeks to goal` : "",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    if (!results) return;
    setSaving(true);
    try {
      const totalInches = parseInt(heightFeet) * 12 + parseInt(heightInches || "0");
      const res = await fetch("/api/health-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weightLbs: currentWeight,
          heightInches: totalInches,
          goalWeightLbs: goalWeight < currentWeight ? goalWeight : undefined,
          bmi: results.bmi,
          tdee: results.tdee,
          proteinMin: results.protein.min,
          proteinMax: results.protein.max,
          waterOz: results.waterOz,
          macros: {
            protein: results.macros.protein.grams,
            carbs: results.macros.carbs.grams,
            fat: results.macros.fat.grams,
          },
        }),
      });
      if (res.ok) {
        setSaved(true);
        setIsLoggedIn(true);
      }
    } catch { /* ignore */ }
    setSaving(false);
  }

  const avgProtein = results ? Math.round((results.protein.min + results.protein.max) / 2) : 0;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-14 sm:py-20">
        <SectionShell className="text-center">
          <Badge variant="gold" className="mb-6">All-in-One</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-5xl">
            Your Complete Health Profile
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-graphite-500">
            Enter your stats once. Get your BMI, calories, protein, hydration, and weight loss
            timeline — all personalized, all in one place.
          </p>
          {profileLoaded && isLoggedIn && (
            <p className="mt-3 text-sm text-teal font-medium">
              <Check className="inline h-4 w-4 mr-1" />
              Pre-filled from your account
            </p>
          )}
        </SectionShell>
      </section>

      {/* Input form */}
      <section className="py-10">
        <SectionShell className="max-w-3xl">
          <div className="rounded-2xl border border-navy-100/60 bg-white p-6 sm:p-8 shadow-premium-md">
            <h2 className="text-lg font-bold text-navy mb-6">Your Stats</h2>

            <div className="space-y-8">
              <WeightSlider
                value={currentWeight}
                onChange={setCurrentWeight}
                min={100}
                max={400}
                label="Current Weight"
              />

              <WeightSlider
                value={goalWeight}
                onChange={(v) => setGoalWeight(Math.min(v, currentWeight - 10))}
                min={100}
                max={Math.max(currentWeight - 10, 110)}
                label="Goal Weight"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Height</label>
                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <input type="number" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)} className="calculator-input text-sm py-2.5 pr-7" min={3} max={8} />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-graphite-400">ft</span>
                    </div>
                    <div className="relative flex-1">
                      <input type="number" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} className="calculator-input text-sm py-2.5 pr-7" min={0} max={11} />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-graphite-400">in</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="calculator-input text-sm py-2.5" min={18} max={99} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Sex</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["female", "male"] as const).map((s) => (
                      <button key={s} type="button" onClick={() => setSex(s)}
                        className={`rounded-lg border-2 py-2.5 text-xs font-medium transition-all ${sex === s ? "border-teal bg-teal-50 text-teal-800" : "border-navy-200 text-graphite-500"}`}>
                        {s === "female" ? "Female" : "Male"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Activity</label>
                  <select value={activity} onChange={(e) => setActivity(e.target.value as typeof activity)} className="calculator-input text-sm py-2.5">
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Primary Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "lose" as const, label: "Lose Weight" },
                    { value: "maintain" as const, label: "Maintain" },
                    { value: "gain" as const, label: "Build Muscle" },
                  ]).map((g) => (
                    <button key={g.value} type="button" onClick={() => setGoal(g.value)}
                      className={`rounded-xl border-2 py-2.5 text-xs font-medium transition-all ${
                        goal === g.value ? "border-teal bg-teal-50 text-teal-800" : "border-navy-200 text-graphite-500"
                      }`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button size="lg" className="w-full text-lg py-6" onClick={calculateAll} disabled={calculating}>
                {calculating ? (
                  <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Calculating...</>
                ) : results ? (
                  "Recalculate"
                ) : (
                  "Get My Health Profile"
                )}
              </Button>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* All Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Sticky section nav */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-navy-100/30 py-2.5">
              <SectionShell className="max-w-3xl">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {[
                    { id: "bmi", icon: Scale, label: "BMI" },
                    { id: "tdee", icon: Flame, label: "Calories" },
                    { id: "protein", icon: Target, label: "Protein" },
                    { id: "hydration", icon: Droplets, label: "Water" },
                    { id: "timeline", icon: TrendingDown, label: "Timeline" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-graphite-500 hover:bg-teal-50 hover:text-teal transition-colors whitespace-nowrap shrink-0"
                    >
                      <s.icon className="h-3.5 w-3.5" />
                      {s.label}
                    </button>
                  ))}
                  <div className="flex-1" />
                  <button
                    onClick={copyResults}
                    className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-graphite-500 hover:bg-teal-50 hover:text-teal transition-colors shrink-0"
                  >
                    {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                  </button>
                </div>
              </SectionShell>
            </div>

            {/* ─── BMI Section ─── */}
            <section id="section-bmi" className="py-10 border-t border-navy-100/30 scroll-mt-16">
              <SectionShell className="max-w-3xl">
                <div className="flex items-center gap-2 mb-6">
                  <Scale className="h-5 w-5 text-teal" />
                  <h2 className="text-xl font-bold text-navy">Body Mass Index</h2>
                </div>
                <motion.div
                  className="calculator-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <AnimatedGauge value={results.bmi} min={12} max={50} zones={bmiZones} size={260} label={results.bmiCategory} className="mx-auto" />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/80 p-3 text-center">
                      <p className="text-xs text-graphite-400">Healthy range</p>
                      <p className="text-sm font-bold text-navy">{results.healthyWeight.min}&ndash;{results.healthyWeight.max} lbs</p>
                    </div>
                    {results.toLose > 0 && (
                      <div className="rounded-xl bg-white/80 p-3 text-center">
                        <p className="text-xs text-graphite-400">To healthy BMI</p>
                        <p className="text-sm font-bold text-teal"><AnimatedCounter value={results.toLose} suffix=" lbs" /></p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </SectionShell>
            </section>

            {/* ─── TDEE + Macros Section ─── */}
            <section id="section-tdee" className="py-10 border-t border-navy-100/30 bg-navy-50/10 scroll-mt-16">
              <SectionShell className="max-w-3xl">
                <div className="flex items-center gap-2 mb-6">
                  <Flame className="h-5 w-5 text-gold-600" />
                  <h2 className="text-xl font-bold text-navy">Daily Calories & Macros</h2>
                </div>
                <motion.div
                  className="calculator-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-center mb-4">
                    <p className="text-sm text-teal-700">Your TDEE (maintenance)</p>
                    <div className="text-4xl font-bold text-navy"><AnimatedCounter value={results.tdee} /></div>
                    <p className="text-xs text-graphite-400">calories/day</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Weight Loss", cal: results.tdee - 500, active: true },
                      { label: "Maintenance", cal: results.tdee, active: false },
                      { label: "Weight Gain", cal: results.tdee + 500, active: false },
                    ].map((t) => (
                      <div key={t.label} className={`rounded-xl p-3 text-center ${t.active ? "bg-white ring-2 ring-teal/20" : "bg-white/60"}`}>
                        <p className={`text-[10px] font-medium ${t.active ? "text-teal-700" : "text-graphite-400"}`}>{t.label}</p>
                        <p className="text-lg font-bold text-navy">{t.cal.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <DonutChart
                    data={[
                      { name: "Protein", value: results.macros.protein.grams, color: MACRO_COLORS.protein },
                      { name: "Carbs", value: results.macros.carbs.grams, color: MACRO_COLORS.carbs },
                      { name: "Fat", value: results.macros.fat.grams, color: MACRO_COLORS.fat },
                    ]}
                    size={180}
                    centerValue={`${(results.tdee - 500).toLocaleString()}`}
                    centerLabel="cal (loss)"
                  />
                </motion.div>
              </SectionShell>
            </section>

            {/* ─── Protein Section ─── */}
            <section id="section-protein" className="py-10 border-t border-navy-100/30 scroll-mt-16">
              <SectionShell className="max-w-3xl">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="h-5 w-5 text-atlantic" />
                  <h2 className="text-xl font-bold text-navy">Daily Protein Target</h2>
                </div>
                <motion.div
                  className="calculator-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-navy">
                      <AnimatedCounter value={results.protein.min} />&ndash;<AnimatedCounter value={results.protein.max} />g
                    </div>
                    <p className="text-xs text-graphite-400">grams per day</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {foodEquivalents.map((food) => {
                      const count = Math.round(avgProtein / food.grams);
                      return (
                        <div key={food.name} className="rounded-lg bg-white/80 p-2.5 text-center">
                          <span className="text-xl">{food.icon}</span>
                          <p className="text-lg font-bold text-navy mt-0.5">{count}</p>
                          <p className="text-[9px] text-graphite-400 leading-tight">{food.name}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    {[3, 4, 5].map((meals) => (
                      <div key={meals} className="rounded-lg bg-white/60 p-2">
                        <p className="text-base font-bold text-navy">{Math.round(results.protein.min / meals)}g</p>
                        <p className="text-[10px] text-graphite-400">per meal ({meals} meals)</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </SectionShell>
            </section>

            {/* ─── Hydration Section ─── */}
            <section id="section-hydration" className="py-10 border-t border-navy-100/30 bg-navy-50/10 scroll-mt-16">
              <SectionShell className="max-w-3xl">
                <div className="flex items-center gap-2 mb-6">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xl font-bold text-navy">Daily Hydration</h2>
                </div>
                <motion.div
                  className="calculator-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <WaterFill
                    percentage={Math.min((results.waterOz / 150) * 100, 100)}
                    ozValue={results.waterOz}
                    size={160}
                    className="mx-auto"
                  />
                  <div className="mt-3 text-center text-sm text-graphite-400">
                    <strong className="text-navy">{Math.round(results.waterOz / 8)} glasses</strong> &middot;{" "}
                    <strong className="text-navy">{(results.waterOz * 0.0296).toFixed(1)}L</strong> &middot;{" "}
                    <strong className="text-navy">{Math.round(results.waterOz / 16.9)} bottles</strong>
                  </div>
                </motion.div>
              </SectionShell>
            </section>

            {/* ─── Timeline Section ─── */}
            <section id="section-timeline" className="py-10 border-t border-navy-100/30 scroll-mt-16">
              <SectionShell className="max-w-3xl">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingDown className="h-5 w-5 text-teal" />
                  <h2 className="text-xl font-bold text-navy">Weight Loss Timeline</h2>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { icon: Target, label: "To lose", value: Math.round(currentWeight - goalWeight), suffix: " lbs", color: "text-teal", bg: "bg-teal-50" },
                    { icon: Calendar, label: "Estimated", value: results.weeksToGoal, suffix: " wks", color: "text-atlantic", bg: "bg-atlantic/5" },
                    { icon: Zap, label: "Target", text: results.targetDate, color: "text-gold-600", bg: "bg-gold-50" },
                    { icon: TrendingDown, label: "GLP-1 total", value: Math.round(results.projection.summary.totalLossWithPlan), suffix: " lbs", color: "text-emerald-600", bg: "bg-emerald-50" },
                  ].map((card, i) => (
                    <motion.div key={card.label} className={`rounded-xl ${card.bg} border border-navy-100/40 p-3 text-center`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}>
                      <card.icon className={`mx-auto h-4 w-4 ${card.color} mb-1`} />
                      {"value" in card ? (
                        <p className="text-xl font-bold text-navy"><AnimatedCounter value={card.value as number} suffix={card.suffix} /></p>
                      ) : (
                        <p className="text-base font-bold text-navy">{card.text}</p>
                      )}
                      <p className="text-[9px] text-graphite-400">{card.label}</p>
                    </motion.div>
                  ))}
                </div>

                <TimelineChart data={results.chartData} currentWeight={currentWeight} goalWeight={goalWeight < currentWeight ? goalWeight : undefined} showComparison={true} />

                {/* Milestones */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {results.projection.milestones.map((m) => (
                    <div key={m.month} className="rounded-xl border border-navy-100/60 bg-white p-3 text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">Month {m.month}</p>
                      <p className="text-xl font-bold text-navy">{Math.round(m.weightWithPlan)}</p>
                      <Badge variant="default" className="mt-1 text-[10px]">-{Math.round(m.totalLostWithPlan)} lbs</Badge>
                    </div>
                  ))}
                </div>
              </SectionShell>
            </section>

            {/* ─── Save / CTA Section ─── */}
            <section className="py-10 border-t border-navy-100/30 bg-gradient-to-b from-sage/20 to-cloud">
              <SectionShell className="max-w-3xl">
                <div className="rounded-2xl border border-navy-100/60 bg-white p-6 sm:p-8 shadow-premium-md text-center space-y-4">
                  <h2 className="text-xl font-bold text-navy">Save Your Health Profile</h2>
                  <p className="text-sm text-graphite-500 max-w-md mx-auto">
                    Save these numbers to your account to track changes over time and share with your care team.
                  </p>

                  {isLoggedIn ? (
                    <Button
                      size="lg"
                      className="gap-2 px-8"
                      onClick={handleSave}
                      disabled={saving || saved}
                    >
                      {saved ? (
                        <><Check className="h-4 w-4" /> Saved to Your Account</>
                      ) : saving ? (
                        "Saving..."
                      ) : (
                        <><Save className="h-4 w-4" /> Save to My Account</>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/register">
                        <Button size="lg" className="gap-2 px-8">
                          <LogIn className="h-4 w-4" /> Create Account to Save
                        </Button>
                      </Link>
                      <p className="text-xs text-graphite-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-teal hover:underline font-medium">Sign in</Link>
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-navy-100/30">
                    <Link href="/qualify">
                      <Button variant="outline" size="lg" className="gap-2">
                        Start Your Journey <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <p className="text-xs text-graphite-400 mt-2">
                      Free assessment &middot; No commitment &middot; HIPAA protected
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-start gap-2 rounded-xl bg-navy-50/30 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
                  <p className="text-xs leading-relaxed text-graphite-400">
                    These calculations use evidence-based formulas (Mifflin-St Jeor for TDEE, standard BMI formula) and
                    clinical trial data (STEP 1-4, SURMOUNT 1-4) for timeline projections. Individual results vary.
                    A licensed provider will personalize your plan.
                  </p>
                </div>
              </SectionShell>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
