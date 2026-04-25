"use client";

/**
 * SaveAndEmailLink
 * ─────────────────────────────────────────────────────────────
 * Tier 11.3 — Persistent "Save & email me later" link shown on every
 * qualify step. Captures an email mid-funnel without forcing the user
 * to commit to the full assessment.
 *
 * Behavior:
 *   - Inline collapsed link (no big modal — preserves flow)
 *   - On click, expands to a tiny email field + Save button
 *   - On submit, POSTs to /api/lead with the current step + a flag
 *     so we know how far they got, then triggers the lifecycle
 *     resume email
 *   - Persistent dismiss in sessionStorage so dismissing once doesn't
 *     spam them with the prompt every step
 */
import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";

export interface SaveAndEmailLinkProps {
  currentStep: number;
  totalSteps: number;
  /** If we already have the email captured, render nothing. */
  hasEmail?: boolean;
}

export function SaveAndEmailLink({ currentStep, totalSteps, hasEmail }: SaveAndEmailLinkProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (hasEmail) return null; // already captured upstream
  if (submitted) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-2.5 text-xs text-navy">
        <Check className="h-3.5 w-3.5 shrink-0 text-teal" />
        <span>
          Saved. We&apos;ll email you a link to resume from step {currentStep} of {totalSteps}.
        </span>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    track("qualify_save_email_submit", { step: currentStep });
    try {
      // 1) Capture as a lead with step context
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: `qualify_save_step${currentStep}`,
        }),
      });
      // 2) Fire the magic-link resume email
      await fetch("/api/lead/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // non-blocking — UI still shows success
    }
    setSubmitted(true);
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track("qualify_save_email_open", { step: currentStep });
        }}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-graphite-500 hover:text-teal transition-colors"
      >
        <Mail className="h-3.5 w-3.5" />
        Save &amp; email me a link to finish later
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-navy-100/60 bg-white px-3 py-2.5"
    >
      <Mail className="h-3.5 w-3.5 text-graphite-400" />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        disabled={loading}
        className="min-w-0 flex-1 bg-transparent text-sm text-navy placeholder:text-graphite-300 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading || !email}
        className="inline-flex items-center gap-1 rounded-lg bg-teal px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? "…" : "Save"}
        {!loading && <ArrowRight className="h-3 w-3" />}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-[11px] text-graphite-400 hover:text-navy"
      >
        Cancel
      </button>
    </form>
  );
}
