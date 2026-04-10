"use client";

import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import { KPICard } from "@/components/admin/kpi-card";
import { formatPrice } from "@/lib/utils";

export function ConversionClient(props: Record<string, unknown>) {
  const metrics = (props.metrics || {}) as Record<string, unknown>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">Conversion Analytics</h2>
      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard title="Conversion Rate" value={`${Number(metrics.overallRate || 0).toFixed(1)}%`} icon={Target} />
        <KPICard title="Conversions" value={String(metrics.totalConversions || 0)} icon={Users} />
        <KPICard title="Revenue" value={formatPrice(Number(metrics.totalRevenue || 0))} icon={DollarSign} />
        <KPICard title="CAC" value={formatPrice(Number(metrics.cac || 0))} icon={TrendingUp} />
      </div>
    </div>
  );
}
