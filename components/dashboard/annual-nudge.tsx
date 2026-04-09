"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { track } from "@/lib/analytics";

interface AnnualNudgeProps {
  planName: string;
  monthlyPrice: number;
  monthNumber: number;
}

export function AnnualNudge({ planName, monthlyPrice, monthNumber }: AnnualNudgeProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || monthNumber < 3) return null;

  const annualSavings = Math.round(monthlyPrice * 12 * 0.2);

  track("annual_nudge_view", { plan: planName, month: monthNumber });

  return (
    <Card className="bg-gradient-to-r from-gold-50/50 to-linen/50 border-gold-200/30">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-100">
          <DollarSign className="h-5 w-5 text-gold-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-navy">Switch to annual and save {formatPrice(annualSavings)}/year</p>
          <p className="text-xs text-graphite-500">You&apos;ve been on {planName} for {monthNumber} months. Lock in 20% savings.</p>
        </div>
        <Link href="/pricing/annual" onClick={() => track("annual_nudge_click", { plan: planName })}>
          <Button size="sm" variant="gold" className="gap-1 shrink-0">
            See Savings <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
        <button onClick={() => { setDismissed(true); track("annual_nudge_dismiss"); }} className="text-graphite-300 hover:text-navy shrink-0">
          <X className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}
