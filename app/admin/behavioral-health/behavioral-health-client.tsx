"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  ClipboardCheck,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────

interface Screening {
  id: string;
  userId: string;
  type: string;
  score: number;
  severity: string;
  responses: unknown;
  flagged: boolean;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  patientName: string;
  patientEmail: string;
}

interface Referral {
  id: string;
  userId: string;
  screeningId: string | null;
  referralType: string;
  status: string;
  providerName: string | null;
  notes: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  createdAt: string;
  patientName: string;
  patientEmail: string;
}

interface Metrics {
  totalScreenings: number;
  flaggedCount: number;
  unflaggedUnreviewed: number;
  flaggedRate: number;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  referralRate: number;
  byType: { type: string; count: number }[];
  bySeverity: { severity: string; count: number }[];
}

interface Props {
  initialScreenings: Screening[];
  initialScreeningsTotal: number;
  initialReferrals: Referral[];
  initialReferralsTotal: number;
  metrics: Metrics;
}

const screeningTypeColors: Record<string, string> = {
  PHQ9: "bg-blue-100 text-blue-800",
  GAD7: "bg-amber-100 text-amber-800",
  AUDIT_C: "bg-purple-100 text-purple-800",
  CAGE: "bg-orange-100 text-orange-800",
};

const severityColors: Record<string, string> = {
  NONE: "bg-gray-100 text-gray-600",
  MILD: "bg-emerald-100 text-emerald-800",
  MODERATE: "bg-amber-100 text-amber-800",
  MODERATELY_SEVERE: "bg-orange-100 text-orange-800",
  SEVERE: "bg-red-100 text-red-800",
};

const referralTypeColors: Record<string, string> = {
  THERAPY: "bg-blue-100 text-blue-800",
  PSYCHIATRY: "bg-purple-100 text-purple-800",
  CRISIS: "bg-red-100 text-red-800",
  SUPPORT_GROUP: "bg-emerald-100 text-emerald-800",
};

const referralStatusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  SCHEDULED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  DECLINED: "bg-red-100 text-red-800",
};

// ─── Component ─────────────────────────────────────────────

export function BehavioralHealthClient({
  initialScreenings,
  initialScreeningsTotal,
  initialReferrals,
  initialReferralsTotal,
  metrics,
}: Props) {
  const [screenings, setScreenings] = useState(initialScreenings);
  const [screeningsTotal, setScreeningsTotal] = useState(initialScreeningsTotal);
  const [referrals, setReferrals] = useState(initialReferrals);
  const [referralsTotal, setReferralsTotal] = useState(initialReferralsTotal);
  const [activeTab, setActiveTab] = useState<"screenings" | "referrals">("screenings");
  const [flaggedFilter, setFlaggedFilter] = useState("all");
  const [referralStatusFilter, setReferralStatusFilter] = useState("all");

  const handleReview = async (id: string) => {
    const res = await fetch("/api/admin/behavioral-health", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "review-screening", id }),
    });
    if (res.ok) await refreshScreenings();
  };

  const handleUpdateReferral = async (id: string, status: string) => {
    const res = await fetch("/api/admin/behavioral-health", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-referral", id, status }),
    });
    if (res.ok) await refreshReferrals();
  };

  const refreshScreenings = async () => {
    const params = new URLSearchParams();
    if (flaggedFilter === "true") params.set("flagged", "true");
    if (flaggedFilter === "false") params.set("flagged", "false");
    const res = await fetch(`/api/admin/behavioral-health?${params}`);
    if (res.ok) {
      const data = await res.json();
      setScreenings(data.screenings);
      setScreeningsTotal(data.total);
    }
  };

  const refreshReferrals = async () => {
    const params = new URLSearchParams({ action: "referrals" });
    if (referralStatusFilter !== "all") params.set("status", referralStatusFilter);
    const res = await fetch(`/api/admin/behavioral-health?${params}`);
    if (res.ok) {
      const data = await res.json();
      setReferrals(data.referrals);
      setReferralsTotal(data.total);
    }
  };

  const handleFlaggedFilterChange = async (filter: string) => {
    setFlaggedFilter(filter);
    const params = new URLSearchParams();
    if (filter === "true") params.set("flagged", "true");
    if (filter === "false") params.set("flagged", "false");
    const res = await fetch(`/api/admin/behavioral-health?${params}`);
    if (res.ok) {
      const data = await res.json();
      setScreenings(data.screenings);
      setScreeningsTotal(data.total);
    }
  };

  const handleReferralFilterChange = async (filter: string) => {
    setReferralStatusFilter(filter);
    const params = new URLSearchParams({ action: "referrals" });
    if (filter !== "all") params.set("status", filter);
    const res = await fetch(`/api/admin/behavioral-health?${params}`);
    if (res.ok) {
      const data = await res.json();
      setReferrals(data.referrals);
      setReferralsTotal(data.total);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Behavioral Health</h2>
        <p className="text-sm text-graphite-400">
          Screenings, risk assessments, and referral management
        </p>
      </div>

      {/* Flagged Alert */}
      {metrics.unflaggedUnreviewed > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-800">
              {metrics.unflaggedUnreviewed} flagged screening(s) need review
            </p>
            <p className="text-xs text-red-600">
              Patients with elevated scores require clinical review
            </p>
          </div>
          <Button
            size="sm"
            className="ml-auto bg-red-600 text-white hover:bg-red-700"
            onClick={() => { setActiveTab("screenings"); handleFlaggedFilterChange("true"); }}
          >
            Review Now
          </Button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Brain className="h-5 w-5 text-teal" />
            <div>
              <p className="text-xs text-graphite-400">Total Screenings</p>
              <p className="text-xl font-bold text-navy">{metrics.totalScreenings}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-xs text-graphite-400">Flagged</p>
              <p className="text-xl font-bold text-red-600">{metrics.flaggedCount}</p>
              <p className="text-[10px] text-graphite-400">{metrics.flaggedRate}% rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-xs text-graphite-400">Referrals Pending</p>
              <p className="text-xl font-bold text-navy">{metrics.pendingReferrals}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-graphite-400">Completed Referrals</p>
              <p className="text-xl font-bold text-navy">{metrics.completedReferrals}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 rounded-xl bg-navy-50/50 p-1">
        <button
          onClick={() => setActiveTab("screenings")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "screenings"
              ? "bg-white text-navy shadow-sm"
              : "text-graphite-400 hover:text-navy"
          }`}
        >
          <ClipboardCheck className="mr-2 inline-block h-4 w-4" />
          Screenings ({screeningsTotal})
        </button>
        <button
          onClick={() => setActiveTab("referrals")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "referrals"
              ? "bg-white text-navy shadow-sm"
              : "text-graphite-400 hover:text-navy"
          }`}
        >
          <Brain className="mr-2 inline-block h-4 w-4" />
          Referrals ({referralsTotal})
        </button>
      </div>

      {/* Screenings Table */}
      {activeTab === "screenings" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Screenings</CardTitle>
            <select
              value={flaggedFilter}
              onChange={(e) => handleFlaggedFilterChange(e.target.value)}
              className="rounded-xl border border-navy-100/40 bg-white px-3 py-1.5 text-xs"
            >
              <option value="all">All Screenings</option>
              <option value="true">Flagged Only</option>
              <option value="false">Not Flagged</option>
            </select>
          </CardHeader>
          <CardContent>
            {screenings.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No screenings found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/30 text-left text-xs text-graphite-400">
                      <th className="pb-2 pr-4 font-medium">Patient</th>
                      <th className="pb-2 pr-4 font-medium">Type</th>
                      <th className="pb-2 pr-4 font-medium">Score</th>
                      <th className="pb-2 pr-4 font-medium">Severity</th>
                      <th className="pb-2 pr-4 font-medium">Flagged</th>
                      <th className="pb-2 pr-4 font-medium">Reviewed</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/20">
                    {screenings.map((s) => (
                      <tr key={s.id} className={`hover:bg-navy-50/30 ${s.flagged && !s.reviewedBy ? "bg-red-50/30" : ""}`}>
                        <td className="py-3 pr-4">
                          <div>
                            <p className="font-medium text-navy">{s.patientName}</p>
                            <p className="text-[10px] text-graphite-400">{s.patientEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className={screeningTypeColors[s.type] || "bg-gray-100"}>
                            {s.type}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 font-mono font-bold text-navy">{s.score}</td>
                        <td className="py-3 pr-4">
                          <Badge className={severityColors[s.severity] || "bg-gray-100"}>
                            {s.severity.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          {s.flagged && (
                            <span className="inline-flex h-3 w-3 rounded-full bg-red-500" title="Flagged" />
                          )}
                        </td>
                        <td className="py-3 pr-4 text-xs text-graphite-500">
                          {s.reviewedBy ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <CheckCircle className="h-3 w-3" /> Reviewed
                            </span>
                          ) : (
                            <span className="text-graphite-300">Pending</span>
                          )}
                        </td>
                        <td className="py-3">
                          {!s.reviewedBy && (
                            <button
                              onClick={() => handleReview(s.id)}
                              className="rounded-lg bg-teal-50 p-1.5 text-teal-700 hover:bg-teal-100"
                              title="Mark as Reviewed"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Referrals Table */}
      {activeTab === "referrals" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Referrals</CardTitle>
            <select
              value={referralStatusFilter}
              onChange={(e) => handleReferralFilterChange(e.target.value)}
              className="rounded-xl border border-navy-100/40 bg-white px-3 py-1.5 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="DECLINED">Declined</option>
            </select>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No referrals found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/30 text-left text-xs text-graphite-400">
                      <th className="pb-2 pr-4 font-medium">Patient</th>
                      <th className="pb-2 pr-4 font-medium">Type</th>
                      <th className="pb-2 pr-4 font-medium">Status</th>
                      <th className="pb-2 pr-4 font-medium">Provider</th>
                      <th className="pb-2 pr-4 font-medium">Scheduled</th>
                      <th className="pb-2 pr-4 font-medium">Completed</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/20">
                    {referrals.map((r) => (
                      <tr key={r.id} className="hover:bg-navy-50/30">
                        <td className="py-3 pr-4">
                          <div>
                            <p className="font-medium text-navy">{r.patientName}</p>
                            <p className="text-[10px] text-graphite-400">{r.patientEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className={referralTypeColors[r.referralType] || "bg-gray-100"}>
                            {r.referralType.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className={referralStatusColors[r.status] || "bg-gray-100"}>
                            {r.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-xs text-graphite-500">
                          {r.providerName || "-"}
                        </td>
                        <td className="py-3 pr-4 text-xs text-graphite-500">
                          {r.scheduledAt ? new Date(r.scheduledAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3 pr-4 text-xs text-graphite-500">
                          {r.completedAt ? new Date(r.completedAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3">
                          {r.status === "PENDING" && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleUpdateReferral(r.id, "SCHEDULED")}
                                className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 hover:bg-blue-100"
                              >
                                Schedule
                              </button>
                              <button
                                onClick={() => handleUpdateReferral(r.id, "DECLINED")}
                                className="rounded-lg bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-100"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                          {r.status === "SCHEDULED" && (
                            <button
                              onClick={() => handleUpdateReferral(r.id, "COMPLETED")}
                              className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
