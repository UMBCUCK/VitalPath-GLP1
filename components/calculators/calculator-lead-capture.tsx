"use client";

/**
 * CalculatorLeadCapture
 * ─────────────────────────────────────────────────────────────
 * Reusable email + phone capture card shown under calculator
 * results (BMI, TDEE, protein, hydration). Converts SEO traffic
 * that otherwise bounces into the qualified-lead database.
 *
 * POSTs to /api/lead which:
 *  - Rate-limits (10/min/IP)
 *  - Upserts by email (dedupes)
 *  - Fires Meta CAPI server-side event for advanced matching
 */
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface CalculatorLeadCaptureProps {
  /** Source tag — e.g. "calculator_bmi", "calculator_tdee". Written to Lead.source. */
  source: string;
  /**
   * Short personalization headline shown above the form — e.g.
   * "Based on your BMI of 32, you may qualify for GLP-1 treatment."
   */
  headline: string;
  /**
   * Optional sub-copy explaining what they'll get.
   * Defaults to a generic GLP-1 plan email pitch.
   */
  subCopy?: string;
  /** Extra analytics metadata — e.g. { bmi: 32, category: "Obese I" } */
  metadata?: Record<string, string | number | boolean | undefined>;
  /** Optional className for the wrapper. */
  className?: string;
  /** Where the fallback "skip" link points. Default: /qualify. */
  skipHref?: string;
}

export function CalculatorLeadCapture({
  source,
  headline,
  subCopy = "We'll email a free personalized plan with your recommended medication, projected timeline, and pricing. No spam, unsubscribe anytime.",
  metadata,
  className,
  skipHref = "/qualify",
}: CalculatorLeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;
    setError("");
    setLoading(true);

    const phoneDigits = phone.replace(/\D/g, "");
    const validPhone = phoneDigits.length === 10 && smsConsent ? phoneDigits : undefined;

    track(ANALYTICS_EVENTS.LEAD_CAPTURE, {
      source,
      email_provided: true,
      phone_provided: !!validPhone,
      ...metadata,
    });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone: validPhone, source }),
      });
      if (!res.ok && res.status !== 429) {
        // Silently swallow — don't block user. Lead may still have been captured
        // by rate-limit retry on the server; UI shows success either way.
      }
      setSubmitted(true);
    } catch {
      // Network error — still show success state; email can be re-submitted later
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div
        className={cn(
          "mt-6 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 text-center shadow-premium",
          className,
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal">
          <Check className="h-6 w-6 text-white" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-navy">Your plan is on its way</h3>
        <p className="mt-1 text-sm text-graphite-500">
          Check your inbox in the next few minutes. While you wait, see if you qualify for
          treatment in just 2 minutes.
        </p>
        <Link href={skipHref} className="mt-4 inline-block">
          <Button variant="emerald" size="lg" className="gap-2 rounded-full">
            Take the Free Assessment
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-6 overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-premium",
        className,
      )}
    >
      {/* Gradient header band */}
      <div className="bg-gradient-to-r from-teal/90 to-atlantic px-6 py-3 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wide">
            Personalized plan — free
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <h3 className="text-lg font-bold text-navy sm:text-xl">{headline}</h3>
        <p className="mt-1.5 text-sm text-graphite-500">{subCopy}</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
            <input
              type="email"
              placeholder="Enter your email"
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
            placeholder="Phone (optional — for a faster reply)"
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
                Yes, text me my personalized plan and occasional program updates.
                Reply STOP to opt out. Msg &amp; data rates may apply.
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
            {loading ? "Sending..." : "Email Me My Free Plan"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        {/* Trust row */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-graphite-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" /> HIPAA-compliant
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-emerald-500" /> No spam, unsubscribe anytime
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-emerald-500" /> 4.9/5 from 2,400+ members
          </span>
        </div>

        {/* Skip link */}
        <div className="mt-4 text-center">
          <Link
            href={skipHref}
            className="text-sm font-semibold text-teal hover:underline"
          >
            Or skip — start the free assessment now &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
