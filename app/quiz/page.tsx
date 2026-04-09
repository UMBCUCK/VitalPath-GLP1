"use client";
import { MarketingShell } from "@/components/layout/marketing-shell";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Star, Shield, Users, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SectionShell } from "@/components/shared/section-shell";
import { useFunnelStore } from "@/hooks/use-funnel-store";
import { recommendPlan } from "@/lib/funnel";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type QuizStep = 1 | 2 | 3 | 4;

const weightRanges = [
  { value: "150-190", label: "150-190 lbs" },
  { value: "191-230", label: "191-230 lbs" },
  { value: "231-270", label: "231-270 lbs" },
  { value: "271+", label: "271+ lbs" },
];

const goals = [
  { value: "weight-loss", label: "Lose weight", desc: "Reduce body weight in a healthy, sustainable way" },
  { value: "body-recomposition", label: "Body recomposition", desc: "Lose fat while preserving or building lean muscle" },
  { value: "energy-metabolism", label: "Improve energy & metabolism", desc: "Feel more energetic and support metabolic health" },
  { value: "maintenance", label: "Maintain current progress", desc: "Keep weight off after previous weight loss" },
  { value: "guided-support", label: "Want guided support", desc: "Not sure yet — want a provider to help me figure it out" },
];

const eatingPatterns = [
  { value: "regular-meals", label: "Regular meals" },
  { value: "irregular", label: "Irregular schedule" },
  { value: "snack-heavy", label: "Lots of snacking" },
  { value: "skip-meals", label: "Skip meals often" },
  { value: "emotional-eating", label: "Emotional eating" },
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary", desc: "Little to no exercise" },
  { value: "light", label: "Lightly active", desc: "1-2 days/week" },
  { value: "moderate", label: "Moderately active", desc: "3-4 days/week" },
  { value: "active", label: "Active", desc: "5+ days/week" },
];

// Social proof snippets shown between steps
const stepProof = [
  null, // step 1: no proof (first step)
  { icon: Users, text: "18,000+ patients have started their journey with VitalPath", color: "text-teal" },
  { icon: Star, text: "94% of members would recommend VitalPath to a friend", color: "text-gold" },
  { icon: Clock, text: "Most members see results within the first 30 days", color: "text-atlantic" },
];

export default function QuizPage() {
  const router = useRouter();
  const { update } = useFunnelStore();
  const [step, setStep] = useState<QuizStep>(1);
  const [showExitModal, setShowExitModal] = useState(false);
  const [answers, setAnswers] = useState({
    weightRange: "",
    primaryGoal: "",
    motivator: "",
    eatingPattern: "",
    activityLevel: "",
    previousAttempts: "",
    wantsMealPlanning: false,
    wantsCoaching: false,
    wantsSupplements: false,
    wantsLabWork: false,
    email: "",
    firstName: "",
    state: "",
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // Track quiz start on mount
  useEffect(() => {
    track(ANALYTICS_EVENTS.QUIZ_START);
  }, []);

  // Exit intent: show save modal when mouse leaves on step 2+
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (step > 1) {
      track(ANALYTICS_EVENTS.QUIZ_ABANDON, { step, answeredFields: Object.values(answers).filter(Boolean).length });
      e.preventDefault();
    }
  }, [step, answers]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  // Quiz-specific exit intent — different from homepage exit modal
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && step > 1 && !showExitModal) {
        setShowExitModal(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [step, showExitModal]);

  function setAnswer(key: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function nextStep() {
    if (step < 4) {
      track(ANALYTICS_EVENTS.QUIZ_STEP_COMPLETE, { step, weightRange: answers.weightRange, primaryGoal: answers.primaryGoal });
      setStep((s) => (s + 1) as QuizStep);
    }
  }

  function prevStep() {
    if (step > 1) setStep((s) => (s - 1) as QuizStep);
  }

  function handleComplete() {
    const recommended = recommendPlan(answers as Parameters<typeof recommendPlan>[0]);
    update({ quiz: answers, recommendedPlan: recommended, email: answers.email || undefined });
    track(ANALYTICS_EVENTS.QUIZ_COMPLETE, { recommendedPlan: recommended });
    router.push(`/quiz/results?plan=${recommended}&weight=${answers.weightRange}`);
  }

  const canProceed = () => {
    switch (step) {
      case 1: return answers.weightRange && answers.primaryGoal;
      case 2: return answers.eatingPattern && answers.activityLevel;
      case 3: return true; // support prefs are optional
      case 4: return true; // email is soft capture
      default: return false;
    }
  };

  return (
    <MarketingShell><section className="min-h-[80vh] bg-gradient-to-b from-cloud to-white py-12">
      <SectionShell className="max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge variant="default" className="mb-4">Quick Assessment</Badge>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">
            Let&apos;s find the right plan for you
          </h1>
          <p className="mt-2 text-sm text-graphite-400">
            Step {step} of {totalSteps} &middot; Takes about 2 minutes
          </p>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-8" />

        {/* Steps */}
        <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-md sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-3">Current weight range</label>
                    <div className="grid grid-cols-2 gap-3">
                      {weightRanges.map((r) => (
                        <SelectButton key={r.value} selected={answers.weightRange === r.value} onClick={() => setAnswer("weightRange", r.value)}>
                          {r.label}
                        </SelectButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-3">Primary goal</label>
                    <div className="space-y-2">
                      {goals.map((g) => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => setAnswer("primaryGoal", g.value)}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                            answers.primaryGoal === g.value
                              ? "border-teal bg-teal-50"
                              : "border-navy-200 hover:border-navy-300"
                          )}
                        >
                          <div className={cn(
                            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                            answers.primaryGoal === g.value ? "border-teal bg-teal" : "border-navy-300"
                          )}>
                            {answers.primaryGoal === g.value && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-navy">{g.label}</p>
                            <p className="text-xs text-graphite-400">{g.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-3">How would you describe your eating habits?</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {eatingPatterns.map((e) => (
                        <SelectButton key={e.value} selected={answers.eatingPattern === e.value} onClick={() => setAnswer("eatingPattern", e.value)}>
                          {e.label}
                        </SelectButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-3">Current activity level</label>
                    <div className="grid grid-cols-2 gap-3">
                      {activityLevels.map((a) => (
                        <button
                          key={a.value}
                          type="button"
                          onClick={() => setAnswer("activityLevel", a.value)}
                          className={cn(
                            "rounded-xl border-2 px-4 py-3 text-left transition-all",
                            answers.activityLevel === a.value
                              ? "border-teal bg-teal-50"
                              : "border-navy-200 hover:border-navy-300"
                          )}
                        >
                          <p className={cn("text-sm font-medium", answers.activityLevel === a.value ? "text-teal-800" : "text-navy")}>
                            {a.label}
                          </p>
                          <p className="text-xs text-graphite-400">{a.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-3">What have you tried before?</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[
                        { value: "none", label: "Nothing yet" },
                        { value: "diet-only", label: "Diet alone" },
                        { value: "otc-supplements", label: "OTC supplements" },
                        { value: "rx-medication", label: "Rx medication" },
                        { value: "surgery", label: "Surgery" },
                      ].map((p) => (
                        <SelectButton key={p.value} selected={answers.previousAttempts === p.value} onClick={() => setAnswer("previousAttempts", p.value)}>
                          {p.label}
                        </SelectButton>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1">What kind of support interests you?</label>
                    <p className="text-xs text-graphite-400 mb-4">Select all that apply. This helps us recommend the right plan.</p>

                    <div className="space-y-3">
                      {[
                        { key: "wantsMealPlanning", label: "Meal plans & recipes", desc: "Weekly plans with grocery lists tailored to your program" },
                        { key: "wantsCoaching", label: "Coaching check-ins", desc: "Regular sessions with a health coach for accountability" },
                        { key: "wantsSupplements", label: "Nutritional supplements", desc: "Metabolic support, protein, hydration, and digestive comfort" },
                        { key: "wantsLabWork", label: "Lab work & biomarkers", desc: "Quarterly panels to track metabolic health markers" },
                      ].map((s) => (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => setAnswer(s.key, !answers[s.key as keyof typeof answers])}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                            answers[s.key as keyof typeof answers]
                              ? "border-teal bg-teal-50"
                              : "border-navy-200 hover:border-navy-300"
                          )}
                        >
                          <div className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all",
                            answers[s.key as keyof typeof answers] ? "border-teal bg-teal" : "border-navy-300"
                          )}>
                            {answers[s.key as keyof typeof answers] && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-navy">{s.label}</p>
                            <p className="text-xs text-graphite-400">{s.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 mb-4">
                      <Check className="h-7 w-7 text-teal" />
                    </div>
                    <h2 className="text-xl font-bold text-navy">Your personalized plan is ready</h2>
                    <p className="mt-2 text-sm text-graphite-400">
                      Enter your email to see your recommended plan and pricing. We&apos;ll also save your progress.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">First name</label>
                      <input
                        type="text"
                        value={answers.firstName}
                        onChange={(e) => setAnswer("firstName", e.target.value)}
                        className="calculator-input"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Email (we&apos;ll send your results here)</label>
                      <input
                        type="email"
                        value={answers.email}
                        onChange={(e) => setAnswer("email", e.target.value)}
                        className="calculator-input"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">State (to check availability)</label>
                      <select
                        value={answers.state}
                        onChange={(e) => setAnswer("state", e.target.value)}
                        className="calculator-input"
                      >
                        <option value="">Select your state</option>
                        {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Trust + social proof at capture point */}
                  <div className="flex items-center gap-4 rounded-xl bg-navy-50/50 px-4 py-3">
                    <Shield className="h-4 w-4 shrink-0 text-teal" />
                    <p className="text-xs text-graphite-400">
                      HIPAA-compliant &middot; 256-bit encrypted &middot; Never shared without consent
                    </p>
                  </div>

                  <p className="text-xs text-graphite-300">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Social proof between steps */}
          {stepProof[step] && (
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-navy-100/40 bg-navy-50/30 px-4 py-3">
              {(() => { const Icon = stepProof[step]!.icon; return <Icon className={cn("h-4 w-4 shrink-0", stepProof[step]!.color)} />; })()}
              <p className="text-xs text-graphite-500">{stepProof[step]!.text}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {step < 4 ? (
              <Button onClick={nextStep} disabled={!canProceed()} className="gap-1">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="gap-1 shadow-glow">
                See My Personalized Plan <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-graphite-300">
          This assessment helps us recommend a plan. Treatment eligibility is determined by a
          licensed provider during the medical intake process.
        </p>
      </SectionShell>
    </section>

      {/* Quiz-specific save modal — sunk cost effect */}
      {showExitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setShowExitModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-premium-xl animate-fade-in-up">
            <h2 className="text-xl font-bold text-navy">
              You&apos;re {Math.round((step / totalSteps) * 100)}% done!
            </h2>
            <p className="mt-2 text-sm text-graphite-500">
              Your answers are saved. Want us to email you a link to pick up where you left off?
            </p>

            <div className="mt-5 flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={answers.email}
                onChange={(e) => setAnswer("email", e.target.value)}
                className="flex-1 rounded-xl border border-navy-100 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <Button
                onClick={() => {
                  track(ANALYTICS_EVENTS.QUIZ_STEP_COMPLETE, { step: "exit_save", email: answers.email });
                  setShowExitModal(false);
                }}
                size="sm"
              >
                Save
              </Button>
            </div>

            <div className="mt-4 flex gap-3">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowExitModal(false)}>
                Continue quiz
              </Button>
              <button
                onClick={() => setShowExitModal(false)}
                className="text-xs text-graphite-400 hover:text-graphite-600"
              >
                No thanks
              </button>
            </div>

            <p className="mt-3 text-[10px] text-graphite-300">
              We&apos;ll only send a link to finish your assessment. No spam.
            </p>
          </div>
        </div>
      )}
  </MarketingShell>
  );
}

function SelectButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
        selected
          ? "border-teal bg-teal-50 text-teal-800"
          : "border-navy-200 text-graphite-500 hover:border-navy-300"
      )}
    >
      {children}
    </button>
  );
}
