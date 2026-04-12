"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  TrendingUp,
  DollarSign,
  Clock,
  Zap,
  Check,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────

interface Intervention {
  id: string;
  userId: string;
  subscriptionId: string | null;
  type: string;
  offerDetails: Record<string, unknown>;
  status: string;
  triggeredBy: string;
  offeredAt: string;
  respondedAt: string | null;
  expiresAt: string | null;
  revenueSaved: number | null;
  patientName: string;
  patientEmail: string;
}

interface TypeBreakdown {
  type: string;
  count: number;
}

interface Metrics {
  totalInterventions: number;
  acceptedCount: number;
  declinedCount: number;
  activeOffers: number;
  acceptanceRate: number;
  revenueSaved: number;
  typeBreakdown: TypeBreakdown[];
}

interface Props {
  initialInterventions: Intervention[];
  initialTotal: number;
  metrics: Metrics;
}

const typeColors: Record<string, string> = {
  SAVE_OFFER: "bg-blue-100 text-blue-800",
  WIN_BACK: "bg-purple-100 text-purple-800",
  PAUSE_OFFER: "bg-amber-100 text-amber-800",
  DOWNGRADE_OFFER: "bg-orange-100 text-orange-800",
  DISCOUNT: "bg-emerald-100 text-emerald-800",
  FREE_MONTH: "bg-teal-100 text-teal-800",
};

const statusColors: Record<string, string> = {
  OFFERED: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-emerald-100 text-emerald-800",
  DECLINED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-500",
};

const donutColors = [
  "#0d9488", // teal
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#ef4444", // red
  "#10b981", // emerald
  "#8b5cf6", // violet
];

// ─── Component ─────────────────────────────────────────────

export function RetentionEngineClient({ initialInterventions, initialTotal, metrics }: Props) {
  const [interventions, setInterventions] = useState(initialInterventions);
  const [total, setTotal] = useState(initialTotal);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleAutoTrigger = async () => {
    setTriggerLoading(true);
    setTriggerResult(null);
    try {
      const res = await fetch("/api/admin/retention-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "auto-trigger" }),
      });
      if (res.ok) {
        const data = await res.json();
        setTriggerResult(`Triggered ${data.triggered} new intervention(s)`);
        await refreshData();
      }
    } finally {
      setTriggerLoading(false);
    }
  };

  const handleRespond = async (id: string, accepted: boolean) => {
    const res = await fetch("/api/admin/retention-engine", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, accepted }),
    });
    if (res.ok) await refreshData();
  };

  const refreshData = async () => {
    const params = new URLSearchParams();
    if (filterStatus !== "all") params.set("status", filterStatus);
    const res = await fetch(`/api/admin/retention-engine?${params}`);
    if (res.ok) {
      const data = await res.json();
      setInterventions(data.interventions);
      setTotal(data.total);
    }
  };

  const handleFilterChange = async (status: string) => {
    setFilterStatus(status);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    const res = await fetch(`/api/admin/retention-engine?${params}`);
    if (res.ok) {
      const data = await res.json();
      setInterventions(data.interventions);
      setTotal(data.total);
    }
  };

  // Donut chart calculations
  const donutTotal = metrics.typeBreakdown.reduce((sum, t) => sum + t.count, 0);
  let cumulativePercent = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Retention Engine</h2>
          <p className="text-sm text-graphite-400">
            Automated interventions to reduce churn and retain subscribers
          </p>
        </div>
        <div className="flex items-center gap-3">
          {triggerResult && (
            <span className="text-xs text-emerald-600">{triggerResult}</span>
          )}
          <Button
            onClick={handleAutoTrigger}
            disabled={triggerLoading}
            className="bg-teal text-white hover:bg-teal-600"
          >
            <Zap className="mr-2 h-4 w-4" />
            {triggerLoading ? "Running..." : "Run Auto-Trigger"}
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Shield className="h-5 w-5 text-teal" />
            <div>
              <p className="text-xs text-graphite-400">Total Interventions</p>
              <p className="text-xl font-bold text-navy">{metrics.totalInterventions}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-graphite-400">Acceptance Rate</p>
              <p className="text-xl font-bold text-navy">{metrics.acceptanceRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-5 w-5 text-gold-600" />
            <div>
              <p className="text-xs text-graphite-400">Revenue Saved</p>
              <p className="text-xl font-bold text-navy">{formatPrice(metrics.revenueSaved)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-xs text-graphite-400">Active Offers</p>
              <p className="text-xl font-bold text-navy">{metrics.activeOffers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Type Breakdown Donut Chart */}
      {metrics.typeBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Intervention Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="relative h-40 w-40 shrink-0">
                <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                  {metrics.typeBreakdown.map((t, i) => {
                    const percent = donutTotal > 0 ? (t.count / donutTotal) * 100 : 0;
                    const dashArray = `${percent} ${100 - percent}`;
                    const dashOffset = 100 - cumulativePercent;
                    cumulativePercent += percent;
                    return (
                      <circle
                        key={t.type}
                        cx="18"
                        cy="18"
                        r="15.5"
                        fill="transparent"
                        stroke={donutColors[i % donutColors.length]}
                        strokeWidth="3"
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-bold text-navy">{donutTotal}</p>
                    <p className="text-[10px] text-graphite-400">total</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {metrics.typeBreakdown.map((t, i) => (
                  <div key={t.type} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: donutColors[i % donutColors.length] }}
                    />
                    <span className="text-xs text-graphite-500">
                      {t.type.replace(/_/g, " ")} ({t.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DataTable */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Interventions ({total})</CardTitle>
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="rounded-xl border border-navy-100/40 bg-white px-3 py-1.5 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="OFFERED">Offered</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="DECLINED">Declined</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </CardHeader>
        <CardContent>
          {interventions.length === 0 ? (
            <p className="py-8 text-center text-sm text-graphite-300">No interventions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/30 text-left text-xs text-graphite-400">
                    <th className="pb-2 pr-4 font-medium">Patient</th>
                    <th className="pb-2 pr-4 font-medium">Type</th>
                    <th className="pb-2 pr-4 font-medium">Offer Details</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 pr-4 font-medium">Triggered By</th>
                    <th className="pb-2 pr-4 font-medium">Offered</th>
                    <th className="pb-2 pr-4 font-medium">Responded</th>
                    <th className="pb-2 pr-4 font-medium">Revenue Saved</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/20">
                  {interventions.map((item) => (
                    <tr key={item.id} className="hover:bg-navy-50/30">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="font-medium text-navy">{item.patientName}</p>
                          <p className="text-[10px] text-graphite-400">{item.patientEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Badge className={typeColors[item.type] || "bg-gray-100"}>
                          {item.type.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-xs text-graphite-500">
                        {(item.offerDetails as { description?: string })?.description || JSON.stringify(item.offerDetails)}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge className={statusColors[item.status] || "bg-gray-100"}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-xs text-graphite-500">{item.triggeredBy}</td>
                      <td className="py-3 pr-4 text-xs text-graphite-500">
                        {new Date(item.offeredAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4 text-xs text-graphite-500">
                        {item.respondedAt ? new Date(item.respondedAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-3 pr-4 text-xs font-medium text-navy">
                        {item.revenueSaved ? formatPrice(item.revenueSaved) : "-"}
                      </td>
                      <td className="py-3">
                        {item.status === "OFFERED" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleRespond(item.id, true)}
                              className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600 hover:bg-emerald-100"
                              title="Accept"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleRespond(item.id, false)}
                              className="rounded-lg bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                              title="Decline"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
