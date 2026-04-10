"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { X, Gift, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function ExitIntentModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const hasTriggered = useRef(false);

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

    track(ANALYTICS_EVENTS.EMAIL_SUBSCRIBE, { source: "exit_intent", email_provided: true });
    // In production, this would call /api/lead
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
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50">
              <Gift className="h-7 w-7 text-gold" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-navy">
              Wait — before you go
            </h2>
            <p className="mt-2 text-base text-graphite-500">
              Get our free <span className="font-semibold text-navy">GLP-1 Starter Guide</span>{" "}
              — everything you need to know about GLP-1 medications, what to expect, and how to
              maximize results. No spam, just science.
            </p>

            {/* What's inside */}
            <div className="mt-5 space-y-2">
              {[
                "How GLP-1 medications work (plain English)",
                "Week-by-week timeline of what to expect",
                "Foods that maximize results on GLP-1",
                "Side effect management tips from providers",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-graphite-600">
                  <Check className="h-4 w-4 shrink-0 text-teal" />
                  {item}
                </div>
              ))}
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="mt-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm text-navy placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
                <Button type="submit" className="shrink-0 gap-1.5">
                  Get Free Guide
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <p className="mt-3 text-center text-[10px] text-graphite-300">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>

            {/* Skip link */}
            <div className="mt-4 text-center">
              <Link
                href="/qualify"
                className="text-sm font-semibold text-teal hover:underline"
                onClick={handleDismiss}
              >
                Or skip straight to the assessment &rarr;
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
              <Button size="lg" className="gap-2">
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
