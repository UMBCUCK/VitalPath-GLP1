"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import { KPICard } from "@/components/admin/kpi-card";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Siren,
  HeartPulse,
  Zap,
  Eye,
  MessageSquare,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

interface TriageAlert {
  id: string;
  patientId: string;
  providerId: string | null;
  severity: string;
  triggerType: string;
  title: string;
  description: string;
  status: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  escalatedAt: string | null;
  escalatedTo: string | null;
  resolution: string | null;
  createdAt: string;
  patientName: string;
  patientEmail: string;
}

interface TriageMetrics {
  openTotal: number;
  openBySeverity: {
    EMERGENCY: number;
    CRITICAL: number;
    URGENT: number;
    ROUTINE: number;
  };
  totalResolved: number;
  totalEscalated: number;
  totalAlerts: number;
  avgResponseMinutes: number;
  escalationRate: number;
}

interface Props {
  initialAlerts: TriageAlert[];
  initialTotal: number;
  metrics: TriageMetrics;
}

// ── Helpers ────────────────────────────────────────────────────

function severityConfig(severity: string) {
  switch (severity) {
    case "EMERGENCY":
      return { variant: "destructive" as const, border: "border-red-500", bg: "bg-red-50", text: "text-red-700", icon: Siren, pulse: true };
    case "CRITICAL":
      return { variant: "destructive" as const, border: "border-red-400", bg: "bg-red-50/70", text: "text-red-600", icon: ShieldAlert, pulse: false };
    case "URGENT":
      return { variant: "warning" as const, border: "border-amber-400", bg: "bg-amber-50/70", text: "text-amber-700", icon: AlertTriangle, pulse: false };
    case "ROUTINE":
      return { variant: "secondary" as const, border: "border-blue-300", bg: "bg-blue-50/50", text: "text-blue-700", icon: Clock, pulse: false };
    default:
      return { variant: "secondary" as const, border: "border-navy-200", bg: "bg-navy-50", text: "text-navy", icon: Clock, pulse: false };
  }
}

function triggerLabel(triggerType: string): string {
  switch (triggerType) {
    case "SEVERE_SIDE_EFFECT": return "Severe Side Effect";
    case "MISSED_DOSES": return "Missed Doses";
    case "RAPID_WEIGHT_LOSS": return "Rapid Weight Loss";
    case "PSYCHIATRIC": return "Psychiatric";
    case "PATIENT_REQUEST": return "Patient Request";
    default: return triggerType;
  }
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatResponseTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return `${hours}h ${remaining}m`;
}

// ── Component ──────────────────────────────────────────────────

export function TriageClient({
  initialAlerts,
  initialTotal,
  metrics,
}: Props) {
  const [alerts, setAlerts] = useState<TriageAlert[]>(initialAlerts);
  const [total, setTotal] = useState(initialTotal);
  const [currentMetrics, setCurrentMetrics] = useState(metrics);
  const [detectLoading, setDetectLoading] = useState(false);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [resolveInput, setResolveInput] = useState<Record<string, string>>({});
  const [showResolved, setShowResolved] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 50;

  // Separate open vs resolved alerts
  const openAlerts = alerts.filter((a) =>
    ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"].includes(a.status)
  );
  const resolvedAlerts = alerts.filter((a) =>
    ["RESOLVED", "ESCALATED"].includes(a.status)
  );

  // Apply severity filter to open alerts
  const filteredOpen = openAlerts.filter((a) => {
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    return true;
  });

  async function fetchData() {
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "50",
        include: "metrics",
      });
      if (statusFilter !== "all") {
        // For "open" filter, we get all and filter client-side
      }
      const res = await fetch(`/api/admin/triage?${params}`);
      const data = await res.json();
      setAlerts(data.alerts || []);
      setTotal(data.total || 0);
      if (data.metrics) setCurrentMetrics(data.metrics);
    } catch {
      // silent
    }
  }

  async function handleAutoDetect() {
    setDetectLoading(true);
    try {
      const res = await fetch("/api/admin/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "detect" }),
      });
      const data = await res.json();
      if (data.alertsCreated > 0) {
        await fetchData();
      }
    } finally {
      setDetectLoading(false);
    }
  }

  async function handleAcknowledge(id: string) {
    try {
      await fetch("/api/admin/triage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "acknowledge", id }),
      });
      await fetchData();
    } catch {
      // silent
    }
  }

  async function handleResolve(id: string) {
    const resolution = resolveInput[id];
    if (!resolution) return;
    try {
      await fetch("/api/admin/triage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resolve", id, resolution }),
      });
      setResolveInput((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await fetchData();
    } catch {
      // silent
    }
  }

  async function handleEscalate(id: string) {
    try {
      await fetch("/api/admin/triage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "escalate",
          id,
          toProviderId: "medical-director",
          reason: "Escalated by admin for medical director review",
        }),
      });
      await fetchData();
    } catch {
      // silent
    }
  }

  // ── Resolved Table Columns ───────────────────────────────────

  const resolvedColumns: ColumnDef<TriageAlert>[] = [
    {
      key: "patientName",
      header: "Patient",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-navy">{row.patientName}</p>
          <p className="text-xs text-graphite-400">{row.patientEmail}</p>
        </div>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      render: (row) => {
        const config = severityConfig(row.severity);
        return <Badge variant={config.variant}>{row.severity}</Badge>;
      },
    },
    {
      key: "triggerType",
      header: "Trigger",
      render: (row) => (
        <span className="text-xs text-graphite-600">{triggerLabel(row.triggerType)}</span>
      ),
    },
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <p className="text-sm text-navy line-clamp-1">{row.title}</p>
      ),
    },
    {
      key: "resolution",
      header: "Resolution",
      render: (row) => (
        <p className="text-xs text-graphite-500 line-clamp-2">{row.resolution || "Escalated"}</p>
      ),
    },
    {
      key: "resolvedAt",
      header: "Resolved",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.resolvedAt ? new Date(row.resolvedAt).toLocaleDateString() : row.escalatedAt ? new Date(row.escalatedAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-red-500" />
            Provider Triage
          </h1>
          <p className="mt-1 text-sm text-graphite-400">
            Clinical alerts requiring provider attention and escalation management
          </p>
        </div>
        <Button
          onClick={handleAutoDetect}
          disabled={detectLoading}
          className="gap-2"
        >
          <Zap className="h-4 w-4" />
          {detectLoading ? "Scanning..." : "Auto-Detect"}
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Open Alerts"
          value={String(currentMetrics.openTotal)}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <div className="grid grid-cols-2 gap-2">
          <Card className="relative overflow-hidden">
            <CardContent className="p-3">
              <p className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider">Emergency</p>
              <p className={cn(
                "mt-1 text-xl font-bold text-red-600",
                currentMetrics.openBySeverity.EMERGENCY > 0 && "animate-pulse"
              )}>
                {currentMetrics.openBySeverity.EMERGENCY}
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardContent className="p-3">
              <p className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider">Critical</p>
              <p className="mt-1 text-xl font-bold text-red-500">
                {currentMetrics.openBySeverity.CRITICAL}
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardContent className="p-3">
              <p className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider">Urgent</p>
              <p className="mt-1 text-xl font-bold text-amber-600">
                {currentMetrics.openBySeverity.URGENT}
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden">
            <CardContent className="p-3">
              <p className="text-[10px] font-medium text-graphite-400 uppercase tracking-wider">Routine</p>
              <p className="mt-1 text-xl font-bold text-blue-600">
                {currentMetrics.openBySeverity.ROUTINE}
              </p>
            </CardContent>
          </Card>
        </div>
        <KPICard
          title="Avg Response Time"
          value={formatResponseTime(currentMetrics.avgResponseMinutes)}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Escalation Rate"
          value={`${currentMetrics.escalationRate}%`}
          icon={ArrowUpRight}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
      </div>

      {/* Severity Filters */}
      <div className="flex gap-2">
        {["all", "EMERGENCY", "CRITICAL", "URGENT", "ROUTINE"].map((s) => (
          <Button
            key={s}
            size="sm"
            variant={severityFilter === s ? "default" : "outline"}
            onClick={() => setSeverityFilter(s)}
            className={cn(
              "text-xs",
              s === "EMERGENCY" && severityFilter !== s && "text-red-600 border-red-200",
              s === "CRITICAL" && severityFilter !== s && "text-red-500 border-red-200",
              s === "URGENT" && severityFilter !== s && "text-amber-600 border-amber-200",
              s === "ROUTINE" && severityFilter !== s && "text-blue-600 border-blue-200",
            )}
          >
            {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filteredOpen.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-3" />
              <p className="text-sm font-medium text-navy">No open alerts</p>
              <p className="text-xs text-graphite-400 mt-1">
                All triage alerts have been addressed
              </p>
            </CardContent>
          </Card>
        )}

        {filteredOpen.map((alert) => {
          const config = severityConfig(alert.severity);
          const SeverityIcon = config.icon;

          return (
            <Card
              key={alert.id}
              className={cn(
                "border-l-4 transition-all",
                config.border,
                config.pulse && "animate-pulse"
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Alert info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      config.bg
                    )}>
                      <SeverityIcon className={cn("h-5 w-5", config.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant={config.variant} className="text-[10px]">
                          {alert.severity}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {triggerLabel(alert.triggerType)}
                        </Badge>
                        <span className="text-xs text-graphite-400">
                          {timeAgo(alert.createdAt)}
                        </span>
                      </div>
                      <h3 className={cn(
                        "text-sm font-bold",
                        alert.severity === "EMERGENCY" || alert.severity === "CRITICAL"
                          ? "text-red-700 text-base"
                          : "text-navy"
                      )}>
                        {alert.title}
                      </h3>
                      <p className="mt-1 text-xs text-graphite-500">{alert.description}</p>
                      <p className="mt-2 text-xs text-graphite-400">
                        Patient: <span className="font-medium text-navy">{alert.patientName}</span>
                        {" "}({alert.patientEmail})
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {alert.status === "OPEN" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs gap-1"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        <Eye className="h-3 w-3" /> Acknowledge
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs gap-1 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleEscalate(alert.id)}
                    >
                      <ArrowUpRight className="h-3 w-3" /> Escalate
                    </Button>
                  </div>
                </div>

                {/* Resolution input */}
                {(alert.status === "ACKNOWLEDGED" || alert.status === "OPEN") && (
                  <div className="mt-4 pt-3 border-t border-navy-100/40">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Resolution notes..."
                        value={resolveInput[alert.id] || ""}
                        onChange={(e) =>
                          setResolveInput((prev) => ({
                            ...prev,
                            [alert.id]: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-lg border border-navy-200 px-3 py-1.5 text-xs text-navy placeholder:text-graphite-300 focus:outline-none focus:ring-2 focus:ring-teal/30"
                      />
                      <Button
                        size="sm"
                        className="text-xs gap-1"
                        disabled={!resolveInput[alert.id]}
                        onClick={() => handleResolve(alert.id)}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Resolve
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resolved Section */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setShowResolved(!showResolved)}>
          <CardTitle className="text-sm font-semibold text-navy flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Resolved Alerts ({resolvedAlerts.length})
            </span>
            <span className="text-xs text-graphite-400">
              {showResolved ? "Collapse" : "Expand"}
            </span>
          </CardTitle>
        </CardHeader>
        {showResolved && (
          <CardContent className="p-0">
            <DataTable
              data={resolvedAlerts}
              columns={resolvedColumns}
              total={resolvedAlerts.length}
              page={1}
              limit={resolvedAlerts.length || 1}
              onPageChange={() => {}}
              emptyMessage="No resolved alerts"
              getRowId={(row) => row.id}
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
