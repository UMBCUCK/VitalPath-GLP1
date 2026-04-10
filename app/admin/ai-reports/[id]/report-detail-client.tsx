"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Brain,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lightbulb,
  RefreshCw,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────

interface Suggestion {
  title: string;
  priority: string;
  impact: string;
  description: string;
}

interface ReportDetail {
  id: string;
  title: string;
  reportType: string;
  content: string;
  summary: string | null;
  suggestions: Suggestion[] | null;
  dataSnapshot: Record<string, unknown> | null;
  tokenUsage: number | null;
  generatedBy: string;
  createdAt: string;
}

interface ReportDetailClientProps {
  report: ReportDetail;
}

// ── Badge variant helpers ─────────────────────────────────────

const TYPE_BADGE_VARIANT: Record<string, "default" | "secondary" | "gold" | "success" | "warning"> = {
  FULL_ANALYTICS: "default",
  CONVERSION_OPTIMIZATION: "success",
  SALES_PERFORMANCE: "gold",
  FINANCIAL: "secondary",
  CUSTOM: "warning",
};

const PRIORITY_CONFIG: Record<string, { variant: "destructive" | "warning" | "secondary"; label: string }> = {
  HIGH: { variant: "destructive", label: "High Priority" },
  MEDIUM: { variant: "warning", label: "Medium Priority" },
  LOW: { variant: "secondary", label: "Low Priority" },
};

// ── Simple markdown renderer ──────────────────────────────────

function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="mt-6 mb-2 text-lg font-bold text-navy">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="mt-8 mb-3 text-xl font-bold text-navy border-b border-navy-100/40 pb-2">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="mt-8 mb-4 text-2xl font-bold text-navy">$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="italic">$1</strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-navy">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Unordered lists
    .replace(/^- (.*$)/gm, '<li class="ml-4 text-sm text-graphite-500 leading-relaxed">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 text-sm text-graphite-500 leading-relaxed list-decimal">$1</li>')
    // Paragraphs (lines that are not empty and not already tagged)
    .replace(/^(?!<[hlu])((?!<li).+)$/gm, '<p class="text-sm text-graphite-500 leading-relaxed mb-2">$1</p>')
    // Empty lines
    .replace(/^\s*$/gm, "");
}

// ── Component ─────────────────────────────────────────────────

export function ReportDetailClient({ report }: ReportDetailClientProps) {
  const router = useRouter();
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/admin/ai-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: report.reportType }),
      });

      if (!res.ok) throw new Error("Failed to generate report");

      const data = await res.json();
      router.push(`/admin/ai-reports/${data.report.id}`);
    } catch {
      setRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/admin/ai-reports")}
            className="mb-2 flex items-center gap-1 text-xs text-graphite-400 hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Reports
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-navy">{report.title}</h2>
            <Badge variant={TYPE_BADGE_VARIANT[report.reportType] || "secondary"}>
              {report.reportType.replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-4 text-xs text-graphite-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(report.createdAt).toLocaleString()}
            </span>
            {report.tokenUsage !== null && report.tokenUsage > 0 && (
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {report.tokenUsage.toLocaleString()} tokens used
              </span>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRegenerate}
          disabled={regenerating}
        >
          {regenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Generate Updated Report
        </Button>
      </div>

      {/* Executive Summary */}
      {report.summary && (
        <Card className="border-teal-200 bg-gradient-to-r from-teal-50/30 to-emerald-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-4 w-4 text-teal" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-graphite-500 leading-relaxed">{report.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Full content */}
      <Card>
        <CardContent className="prose-sm p-6">
          <div
            className="space-y-1"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(report.content) }}
          />
        </CardContent>
      </Card>

      {/* Suggestions */}
      {report.suggestions && report.suggestions.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-graphite-500 uppercase tracking-wider">
            <Lightbulb className="h-4 w-4 text-gold-600" />
            Actionable Suggestions ({report.suggestions.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.suggestions.map((suggestion, i) => {
              const priorityCfg = PRIORITY_CONFIG[suggestion.priority] || PRIORITY_CONFIG.MEDIUM;
              return (
                <Card key={i} className="relative overflow-hidden">
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full w-1",
                      suggestion.priority === "HIGH"
                        ? "bg-red-400"
                        : suggestion.priority === "MEDIUM"
                        ? "bg-amber-400"
                        : "bg-navy-200"
                    )}
                  />
                  <CardContent className="p-4 pl-5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-navy">{suggestion.title}</p>
                      <Badge variant={priorityCfg.variant} className="shrink-0 text-[10px]">
                        {priorityCfg.label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-graphite-500">{suggestion.description}</p>
                    {suggestion.impact && (
                      <p className="mt-2 text-[10px] text-teal font-medium">
                        Expected impact: {suggestion.impact}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Snapshot */}
      {report.dataSnapshot && (
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setShowSnapshot(!showSnapshot)}
          >
            <CardTitle className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Database className="h-4 w-4 text-graphite-400" />
                Data Snapshot (Raw Analytics Data)
              </span>
              {showSnapshot ? (
                <ChevronUp className="h-4 w-4 text-graphite-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-graphite-400" />
              )}
            </CardTitle>
          </CardHeader>
          {showSnapshot && (
            <CardContent>
              <pre className="max-h-96 overflow-auto rounded-lg bg-navy-50/50 p-4 text-xs text-graphite-500">
                {JSON.stringify(report.dataSnapshot, null, 2)}
              </pre>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
