"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import {
  Zap,
  RefreshCw,
  Send,
  Tag,
  Calculator,
  CreditCard,
  X,
  Users,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface BulkOp {
  id: string;
  type: string;
  status: string;
  targetSegment: string | null;
  targetFilter: Record<string, unknown> | null;
  affectedCount: number;
  processedCount: number;
  errorCount: number;
  errorDetails: string[] | null;
  initiatedBy: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PreviewResult {
  affectedCount: number;
  sampleUsers: { name: string; email: string }[];
}

interface Props {
  operations: BulkOp[];
  total: number;
  page: number;
  limit: number;
}

const OPERATION_TYPES = [
  {
    value: "RECALC_SCORES",
    label: "Recalculate Scores",
    description: "Recompute health scores for all active subscribers",
    icon: Calculator,
  },
  {
    value: "RETRY_PAYMENTS",
    label: "Retry Payments",
    description: "Retry failed payments for past-due subscriptions",
    icon: CreditCard,
  },
  {
    value: "SEND_CAMPAIGN",
    label: "Send Campaign",
    description: "Send a campaign email to all patients",
    icon: Send,
  },
  {
    value: "APPLY_COUPON",
    label: "Apply Coupon",
    description: "Apply a coupon to all active subscriptions",
    icon: Tag,
  },
];

const STATUS_BADGE: Record<string, "secondary" | "default" | "success" | "destructive"> = {
  PENDING: "secondary",
  RUNNING: "default",
  COMPLETED: "success",
  FAILED: "destructive",
  CANCELED: "secondary",
};

const TYPE_ICONS: Record<string, typeof Calculator> = {
  RECALC_SCORES: Calculator,
  RETRY_PAYMENTS: CreditCard,
  SEND_CAMPAIGN: Send,
  APPLY_COUPON: Tag,
};

const TYPE_LABELS: Record<string, string> = {
  RECALC_SCORES: "Recalc Scores",
  RETRY_PAYMENTS: "Retry Payments",
  SEND_CAMPAIGN: "Send Campaign",
  APPLY_COUPON: "Apply Coupon",
};

const columns: ColumnDef<BulkOp>[] = [
  {
    key: "type",
    header: "Type",
    render: (row) => {
      const Icon = TYPE_ICONS[row.type] || Zap;
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-graphite-400" />
          <span className="font-medium text-navy">
            {TYPE_LABELS[row.type] || row.type}
          </span>
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={STATUS_BADGE[row.status] || "secondary"}>
        {row.status === "RUNNING" && (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        )}
        {row.status}
      </Badge>
    ),
  },
  {
    key: "affected",
    header: "Affected",
    render: (row) => (
      <span className="text-graphite-600">{row.affectedCount}</span>
    ),
  },
  {
    key: "processed",
    header: "Processed",
    render: (row) => (
      <span className="text-graphite-600">{row.processedCount}</span>
    ),
  },
  {
    key: "errors",
    header: "Errors",
    render: (row) => (
      <span className={row.errorCount > 0 ? "font-medium text-red-600" : "text-graphite-400"}>
        {row.errorCount}
      </span>
    ),
  },
  {
    key: "initiatedBy",
    header: "Initiated By",
    render: (row) => (
      <span className="text-sm text-graphite-500">{row.initiatedBy}</span>
    ),
  },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    render: (row) => (
      <span className="text-xs text-graphite-400">
        {new Date(row.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
  {
    key: "duration",
    header: "Duration",
    render: (row) => {
      if (!row.startedAt || !row.completedAt) return <span className="text-graphite-300">--</span>;
      const ms = new Date(row.completedAt).getTime() - new Date(row.startedAt).getTime();
      const secs = Math.round(ms / 1000);
      return (
        <span className="text-xs text-graphite-500">
          {secs < 60 ? `${secs}s` : `${Math.round(secs / 60)}m ${secs % 60}s`}
        </span>
      );
    },
  },
];

export function BulkOperationsClient({
  operations,
  total,
  page,
  limit,
}: Props) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTypeSelect = async (type: string) => {
    setSelectedType(type);
    setLoadingPreview(true);
    setPreview(null);
    try {
      const res = await fetch("/api/admin/bulk-operations/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreview(data);
      }
    } catch {
      // Preview fetch failed silently
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleExecute = async () => {
    if (!selectedType) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/bulk-operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType }),
      });
      if (res.ok) {
        setShowDialog(false);
        setSelectedType("");
        setPreview(null);
        router.refresh();
      }
    } catch {
      // Execute failed silently
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Bulk Operations</h2>
          <p className="text-sm text-graphite-400">
            Run batch operations across users, subscriptions, and scores
          </p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          <Zap className="h-4 w-4" />
          New Operation
        </button>
      </div>

      {/* New operation dialog */}
      {showDialog && (
        <Card className="border-teal-200 bg-teal-50/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-teal" />
              New Bulk Operation
            </CardTitle>
            <button
              onClick={() => {
                setShowDialog(false);
                setSelectedType("");
                setPreview(null);
              }}
              className="rounded-lg p-1 hover:bg-navy-50"
            >
              <X className="h-4 w-4 text-graphite-400" />
            </button>
          </CardHeader>
          <CardContent>
            {/* Operation type radio cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              {OPERATION_TYPES.map((op) => {
                const isSelected = selectedType === op.value;
                return (
                  <button
                    key={op.value}
                    onClick={() => handleTypeSelect(op.value)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? "border-teal bg-teal-50/30 ring-2 ring-teal/20"
                        : "border-navy-100/60 bg-white hover:border-teal-200 hover:bg-teal-50/10"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isSelected ? "bg-teal-100" : "bg-navy-50"
                      }`}
                    >
                      <op.icon
                        className={`h-4 w-4 ${
                          isSelected ? "text-teal-700" : "text-graphite-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isSelected ? "text-teal-800" : "text-navy"
                        }`}
                      >
                        {op.label}
                      </p>
                      <p className="text-xs text-graphite-400 mt-0.5">
                        {op.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Preview */}
            {loadingPreview && (
              <div className="mt-4 flex items-center gap-2 text-sm text-graphite-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading preview...
              </div>
            )}

            {preview && !loadingPreview && (
              <div className="mt-4 rounded-xl border border-navy-100/60 bg-white p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-teal" />
                  <span className="text-sm font-semibold text-navy">
                    {preview.affectedCount} users will be affected
                  </span>
                </div>
                {preview.sampleUsers.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Sample users
                    </p>
                    {preview.sampleUsers.map((u, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-graphite-600"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-50 text-[10px] font-semibold text-navy">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                        <span className="text-graphite-300">{u.email}</span>
                      </div>
                    ))}
                  </div>
                )}
                {preview.affectedCount === 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    No users match this operation criteria
                  </div>
                )}
              </div>
            )}

            {/* Execute button */}
            {selectedType && preview && !loadingPreview && (
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDialog(false);
                    setSelectedType("");
                    setPreview(null);
                  }}
                  className="rounded-xl border border-navy-100/60 px-4 py-2 text-sm font-medium text-graphite-500 hover:bg-navy-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecute}
                  disabled={submitting || preview.affectedCount === 0}
                  className="flex items-center gap-2 rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Execute Operation
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Operation history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-teal" />
            Operation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={operations}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            onPageChange={(p) => router.push(`/admin/bulk-operations?page=${p}`)}
            emptyMessage="No bulk operations have been run yet"
            getRowId={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
