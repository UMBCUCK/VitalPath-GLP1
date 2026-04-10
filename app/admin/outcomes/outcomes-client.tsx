"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/admin/kpi-card";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import {
  Award,
  TrendingDown,
  Users,
  Activity,
  Heart,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileBarChart,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface OutcomeMetrics {
  avgWeightLoss: number;
  avgWeightLossPct: number;
  patientsWithWeightLoss: number;
  totalPatients: number;
  avgHealthScore: number | null;
  avgAdherence: number | null;
  retentionRate: number;
}

interface Report {
  id: string;
  title: string;
  reportType: string;
  periodStart: string;
  periodEnd: string;
  metrics: OutcomeMetrics;
  breakdown: Record<string, OutcomeMetrics> | null;
  isPublishable: boolean;
  complianceApproved: boolean;
  approvedBy: string | null;
  generatedBy: string;
  createdAt: string;
}

interface Summary {
  avgWeightLoss: number;
  avgWeightLossPct: number;
  patientsWithWeightLoss: number;
  totalPatients: number;
  avgHealthScore: number;
  avgAdherence: number;
  retentionRate: number;
  reportDate: string | null;
}

interface Props {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  summary: Summary;
  currentType?: string;
}

// ─── Report type badge colors ────────────────────────────────

const typeBadgeStyles: Record<string, string> = {
  AGGREGATE: "bg-blue-50 text-blue-700 border-blue-200",
  PLAN: "bg-purple-50 text-purple-700 border-purple-200",
  MEDICATION: "bg-amber-50 text-amber-700 border-amber-200",
  PROVIDER: "bg-teal-50 text-teal-700 border-teal-200",
  PUBLISHABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

// ─── Component ──────────────────────────────────────────────

export function OutcomesClient({
  reports,
  total,
  page,
  limit,
  summary,
  currentType,
}: Props) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);

  // Generate report form
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("AGGREGATE");
  const [formStart, setFormStart] = useState(
    new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10)
  );
  const [formEnd, setFormEnd] = useState(new Date().toISOString().slice(0, 10));

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/outcomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: formType,
          periodStart: formStart,
          periodEnd: formEnd,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        router.refresh();
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (id: string) => {
    setApproving(id);
    try {
      const res = await fetch("/api/admin/outcomes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) router.refresh();
    } finally {
      setApproving(null);
    }
  };

  // ─── Table columns ─────────────────────────────────────────

  const columns: ColumnDef<Report>[] = [
    {
      key: "title",
      header: "Report",
      render: (row) => (
        <div>
          <p className="font-medium text-navy">{row.title}</p>
          <p className="text-xs text-graphite-400">
            {new Date(row.createdAt).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "reportType",
      header: "Type",
      render: (row) => (
        <Badge
          variant="outline"
          className={typeBadgeStyles[row.reportType] ?? ""}
        >
          {row.reportType}
        </Badge>
      ),
    },
    {
      key: "period",
      header: "Period",
      render: (row) => (
        <span className="text-sm text-graphite-500">
          {new Date(row.periodStart).toLocaleDateString()} &mdash;{" "}
          {new Date(row.periodEnd).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "weightLoss",
      header: "Avg Weight Loss",
      render: (row) => (
        <span className="font-semibold text-navy">
          {row.metrics.avgWeightLoss} lbs ({row.metrics.avgWeightLossPct}%)
        </span>
      ),
    },
    {
      key: "retention",
      header: "Retention",
      render: (row) => (
        <span className="font-semibold text-navy">{row.metrics.retentionRate}%</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.isPublishable && (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
              <Sparkles className="h-3 w-3" /> Marketing Ready
            </Badge>
          )}
          {row.complianceApproved && (
            <Badge className="bg-teal-50 text-teal-700 border-teal-200 gap-1">
              <ShieldCheck className="h-3 w-3" /> Approved
            </Badge>
          )}
          {!row.isPublishable && !row.complianceApproved && (
            <Badge variant="outline" className="text-graphite-400">
              Pending
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-2">
          {!row.complianceApproved && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(row.id);
              }}
              disabled={approving === row.id}
              className="text-xs"
            >
              {approving === row.id ? "Approving..." : "Approve"}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
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
          <h2 className="text-2xl font-bold text-navy">Patient Outcomes</h2>
          <p className="text-sm text-graphite-400">
            Generate, review, and approve outcome reports for compliance and marketing
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <FileBarChart className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Generate form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generate New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">
                  Report Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="rounded-lg border border-navy-100 px-3 py-2 text-sm"
                >
                  <option value="AGGREGATE">Aggregate</option>
                  <option value="PLAN">By Plan</option>
                  <option value="MEDICATION">By Medication</option>
                  <option value="PROVIDER">By Provider</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">
                  Period Start
                </label>
                <Input
                  type="date"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                  className="w-40"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-graphite-500">
                  Period End
                </label>
                <Input
                  type="date"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button onClick={handleGenerate} disabled={generating}>
                {generating ? "Generating..." : "Generate"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <KPICard
          title="Avg Weight Loss"
          value={`${summary.avgWeightLoss} lbs`}
          icon={TrendingDown}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Avg Loss %"
          value={`${summary.avgWeightLossPct}%`}
          icon={TrendingDown}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <KPICard
          title="Patients with Loss"
          value={String(summary.patientsWithWeightLoss)}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Retention Rate"
          value={`${summary.retentionRate}%`}
          icon={Activity}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Avg Health Score"
          value={String(summary.avgHealthScore ?? "N/A")}
          icon={Heart}
          iconColor="text-rose-500"
          iconBg="bg-rose-50"
        />
        <KPICard
          title="Avg Adherence"
          value={summary.avgAdherence ? `${summary.avgAdherence}%` : "N/A"}
          icon={Award}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Filter by type */}
      <div className="flex gap-2">
        {["ALL", "AGGREGATE", "PLAN", "MEDICATION", "PROVIDER"].map((t) => (
          <Button
            key={t}
            size="sm"
            variant={
              (t === "ALL" && !currentType) || currentType === t
                ? "default"
                : "outline"
            }
            onClick={() =>
              router.push(
                t === "ALL"
                  ? "/admin/outcomes"
                  : `/admin/outcomes?type=${t}`
              )
            }
            className="text-xs"
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Reports table */}
      <DataTable
        data={reports}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        onPageChange={(p) =>
          router.push(
            `/admin/outcomes?page=${p}${currentType ? `&type=${currentType}` : ""}`
          )
        }
        emptyMessage="No outcome reports found. Generate your first report above."
      />

      {/* Expanded detail */}
      {expandedId && (
        <ExpandedReport
          report={reports.find((r) => r.id === expandedId)!}
        />
      )}
    </div>
  );
}

// ─── Expanded report detail ──────────────────────────────────

function ExpandedReport({ report }: { report: Report }) {
  if (!report) return null;
  const m = report.metrics;

  return (
    <Card className="border-teal-200 bg-teal-50/20">
      <CardHeader>
        <CardTitle className="text-base">{report.title} — Full Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricItem label="Avg Weight Loss" value={`${m.avgWeightLoss} lbs`} />
          <MetricItem label="Avg Weight Loss %" value={`${m.avgWeightLossPct}%`} />
          <MetricItem label="Patients with Loss" value={String(m.patientsWithWeightLoss)} />
          <MetricItem label="Total Patients" value={String(m.totalPatients)} />
          <MetricItem label="Avg Health Score" value={m.avgHealthScore != null ? String(m.avgHealthScore) : "N/A"} />
          <MetricItem label="Avg Adherence" value={m.avgAdherence != null ? `${m.avgAdherence}%` : "N/A"} />
          <MetricItem label="Retention Rate" value={`${m.retentionRate}%`} />
        </div>

        {report.breakdown && Object.keys(report.breakdown).length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 text-sm font-semibold text-navy">Breakdown</h4>
            <div className="overflow-x-auto rounded-lg border border-navy-100/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-white">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-graphite-500">Group</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-graphite-500">Avg Loss (lbs)</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-graphite-500">Avg Loss %</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-graphite-500">Patients w/ Loss</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-graphite-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {Object.entries(report.breakdown).map(([group, bm]) => (
                    <tr key={group} className="hover:bg-linen/20">
                      <td className="px-4 py-2 font-medium text-navy">{group}</td>
                      <td className="px-4 py-2 text-right">{bm.avgWeightLoss}</td>
                      <td className="px-4 py-2 text-right">{bm.avgWeightLossPct}%</td>
                      <td className="px-4 py-2 text-right">{bm.patientsWithWeightLoss}</td>
                      <td className="px-4 py-2 text-right">{bm.totalPatients}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3 shadow-sm">
      <p className="text-xs text-graphite-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-navy">{value}</p>
    </div>
  );
}
