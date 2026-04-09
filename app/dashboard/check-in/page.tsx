"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Scale, Heart, Pill, AlertCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

type Step = 1 | 2 | 3 | 4;

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    weightLbs: "",
    moodRating: 0,
    energyRating: 0,
    medicationTaken: true,
    sideEffects: "",
    questionsForProvider: "",
  });

  async function handleSubmit() {
    // Save progress entry
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

    // Send message to care team if questions provided
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
  }

  if (submitted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-navy">Check-in complete!</h2>
          <p className="mt-3 text-sm text-graphite-400">Your care team will review your responses. Keep up the great work.</p>
          <Button className="mt-6 gap-2" onClick={() => router.push("/dashboard")}>
            Back to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <Badge variant="default" className="mb-4">Weekly Check-In</Badge>
        <h2 className="text-2xl font-bold text-navy">How&apos;s your week going?</h2>
        <p className="mt-2 text-sm text-graphite-400">Step {step} of 4 &middot; Takes about 1 minute</p>
      </div>

      {/* Step 1: Weight */}
      {step === 1 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="h-5 w-5 text-teal" />
              <h3 className="text-base font-bold text-navy">Current weight</h3>
            </div>
            <div className="relative">
              <Input type="number" value={form.weightLbs} onChange={(e) => setForm((p) => ({ ...p, weightLbs: e.target.value }))} placeholder="198" className="text-lg pr-12" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-graphite-400">lbs</span>
            </div>
            <p className="text-xs text-graphite-300">Optional — skip if you didn&apos;t weigh in this week</p>
            <Button className="w-full" onClick={() => setStep(2)}>Continue</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Mood & Energy */}
      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-5 w-5 text-gold-600" />
              <h3 className="text-base font-bold text-navy">How are you feeling?</h3>
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Overall mood</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setForm((p) => ({ ...p, moodRating: n }))}
                    className={cn("flex-1 rounded-xl py-3 text-sm font-bold transition-all", form.moodRating === n ? "bg-teal text-white" : "bg-navy-50 text-graphite-500 hover:bg-navy-100")}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-graphite-300 mt-1 px-1"><span>Low</span><span>Great</span></div>
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Energy level</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setForm((p) => ({ ...p, energyRating: n }))}
                    className={cn("flex-1 rounded-xl py-3 text-sm font-bold transition-all", form.energyRating === n ? "bg-gold text-white" : "bg-navy-50 text-graphite-500 hover:bg-navy-100")}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-graphite-300 mt-1 px-1"><span>Low</span><span>High</span></div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Medication */}
      {step === 3 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Pill className="h-5 w-5 text-teal" />
              <h3 className="text-base font-bold text-navy">Medication & side effects</h3>
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Did you take your medication as prescribed?</label>
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((val) => (
                  <button key={String(val)} onClick={() => setForm((p) => ({ ...p, medicationTaken: val }))}
                    className={cn("rounded-xl border-2 py-3 text-sm font-medium transition-all", form.medicationTaken === val ? "border-teal bg-teal-50 text-teal-800" : "border-navy-200 text-graphite-500")}>
                    {val ? "Yes, all doses" : "Missed a dose"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-navy mb-2 block">Any side effects?</label>
              <textarea value={form.sideEffects} onChange={(e) => setForm((p) => ({ ...p, sideEffects: e.target.value }))} className="calculator-input min-h-[80px] resize-y" placeholder="Describe any side effects, or leave blank if none..." />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(4)}>Continue</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Questions */}
      {step === 4 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="h-5 w-5 text-atlantic" />
              <h3 className="text-base font-bold text-navy">Questions for your care team?</h3>
            </div>
            <textarea value={form.questionsForProvider} onChange={(e) => setForm((p) => ({ ...p, questionsForProvider: e.target.value }))} className="calculator-input min-h-[100px] resize-y" placeholder="Any questions, concerns, or updates for your provider? Leave blank if none..." />
            <p className="text-xs text-graphite-300">Your care team reviews check-ins within 24 hours.</p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
              <Button className="flex-1 gap-2" onClick={handleSubmit}>
                Submit Check-In <Check className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
