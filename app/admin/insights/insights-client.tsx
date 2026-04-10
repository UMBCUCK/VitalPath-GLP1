"use client";

import { useState, useCallback } from "react";
import {
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  AlertCircle,
  Play,
  Loader2,
  X,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────

interface InsightRecord {
  id: string;
  type: string;
  metric: string;
  title: string;
  description: string;
  severity: string;
  currentValue: number;
  expectedValue: number;
  deviation: number;
  isDismissed: boolean;
  createdAt: string | Date;
}

interface InsightsData {
  insights: InsightRecord[];
  total: number;
  page: number;
  limit: number;
}

// ─── Config ────────────────────────────────────────────────────

const typeConfig: Record<
  string,
  { icon: typeof AlertTriangle; color: string; bg: string; label: string }
> = {
  ANOMALY: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "Anomaly",
  },
  TREND: {
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "Trend",
  },
  OPPORTUNITY: {
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-50",
    label: "Opportunity",
  },
  WARNING: {
    icon: AlertCircle,
    color: "text-orange-500",
    bg: "bg-orange-50",
    label: "Warning",
  },
};

const severityConfig: Record<
  string,
  { variant: "destructive" | "warning" | "secondary"; label: string }
> = {
  HIGH: { variant: "destructive", label: "High" },
  MEDIUM: { variant: "warning", label: "Medium" },
  LOW: { variant: "secondary", label: "Low" },
};

const filterTabs = [
  { key: "ALL", label: "All" },
  { key: "ANOMALY", label: "Anomalies" },
  { key: "TREND", label: "Trends" },
  { key: "OPPORTUNITY", label: "Opportunities" },
  { key: "WARNING", label: "Warnings" },
];

function timeAgo(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatMetricValue(metric: string, value: number): string {
  if (metric === "mrr" || metric === "revenue_per_order") {
    return `$${(value / 100).toLocaleString()}`;
  }
  return String(Math.round(value * 100) / 100);
}

// ─── Component ─────────────────────────────────────────────────

export function InsightsClient({
  initialData,
}: {
  initialData: InsightsData;
}) {
  const [insights, setInsights] = useState(initialData.insights);
  const [total, setTotal] = useState(initialData.total);
  const [activeTab, setActiveTab] = useState("ALL");
  const [detecting, setDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<string | null>(null);

  const fetchInsights = useCallback(async (type: string) => {
    try {
      const url = `/api/admin/insights${type !== "ALL" ? `?type=${type}` : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights);
        setTotal(data.total);
      }
    } catch {
      // Silent failure
    }
  }, []);

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      fetchInsights(tab);
    },
    [fetchInsights]
  );

  const runDetection = useCallback(async () => {
    setDetecting(true);
    setDetectionResult(null);
    try {
      const res = await fetch("/api/admin/insights", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setDetectionResult(
          `Detection complete: ${data.created} new insight${data.created !== 1 ? "s" : ""} found (${data.anomalies} anomalies, ${data.trends} trends).`
        );
        fetchInsights(activeTab);
      } else {
        setDetectionResult("Detection failed. Try again.");
      }
    } catch {
      setDetectionResult("Detection failed. Try again.");
    } finally {
      setDetecting(false);
    }
  }, [activeTab, fetchInsights]);

  const dismissInsight = useCallback(
    async (id: string) => {
      try {
        const res = await fetch("/api/admin/insights", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "dismiss", id }),
        });
        if (res.ok) {
          setInsights((prev) => prev.filter((i) => i.id !== id));
          setTotal((prev) => prev - 1);
        }
      } catch {
        // Silent failure
      }
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">AI Insights</h2>
          <p className="text-sm text-graphite-400">
            Automated anomaly detection and trend analysis
          </p>
        </div>
        <Button
          onClick={runDetection}
          disabled={detecting}
          className="gap-2"
        >
          {detecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run Detection
        </Button>
      </div>

      {/* Detection result banner */}
      {detectionResult && (
        <div className="flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3">
          <p className="text-sm text-teal-800">{detectionResult}</p>
          <button
            onClick={() => setDetectionResult(null)}
            className="text-teal-600 hover:text-teal-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-xl bg-navy-50/50 p-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-white text-navy shadow-sm"
                : "text-graphite-400 hover:text-navy"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Insights feed */}
      {insights.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-50">
              <Lightbulb className="h-6 w-6 text-graphite-300" />
            </div>
            <p className="font-medium text-navy">No insights detected</p>
            <p className="mt-1 text-sm text-graphite-400">
              Run detection to scan for anomalies, trends, and opportunities.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {insights.map((insight) => {
            const tc = typeConfig[insight.type] || typeConfig.WARNING;
            const sc = severityConfig[insight.severity] || severityConfig.LOW;
            const Icon = tc.icon;
            const deviationPct =
              insight.expectedValue !== 0
                ? (
                    ((insight.currentValue - insight.expectedValue) /
                      Math.abs(insight.expectedValue)) *
                    100
                  ).toFixed(1)
                : "0";

            return (
              <Card key={insight.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    {/* Type icon */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        tc.bg
                      )}
                    >
                      <Icon className={cn("h-5 w-5", tc.color)} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-navy">
                              {insight.title}
                            </h3>
                            <Badge variant={sc.variant}>{sc.label}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-graphite-500">
                            {insight.description}
                          </p>
                        </div>
                        <button
                          onClick={() => dismissInsight(insight.id)}
                          className="shrink-0 rounded-lg p-1 text-graphite-300 transition-colors hover:bg-navy-50 hover:text-navy"
                          title="Dismiss"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Metrics row */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 rounded-lg bg-navy-50/70 px-2.5 py-1">
                          <span className="text-xs text-graphite-400">
                            Current:
                          </span>
                          <span className="text-xs font-semibold text-navy">
                            {formatMetricValue(
                              insight.metric,
                              insight.currentValue
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-navy-50/70 px-2.5 py-1">
                          <span className="text-xs text-graphite-400">
                            Expected:
                          </span>
                          <span className="text-xs font-semibold text-navy">
                            {formatMetricValue(
                              insight.metric,
                              insight.expectedValue
                            )}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1.5 rounded-lg px-2.5 py-1",
                            parseFloat(deviationPct) > 0
                              ? "bg-emerald-50"
                              : "bg-red-50"
                          )}
                        >
                          <span className="text-xs text-graphite-400">
                            Deviation:
                          </span>
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              parseFloat(deviationPct) > 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            )}
                          >
                            {parseFloat(deviationPct) > 0 ? "+" : ""}
                            {deviationPct}%
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          {insight.metric.replace(/_/g, " ")}
                        </Badge>
                        <span className="flex items-center gap-1 text-[10px] text-graphite-300">
                          <Clock className="h-3 w-3" />
                          {timeAgo(insight.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Total count */}
      {total > 0 && (
        <p className="text-center text-xs text-graphite-300">
          Showing {insights.length} of {total} insight{total !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
