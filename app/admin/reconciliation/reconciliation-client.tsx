"use client";

import { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import {
  DataTable,
  type ColumnDef,
  exportToCSV,
} from "@/components/admin/data-table";
import { formatPriceDecimal } from "@/lib/utils";
import {
  Scale,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ReconciliationRecord {
  id: string;
  periodStart: string;
  periodEnd: string;
  stripeRevenue: number;
  internalRevenue: number;
  discrepancy: number;
  discrepancyPct: number;
  matchedCount: number;
  unmatchedStripe: number;
  unmatchedInternal: number;
  details: Array<{
    orderId: string;
    totalCents: number;
    status: string;
    createdAt: string;
    reason: string;
  }> | null;
  status: string;
  resolvedBy: string | null;
  resolvedAt: string | null;
  notes: string | null;
  createdAt: string;
}

interface Summary {
  totalReconciliations: number;
  pendingCount: number;
  totalDiscrepancyCents: number;
  lastRunDate: string | null;
}

interface TrendPoint {
  date: string;
  discrepancy: number;
  discrepancyPct: number;
}

interface Props {
  initialRecords: ReconciliationRecord[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
  summary: Summary;
  trendData: TrendPoint[];
}

export function ReconciliationClient({
  initialRecords,
  initialTotal,
  initialPage,
  initialLimit,
  summary,
  trendData,
}: Props) {
  const [records, setRecords] = useState(initialRecords);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [resolveNotes, setResolveNotes] = useState("");

  const fetchPage = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/reconciliation?page=${p}&limit=${limit}`
        );
        const data = await res.json();
        setRecords(data.records);
        setTotal(data.total);
        setPage(data.page);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const handleRun = async () => {
    if (!periodStart || !periodEnd) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reconciliation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodStart, periodEnd }),
      });
      if (res.ok) {
        setShowRunModal(false);
        setPeriodStart("");
        setPeriodEnd("");
        await fetchPage(1);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolveId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reconciliation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resolveId, notes: resolveNotes }),
      });
      if (res.ok) {
        setResolveId(null);
        setResolveNotes("");
        await fetchPage(page);
      }
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    if (status === "PENDING") {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>
      );
    }
    if (status === "REVIEWED") {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
          Reviewed
        </Badge>
      );
    }
    if (status === "RESOLVED") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Resolved
        </Badge>
      );
    }
    return <Badge variant="secondary">{status}</Badge>;
  };

  const columns: ColumnDef<ReconciliationRecord>[] = [
    {
      key: "period",
      header: "Period",
      sortable: true,
      render: (row) => (
        <div className="text-sm">
          <div className="font-medium text-navy">
            {new Date(row.periodStart).toLocaleDateString()} -{" "}
            {new Date(row.periodEnd).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: "stripeRevenue",
      header: "Stripe Revenue",
      sortable: true,
      render: (row) => (
        <span className="font-medium">{formatPriceDecimal(row.stripeRevenue)}</span>
      ),
    },
    {
      key: "internalRevenue",
      header: "Internal Revenue",
      sortable: true,
      render: (row) => (
        <span className="font-medium">
          {formatPriceDecimal(row.internalRevenue)}
        </span>
      ),
    },
    {
      key: "discrepancy",
      header: "Discrepancy",
      sortable: true,
      render: (row) => (
        <span
          className={
            row.discrepancy > 0
              ? "font-semibold text-red-600"
              : "text-emerald-600"
          }
        >
          {formatPriceDecimal(row.discrepancy)}
        </span>
      ),
    },
    {
      key: "discrepancyPct",
      header: "Disc. %",
      sortable: true,
      render: (row) => {
        let color = "text-emerald-600";
        if (row.discrepancyPct > 5) color = "text-red-600 font-semibold";
        else if (row.discrepancyPct > 0) color = "text-amber-600";
        return <span className={color}>{row.discrepancyPct.toFixed(2)}%</span>;
      },
    },
    {
      key: "matched",
      header: "Matched",
      render: (row) => (
        <div className="text-sm">
          <span className="text-emerald-600 font-medium">
            {row.matchedCount}
          </span>{" "}
          /{" "}
          <span className="text-red-500">{row.unmatchedInternal} unmatched</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => statusBadge(row.status),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "PENDING" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setResolveId(row.id);
              }}
              className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100 transition-colors"
            >
              Resolve
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedId(expandedId === row.id ? null : row.id);
            }}
            className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 transition-colors"
          >
            {expandedId === row.id ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      ),
    },
  ];

  const handleExport = () => {
    exportToCSV(
      records,
      [
        {
          key: "period",
          header: "Period",
          getValue: (r: ReconciliationRecord) =>
            `${new Date(r.periodStart).toLocaleDateString()} - ${new Date(r.periodEnd).toLocaleDateString()}`,
        },
        {
          key: "stripeRevenue",
          header: "Stripe Revenue",
          getValue: (r: ReconciliationRecord) => (r.stripeRevenue / 100).toFixed(2),
        },
        {
          key: "internalRevenue",
          header: "Internal Revenue",
          getValue: (r: ReconciliationRecord) => (r.internalRevenue / 100).toFixed(2),
        },
        {
          key: "discrepancy",
          header: "Discrepancy",
          getValue: (r: ReconciliationRecord) => (r.discrepancy / 100).toFixed(2),
        },
        {
          key: "discrepancyPct",
          header: "Discrepancy %",
          getValue: (r: ReconciliationRecord) => r.discrepancyPct.toFixed(2),
        },
        {
          key: "status",
          header: "Status",
          getValue: (r: ReconciliationRecord) => r.status,
        },
      ],
      "reconciliation"
    );
  };

  const expandedRecord = expandedId
    ? records.find((r) => r.id === expandedId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">
            Financial Reconciliation
          </h2>
          <p className="text-sm text-graphite-400">
            Compare Stripe payments against internal order records
          </p>
        </div>
        <button
          onClick={() => setShowRunModal(true)}
          className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy/90 transition-colors"
        >
          Run Reconciliation
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Reconciliations"
          value={String(summary.totalReconciliations)}
          icon={Scale}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Pending Review"
          value={String(summary.pendingCount)}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Total Discrepancy"
          value={formatPriceDecimal(summary.totalDiscrepancyCents)}
          icon={DollarSign}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <KPICard
          title="Last Run Date"
          value={
            summary.lastRunDate
              ? new Date(summary.lastRunDate).toLocaleDateString()
              : "Never"
          }
          icon={CalendarDays}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
      </div>

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-navy">
              Discrepancy Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                  tickFormatter={(v: number) => `$${(v / 100).toFixed(0)}`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatPriceDecimal(value),
                    "Discrepancy",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="discrepancy"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className="p-0 pt-4">
          <DataTable
            data={records}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            onPageChange={fetchPage}
            onExportCSV={handleExport}
            getRowId={(r) => r.id}
            emptyMessage="No reconciliation records found. Run your first reconciliation above."
            loading={loading}
          />

          {/* Expanded details */}
          {expandedRecord && expandedRecord.details && expandedRecord.details.length > 0 && (
            <div className="border-t border-navy-100/40 bg-linen/20 p-4">
              <h4 className="mb-2 text-sm font-semibold text-navy">
                Unmatched Transactions ({expandedRecord.details.length})
              </h4>
              <div className="overflow-x-auto rounded-lg border border-navy-100/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/40 bg-white">
                      <th className="px-3 py-2 text-left text-xs font-medium text-graphite-400">
                        Order ID
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-graphite-400">
                        Amount
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-graphite-400">
                        Status
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-graphite-400">
                        Date
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-graphite-400">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/20">
                    {expandedRecord.details.map((d, i) => (
                      <tr key={i} className="hover:bg-white/50">
                        <td className="px-3 py-2 font-mono text-xs">
                          {d.orderId.slice(0, 12)}...
                        </td>
                        <td className="px-3 py-2">
                          {formatPriceDecimal(d.totalCents)}
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant="secondary" className="text-xs">
                            {d.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 text-graphite-400">
                          {d.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {expandedRecord && (!expandedRecord.details || expandedRecord.details.length === 0) && (
            <div className="border-t border-navy-100/40 bg-linen/20 p-4">
              <p className="text-sm text-graphite-400">
                No unmatched transaction details
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Run Modal */}
      {showRunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-navy">
              Run Reconciliation
            </h3>
            <p className="mt-1 text-sm text-graphite-400">
              Select the period to reconcile Stripe vs internal records
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Period Start
                </label>
                <input
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-graphite-500 mb-1">
                  Period End
                </label>
                <input
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowRunModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-graphite-500 hover:bg-navy-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRun}
                disabled={!periodStart || !periodEnd || loading}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-50 transition-colors"
              >
                {loading ? "Running..." : "Run"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-navy">
              Resolve Reconciliation
            </h3>
            <p className="mt-1 text-sm text-graphite-400">
              Add notes explaining the resolution
            </p>
            <div className="mt-4">
              <textarea
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                placeholder="Resolution notes..."
                rows={4}
                className="w-full rounded-lg border border-navy-100 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
              />
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setResolveId(null);
                  setResolveNotes("");
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-graphite-500 hover:bg-navy-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Resolving..." : "Mark Resolved"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
