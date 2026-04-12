"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  AlertTriangle,
  Clock,
  FileCheck,
  ShieldAlert,
  FileText,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Stats = {
  totalResellers: number;
  onboardingComplete: number;
  onboardingIncomplete: number;
  w9Submitted: number;
  w9Rate: number;
  activeCount: number;
  suspendedCount: number;
  terminatedCount: number;
  totalViolations: number | null;
  oigStaleCount: number;
  attestationStaleCount: number;
  pendingContentReviews: number;
};

type AttentionReseller = {
  id: string;
  displayName: string | null;
  companyName: string | null;
  contactEmail: string;
  tier: string;
  status: string;
  onboardingCompletedAt: Date | string | null;
  complianceViolationCount: number;
  oigCheckResult: string | null;
  oigCheckPassedAt: Date | string | null;
  attestationSignedAt: Date | string | null;
  w9SubmittedAt: Date | string | null;
  lastComplianceAuditAt: Date | string | null;
  createdAt: Date | string;
  reasons: string[];
};

type MarketingSubmission = {
  id: string;
  resellerId: string;
  contentType: string;
  title: string;
  content: string;
  platform: string | null;
  status: string;
  submittedAt: Date | string;
  reviewedAt: Date | string | null;
  reviewNotes: string | null;
  resellerName: string;
  resellerCompany: string | null;
  resellerTier: string;
};

type ReviewQueue = {
  submissions: MarketingSubmission[];
  total: number;
};

export interface ComplianceDashboardClientProps {
  stats: Stats;
  attentionList: AttentionReseller[];
  reviewQueue: ReviewQueue;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SortKey = "name" | "status" | "tier" | "violations" | "joined";
type SortDir = "asc" | "desc";

function statusColor(status: string) {
  switch (status) {
    case "ACTIVE": return "bg-emerald-100 text-emerald-800";
    case "SUSPENDED": return "bg-amber-100 text-amber-800";
    case "TERMINATED": return "bg-red-100 text-red-800";
    case "PAUSED": return "bg-slate-100 text-slate-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

function tierColor(tier: string) {
  switch (tier) {
    case "PLATINUM": return "bg-violet-100 text-violet-800";
    case "GOLD": return "bg-yellow-100 text-yellow-800";
    case "SILVER": return "bg-slate-100 text-slate-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

function fmt(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="inline ml-1 h-3 w-3 text-slate-400" />;
  return sortDir === "asc"
    ? <ChevronUp className="inline ml-1 h-3 w-3 text-slate-700" />
    : <ChevronDown className="inline ml-1 h-3 w-3 text-slate-700" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ComplianceDashboardClient({ stats, attentionList, reviewQueue }: ComplianceDashboardClientProps) {
  const [sortKey, setSortKey] = useState<SortKey>("violations");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [tab, setTab] = useState<"attention" | "marketing">("attention");

  function toggleSort(col: SortKey) {
    if (sortKey === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col);
      setSortDir("desc");
    }
  }

  const sorted = [...attentionList].sort((a, b) => {
    let av: string | number = 0;
    let bv: string | number = 0;
    switch (sortKey) {
      case "name":
        av = a.displayName || a.companyName || "";
        bv = b.displayName || b.companyName || "";
        break;
      case "status":
        av = a.status;
        bv = b.status;
        break;
      case "tier":
        av = a.tier;
        bv = b.tier;
        break;
      case "violations":
        av = a.complianceViolationCount;
        bv = b.complianceViolationCount;
        break;
      case "joined":
        av = new Date(a.createdAt).getTime();
        bv = new Date(b.createdAt).getTime();
        break;
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const statCards = [
    {
      label: "Total Resellers",
      value: stats.totalResellers,
      sub: `${stats.activeCount} active`,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      bg: "bg-blue-50",
      alert: false,
    },
    {
      label: "Onboarding Incomplete",
      value: stats.onboardingIncomplete,
      sub: `${stats.onboardingComplete} completed`,
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      bg: "bg-amber-50",
      alert: stats.onboardingIncomplete > 0,
    },
    {
      label: "OIG Check Stale",
      value: stats.oigStaleCount,
      sub: "Active / paused resellers",
      icon: <ShieldAlert className="h-5 w-5 text-red-600" />,
      bg: "bg-red-50",
      alert: stats.oigStaleCount > 0,
    },
    {
      label: "Marketing Reviews Pending",
      value: stats.pendingContentReviews,
      sub: `${stats.attestationStaleCount} re-attestation due`,
      icon: <FileText className="h-5 w-5 text-violet-600" />,
      bg: "bg-violet-50",
      alert: stats.pendingContentReviews > 0,
    },
    {
      label: "Total Violations",
      value: stats.totalViolations ?? 0,
      sub: `${stats.suspendedCount} suspended`,
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      bg: "bg-orange-50",
      alert: (stats.totalViolations ?? 0) > 0,
    },
    {
      label: "W-9 Submitted",
      value: `${stats.w9Rate}%`,
      sub: `${stats.w9Submitted} of ${stats.totalResellers}`,
      icon: <FileCheck className="h-5 w-5 text-emerald-600" />,
      bg: "bg-emerald-50",
      alert: false,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reseller Compliance</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor onboarding completion, OIG checks, attestations, and marketing content approvals.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((c) => (
          <Card key={c.label} className={`${c.bg} border-0 shadow-sm`}>
            <CardHeader className="pb-1 pt-4 px-4">
              <div className="flex items-center justify-between">
                {c.icon}
                {c.alert && (
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-2xl font-bold text-slate-900">{c.value}</p>
              <CardTitle className="text-xs font-medium text-slate-600 mt-0.5">{c.label}</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {(["attention", "marketing"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "attention"
              ? `Requires Attention (${attentionList.length})`
              : `Marketing Queue (${reviewQueue.total})`}
          </button>
        ))}
      </div>

      {/* Attention Table */}
      {tab === "attention" && (
        <>
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <ShieldAlert className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium text-slate-600">All clear</p>
              <p className="text-sm mt-1">No resellers currently require compliance attention.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    {(
                      [
                        { key: "name" as SortKey, label: "Reseller" },
                        { key: "tier" as SortKey, label: "Tier" },
                        { key: "status" as SortKey, label: "Status" },
                        { key: "violations" as SortKey, label: "Violations" },
                        { key: "joined" as SortKey, label: "Joined" },
                      ] as { key: SortKey; label: string }[]
                    ).map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left cursor-pointer select-none hover:text-slate-700 whitespace-nowrap"
                        onClick={() => toggleSort(col.key)}
                      >
                        {col.label}
                        <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left">Issues</th>
                    <th className="px-4 py-3 text-left">Last Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {r.displayName || r.companyName || "—"}
                        </p>
                        <p className="text-xs text-slate-400">{r.contactEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${tierColor(r.tier)}`}>{r.tier}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${statusColor(r.status)}`}>{r.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-semibold ${
                            r.complianceViolationCount >= 3
                              ? "text-red-600"
                              : r.complianceViolationCount >= 1
                              ? "text-amber-600"
                              : "text-slate-500"
                          }`}
                        >
                          {r.complianceViolationCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {fmt(r.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.reasons.map((reason) => (
                            <span
                              key={reason}
                              className="inline-block rounded-full bg-red-50 text-red-700 text-xs px-2 py-0.5 font-medium"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {fmt(r.lastComplianceAuditAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Marketing Review Queue */}
      {tab === "marketing" && (
        <>
          {reviewQueue.submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <FileText className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium text-slate-600">Queue is empty</p>
              <p className="text-sm mt-1">No marketing submissions awaiting review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Reseller</th>
                    <th className="px-4 py-3 text-left">Tier</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviewQueue.submissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{s.resellerName}</p>
                        {s.resellerCompany && (
                          <p className="text-xs text-slate-400">{s.resellerCompany}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${tierColor(s.resellerTier)}`}>
                          {s.resellerTier}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 text-sm">{s.title}</p>
                        {s.platform && <p className="text-xs text-slate-400">{s.platform}</p>}
                      </td>
                      <td className="px-4 py-3 text-slate-600 capitalize">
                        {s.contentType.toLowerCase().replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {fmt(s.submittedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="text-xs bg-amber-100 text-amber-800">Pending</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reviewQueue.total > reviewQueue.submissions.length && (
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500">
                  Showing {reviewQueue.submissions.length} of {reviewQueue.total} pending submissions.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
