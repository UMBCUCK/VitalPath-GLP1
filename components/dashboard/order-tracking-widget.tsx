"use client";

import Link from "next/link";
import { Package, Pill, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STEPS = ["Ordered", "Processing", "Shipped", "Delivered"];

const STATUS_BADGES: Record<string, string> = {
  ACTIVE: "success",
  PRESCRIBED: "default",
  PENDING: "warning",
  ON_HOLD: "warning",
  COMPLETED: "secondary",
  DISCONTINUED: "destructive",
};

interface OrderTrackingWidgetProps {
  medicationName: string | null;
  medicationDose: string | null;
  status: string | null;
  nextRefillDaysAway: number | null;
  nextRefillLabel: string | null;
  shipmentStep: number; // 0=ordered, 1=processing, 2=shipped, 3=delivered
}

export function OrderTrackingWidget({
  medicationName,
  medicationDose,
  status,
  nextRefillDaysAway,
  nextRefillLabel,
  shipmentStep,
}: OrderTrackingWidgetProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-teal" /> Order Tracking
          </CardTitle>
          <Link
            href="/dashboard/treatment"
            className="flex items-center gap-1 text-xs text-teal hover:underline font-medium"
          >
            View details <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Medication info row */}
        <div className="flex items-center justify-between rounded-xl bg-teal-50/40 border border-teal/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
              <Pill className="h-4 w-4 text-teal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">
                {medicationName || "Pending assignment"}
              </p>
              {medicationDose && (
                <p className="text-xs text-graphite-400">{medicationDose}</p>
              )}
            </div>
          </div>
          {status && (
            <Badge variant={(STATUS_BADGES[status] as "success" | "default" | "warning" | "secondary" | "destructive") || "secondary"} className="text-[10px]">
              {status}
            </Badge>
          )}
        </div>

        {/* Shipment progress */}
        <div>
          <p className="text-xs font-semibold text-navy mb-3">Most Recent Shipment</p>
          <div className="flex items-center">
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      i <= shipmentStep
                        ? "bg-teal text-white"
                        : "bg-navy-100 text-graphite-400"
                    )}
                  >
                    {i < shipmentStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-[9px] font-medium text-center whitespace-nowrap",
                      i <= shipmentStep ? "text-navy" : "text-graphite-300"
                    )}
                  >
                    {step}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-1 mb-4",
                      i < shipmentStep ? "bg-teal" : "bg-navy-100"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next refill */}
        {nextRefillLabel && (
          <div className="flex items-center justify-between rounded-xl bg-gold-50/50 border border-gold/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-navy">Next Refill</p>
                <p className="text-xs text-graphite-400">{nextRefillLabel}</p>
              </div>
            </div>
            {nextRefillDaysAway !== null && (
              <div
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  nextRefillDaysAway <= 7
                    ? "bg-amber-100 text-amber-700"
                    : "bg-teal-50 text-teal-700"
                )}
              >
                {nextRefillDaysAway <= 0
                  ? "Due today"
                  : `${nextRefillDaysAway}d away`}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
