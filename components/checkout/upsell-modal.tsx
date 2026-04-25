"use client";

import { useState, useEffect } from "react";
import { X, Check, Sparkles, ChefHat, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * UpsellOffer
 * ──────────────────────────────────────────────────────────────
 * The shape every upsell needs. Compatible with the
 * `UpsellSuggestion` produced by lib/upsell-engine.ts — you can
 * pass either an engine suggestion or a hand-authored offer.
 */
export interface UpsellOffer {
  id?: string;
  productSlug: string;
  productName: string;
  headline: string;
  description: string;
  features?: string[];
  priceCents?: number;
  priceSuffix?: string;
  discountPct?: number;
  badge?: string;
  ctaLabel?: string;
  iconEmoji?: string;
}

interface UpsellModalProps {
  show: boolean;
  onClose: () => void;
  /**
   * Optional — pass any UpsellOffer (e.g. from lib/upsell-engine.ts).
   * If omitted, falls back to the default meal-plans offer to preserve
   * existing /success page behavior.
   */
  offer?: UpsellOffer;
}

const DEFAULT_MEAL_PLANS_OFFER: UpsellOffer = {
  id: "meal-plans-20-off",
  productSlug: "meal-plans",
  productName: "Meal Plans & Recipes",
  headline: "Add Meal Plans & Recipes",
  description:
    "68% of Premium members add meal plans. They report higher satisfaction and better adherence to treatment.",
  features: [
    "Weekly meal plans tailored to GLP-1 patients",
    "High-protein recipes with macro breakdowns",
    "Automated grocery lists by store section",
    "4 meal modes: Standard, High Protein, Low Effort, Family",
  ],
  priceCents: 1500,
  priceSuffix: "/mo first month",
  discountPct: 20,
  badge: "Member Exclusive",
  ctaLabel: "Add for $15/mo",
};

export function UpsellModal({ show, onClose, offer }: UpsellModalProps) {
  const currentOffer = offer ?? DEFAULT_MEAL_PLANS_OFFER;
  const offerId = currentOffer.id ?? currentOffer.productSlug;

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      track(ANALYTICS_EVENTS.UPSELL_VIEW, { offer: offerId, slug: currentOffer.productSlug });
    }
  }, [show, offerId, currentOffer.productSlug]);

  // Escape key dismisses + lock body scroll while open
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        track(ANALYTICS_EVENTS.UPSELL_DISMISS, { offer: offerId });
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [show, offerId, onClose]);

  function handleDismiss() {
    track(ANALYTICS_EVENTS.UPSELL_DISMISS, { offer: offerId });
    onClose();
  }

  async function handleAccept() {
    setLoading(true);
    track(ANALYTICS_EVENTS.UPSELL_ACCEPT, { offer: offerId, slug: currentOffer.productSlug });

    try {
      const res = await fetch("/api/stripe/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: currentOffer.productSlug }),
      });

      if (res.ok) {
        setAccepted(true);
      } else {
        // Silently fail — don't block the success experience
        setAccepted(true);
      }
    } catch {
      // If API fails, still show success (add-on can be added later from dashboard)
      setAccepted(true);
    } finally {
      setLoading(false);
    }
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upsell-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={handleDismiss} aria-hidden="true" />

      {/* Modal — bottom-sheet on mobile, centered card on desktop */}
      <div className={cn(
        "relative w-full max-w-md bg-white shadow-premium-xl border border-navy-100/60 max-h-[90dvh] overflow-y-auto scroll-container",
        "rounded-t-3xl rounded-b-none sm:rounded-2xl",
        "pb-[env(safe-area-inset-bottom)] sm:pb-0",
        "animate-slide-up ease-spring"
      )}>
        {/* iOS-style drag handle (mobile only) */}
        <div className="sm:hidden mx-auto mt-2 mb-1 h-1 w-10 rounded-full bg-navy-200/60" aria-hidden="true" />
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {accepted ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal">
              <Check className="h-7 w-7 text-white" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-navy">Added to your plan!</h3>
            <p className="mt-2 text-sm text-graphite-400">
              {currentOffer.productName} is now active in your dashboard.
              {currentOffer.discountPct ? ` Your first month is ${currentOffer.discountPct}% off.` : ""}
            </p>
            <Button onClick={onClose} className="mt-6">
              Go to Dashboard
            </Button>
          </div>
        ) : (
          /* Offer */
          <div className="p-6 sm:p-8">
            <div className="text-center">
              <Badge variant="gold" className="mb-4 gap-1.5">
                <Sparkles className="h-3 w-3" /> {currentOffer.badge ?? "Member Exclusive"}
              </Badge>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-50 to-linen">
                {currentOffer.iconEmoji ? (
                  <span className="text-2xl">{currentOffer.iconEmoji}</span>
                ) : (
                  <ChefHat className="h-7 w-7 text-gold-700" />
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold text-navy">{currentOffer.headline}</h3>
              <p className="mt-2 text-sm text-graphite-500 max-w-xs mx-auto">
                {currentOffer.description}
              </p>
            </div>

            {/* What's included */}
            {currentOffer.features && currentOffer.features.length > 0 && (
              <div className="mt-6 space-y-2">
                {currentOffer.features.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span className="text-sm text-graphite-600">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Pricing */}
            {typeof currentOffer.priceCents === "number" && (
              <div className="mt-6 rounded-xl bg-gradient-to-r from-gold-50 to-linen border border-gold-200/50 p-4 text-center">
                <div className="flex items-baseline justify-center gap-2">
                  {currentOffer.discountPct && (
                    <span className="text-sm text-graphite-400 line-through">
                      ${Math.round(currentOffer.priceCents / (1 - currentOffer.discountPct / 100) / 100)}/mo
                    </span>
                  )}
                  <span className="text-2xl font-bold text-navy">
                    ${(currentOffer.priceCents / 100).toFixed(0)}
                  </span>
                  <span className="text-sm text-graphite-400">
                    {currentOffer.priceSuffix ?? "/mo"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-graphite-400">Cancel anytime.</p>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-6 space-y-3">
              <Button
                size="lg"
                variant="gold"
                className="w-full gap-2"
                onClick={handleAccept}
                disabled={loading}
              >
                {loading
                  ? "Adding..."
                  : currentOffer.ctaLabel ??
                    `Add ${currentOffer.productName}${
                      currentOffer.priceCents ? ` — $${(currentOffer.priceCents / 100).toFixed(0)}/mo` : ""
                    }`}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </Button>
              <button
                onClick={handleDismiss}
                className="w-full text-center text-sm text-graphite-400 hover:text-navy transition-colors"
              >
                No thanks, continue to dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
