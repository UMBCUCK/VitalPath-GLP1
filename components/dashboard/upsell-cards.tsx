"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

interface UpsellSuggestion {
  id: string;
  productSlug: string;
  productName: string;
  headline: string;
  description: string;
  discountPct?: number;
  priority: number;
}

// Peptide slugs — Tier 6.2 — used to route peptide upsells to the shop
// (they require provider evaluation) vs. direct-add Stripe flow for core
// subscription add-ons like meal plans.
const PEPTIDE_SLUGS = new Set([
  "nad-plus",
  "sermorelin",
  "ipamorelin-cjc",
  "bpc-157",
  "glow-stack",
  "thymosin-beta-4",
]);

export function UpsellCards({ suggestions }: { suggestions: UpsellSuggestion[] }) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [added, setAdded] = useState<string[]>([]);

  // Tier 6.2 — fire UPSELL_VIEW once per unique suggestion shown, for
  // impression-to-accept conversion tracking.
  useEffect(() => {
    suggestions.forEach((s) => {
      track(ANALYTICS_EVENTS.UPSELL_VIEW, {
        upsell_id: s.id,
        product: s.productSlug,
        priority: s.priority,
        location: "dashboard_home",
      });
    });
  }, [suggestions]);

  if (suggestions.length === 0) return null;

  const visible = suggestions.filter((s) => !dismissed.includes(s.id));
  if (visible.length === 0) return null;

  async function handleAdd(s: UpsellSuggestion) {
    track(ANALYTICS_EVENTS.UPSELL_ACCEPT, {
      upsell_id: s.id,
      product: s.productSlug,
      location: "dashboard_home",
    });

    // Peptides route to /dashboard/shop for provider-review add flow
    if (PEPTIDE_SLUGS.has(s.productSlug)) {
      window.location.href = `/dashboard/shop?product=${s.productSlug}`;
      return;
    }

    // Core add-ons (meal-plans, coaching, etc.) → direct Stripe item add
    setAddingId(s.id);
    try {
      const res = await fetch("/api/stripe/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug: s.productSlug }),
      });
      if (res.ok) {
        setAdded((a) => [...a, s.id]);
      } else {
        // Fall back to the shop page if the direct-add isn't available
        window.location.href = `/dashboard/shop?product=${s.productSlug}`;
      }
    } catch {
      window.location.href = `/dashboard/shop?product=${s.productSlug}`;
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div className="space-y-3">
      {visible.map((s) => {
        const isPeptide = PEPTIDE_SLUGS.has(s.productSlug);
        const isAdded = added.includes(s.id);
        return (
          <Card
            key={s.id}
            className={
              isPeptide
                ? "border-teal-200/60 bg-gradient-to-r from-teal-50/40 to-sage/20"
                : "border-gold-200/50 bg-gradient-to-r from-gold-50/30 to-linen/30"
            }
          >
            <CardContent className="flex items-start gap-4 p-5">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isPeptide ? "bg-teal-100" : "bg-gold-100"
                }`}
              >
                <Sparkles className={`h-5 w-5 ${isPeptide ? "text-teal-700" : "text-gold-700"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-navy">{s.headline}</p>
                      {isPeptide && (
                        <Badge variant="default" className="text-[9px] uppercase">
                          Peptide
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-graphite-500 leading-relaxed">{s.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDismissed((d) => [...d, s.id]);
                      track(ANALYTICS_EVENTS.UPSELL_DISMISS, {
                        upsell_id: s.id,
                        location: "dashboard_home",
                      });
                    }}
                    className="shrink-0 ml-2 text-graphite-300 hover:text-navy"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {isAdded ? (
                    <Badge variant="success" className="text-[10px]">
                      ✓ Added — see it on your plan
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant={isPeptide ? "emerald" : "gold"}
                      className="gap-1"
                      onClick={() => handleAdd(s)}
                      disabled={addingId === s.id}
                    >
                      {addingId === s.id ? "Adding..." : isPeptide ? `Learn about ${s.productName}` : `Add ${s.productName}`}
                      {addingId !== s.id && <ArrowRight className="h-3 w-3" />}
                    </Button>
                  )}
                  {s.discountPct && !isAdded && (
                    <Badge variant="gold" className="text-[10px]">
                      {s.discountPct}% off first month
                    </Badge>
                  )}
                  {isPeptide && !isAdded && (
                    <Link
                      href={`/peptides/${s.productSlug}`}
                      className="text-[11px] font-semibold text-teal hover:underline"
                    >
                      How it works →
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
