"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface PriceAnchorProps {
  currentPrice: number; // in cents
}

const includes = [
  "Licensed provider evaluation",
  "Medication if prescribed",
  "Ongoing monitoring",
];

export function PriceAnchor({ currentPrice }: PriceAnchorProps) {
  const retailPrice = 134900;
  const savingsPct = Math.round(((retailPrice - currentPrice) / retailPrice) * 100);

  return (
    <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/40 to-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-graphite-400">
            Your price
          </p>
          <p className="text-lg font-bold text-navy">
            {formatPrice(currentPrice)}<span className="text-xs font-normal text-graphite-400">/mo</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-wider text-graphite-300">
            Brand retail
          </p>
          <p className="text-lg font-semibold text-graphite-300 line-through">
            $1,349+<span className="text-xs font-normal">/mo</span>
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex justify-center">
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold">
          Save {savingsPct}%
        </Badge>
      </div>

      <div className="mt-3 space-y-1.5 border-t border-navy-100/30 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-400">
          Includes:
        </p>
        {includes.map((item) => (
          <div key={item} className="flex items-center gap-1.5">
            <Check className="h-3 w-3 shrink-0 text-teal" />
            <span className="text-[11px] text-graphite-500">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
