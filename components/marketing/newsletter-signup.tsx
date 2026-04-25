"use client";

/**
 * NewsletterSignup
 * ─────────────────────────────────────────────────────────────
 * Tier 11.5 — Lightweight email-only newsletter form. Three variants:
 *
 *   - "inline"  : 1-line horizontal form for footer / sidebar
 *   - "card"    : full card with icon + headline + bullets, for blog
 *   - "minimal" : small text-link → reveals input on click
 *
 * POSTs to /api/lead with source=newsletter_<variant>_<placement>.
 * That feeds into the same lifecycle/email pipeline as every other
 * lead source, including Meta CAPI advanced matching.
 */
import { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";

export interface NewsletterSignupProps {
  variant?: "inline" | "card" | "minimal";
  placement: string; // e.g. "footer", "blog", "blog_post_end"
  headline?: string;
  subCopy?: string;
}

export function NewsletterSignup({
  variant = "inline",
  placement,
  headline,
  subCopy,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openMinimal, setOpenMinimal] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);
    track("newsletter_signup_submit", { placement, variant });
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: `newsletter_${placement}`,
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
      <div className="flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-2.5 text-sm text-navy">
        <Check className="h-4 w-4 shrink-0 text-teal" />
        <span>Thanks — you&apos;re on the list. Check your inbox to confirm.</span>
      </div>
    );
  }

  if (variant === "minimal") {
    if (!openMinimal) {
      return (
        <button
          type="button"
          onClick={() => {
            setOpenMinimal(true);
            track("newsletter_signup_open", { placement, variant });
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-teal hover:underline"
        >
          <Mail className="h-3 w-3" />
          {headline ?? "Subscribe to weekly tips"}
        </button>
      );
    }
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={loading}
          className="flex-1 rounded-lg border border-navy-100 bg-white px-3 py-1.5 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="rounded-lg bg-teal px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "…" : "Subscribe"}
        </button>
      </form>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-navy-100/60 bg-gradient-to-br from-teal-50/40 to-white p-6">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-teal" />
          <p className="text-xs font-bold uppercase tracking-wider text-teal">
            Free weekly tips
          </p>
        </div>
        <h3 className="text-lg font-bold text-navy">
          {headline ?? "Better GLP-1 results, every Tuesday"}
        </h3>
        <p className="mt-2 text-sm text-graphite-500">
          {subCopy ??
            "Plain-English tips on protein, hydration, side effects, and dose progression — written for real life on GLP-1. 1 email, no spam, unsubscribe anytime."}
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            className="flex-1 rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="inline-flex items-center gap-1 rounded-lg bg-teal px-4 py-2 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? "…" : "Subscribe"}
            {!loading && <ArrowRight className="h-3 w-3" />}
          </button>
        </form>
        <p className="mt-2 text-[10px] text-graphite-400">
          By subscribing you agree to receive our weekly newsletter and program updates.
        </p>
      </div>
    );
  }

  // inline variant
  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        disabled={loading}
        className="min-w-0 flex-1 rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
      />
      <button
        type="submit"
        disabled={loading || !email}
        className="inline-flex items-center gap-1 rounded-lg bg-teal px-4 py-2 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? "…" : "Subscribe"}
      </button>
    </form>
  );
}
