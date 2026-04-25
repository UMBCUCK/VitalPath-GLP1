"use client";

/**
 * RequestPhoneCard
 * ─────────────────────────────────────────────────────────────
 * Tier 6.8 — Shown on /success when the new member has no phone
 * number on file. Phone massively improves provider response time
 * (text for follow-up), reduces no-shows, and unlocks SMS lifecycle
 * + shipping updates.
 *
 * Behavior:
 *   1. GET /api/user/profile on mount to check current phone
 *   2. If phone is already present → render nothing (no-op)
 *   3. Otherwise show a dismissible card. On submit, POST to
 *      /api/user/profile AND /api/lead so Meta CAPI advanced
 *      matching picks up the phone on any retargeting events
 *      fired after the /success redirect.
 */
import { useEffect, useState } from "react";
import { Smartphone, Check, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export function RequestPhoneCard() {
  const [ready, setReady] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);
  const [email, setEmail] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: "no-store" });
        if (!res.ok) {
          setReady(true);
          return;
        }
        const data = (await res.json()) as { phone?: string; email?: string };
        if (cancelled) return;
        if (!data.phone || data.phone.replace(/\D/g, "").length < 10) {
          setShouldShow(true);
        }
        setEmail(data.email);
      } catch {
        // Unauthenticated or network error — show nothing
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (shouldShow && !dismissed) track("request_phone_view", { location: "success_page" });
  }, [shouldShow, dismissed]);

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10 || !consent || loading) return;
    setLoading(true);

    track("request_phone_submit", { location: "success_page" });

    // 1) Update user profile with the real phone
    try {
      await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits }),
      });
    } catch {
      // non-blocking
    }

    // 2) Also fire the Lead API so Meta CAPI advanced matching warms up
    if (email) {
      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            phone: digits,
            source: "success_page_phone_capture",
          }),
        });
      } catch {
        // non-blocking
      }
    }

    // 3) Client-side analytics event
    track(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE, {
      source: "success_phone_capture",
      phone_provided: true,
    });

    setSubmitted(true);
    setLoading(false);
  }

  if (!ready || !shouldShow || dismissed) return null;

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-premium">
      <div className="bg-gradient-to-r from-teal to-atlantic px-6 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <p className="text-sm font-bold">Add your phone for faster care</p>
          </div>
          <button
            onClick={() => {
              setDismissed(true);
              track("request_phone_dismiss", { location: "success_page" });
            }}
            className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {submitted ? (
        <div className="p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal">
            <Check className="h-5 w-5 text-white" />
          </div>
          <p className="mt-3 text-sm font-bold text-navy">Phone saved</p>
          <p className="mt-1 text-xs text-graphite-500">
            We&apos;ll text you when your medication ships and when your provider replies.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 text-left">
          <p className="text-sm text-graphite-600 leading-relaxed">
            Provider replies go to SMS first — typical response in under 30 minutes. You&apos;ll
            also get shipping + refill alerts so you never miss a dose.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              type="tel"
              placeholder="Your mobile number"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              required
              autoComplete="tel"
              disabled={loading}
              className="flex-1 rounded-xl border border-navy-100 bg-white px-4 py-2.5 text-base text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 min-h-[44px]"
            />
            <Button
              type="submit"
              variant="emerald"
              disabled={loading || phone.replace(/\D/g, "").length !== 10 || !consent}
              className="shrink-0 rounded-full"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
          <label className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-graphite-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-navy-200 text-teal focus:ring-teal"
            />
            <span>
              Consent to receive SMS from my care team for health-related updates, shipping,
              and refills. Reply STOP to opt out. Msg &amp; data rates may apply.
            </span>
          </label>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-graphite-400">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>HIPAA-compliant · Only your care team sees this number</span>
          </div>
        </form>
      )}
    </div>
  );
}
