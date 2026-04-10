"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/utils";
import {
  FileText,
  BarChart3,
  ShieldCheck,
  Gauge,
  Loader2,
  Plus,
  Calendar,
  Clock,
  Mail,
  X,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Webhook,
  MapPin,
  AlertTriangle,
  ClipboardCheck,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────

interface ReportTemplate {
  key: string;
  name: string;
  description: string;
  sections: string[];
}

interface ReportSection {
  key: string;
  title: string;
  type: string;
  data: Record<string, unknown>;
}

interface GeneratedReport {
  templateKey: string;
  templateName: string;
  generatedAt: string;
  sections: ReportSection[];
}

interface ReportScheduleRow {
  id: string;
  name: string;
  templateKey: string;
  frequency: string;
  recipients: string[];
  config: Record<string, unknown> | null;
  isActive: boolean;
  lastSentAt: string | null;
  nextSendAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  templates: ReportTemplate[];
  schedules: ReportScheduleRow[];
  total: number;
  page: number;
  limit: number;
}

// ── Constants ────────────────────────────────────────────────

const TEMPLATE_ICONS: Record<string, typeof FileText> = {
  MONTHLY_BOARD: BarChart3,
  WEEKLY_OPS: Gauge,
  COMPLIANCE_AUDIT: ShieldCheck,
};

const TEMPLATE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  MONTHLY_BOARD: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  WEEKLY_OPS: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  COMPLIANCE_AUDIT: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
};

const FREQUENCY_BADGE: Record<string, "default" | "secondary" | "gold"> = {
  DAILY: "gold",
  WEEKLY: "default",
  MONTHLY: "secondary",
};

const SECTION_ICONS: Record<string, typeof FileText> = {
  revenue_summary: TrendingUp,
  subscription_health: CreditCard,
  patient_growth: Users,
  churn_analysis: TrendingDown,
  intake_queue: ClipboardCheck,
  payment_health: CreditCard,
  webhook_status: Webhook,
  provider_coverage: MapPin,
  claims_status: ShieldCheck,
  adverse_events: AlertTriangle,
  consent_records: ClipboardCheck,
  provider_credentials: Stethoscope,
};

// ── Section label formatter ──────────────────────────────────

function sectionLabel(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Component ────────────────────────────────────────────────

export function ReportsClient({ templates, schedules, total, page, limit }: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Schedule form state
  const [schedName, setSchedName] = useState("");
  const [schedTemplate, setSchedTemplate] = useState(templates[0]?.key || "");
  const [schedFrequency, setSchedFrequency] = useState("WEEKLY");
  const [schedRecipients, setSchedRecipients] = useState("");
  const [schedActive, setSchedActive] = useState(true);

  // ── Handlers ─────────────────────────────────────────────

  const handlePageChange = useCallback(
    (newPage: number) => {
      router.push(`/admin/reports?page=${newPage}`);
    },
    [router]
  );

  const handleGenerate = async (templateKey: string) => {
    setGenerating(templateKey);
    setGeneratedReport(null);
    try {
      const res = await fetch("/api/admin/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateKey }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedReport(data.report);
      }
    } finally {
      setGenerating(null);
    }
  };

  const handleCreateSchedule = async () => {
    if (!schedName.trim() || !schedRecipients.trim()) return;
    setLoading(true);
    try {
      const recipients = schedRecipients
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: schedName,
          templateKey: schedTemplate,
          frequency: schedFrequency,
          recipients,
        }),
      });
      if (res.ok) {
        setShowScheduleForm(false);
        setSchedName("");
        setSchedRecipients("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSchedule = async (schedule: ReportScheduleRow) => {
    await fetch("/api/admin/reports", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: schedule.id, isActive: !schedule.isActive }),
    });
    router.refresh();
  };

  const handleDeleteSchedule = async (id: string) => {
    await fetch(`/api/admin/reports?id=${id}`, { method: "DELETE" });
    router.refresh();
  };

  // ── Schedule table columns ───────────────────────────────

  const scheduleColumns: ColumnDef<ReportScheduleRow>[] = [
    {
      key: "name",
      header: "Schedule",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-navy">{row.name}</p>
          <p className="text-[10px] text-graphite-400">
            {templates.find((t) => t.key === row.templateKey)?.name || row.templateKey}
          </p>
        </div>
      ),
    },
    {
      key: "templateKey",
      header: "Template",
      render: (row) => {
        const Icon = TEMPLATE_ICONS[row.templateKey] || FileText;
        return (
          <div className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5 text-graphite-400" />
            <span className="text-xs">{row.templateKey.replace(/_/g, " ")}</span>
          </div>
        );
      },
    },
    {
      key: "frequency",
      header: "Frequency",
      render: (row) => (
        <Badge variant={FREQUENCY_BADGE[row.frequency] || "outline"}>
          {row.frequency}
        </Badge>
      ),
    },
    {
      key: "recipients",
      header: "Recipients",
      render: (row) => {
        const recipients = row.recipients as string[];
        return (
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-graphite-300" />
            <span className="text-xs text-graphite-500">{recipients.length}</span>
          </div>
        );
      },
    },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleSchedule(row);
          }}
          className="cursor-pointer"
        >
          <Badge variant={row.isActive ? "success" : "outline"}>
            {row.isActive ? "Active" : "Paused"}
          </Badge>
        </button>
      ),
    },
    {
      key: "lastSentAt",
      header: "Last Sent",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.lastSentAt
            ? new Date(row.lastSentAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "Never"}
        </span>
      ),
    },
    {
      key: "nextSendAt",
      header: "Next Send",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.nextSendAt
            ? new Date(row.nextSendAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "--"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[60px]",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteSchedule(row.id);
          }}
          className="h-7 px-2"
          title="Delete schedule"
        >
          <X className="h-3.5 w-3.5 text-red-400" />
        </Button>
      ),
    },
  ];

  // ── KPI value renderer ───────────────────────────────────

  const renderKPIValue = (key: string, value: unknown): string => {
    if (typeof value === "number") {
      // Detect cents-based values
      if (key.toLowerCase().includes("mrr") || key.toLowerCase().includes("revenue")) {
        return formatPrice(value);
      }
      // Detect rate/percentage values
      if (key.toLowerCase().includes("rate")) {
        return `${value}%`;
      }
      return value.toLocaleString();
    }
    if (Array.isArray(value)) return `${value.length} items`;
    if (typeof value === "object" && value !== null) return JSON.stringify(value);
    return String(value ?? "--");
  };

  const renderKPILabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Reports</h1>
          <p className="mt-1 text-sm text-graphite-400">
            Generate on-demand reports or schedule automated delivery
          </p>
        </div>
      </div>

      {/* Template Gallery */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-graphite-500 uppercase tracking-wider">
          Report Templates
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const Icon = TEMPLATE_ICONS[template.key] || FileText;
            const colors = TEMPLATE_COLORS[template.key] || {
              bg: "bg-navy-50",
              text: "text-navy-700",
              border: "border-navy-200",
            };
            const isGenerating = generating === template.key;

            return (
              <Card
                key={template.key}
                className={cn("relative overflow-hidden border", colors.border)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colors.bg)}>
                      <Icon className={cn("h-5 w-5", colors.text)} />
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-base text-navy">
                    {template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-graphite-400 leading-relaxed">
                    {template.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.sections.map((s) => (
                      <Badge key={s} variant="outline" className="text-[9px] px-1.5 py-0.5">
                        {sectionLabel(s)}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleGenerate(template.key)}
                      disabled={isGenerating}
                      className="gap-1.5"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Download className="h-3.5 w-3.5" />
                      )}
                      Generate Now
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSchedTemplate(template.key);
                        setShowScheduleForm(true);
                      }}
                      className="gap-1.5"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Generated Report Display */}
      {generatedReport && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy">
              {generatedReport.templateName}
            </h2>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-graphite-300" />
              <span className="text-xs text-graphite-400">
                Generated{" "}
                {new Date(generatedReport.generatedAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGeneratedReport(null)}
                className="h-7 px-2"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {generatedReport.sections.map((section) => {
              const Icon = SECTION_ICONS[section.key] || FileText;
              const entries = Object.entries(section.data).filter(
                ([, v]) => !Array.isArray(v) && typeof v !== "object"
              );
              const arrayEntries = Object.entries(section.data).filter(
                ([, v]) => Array.isArray(v)
              );
              const objectEntries = Object.entries(section.data).filter(
                ([, v]) => typeof v === "object" && v !== null && !Array.isArray(v)
              );

              return (
                <Card key={section.key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4 text-teal" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* KPI metrics */}
                    {entries.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {entries.map(([key, value]) => (
                          <div key={key} className="rounded-lg bg-linen/30 p-2.5">
                            <p className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider">
                              {renderKPILabel(key)}
                            </p>
                            <p className="mt-0.5 text-lg font-bold text-navy">
                              {renderKPIValue(key, value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Array data (e.g., topPlans, uncoveredStates) */}
                    {arrayEntries.map(([key, value]) => {
                      const arr = value as unknown[];
                      if (arr.length === 0) return null;
                      return (
                        <div key={key} className="mt-3">
                          <p className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider mb-1">
                            {renderKPILabel(key)}
                          </p>
                          <div className="space-y-1">
                            {arr.slice(0, 5).map((item, i) => {
                              if (typeof item === "string") {
                                return (
                                  <Badge key={i} variant="outline" className="mr-1 text-[10px]">
                                    {item}
                                  </Badge>
                                );
                              }
                              if (typeof item === "object" && item !== null) {
                                const obj = item as Record<string, unknown>;
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between rounded bg-navy-50/30 px-2 py-1 text-xs"
                                  >
                                    <span className="text-navy">
                                      {String(obj.name || obj.label || `Item ${i + 1}`)}
                                    </span>
                                    <span className="font-mono text-graphite-500">
                                      {typeof obj.value === "number"
                                        ? formatPrice(obj.value)
                                        : String(obj.value ?? "")}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Nested object data (e.g., byType) */}
                    {objectEntries.map(([key, value]) => {
                      const obj = value as Record<string, unknown>;
                      return (
                        <div key={key} className="mt-3">
                          <p className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider mb-1">
                            {renderKPILabel(key)}
                          </p>
                          <div className="space-y-1">
                            {Object.entries(obj).map(([k, v]) => (
                              <div
                                key={k}
                                className="flex items-center justify-between rounded bg-navy-50/30 px-2 py-1 text-xs"
                              >
                                <span className="text-navy">{renderKPILabel(k)}</span>
                                <span className="font-mono text-graphite-500">
                                  {String(v)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Schedule Form */}
      {showScheduleForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-teal" />
              Schedule Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                  Schedule Name
                </label>
                <Input
                  value={schedName}
                  onChange={(e) => setSchedName(e.target.value)}
                  placeholder="e.g., Weekly Ops for Leadership"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                  Template
                </label>
                <select
                  value={schedTemplate}
                  onChange={(e) => setSchedTemplate(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-navy-200 bg-white px-3 text-sm text-navy"
                >
                  {templates.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                  Frequency
                </label>
                <div className="mt-2 flex gap-2">
                  {["DAILY", "WEEKLY", "MONTHLY"].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setSchedFrequency(freq)}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                        schedFrequency === freq
                          ? "border-teal bg-teal-50 text-teal-800"
                          : "border-navy-100 text-graphite-500 hover:bg-navy-50/30"
                      )}
                    >
                      {freq.charAt(0) + freq.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500 uppercase tracking-wider">
                  Recipients (comma-separated emails)
                </label>
                <Input
                  value={schedRecipients}
                  onChange={(e) => setSchedRecipients(e.target.value)}
                  placeholder="admin@naturesjourneyhealth.com, cto@naturesjourneyhealth.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-graphite-500">
                <input
                  type="checkbox"
                  checked={schedActive}
                  onChange={(e) => setSchedActive(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-200 text-teal accent-teal"
                />
                Active immediately
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={handleCreateSchedule}
                disabled={loading || !schedName.trim() || !schedRecipients.trim()}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Calendar className="mr-2 h-4 w-4" />
                )}
                Create Schedule
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowScheduleForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Reports Table */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-graphite-500 uppercase tracking-wider">
            Scheduled Reports
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowScheduleForm(true)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            New Schedule
          </Button>
        </div>
        <DataTable
          data={schedules}
          columns={scheduleColumns}
          total={total}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          getRowId={(row) => row.id}
          emptyMessage="No scheduled reports yet. Create one from a template above."
        />
      </div>
    </div>
  );
}
