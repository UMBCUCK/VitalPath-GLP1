"use client";

import { useState, useEffect } from "react";
import { X, Check, Sparkles, ChefHat, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface UpsellModalProps {
  show: boolean;
  onClose: () => void;
}

export function UpsellModal({ show, onClose }: UpsellModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      track(ANALYTICS_EVENTS.UPSELL_VIEW, { offer: "meal-plans-20-off" });
    }
  }, [show]);

  function handleDismiss() {
    track(ANALYTICS_EVENTS.UPSELL_DISMISS, { offer: "meal-plans-20-off" });
    onClose();
  }

  async function handleAccept() {
    setLoading(true);
    track(ANALYTICS_EVENTS.UPSELL_ACCEPT, { offer: "meal-plans-20-off" });

    // In production: add the meal plan add-on to the user's Stripe subscription
    // await fetch('/api/stripe/add-item', { method: 'POST', body: JSON.stringify({ productSlug: 'meal-plans', discount: 20 }) });

    await new Promise((r) => setTimeout(r, 1000));
    setAccepted(true);
    setLoading(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={handleDismiss} />

      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-md rounded-2xl bg-white shadow-premium-xl border border-navy-100/60",
        "animate-slide-up"
      )}>
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
              Meal plans and recipes are now active in your dashboard. Your first month is 20% off.
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
                <Sparkles className="h-3 w-3" /> Member Exclusive
              </Badge>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-50 to-linen">
                <ChefHat className="h-7 w-7 text-gold-700" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-navy">
                Add Meal Plans & Recipes
              </h3>
              <p className="mt-2 text-sm text-graphite-500 max-w-xs mx-auto">
                <span className="font-semibold text-navy">68% of Premium members</span> add meal plans.
                They report higher satisfaction and better adherence to treatment.
              </p>
            </div>

            {/* What's included */}
            <div className="mt-6 space-y-2">
              {[
                "Weekly meal plans tailored to GLP-1 patients",
                "High-protein recipes with macro breakdowns",
                "Automated grocery lists by store section",
                "4 meal modes: Standard, High Protein, Low Effort, Family",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span className="text-sm text-graphite-600">{item}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-gold-50 to-linen border border-gold-200/50 p-4 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-sm text-graphite-400 line-through">$19/mo</span>
                <span className="text-2xl font-bold text-navy">$15</span>
                <span className="text-sm text-graphite-400">/mo first month</span>
              </div>
              <p className="mt-1 text-xs text-graphite-400">Then $19/mo. Cancel anytime.</p>
            </div>

            {/* CTAs */}
            <div className="mt-6 space-y-3">
              <Button
                size="lg"
                variant="gold"
                className="w-full gap-2"
                onClick={handleAccept}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add for $15/mo"}
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
