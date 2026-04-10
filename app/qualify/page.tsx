"use client";

import { MarketingShell } from "@/components/layout/marketing-shell";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight, ArrowLeft, Check, Shield, Users, Star, Clock,
  AlertTriangle, Lock, Sparkles, TrendingDown, Activity, Target, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SectionShell } from "@/components/shared/section-shell";
import { AnimatedCounter } from "@/components/calculators/animated-counter";
import { useFunnelStore } from "@/hooks/use-funnel-store";
import { recommendPlanFromQualify } from "@/lib/funnel";
import { generateProjection, type ProjectionResult } from "@/lib/weight-projection";
import { calculateBMI, bmiCategory, formatPrice } from "@/lib/utils";
import { plans } from "@/lib/pricing";
import { siteConfig } from "@/lib/site";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type QualifyStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;
const TOTAL_STEPS = 7;

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const goals = [
  { value: "weight-loss", label: "Lose weight", desc: "Reduce body weight in a healthy, sustainable way" },
  { value: "body-recomposition", label: "Body recomposition", desc: "Lose fat while preserving or building lean muscle" },
  { value: "energy-metabolism", label: "Improve energy & metabolism", desc: "Feel more energetic and support metabolic health" },
  { value: "maintenance", label: "Maintain current progress", desc: "Keep weight off after previous weight loss" },
  { value: "guided-support", label: "Want guided support", desc: "Not sure yet — want a provider to help me figure it out" },
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary", desc: "Little to no exercise" },
  { value: "light", label: "Lightly active", desc: "1-2 days/week" },
  { value: "moderate", label: "Moderately active", desc: "3-4 days/week" },
  { value: "active", label: "Active", desc: "5+ days/week" },
];

const eatingPatterns = [
  { value: "regular-meals", label: "Regular meals" },
  { value: "irregular", label: "Irregular schedule" },
  { value: "snack-heavy", label: "Lots of snacking" },
  { value: "skip-meals", label: "Skip meals often" },
  { value: "emotional-eating", label: "Emotional eating" },
];

const previousAttempts = [
  { value: "none", label: "Nothing yet" },
  { value: "diet-only", label: "Diet alone" },
  { value: "exercise", label: "Exercise" },
  { value: "otc-supplements", label: "OTC supplements" },
  { value: "rx-medication", label: "Rx medication" },
  { value: "surgery", label: "Surgery" },
];

const medicalConditions = [
  "Type 2 Diabetes", "High Blood Pressure", "High Cholesterol", "Sleep Apnea",
  "PCOS", "Hypothyroidism", "Fatty Liver Disease", "Joint Pain / Arthritis",
  "Depression / Anxiety", "Heart Disease", "None of the above",
];

const contraindications = [
  { key: "hasThyroidCancer", label: "Have you or a family member had medullary thyroid carcinoma (MTC)?" },
  { key: "hasMEN2", label: "Have you been diagnosed with Multiple Endocrine Neoplasia syndrome type 2 (MEN2)?" },
  { key: "isPregnant", label: "Are you currently pregnant, planning to become pregnant, or breastfeeding?" },
  { key: "hasPancreatitis", label: "Do you have a history of pancreatitis?" },
  { key: "hasGastroparesis", label: "Have you been diagnosed with gastroparesis (delayed stomach emptying)?" },
  { key: "hasDiabeticRetinopathy", label: "Have you been diagnosed with diabetic retinopathy?" },
  { key: "hasGallbladderDisease", label: "Do you have current gallbladder disease or a history of gallbladder problems?" },
  { key: "hasKidneyDisease", label: "Do you have chronic kidney disease or impaired kidney function?" },
  { key: "hasEatingDisorder", label: "Do you have an active eating disorder (anorexia, bulimia, etc.)?" },
  { key: "hasSuicidalIdeation", label: "Do you have a history of suicidal thoughts or self-harm?" },
];

const stepProof = [
  null,
  null,
  { icon: Users, text: "18,000+ patients have started their journey with VitalPath", color: "text-teal" },
  { icon: Star, text: "94% of members would recommend VitalPath to a friend", color: "text-gold" },
  { icon: Shield, text: "Your answers are reviewed by licensed medical providers", color: "text-teal" },
  null, // projection step
  { icon: Clock, text: "Most members see results within the first 30 days", color: "text-atlantic" },
  { icon: Star, text: "4.9/5 from 2,400+ verified members · 94% would recommend VitalPath", color: "text-gold" },
];

export default function QualifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: funnelState, update: updateFunnel } = useFunnelStore();
  const [step, setStep] = useState<QualifyStep>(1);
  const [showExitModal, setShowExitModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [restored, setRestored] = useState(false);
  const hasInteracted = useRef(false);
  const [answeredScreening, setAnsweredScreening] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [attemptedNext, setAttemptedNext] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const formCardRef = useRef<HTMLDivElement>(null);

  // Capture referral code from URL (?ref=CODE) and persist in funnel
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && !funnelState.referralCode) {
      updateFunnel({ referralCode: ref });
    }
  }, [searchParams, funnelState.referralCode, updateFunnel]);
  const [allScreeningAnswered, setAllScreeningAnswered] = useState(false);

  // ─── Projection state (step 5) ─────────────────────────────
  const [projectionStep, setProjectionStep] = useState(0);
  const [projectionRevealed, setProjectionRevealed] = useState(false);
  const [projection, setProjection] = useState<ProjectionResult | null>(null);

  // ─── Form state ────────────────────────────────────────────
  const [form, setForm] = useState({
    // Step 1: BMI
    heightFeet: "",
    heightInches: "",
    weightLbs: "",
    age: "",
    sex: "" as "" | "male" | "female",
    // Step 2: Goals
    primaryGoal: "",
    activityLevel: "",
    eatingPattern: "",
    previousAttempts: "",
    // Step 3: Medical
    conditions: [] as string[],
    medications: "",
    allergies: "",
    // Step 4: Contraindications
    hasThyroidCancer: false,
    hasMEN2: false,
    isPregnant: false,
    hasPancreatitis: false,
    hasGastroparesis: false,
    hasDiabeticRetinopathy: false,
    hasGallbladderDisease: false,
    hasKidneyDisease: false,
    hasEatingDisorder: false,
    hasSuicidalIdeation: false,
    // Step 6: Personal
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    state: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    // Step 7: Consent
    consentTreatment: false,
    consentHipaa: false,
    consentTelehealth: false,
    consentMedicationRisks: false,
    // Extra
    medicalHistory: "",
    goalWeightLbs: "",
  });

  const progress = (step / TOTAL_STEPS) * 100;

  // ─── Computed values ───────────────────────────────────────
  const ft = parseInt(form.heightFeet) || 0;
  const inc = parseInt(form.heightInches || "0") || 0;
  const w = parseFloat(form.weightLbs) || 0;
  const totalInches = ft * 12 + inc;
  const bmi = ft >= 3 && w >= 80 ? calculateBMI(w, totalInches) : 0;
  const bmiCat = bmi > 0 ? bmiCategory(bmi) : "";

  const hasContraindication =
    form.hasThyroidCancer || form.hasMEN2 || form.isPregnant || form.hasPancreatitis ||
    form.hasGastroparesis || form.hasDiabeticRetinopathy || form.hasGallbladderDisease ||
    form.hasKidneyDisease || form.hasEatingDisorder || form.hasSuicidalIdeation;

  // ─── Plan recommendation ──────────────────────────────────
  const recommended = recommendPlanFromQualify({
    bmi,
    activityLevel: form.activityLevel,
    eatingPattern: form.eatingPattern,
    primaryGoal: form.primaryGoal,
    conditionsCount: form.conditions.filter(c => c !== "None of the above").length,
    hasContraindication,
  });
  const plan = plans.find((p) => p.slug === recommended) || plans[1];

  // ─── Track start ──────────────────────────────────────────
  useEffect(() => {
    track(ANALYTICS_EVENTS.QUALIFY_START);
  }, []);

  // ─── Restore saved progress ───────────────────────────────
  useEffect(() => {
    if (restored) return;
    setRestored(true);
    try {
      const raw = localStorage.getItem("vitalpath-funnel");
      if (!raw) return;
      const stored = JSON.parse(raw);
      const q = stored?.qualify;
      if (!q?.heightFeet || !q?.currentStep || q.currentStep <= 1) return;

      setForm((prev) => ({
        ...prev,
        heightFeet: q.heightFeet?.toString() || prev.heightFeet,
        heightInches: q.heightInches?.toString() || prev.heightInches,
        weightLbs: q.weightLbs?.toString() || prev.weightLbs,
        age: q.age?.toString() || prev.age,
        sex: (q.sex as "" | "male" | "female") || prev.sex,
        primaryGoal: q.primaryGoal || prev.primaryGoal,
        activityLevel: q.activityLevel || prev.activityLevel,
        eatingPattern: q.eatingPattern || prev.eatingPattern,
        conditions: q.conditions || prev.conditions,
        medications: q.medications || prev.medications,
        allergies: q.allergies || prev.allergies,
        firstName: q.firstName || prev.firstName,
        lastName: q.lastName || prev.lastName,
        email: q.email || prev.email,
        phone: q.phone || prev.phone,
        dateOfBirth: q.dateOfBirth || prev.dateOfBirth,
        state: q.state || prev.state,
        medicalHistory: q.medicalHistory || prev.medicalHistory,
      }));
      setStep(Math.min(q.currentStep, 4) as QualifyStep);
    } catch {
      // ignore parse errors
    }
  }, [restored]);

  // ─── Scroll to top on step change ─────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // ─── Exit intent ──────────────────────────────────────────
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (step > 1) {
      track(ANALYTICS_EVENTS.QUALIFY_ABANDON, { step });
      e.preventDefault();
    }
  }, [step]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && step > 1 && step !== 5 && !showExitModal) {
        setShowExitModal(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [step, showExitModal]);

  // ─── Persist to funnel store ──────────────────────────────
  useEffect(() => {
    if (!hasInteracted.current) return; // Only persist after user navigates a step
    updateFunnel({
      qualify: {
        currentStep: step,
        heightFeet: ft || undefined,
        heightInches: inc || undefined,
        weightLbs: w || undefined,
        age: parseInt(form.age) || undefined,
        sex: form.sex || undefined,
        bmi: bmi || undefined,
        primaryGoal: form.primaryGoal || undefined,
        activityLevel: form.activityLevel || undefined,
        eatingPattern: form.eatingPattern || undefined,
        conditions: form.conditions.length > 0 ? form.conditions : undefined,
        medications: form.medications || undefined,
        allergies: form.allergies || undefined,
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        state: form.state || undefined,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ─── Helpers ──────────────────────────────────────────────
  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function setField(key: string, value: unknown) {
    if (key === "phone" || key === "emergencyContactPhone") {
      setForm((prev) => ({ ...prev, [key]: formatPhone(String(value)) }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCondition(condition: string) {
    setForm((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));
  }

  // ─── Step navigation ──────────────────────────────────────
  function nextStep() {
    // Validate before proceeding
    const errors = getFieldErrors();
    if (Object.keys(errors).length > 0) {
      setAttemptedNext(true);
      setFieldErrors(errors);
      setShakeKey((k) => k + 1);
      // Scroll to the first error field
      setTimeout(() => {
        const firstError = formCardRef.current?.querySelector('[data-error="true"]');
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }

    // Clear errors on successful navigation
    setAttemptedNext(false);
    setFieldErrors({});

    if (step === 1 && bmi > 0) {
      track(ANALYTICS_EVENTS.QUALIFY_BMI_CALCULATED, { bmi: Math.round(bmi * 10) / 10, category: bmiCat });
    }

    if (step === 4 && hasContraindication) {
      track(ANALYTICS_EVENTS.QUALIFY_CONTRAINDICATION_FLAG, {
        flags: contraindications.filter(c => form[c.key as keyof typeof form] === true).map(c => c.key).join(","),
      });
    }

    track(ANALYTICS_EVENTS.QUALIFY_STEP_COMPLETE, { step, stepName: stepNames[step - 1] });
    hasInteracted.current = true;

    if (step === 4) {
      // Generate projection before showing step 5
      const proj = generateProjection({
        currentWeight: w,
        heightInches: totalInches,
        age: parseInt(form.age) || 35,
        sex: form.sex as "male" | "female" || "female",
        activityLevel: (form.activityLevel as "sedentary" | "light" | "moderate" | "active") || "sedentary",
        goalWeight: form.goalWeightLbs ? parseFloat(form.goalWeightLbs) : undefined,
      });
      setProjection(proj);
      setProjectionStep(0);
      setProjectionRevealed(false);
    }

    setStep((s) => Math.min(TOTAL_STEPS, s + 1) as QualifyStep);
  }

  function prevStep() {
    setAttemptedNext(false);
    setFieldErrors({});
    if (step === 5) {
      // Skip projection animation reset on back
      setProjectionRevealed(false);
      setProjectionStep(0);
    }
    setStep((s) => Math.max(1, s - 1) as QualifyStep);
  }

  // ─── Projection animation ────────────────────────────────
  useEffect(() => {
    if (step !== 5 || projectionRevealed) return;

    const timers = [
      setTimeout(() => setProjectionStep(1), 500),
      setTimeout(() => setProjectionStep(2), 1500),
      setTimeout(() => setProjectionStep(3), 2500),
      setTimeout(() => {
        setProjectionStep(4);
        setProjectionRevealed(true);
        track(ANALYTICS_EVENTS.QUALIFY_PROJECTION_VIEWED, {
          projectedLoss: projection?.summary.totalLossWithPlan,
          timelineMonths: projection?.summary.timelineMonths,
        });
      }, 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [step, projectionRevealed, projection]);

  // ─── Submit ───────────────────────────────────────────────
  async function handleSubmit() {
    const errors = getFieldErrors();
    if (Object.keys(errors).length > 0) {
      setAttemptedNext(true);
      setFieldErrors(errors);
      setShakeKey((k) => k + 1);
      setTimeout(() => {
        const firstError = formCardRef.current?.querySelector('[data-error="true"]');
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth,
          state: form.state,
          heightFeet: ft,
          heightInches: inc,
          weightLbs: w,
          goalWeightLbs: form.goalWeightLbs ? parseFloat(form.goalWeightLbs) : undefined,
          medications: form.medications || "None",
          allergies: form.allergies || "None",
          medicalHistory: form.medicalHistory || "Completed via qualify flow",
          conditions: form.conditions.filter(c => c !== "None of the above"),
          hasThyroidCancer: form.hasThyroidCancer,
          hasMEN2: form.hasMEN2,
          isPregnant: form.isPregnant,
          hasPancreatitis: form.hasPancreatitis,
          hasGastroparesis: form.hasGastroparesis,
          hasDiabeticRetinopathy: form.hasDiabeticRetinopathy,
          hasGallbladderDisease: form.hasGallbladderDisease,
          hasKidneyDisease: form.hasKidneyDisease,
          hasEatingDisorder: form.hasEatingDisorder,
          hasSuicidalIdeation: form.hasSuicidalIdeation,
          emergencyContactName: form.emergencyContactName,
          emergencyContactPhone: form.emergencyContactPhone,
          emergencyContactRelation: form.emergencyContactRelation,
          consentTreatment: form.consentTreatment,
          consentHipaa: form.consentHipaa,
          consentTelehealth: form.consentTelehealth,
          consentMedicationRisks: form.consentMedicationRisks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed");
        return;
      }

      track(ANALYTICS_EVENTS.QUALIFY_COMPLETE, { recommendedPlan: recommended });
      updateFunnel({ recommendedPlan: recommended, email: form.email });

      const projWeight = projection?.summary.projectedWeightWithPlan || Math.round(w * 0.8);
      router.push(`/qualify/results?plan=${recommended}&weight=${Math.round(w)}&projected=${Math.round(projWeight)}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Field-level validation ──────────────────────────────
  const getFieldErrors = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (!form.heightFeet) errors.heightFeet = "Height (feet) is required";
        if (!form.weightLbs) errors.weightLbs = "Weight is required";
        if (!form.age) errors.age = "Age is required";
        if (!form.sex) errors.sex = "Please select your biological sex";
        break;
      case 2:
        if (!form.primaryGoal) errors.primaryGoal = "Please select your primary goal";
        if (!form.activityLevel) errors.activityLevel = "Please select your activity level";
        if (!form.eatingPattern) errors.eatingPattern = "Please select your eating habits";
        if (!form.previousAttempts) errors.previousAttempts = "Please select what you've tried before";
        break;
      case 4: {
        const unanswered = contraindications.filter(c => !answeredScreening[c.key] && !allScreeningAnswered);
        if (unanswered.length > 0) errors.screening = `Please answer all ${unanswered.length} remaining safety question${unanswered.length > 1 ? "s" : ""}`;
        break;
      }
      case 6:
        if (!form.firstName) errors.firstName = "First name is required";
        if (!form.lastName) errors.lastName = "Last name is required";
        if (!form.email) errors.email = "Email is required";
        if (!form.phone) errors.phone = "Phone number is required";
        if (!form.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
        if (!form.state) errors.state = "State is required";
        if (form.medicalHistory.length < 10) errors.medicalHistory = "Please provide a brief medical history (at least 10 characters)";
        if (!form.emergencyContactName) errors.emergencyContactName = "Emergency contact name is required";
        if (!form.emergencyContactPhone) errors.emergencyContactPhone = "Emergency contact phone is required";
        if (!form.emergencyContactRelation) errors.emergencyContactRelation = "Emergency contact relationship is required";
        break;
      case 7:
        if (!form.consentTreatment) errors.consentTreatment = "Treatment consent is required";
        if (!form.consentHipaa) errors.consentHipaa = "HIPAA authorization is required";
        if (!form.consentTelehealth) errors.consentTelehealth = "Telehealth consent is required";
        if (!form.consentMedicationRisks) errors.consentMedicationRisks = "Medication risk acknowledgment is required";
        break;
    }
    return errors;
  };

  // Clear errors when user changes fields
  useEffect(() => {
    if (attemptedNext) {
      const errors = getFieldErrors();
      setFieldErrors(errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, answeredScreening, allScreeningAnswered, attemptedNext]);

  const stepNames = ["BMI Check", "Goals", "Medical History", "Safety Screening", "Your Projection", "Personal Info", "Plan & Consent"];

  return (
    <MarketingShell>
      <section className="min-h-[80vh] bg-gradient-to-b from-cloud to-white py-12">
        <SectionShell className="max-w-2xl">
          {/* Header */}
          <div ref={scrollRef} className="mb-8 text-center">
            <Badge variant="default" className="mb-4 gap-1.5">
              {step <= 4 ? <><Shield className="h-3 w-3" /> Quick Health Assessment</> :
               step === 5 ? <><Sparkles className="h-3 w-3" /> Your Results</> :
               <><Lock className="h-3 w-3" /> Secure Medical Intake</>}
            </Badge>
            <h1 className="text-2xl font-bold text-navy sm:text-3xl">
              {step === 1 && "See if you qualify for GLP-1 treatment"}
              {step === 2 && (form.heightFeet ? `Great${bmi >= 27 ? " — you may qualify!" : ""}. Tell us about your goals.` : "Tell us about your goals")}
              {step === 3 && `${form.firstName || "Almost there"} — help your provider prepare`}
              {step === 4 && "Quick safety check"}
              {step === 5 && "Your Personalized Weight Loss Projection"}
              {step === 6 && "Let\u2019s get you set up"}
              {step === 7 && `${form.firstName ? `${form.firstName}, your` : "Your"} recommended plan`}
            </h1>
            <p className="mt-2 text-sm text-graphite-400">
              Step {step} of {TOTAL_STEPS} &middot; {stepNames[step - 1]}
              {step >= 5 && " · HIPAA-compliant · Encrypted"}
            </p>
          </div>

          {/* Step Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                    s < step ? "bg-teal text-white" :
                    s === step ? "bg-navy text-white ring-2 ring-navy/20 ring-offset-2" :
                    "bg-navy-100/60 text-graphite-400"
                  )}>
                    {s < step ? <Check className="h-3.5 w-3.5" /> : s}
                  </div>
                  {s < 7 && (
                    <div className={cn(
                      "h-0.5 w-full min-w-[16px] sm:min-w-[32px] transition-all",
                      s < step ? "bg-teal" : "bg-navy-100/60"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div
            key={shakeKey}
            ref={formCardRef}
            className={cn(
              "rounded-2xl border bg-white p-6 shadow-premium-md sm:p-8 transition-colors",
              attemptedNext && Object.keys(fieldErrors).length > 0
                ? "border-red-200 animate-shake"
                : "border-navy-100/60"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* ─── STEP 1: BMI Quick Check ─── */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-navy mb-1">Let&apos;s start with your basics</h2>
                      <p className="text-sm text-graphite-400 mb-5">This helps us calculate your BMI and personalize your results.</p>
                    </div>

                    <div data-error={!!fieldErrors.heightFeet || undefined}>
                      <label className={cn("block text-sm font-semibold mb-2 transition-colors", fieldErrors.heightFeet ? "text-red-500" : "text-navy")}>Height {fieldErrors.heightFeet && <span className="font-normal">— {fieldErrors.heightFeet}</span>}</label>
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <input type="number" placeholder="5" value={form.heightFeet} onChange={(e) => setField("heightFeet", e.target.value)} className={cn("calculator-input pr-10", fieldErrors.heightFeet && "!border-red-400 ring-2 ring-red-100")} min={3} max={8} />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">ft</span>
                        </div>
                        <div className="flex-1 relative">
                          <input type="number" placeholder="8" value={form.heightInches} onChange={(e) => setField("heightInches", e.target.value)} className="calculator-input pr-10" min={0} max={11} />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">in</span>
                        </div>
                      </div>
                    </div>

                    <div data-error={!!fieldErrors.weightLbs || undefined}>
                      <label className={cn("block text-sm font-semibold mb-2 transition-colors", fieldErrors.weightLbs ? "text-red-500" : "text-navy")}>Current Weight {fieldErrors.weightLbs && <span className="font-normal">— {fieldErrors.weightLbs}</span>}</label>
                      <div className="relative">
                        <input type="number" placeholder="200" value={form.weightLbs} onChange={(e) => setField("weightLbs", e.target.value)} className={cn("calculator-input pr-12", fieldErrors.weightLbs && "!border-red-400 ring-2 ring-red-100")} min={80} max={700} />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">lbs</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div data-error={!!fieldErrors.age || undefined}>
                        <label className={cn("block text-sm font-semibold mb-2 transition-colors", fieldErrors.age ? "text-red-500" : "text-navy")}>Age {fieldErrors.age && <span className="font-normal">— {fieldErrors.age}</span>}</label>
                        <input type="number" placeholder="35" value={form.age} onChange={(e) => setField("age", e.target.value)} className={cn("calculator-input", fieldErrors.age && "!border-red-400 ring-2 ring-red-100")} min={18} max={120} />
                      </div>
                      <div data-error={!!fieldErrors.sex || undefined}>
                        <label className={cn("block text-sm font-semibold mb-2 transition-colors", fieldErrors.sex ? "text-red-500" : "text-navy")}>Biological Sex {fieldErrors.sex && <span className="font-normal">— Required</span>}</label>
                        <div className="flex gap-2">
                          <SelectButton selected={form.sex === "male"} onClick={() => setField("sex", "male")} error={!!fieldErrors.sex}>Male</SelectButton>
                          <SelectButton selected={form.sex === "female"} onClick={() => setField("sex", "female")} error={!!fieldErrors.sex}>Female</SelectButton>
                        </div>
                      </div>
                    </div>

                    {/* Inline BMI result */}
                    {bmi > 0 && (
                      <div className={cn(
                        "rounded-xl border-2 p-4 transition-all animate-fade-in-up",
                        bmi >= 27 ? "border-teal bg-gradient-to-br from-teal-50 to-white" : bmi >= 25 ? "border-amber-300 bg-amber-50" : "border-navy-200 bg-navy-50"
                      )}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400">Your BMI</p>
                            <p className="text-3xl font-bold text-navy leading-none mt-0.5">{Math.round(bmi * 10) / 10}</p>
                          </div>
                          {bmi >= 27 ? (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal shadow-glow">
                              <Check className="h-6 w-6 text-white" />
                            </div>
                          ) : bmi >= 25 ? (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                              <AlertTriangle className="h-6 w-6 text-amber-600" />
                            </div>
                          ) : null}
                        </div>
                        <Badge variant={bmi >= 30 ? "destructive" : bmi >= 27 ? "warning" : bmi >= 25 ? "warning" : "default"} className="mb-2">
                          {bmiCat}
                        </Badge>
                        {bmi >= 27 ? (
                          <div>
                            <p className="text-sm font-semibold text-teal-700 flex items-center gap-1.5">
                              <Check className="h-4 w-4" />
                              You likely qualify for GLP-1 treatment
                            </p>
                            <p className="mt-1.5 text-xs text-teal-600 leading-relaxed">
                              87% of adults with BMI 27+ are approved. Complete the next steps to get your personalized treatment plan.
                            </p>
                          </div>
                        ) : bmi >= 25 ? (
                          <p className="text-sm text-amber-700">
                            You may qualify with weight-related health conditions. Your provider will evaluate your full profile.
                          </p>
                        ) : (
                          <p className="text-sm text-graphite-500">
                            GLP-1 treatment typically requires BMI 27+, but a provider will evaluate your full health profile.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── STEP 2: Goals & Lifestyle ─── */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div data-error={!!fieldErrors.primaryGoal || undefined}>
                      <label className={cn("block text-sm font-semibold mb-3 transition-colors", fieldErrors.primaryGoal ? "text-red-500" : "text-navy")}>What&apos;s your primary goal? {fieldErrors.primaryGoal && <span className="font-normal">— {fieldErrors.primaryGoal}</span>}</label>
                      <div className="space-y-2">
                        {goals.map((g) => (
                          <button key={g.value} type="button" onClick={() => setField("primaryGoal", g.value)}
                            className={cn(
                              "flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                              form.primaryGoal === g.value ? "border-teal bg-teal-50" : fieldErrors.primaryGoal ? "border-red-300 hover:border-red-400" : "border-navy-200 hover:border-navy-300"
                            )}
                          >
                            <div className={cn("mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all", form.primaryGoal === g.value ? "border-teal bg-teal" : "border-navy-300")}>
                              {form.primaryGoal === g.value && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-navy">{g.label}</p>
                              <p className="text-xs text-graphite-400">{g.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div data-error={!!fieldErrors.activityLevel || undefined}>
                      <label className={cn("block text-sm font-semibold mb-3 transition-colors", fieldErrors.activityLevel ? "text-red-500" : "text-navy")}>Current activity level {fieldErrors.activityLevel && <span className="font-normal">— {fieldErrors.activityLevel}</span>}</label>
                      <div className="grid grid-cols-2 gap-3">
                        {activityLevels.map((a) => (
                          <button key={a.value} type="button" onClick={() => setField("activityLevel", a.value)}
                            className={cn("rounded-xl border-2 px-4 py-3 text-left transition-all", form.activityLevel === a.value ? "border-teal bg-teal-50" : fieldErrors.activityLevel ? "border-red-300 hover:border-red-400" : "border-navy-200 hover:border-navy-300")}
                          >
                            <p className={cn("text-sm font-medium", form.activityLevel === a.value ? "text-teal-800" : "text-navy")}>{a.label}</p>
                            <p className="text-xs text-graphite-400">{a.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div data-error={!!fieldErrors.eatingPattern || undefined}>
                      <label className={cn("block text-sm font-semibold mb-3 transition-colors", fieldErrors.eatingPattern ? "text-red-500" : "text-navy")}>How would you describe your eating habits? {fieldErrors.eatingPattern && <span className="font-normal">— {fieldErrors.eatingPattern}</span>}</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {eatingPatterns.map((e) => (
                          <SelectButton key={e.value} selected={form.eatingPattern === e.value} onClick={() => setField("eatingPattern", e.value)} error={!!fieldErrors.eatingPattern}>
                            {e.label}
                          </SelectButton>
                        ))}
                      </div>
                    </div>

                    <div data-error={!!fieldErrors.previousAttempts || undefined}>
                      <label className={cn("block text-sm font-semibold mb-3 transition-colors", fieldErrors.previousAttempts ? "text-red-500" : "text-navy")}>What have you tried before? {fieldErrors.previousAttempts && <span className="font-normal">— {fieldErrors.previousAttempts}</span>}</label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {previousAttempts.map((p) => (
                          <SelectButton key={p.value} selected={form.previousAttempts === p.value} onClick={() => setField("previousAttempts", p.value)} error={!!fieldErrors.previousAttempts}>
                            {p.label}
                          </SelectButton>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── STEP 3: Medical History ─── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold text-navy mb-1">Help your provider prepare</h2>
                      <p className="text-sm text-graphite-400 mb-4">This information helps your provider build a safe, personalized treatment plan.</p>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-teal-50/50 border border-teal-100 px-4 py-3">
                      <Lock className="h-4 w-4 shrink-0 text-teal" />
                      <p className="text-xs text-teal-700">Your health data is encrypted, HIPAA-protected, and only visible to your care team.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2">Do you have any of these conditions?</label>
                      <p className="text-xs text-graphite-400 mb-3">Select all that apply.</p>
                      <div className="grid grid-cols-2 gap-2">
                        {medicalConditions.map((c) => (
                          <button key={c} type="button" onClick={() => toggleCondition(c)}
                            className={cn(
                              "flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs text-left transition-all",
                              form.conditions.includes(c) ? "border-teal bg-teal-50 text-teal-800" : "border-navy-200 text-graphite-500 hover:border-navy-300"
                            )}
                          >
                            <div className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border-2", form.conditions.includes(c) ? "border-teal bg-teal" : "border-navy-300")}>
                              {form.conditions.includes(c) && <Check className="h-2.5 w-2.5 text-white" />}
                            </div>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Current Medications</label>
                      <textarea value={form.medications} onChange={(e) => setField("medications", e.target.value)} className="calculator-input min-h-[80px] resize-y" placeholder="List all current medications, dosages, and frequency. Enter 'None' if not applicable." />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Allergies</label>
                      <Input value={form.allergies} onChange={(e) => setField("allergies", e.target.value)} placeholder="List any allergies or enter 'None'" />
                    </div>
                  </div>
                )}

                {/* ─── STEP 4: Safety Screening ─── */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-bold text-amber-800">FDA Safety Screening</span>
                      </div>
                      <p className="text-xs text-amber-700 mb-4">
                        Certain conditions may affect safe use of GLP-1 medications. Please select <strong>Yes</strong> or <strong>No</strong> for each question.
                      </p>

                      {/* Quick "None apply" shortcut */}
                      {!allScreeningAnswered && !hasContraindication && (
                        <button
                          type="button"
                          onClick={() => {
                            contraindications.forEach((c) => setField(c.key, false));
                            setAllScreeningAnswered(true);
                          }}
                          className="mb-4 w-full rounded-xl border-2 border-teal bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800 transition-all hover:bg-teal-100"
                        >
                          <Check className="mr-2 inline h-4 w-4" />
                          None of these apply to me
                        </button>
                      )}

                      <div className="space-y-3">
                        {contraindications.map((q) => {
                          const val = form[q.key as keyof typeof form] as boolean;
                          const answered = answeredScreening[q.key] || allScreeningAnswered;
                          return (
                            <div key={q.key} className={cn(
                              "rounded-xl border-2 px-4 py-3 transition-all",
                              !answered ? "border-amber-200 bg-white" :
                              val ? "border-red-300 bg-red-50" : "border-teal-200 bg-teal-50/30"
                            )}>
                              <p className="text-xs text-amber-900 mb-2">{q.label}</p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setField(q.key, true);
                                    setAnsweredScreening((prev) => ({ ...prev, [q.key]: true }));
                                  }}
                                  className={cn(
                                    "flex-1 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition-all",
                                    val && answered
                                      ? "border-red-400 bg-red-100 text-red-700"
                                      : "border-navy-200 text-graphite-500 hover:border-navy-300"
                                  )}
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setField(q.key, false);
                                    setAnsweredScreening((prev) => ({ ...prev, [q.key]: true }));
                                  }}
                                  className={cn(
                                    "flex-1 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition-all",
                                    !val && answered
                                      ? "border-teal bg-teal-50 text-teal-700"
                                      : "border-navy-200 text-graphite-500 hover:border-navy-300"
                                  )}
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {fieldErrors.screening && (
                        <p className="mt-3 text-xs text-red-500 font-medium">{fieldErrors.screening}</p>
                      )}

                      {form.hasSuicidalIdeation && (
                        <div className="mt-4 rounded-lg bg-purple-50 border border-purple-200 p-4">
                          <p className="text-xs font-bold text-purple-800 mb-1">Crisis Resources Available 24/7</p>
                          <p className="text-xs text-purple-700">
                            If you or someone you know is in crisis, contact the <strong>988 Suicide &amp; Crisis Lifeline</strong> by
                            calling or texting <strong>988</strong>. You can also chat at{" "}
                            <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" className="underline font-semibold">988lifeline.org</a>.
                            In an emergency, call 911.
                          </p>
                        </div>
                      )}

                      {hasContraindication && !form.hasSuicidalIdeation && (
                        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
                          <p className="text-xs font-semibold text-red-700">
                            Based on your responses, GLP-1 medication may not be appropriate for you.
                            Your provider will review this during your evaluation and discuss alternative options.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── STEP 5: Projection ─── */}
                {step === 5 && (
                  <div>
                    {!projectionRevealed ? (
                      <div className="py-8 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                          <Sparkles className={cn("h-8 w-8 text-teal transition-all duration-500", projectionStep >= 2 && "animate-pulse")} />
                        </div>
                        <h2 className="text-xl font-bold text-navy mb-6">Building your personalized projection...</h2>
                        <div className="space-y-3 text-left max-w-sm mx-auto">
                          {[
                            { label: "Analyzing your health profile", threshold: 1 },
                            { label: "Calculating projected weight loss", threshold: 2 },
                            { label: "Comparing plan outcomes", threshold: 3 },
                          ].map((item) => (
                            <div key={item.label} className={cn(
                              "flex items-center gap-3 rounded-xl border p-3 transition-all duration-300",
                              projectionStep > item.threshold ? "border-teal-100 bg-teal-50" : projectionStep === item.threshold ? "border-teal-200 bg-white animate-pulse" : "border-navy-100/40 bg-white opacity-50"
                            )}>
                              {projectionStep > item.threshold ? (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal"><Check className="h-3.5 w-3.5 text-white" /></div>
                              ) : projectionStep === item.threshold ? (
                                <div className="h-6 w-6 rounded-full border-2 border-teal border-t-transparent animate-spin" />
                              ) : (
                                <div className="h-6 w-6 rounded-full border-2 border-navy-200" />
                              )}
                              <span className={cn("text-sm", projectionStep > item.threshold ? "font-medium text-teal-800" : "text-graphite-500")}>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : projection && (
                      <div className="space-y-6 animate-fade-in-up">
                        <div className="rounded-2xl bg-gradient-to-br from-navy to-atlantic p-5 text-white text-center">
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                            <TrendingDown className="h-6 w-6 text-teal-300" />
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-teal-300 mb-2">Your personalized projection</p>
                          <h2 className="text-2xl font-bold sm:text-3xl">
                            You could lose <span className="text-teal-300">~{Math.round(projection.summary.totalLossWithPlan)} lbs</span>
                          </h2>
                          <p className="mt-1 text-sm text-navy-300">
                            Reaching ~{Math.round(projection.summary.projectedWeightWithPlan)} lbs by <strong className="text-white">{projection.summary.targetDate}</strong>
                          </p>
                          <p className="mt-3 text-xs text-navy-400">Based on your profile &amp; STEP/SURMOUNT clinical trial data</p>
                        </div>

                        {/* Chart */}
                        <div className="rounded-xl border border-navy-100/60 bg-white p-4">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs">
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-5 rounded-full bg-graphite-300" /> Diet &amp; Exercise Only
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="h-2.5 w-5 rounded-full bg-teal" /> GLP-1 Medication
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="h-2.5 w-5 rounded-full bg-gold" /> GLP-1 + VitalPath Plan
                            </span>
                          </div>
                          <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={projection.monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                              <defs>
                                <linearGradient id="gradDiet" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#8896AB" stopOpacity={0.08} />
                                  <stop offset="100%" stopColor="#8896AB" stopOpacity={0.01} />
                                </linearGradient>
                                <linearGradient id="gradMed" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#0D9488" stopOpacity={0.15} />
                                  <stop offset="100%" stopColor="#0D9488" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="gradPlan" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#D4A853" stopOpacity={0.2} />
                                  <stop offset="100%" stopColor="#D4A853" stopOpacity={0.02} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8896AB" }} tickLine={false} axisLine={false} interval={2} />
                              <YAxis tick={{ fontSize: 10, fill: "#8896AB" }} tickLine={false} axisLine={false} domain={["auto", "auto"]} unit=" lbs" width={55} />
                              <Tooltip
                                contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4", fontSize: "12px" }}
                                formatter={(value: number, name: string) => [
                                  `${Math.round(value)} lbs`,
                                  name === "dietExercise" ? "Diet & Exercise Only" : name === "medicationOnly" ? "GLP-1 Medication" : "GLP-1 + VitalPath Plan",
                                ]}
                                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                              />
                              <Area type="monotone" dataKey="dietExercise" stroke="#8896AB" strokeWidth={1.5} fill="url(#gradDiet)" dot={false} strokeDasharray="4 4" />
                              <Area type="monotone" dataKey="medicationOnly" stroke="#0D9488" strokeWidth={2} fill="url(#gradMed)" dot={false} />
                              <Area type="monotone" dataKey="withPlan" stroke="#D4A853" strokeWidth={2.5} fill="url(#gradPlan)" dot={false} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Weight Journey Progress Bar */}
                        <div className="rounded-xl border border-navy-100/60 bg-white p-4">
                          <div className="flex items-center justify-between text-xs text-graphite-400 mb-2">
                            <span>Current: <strong className="text-navy">{Math.round(w)} lbs</strong></span>
                            <span>Projected: <strong className="text-teal">{Math.round(projection.summary.projectedWeightWithPlan)} lbs</strong></span>
                          </div>
                          <div className="relative h-4 rounded-full bg-navy-100/40 overflow-hidden">
                            <motion.div
                              initial={{ width: "100%" }}
                              animate={{ width: `${Math.max(15, 100 - (projection.summary.totalLossWithPlan / w) * 100)}%` }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal to-atlantic"
                            />
                          </div>
                          <p className="mt-2 text-center text-xs text-graphite-500">
                            <strong className="text-teal">-{Math.round(projection.summary.totalLossWithPlan)} lbs</strong> projected with VitalPath Plan
                          </p>
                        </div>

                        {/* Milestones with animated counters */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          {projection.milestones.map((m, i) => (
                            <div key={m.month} className="rounded-xl border border-navy-100/60 bg-white p-3 text-center">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">Month {m.month}</p>
                              <div className="mt-1 text-lg font-bold text-navy">
                                <AnimatedCounter value={Math.round(m.weightWithPlan)} duration={1200 + i * 300} />
                              </div>
                              <p className="text-xs text-graphite-400">lbs</p>
                              <Badge variant="default" className="mt-1 text-[10px]">
                                -<AnimatedCounter value={Math.round(m.totalLostWithPlan)} duration={1200 + i * 300} /> lbs
                              </Badge>
                            </div>
                          ))}
                        </div>

                        {/* 3-way comparison */}
                        <div className="rounded-xl bg-gradient-to-r from-navy to-atlantic p-5 text-white">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-4 w-4 text-teal-300" />
                            <p className="text-xs font-semibold uppercase tracking-wider text-teal-300">Why medication matters</p>
                          </div>
                          <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            <div className="rounded-xl bg-white/5 p-2 sm:p-3 text-center">
                              <p className="text-[10px] text-navy-300">Diet &amp; Exercise</p>
                              <p className="text-lg font-bold text-graphite-300">-<AnimatedCounter value={Math.round(projection.summary.totalLossDietExercise)} duration={1200} /> lbs</p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-3 text-center">
                              <p className="text-[10px] text-navy-300">GLP-1 Medication</p>
                              <p className="text-lg font-bold">-<AnimatedCounter value={Math.round(projection.summary.totalLossMedOnly)} duration={1500} /> lbs</p>
                            </div>
                            <div className="rounded-xl bg-teal/30 p-3 text-center border border-teal/40">
                              <p className="text-[10px] text-teal-300">GLP-1 + VitalPath</p>
                              <p className="text-lg font-bold text-teal-200">-<AnimatedCounter value={Math.round(projection.summary.totalLossWithPlan)} duration={1500} /> lbs</p>
                            </div>
                          </div>
                          <p className="mt-3 text-center text-sm font-semibold">
                            <span className="text-teal-300">{Math.round(projection.summary.totalLossWithPlan / Math.max(1, projection.summary.totalLossDietExercise))}x more</span> weight loss than diet &amp; exercise alone
                          </p>
                        </div>

                        {/* Testimonial */}
                        <div className="rounded-xl border border-navy-100/60 bg-navy-50/30 p-4">
                          <div className="flex gap-0.5 mb-2">
                            {[1,2,3,4,5].map((i) => <span key={i} className="text-gold text-sm">★</span>)}
                          </div>
                          <p className="text-sm text-graphite-600 italic leading-relaxed">
                            &ldquo;I lost 47 lbs in 6 months with VitalPath. My projection said 40 lbs — I actually exceeded it. The support team checked in every week.&rdquo;
                          </p>
                          <p className="mt-2 text-xs font-semibold text-navy">— Sarah M., Texas · Verified Member</p>
                        </div>

                        <p className="text-[10px] text-graphite-300 text-center leading-relaxed">
                          {siteConfig.compliance.resultsDisclaimer} Projections based on clinical trial averages (STEP/SURMOUNT trials).
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── STEP 6: Personal Info ─── */}
                {step === 6 && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-bold text-navy mb-1">Almost there — a few more details</h2>
                      <p className="text-sm text-graphite-400 mb-4">Your provider needs this to evaluate your eligibility.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div data-error={!!fieldErrors.firstName || undefined}>
                        <label className={cn("block text-sm font-semibold mb-1.5 transition-colors", fieldErrors.firstName ? "text-red-500" : "text-navy")}>First Name {fieldErrors.firstName && <span className="font-normal">*</span>}</label>
                        <Input value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} className={cn(fieldErrors.firstName && "!border-red-400 ring-2 ring-red-100")} required />
                      </div>
                      <div data-error={!!fieldErrors.lastName || undefined}>
                        <label className={cn("block text-sm font-semibold mb-1.5 transition-colors", fieldErrors.lastName ? "text-red-500" : "text-navy")}>Last Name {fieldErrors.lastName && <span className="font-normal">*</span>}</label>
                        <Input value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} className={cn(fieldErrors.lastName && "!border-red-400 ring-2 ring-red-100")} required />
                      </div>
                    </div>

                    <div data-error={!!fieldErrors.email || undefined}>
                      <label className={cn("block text-sm font-semibold mb-1.5 transition-colors", fieldErrors.email ? "text-red-500" : "text-navy")}>Email {fieldErrors.email && <span className="font-normal">*</span>}</label>
                      <Input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className={cn(fieldErrors.email && "!border-red-400 ring-2 ring-red-100")} required />
                    </div>

                    <div data-error={!!fieldErrors.phone || undefined}>
                      <label className={cn("block text-sm font-semibold mb-1.5 transition-colors", fieldErrors.phone ? "text-red-500" : "text-navy")}>Phone {fieldErrors.phone && <span className="font-normal">*</span>}</label>
                      <Input type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className={cn(fieldErrors.phone && "!border-red-400 ring-2 ring-red-100")} placeholder="(555) 123-4567" required />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div data-error={!!fieldErrors.dateOfBirth || undefined}>
                        <label className={cn("block text-sm font-semibold mb-1.5 transition-colors", fieldErrors.dateOfBirth ? "text-red-500" : "text-navy")}>Date of Birth {fieldErrors.dateOfBirth && <span className="font-normal">*</span>}</label>
                        <Input type="date" value={form.dateOfBirth} onChange={(e) => setField("dateOfBirth", e.target.value)} className={cn(fieldErrors.dateOfBirth && "!border-red-400 ring-2 ring-red-100")} required />
                      </div>
                      <div data-error={!!fieldErrors.state || undefined}>
                        <label className={cn("block text-sm font-semibold mb-1.5 transition-colors", fieldErrors.state ? "text-red-500" : "text-navy")}>State {fieldErrors.state && <span className="font-normal">*</span>}</label>
                        <select value={form.state} onChange={(e) => setField("state", e.target.value)} className={cn("calculator-input", fieldErrors.state && "!border-red-400 ring-2 ring-red-100")} required>
                          <option value="">Select your state</option>
                          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div data-error={!!fieldErrors.medicalHistory || undefined}>
                      <label className={cn("block text-sm font-semibold mb-1.5 transition-colors", fieldErrors.medicalHistory ? "text-red-500" : "text-navy")}>Medical History Summary {fieldErrors.medicalHistory && <span className="font-normal">— {fieldErrors.medicalHistory}</span>}</label>
                      <textarea
                        value={form.medicalHistory}
                        onChange={(e) => setField("medicalHistory", e.target.value)}
                        className={cn("calculator-input min-h-[80px] resize-y", fieldErrors.medicalHistory && "!border-red-400 ring-2 ring-red-100")}
                        placeholder="Briefly describe your relevant medical history, previous weight management attempts, and anything else your provider should know."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Goal Weight (optional)</label>
                      <div className="relative">
                        <input type="number" value={form.goalWeightLbs} onChange={(e) => setField("goalWeightLbs", e.target.value)} className="calculator-input pr-12" placeholder={projection ? `Suggested: ${Math.round(projection.summary.projectedWeightWithPlan)}` : "e.g. 165"} />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">lbs</span>
                      </div>
                      {projection && !form.goalWeightLbs && (
                        <button type="button" onClick={() => setField("goalWeightLbs", String(Math.round(projection.summary.projectedWeightWithPlan)))} className="mt-1.5 text-xs text-teal hover:underline">
                          Use suggested goal: {Math.round(projection.summary.projectedWeightWithPlan)} lbs (based on your projection)
                        </button>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div className="mt-2 rounded-xl border-2 border-navy-200 bg-navy-50/30 p-5">
                      <h3 className="text-sm font-bold text-navy mb-1">Emergency Contact</h3>
                      <p className="text-xs text-graphite-400 mb-4">Required for your safety during treatment.</p>
                      <div className="space-y-3">
                        <div data-error={!!fieldErrors.emergencyContactName || undefined}>
                          <label className={cn("block text-xs font-semibold mb-1 transition-colors", fieldErrors.emergencyContactName ? "text-red-500" : "text-navy")}>Full Name {fieldErrors.emergencyContactName && <span className="font-normal">*</span>}</label>
                          <Input value={form.emergencyContactName} onChange={(e) => setField("emergencyContactName", e.target.value)} className={cn(fieldErrors.emergencyContactName && "!border-red-400 ring-2 ring-red-100")} placeholder="Emergency contact name" required />
                        </div>
                        <div data-error={!!fieldErrors.emergencyContactPhone || undefined}>
                          <label className={cn("block text-xs font-semibold mb-1 transition-colors", fieldErrors.emergencyContactPhone ? "text-red-500" : "text-navy")}>Phone Number {fieldErrors.emergencyContactPhone && <span className="font-normal">*</span>}</label>
                          <Input type="tel" value={form.emergencyContactPhone} onChange={(e) => setField("emergencyContactPhone", e.target.value)} className={cn(fieldErrors.emergencyContactPhone && "!border-red-400 ring-2 ring-red-100")} placeholder="(555) 123-4567" required />
                        </div>
                        <div data-error={!!fieldErrors.emergencyContactRelation || undefined}>
                          <label className={cn("block text-xs font-semibold mb-1 transition-colors", fieldErrors.emergencyContactRelation ? "text-red-500" : "text-navy")}>Relationship {fieldErrors.emergencyContactRelation && <span className="font-normal">*</span>}</label>
                          <Input value={form.emergencyContactRelation} onChange={(e) => setField("emergencyContactRelation", e.target.value)} className={cn(fieldErrors.emergencyContactRelation && "!border-red-400 ring-2 ring-red-100")} placeholder="e.g., Spouse, Parent, Sibling" required />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl bg-navy-50/50 px-4 py-3">
                      <Shield className="h-4 w-4 shrink-0 text-teal" />
                      <p className="text-xs text-graphite-400">HIPAA-compliant &middot; 256-bit encrypted &middot; Never shared without consent</p>
                    </div>
                  </div>
                )}

                {/* ─── STEP 7: Plan & Consent ─── */}
                {step === 7 && (
                  <div className="space-y-5">
                    {/* Recommended Plan */}
                    <div className="rounded-2xl border-2 border-teal bg-white p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="gold" className="text-xs">Recommended for you</Badge>
                        {plan.badge && <Badge variant="default" className="text-xs">{plan.badge}</Badge>}
                      </div>
                      <h2 className="text-2xl font-bold text-navy">{plan.name} Plan</h2>
                      <p className="mt-1 text-sm text-graphite-500">{plan.description}</p>

                      <div className="mt-4 flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-navy">{formatPrice(plan.priceMonthly)}</span>
                        <span className="text-sm text-graphite-400">/month</span>
                        <span className="text-sm text-graphite-300 line-through">$1,349/mo retail</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="gold" className="text-xs shadow-gold-glow">
                          You save ${Math.round((134900 - plan.priceMonthly) / 100)}/mo
                        </Badge>
                        <p className="text-xs text-teal font-semibold">
                          {Math.round((1 - plan.priceMonthly / 134900) * 100)}% less than brand-name
                        </p>
                      </div>

                      {/* Projection reference */}
                      {projection && (
                        <div className="mt-3 rounded-xl bg-navy-50/50 px-4 py-2.5 flex items-center gap-2">
                          <Target className="h-4 w-4 text-teal shrink-0" />
                          <p className="text-xs text-graphite-600">
                            Based on your profile, you could reach <strong>~{Math.round(projection.summary.projectedWeightWithPlan)} lbs</strong> by <strong>{projection.summary.targetDate}</strong>
                          </p>
                        </div>
                      )}

                      {/* Features */}
                      <div className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {plan.features.map((f) => (
                          <div key={f} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 shrink-0 text-teal" />
                            <span className="text-xs text-graphite-600">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="rounded-xl bg-navy-50/50 p-4 text-sm text-graphite-600 space-y-1">
                      <p className="text-xs font-semibold text-navy mb-2">Your Information Summary</p>
                      <p><strong>Name:</strong> {form.firstName} {form.lastName}</p>
                      <p><strong>Email:</strong> {form.email}</p>
                      <p><strong>State:</strong> {form.state}</p>
                      <p><strong>BMI:</strong> {Math.round(bmi * 10) / 10} ({bmiCat})</p>
                      {hasContraindication && (
                        <p className="text-amber-700 font-semibold">Safety screening flags noted — provider will review</p>
                      )}
                    </div>

                    {/* 4 Required Consents */}
                    {/* Consent progress */}
                    {(() => {
                      const agreed = [form.consentTreatment, form.consentHipaa, form.consentTelehealth, form.consentMedicationRisks].filter(Boolean).length;
                      return agreed > 0 && agreed < 4 ? (
                        <div className="flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-2.5">
                          <div className="flex gap-1">
                            {[0,1,2,3].map((i) => (
                              <div key={i} className={cn("h-2 w-8 rounded-full transition-all", i < agreed ? "bg-teal" : "bg-navy-100/60")} />
                            ))}
                          </div>
                          <p className="text-xs text-teal-700 font-medium">{agreed} of 4 agreed</p>
                        </div>
                      ) : agreed === 4 ? (
                        <div className="flex items-center gap-2 rounded-xl border border-teal bg-teal-50 px-4 py-2.5">
                          <Check className="h-4 w-4 text-teal" />
                          <p className="text-xs text-teal-700 font-semibold">All consents agreed — ready to submit!</p>
                        </div>
                      ) : null;
                    })()}
                    {!(form.consentTreatment && form.consentHipaa && form.consentTelehealth && form.consentMedicationRisks) && (
                      <button
                        type="button"
                        onClick={() => {
                          setField("consentTreatment", true);
                          setField("consentHipaa", true);
                          setField("consentTelehealth", true);
                          setField("consentMedicationRisks", true);
                        }}
                        className="w-full rounded-xl border-2 border-teal bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800 transition-all hover:bg-teal-100"
                      >
                        <Check className="mr-2 inline h-4 w-4" />
                        I&apos;ve read and agree to all consents below
                      </button>
                    )}
                    {fieldErrors.consentTreatment || fieldErrors.consentHipaa || fieldErrors.consentTelehealth || fieldErrors.consentMedicationRisks ? (
                      <p className="text-xs text-red-500 font-medium">Please review and check all four consent boxes to continue</p>
                    ) : null}
                    <div className="space-y-3">
                      <label className={cn("flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-all", form.consentTreatment ? "border-teal bg-teal-50/30" : fieldErrors.consentTreatment ? "border-red-300 bg-red-50/30 hover:border-red-400" : "border-navy-200 hover:border-navy-300")}>
                        <input type="checkbox" checked={form.consentTreatment} onChange={(e) => setField("consentTreatment", e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-navy-300 text-teal focus:ring-teal" />
                        <div>
                          <p className="text-sm font-semibold text-navy">Treatment Consent</p>
                          <p className="mt-1 text-xs text-graphite-400 leading-relaxed">
                            I consent to a telehealth evaluation by a licensed medical provider.
                            I understand that treatment eligibility is determined by my provider,
                            medication is only available to eligible patients, and compounded
                            medications are not FDA-approved. I understand individual results vary.
                            I acknowledge that my provider will review my medical history, current
                            medications, and health conditions before making any prescribing decisions.
                          </p>
                        </div>
                      </label>

                      <label className={cn("flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-all", form.consentHipaa ? "border-teal bg-teal-50/30" : fieldErrors.consentHipaa ? "border-red-300 bg-red-50/30 hover:border-red-400" : "border-navy-200 hover:border-navy-300")}>
                        <input type="checkbox" checked={form.consentHipaa} onChange={(e) => setField("consentHipaa", e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-navy-300 text-teal focus:ring-teal" />
                        <div>
                          <p className="text-sm font-semibold text-navy">HIPAA Authorization</p>
                          <p className="mt-1 text-xs text-graphite-400 leading-relaxed">
                            I authorize VitalPath and its affiliated providers and pharmacies to
                            use and disclose my protected health information (PHI) for treatment,
                            payment, and healthcare operations as described in the{" "}
                            <a href="/legal/hipaa" className="underline text-teal">HIPAA Notice</a>.
                            I understand I may revoke this authorization in writing at any time,
                            except to the extent that action has already been taken in reliance on it.
                          </p>
                        </div>
                      </label>

                      <label className={cn("flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-all", form.consentTelehealth ? "border-teal bg-teal-50/30" : fieldErrors.consentTelehealth ? "border-red-300 bg-red-50/30 hover:border-red-400" : "border-navy-200 hover:border-navy-300")}>
                        <input type="checkbox" checked={form.consentTelehealth} onChange={(e) => setField("consentTelehealth", e.target.checked)} className="mt-0.5 h-5 w-5 rounded border-navy-300 text-teal focus:ring-teal" />
                        <div>
                          <p className="text-sm font-semibold text-navy">Telehealth Consent</p>
                          <p className="mt-1 text-xs text-graphite-400 leading-relaxed">
                            I consent to receive healthcare services via telehealth technology.
                            I understand the limitations of telehealth, including that the provider
                            cannot physically examine me, and that I may be referred for in-person
                            care if clinically appropriate. I understand that telehealth consultations
                            are not a substitute for emergency medical care. In case of a medical
                            emergency, I will call 911 or go to my nearest emergency room.
                          </p>
                        </div>
                      </label>

                      <label className={cn("flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-all", form.consentMedicationRisks ? "border-teal bg-teal-50/30" : fieldErrors.consentMedicationRisks ? "border-red-300 bg-red-50/30 hover:border-red-400" : "border-amber-200 bg-amber-50/30 hover:border-amber-300")}>
                        <input type="checkbox" checked={form.consentMedicationRisks} onChange={(e) => setField("consentMedicationRisks", e.target.checked)} className={cn("mt-0.5 h-5 w-5 rounded", form.consentMedicationRisks ? "border-teal text-teal focus:ring-teal" : "border-amber-300 text-amber-600 focus:ring-amber-500")} />
                        <div>
                          <p className="text-sm font-semibold text-navy">Medication Risk Acknowledgment</p>
                          <p className="mt-1 text-xs text-graphite-400 leading-relaxed">
                            I acknowledge that GLP-1 receptor agonist medications carry potential risks
                            and side effects including but not limited to: nausea, vomiting, diarrhea,
                            constipation, abdominal pain, headache, fatigue, injection site reactions,
                            pancreatitis, thyroid tumors (including medullary thyroid carcinoma),
                            gallbladder problems, kidney problems, hypoglycemia, and allergic reactions.
                            I understand that compounded semaglutide/tirzepatide are not FDA-approved
                            products and are prepared by state-licensed compounding pharmacies.
                          </p>
                        </div>
                      </label>
                    </div>

                    {error && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Social proof */}
            {stepProof[step] && (
              <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-navy-100/40 bg-navy-50/30 px-4 py-3">
                {(() => { const Icon = stepProof[step]!.icon; return <Icon className={cn("h-4 w-4 shrink-0", stepProof[step]!.color)} />; })()}
                <p className="text-xs text-graphite-500">{stepProof[step]!.text}</p>
              </div>
            )}

            {/* Navigation */}
            {attemptedNext && Object.keys(fieldErrors).length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-600 font-medium">
                  {Object.keys(fieldErrors).length === 1
                    ? "1 field needs your attention above"
                    : `${Object.keys(fieldErrors).length} fields need your attention above`}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <Button variant="ghost" onClick={prevStep} disabled={step === 1} className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>

              {step < 7 ? (
                <Button onClick={nextStep} disabled={step === 5 && !projectionRevealed} className="gap-1">
                  {step === 1 && "Check My Results"}
                  {step === 2 && "Continue"}
                  {step === 3 && "Continue"}
                  {step === 4 && "See My Projection"}
                  {step === 5 && "Claim My Plan"}
                  {step === 6 && "Review My Plan"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="gap-1 shadow-glow">
                  {loading ? "Submitting..." : `Start My ${plan.name} Plan`}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              )}
            </div>

            {/* Micro-timeline on step 7 */}
            {step === 7 && (
              <>
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-graphite-400">
                  <span className="flex items-center gap-1">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal">1</span>
                    Submit intake
                  </span>
                  <span className="text-navy-200">&rarr;</span>
                  <span className="flex items-center gap-1">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal">2</span>
                    Same-day review
                  </span>
                  <span className="text-navy-200">&rarr;</span>
                  <span className="flex items-center gap-1">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal">3</span>
                    Ships in 48hrs
                  </span>
                </div>
                <p className="mt-3 text-center text-xs text-graphite-400">
                  Cancel anytime &middot; No hidden fees &middot; Treatment eligibility confirmed by your provider
                </p>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-graphite-300">
            {siteConfig.compliance.eligibilityDisclaimer}
          </p>
        </SectionShell>
      </section>

      {/* Exit intent modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setShowExitModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-premium-xl animate-fade-in-up">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">Don&apos;t lose your spot!</h2>
              <Badge variant="gold" className="text-xs">
                {Math.round(progress)}% complete
              </Badge>
            </div>
            {projection ? (
              <div className="mb-4 rounded-xl bg-teal-50 border border-teal-100 p-3">
                <p className="text-xs font-semibold text-teal-700 mb-0.5">Your projection is ready</p>
                <p className="text-sm font-bold text-navy">
                  You could lose ~{Math.round(projection.summary.totalLossWithPlan)} lbs by {projection.summary.targetDate}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-graphite-500 mb-4">
                Your answers are saved. Want us to email you a link to finish?
              </p>
            )}
            <p className="text-xs text-graphite-500 mb-2">Send me a link to finish later:</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className="flex-1 rounded-xl border border-navy-100 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <Button onClick={async () => {
                if (form.email) {
                  try { await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, name: form.firstName || undefined, source: "qualify_exit_intent" }) }); } catch {}
                }
                track(ANALYTICS_EVENTS.QUALIFY_STEP_COMPLETE, { step: "exit_save", email: form.email });
                setShowExitModal(false);
              }} size="sm">
                Save
              </Button>
            </div>
            <div className="mt-4 flex gap-3">
              <Button size="sm" className="flex-1 shadow-glow" onClick={() => setShowExitModal(false)}>
                Continue — I&apos;m staying
              </Button>
              <button onClick={() => setShowExitModal(false)} className="text-xs text-graphite-400 hover:text-graphite-600">
                Leave
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

// ─── Shared Components ─────────────────────────────────────

function SelectButton({ selected, onClick, children, error }: { selected: boolean; onClick: () => void; children: React.ReactNode; error?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all flex-1",
        selected
          ? "border-teal bg-teal-50 text-teal-800"
          : error
            ? "border-red-300 text-graphite-500 hover:border-red-400"
            : "border-navy-200 text-graphite-500 hover:border-navy-300"
      )}
    >
      {children}
    </button>
  );
}
