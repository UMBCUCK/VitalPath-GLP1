"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const weightRanges = [
  { value: "", label: "Current weight (optional)" },
  { value: "<180", label: "Under 180 lbs" },
  { value: "180-220", label: "180–220 lbs" },
  { value: "220-260", label: "220–260 lbs" },
  { value: "260-300", label: "260–300 lbs" },
  { value: "300+", label: "300+ lbs" },
];

const primaryGoals = [
  { value: "", label: "Primary goal (optional)" },
  { value: "lose-20-30", label: "Lose 20–30 lbs" },
  { value: "lose-30-50", label: "Lose 30–50 lbs" },
  { value: "lose-50-plus", label: "Lose 50+ lbs" },
  { value: "manage-pcos", label: "Manage PCOS" },
  { value: "heart-health", label: "Heart health" },
  { value: "prediabetes", label: "Prediabetes" },
];

type FormState = "idle" | "submitting" | "success" | "error";

export function FreeGuideForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [weightRange, setWeightRange] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !firstName) return;

    setFormState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: firstName,
          source: "free_guide_download",
          metadata: {
            weightRange: weightRange || undefined,
            primaryGoal: primaryGoal || undefined,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Something went wrong");
      }

      setFormState("success");
    } catch (err: unknown) {
      setFormState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (formState === "success") {
    return (
      <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
          <CheckCircle className="h-7 w-7 text-teal" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-navy">Your guide is on its way!</h3>
        <p className="mt-2 text-sm leading-relaxed text-graphite-500">
          Check your inbox in the next few minutes. While you wait — see if you qualify
          for treatment.
        </p>
        <Link href="/qualify" className="mt-6 inline-block">
          <Button size="lg" className="gap-2">
            See If I Qualify
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-navy-100/60 bg-white p-8 shadow-premium"
    >
      <h2 className="text-lg font-bold text-navy">Get your free guide</h2>
      <p className="mt-1 text-sm text-graphite-500">
        Instant access — no spam, ever. Unsubscribe anytime.
      </p>

      <div className="mt-6 space-y-4">
        {/* First name */}
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-navy">
            First name <span className="text-red-500">*</span>
          </label>
          <Input
            id="firstName"
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
            Email address <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        {/* Weight range */}
        <div>
          <label htmlFor="weightRange" className="mb-1.5 block text-sm font-medium text-navy">
            Current weight
            <span className="ml-1 text-xs font-normal text-graphite-400">(optional)</span>
          </label>
          <select
            id="weightRange"
            value={weightRange}
            onChange={(e) => setWeightRange(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy shadow-sm transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          >
            {weightRanges.map((r) => (
              <option key={r.value} value={r.value} disabled={r.value === "" && false}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Primary goal */}
        <div>
          <label htmlFor="primaryGoal" className="mb-1.5 block text-sm font-medium text-navy">
            Primary goal
            <span className="ml-1 text-xs font-normal text-graphite-400">(optional)</span>
          </label>
          <select
            id="primaryGoal"
            value={primaryGoal}
            onChange={(e) => setPrimaryGoal(e.target.value)}
            className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-sm text-navy shadow-sm transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          >
            {primaryGoals.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error message */}
      {formState === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full gap-2"
        disabled={formState === "submitting" || !email || !firstName}
      >
        {formState === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending guide…
          </>
        ) : (
          <>
            Send Me the Free Guide
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="mt-3 text-center text-xs text-graphite-400">
        By submitting, you agree to our{" "}
        <a href="/legal/privacy" className="underline hover:text-navy">
          Privacy Policy
        </a>
        . No spam — we promise.
      </p>
    </form>
  );
}
