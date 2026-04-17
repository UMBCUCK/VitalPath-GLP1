"use client";

/**
 * QualifyLeadBridge
 * ─────────────────────────────────────────────────────────────
 * Soft email + phone capture modal shown once during the /qualify
 * flow (between step 2 and step 3). Its purpose is to capture a
 * lead BEFORE the user commits to the heavier medical/contra
 * questions, so we can recover drop-offs via lifecycle email.
 *
 * Behavior:
 *  - Shown exactly once per session (sessionStorage flag)
 *  - Dismissible ("Continue without saving") — soft gate, not hard
 *  - On submit, POSTs to /api/lead (already dedupes + fires Meta CAPI)
 *  - Bubbles email/phone back up so the parent can pre-fill Step 7
 *  - Fires dedicated analytics events
 *
 * This component is intentionally flexible: the caller controls
 * whether it's visible via the `show` prop and handles the submit
 * (to keep lifecycle decisions in the main qualify reducer).
 */
import { useEffect, useState } from "react";
import { X, Sparkles, ShieldCheck, Mail, Clock, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export interface QualifyLeadBridgeProps {
  show: boolean;
  onSubmitted: (data: { email: string; phone?: string; smsConsent: boolean }) => void;
  onSkip: () => void;
  /** Optional: personalized copy driven by their BMI + goal. */
  headline?: string;
  subCopy?: string;
}

export function QualifyLeadBridge({
  show,
  onSubmitted,
  onSkip,
  headline = "Saving your progress…",
  subCopy = "We'll email your personalized weight-loss projection and your recommended medication so you don't lose your place.",
}: QualifyLeadBridgeProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [calcStep, setCalcStep] = useState(0);

  // Micro-animation — reinforces the "we're personalizing your plan" framing
  useEffect(() => {
    if (!show) return;
    const timers = [
      setTimeout(() => setCalcStep(1), 400),
      setTimeout(() => setCalcStep(2), 900),
      setTimeout(() => setCalcStep(3), 1400),
    ];
    track(ANALYTICS_EVENTS.QUALIFY_LEAD_BRIDGE_SHOW);
    return () => timers.forEach(clearTimeout);
  }, [show]);

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    const phoneDigits = phone.replace(/\D/g, "");
    const validPhone = phoneDigits.length === 10 ? phoneDigits : undefined;

    track(ANALYTICS_EVENTS.QUALIFY_LEAD_BRIDGE_SUBMIT, {
      email_provided: true,
      phone_provided: !!validPhone,
      sms_consent: smsConsent,
    });

    // Fire-and-forget POST — don't block the funnel if the network is slow
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: validPhone && smsConsent ? validPhone : undefined,
          source: "qualify_bridge_step2",
        }),
      });
    } catch {
      // Non-blocking
    }

    onSubmitted({ email, phone: validPhone, smsConsent });
    setLoading(false);
  }

  function handleSkip() {
    track(ANALYTICS_EVENTS.QUALIFY_LEAD_BRIDGE_SKIP);
    onSkip();
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm animate-fade-in" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-premium-xl animate-fade-in-up">
        {/* Close / dismiss */}
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
          aria-label="Skip this step"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Gradient header with "calculating" animation */}
        <div className="bg-gradient-to-br from-teal via-atlantic to-navy px-6 py-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider opacity-90">
            Step 2 of 8 — your plan is almost ready
          </p>
          <div className="mt-3 space-y-1.5 text-left">
            {[
              "Analyzing your BMI & goals",
              "Matching you with a provider",
              "Building your projection",
            ].map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                  calcStep > i ? "opacity-100" : "opacity-40"
                }`}
              >
                {calcStep > i ? (
                  <Check className="h-4 w-4 text-gold" />
                ) : (
                  <Clock className="h-4 w-4 animate-pulse" />
                )}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <h2 className="text-xl font-bold text-navy text-center">{headline}</h2>
          <p className="mt-2 text-sm text-center text-graphite-500">{subCopy}</p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-xl border border-navy-100 bg-white pl-10 pr-4 py-3 text-base text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all min-h-[48px]"
              />
            </div>
            <input
              type="tel"
              placeholder="Phone (optional — faster provider response)"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              autoComplete="tel"
              disabled={loading}
              className="w-full rounded-xl border border-navy-100 bg-white px-4 py-3 text-base text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all min-h-[48px]"
            />
            {phone && (
              <label className="flex items-start gap-2 text-[11px] leading-relaxed text-graphite-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={smsConsent}
                  onChange={(e) => setSmsConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-navy-200 text-teal focus:ring-teal"
                />
                <span>
                  Yes, text me updates about my assessment. Reply STOP to opt out.
                  Msg &amp; data rates may apply.
                </span>
              </label>
            )}
            <Button
              type="submit"
              variant="emerald"
              size="lg"
              className="w-full gap-2 rounded-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          {/* Soft skip */}
          <button
            type="button"
            onClick={handleSkip}
            className="mt-3 w-full text-center text-sm text-graphite-400 hover:text-navy transition-colors"
          >
            Continue without saving
          </button>

          {/* Trust row */}
          <div className="mt-4 flex items-center justify-center gap-3 text-[10px] text-graphite-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> HIPAA-compliant
            </span>
            <span>·</span>
            <span>No spam — just your plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
