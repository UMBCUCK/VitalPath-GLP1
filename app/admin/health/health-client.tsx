"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Database,
  CreditCard,
  Stethoscope,
  Pill,
  Mail,
  Globe,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/admin/kpi-card";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import type { LucideIcon } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

interface HealthCheckData {
  id: string;
  service: string;
  status: string;
  responseTime: number | null;
  errorMessage: string | null;
  checkedAt: string;
}

interface ErrorLogData {
  id: string;
  route: string;
  method: string;
  statusCode: number;
  message: string;
  userId: string | null;
  duration: number | null;
  createdAt: string;
}

interface ErrorStats {
  totalErrors: number;
  topErrorRoute: string;
  topErrorCount: number;
  mostCommonError: string;
  byRoute: { route: string; count: number }[];
  byStatusCode: { statusCode: number; count: number }[];
}

interface Performance {
  routes: { route: string; avgDuration: number; requestCount: number }[];
  percentiles: { p50: number; p95: number; p99: number };
  servicePerformance: {
    service: string;
    avgResponseTime: number;
    maxResponseTime: number;
    checkCount: number;
  }[];
}

interface Props {
  checks: HealthCheckData[];
  serviceHistory: Record<string, { status: string; checkedAt: string }[]>;
  errorLogs: ErrorLogData[];
  errorTotal: number;
  errorStats: ErrorStats;
  performance: Performance;
}

const SERVICE_ICONS: Record<string, LucideIcon> = {
  DATABASE: Database,
  STRIPE: CreditCard,
  OPENLOOP: Stethoscope,
  PHARMACY: Pill,
  EMAIL: Mail,
  API: Globe,
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; badge: string; icon: LucideIcon }> = {
  HEALTHY: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-800",
    icon: CheckCircle2,
  },
  DEGRADED: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-800",
    icon: AlertTriangle,
  },
  DOWN: {
    color: "text-red-600",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
};

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-blue-100 text-blue-800",
  POST: "bg-emerald-100 text-emerald-800",
  PUT: "bg-amber-100 text-amber-800",
  DELETE: "bg-red-100 text-red-800",
  PATCH: "bg-purple-100 text-purple-800",
};

function statusCodeColor(code: number): string {
  if (code < 300) return "bg-emerald-100 text-emerald-800";
  if (code < 400) return "bg-blue-100 text-blue-800";
  if (code < 500) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function HealthClient({
  checks,
  serviceHistory,
  errorLogs,
  errorTotal,
  errorStats,
  performance,
}: Props) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [perfTab, setPerfTab] = useState<"routes" | "services">("routes");

  const handleRunChecks = async () => {
    setRunning(true);
    try {
      await fetch("/api/admin/health", { method: "POST" });
      router.refresh();
    } catch (err) {
      console.error("Failed to run checks:", err);
    } finally {
      setRunning(false);
    }
  };

  // ── Error log columns ────────────────────────────────────────
  const errorColumns: ColumnDef<ErrorLogData>[] = [
    {
      key: "createdAt",
      header: "Time",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-graphite-400">{timeAgo(row.createdAt)}</span>
      ),
    },
    {
      key: "route",
      header: "Route",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-navy">{row.route}</span>
      ),
    },
    {
      key: "method",
      header: "Method",
      render: (row) => (
        <Badge className={METHOD_COLORS[row.method] ?? "bg-gray-100 text-gray-600"}>
          {row.method}
        </Badge>
      ),
    },
    {
      key: "statusCode",
      header: "Status",
      sortable: true,
      render: (row) => (
        <Badge className={statusCodeColor(row.statusCode)}>
          {row.statusCode}
        </Badge>
      ),
    },
    {
      key: "message",
      header: "Message",
      render: (row) => (
        <span className="text-sm text-graphite-500">
          {row.message.length > 60 ? row.message.slice(0, 60) + "..." : row.message}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.duration !== null ? `${row.duration}ms` : "-"}
        </span>
      ),
    },
    {
      key: "userId",
      header: "User",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.userId ? row.userId.slice(0, 8) + "..." : "-"}
        </span>
      ),
    },
  ];

  // ── Donut chart for error status codes ───────────────────────
  const DONUT_COLORS = ["#d97706", "#dc2626", "#0284c7", "#059669"];
  const statusCodeData = errorStats.byStatusCode.map((s) => ({
    name: `${s.statusCode}`,
    value: s.count,
  }));

  // ── Compute error rate (rough approximation) ─────────────────
  const totalRequests = errorStats.totalErrors + (performance.routes.reduce((s, r) => s + r.requestCount, 0) || 1);
  const errorRate = totalRequests > 0 ? ((errorStats.totalErrors / totalRequests) * 100).toFixed(2) : "0";

  const PAGE_SIZE = 10;
  const paginatedLogs = errorLogs.slice(
    (logPage - 1) * PAGE_SIZE,
    logPage * PAGE_SIZE
  );

  // ── Uptime history bars ──────────────────────────────────────
  const SERVICES = ["API", "DATABASE", "STRIPE", "OPENLOOP", "PHARMACY", "EMAIL"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Platform Health</h1>
          <p className="text-sm text-graphite-400">
            Monitor service status, errors, and performance
          </p>
        </div>
        <Button onClick={handleRunChecks} disabled={running} className="gap-2">
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Run Checks
        </Button>
      </div>

      {/* Service Status Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          const check = checks.find((c) => c.service === service);
          const status = check?.status ?? "DOWN";
          const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.DOWN;
          const Icon = SERVICE_ICONS[service] ?? Globe;
          const StatusIcon = config.icon;

          return (
            <Card key={service} className="relative overflow-hidden">
              {status === "DOWN" && (
                <div className="absolute inset-0 animate-pulse bg-red-50/30 pointer-events-none" />
              )}
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bg}`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{service}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <StatusIcon className={`h-3.5 w-3.5 ${config.color}`} />
                        <Badge className={config.badge}>{status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {check?.responseTime !== null && check?.responseTime !== undefined && (
                      <div className="flex items-center gap-1 text-xs text-graphite-400">
                        <Clock className="h-3 w-3" />
                        <span>{check.responseTime}ms</span>
                      </div>
                    )}
                    {check?.checkedAt && (
                      <p className="mt-1 text-[10px] text-graphite-300">
                        {timeAgo(check.checkedAt)}
                      </p>
                    )}
                  </div>
                </div>
                {check?.errorMessage && (
                  <p className="mt-2 text-xs text-red-500 truncate">
                    {check.errorMessage}
                  </p>
                )}

                {/* Mini uptime bar */}
                <div className="mt-3 flex gap-0.5">
                  {(serviceHistory[service] ?? []).slice(0, 24).map((h, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-sm ${
                        h.status === "HEALTHY"
                          ? "bg-emerald-400"
                          : h.status === "DEGRADED"
                            ? "bg-amber-400"
                            : "bg-red-400"
                      }`}
                      title={`${h.status} at ${new Date(h.checkedAt).toLocaleTimeString()}`}
                    />
                  ))}
                  {(!serviceHistory[service] || serviceHistory[service].length === 0) && (
                    <div className="flex-1 text-center text-[10px] text-graphite-300">
                      No history
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error Dashboard KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Errors (24h)"
          value={errorStats.totalErrors.toLocaleString()}
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <KPICard
          title="Error Rate"
          value={`${errorRate}%`}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Top Error Route"
          value={
            errorStats.topErrorRoute.length > 20
              ? errorStats.topErrorRoute.slice(0, 20) + "..."
              : errorStats.topErrorRoute
          }
          icon={Globe}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Most Common Error"
          value={
            errorStats.mostCommonError.length > 25
              ? errorStats.mostCommonError.slice(0, 25) + "..."
              : errorStats.mostCommonError
          }
          icon={AlertCircle}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Errors by Status Code + Error Logs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Donut */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Errors by Status Code</CardTitle>
          </CardHeader>
          <CardContent>
            {statusCodeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusCodeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusCodeData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-48 items-center justify-center text-graphite-300">
                No errors recorded
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Log Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Error Log</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={paginatedLogs}
              columns={errorColumns}
              total={errorTotal}
              page={logPage}
              limit={PAGE_SIZE}
              onPageChange={setLogPage}
              emptyMessage="No errors recorded -- great!"
            />
          </CardContent>
        </Card>
      </div>

      {/* Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Performance</CardTitle>
            <div className="flex gap-1">
              <button
                onClick={() => setPerfTab("routes")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  perfTab === "routes"
                    ? "bg-teal text-white"
                    : "bg-linen/50 text-graphite-500 hover:bg-navy-50"
                }`}
              >
                Routes
              </button>
              <button
                onClick={() => setPerfTab("services")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  perfTab === "services"
                    ? "bg-teal text-white"
                    : "bg-linen/50 text-graphite-500 hover:bg-navy-50"
                }`}
              >
                Services
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Percentile summary */}
          <div className="mb-4 flex gap-6">
            <div>
              <span className="text-xs text-graphite-400">p50</span>
              <p className="text-lg font-bold text-navy">{performance.percentiles.p50 ?? 0}ms</p>
            </div>
            <div>
              <span className="text-xs text-graphite-400">p95</span>
              <p className="text-lg font-bold text-amber-600">{performance.percentiles.p95 ?? 0}ms</p>
            </div>
            <div>
              <span className="text-xs text-graphite-400">p99</span>
              <p className="text-lg font-bold text-red-600">{performance.percentiles.p99 ?? 0}ms</p>
            </div>
          </div>

          {perfTab === "routes" ? (
            <div className="overflow-x-auto rounded-xl border border-navy-100/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase">Route</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase">Avg Duration</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase">Requests</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {performance.routes.length > 0 ? (
                    performance.routes.map((r) => (
                      <tr key={r.route} className="hover:bg-linen/20">
                        <td className="px-4 py-3 font-mono text-xs text-navy">{r.route}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-medium ${
                              r.avgDuration > 1000 ? "text-red-600" : r.avgDuration > 500 ? "text-amber-600" : "text-emerald-600"
                            }`}
                          >
                            {r.avgDuration}ms
                          </span>
                        </td>
                        <td className="px-4 py-3 text-graphite-500">{r.requestCount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-graphite-300">
                        No performance data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-navy-100/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase">Avg Response</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase">Max Response</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase">Checks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {performance.servicePerformance.length > 0 ? (
                    performance.servicePerformance.map((s) => (
                      <tr key={s.service} className="hover:bg-linen/20">
                        <td className="px-4 py-3 font-medium text-navy">{s.service}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-sm font-medium ${
                              s.avgResponseTime > 3000 ? "text-red-600" : s.avgResponseTime > 1000 ? "text-amber-600" : "text-emerald-600"
                            }`}
                          >
                            {s.avgResponseTime}ms
                          </span>
                        </td>
                        <td className="px-4 py-3 text-graphite-500">{s.maxResponseTime}ms</td>
                        <td className="px-4 py-3 text-graphite-500">{s.checkCount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-graphite-300">
                        No service performance data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
