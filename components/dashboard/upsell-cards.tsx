"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useState } from "react";
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

export function UpsellCards({ suggestions }: { suggestions: UpsellSuggestion[] }) {
  const [dismissed, setDismissed] = useState<string[]>([]);

  if (suggestions.length === 0) return null;

  const visible = suggestions.filter((s) => !dismissed.includes(s.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-3">
      {visible.map((s) => (
        <Card key={s.id} className="border-gold-200/50 bg-gradient-to-r from-gold-50/30 to-linen/30">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100">
              <Sparkles className="h-5 w-5 text-gold-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-navy">{s.headline}</p>
                  <p className="mt-1 text-xs text-graphite-500 leading-relaxed">{s.description}</p>
                </div>
                <button
                  onClick={() => {
                    setDismissed((d) => [...d, s.id]);
                    track(ANALYTICS_EVENTS.UPSELL_DISMISS, { upsell_id: s.id });
                  }}
                  className="shrink-0 ml-2 text-graphite-300 hover:text-navy"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Button
                  size="sm"
                  variant="gold"
                  className="gap-1"
                  onClick={() => track(ANALYTICS_EVENTS.UPSELL_ACCEPT, { upsell_id: s.id, product: s.productSlug })}
                >
                  Add {s.productName} <ArrowRight className="h-3 w-3" />
                </Button>
                {s.discountPct && (
                  <Badge variant="gold" className="text-[10px]">{s.discountPct}% off first month</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
