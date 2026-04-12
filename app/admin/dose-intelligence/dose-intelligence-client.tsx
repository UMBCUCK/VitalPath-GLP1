"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import { KPICard } from "@/components/admin/kpi-card";
import {
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

interface DoseFactors {
  weightLossVelocity: number;
  sideEffectCount: number;
  severeSideEffects: boolean;
  adherenceRate: number;
  dataPointCount: number;
  cohortComparison: string;
}

interface Recommendation {
  id: string;
  userId: string;
  scheduleId: string | null;
  currentDose: string;
  recommendedDose: string;
  confidence: number;
  reasoning: string;
  factors: DoseFactors;
  status: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  patientName: string;
  patientEmail: string;
}

interface Metrics {
  totalRecommendations: number;
  pendingReview: number;
  acceptanceRate: number;
  avgConfidence: number;
  patientsNeedingReview: number;
  accepted: number;
  rejected: number;
}

interface Props {
  initialRecommendations: Recommendation[];
  initialTotal: number;
  metrics: Metrics;
}

// ── Helpers ────────────────────────────────────────────────────

function confidenceColor(confidence: number): string {
  if (confidence >= 80) return "text-emerald-600";
  if (confidence >= 60) return "text-amber-600";
  return "text-red-600";
}

function confidenceBg(confidence: number): string {
  if (confidence >= 80) return "bg-emerald-50";
  if (confidence >= 60) return "bg-amber-50";
  return "bg-red-50";
}

function statusVariant(status: string) {
  switch (status) {
    case "PENDING": return "warning" as const;
    case "ACCEPTED": return "success" as const;
    case "REJECTED": return "destructive" as const;
    case "EXPIRED": return "secondary" as const;
    default: return "secondary" as const;
  }
}

// ── Component ──────────────────────────────────────────────────

export function DoseIntelligenceClient({
  initialRecommendations,
  initialTotal,
  metrics,
}: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState(metrics);
  const limit = 25;

  async function fetchData(p = page, status = statusFilter) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(limit),
        include: "metrics",
      });
      if (status !== "all") params.set("status", status);

      const res = await fetch(`/api/admin/dose-intelligence?${params}`);
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setTotal(data.total || 0);
      if (data.metrics) setCurrentMetrics(data.metrics);
    } finally {
      setLoading(false);
    }
  }

  async function handleRunBatchAnalysis() {
    setBatchLoading(true);
    try {
      const res = await fetch("/api/admin/dose-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "batch" }),
      });
      const data = await res.json();
      if (data.generated > 0) {
        await fetchData(1, statusFilter);
        setPage(1);
      }
    } finally {
      setBatchLoading(false);
    }
  }

  async function handleReview(id: string, action: "ACCEPTED" | "REJECTED") {
    try {
      await fetch("/api/admin/dose-intelligence", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      await fetchData(page, statusFilter);
    } catch {
      // silent
    }
  }

  function handlePageChange(p: number) {
    setPage(p);
    fetchData(p, statusFilter);
  }

  function handleStatusFilter(status: string) {
    setStatusFilter(status);
    setPage(1);
    fetchData(1, status);
  }

  // ── Columns ──────────────────────────────────────────────────

  const columns: ColumnDef<Recommendation>[] = [
    {
      key: "patientName",
      header: "Patient",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-navy">{row.patientName}</p>
          <p className="text-xs text-graphite-400">{row.patientEmail}</p>
        </div>
      ),
    },
    {
      key: "currentDose",
      header: "Current",
      render: (row) => (
        <span className="text-sm font-mono text-graphite-600">{row.currentDose}</span>
      ),
    },
    {
      key: "recommendedDose",
      header: "Recommended",
      render: (row) => {
        const isChange = row.currentDose !== row.recommendedDose;
        return (
          <span className={`text-sm font-mono font-semibold ${isChange ? "text-teal" : "text-graphite-500"}`}>
            {row.recommendedDose}
            {isChange && <TrendingUp className="inline ml-1 h-3 w-3" />}
          </span>
        );
      },
    },
    {
      key: "confidence",
      header: "Confidence",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`rounded-lg px-2 py-0.5 text-xs font-bold ${confidenceBg(row.confidence)} ${confidenceColor(row.confidence)}`}>
            {row.confidence}%
          </div>
        </div>
      ),
    },
    {
      key: "reasoning",
      header: "Reasoning",
      className: "max-w-xs",
      render: (row) => (
        <p className="text-xs text-graphite-500 line-clamp-2">{row.reasoning}</p>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                onClick={(e) => { e.stopPropagation(); handleReview(row.id, "ACCEPTED"); }}
              >
                <CheckCircle2 className="h-3 w-3 mr-1" /> Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                onClick={(e) => { e.stopPropagation(); handleReview(row.id, "REJECTED"); }}
              >
                <XCircle className="h-3 w-3 mr-1" /> Reject
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedId(expandedId === row.id ? null : row.id);
            }}
          >
            {expandedId === row.id ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <Brain className="h-6 w-6 text-teal" />
            Dose Intelligence
          </h1>
          <p className="mt-1 text-sm text-graphite-400">
            AI-powered dose optimization recommendations for review
          </p>
        </div>
        <Button
          onClick={handleRunBatchAnalysis}
          disabled={batchLoading}
          className="gap-2"
        >
          <Zap className="h-4 w-4" />
          {batchLoading ? "Analyzing..." : "Run Analysis"}
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Pending Reviews"
          value={String(currentMetrics.pendingReview)}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Acceptance Rate"
          value={`${currentMetrics.acceptanceRate}%`}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Avg Confidence"
          value={`${currentMetrics.avgConfidence}%`}
          icon={BarChart3}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Patients Needing Adjustment"
          value={String(currentMetrics.patientsNeedingReview)}
          icon={Users}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
      </div>

      {/* Status Filters */}
      <div className="flex gap-2">
        {["all", "PENDING", "ACCEPTED", "REJECTED"].map((s) => (
          <Button
            key={s}
            size="sm"
            variant={statusFilter === s ? "default" : "outline"}
            onClick={() => handleStatusFilter(s)}
            className="text-xs"
          >
            {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Recommendations Table */}
      <Card>
        <CardContent className="p-0">
          <DataTable
            data={recommendations}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            loading={loading}
            emptyMessage="No dose recommendations yet. Click 'Run Analysis' to generate."
            getRowId={(row) => row.id}
            onRowClick={(row) => setExpandedId(expandedId === row.id ? null : row.id)}
          />
        </CardContent>
      </Card>

      {/* Expanded Detail */}
      {expandedId && (() => {
        const rec = recommendations.find((r) => r.id === expandedId);
        if (!rec) return null;
        const factors = rec.factors;
        return (
          <Card className="border-teal/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-navy">
                    Recommendation Details: {rec.patientName}
                  </h3>
                  <p className="text-xs text-graphite-400">
                    Generated {new Date(rec.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className={`rounded-xl px-3 py-1 text-sm font-bold ${confidenceBg(rec.confidence)} ${confidenceColor(rec.confidence)}`}>
                  {rec.confidence}% confidence
                </div>
              </div>

              <div className="rounded-xl bg-navy-50/50 p-4 mb-4">
                <p className="text-sm text-navy">{rec.reasoning}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-navy-100/40 p-3">
                  <p className="text-xs font-medium text-graphite-400 mb-1">Weight Loss Velocity</p>
                  <p className="text-lg font-bold text-navy">{factors.weightLossVelocity} lbs/week</p>
                </div>
                <div className="rounded-xl border border-navy-100/40 p-3">
                  <p className="text-xs font-medium text-graphite-400 mb-1">Adherence Rate</p>
                  <p className="text-lg font-bold text-navy">{factors.adherenceRate}%</p>
                </div>
                <div className="rounded-xl border border-navy-100/40 p-3">
                  <p className="text-xs font-medium text-graphite-400 mb-1">Side Effects (30d)</p>
                  <p className="text-lg font-bold text-navy">
                    {factors.sideEffectCount}
                    {factors.severeSideEffects && (
                      <span className="ml-2 text-xs font-medium text-red-600">Severe</span>
                    )}
                  </p>
                </div>
                <div className="rounded-xl border border-navy-100/40 p-3">
                  <p className="text-xs font-medium text-graphite-400 mb-1">Data Points</p>
                  <p className="text-lg font-bold text-navy">{factors.dataPointCount}</p>
                </div>
                <div className="rounded-xl border border-navy-100/40 p-3 sm:col-span-2">
                  <p className="text-xs font-medium text-graphite-400 mb-1">Cohort Comparison</p>
                  <p className="text-sm text-navy">{factors.cohortComparison}</p>
                </div>
              </div>

              {rec.reviewedBy && (
                <div className="mt-4 pt-4 border-t border-navy-100/40">
                  <p className="text-xs text-graphite-400">
                    Reviewed by {rec.reviewedBy} on{" "}
                    {rec.reviewedAt ? new Date(rec.reviewedAt).toLocaleString() : "—"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}
