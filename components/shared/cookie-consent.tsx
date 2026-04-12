"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "nj_cookie_consent";

type ConsentState = "accepted" | "declined" | null;

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY) as ConsentState | null;
    if (!stored) {
      // Slight delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
    setConsent(stored);
  }, []);

  function handleAccept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setConsent("accepted");
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setConsent("declined");
    setVisible(false);
    // Signal to analytics to suppress tracking
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("nj:cookie-declined"));
    }
  }

  if (!visible || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and tracking preferences"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-navy-100/60 bg-white/95 backdrop-blur-sm shadow-premium-lg px-4 py-4 sm:py-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex-1 text-sm text-graphite-600 leading-relaxed">
          <span className="font-semibold text-navy">We use cookies and analytics</span> to improve your experience and for marketing purposes (Google Analytics, Meta). California, Colorado, and other state residents have the right to opt out of tracking.{" "}
          <Link href="/legal/privacy" className="text-teal underline hover:text-teal/80 text-xs">
            Privacy Policy
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={handleDecline}
            className="text-xs text-graphite-400 hover:text-graphite-600 underline transition-colors"
          >
            Opt out
          </button>
          <Button size="sm" onClick={handleAccept} className="px-6">
            Accept
          </Button>
          <button
            onClick={handleDecline}
            className="rounded-lg p-1 text-graphite-300 hover:bg-navy-50 hover:text-graphite-500 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Call this anywhere to read current consent synchronously */
export function getCookieConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COOKIE_KEY) as ConsentState | null;
}
