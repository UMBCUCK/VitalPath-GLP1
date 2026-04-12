"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check, ArrowRight, Scale, Heart, Pill, MessageCircle,
  Loader2, TrendingDown, TrendingUp, Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

type Step = 1 | 2 | 3 | 4;

const MOODS = [
  { value: 1, emoji: "😞", label: "Rough" },
  { value: 2, emoji: "😕", label: "Meh" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😄", label: "Great" },
];

const ENERGY = [
  { value: 1, emoji: "🪫", label: "Drained" },
  { value: 2, emoji: "😴", label: "Tired" },
  { value: 3, emoji: "😐", label: "Normal" },
  { value: 4, emoji: "⚡", label: "Energized" },
  { value: 5, emoji: "🚀", label: "Amazing" },
];

const STEPS = [
  { num: 1 as Step, label: "Weight", icon: Scale },
  { num: 2 as Step, label: "Feeling", icon: Heart },
  { num: 3 as Step, label: "Meds", icon: Pill },
  { num: 4 as Step, label: "Questions", icon: MessageCircle },
];

interface LastEntry {
  date: string;
  daysAgo: number;
  weightLbs: number | null;
  moodRating: number | null;
  medicationTaken: boolean | null;
}

export function CheckInClient({ lastEntry }: { lastEntry: LastEntry | null }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    weightLbs: "",
    moodRating: 0,
    energyRating: 0,
    medicationTaken: true,
    sideEffects: "",
    questionsForProvider: "",
  });

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weightLbs: form.weightLbs ? parseFloat(form.weightLbs) : undefined,
          moodRating: form.moodRating || undefined,
          energyRating: form.energyRating || undefined,
          medicationTaken: form.medicationTaken,
          notes: [form.sideEffects, form.questionsForProvider].filter(Boolean).join(" | ") || undefined,
        }),
      });

      if (form.questionsForProvider.trim()) {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: "Weekly Check-In",
            body: `Weekly check-in:\n- Weight: ${form.weightLbs || "not logged"} lbs\n- Mood: ${form.moodRating}/5\n- Energy: ${form.energyRating}/5\n- Medication: ${form.medicationTaken ? "taken" : "missed"}\n${form.sideEffects ? `- Side effects: ${form.sideEffects}` : ""}\n\nQuestion: ${form.questionsForProvider}`,
          }),
        });
      }

      track(ANALYTICS_EVENTS.CHECK_IN_COMPLETE);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-navy">Check-in complete!</h2>
          <p className="mt-3 text-sm text-graphite-400">
            Your care team will review your responses within 24 hours. Keep up the great work.
          </p>
          {form.weightLbs && lastEntry?.weightLbs && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-50 border border-teal/20 px-4 py-3">
              {parseFloat(form.weightLbs) < lastEntry.weightLbs ? (
                <TrendingDown className="h-4 w-4 text-teal" />
              ) : parseFloat(form.weightLbs) > lastEntry.weightLbs ? (
                <TrendingUp className="h-4 w-4 text-amber-500" />
              ) : (
                <Minus className="h-4 w-4 text-graphite-400" />
              )}
              <p className="text-sm font-medium text-navy">
                {parseFloat(form.weightLbs) < lastEntry.weightLbs
                  ? `Down ${(lastEntry.weightLbs - parseFloat(form.weightLbs)).toFixed(1)} lbs since last check-in`
                  : parseFloat(form.weightLbs) > lastEntry.weightLbs
                  ? `Up ${(parseFloat(form.weightLbs) - lastEntry.weightLbs).toFixed(1)} lbs since last check-in`
                  : "Same as last check-in"}
              </p>
            </div>
          )}
          <Button className="mt-6 gap-2" onClick={() => router.push("/dashboard")}>
            Back to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-navy">Weekly Check-In</h2>
        <p className="mt-1 text-sm text-graphite-400">
          {lastEntry
            ? lastEntry.daysAgo === 0
              ? "You checked in today — feel free to update."
              : lastEntry.daysAgo === 1
              ? "Last check-in: yesterday"
              : `Last check-in: ${lastEntry.date} (${lastEntry.daysAgo} days ago)`
            : "Your first check-in — takes about 1 minute"}
        </p>
      </div>

      {/* Visual stepper */}
      <div className="flex items-center">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => s.num < step && setStep(s.num)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all",
                  s.num < step
                    ? "bg-teal text-white cursor-pointer"
                    : s.num === step
                    ? "bg-navy text-white ring-4 ring-navy/20"
                    : "bg-navy-100 text-graphite-400"
                )}
              >
                {s.num < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </button>
              <p className={cn(
                "text-[10px] font-medium",
                s.num <= step ? "text-navy" : "text-graphite-300"
              )}>
                {s.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "h-0.5 flex-1 mx-2 mb-5",
                step > s.num ? "bg-teal" : "bg-navy-100"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Last check-in context */}
      {lastEntry && (
        <div className="flex items-center gap-3 rounded-xl bg-navy-50/50 px-4 py-3 text-xs text-graphite-500">
          <div className="h-2 w-2 rounded-full bg-teal shrink-0" />
          <span>
            Last entry ({lastEntry.date}):{" "}
            {lastEntry.weightLbs && <strong className="text-navy">{lastEntry.weightLbs} lbs</strong>}
            {lastEntry.moodRating && (
              <span> · mood {MOODS[lastEntry.moodRating - 1]?.emoji}</span>
            )}
            {lastEntry.medicationTaken !== null && (
              <span> · meds {lastEntry.medicationTaken ? "✓" : "✗"}</span>
            )}
          </span>
        </div>
      )}

      {/* Step 1: Weight */}
      {step === 1 && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                <Scale className="h-5 w-5 text-teal" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy">What&apos;s your weight today?</h3>
                <p className="text-xs text-graphite-400">Optional — skip if you didn&apos;t weigh in</p>
              </div>
            </div>
            <div className="relative">
              <Input
                type="number"
                value={form.weightLbs}
                onChange={(e) => setForm((p) => ({ ...p, weightLbs: e.target.value }))}
                placeholder={lastEntry?.weightLbs ? String(lastEntry.weightLbs) : "198"}
                className="text-2xl font-bold pr-14 h-14"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-graphite-400">lbs</span>
            </div>
            {lastEntry?.weightLbs && form.weightLbs && (
              <div className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
                parseFloat(form.weightLbs) < lastEntry.weightLbs
                  ? "bg-teal-50 text-teal-700"
                  : parseFloat(form.weightLbs) > lastEntry.weightLbs
                  ? "bg-amber-50 text-amber-700"
                  : "bg-navy-50 text-graphite-500"
              )}>
                {parseFloat(form.weightLbs) < lastEntry.weightLbs
                  ? <TrendingDown className="h-3.5 w-3.5" />
                  : parseFloat(form.weightLbs) > lastEntry.weightLbs
                  ? <TrendingUp className="h-3.5 w-3.5" />
                  : <Minus className="h-3.5 w-3.5" />}
                {parseFloat(form.weightLbs) < lastEntry.weightLbs
                  ? `Down ${(lastEntry.weightLbs - parseFloat(form.weightLbs)).toFixed(1)} lbs`
                  : parseFloat(form.weightLbs) > lastEntry.weightLbs
                  ? `Up ${(parseFloat(form.weightLbs) - lastEntry.weightLbs).toFixed(1)} lbs`
                  : "No change"}
                <span className="opacity-60">since last check-in</span>
              </div>
            )}
            <Button className="w-full" onClick={() => setStep(2)}>
              Continue <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Mood & Energy */}
      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50">
                <Heart className="h-5 w-5 text-gold-600" />
              </div>
              <h3 className="text-base font-bold text-navy">How are you feeling?</h3>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy mb-3 block">Overall mood</label>
              <div className="flex gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setForm((p) => ({ ...p, moodRating: m.value }))}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-1 rounded-xl py-3 transition-all text-center",
                      form.moodRating === m.value
                        ? "bg-gold-50 border-2 border-gold/60 scale-105 shadow-sm"
                        : "bg-navy-50 border-2 border-transparent hover:bg-navy-100"
                    )}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[10px] font-medium text-graphite-500">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy mb-3 block">Energy level</label>
              <div className="flex gap-2">
                {ENERGY.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setForm((p) => ({ ...p, energyRating: e.value }))}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-1 rounded-xl py-3 transition-all text-center",
                      form.energyRating === e.value
                        ? "bg-teal-50 border-2 border-teal/40 scale-105 shadow-sm"
                        : "bg-navy-50 border-2 border-transparent hover:bg-navy-100"
                    )}
                  >
                    <span className="text-2xl">{e.emoji}</span>
                    <span className="text-[10px] font-medium text-graphite-500">{e.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>Continue <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Medication */}
      {step === 3 && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                <Pill className="h-5 w-5 text-teal" />
              </div>
              <h3 className="text-base font-bold text-navy">Medication &amp; side effects</h3>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy mb-3 block">
                Did you take your medication as prescribed?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: true, emoji: "✅", label: "Yes, all doses" },
                  { val: false, emoji: "❌", label: "Missed a dose" },
                ].map(({ val, emoji, label }) => (
                  <button
                    key={String(val)}
                    onClick={() => setForm((p) => ({ ...p, medicationTaken: val }))}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                      form.medicationTaken === val
                        ? "border-teal bg-teal-50 text-teal-800"
                        : "border-navy-200 text-graphite-500 hover:border-navy-300"
                    )}
                  >
                    <span className="text-lg">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-navy mb-2 block">
                Any side effects? <span className="font-normal text-graphite-400">(optional)</span>
              </label>
              <textarea
                value={form.sideEffects}
                onChange={(e) => setForm((p) => ({ ...p, sideEffects: e.target.value }))}
                className="calculator-input min-h-[80px] resize-y w-full"
                placeholder="Describe any side effects, or leave blank if none…"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(4)}>Continue <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Questions */}
      {step === 4 && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-atlantic/10">
                <MessageCircle className="h-5 w-5 text-atlantic" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy">Questions for your care team?</h3>
                <p className="text-xs text-graphite-400">Reviewed within 24 hours</p>
              </div>
            </div>

            <textarea
              value={form.questionsForProvider}
              onChange={(e) => setForm((p) => ({ ...p, questionsForProvider: e.target.value }))}
              className="calculator-input min-h-[100px] resize-y w-full"
              placeholder="Any questions, concerns, or updates for your provider? Leave blank if none…"
            />

            {/* Summary preview */}
            <div className="rounded-xl bg-navy-50/50 px-4 py-3 space-y-1.5">
              <p className="text-[11px] font-bold text-navy mb-2">Check-in summary</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-graphite-500">
                <span>Weight: <strong className="text-navy">{form.weightLbs ? `${form.weightLbs} lbs` : "Not logged"}</strong></span>
                <span>Mood: <strong className="text-navy">{form.moodRating ? MOODS[form.moodRating - 1].emoji : "—"}</strong></span>
                <span>Energy: <strong className="text-navy">{form.energyRating ? ENERGY[form.energyRating - 1].emoji : "—"}</strong></span>
                <span>Meds: <strong className="text-navy">{form.medicationTaken ? "Taken ✓" : "Missed"}</strong></span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                ) : (
                  <><Check className="h-4 w-4" /> Submit Check-In</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
