"use client";
import { MarketingShell } from "@/components/layout/marketing-shell";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, AlertTriangle, Shield, Check, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SectionShell } from "@/components/shared/section-shell";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type IntakeStep = 1 | 2 | 3;

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const medicalConditions = [
  "Type 2 Diabetes",
  "High Blood Pressure",
  "High Cholesterol",
  "Sleep Apnea",
  "PCOS",
  "Hypothyroidism",
  "Fatty Liver Disease",
  "Joint Pain / Arthritis",
  "Depression / Anxiety",
  "Heart Disease",
  "None of the above",
];

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<IntakeStep>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // Step 1: Personal
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    state: "",

    // Step 2: Health
    heightFeet: "",
    heightInches: "",
    weightLbs: "",
    goalWeightLbs: "",
    medications: "",
    allergies: "",
    medicalHistory: "",
    conditions: [] as string[],

    // Contraindications
    hasThyroidCancer: false,
    hasMEN2: false,
    isPregnant: false,
    hasPancreatitis: false,

    // Step 3: Consent
    consentTreatment: false,
    consentHipaa: false,
    consentTelehealth: false,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  // Track intake start on mount
  useEffect(() => {
    track(ANALYTICS_EVENTS.INTAKE_START);
  }, []);

  // Track intake abandonment
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (step > 1 || form.firstName) {
      track(ANALYTICS_EVENTS.INTAKE_ABANDON, { step, fieldsCompleted: Object.values(form).filter(Boolean).length });
      e.preventDefault();
    }
  }, [step, form]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  function updateField(key: string, value: unknown) {
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

  const hasContraindication = form.hasThyroidCancer || form.hasMEN2 || form.isPregnant || form.hasPancreatitis;

  function nextStep() {
    track(ANALYTICS_EVENTS.INTAKE_STEP_COMPLETE, { step });
    setStep((s) => Math.min(3, s + 1) as IntakeStep);
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1) as IntakeStep);
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          heightFeet: parseInt(form.heightFeet),
          heightInches: parseInt(form.heightInches || "0"),
          weightLbs: parseFloat(form.weightLbs),
          goalWeightLbs: form.goalWeightLbs ? parseFloat(form.goalWeightLbs) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Submission failed");
        return;
      }

      track(ANALYTICS_EVENTS.INTAKE_COMPLETE);
      router.push("/pricing?intake=complete");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return form.firstName && form.lastName && form.email && form.phone && form.dateOfBirth && form.state;
      case 2: return form.heightFeet && form.weightLbs && form.medicalHistory.length >= 10;
      case 3: return form.consentTreatment && form.consentHipaa && form.consentTelehealth;
      default: return false;
    }
  };

  return (
    <MarketingShell><section className="min-h-[80vh] bg-gradient-to-b from-cloud to-white py-12">
      <SectionShell className="max-w-2xl">
        <div className="mb-8 text-center">
          <Badge variant="default" className="mb-4 gap-1.5">
            <Shield className="h-3 w-3" />
            Secure Medical Intake
          </Badge>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">
            Let&apos;s build your personalized treatment plan
          </h1>
          <p className="mt-2 text-sm text-graphite-400">
            Step {step} of {totalSteps} &middot; HIPAA-compliant &middot; Your data is encrypted
          </p>
        </div>

        <Progress value={progress} className="mb-8" />

        <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-md sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-navy">Personal Information</h2>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">First Name</label>
                      <Input value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Last Name</label>
                      <Input value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1.5">Email</label>
                    <Input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1.5">Phone</label>
                    <Input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(555) 123-4567" required />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1.5">Date of Birth</label>
                    <Input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} required />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1.5">State</label>
                    <select value={form.state} onChange={(e) => updateField("state", e.target.value)} className="calculator-input" required>
                      <option value="">Select your state</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Health Data */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-navy">Health Information</h2>

                  {/* Trust reassurance for sensitive data */}
                  <div className="flex items-center gap-3 rounded-xl bg-teal-50/50 border border-teal-100 px-4 py-3">
                    <Lock className="h-4 w-4 shrink-0 text-teal" />
                    <p className="text-xs text-teal-700">
                      Your health data is encrypted, HIPAA-protected, and only visible to your care team. We never sell your information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Height (ft)</label>
                      <Input type="number" value={form.heightFeet} onChange={(e) => updateField("heightFeet", e.target.value)} min={3} max={8} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Height (in)</label>
                      <Input type="number" value={form.heightInches} onChange={(e) => updateField("heightInches", e.target.value)} min={0} max={11} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Current Weight (lbs)</label>
                      <Input type="number" value={form.weightLbs} onChange={(e) => updateField("weightLbs", e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-1.5">Goal Weight (lbs, optional)</label>
                      <Input type="number" value={form.goalWeightLbs} onChange={(e) => updateField("goalWeightLbs", e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1.5">Current Medications</label>
                    <textarea
                      value={form.medications}
                      onChange={(e) => updateField("medications", e.target.value)}
                      className="calculator-input min-h-[80px] resize-y"
                      placeholder="List all current medications, dosages, and frequency. Enter 'None' if not applicable."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1.5">Allergies</label>
                    <Input value={form.allergies} onChange={(e) => updateField("allergies", e.target.value)} placeholder="List any allergies or enter 'None'" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1.5">Medical Conditions</label>
                    <div className="grid grid-cols-2 gap-2">
                      {medicalConditions.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCondition(c)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs text-left transition-all",
                            form.conditions.includes(c) ? "border-teal bg-teal-50 text-teal-800" : "border-navy-200 text-graphite-500 hover:border-navy-300"
                          )}
                        >
                          <div className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2",
                            form.conditions.includes(c) ? "border-teal bg-teal" : "border-navy-300"
                          )}>
                            {form.conditions.includes(c) && <Check className="h-2.5 w-2.5 text-white" />}
                          </div>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy mb-1.5">Medical History</label>
                    <textarea
                      value={form.medicalHistory}
                      onChange={(e) => updateField("medicalHistory", e.target.value)}
                      className="calculator-input min-h-[100px] resize-y"
                      placeholder="Please describe your relevant medical history, previous weight management attempts, and any other information your provider should know."
                      required
                    />
                  </div>

                  {/* Contraindication Screening */}
                  <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-bold text-amber-800">Safety Screening</span>
                    </div>
                    <p className="text-xs text-amber-700 mb-4">
                      Certain conditions may prevent safe use of GLP-1 medications. Please answer honestly.
                    </p>
                    <div className="space-y-3">
                      {[
                        { key: "hasThyroidCancer", label: "Have you or a family member had medullary thyroid carcinoma (MTC)?" },
                        { key: "hasMEN2", label: "Have you been diagnosed with Multiple Endocrine Neoplasia syndrome type 2 (MEN2)?" },
                        { key: "isPregnant", label: "Are you currently pregnant, planning to become pregnant, or breastfeeding?" },
                        { key: "hasPancreatitis", label: "Do you have a history of pancreatitis?" },
                      ].map((q) => (
                        <label key={q.key} className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form[q.key as keyof typeof form] as boolean}
                            onChange={(e) => updateField(q.key, e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-xs text-amber-800">{q.label}</span>
                        </label>
                      ))}
                    </div>

                    {hasContraindication && (
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

              {/* Step 3: Consent */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-navy">Review & Consent</h2>

                  <div className="rounded-xl bg-navy-50/50 p-4 text-sm text-graphite-600 space-y-2">
                    <p><strong>Name:</strong> {form.firstName} {form.lastName}</p>
                    <p><strong>Email:</strong> {form.email}</p>
                    <p><strong>State:</strong> {form.state}</p>
                    <p><strong>Height:</strong> {form.heightFeet}&apos;{form.heightInches || 0}&quot;</p>
                    <p><strong>Weight:</strong> {form.weightLbs} lbs</p>
                    {hasContraindication && (
                      <p className="text-amber-700 font-semibold">Safety screening flags noted — provider will review</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Treatment Consent */}
                    <label className="flex items-start gap-3 cursor-pointer rounded-xl border-2 border-navy-200 p-4 transition-all hover:border-navy-300">
                      <input
                        type="checkbox"
                        checked={form.consentTreatment}
                        onChange={(e) => updateField("consentTreatment", e.target.checked)}
                        className="mt-0.5 h-5 w-5 rounded border-navy-300 text-teal focus:ring-teal"
                      />
                      <div>
                        <p className="text-sm font-semibold text-navy">Treatment Consent</p>
                        <p className="mt-1 text-xs text-graphite-400 leading-relaxed">
                          I consent to a telehealth evaluation by a licensed medical provider.
                          I understand that treatment eligibility is determined by my provider,
                          medication is only available to eligible patients, and compounded
                          medications are not FDA-approved. I understand individual results vary.
                        </p>
                      </div>
                    </label>

                    {/* HIPAA Consent */}
                    <label className="flex items-start gap-3 cursor-pointer rounded-xl border-2 border-navy-200 p-4 transition-all hover:border-navy-300">
                      <input
                        type="checkbox"
                        checked={form.consentHipaa}
                        onChange={(e) => updateField("consentHipaa", e.target.checked)}
                        className="mt-0.5 h-5 w-5 rounded border-navy-300 text-teal focus:ring-teal"
                      />
                      <div>
                        <p className="text-sm font-semibold text-navy">HIPAA Authorization</p>
                        <p className="mt-1 text-xs text-graphite-400 leading-relaxed">
                          I authorize VitalPath and its affiliated providers and pharmacies to
                          use and disclose my protected health information for treatment,
                          payment, and healthcare operations as described in the{" "}
                          <a href="/legal/hipaa" className="underline text-teal">HIPAA Notice</a>.
                        </p>
                      </div>
                    </label>

                    {/* Telehealth Consent */}
                    <label className="flex items-start gap-3 cursor-pointer rounded-xl border-2 border-navy-200 p-4 transition-all hover:border-navy-300">
                      <input
                        type="checkbox"
                        checked={form.consentTelehealth}
                        onChange={(e) => updateField("consentTelehealth", e.target.checked)}
                        className="mt-0.5 h-5 w-5 rounded border-navy-300 text-teal focus:ring-teal"
                      />
                      <div>
                        <p className="text-sm font-semibold text-navy">Telehealth Consent</p>
                        <p className="mt-1 text-xs text-graphite-400 leading-relaxed">
                          I consent to receive healthcare services via telehealth technology.
                          I understand the limitations of telehealth, including that the provider
                          cannot physically examine me, and that I may be referred for in-person
                          care if clinically appropriate.
                        </p>
                      </div>
                    </label>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={prevStep} disabled={step === 1} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>

            {step < 3 ? (
              <Button onClick={nextStep} disabled={!canProceed()} className="gap-1">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || loading} className="gap-1">
                {loading ? "Submitting..." : "Submit Intake"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-graphite-300">
          Your information is encrypted and stored securely in compliance with HIPAA regulations.
          Only your care team has access to your health data.
        </p>
      </SectionShell>
    </section>
  </MarketingShell>
  );
}
