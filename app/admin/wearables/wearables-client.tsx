"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import {
  Smartphone,
  Watch,
  Activity,
  Database,
  Wifi,
  TrendingUp,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

interface PlatformDataPoint {
  platform: string;
  count: number;
}

interface Metrics {
  totalConnections: number;
  activeConnections: number;
  activeToday: number;
  dataPointsToday: number;
  totalDataPoints: number;
  byPlatform: Record<string, number>;
  platformDataPoints: PlatformDataPoint[];
}

interface Props {
  metrics: Metrics;
}

// ── Helpers ────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  APPLE_HEALTH: { label: "Apple Health", color: "text-red-600", bg: "bg-red-50" },
  GOOGLE_FIT: { label: "Google Fit", color: "text-blue-600", bg: "bg-blue-50" },
  FITBIT: { label: "Fitbit", color: "text-teal-600", bg: "bg-teal-50" },
  WHOOP: { label: "Whoop", color: "text-amber-600", bg: "bg-amber-50" },
  OURA: { label: "Oura", color: "text-purple-600", bg: "bg-purple-50" },
};

// ── Component ──────────────────────────────────────────────────

export function WearablesClient({ metrics }: Props) {
  const platforms = Object.entries(metrics.byPlatform);
  const totalActive = metrics.activeConnections;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Watch className="h-6 w-6 text-teal" />
          Wearable Integration
        </h1>
        <p className="mt-1 text-sm text-graphite-400">
          Device connection adoption and health data ingestion metrics
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Connections"
          value={String(metrics.totalConnections)}
          icon={Smartphone}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Active Connections"
          value={String(metrics.activeConnections)}
          icon={Wifi}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Active Today"
          value={String(metrics.activeToday)}
          icon={Activity}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Data Points Today"
          value={metrics.dataPointsToday.toLocaleString()}
          icon={Database}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Platform Breakdown + Adoption Table */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie chart (visual representation) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-navy">
              Connections by Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {platforms.map(([platform, count]) => {
                const config = PLATFORM_CONFIG[platform] || {
                  label: platform,
                  color: "text-graphite-600",
                  bg: "bg-graphite-50",
                };
                const pct = totalActive > 0 ? Math.round((count / totalActive) * 100) : 0;
                return (
                  <div key={platform} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}>
                      <Watch className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-navy">{config.label}</span>
                        <span className="text-xs text-graphite-400">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-navy-100/30 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            platform === "APPLE_HEALTH" ? "bg-red-400" :
                            platform === "GOOGLE_FIT" ? "bg-blue-400" :
                            platform === "FITBIT" ? "bg-teal-400" :
                            platform === "WHOOP" ? "bg-amber-400" :
                            "bg-purple-400"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalActive === 0 && (
              <p className="text-sm text-graphite-400 text-center py-8">
                No active connections yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-navy">
              Data Ingestion Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-navy-50/50 p-4">
                <div>
                  <p className="text-xs text-graphite-400">Total Data Points</p>
                  <p className="text-xl font-bold text-navy">{metrics.totalDataPoints.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-teal" />
              </div>

              <div className="divide-y divide-navy-100/30">
                {metrics.platformDataPoints.map((pd) => {
                  const config = PLATFORM_CONFIG[pd.platform] || {
                    label: pd.platform,
                    color: "text-graphite-600",
                    bg: "bg-graphite-50",
                  };
                  return (
                    <div key={pd.platform} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          pd.platform === "APPLE_HEALTH" ? "bg-red-400" :
                          pd.platform === "GOOGLE_FIT" ? "bg-blue-400" :
                          pd.platform === "FITBIT" ? "bg-teal-400" :
                          pd.platform === "WHOOP" ? "bg-amber-400" :
                          "bg-purple-400"
                        }`} />
                        <span className="text-sm text-navy">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-graphite-600">
                          {pd.count.toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          pts
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {metrics.platformDataPoints.length === 0 && (
                <p className="text-sm text-graphite-400 text-center py-4">
                  No data points ingested yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adoption Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-navy">
            Platform Adoption Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Connected Users
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Active Rate
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Data Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {platforms.map(([platform, count]) => {
                  const config = PLATFORM_CONFIG[platform] || {
                    label: platform,
                    color: "text-graphite-600",
                    bg: "bg-graphite-50",
                  };
                  const dataPoints =
                    metrics.platformDataPoints.find((p) => p.platform === platform)?.count || 0;
                  const activeRate =
                    metrics.totalConnections > 0
                      ? Math.round((count / metrics.totalConnections) * 100)
                      : 0;

                  return (
                    <tr key={platform} className="border-b border-navy-100/20 hover:bg-navy-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${config.bg}`}>
                            <Watch className={`h-3.5 w-3.5 ${config.color}`} />
                          </div>
                          <span className="font-medium text-navy">{config.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-navy">{count}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant={activeRate > 50 ? "success" : activeRate > 20 ? "warning" : "secondary"}>
                          {activeRate}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-graphite-600">
                        {dataPoints.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {platforms.length === 0 && (
              <p className="text-sm text-graphite-400 text-center py-8">
                No wearable connections found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
