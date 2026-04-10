"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { calculateTDEE, calculateMacros } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { AnimatedCounter } from "@/components/calculators/animated-counter";
import { DonutChart } from "@/components/calculators/donut-chart";

const activityOptions = [
  { value: "sedentary", label: "Sedentary", description: "Little or no exercise, desk job" },
  { value: "light", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  { value: "moderate", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  { value: "active", label: "Active", description: "Hard exercise 6-7 days/week" },
  { value: "very_active", label: "Very Active", description: "Very hard exercise, physical job" },
] as const;

const MACRO_COLORS = {
  protein: "#1F6F78",
  carbs: "#D4A853",
  fat: "#163A63",
};

type MacroTab = "lose" | "maintain" | "gain";

export default function TDEECalculatorPage() {
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("female");
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "active" | "very_active">("moderate");
  const [result, setResult] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<MacroTab>("lose");

  function handleCalculate() {
    const ft = parseInt(heightFeet);
    const inc = parseInt(heightInches || "0");
    const w = parseFloat(weight);
    const a = parseInt(age);

    if (isNaN(ft) || isNaN(w) || isNaN(a)) return;

    const totalInches = ft * 12 + inc;
    const tdee = calculateTDEE(w, totalInches, a, sex, activity);
    setResult(tdee);

    track(ANALYTICS_EVENTS.CALCULATOR_COMPLETE, {
      calculator: "tdee",
      tdee_result: tdee,
    });
  }

  const calorieTargets = result
    ? { lose: result - 500, maintain: result, gain: result + 500 }
    : null;

  const activeMacros = calorieTargets ? calculateMacros(calorieTargets[activeTab], activeTab) : null;
  const macroChartData = activeMacros
    ? [
        { name: "Protein", value: activeMacros.protein.grams, color: MACRO_COLORS.protein },
        { name: "Carbs", value: activeMacros.carbs.grams, color: MACRO_COLORS.carbs },
        { name: "Fat", value: activeMacros.fat.grams, color: MACRO_COLORS.fat },
      ]
    : [];

  return (
    <>
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-20">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Health Calculator</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">TDEE Calculator</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-graphite-500">
            Estimate your Total Daily Energy Expenditure to understand how many calories your body uses each day.
          </p>
        </SectionShell>
      </section>

      <section className="py-12">
        <SectionShell className="max-w-2xl">
          <div className="rounded-2xl border border-navy-100/60 bg-white p-8 shadow-premium-md">
            <div className="space-y-6">
              {/* Sex */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Sex</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["female", "male"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                        sex === s
                          ? "border-teal bg-teal-50 text-teal-800"
                          : "border-navy-200 bg-white text-graphite-500 hover:border-navy-300"
                      }`}
                    >
                      {s === "female" ? "Female" : "Male"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Age</label>
                <input
                  type="number"
                  placeholder="35"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="calculator-input"
                  min={18}
                  max={99}
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Height</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input type="number" placeholder="5" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)} className="calculator-input pr-10" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">ft</span>
                  </div>
                  <div className="relative flex-1">
                    <input type="number" placeholder="8" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} className="calculator-input pr-10" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">in</span>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Weight</label>
                <div className="relative">
                  <input type="number" placeholder="180" value={weight} onChange={(e) => setWeight(e.target.value)} className="calculator-input pr-12" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">lbs</span>
                </div>
              </div>

              {/* Activity */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Activity Level</label>
                <div className="space-y-2">
                  {activityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setActivity(opt.value)}
                      className={`flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                        activity === opt.value
                          ? "border-teal bg-teal-50"
                          : "border-navy-200 bg-white hover:border-navy-300"
                      }`}
                    >
                      <div className={`mt-0.5 h-4 w-4 rounded-full border-2 transition-all ${
                        activity === opt.value ? "border-teal bg-teal" : "border-navy-300"
                      }`}>
                        {activity === opt.value && <div className="h-full w-full rounded-full bg-white scale-[0.4]" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy">{opt.label}</p>
                        <p className="text-xs text-graphite-400">{opt.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleCalculate}>
                Calculate TDEE
              </Button>
            </div>

            <AnimatePresence>
              {result && calorieTargets && (
                <motion.div
                  className="mt-8 calculator-result"
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-center">
                    <p className="text-sm font-medium text-teal-700">Estimated Daily Calories</p>
                    <div className="mt-1 text-5xl font-bold text-navy">
                      <AnimatedCounter value={result} suffix="" />
                    </div>
                    <p className="mt-1 text-sm text-graphite-400">calories per day</p>
                  </div>

                  {/* Animated calorie bars */}
                  <div className="mt-6 space-y-3">
                    {([
                      { key: "lose" as MacroTab, label: "Weight Loss", cal: calorieTargets.lose, note: "~500 cal deficit", color: "#1F6F78" },
                      { key: "maintain" as MacroTab, label: "Maintenance", cal: calorieTargets.maintain, note: "current level", color: "#8896AB" },
                      { key: "gain" as MacroTab, label: "Weight Gain", cal: calorieTargets.gain, note: "~500 cal surplus", color: "#163A63" },
                    ]).map((item, i) => {
                      const maxCal = calorieTargets.gain;
                      const pct = (item.cal / maxCal) * 100;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setActiveTab(item.key)}
                          className={`w-full rounded-xl p-3 text-left transition-all ${
                            activeTab === item.key
                              ? "bg-white ring-2 ring-teal/30 shadow-sm"
                              : "bg-white/60 hover:bg-white/80"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-medium ${activeTab === item.key ? "text-teal-700" : "text-graphite-500"}`}>
                              {item.label}
                            </span>
                            <span className="text-sm font-bold text-navy">{item.cal.toLocaleString()} cal</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-navy-50 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: item.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                          <p className="mt-1 text-[10px] text-graphite-400">{item.note}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Macro donut chart */}
                  {activeMacros && (
                    <motion.div
                      className="mt-6 rounded-xl bg-white/80 p-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-sm font-semibold text-navy text-center mb-2">
                        Macro Breakdown &mdash; {activeTab === "lose" ? "Weight Loss" : activeTab === "maintain" ? "Maintenance" : "Weight Gain"}
                      </p>
                      <DonutChart
                        data={macroChartData}
                        size={200}
                        centerValue={`${calorieTargets[activeTab].toLocaleString()}`}
                        centerLabel="calories"
                      />
                    </motion.div>
                  )}

                  <div className="mt-6 flex items-start gap-2 rounded-xl bg-white/80 p-4">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
                    <p className="text-xs leading-relaxed text-graphite-400">
                      This is an estimate based on the Mifflin-St Jeor equation. Individual needs vary
                      based on metabolism, body composition, and other factors. Consult with your provider
                      for personalized guidance.
                    </p>
                  </div>

                  <div className="mt-6 rounded-xl bg-teal-50/60 border border-teal-100 p-4 text-center">
                    <p className="text-sm text-graphite-600 mb-3">
                      GLP-1 medication makes maintaining a calorie deficit <span className="font-semibold text-navy">significantly easier</span> by reducing appetite and cravings at the source.
                    </p>
                    <Link href="/qualify">
                      <Button className="gap-2">
                        See If You Qualify
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
            <h2 className="text-lg font-bold text-navy">Using Your TDEE for Weight Loss</h2>
            <p className="text-sm leading-relaxed text-graphite-500">
              Your TDEE is the starting point for any weight loss plan. To lose ~1 pound per week,
              create a 500-calorie daily deficit (eat 500 fewer calories than your TDEE). For ~2
              pounds per week, target a 1,000-calorie deficit — though this should be done under
              medical supervision.
            </p>
            <p className="text-sm leading-relaxed text-graphite-500">
              GLP-1 medications make maintaining a calorie deficit significantly easier by reducing
              appetite and cravings — addressing the biological barriers that make traditional
              calorie restriction unsustainable.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link href="/blog/how-to-lose-30-pounds" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                How to lose 30 pounds →
              </Link>
              <Link href="/blog/why-diets-fail-biology-weight-regain" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Why diets fail →
              </Link>
              <Link href="/blog/break-weight-loss-plateau" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Break through plateaus →
              </Link>
              <Link href="/calculators/protein" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Calculate protein target →
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
