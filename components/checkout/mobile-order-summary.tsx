"use client";

import { useState } from "react";
import { ChevronUp, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";

interface MobileOrderSummaryProps {
  planName: string;
  total: number;
  billingLabel: string;
  loading: boolean;
  onCheckout: () => void;
}

export function MobileOrderSummary({ planName, total, billingLabel, loading, onCheckout }: MobileOrderSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-navy-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
      {/* Expandable details */}
      {expanded && (
        <div className="border-b border-navy-100/40 bg-navy-50/30 px-4 py-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-graphite-500">{planName} Plan</span>
            <span className="font-medium text-navy">{formatPrice(total)}{billingLabel}</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-graphite-400">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> 30-day guarantee
            </span>
            <span className="flex items-center gap-1">
              <Lock className="h-3 w-3" /> 256-bit encrypted
            </span>
          </div>
        </div>
      )}

      {/* Sticky bar */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2"
        >
          <div>
            <p className="text-xs text-graphite-500">Total</p>
            <p className="text-lg font-bold text-navy">{formatPrice(total)}<span className="text-xs font-normal text-graphite-400">{billingLabel}</span></p>
          </div>
          <ChevronUp className={cn("h-4 w-4 text-graphite-400 transition-transform", expanded && "rotate-180")} />
        </button>

        <Button
          size="lg"
          className="ml-auto min-h-[48px] flex-1 text-base font-bold"
          onClick={onCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Continue to Payment"}
        </Button>
      </div>
    </div>
  );
}
