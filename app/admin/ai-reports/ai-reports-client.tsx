"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  DollarSign,
  BarChart3,
  Sparkles,
  FileText,
  Loader2,
  Clock,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────

interface ReportSummary {
  id: string;
  title: string;
  reportType: string;
  summary: string | null;
  tokenUsage: number | null;
  generatedBy: string;
  createdAt: string;
}

interface AIReportsClientProps {
  reports: ReportSummary[];
  total: number;
  page: number;
  limit: number;
}

// ── Report type config ────────────────────────────────────────

const REPORT_TYPES = [
  {
    key: "FULL_ANALYTICS",
    label: "Full Analytics",
    description: "Comprehensive analysis of all metrics including revenue, subscriptions, funnel, churn, and operations.",
    icon: BarChart3,
    color: "text-teal",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
  {
    key: "CONVERSION_OPTIMIZATION",
    label: "Conversion Optimization",
    description: "Deep dive into your conversion funnel with bottleneck identification and optimization strategies.",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    key: "SALES_PERFORMANCE",
    label: "Sales Performance",
    description: "Revenue metrics, MRR waterfall, cohort LTV, and growth trajectory analysis.",
    icon: DollarSign,
    color: "text-gold-600",
    bg: "bg-gold-50",
    border: "border-gold-200",
  },
  {
    key: "FINANCIAL",
    label: "Financial Review",
    description: "Financial health assessment with MRR trends, churn impact, and revenue projections.",
    icon: FileText,
    color: "text-navy",
    bg: "bg-navy-50",
    border: "border-navy-200",
  },
  {
    key: "CUSTOM",
    label: "Custom",
    description: "Balanced analysis highlighting the most notable findings and areas needing immediate attention.",
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
];

const TYPE_BADGE_VARIANT: Record<string, "default" | "secondary" | "gold" | "success" | "warning"> = {
  FULL_ANALYTICS: "default",
  CONVERSION_OPTIMIZATION: "success",
  SALES_PERFORMANCE: "gold",
  FINANCIAL: "secondary",
  CUSTOM: "warning",
};

// ── Component ─────────────────────────────────────────────────

export function AIReportsClient({ reports, total, page, limit }: AIReportsClientProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedType) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/ai-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: selectedType }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate report");
      }

      const data = await res.json();
      router.push(`/admin/ai-reports/${data.report.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate report");
      setGenerating(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-navy">
            <Brain className="h-6 w-6 text-teal" />
            AI Analytics Reports
          </h2>
          <p className="text-sm text-graphite-400">
            AI-powered analysis of your platform metrics with actionable recommendations
          </p>
        </div>
      </div>

      {/* Generating overlay */}
      {generating && (
        <Card className="border-teal-200 bg-gradient-to-r from-teal-50/50 to-emerald-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-teal" />
              <Brain className="absolute inset-0 m-auto h-5 w-5 text-teal" />
            </div>
            <p className="mt-4 text-lg font-semibold text-navy">Analyzing your data...</p>
            <p className="mt-1 text-sm text-graphite-400">
              Gathering analytics from 8 data sources and generating insights. This may take 15-30 seconds.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Report type selector */}
      {!generating && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-graphite-500 uppercase tracking-wider">
            Generate New Report
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {REPORT_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.key;
              return (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(isSelected ? null : type.key)}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all",
                    isSelected
                      ? `${type.border} ${type.bg} ring-2 ring-offset-1 ring-teal-300`
                      : "border-navy-100/40 bg-white hover:border-navy-200 hover:shadow-sm"
                  )}
                >
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", type.bg)}>
                    <Icon className={cn("h-5 w-5", type.color)} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-navy">{type.label}</p>
                  <p className="mt-1 text-xs text-graphite-400 line-clamp-2">{type.description}</p>
                </button>
              );
            })}
          </div>
          {selectedType && (
            <div className="mt-4">
              <Button onClick={handleGenerate} disabled={generating}>
                <Zap className="mr-2 h-4 w-4" />
                Generate {REPORT_TYPES.find((t) => t.key === selectedType)?.label} Report
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Report history */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-graphite-500 uppercase tracking-wider">
          Report History ({total})
        </h3>
        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Brain className="mx-auto h-10 w-10 text-graphite-200" />
              <p className="mt-3 text-sm text-graphite-400">
                No reports generated yet. Select a report type above to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => router.push(`/admin/ai-reports/${report.id}`)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                      <FileText className="h-5 w-5 text-teal" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-navy">{report.title}</p>
                        <Badge variant={TYPE_BADGE_VARIANT[report.reportType] || "secondary"}>
                          {report.reportType.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      {report.summary && (
                        <p className="mt-0.5 text-xs text-graphite-400 line-clamp-1">
                          {report.summary}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-3 text-[10px] text-graphite-300">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                        {report.tokenUsage !== null && report.tokenUsage > 0 && (
                          <span>{report.tokenUsage.toLocaleString()} tokens</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-graphite-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => router.push(`/admin/ai-reports?page=${page - 1}`)}
            >
              Previous
            </Button>
            <span className="text-xs text-graphite-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => router.push(`/admin/ai-reports?page=${page + 1}`)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
