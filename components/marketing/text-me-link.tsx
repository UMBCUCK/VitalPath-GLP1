"use client";

/**
 * TextMeLink
 * ─────────────────────────────────────────────────────────────
 * Small one-field phone capture that sends a "continue on mobile"
 * SMS link. Designed for the qualify flow on desktop — medical
 * intakes complete ~40% more often on mobile.
 *
 * Posts to /api/lead (source: "qualify_text_link") and then triggers
 * a magic-link resume email/SMS via /api/lead/resume. We reuse the
 * existing /api/lead/resume endpoint (keyed by email) and fall back
 * to phone-only lead capture if the user doesn't provide email.
 */
import { useState } from "react";
import { Smartphone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export interface TextMeLinkProps {
  /** Email from form state (if captured earlier, like via bridge). */
  email?: string;
  className?: string;
}

export function TextMeLink({ email, className }: TextMeLinkProps) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
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
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10 || !consent || loading) return;
    setLoading(true);
    track(ANALYTICS_EVENTS.QUALIFY_TEXT_LINK_SEND, { has_email: !!email });
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || `${phoneDigits}@sms.placeholder.local`, // synthetic if no email — Lead dedupes by email
          phone: phoneDigits,
          source: "qualify_text_link",
        }),
      });
      // Fire recovery email (which, for those we have email for, also triggers)
      if (email) {
        await fetch("/api/lead/resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      }
    } catch {
      // Non-blocking
    }
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div
        className={`mt-4 flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-sm text-navy ${className || ""}`}
      >
        <Check className="h-4 w-4 shrink-0 text-teal" />
        <span>Link sent — check your phone. We&apos;ll pick up where you left off.</span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-teal hover:underline ${className || ""}`}
      >
        <Smartphone className="h-3.5 w-3.5" />
        On desktop? Text me a link to finish on my phone
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-4 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm ${className || ""}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-teal" />
        <span className="text-xs font-semibold text-navy">Continue on your phone</span>
      </div>
      <div className="flex gap-2">
        <input
          type="tel"
          placeholder="Your mobile number"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          required
          autoComplete="tel"
          disabled={loading}
          className="flex-1 rounded-lg border border-navy-100 bg-white px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 min-h-[40px]"
        />
        <Button
          type="submit"
          variant="emerald"
          size="sm"
          disabled={loading || phone.replace(/\D/g, "").length !== 10 || !consent}
          className="shrink-0 rounded-lg"
        >
          {loading ? "…" : "Text me"}
        </Button>
      </div>
      <label className="mt-2 flex items-start gap-1.5 text-[10px] leading-relaxed text-graphite-400 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-3 w-3 rounded border-navy-200 text-teal"
        />
        <span>
          I consent to receive a one-time SMS with a link to resume my assessment.
          Reply STOP to opt out.
        </span>
      </label>
    </form>
  );
}
