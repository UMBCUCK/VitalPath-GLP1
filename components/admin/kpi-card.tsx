"use client";

import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkline } from "./sparkline";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  change?: number; // percentage
  changeLabel?: string;
  icon: LucideIcon;
  sparklineData?: number[];
  sparklineColor?: string;
  iconColor?: string;
  iconBg?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  sparklineData,
  sparklineColor = "#0d9488",
  iconColor = "text-teal",
  iconBg = "bg-teal-50",
}: KPICardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
              {title}
            </p>
            <p className="mt-1.5 text-2xl font-bold text-navy">{value}</p>
            {change !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : isNegative ? (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                ) : (
                  <Minus className="h-3.5 w-3.5 text-graphite-300" />
                )}
                <span
                  className={cn(
                    "text-xs font-semibold",
                    isPositive && "text-emerald-600",
                    isNegative && "text-red-600",
                    !isPositive && !isNegative && "text-graphite-400"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-graphite-300">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                iconBg
              )}
            >
              <Icon className={cn("h-5 w-5", iconColor)} />
            </div>
            {sparklineData && sparklineData.length > 1 && (
              <Sparkline data={sparklineData} color={sparklineColor} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
