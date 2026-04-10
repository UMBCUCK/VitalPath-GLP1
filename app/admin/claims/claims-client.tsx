"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import {
  Plus, Check, X, AlertTriangle, Shield, FileText, Scale,
  Stethoscope, Download,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────

type ClaimStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "RETIRED";
type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface Claim {
  id: string;
  text: string;
  category: string;
  status: ClaimStatus;
  allowedChannels: string[];
  disclosureText: string | null;
  citationSource: string | null;
  citationUrl: string | null;
  numericClaim: boolean;
  requiresFootnote: boolean;
  requiresModal: boolean;
  requiresLegalReview: boolean;
  requiresMedicalReview: boolean;
  stateRestrictions: string[] | null;
  riskLevel: RiskLevel;
  riskNotes: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  initialClaims: Claim[];
  initialTotal: number;
  stats: {
    total: number;
    approved: number;
    pendingReview: number;
    highRisk: number;
  };
}

// ── Helpers ─────────────────────────────────────────────────

const statusVariant = (status: ClaimStatus) => {
  switch (status) {
    case "APPROVED": return "success" as const;
    case "PENDING_REVIEW": return "warning" as const;
    case "REJECTED": return "destructive" as const;
    case "DRAFT": return "secondary" as const;
    case "RETIRED": return "outline" as const;
    default: return "secondary" as const;
  }
};

const riskColor = (level: RiskLevel) => {
  switch (level) {
    case "LOW": return "text-emerald-600 bg-emerald-50";
    case "MEDIUM": return "text-amber-600 bg-amber-50";
    case "HIGH": return "text-orange-600 bg-orange-50";
    case "CRITICAL": return "text-red-600 bg-red-50";
  }
};

const formatCategory = (c: string) =>
  c.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());

// ── Component ───────────────────────────────────────────────

export function ClaimsClient({ initialClaims, initialTotal, stats }: Props) {
  const [claims, setClaims] = useState<Claim[]>(initialClaims);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const limit = 50;

  // ── Fetch claims from API ─────────────────────────────────
  const fetchClaims = useCallback(
    async (p: number, s: string, st: string, cat: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: String(limit),
        });
        if (s) params.set("search", s);
        if (st !== "all") params.set("status", st);
        if (cat !== "all") params.set("category", cat);

        const res = await fetch(`/api/admin/claims?${params}`);
        if (res.ok) {
          const data = await res.json();
          setClaims(data.claims);
          setTotal(data.total);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ── Approve / Reject ──────────────────────────────────────
  const updateStatus = async (id: string, newStatus: ClaimStatus) => {
    const res = await fetch("/api/admin/claims", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      const { claim } = await res.json();
      setClaims((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...claim } : c))
      );
    }
  };

  // ── CSV Export ────────────────────────────────────────────
  const handleExport = () => {
    exportToCSV(
      claims,
      [
        { key: "text", header: "Claim Text", getValue: (r) => r.text },
        { key: "category", header: "Category", getValue: (r) => r.category },
        { key: "status", header: "Status", getValue: (r) => r.status },
        { key: "riskLevel", header: "Risk Level", getValue: (r) => r.riskLevel },
        {
          key: "channels",
          header: "Channels",
          getValue: (r) =>
            Array.isArray(r.allowedChannels)
              ? r.allowedChannels.join("; ")
              : "",
        },
        {
          key: "approvedBy",
          header: "Approved By",
          getValue: (r) => r.approvedBy || "",
        },
      ],
      "claims-export"
    );
  };

  // ── Column definitions ────────────────────────────────────
  const columns: ColumnDef<Claim>[] = [
    {
      key: "text",
      header: "Claim Text",
      sortable: true,
      className: "max-w-xs",
      render: (row) => (
        <div>
          <p className="text-sm text-navy line-clamp-2">{row.text}</p>
          {row.disclosureText && (
            <p className="mt-1 text-[10px] text-graphite-300 line-clamp-1">
              Disclosure: {row.disclosureText}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (row) => (
        <Badge variant="secondary" className="text-[10px] whitespace-nowrap">
          {formatCategory(row.category)}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={statusVariant(row.status)}>
          {row.status.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "riskLevel",
      header: "Risk",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${riskColor(row.riskLevel)}`}
        >
          {row.riskLevel}
        </span>
      ),
    },
    {
      key: "channels",
      header: "Channels",
      render: (row) => {
        const channels = Array.isArray(row.allowedChannels)
          ? row.allowedChannels
          : [];
        return (
          <div className="flex flex-wrap gap-1">
            {channels.slice(0, 3).map((ch) => (
              <span
                key={ch}
                className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] text-graphite-500"
              >
                {ch}
              </span>
            ))}
            {channels.length > 3 && (
              <span className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] text-graphite-400">
                +{channels.length - 3}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "flags",
      header: "Flags",
      render: (row) => (
        <div className="flex gap-1">
          {row.numericClaim && (
            <Badge variant="warning" className="text-[9px] px-1.5">
              #
            </Badge>
          )}
          {row.requiresFootnote && (
            <Badge variant="secondary" className="text-[9px] px-1.5">
              <FileText className="h-2.5 w-2.5" />
            </Badge>
          )}
          {row.requiresLegalReview && (
            <Badge variant="destructive" className="text-[9px] px-1.5">
              <Scale className="h-2.5 w-2.5" />
            </Badge>
          )}
          {row.requiresMedicalReview && (
            <Badge variant="destructive" className="text-[9px] px-1.5">
              <Stethoscope className="h-2.5 w-2.5" />
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "approval",
      header: "Approval",
      render: (row) =>
        row.approvedBy ? (
          <div>
            <p className="text-xs text-graphite-500">{row.approvedBy}</p>
            <p className="text-[10px] text-graphite-300">
              {row.approvedAt
                ? new Date(row.approvedAt).toLocaleDateString()
                : ""}
            </p>
          </div>
        ) : (
          <span className="text-xs text-graphite-300">--</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          {(row.status === "PENDING_REVIEW" || row.status === "DRAFT") && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(row.id, "APPROVED");
                }}
                className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50 transition-colors"
                title="Approve"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateStatus(row.id, "REJECTED");
                }}
                className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 transition-colors"
                title="Reject"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          {row.status === "APPROVED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateStatus(row.id, "RETIRED");
              }}
              className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
              title="Retire"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // ── Filter configs for DataTable toolbar ──────────────────
  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Draft", value: "DRAFT" },
        { label: "Pending Review", value: "PENDING_REVIEW" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Retired", value: "RETIRED" },
      ],
    },
    {
      key: "category",
      label: "Category",
      options: [
        { label: "All Categories", value: "all" },
        { label: "Study Tethered Numeric", value: "STUDY_TETHERED_NUMERIC" },
        { label: "Non-Numeric Support", value: "NON_NUMERIC_SUPPORT" },
        { label: "Operational Trust", value: "OPERATIONAL_TRUST" },
        { label: "Lifestyle Adherence", value: "LIFESTYLE_ADHERENCE" },
        { label: "Testimonial Results", value: "TESTIMONIAL_RESULTS" },
        { label: "Supplement Support", value: "SUPPLEMENT_SUPPORT" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Claim Engine</h2>
          <p className="text-sm text-graphite-400">
            Manage marketing claims, disclosures, and compliance approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Claim
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Claims", value: stats.total },
          { label: "Approved", value: stats.approved },
          { label: "Pending Review", value: stats.pendingReview },
          { label: "High Risk", value: stats.highRisk },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-graphite-400">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-navy">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DataTable */}
      <DataTable
        data={claims}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        search={search}
        onPageChange={(p) => {
          setPage(p);
          fetchClaims(p, search, statusFilter, categoryFilter);
        }}
        onSearchChange={(s) => {
          setSearch(s);
          setPage(1);
          fetchClaims(1, s, statusFilter, categoryFilter);
        }}
        searchPlaceholder="Search claims..."
        filters={filters}
        activeFilters={{ status: statusFilter, category: categoryFilter }}
        onFilterChange={(key, value) => {
          if (key === "status") setStatusFilter(value);
          if (key === "category") setCategoryFilter(value);
          setPage(1);
          fetchClaims(
            1,
            search,
            key === "status" ? value : statusFilter,
            key === "category" ? value : categoryFilter
          );
        }}
        onExportCSV={handleExport}
        getRowId={(r) => r.id}
        loading={loading}
        emptyMessage="No claims found matching your filters"
      />

      {/* Compliance rules reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Claim Compliance Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Numeric claims require study-backed wording with clear qualifiers",
              "Never invent weight loss numbers or timelines",
              "Prefer percentages over pounds unless substantiated and approved",
              "Medication outcome claims require context and qualifier copy",
              "Supplement claims use structure/function language only",
              "Before/after stories require disclosure modules and moderation",
              "Never imply compounded drugs are FDA-approved",
              "Never imply compounded products are the same as branded drugs",
            ].map((rule, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-amber-50/50 px-3 py-2"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                  {i + 1}
                </span>
                <p className="text-xs text-graphite-600 leading-relaxed">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
