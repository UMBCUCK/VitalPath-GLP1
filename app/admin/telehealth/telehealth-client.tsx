"use client";

import { useState, useCallback } from "react";
import {
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Stethoscope,
  RefreshCw,
  Pill,
  CalendarDays,
  Percent,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/admin/kpi-card";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";

// ── Types ──────────────────────────────────────────────────────

interface ConsultationRow {
  id: string;
  userId: string;
  patientName: string;
  patientEmail: string;
  consultationId: string;
  openloopPatientId: string;
  status: string;
  providerName: string;
  scheduledAt: string | null;
  completedAt: string | null;
  eligibilityResult: string;
  prescriptionId: string;
  notes: string;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PrescriptionRow {
  id: string;
  userId: string;
  patientName: string;
  patientEmail: string;
  medication: string;
  dosage: string;
  frequency: string;
  pharmacyVendor: string;
  nextRefillDate: string | null;
  status: string;
  providerName: string;
  prescribedAt: string | null;
}

interface Metrics {
  total: number;
  pending: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  canceled: number;
  avgTimeHours: number;
  approvalRate: number;
}

interface Props {
  pipeline: { rows: ConsultationRow[]; total: number };
  metrics: Metrics;
  prescriptions: PrescriptionRow[];
}

// ── Status badge ───────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "secondary" | "default" | "outline" | "destructive"> = {
    PENDING: "secondary",
    SCHEDULED: "default",
    IN_PROGRESS: "outline",
    COMPLETED: "default",
    CANCELED: "destructive",
  };

  const colors: Record<string, string> = {
    PENDING: "bg-gray-100 text-gray-700",
    SCHEDULED: "bg-blue-50 text-blue-700",
    IN_PROGRESS: "bg-amber-50 text-amber-700",
    COMPLETED: "bg-emerald-50 text-emerald-700",
    CANCELED: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function TelehealthClient({ pipeline, metrics, prescriptions }: Props) {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [data, setData] = useState(pipeline);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPipeline = useCallback(
    async (p: number, status: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(p), limit: "25" });
        if (status !== "all") params.set("status", status);
        const res = await fetch(`/api/admin/telehealth?${params}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.pipeline);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handlePageChange = useCallback(
    (p: number) => {
      setPage(p);
      fetchPipeline(p, statusFilter);
    },
    [statusFilter, fetchPipeline]
  );

  const handleFilterChange = useCallback(
    (_key: string, value: string) => {
      setStatusFilter(value);
      setPage(1);
      fetchPipeline(1, value);
    },
    [fetchPipeline]
  );

  const handleSync = useCallback(async (trackerId: string) => {
    setSyncingId(trackerId);
    try {
      const res = await fetch("/api/admin/telehealth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackerId }),
      });
      if (res.ok) {
        // Refresh pipeline data after sync
        const params = new URLSearchParams({ page: String(page), limit: "25" });
        if (statusFilter !== "all") params.set("status", statusFilter);
        const refreshRes = await fetch(`/api/admin/telehealth?${params}`);
        if (refreshRes.ok) {
          const json = await refreshRes.json();
          setData(json.pipeline);
        }
      }
    } finally {
      setSyncingId(null);
    }
  }, [page, statusFilter]);

  // ── Consultation columns ─────────────────────────────────────

  const consultationColumns: ColumnDef<ConsultationRow>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (row) => (
        <div>
          <p className="font-medium text-navy">{row.patientName}</p>
          <p className="text-xs text-graphite-400">{row.patientEmail}</p>
        </div>
      ),
    },
    {
      key: "consultationId",
      header: "Consultation ID",
      render: (row) => (
        <code className="rounded bg-navy-50 px-1.5 py-0.5 text-xs font-mono text-navy">
          {row.consultationId || "—"}
        </code>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "providerName",
      header: "Provider",
      render: (row) => (
        <span className="text-sm text-graphite-600">
          {row.providerName || "—"}
        </span>
      ),
    },
    {
      key: "scheduledAt",
      header: "Scheduled",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-graphite-500">
          {row.scheduledAt
            ? new Date(row.scheduledAt).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
    {
      key: "completedAt",
      header: "Completed",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-graphite-500">
          {row.completedAt
            ? new Date(row.completedAt).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
    {
      key: "eligibility",
      header: "Eligibility",
      render: (row) => {
        if (!row.eligibilityResult) return <span className="text-graphite-300">—</span>;
        const isEligible = row.eligibilityResult === "ELIGIBLE";
        return (
          <Badge variant={isEligible ? "default" : "destructive"} className={isEligible ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : ""}>
            {row.eligibilityResult}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Sync",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleSync(row.id);
          }}
          disabled={syncingId === row.id}
          className="h-8 w-8 p-0"
          title="Sync status from OpenLoop"
        >
          {syncingId === row.id ? (
            <Loader2 className="h-4 w-4 animate-spin text-teal" />
          ) : (
            <RefreshCw className="h-4 w-4 text-graphite-400 hover:text-teal" />
          )}
        </Button>
      ),
    },
  ];

  // ── Prescription columns ─────────────────────────────────────

  const prescriptionColumns: ColumnDef<PrescriptionRow>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (row) => (
        <div>
          <p className="font-medium text-navy">{row.patientName}</p>
          <p className="text-xs text-graphite-400">{row.patientEmail}</p>
        </div>
      ),
    },
    {
      key: "medication",
      header: "Medication",
      render: (row) => (
        <span className="font-medium text-navy">{row.medication}</span>
      ),
    },
    {
      key: "dosage",
      header: "Dosage",
      render: (row) => (
        <span className="text-sm text-graphite-600">{row.dosage}</span>
      ),
    },
    {
      key: "frequency",
      header: "Frequency",
      render: (row) => (
        <span className="text-sm text-graphite-600">{row.frequency}</span>
      ),
    },
    {
      key: "nextRefill",
      header: "Next Refill",
      render: (row) => {
        if (!row.nextRefillDate) return <span className="text-graphite-300">—</span>;
        const date = new Date(row.nextRefillDate);
        const isOverdue = date < new Date();
        return (
          <span className={`text-sm font-medium ${isOverdue ? "text-red-600" : "text-graphite-600"}`}>
            {date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: "pharmacy",
      header: "Pharmacy",
      render: (row) => (
        <span className="text-sm text-graphite-500">{row.pharmacyVendor}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
            <Stethoscope className="h-5 w-5 text-teal" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy">
              Telehealth Pipeline
            </h1>
            <p className="text-sm text-graphite-400">
              OpenLoop consultation tracking, eligibility decisions, and prescription management
            </p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <KPICard
          title="Total Consultations"
          value={String(metrics.total)}
          icon={Activity}
        />
        <KPICard
          title="Pending"
          value={String(metrics.pending)}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Scheduled"
          value={String(metrics.scheduled)}
          icon={CalendarDays}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Completed"
          value={String(metrics.completed)}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Avg. Time"
          value={`${metrics.avgTimeHours}h`}
          icon={Clock}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <KPICard
          title="Approval Rate"
          value={`${metrics.approvalRate}%`}
          icon={Percent}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
      </div>

      {/* Consultation Pipeline Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">
            Consultation Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data.rows}
            columns={consultationColumns}
            total={data.total}
            page={page}
            limit={25}
            onPageChange={handlePageChange}
            loading={loading}
            emptyMessage="No consultations yet. Consultations will appear here as patients complete intake."
            filters={[
              {
                key: "status",
                label: "Status",
                options: [
                  { label: "All", value: "all" },
                  { label: "Pending", value: "PENDING" },
                  { label: "Scheduled", value: "SCHEDULED" },
                  { label: "In Progress", value: "IN_PROGRESS" },
                  { label: "Completed", value: "COMPLETED" },
                  { label: "Canceled", value: "CANCELED" },
                ],
              },
            ]}
            activeFilters={{ status: statusFilter }}
            onFilterChange={handleFilterChange}
            getRowId={(row) => row.id}
          />
        </CardContent>
      </Card>

      {/* Prescription Pipeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-teal" />
            <CardTitle className="text-lg font-semibold text-navy">
              Prescription Pipeline
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={prescriptions}
            columns={prescriptionColumns}
            total={prescriptions.length}
            page={1}
            limit={100}
            onPageChange={() => {}}
            emptyMessage="No active prescriptions. Prescriptions appear when providers approve treatment plans."
            getRowId={(row) => row.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
