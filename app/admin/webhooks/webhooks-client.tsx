"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import { KPICard } from "@/components/admin/kpi-card";
import {
  Webhook, CheckCircle2, XCircle, Activity, Download, BarChart3,
  RotateCcw, ChevronDown, ChevronUp, AlertTriangle, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────

interface WebhookEvent {
  id: string;
  type: string;
  success: boolean;
  errorMessage: string | null;
  payload: unknown;
  processedAt: string;
}

interface DailyHealth {
  date: string;
  total: number;
  success: number;
  rate: number;
}

interface Props {
  initialEvents: WebhookEvent[];
  initialTotal: number;
  summaryStats: {
    total: number;
    successCount: number;
    failureCount: number;
  };
  eventTypes: string[];
  dailyHealth?: DailyHealth[];
  errorGroups?: { message: string; count: number }[];
}

// ── Component ───────────────────────────────────────────────

export function WebhooksClient({
  initialEvents,
  initialTotal,
  summaryStats,
  eventTypes,
  dailyHealth = [],
  errorGroups = [],
}: Props) {
  const [events, setEvents] = useState<WebhookEvent[]>(initialEvents);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [successFilter, setSuccessFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [replayingId, setReplayingId] = useState<string | null>(null);
  const [replayMessage, setReplayMessage] = useState<{ id: string; success: boolean; text: string } | null>(null);
  const limit = 50;

  const successRate =
    summaryStats.total > 0
      ? ((summaryStats.successCount / summaryStats.total) * 100).toFixed(1)
      : "0";

  // Client-side filtering
  const filtered = events.filter((e) => {
    if (successFilter === "success" && !e.success) return false;
    if (successFilter === "failure" && e.success) return false;
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !e.id.toLowerCase().includes(q) &&
        !e.type.toLowerCase().includes(q) &&
        !(e.errorMessage || "").toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  // ── CSV Export ────────────────────────────────────────────
  const handleExport = () => {
    exportToCSV(
      filtered,
      [
        { key: "id", header: "Event ID", getValue: (r) => r.id },
        { key: "type", header: "Type", getValue: (r) => r.type },
        {
          key: "success",
          header: "Success",
          getValue: (r) => (r.success ? "Yes" : "No"),
        },
        {
          key: "error",
          header: "Error",
          getValue: (r) => r.errorMessage || "",
        },
        {
          key: "processedAt",
          header: "Processed At",
          getValue: (r) => new Date(r.processedAt).toISOString(),
        },
      ],
      "webhook-events-export"
    );
  };

  // ── Replay handler ────────────────────────────────────────
  async function handleReplay(eventId: string) {
    setReplayingId(eventId);
    setReplayMessage(null);
    try {
      const res = await fetch("/api/admin/webhooks/replay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        setReplayMessage({ id: eventId, success: true, text: data.message || "Replayed successfully" });
        // Add the replayed event to the list
        if (data.replayEventId) {
          const original = events.find((e) => e.id === eventId);
          if (original) {
            setEvents((prev) => [
              {
                id: data.replayEventId,
                type: original.type,
                success: true,
                errorMessage: null,
                payload: original.payload,
                processedAt: new Date().toISOString(),
              },
              ...prev,
            ]);
          }
        }
      } else {
        setReplayMessage({ id: eventId, success: false, text: data.error || "Replay failed" });
      }
    } catch {
      setReplayMessage({ id: eventId, success: false, text: "Network error" });
    } finally {
      setReplayingId(null);
    }
  }

  // ── Column definitions ────────────────────────────────────
  const columns: ColumnDef<WebhookEvent>[] = [
    {
      key: "expand",
      header: "",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpandedRow(expandedRow === row.id ? null : row.id);
          }}
          className="p-1 rounded hover:bg-navy-50 transition-colors"
        >
          {expandedRow === row.id ? (
            <ChevronUp className="h-4 w-4 text-graphite-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-graphite-400" />
          )}
        </button>
      ),
    },
    {
      key: "id",
      header: "Event ID",
      render: (row) => (
        <span className="font-mono text-xs text-graphite-500" title={row.id}>
          {row.id.length > 24 ? `${row.id.slice(0, 24)}...` : row.id}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (row) => (
        <Badge variant="secondary" className="text-[10px] font-mono whitespace-nowrap">
          {row.type}
        </Badge>
      ),
    },
    {
      key: "success",
      header: "Status",
      sortable: true,
      render: (row) =>
        row.success ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">
              Success
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium text-red-600">Failed</span>
          </div>
        ),
    },
    {
      key: "errorMessage",
      header: "Error",
      className: "max-w-xs",
      render: (row) =>
        row.errorMessage ? (
          <p className="text-xs text-red-500 line-clamp-2">
            {row.errorMessage}
          </p>
        ) : (
          <span className="text-xs text-graphite-300">--</span>
        ),
    },
    {
      key: "processedAt",
      header: "Processed At",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-xs text-graphite-500">
            {new Date(row.processedAt).toLocaleDateString()}
          </p>
          <p className="text-[10px] text-graphite-300">
            {new Date(row.processedAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) =>
        !row.success ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-xs"
              disabled={replayingId === row.id || !row.payload}
              onClick={(e) => {
                e.stopPropagation();
                handleReplay(row.id);
              }}
            >
              {replayingId === row.id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RotateCcw className="h-3 w-3" />
              )}
              Replay
            </Button>
            {replayMessage?.id === row.id && (
              <span
                className={cn(
                  "text-[10px] font-medium",
                  replayMessage.success ? "text-emerald-600" : "text-red-600"
                )}
              >
                {replayMessage.text}
              </span>
            )}
          </div>
        ) : null,
    },
  ];

  // ── Filter configs ────────────────────────────────────────
  const filters = [
    {
      key: "success",
      label: "Status",
      options: [
        { label: "All", value: "all" },
        { label: "Success", value: "success" },
        { label: "Failed", value: "failure" },
      ],
    },
    {
      key: "type",
      label: "Event Type",
      options: [
        { label: "All Types", value: "all" },
        ...eventTypes.map((t) => ({ label: t, value: t })),
      ],
    },
  ];

  // Compute error groups from client data if not provided by server
  const computedErrorGroups =
    errorGroups.length > 0
      ? errorGroups
      : (() => {
          const groups: Record<string, number> = {};
          events.forEach((e) => {
            if (!e.success && e.errorMessage) {
              const key = e.errorMessage.slice(0, 80);
              groups[key] = (groups[key] || 0) + 1;
            }
          });
          return Object.entries(groups)
            .map(([message, count]) => ({ message, count }))
            .sort((a, b) => b.count - a.count);
        })();

  // Compute daily health from client data if not provided by server
  const computedDailyHealth =
    dailyHealth.length > 0
      ? dailyHealth
      : (() => {
          const days: Record<string, { total: number; success: number }> = {};
          events.forEach((e) => {
            const d = new Date(e.processedAt).toISOString().slice(0, 10);
            if (!days[d]) days[d] = { total: 0, success: 0 };
            days[d].total++;
            if (e.success) days[d].success++;
          });
          return Object.entries(days)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-7)
            .map(([date, stats]) => ({
              date,
              total: stats.total,
              success: stats.success,
              rate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0,
            }));
        })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Webhook Events</h2>
          <p className="text-sm text-graphite-400">
            Monitor incoming webhook deliveries and processing status
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Events"
          value={String(summaryStats.total)}
          icon={Webhook}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Successful"
          value={String(summaryStats.successCount)}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Failures"
          value={String(summaryStats.failureCount)}
          icon={XCircle}
          iconColor="text-red-500"
          iconBg="bg-red-50"
        />
        <KPICard
          title="Success Rate"
          value={`${successRate}%`}
          icon={BarChart3}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
      </div>

      {/* Success rate bar */}
      {summaryStats.total > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal" />
                <span className="text-sm font-medium text-navy">
                  Processing Health
                </span>
              </div>
              <span className="text-sm font-bold text-navy">
                {successRate}% success rate
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-navy-50 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all ${
                  parseFloat(successRate) >= 95
                    ? "bg-emerald-500"
                    : parseFloat(successRate) >= 80
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{
                  width: `${successRate}%`,
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-graphite-300">
              <span>
                {summaryStats.successCount} processed successfully
              </span>
              <span>{summaryStats.failureCount} failed</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhook Health Over Time (7-day bar chart) */}
      {computedDailyHealth.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-navy" />
              <span className="text-sm font-medium text-navy">
                7-Day Success Rate
              </span>
            </div>
            <div className="flex items-end gap-2 h-24">
              {computedDailyHealth.map((day) => {
                const barHeight = Math.max(day.rate * 0.9, 4);
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-semibold text-graphite-500">
                      {day.rate.toFixed(0)}%
                    </span>
                    <div className="w-full flex flex-col justify-end h-16">
                      <div
                        className={cn(
                          "w-full rounded-t transition-all",
                          day.rate >= 95
                            ? "bg-emerald-400"
                            : day.rate >= 80
                              ? "bg-amber-400"
                              : "bg-red-400"
                        )}
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-graphite-300">
                      {new Date(day.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Categorization */}
      {computedErrorGroups.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-navy">
                Error Categories
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                      Error Message
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                      % of Failures
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {computedErrorGroups.slice(0, 10).map((group, i) => (
                    <tr key={i} className="hover:bg-linen/20">
                      <td className="px-3 py-2">
                        <p className="text-xs text-red-600 font-mono line-clamp-1">
                          {group.message}
                        </p>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="text-xs font-semibold text-navy">
                          {group.count}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="text-xs text-graphite-500">
                          {summaryStats.failureCount > 0
                            ? (
                                (group.count / summaryStats.failureCount) *
                                100
                              ).toFixed(1)
                            : "0"}
                          %
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DataTable with expandable rows */}
      <DataTable
        data={filtered}
        columns={columns}
        total={filtered.length}
        page={page}
        limit={limit}
        search={search}
        onPageChange={setPage}
        onSearchChange={(s) => {
          setSearch(s);
          setPage(1);
        }}
        searchPlaceholder="Search by event ID, type, or error..."
        filters={filters}
        activeFilters={{ success: successFilter, type: typeFilter }}
        onFilterChange={(key, value) => {
          if (key === "success") setSuccessFilter(value);
          if (key === "type") setTypeFilter(value);
          setPage(1);
        }}
        onExportCSV={handleExport}
        getRowId={(r) => r.id}
        emptyMessage="No webhook events found"
      />

      {/* Expanded Payload Viewer */}
      {expandedRow && (
        <Card className="border-navy-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Webhook className="h-4 w-4 text-navy" />
                <span className="text-sm font-medium text-navy">
                  Payload for{" "}
                  <code className="font-mono text-xs bg-navy-50 px-1 rounded">
                    {expandedRow.length > 30
                      ? `${expandedRow.slice(0, 30)}...`
                      : expandedRow}
                  </code>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedRow(null)}
              >
                Close
              </Button>
            </div>
            {(() => {
              const event = events.find((e) => e.id === expandedRow);
              if (!event) return <p className="text-xs text-graphite-300">Event not found</p>;
              if (!event.payload)
                return (
                  <p className="text-xs text-graphite-300">
                    No payload stored for this event
                  </p>
                );
              return (
                <pre className="mt-2 max-h-80 overflow-auto rounded-lg border border-navy-100 bg-navy-50/50 p-4 font-mono text-xs text-graphite-600 leading-relaxed">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
