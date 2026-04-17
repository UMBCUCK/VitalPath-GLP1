"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Gift, ArrowRight, Check, Clock, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

// Tier 5.6 — Page-aware exit-intent variants.
// Each variant is keyed off the URL pathname so the pitch matches the
// user's intent at the moment they tried to leave. Falls back to the
// generic $50-off + guide when no variant matches.
interface ExitVariant {
  badge: string;
  heading: string;
  subheading: React.ReactNode;
  bullets: string[];
  cta: string;
  skipLabel: string;
  priceAnchor?: React.ReactNode;
}

const GENERIC_VARIANT: ExitVariant = {
  badge: "GLP-1 medication from",
  heading: "Wait — don't leave empty-handed",
  subheading: (
    <>
      Get our free <span className="font-semibold text-navy">GLP-1 Starter Guide</span>{" "}
      + a <span className="font-semibold text-teal">$50 discount code</span> for your first month.
    </>
  ),
  bullets: [
    "How GLP-1 medications work (plain English)",
    "Week-by-week timeline of what to expect",
    "Foods that maximize results on GLP-1",
    "Side effect management tips from providers",
  ],
  cta: "Get My Free Guide + $50 Code",
  skipLabel: "Skip the guide — take the free assessment →",
};

function getVariantForPath(path: string | null): ExitVariant {
  if (!path) return GENERIC_VARIANT;
  if (path.startsWith("/calculators")) {
    return {
      badge: "Personalized plan — free",
      heading: "Before you go — email your results",
      subheading: (
        <>
          We&apos;ll send your calculator result plus a <span className="font-semibold text-navy">personalized GLP-1 plan</span>{" "}
          with recommended medication and pricing.
        </>
      ),
      bullets: [
        "Your personalized weight-loss projection",
        "Recommended GLP-1 medication + dose schedule",
        "6-month timeline with monthly milestones",
        "Full pricing breakdown with included extras",
      ],
      cta: "Email My Plan",
      skipLabel: "No thanks — take the 2-min assessment →",
    };
  }
  if (path.startsWith("/pricing") || path.startsWith("/checkout")) {
    return {
      badge: "Price-match offer",
      heading: "Before you go — unlock $50 off your first month",
      subheading: (
        <>
          Enter your email to save your cart and get an exclusive{" "}
          <span className="font-semibold text-teal">$50 off</span> code that expires in 24h.
        </>
      ),
      bullets: [
        "$50 off your first month",
        "Free 2-day shipping (always)",
        "30-day money-back guarantee",
        "Cancel anytime — no contracts",
      ],
      cta: "Unlock My $50-Off Code",
      skipLabel: "Just take me to pricing →",
    };
  }
  if (path.startsWith("/qualify")) {
    return {
      badge: "Save your progress",
      heading: "Don't lose your answers",
      subheading: (
        <>
          We&apos;ll <span className="font-semibold text-navy">email you a link</span> to resume exactly
          where you left off — no re-typing. Plus a <span className="font-semibold text-teal">$50 welcome credit</span>.
        </>
      ),
      bullets: [
        "Pick up where you left off — 1 click",
        "Link is unique to you and valid 14 days",
        "Welcome credit auto-applies at checkout",
        "A provider reviews within 1 business day",
      ],
      cta: "Save & Email Me My Link",
      skipLabel: "Just continue the assessment →",
    };
  }
  if (path.startsWith("/peptides")) {
    return {
      badge: "Peptide therapy guide — free",
      heading: "Before you go — get the peptide guide",
      subheading: (
        <>
          Download a plain-English guide to peptides:{" "}
          <span className="font-semibold text-navy">NAD+, Sermorelin, BPC-157, Ipamorelin</span>, and
          more. Dosing, cycling, and what to expect.
        </>
      ),
      bullets: [
        "Overview of the 6 most-used peptides",
        "Typical dosing protocols + stacking",
        "Who qualifies + contraindications",
        "Pricing, pharmacy, and how it ships",
      ],
      cta: "Send Me the Peptide Guide",
      skipLabel: "No thanks — browse peptides →",
    };
  }
  return GENERIC_VARIANT;
}

export function ExitIntentModal() {
  const pathname = usePathname();
  const variant = getVariantForPath(pathname);

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsConsent, setSmsConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const hasTriggered = useRef(false);

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  useEffect(() => {
    // Don't show if already dismissed this session
    if (typeof window !== "undefined" && sessionStorage.getItem("exit-dismissed")) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse moves to top of page (exit intent)
      if (e.clientY <= 5 && !hasTriggered.current) {
        hasTriggered.current = true;
        // Delay slightly so it doesn't feel jarring
        setTimeout(() => {
          setShow(true);
          track(ANALYTICS_EVENTS.LEAD_CAPTURE, { type: "exit_intent_view" });
        }, 300);
      }
    };

    // Mobile exit intent: trigger when user switches tabs/apps (visibility change)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !hasTriggered.current) {
        hasTriggered.current = true;
        setTimeout(() => setShow(true), 300);
      }
    };

    // Only add after 10 seconds on page (don't annoy immediate bouncers)
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
      // Mobile: trigger on tab switch after 30 seconds
      setTimeout(() => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
      }, 20000); // 30s total (10s + 20s) before mobile exit intent arms
    }, 10000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    track(ANALYTICS_EVENTS.LEAD_CAPTURE, { type: "exit_intent_dismiss" });
    if (typeof window !== "undefined") {
      sessionStorage.setItem("exit-dismissed", "true");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Only send phone if user provided one AND consented to SMS
    const phoneDigits = phone.replace(/\D/g, "");
    const validPhone = phoneDigits.length === 10 && smsConsent ? phoneDigits : undefined;

    track(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE, {
      source: "exit_intent",
      email_provided: true,
      phone_provided: !!validPhone,
    });

    // Save lead to database
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: validPhone,
          source: "exit_intent",
          tags: ["glp1-guide"],
        }),
      });
    } catch {
      // Non-blocking — still show success even if API fails
    }

    setSubmitted(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("exit-dismissed", "true");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm animate-fade-in"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-premium-xl animate-fade-in-up sm:p-10">
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-lg p-2 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            {/* Price anchor banner — Tier 5.6 variant-driven label */}
            <div className="mb-4 -mx-8 -mt-8 sm:-mx-10 sm:-mt-10 rounded-t-3xl bg-gradient-to-r from-navy to-atlantic px-6 py-4 text-center text-white">
              <p className="text-xs opacity-80">{variant.badge}</p>
              <p className="text-xl font-bold">
                $179/mo <span className="text-sm font-normal line-through opacity-50">$1,349</span>
              </p>
              <p className="text-xs font-semibold text-gold">Save 79% vs. brand-name retail</p>
            </div>

            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50">
              <Gift className="h-7 w-7 text-gold" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-navy">{variant.heading}</h2>
            <p className="mt-2 text-base text-graphite-500">{variant.subheading}</p>

            {/* What's inside — variant-driven bullets */}
            <div className="mt-5 space-y-2">
              {variant.bullets.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-graphite-600">
                  <Check className="h-4 w-4 shrink-0 text-teal" />
                  {item}
                </div>
              ))}
            </div>

            {/* Email + phone form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-navy-100 bg-white px-4 py-3 text-base text-navy placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all min-h-[48px]"
              />
              <input
                type="tel"
                placeholder="Phone (optional — for texts only)"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                autoComplete="tel"
                className="w-full rounded-xl border border-navy-100 bg-white px-4 py-3 text-base text-navy placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all min-h-[48px]"
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
                    Yes, text me my GLP-1 guide and occasional program updates. Reply STOP to opt out. Msg &amp; data rates may apply.
                  </span>
                </label>
              )}
              <Button variant="emerald" type="submit" className="w-full gap-1.5 min-h-[48px] rounded-full">
                {variant.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* Trust signals */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[10px] text-graphite-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" /> 30-day guarantee
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-gold" /> 4.9/5 from 2,400+ reviews
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-teal" /> 2-min assessment
              </span>
            </div>

            {/* Skip link — variant-driven label */}
            <div className="mt-4 text-center">
              <Link
                href="/qualify"
                className="text-sm font-semibold text-teal hover:underline"
                onClick={handleDismiss}
              >
                {variant.skipLabel}
              </Link>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
              <Check className="h-8 w-8 text-teal" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-navy">
              Check your inbox!
            </h2>
            <p className="mt-2 text-base text-graphite-500">
              Your GLP-1 Starter Guide is on its way. While you wait...
            </p>
            <Link href="/qualify" className="mt-6 inline-block" onClick={handleDismiss}>
              <Button variant="emerald" size="lg" className="gap-2 rounded-full">
                Take the Free Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
