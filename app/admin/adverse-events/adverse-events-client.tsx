"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import {
  AlertTriangle, ShieldAlert, HeartPulse, CheckCircle2, Clock,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/admin/kpi-card";

// ── Types ───────────────────────────────────────────────────

interface AdverseEvent {
  id: string;
  userId: string;
  reportedAt: string;
  severity: string;
  description: string;
  medicationName: string | null;
  onsetDate: string | null;
  actionTaken: string | null;
  resolvedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

interface Props {
  initialEvents: AdverseEvent[];
  initialTotal: number;
  severityCounts: {
    mild: number;
    moderate: number;
    severe: number;
    lifeThreatening: number;
    unresolved: number;
    unreviewed: number;
  };
}

// ── Helpers ─────────────────────────────────────────────────

const severityVariant = (severity: string) => {
  switch (severity) {
    case "MILD": return "secondary" as const;
    case "MODERATE": return "warning" as const;
    case "SEVERE": return "destructive" as const;
    case "LIFE_THREATENING": return "destructive" as const;
    default: return "secondary" as const;
  }
};

const severityIcon = (severity: string) => {
  switch (severity) {
    case "MILD": return "text-graphite-400";
    case "MODERATE": return "text-amber-500";
    case "SEVERE": return "text-orange-600";
    case "LIFE_THREATENING": return "text-red-600";
    default: return "text-graphite-400";
  }
};

// ── Component ───────────────────────────────────────────────

export function AdverseEventsClient({
  initialEvents,
  initialTotal,
  severityCounts,
}: Props) {
  const [events] = useState<AdverseEvent[]>(initialEvents);
  const [total] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const limit = 50;

  // Client-side filtering (small dataset)
  const filtered = events.filter((e) => {
    if (severityFilter !== "all" && e.severity !== severityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = `${e.user.firstName || ""} ${e.user.lastName || ""}`.toLowerCase();
      if (
        !name.includes(q) &&
        !e.description.toLowerCase().includes(q) &&
        !(e.medicationName || "").toLowerCase().includes(q)
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
        {
          key: "patient",
          header: "Patient",
          getValue: (r) =>
            `${r.user.firstName || ""} ${r.user.lastName || ""}`.trim(),
        },
        { key: "severity", header: "Severity", getValue: (r) => r.severity },
        {
          key: "medication",
          header: "Medication",
          getValue: (r) => r.medicationName || "",
        },
        {
          key: "description",
          header: "Description",
          getValue: (r) => r.description,
        },
        {
          key: "reportedAt",
          header: "Reported",
          getValue: (r) => new Date(r.reportedAt).toLocaleDateString(),
        },
        {
          key: "resolved",
          header: "Resolved",
          getValue: (r) =>
            r.resolvedAt
              ? new Date(r.resolvedAt).toLocaleDateString()
              : "Unresolved",
        },
        {
          key: "reviewedBy",
          header: "Reviewed By",
          getValue: (r) => r.reviewedBy || "Pending",
        },
      ],
      "adverse-events-export"
    );
  };

  // ── Column definitions ────────────────────────────────────
  const columns: ColumnDef<AdverseEvent>[] = [
    {
      key: "patient",
      header: "Patient",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-navy">
            {row.user.firstName || ""} {row.user.lastName || ""}
          </p>
          <p className="text-xs text-graphite-400">{row.user.email}</p>
        </div>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <AlertTriangle className={`h-3.5 w-3.5 ${severityIcon(row.severity)}`} />
          <Badge variant={severityVariant(row.severity)}>
            {row.severity.replace("_", " ")}
          </Badge>
        </div>
      ),
    },
    {
      key: "medication",
      header: "Medication",
      render: (row) => (
        <span className="text-sm text-graphite-500">
          {row.medicationName || "--"}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      className: "max-w-xs",
      render: (row) => (
        <p className="text-sm text-navy line-clamp-2">{row.description}</p>
      ),
    },
    {
      key: "reportedAt",
      header: "Reported",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-graphite-500">
          {new Date(row.reportedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "resolved",
      header: "Resolved",
      render: (row) =>
        row.resolvedAt ? (
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs text-emerald-600">
              {new Date(row.resolvedAt).toLocaleDateString()}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs text-amber-600">Open</span>
          </div>
        ),
    },
    {
      key: "reviewedBy",
      header: "Reviewed By",
      render: (row) =>
        row.reviewedBy ? (
          <div>
            <p className="text-xs text-graphite-500">{row.reviewedBy}</p>
            {row.reviewedAt && (
              <p className="text-[10px] text-graphite-300">
                {new Date(row.reviewedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <Badge variant="warning" className="text-[10px]">
            Needs Review
          </Badge>
        ),
    },
  ];

  // ── Filter configs ────────────────────────────────────────
  const filters = [
    {
      key: "severity",
      label: "Severity",
      options: [
        { label: "All Severities", value: "all" },
        { label: "Mild", value: "MILD" },
        { label: "Moderate", value: "MODERATE" },
        { label: "Severe", value: "SEVERE" },
        { label: "Life-Threatening", value: "LIFE_THREATENING" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Adverse Event Reports</h2>
          <p className="text-sm text-graphite-400">
            Track and review patient-reported adverse events for pharmacovigilance
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KPICard
          title="Total Reports"
          value={String(total)}
          icon={ShieldAlert}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Mild"
          value={String(severityCounts.mild)}
          icon={HeartPulse}
          iconColor="text-graphite-400"
          iconBg="bg-gray-50"
        />
        <KPICard
          title="Moderate"
          value={String(severityCounts.moderate)}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Severe+"
          value={String(severityCounts.severe + severityCounts.lifeThreatening)}
          icon={ShieldAlert}
          iconColor="text-red-500"
          iconBg="bg-red-50"
        />
        <KPICard
          title="Unresolved"
          value={String(severityCounts.unresolved)}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Needs Review"
          value={String(severityCounts.unreviewed)}
          icon={AlertTriangle}
          iconColor="text-orange-500"
          iconBg="bg-orange-50"
        />
      </div>

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
        searchPlaceholder="Search by patient, medication, or description..."
        filters={filters}
        activeFilters={{ severity: severityFilter }}
        onFilterChange={(key, value) => {
          if (key === "severity") setSeverityFilter(value);
          setPage(1);
        }}
        onExportCSV={handleExport}
        getRowId={(r) => r.id}
        emptyMessage="No adverse event reports found"
      />

      {/* Compliance note */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-navy">
                Pharmacovigilance Notice
              </p>
              <p className="mt-1 text-xs text-graphite-400 leading-relaxed">
                All serious and unexpected adverse events must be reviewed within
                24 hours. Life-threatening events require immediate escalation to
                the medical director. Reports may need to be submitted to the FDA
                MedWatch system per 21 CFR 314.80.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
