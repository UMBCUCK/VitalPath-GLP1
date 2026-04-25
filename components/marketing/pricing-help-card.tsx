"use client";

/**
 * PricingHelpCard
 * ─────────────────────────────────────────────────────────────
 * Tier 6.5 — Shown near the bottom of /pricing. Many visitors linger on
 * the pricing page but don't click through because they're stuck
 * deciding between plans. This card captures:
 *
 *   - Phone leads via TextMeLink ("text me a pricing consult")
 *   - Email leads via CalculatorLeadCapture repurposed as "email me a
 *     plan recommendation" — POSTs to /api/lead with source=pricing_help
 *
 * Both channels flow into the same Lead table with attributed source,
 * so Sales can follow up with warm leads who were price-sensitive.
 */
import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Mail, MessageCircle, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export function PricingHelpCard() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email && phone.replace(/\D/g, "").length !== 10) return;
    if (loading) return;
    setLoading(true);

    const phoneDigits = phone.replace(/\D/g, "");
    const validPhone = phoneDigits.length === 10 && smsConsent ? phoneDigits : undefined;

    track(ANALYTICS_EVENTS.LEAD_CAPTURE, {
      source: "pricing_help_card",
      email_provided: !!email,
      phone_provided: !!validPhone,
    });

    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || (validPhone ? `pricing-${validPhone}@sms.placeholder.local` : ""),
          phone: validPhone,
          source: "pricing_help_card",
        }),
      });
    } catch {
      // non-blocking
    }
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <section className="py-12 bg-gradient-to-br from-teal-50/40 to-white">
        <SectionShell className="max-w-2xl">
          <div className="rounded-3xl border border-teal-200 bg-white p-8 text-center shadow-premium">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal">
              <Check className="h-6 w-6 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-navy">
              Plan recommendation incoming
            </h3>
            <p className="mt-2 text-sm text-graphite-500">
              Check your {email ? "inbox" : "phone"} in the next few minutes. Want to move faster?
              Take the free assessment now.
            </p>
            <Link href="/qualify" className="mt-6 inline-block">
              <Button variant="emerald" size="lg" className="gap-2 rounded-full">
                Start Free Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-teal-50/40 to-white">
      <SectionShell className="max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-navy-100/60 bg-white shadow-premium">
          <div className="bg-gradient-to-r from-teal to-atlantic px-6 py-4 text-white">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              <p className="text-sm font-bold">Not sure which plan is right for you?</p>
            </div>
          </div>

          <div className="grid gap-0 sm:grid-cols-2">
            {/* Left: explainer */}
            <div className="p-6 sm:p-7 border-b sm:border-b-0 sm:border-r border-navy-100/40">
              <h3 className="text-lg font-bold text-navy">
                Get a personal plan recommendation
              </h3>
              <p className="mt-2 text-sm text-graphite-500">
                Based on your BMI, goals, and preferences, we&apos;ll match you to the plan that
                fits — and text or email it to you. Takes less than a minute.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "No payment info required",
                  "Reviewed by a real human — not a bot",
                  "Unsubscribe anytime",
                  "30-day money-back guarantee on any plan",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-graphite-500">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-3 bg-cloud/40">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-xl border border-navy-100 bg-white pl-10 pr-4 py-3 text-base text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all min-h-[48px]"
                />
              </div>
              <div className="relative">
                <MessageCircle className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400" />
                <input
                  type="tel"
                  placeholder="Phone (faster — text me)"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  autoComplete="tel"
                  disabled={loading}
                  className="w-full rounded-xl border border-navy-100 bg-white pl-10 pr-4 py-3 text-base text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all min-h-[48px]"
                />
              </div>
              {phone && (
                <label className="flex items-start gap-2 text-[11px] leading-relaxed text-graphite-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={smsConsent}
                    onChange={(e) => setSmsConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-navy-200 text-teal focus:ring-teal"
                  />
                  <span>
                    Yes, text me my plan recommendation. Reply STOP to opt out. Msg &amp; data rates may apply.
                  </span>
                </label>
              )}
              <Button
                type="submit"
                variant="emerald"
                size="lg"
                className="w-full gap-2 rounded-full"
                disabled={loading || (!email && phone.replace(/\D/g, "").length !== 10)}
              >
                {loading ? "Sending..." : "Send My Plan Recommendation"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-graphite-400">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>HIPAA-compliant · No spam</span>
              </div>
            </form>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
