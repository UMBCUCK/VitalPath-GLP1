"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, TrendingDown, Calendar, Target, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { generateDietAloneProjection } from "@/lib/utils";
import { generateProjection } from "@/lib/weight-projection";
import type { ProjectionResult } from "@/lib/weight-projection";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { AnimatedCounter } from "@/components/calculators/animated-counter";
import { WeightSlider } from "@/components/calculators/weight-slider";
import { TimelineChart, type TimelineDataPoint } from "@/components/calculators/timeline-chart";

interface TimelineResult {
  chartData: TimelineDataPoint[];
  projection: ProjectionResult;
  dietAlone: number[];
  weeksToGoal: number;
  totalToLose: number;
  weeklyRate: string;
  targetDate: string;
  goalReachable: boolean;
}

export default function TimelineCalculatorPage() {
  const [currentWeight, setCurrentWeight] = useState(220);
  const [goalWeight, setGoalWeight] = useState(170);
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("8");
  const [age, setAge] = useState("35");
  const [sex, setSex] = useState<"male" | "female">("female");
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "active">("moderate");
  const [result, setResult] = useState<TimelineResult | null>(null);

  function handleCalculate() {
    const ft = parseInt(heightFeet);
    const inc = parseInt(heightInches || "0");
    const a = parseInt(age);
    if (isNaN(ft) || isNaN(a) || currentWeight <= goalWeight) return;

    const totalInches = ft * 12 + inc;

    const projection = generateProjection({
      currentWeight,
      heightInches: totalInches,
      age: a,
      sex,
      activityLevel: activity,
      goalWeight,
    });

    const dietAlone = generateDietAloneProjection(currentWeight, 18);

    // Build chart data
    const chartData: TimelineDataPoint[] = projection.monthlyData.map((dp, i) => ({
      month: dp.month,
      date: dp.date,
      withGlp1: dp.withPlan,
      dietAlone: dietAlone[i] ?? dietAlone[dietAlone.length - 1],
    }));

    // Estimate weeks to goal
    const monthToGoal = projection.summary.timelineMonths;
    const weeksToGoal = monthToGoal * 4.3;

    // Weekly rate (first 3 months average)
    const month3 = projection.monthlyData[Math.min(3, projection.monthlyData.length - 1)];
    const lostIn3Months = currentWeight - month3.withPlan;
    const weeklyRate = (lostIn3Months / (3 * 4.3)).toFixed(1);

    const totalToLose = Math.round(currentWeight - goalWeight);
    const goalReachable = projection.monthlyData.some((d) => d.withPlan <= goalWeight);

    setResult({
      chartData,
      projection,
      dietAlone,
      weeksToGoal: Math.round(weeksToGoal),
      totalToLose,
      weeklyRate: `${weeklyRate}`,
      targetDate: projection.summary.targetDate,
      goalReachable,
    });

    track(ANALYTICS_EVENTS.CALCULATOR_COMPLETE, {
      calculator: "timeline",
      starting_weight: currentWeight,
      goal_weight: goalWeight,
      projected_weeks: Math.round(weeksToGoal),
    });
  }

  return (
    <>
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-20">
        <SectionShell className="text-center">
          <Badge variant="gold" className="mb-6">
            New Calculator
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Weight Loss Timeline
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-graphite-500">
            See your personalized week-by-week projection. Compare GLP-1 medication
            results versus diet alone — based on clinical trial data.
          </p>
        </SectionShell>
      </section>

      <section className="py-12">
        <SectionShell className="max-w-3xl">
          <div className="rounded-2xl border border-navy-100/60 bg-white p-8 shadow-premium-md">
            <div className="space-y-8">
              {/* Weight sliders */}
              <WeightSlider
                value={currentWeight}
                onChange={setCurrentWeight}
                min={100}
                max={400}
                label="Current Weight"
                unit="lbs"
              />

              <WeightSlider
                value={goalWeight}
                onChange={(v) => setGoalWeight(Math.min(v, currentWeight - 10))}
                min={100}
                max={Math.max(currentWeight - 10, 110)}
                label="Goal Weight"
                unit="lbs"
              />

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Height */}
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Height</label>
                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        className="calculator-input text-sm py-2 pr-7"
                        min={3}
                        max={8}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-graphite-400">ft</span>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        className="calculator-input text-sm py-2 pr-7"
                        min={0}
                        max={11}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-graphite-400">in</span>
                    </div>
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="calculator-input text-sm py-2"
                    min={18}
                    max={99}
                  />
                </div>

                {/* Sex */}
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Sex</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["female", "male"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSex(s)}
                        className={`rounded-lg border-2 py-2 text-xs font-medium transition-all ${
                          sex === s ? "border-teal bg-teal-50 text-teal-800" : "border-navy-200 text-graphite-500"
                        }`}
                      >
                        {s === "female" ? "F" : "M"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Activity</label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as typeof activity)}
                    className="calculator-input text-sm py-2"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>

              <Button size="lg" className="w-full text-lg py-6" onClick={handleCalculate}>
                Show My Timeline
              </Button>
            </div>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div
                  className="mt-10 space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Hero stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        icon: Target,
                        label: "Pounds to lose",
                        value: result.totalToLose,
                        suffix: " lbs",
                        color: "text-teal",
                        bg: "bg-teal-50",
                      },
                      {
                        icon: Calendar,
                        label: "Estimated weeks",
                        value: result.weeksToGoal,
                        suffix: " wks",
                        color: "text-atlantic",
                        bg: "bg-atlantic/5",
                      },
                      {
                        icon: TrendingDown,
                        label: "Weekly rate",
                        value: parseFloat(result.weeklyRate),
                        suffix: " lbs/wk",
                        decimals: 1,
                        color: "text-gold-600",
                        bg: "bg-gold-50",
                      },
                      {
                        icon: Zap,
                        label: "Target date",
                        text: result.targetDate,
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                      },
                    ].map((card, i) => (
                      <motion.div
                        key={card.label}
                        className={`rounded-xl ${card.bg} border border-navy-100/40 p-4 text-center`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.1 }}
                      >
                        <card.icon className={`mx-auto h-5 w-5 ${card.color} mb-1`} />
                        {"value" in card ? (
                          <p className="text-2xl font-bold text-navy">
                            <AnimatedCounter
                              value={card.value as number}
                              suffix={card.suffix}
                              decimals={"decimals" in card ? (card.decimals as number) : 0}
                            />
                          </p>
                        ) : (
                          <p className="text-lg font-bold text-navy">{card.text}</p>
                        )}
                        <p className="text-[10px] text-graphite-400 mt-0.5">{card.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Timeline Chart */}
                  <TimelineChart
                    data={result.chartData}
                    currentWeight={currentWeight}
                    goalWeight={goalWeight}
                    showComparison={true}
                  />

                  {/* Milestones */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-sm font-semibold text-navy mb-3">Key milestones</p>
                    <div className="grid grid-cols-3 gap-3">
                      {result.projection.milestones.map((m, i) => {
                        const pctLost = ((currentWeight - m.weightWithPlan) / currentWeight * 100).toFixed(0);
                        const isGoalMonth = m.weightWithPlan <= goalWeight && (i === 0 || result.projection.milestones[i - 1].weightWithPlan > goalWeight);
                        return (
                          <motion.div
                            key={m.month}
                            className={`rounded-xl border p-4 text-center ${
                              isGoalMonth
                                ? "border-gold bg-gold-50 ring-2 ring-gold/30"
                                : "border-navy-100/60 bg-white"
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                          >
                            {isGoalMonth && (
                              <Badge variant="gold" className="text-[9px] mb-1">Goal reached!</Badge>
                            )}
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">
                              Month {m.month}
                            </p>
                            <p className="mt-1 text-xl font-bold text-navy">
                              {Math.round(m.weightWithPlan)}
                            </p>
                            <p className="text-xs text-graphite-400">lbs</p>
                            <Badge variant="default" className="mt-1 text-[10px]">
                              -{Math.round(m.totalLostWithPlan)} lbs ({pctLost}%)
                            </Badge>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* GLP-1 vs Diet comparison */}
                  <motion.div
                    className="rounded-xl bg-gradient-to-r from-navy to-atlantic p-5 text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-300 mb-3">
                      GLP-1 vs. Diet Alone Comparison
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1">With GLP-1</p>
                        <p className="text-3xl font-bold">
                          -{Math.round(result.projection.summary.totalLossWithPlan)} lbs
                        </p>
                        <p className="text-xs text-white/70">in {result.projection.summary.timelineMonths} months</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1">Diet Alone</p>
                        <p className="text-3xl font-bold text-white/60">
                          -{Math.round(currentWeight - result.dietAlone[Math.min(result.projection.summary.timelineMonths, result.dietAlone.length - 1)])} lbs
                        </p>
                        <p className="text-xs text-white/40">same period</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-sm">
                        <span className="text-gold font-bold">
                          {Math.round(result.projection.summary.extraLossFromPlan)} extra pounds lost
                        </span>{" "}
                        with the VitalPath plan
                      </p>
                    </div>
                  </motion.div>

                  {/* Info + CTA */}
                  <div className="flex items-start gap-2 rounded-xl bg-navy-50/30 p-4">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-graphite-400" />
                    <p className="text-xs leading-relaxed text-graphite-400">
                      Projections are based on STEP 1-4 and SURMOUNT 1-4 clinical trial data. Individual
                      results vary based on adherence, metabolism, and other factors. A licensed provider
                      will create a personalized plan based on your specific health profile.
                    </p>
                  </div>

                  <div className="text-center space-y-3">
                    <Link href="/qualify">
                      <Button size="lg" className="gap-2 text-lg px-8 py-6">
                        Start Your Journey
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                    <p className="text-xs text-graphite-400">
                      Free assessment &middot; No commitment &middot; HIPAA protected
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SEO content */}
          <div className="mt-10 space-y-6 rounded-2xl border border-navy-100/40 bg-navy-50/20 p-6">
            <h2 className="text-lg font-bold text-navy">How the Timeline Projection Works</h2>
            <p className="text-sm leading-relaxed text-graphite-500">
              Our weight loss timeline is built on data from major GLP-1 clinical trials — STEP 1-4
              (semaglutide) and SURMOUNT 1-4 (tirzepatide). These studies showed patients achieving
              15-20% total body weight loss over 68-72 weeks, with the steepest losses in the first
              few months tapering to a plateau.
            </p>
            <p className="text-sm leading-relaxed text-graphite-500">
              The &quot;Diet Alone&quot; curve reflects real-world data on conventional calorie restriction:
              most people lose 5-8% of body weight, with significant plateau effects as metabolic
              adaptation kicks in — the very problem GLP-1 medications help overcome.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link href="/how-it-works" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                How GLP-1 works →
              </Link>
              <Link href="/results" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                Real member results →
              </Link>
              <Link href="/calculators/bmi" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                BMI Calculator →
              </Link>
              <Link href="/calculators/tdee" className="rounded-lg bg-white px-3 py-2 text-teal font-medium border border-navy-100/40 hover:border-teal transition-colors">
                TDEE Calculator →
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
