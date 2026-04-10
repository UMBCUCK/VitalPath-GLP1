"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import { KPICard } from "@/components/admin/kpi-card";
import {
  Webhook, CheckCircle2, XCircle, Activity, Download, BarChart3,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────

interface WebhookEvent {
  id: string;
  type: string;
  success: boolean;
  errorMessage: string | null;
  payload: unknown;
  processedAt: string;
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
}

// ── Component ───────────────────────────────────────────────

export function WebhooksClient({
  initialEvents,
  initialTotal,
  summaryStats,
  eventTypes,
}: Props) {
  const [events] = useState<WebhookEvent[]>(initialEvents);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [successFilter, setSuccessFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
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

  // ── Column definitions ────────────────────────────────────
  const columns: ColumnDef<WebhookEvent>[] = [
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

      {/* DataTable */}
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
    </div>
  );
}
