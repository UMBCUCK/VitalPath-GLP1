"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShieldCheck,
  FileText,
  Scale,
  KeyRound,
  UserCheck,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";

// ── Types ──────────────────────────────────────────────────────

interface Breakdown {
  contentScore: number;
  claimsScore: number;
  consentScore: number;
  credentialScore: number;
}

interface TimelinePoint {
  date: string;
  score: number;
}

interface ComplianceIssue {
  type: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  entityId: string;
  entityType: string;
  actionRequired: string;
}

interface ChecklistItem {
  item: string;
  status: "PASS" | "FAIL" | "WARNING";
  details: string;
  category: "FDA" | "FTC";
}

interface Props {
  overallScore: number;
  breakdown: Breakdown;
  timeline: TimelinePoint[];
  issues: ComplianceIssue[];
  checklist: ChecklistItem[];
}

const SEVERITY_COLORS: Record<string, string> = {
  HIGH: "bg-red-100 text-red-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  LOW: "bg-blue-100 text-blue-800",
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

function scoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function scoreStroke(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#d97706";
  return "#dc2626";
}

export function ComplianceDashboardClient({
  overallScore,
  breakdown,
  timeline,
  issues,
  checklist,
}: Props) {
  const router = useRouter();
  const [recomputing, setRecomputing] = useState(false);
  const [issuePage, setIssuePage] = useState(1);

  const handleRecompute = async () => {
    setRecomputing(true);
    try {
      await fetch("/api/admin/compliance-score", { method: "POST" });
      router.refresh();
    } catch (err) {
      console.error("Failed to recompute:", err);
    } finally {
      setRecomputing(false);
    }
  };

  // ── Score gauge SVG ──────────────────────────────────────────
  const gaugeRadius = 80;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeFill = (overallScore / 100) * gaugeCircumference;

  // ── Sub-scores ───────────────────────────────────────────────
  const subScores = [
    { label: "Content", score: breakdown.contentScore, icon: FileText },
    { label: "Claims", score: breakdown.claimsScore, icon: Scale },
    { label: "Consents", score: breakdown.consentScore, icon: UserCheck },
    { label: "Credentials", score: breakdown.credentialScore, icon: KeyRound },
  ];

  // ── Issue table columns ──────────────────────────────────────
  const issueColumns: ColumnDef<ComplianceIssue>[] = [
    {
      key: "type",
      header: "Issue Type",
      sortable: true,
      render: (row) => <span className="font-medium text-navy">{row.type}</span>,
    },
    {
      key: "description",
      header: "Description",
      render: (row) => (
        <span className="text-sm text-graphite-500">{row.description}</span>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      sortable: true,
      render: (row) => (
        <Badge className={SEVERITY_COLORS[row.severity]}>{row.severity}</Badge>
      ),
    },
    {
      key: "entityType",
      header: "Entity",
      render: (row) => (
        <span className="text-xs text-graphite-400">{row.entityType}</span>
      ),
    },
    {
      key: "actionRequired",
      header: "Action Required",
      render: (row) => (
        <span className="text-sm text-navy">{row.actionRequired}</span>
      ),
    },
  ];

  const PAGE_SIZE = 10;
  const paginatedIssues = issues.slice(
    (issuePage - 1) * PAGE_SIZE,
    issuePage * PAGE_SIZE
  );

  const fdaItems = checklist.filter((c) => c.category === "FDA");
  const ftcItems = checklist.filter((c) => c.category === "FTC");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Compliance Dashboard</h1>
          <p className="text-sm text-graphite-400">
            Monitor regulatory compliance across content, claims, consents, and credentials
          </p>
        </div>
        <Button
          onClick={handleRecompute}
          disabled={recomputing}
          className="gap-2"
        >
          {recomputing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Recompute Score
        </Button>
      </div>

      {/* Overall Score Gauge + Sub-scores */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Gauge */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={gaugeRadius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                {/* Score arc */}
                <circle
                  cx="100"
                  cy="100"
                  r={gaugeRadius}
                  fill="none"
                  stroke={scoreStroke(overallScore)}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${gaugeFill} ${gaugeCircumference}`}
                  transform="rotate(-90 100 100)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${scoreColor(overallScore)}`}>
                  {Math.round(overallScore)}
                </span>
                <span className="text-xs text-graphite-400">/ 100</span>
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-navy">Overall Score</p>
          </CardContent>
        </Card>

        {/* Sub-scores */}
        {subScores.map((sub) => (
          <Card key={sub.label}>
            <CardContent className="py-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${sub.score >= 80 ? "bg-emerald-50" : sub.score >= 60 ? "bg-amber-50" : "bg-red-50"}`}>
                  <sub.icon className={`h-5 w-5 ${scoreColor(sub.score)}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    {sub.label}
                  </p>
                  <p className={`text-2xl font-bold ${scoreColor(sub.score)}`}>
                    {Math.round(sub.score)}
                  </p>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreBg(sub.score)}`}
                  style={{ width: `${Math.min(sub.score, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Score Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compliance Score Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length > 1 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={[...timeline].reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)}`, "Score"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#0d9488" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-48 items-center justify-center text-graphite-300">
              Not enough data points for trend chart. Recompute score periodically.
            </div>
          )}
        </CardContent>
      </Card>

      {/* FDA/FTC Checklist */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* FDA */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal" />
              <CardTitle className="text-lg">FDA Compliance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fdaItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-navy-100/40 p-3"
                >
                  <div className="mt-0.5">
                    {item.status === "PASS" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                    ) : item.status === "FAIL" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                        <X className="h-3.5 w-3.5 text-red-600" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">{item.item}</p>
                    <p className="text-xs text-graphite-400">{item.details}</p>
                  </div>
                  <Badge
                    className={
                      item.status === "PASS"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "FAIL"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FTC */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">FTC Compliance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ftcItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-navy-100/40 p-3"
                >
                  <div className="mt-0.5">
                    {item.status === "PASS" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                    ) : item.status === "FAIL" ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                        <X className="h-3.5 w-3.5 text-red-600" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">{item.item}</p>
                    <p className="text-xs text-graphite-400">{item.details}</p>
                  </div>
                  <Badge
                    className={
                      item.status === "PASS"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "FAIL"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                    }
                  >
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Active Issues ({issues.length})</CardTitle>
            <div className="flex gap-2 text-xs">
              <span className="text-red-600 font-medium">
                {issues.filter((i) => i.severity === "HIGH").length} High
              </span>
              <span className="text-amber-600 font-medium">
                {issues.filter((i) => i.severity === "MEDIUM").length} Medium
              </span>
              <span className="text-blue-600 font-medium">
                {issues.filter((i) => i.severity === "LOW").length} Low
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={paginatedIssues}
            columns={issueColumns}
            total={issues.length}
            page={issuePage}
            limit={PAGE_SIZE}
            onPageChange={setIssuePage}
            emptyMessage="No active compliance issues -- excellent!"
          />
        </CardContent>
      </Card>
    </div>
  );
}
