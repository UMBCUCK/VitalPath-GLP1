"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/admin/kpi-card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  Users, AlertTriangle, PauseCircle, XCircle, TrendingUp, TrendingDown,
  Mail, Tag, RefreshCw, Shield, Activity, Loader2, CheckCircle,
  Download, Search, Eye, Ban, Archive, RotateCcw, ChevronDown,
  ChevronRight, Building2, DollarSign, Calendar, Clock,
  AlertCircle, Layers, ToggleLeft, ToggleRight, Filter,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ActionChip } from "@/components/admin/action-chip";

// ─── Types ─────────────────────────────────────────────────

interface SubscriptionRow {
  id: string;
  userId: string;
  name: string;
  email: string;
  isArchived: boolean;
  state: string | null;
  plan: string;
  status: string;
  interval: string;
  startDate: string;
  durationDays: number;
  durationMonths: number;
  amount: number;
  totalPaid: number;
  orderCount: number;
  paymentGaps: string[];
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAt: string | null;
  canceledAt: string | null;
  cancelReason: string | null;
  saveOfferApplied: boolean;
  saveOfferType: string | null;
  pausedUntil: string | null;
  referredByReseller: string | null;
  adminLocked: boolean;
  adminNotes: string | null;
  stripeSubscriptionId: string | null;
}

interface ResellerStat {
  id: string;
  displayName: string;
  companyName: string | null;
  contactEmail: string;
  tier: string;
  status: string;
  activeSubscribers: number;
  totalSubscribers: number;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  mrr: number;
  commissionPct: number | null;
  commissionType: string;
  recentSubscribers: Array<{
    id: string; name: string; email: string; status: string; amount: number;
  }>;
}

interface Props {
  health: {
    active: number; trialing: number; pastDue: number; paused: number;
    canceledRecent: number; newRecent: number; netGrowth: number;
  };
  atRisk: {
    subscriptions: Array<{
      id: string; userId: string; name: string; email: string; plan: string;
      status: string; riskSignal: string; daysInactive: number | null;
      cancelAt: Date | string | null; amount: number;
    }>;
    total: number;
  };
  savePerformance: {
    offers: { type: string; count: number }[];
    totalSaved: number; totalCancellations: number; saveRate: number;
  };
  dunning: {
    subscriptions: Array<{
      id: string; userId: string; name: string; email: string; plan: string;
      amount: number; daysPastDue: number; periodEnd: Date | string | null;
    }>;
    total: number;
  };
  churnDistribution: {
    label: string; min: number; max: number; count: number; color: string;
  }[];
  highChurn: {
    patients: Array<{
      userId: string; name: string; email: string; churnRisk: number;
      healthScore: number; churnRiskFactors: Record<string, number> | null;
      daysInactive: number | null; plan: string; subscriptionStatus: string;
    }>;
    total: number;
  };
  recommendations: Record<string, { action: string; type: string; priority: string }>;
  allSubs: { subscriptions: SubscriptionRow[]; total: number };
  resellerStats: ResellerStat[];
  currentTab: string;
  page: number;
  currentStatus: string;
  currentSearch: string;
  currentReseller: string;
}

// ─── Helpers ───────────────────────────────────────────────

function formatDuration(days: number): string {
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`;
}

const STATUS_BADGE: Record<string, "success" | "warning" | "destructive" | "secondary" | "default"> = {
  ACTIVE: "success",
  TRIALING: "default",
  PAST_DUE: "destructive",
  PAUSED: "warning",
  CANCELED: "secondary",
  EXPIRED: "secondary",
};

const TIER_COLORS: Record<string, string> = {
  AMBASSADOR: "text-amber-600 bg-amber-50 border-amber-200",
  GOLD: "text-yellow-700 bg-yellow-50 border-yellow-200",
  SILVER: "text-slate-600 bg-slate-50 border-slate-200",
  STANDARD: "text-graphite-500 bg-linen border-navy-100",
  CUSTOM: "text-teal bg-teal-50 border-teal-200",
};

// ─── Cancel Modal ──────────────────────────────────────────

function CancelModal({
  sub,
  onClose,
  onDone,
}: {
  sub: SubscriptionRow;
  onClose: () => void;
  onDone: (id: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [immediately, setImmediately] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: sub.id, reason, immediately }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      onDone(sub.id);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Ban className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-navy">Cancel Subscription</h3>
            <p className="text-xs text-graphite-400">{sub.name} · {sub.plan}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Cancellation Reason</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer request, non-payment..."
              disabled={loading}
            />
          </div>

          <div className="rounded-xl border border-navy-100/40 p-3 space-y-2">
            <p className="text-xs font-semibold text-navy">When to Cancel</p>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!immediately}
                onChange={() => setImmediately(false)}
                className="mt-0.5 accent-teal"
              />
              <div>
                <p className="text-sm font-medium text-navy">At end of billing period</p>
                <p className="text-xs text-graphite-400">Customer retains access until {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "period end"}</p>
              </div>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                checked={immediately}
                onChange={() => setImmediately(true)}
                className="mt-0.5 accent-red-500"
              />
              <div>
                <p className="text-sm font-medium text-red-600">Immediately</p>
                <p className="text-xs text-graphite-400">Access revoked now. No partial refund issued.</p>
              </div>
            </label>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="mt-5 flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
            {immediately ? "Cancel Immediately" : "Schedule Cancellation"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Archive Modal ─────────────────────────────────────────

function ArchiveModal({
  userId,
  name,
  email,
  onClose,
  onDone,
}: {
  userId: string;
  name: string;
  email: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleArchive() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      onDone();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <Archive className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-navy">Archive Account</h3>
            <p className="text-xs text-graphite-400">{name} · {email}</p>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ What archiving does:</p>
          <ul className="text-xs text-amber-700 space-y-1 list-disc ml-4">
            <li>Cancels all active subscriptions in Stripe</li>
            <li>Prevents the user from logging in</li>
            <li>Preserves all data (orders, progress, messages)</li>
            <li>Full snapshot saved to audit trail for recovery</li>
            <li>Account can be restored by an admin at any time</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Reason for archiving</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Duplicate account, fraud, request..."
              disabled={loading}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="h-4 w-4 rounded accent-amber-600"
            />
            <span className="text-xs text-graphite-500">
              I understand this action will cancel all subscriptions and prevent login
            </span>
          </label>
        </div>

        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

        <div className="mt-5 flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleArchive}
            disabled={!confirmed || !reason.trim() || loading}
          >
            {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Archive className="mr-1 h-3 w-3" />}
            Archive Account
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────

export function SubscriptionsClient({
  health, atRisk, savePerformance, dunning, churnDistribution,
  highChurn, recommendations, allSubs, resellerStats,
  currentTab, page, currentStatus, currentSearch, currentReseller,
}: Props) {
  const router = useRouter();

  // Action states (at-risk / dunning)
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionDone, setActionDone] = useState<Set<string>>(new Set());

  // All-subs tab state
  const [advancedView, setAdvancedView] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [cancelModal, setCancelModal] = useState<SubscriptionRow | null>(null);
  const [archiveModal, setArchiveModal] = useState<SubscriptionRow | null>(null);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [expandedReseller, setExpandedReseller] = useState<string | null>(null);

  const setTab = (tab: string) => router.push(`/admin/subscriptions?tab=${tab}`);

  const updateParams = (updates: Record<string, string | number | null>) => {
    const p = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") p.delete(k);
      else p.set(k, String(v));
    });
    router.push(`/admin/subscriptions?${p.toString()}`);
  };

  // ── Outreach (at-risk) ────────────────────────────────

  async function handleOutreach(
    subscriptionId: string, action: "email" | "coupon",
    userId: string, email: string, name: string
  ) {
    const key = `${subscriptionId}-${action}`;
    if (actionLoading) return;
    setActionLoading(key);
    try {
      const res = await fetch("/api/admin/subscriptions/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, action, userId, email, name }),
      });
      if (res.ok) {
        setActionDone((prev) => new Set(prev).add(key));
        setTimeout(() => setActionDone((prev) => { const n = new Set(prev); n.delete(key); return n; }), 3000);
      } else {
        const d = await res.json();
        alert(d.error || "Action failed");
      }
    } catch { alert("Network error."); }
    finally { setActionLoading(null); }
  }

  async function handleDunning(
    subscriptionId: string, action: "retry" | "remind",
    email: string, name: string
  ) {
    const key = `${subscriptionId}-${action}`;
    if (actionLoading) return;
    setActionLoading(key);
    try {
      const res = await fetch("/api/admin/subscriptions/dunning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, action, email, name }),
      });
      if (res.ok) {
        setActionDone((prev) => new Set(prev).add(key));
        setTimeout(() => setActionDone((prev) => { const n = new Set(prev); n.delete(key); return n; }), 3000);
        if (action === "retry") router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "Action failed");
      }
    } catch { alert("Network error."); }
    finally { setActionLoading(null); }
  }

  // ── CSV Export ────────────────────────────────────────

  function exportCSV(rows: SubscriptionRow[], filename = "subscriptions") {
    const headers = [
      "Name", "Email", "State", "Plan", "Status", "Interval",
      "Started", "Duration (months)", "Monthly Amount ($)",
      "Total Paid ($)", "Orders", "Payment Gaps",
      "Period End", "Cancel Date", "Reseller ID", "Archived", "Stripe ID",
    ];
    const data = rows.map((r) => [
      r.name, r.email, r.state || "", r.plan, r.status, r.interval,
      new Date(r.startDate).toISOString().slice(0, 10),
      r.durationMonths,
      (r.amount / 100).toFixed(2),
      (r.totalPaid / 100).toFixed(2),
      r.orderCount,
      r.paymentGaps.join(" | ") || "None",
      r.currentPeriodEnd ? new Date(r.currentPeriodEnd).toISOString().slice(0, 10) : "",
      r.cancelAt ? new Date(r.cancelAt).toISOString().slice(0, 10) : "",
      r.referredByReseller || "",
      r.isArchived ? "Yes" : "No",
      r.stripeSubscriptionId || "",
    ]);

    const csv = [headers, ...data]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Selection helpers ─────────────────────────────────

  const toggleSelect = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const allSelected = allSubs.subscriptions.length > 0 &&
    allSubs.subscriptions.every((s) => selected.has(s.id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allSubs.subscriptions.map((s) => s.id)));
  };

  // ── Stats for All tab ─────────────────────────────────

  const allSubsStats = useMemo(() => {
    const rows = allSubs.subscriptions;
    const activeMRR = rows
      .filter((r) => r.status === "ACTIVE" || r.status === "TRIALING")
      .reduce((sum, r) => sum + r.amount, 0);
    const avgDuration = rows.length
      ? Math.round(rows.reduce((sum, r) => sum + r.durationMonths, 0) / rows.length)
      : 0;
    const withGaps = rows.filter((r) => r.paymentGaps.length > 0).length;
    return { activeMRR, avgDuration, withGaps };
  }, [allSubs.subscriptions]);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "all", label: `All (${allSubs.total})` },
    { key: "at_risk", label: `At-Risk (${atRisk.total})` },
    { key: "churn_risk", label: `Churn (${highChurn.total})` },
    { key: "dunning", label: `Dunning (${dunning.total})` },
    { key: "resellers", label: `Resellers (${resellerStats.length})` },
    { key: "save_offers", label: "Save Offers" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Subscription Operations</h2>
          <p className="text-sm text-graphite-400">Health monitoring, lifecycle management, and reseller tracking</p>
        </div>
      </div>

      {/* Health KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <KPICard title="Active" value={String(health.active)} icon={Users} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <KPICard title="Trialing" value={String(health.trialing)} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <KPICard title="Past Due" value={String(health.pastDue)} icon={AlertTriangle} iconColor="text-red-500" iconBg="bg-red-50" />
        <KPICard title="Paused" value={String(health.paused)} icon={PauseCircle} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <KPICard title="Canceled (30d)" value={String(health.canceledRecent)} icon={XCircle} iconColor="text-red-500" iconBg="bg-red-50" />
        <KPICard
          title="Net Growth"
          value={`${health.netGrowth >= 0 ? "+" : ""}${health.netGrowth}`}
          icon={health.netGrowth >= 0 ? TrendingUp : TrendingDown}
          iconColor={health.netGrowth >= 0 ? "text-emerald-600" : "text-red-500"}
          iconBg={health.netGrowth >= 0 ? "bg-emerald-50" : "bg-red-50"}
        />
      </div>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-1 rounded-xl bg-linen/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
              currentTab === tab.key
                ? "bg-white text-navy shadow-sm"
                : "text-graphite-400 hover:text-graphite-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ───────────────────────────────────── */}
      {currentTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Recent At-Risk</CardTitle></CardHeader>
            <CardContent>
              {atRisk.subscriptions.slice(0, 5).map((sub) => (
                <div key={sub.id} className="flex items-center justify-between border-b border-navy-100/20 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-navy">{sub.name}</p>
                    <p className="text-xs text-graphite-400">{sub.plan} · {sub.riskSignal}</p>
                  </div>
                  <Badge variant={sub.status === "PAST_DUE" ? "destructive" : "warning"}>{sub.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Save Offer Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-700">{savePerformance.totalSaved}</p>
                  <p className="text-[10px] text-emerald-500">Saved</p>
                </div>
                <div className="rounded-xl bg-red-50 p-3 text-center">
                  <p className="text-lg font-bold text-red-700">{savePerformance.totalCancellations}</p>
                  <p className="text-[10px] text-red-400">Canceled</p>
                </div>
                <div className="rounded-xl bg-teal-50 p-3 text-center">
                  <p className="text-lg font-bold text-teal">{savePerformance.saveRate}%</p>
                  <p className="text-[10px] text-teal-600">Save Rate</p>
                </div>
              </div>
              {savePerformance.offers.map((offer) => (
                <div key={offer.type} className="flex items-center justify-between rounded-lg bg-linen/30 px-3 py-2 mb-1">
                  <span className="text-sm text-graphite-500 capitalize">{offer.type}</span>
                  <Badge variant="secondary">{offer.count} saved</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── ALL SUBSCRIPTIONS TAB ─────────────────────────── */}
      {currentTab === "all" && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Layers className="h-5 w-5 text-teal" />
                <div>
                  <p className="text-xs text-graphite-400">Total Records</p>
                  <p className="text-xl font-bold text-navy">{allSubs.total.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-xs text-graphite-400">Active MRR</p>
                  <p className="text-xl font-bold text-navy">{formatPrice(allSubsStats.activeMRR)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-graphite-400">Avg Duration</p>
                  <p className="text-xl font-bold text-navy">{allSubsStats.avgDuration}mo</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-xs text-graphite-400">Payment Gaps</p>
                  <p className="text-xl font-bold text-navy">{allSubsStats.withGaps}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-3 py-2 flex-1 min-w-[200px] max-w-xs">
              <Search className="h-4 w-4 text-graphite-400 shrink-0" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && updateParams({ search: searchInput, page: 1 })}
                className="w-full bg-transparent text-sm outline-none text-navy placeholder:text-graphite-300"
              />
            </div>

            {/* Status filter */}
            <select
              value={currentStatus}
              onChange={(e) => updateParams({ status: e.target.value || null, page: 1 })}
              className="rounded-xl border border-navy-200 bg-white px-3 py-2 text-sm text-navy"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="past_due">Past Due</option>
              <option value="paused">Paused</option>
              <option value="canceled">Canceled</option>
            </select>

            {/* Advanced view toggle */}
            <button
              onClick={() => setAdvancedView((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                advancedView
                  ? "border-teal/40 bg-teal-50 text-teal"
                  : "border-navy-200 bg-white text-graphite-500 hover:text-navy"
              )}
            >
              {advancedView ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              Advanced View
            </button>

            <div className="flex gap-2 ml-auto">
              {/* Bulk actions */}
              {selected.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs border border-navy-200"
                  onClick={() => exportCSV(
                    allSubs.subscriptions.filter((s) => selected.has(s.id)),
                    "subscriptions-selected"
                  )}
                >
                  <Download className="mr-1 h-3.5 w-3.5" />
                  Export {selected.size} selected
                </Button>
              )}
              {/* Export all */}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs border border-navy-200"
                onClick={() => exportCSV(allSubs.subscriptions)}
              >
                <Download className="mr-1 h-3.5 w-3.5" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-navy-50/30">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="h-4 w-4 rounded accent-teal"
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-graphite-400">Customer</th>
                    <th className="px-4 py-3 text-left font-medium text-graphite-400">Plan</th>
                    <th className="px-4 py-3 text-left font-medium text-graphite-400">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-graphite-400">Started</th>
                    <th className="px-4 py-3 text-left font-medium text-graphite-400">Duration</th>
                    <th className="px-4 py-3 text-left font-medium text-graphite-400">Monthly</th>
                    {advancedView && (
                      <>
                        <th className="px-4 py-3 text-left font-medium text-graphite-400">Total Paid</th>
                        <th className="px-4 py-3 text-left font-medium text-graphite-400">Period End</th>
                        <th className="px-4 py-3 text-left font-medium text-graphite-400">Gaps</th>
                        <th className="px-4 py-3 text-left font-medium text-graphite-400">Reseller</th>
                        <th className="px-4 py-3 text-left font-medium text-graphite-400 max-w-[120px]">Stripe ID</th>
                      </>
                    )}
                    <th className="px-4 py-3 text-right font-medium text-graphite-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {allSubs.subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={advancedView ? 13 : 8} className="py-12 text-center text-sm text-graphite-300">
                        No subscriptions match your filters
                      </td>
                    </tr>
                  ) : allSubs.subscriptions.map((sub) => (
                    <tr
                      key={sub.id}
                      className={cn(
                        "hover:bg-navy-50/20 transition-colors",
                        sub.isArchived && "opacity-50",
                        selected.has(sub.id) && "bg-teal-50/30"
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(sub.id)}
                          onChange={() => toggleSelect(sub.id)}
                          className="h-4 w-4 rounded accent-teal"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-navy text-sm">{sub.name}</p>
                              {sub.isArchived && (
                                <Badge variant="secondary" className="text-[9px] px-1 py-0">Archived</Badge>
                              )}
                              {sub.adminLocked && (
                                <span title="Admin locked" className="text-amber-500">🔒</span>
                              )}
                            </div>
                            <p className="text-xs text-graphite-400">{sub.email}</p>
                            {sub.state && <p className="text-[10px] text-graphite-300">{sub.state}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-navy">{sub.plan}</p>
                        <p className="text-[10px] text-graphite-400 capitalize">{sub.interval.toLowerCase()}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_BADGE[sub.status] || "secondary"}>
                          {sub.status}
                        </Badge>
                        {sub.cancelAt && sub.status !== "CANCELED" && (
                          <p className="text-[9px] text-amber-600 mt-0.5">
                            Cancels {new Date(sub.cancelAt).toLocaleDateString()}
                          </p>
                        )}
                        {sub.saveOfferApplied && (
                          <p className="text-[9px] text-teal mt-0.5">Save offer applied</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-graphite-500">
                        {new Date(sub.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-navy">{formatDuration(sub.durationDays)}</span>
                        {sub.paymentGaps.length > 0 && (
                          <div title={`Gap months: ${sub.paymentGaps.join(", ")}`}>
                            <Badge variant="warning" className="text-[9px] mt-0.5 cursor-help">
                              {sub.paymentGaps.length} gap{sub.paymentGaps.length > 1 ? "s" : ""}
                            </Badge>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-navy">
                        {formatPrice(sub.amount)}
                      </td>

                      {advancedView && (
                        <>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-navy">{formatPrice(sub.totalPaid)}</p>
                            <p className="text-[10px] text-graphite-400">{sub.orderCount} orders</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-graphite-500">
                            {sub.currentPeriodEnd
                              ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {sub.paymentGaps.length === 0 ? (
                              <span className="text-xs text-graphite-300">None</span>
                            ) : (
                              <div className="flex flex-wrap gap-0.5 max-w-[120px]">
                                {sub.paymentGaps.map((g) => (
                                  <span key={g} className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 rounded px-1">{g}</span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {sub.referredByReseller ? (
                              <span className="text-xs text-teal font-medium truncate max-w-[80px] block">
                                {resellerStats.find((r) => r.id === sub.referredByReseller)?.displayName || sub.referredByReseller.slice(-8)}
                              </span>
                            ) : (
                              <span className="text-xs text-graphite-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {sub.stripeSubscriptionId ? (
                              <span className="font-mono text-[10px] text-graphite-400 truncate block max-w-[110px]">
                                {sub.stripeSubscriptionId}
                              </span>
                            ) : (
                              <span className="text-xs text-graphite-300">—</span>
                            )}
                          </td>
                        </>
                      )}

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/customers/${sub.userId}`}
                            className="rounded-lg p-1.5 text-graphite-400 hover:bg-teal-50 hover:text-teal transition-colors"
                            title="View profile"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          {sub.status !== "CANCELED" && !sub.isArchived && (
                            <button
                              onClick={() => setCancelModal(sub)}
                              className="rounded-lg p-1.5 text-graphite-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              title="Cancel subscription"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {!sub.isArchived && (
                            <button
                              onClick={() => setArchiveModal(sub)}
                              className="rounded-lg p-1.5 text-graphite-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                              title="Archive account"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {allSubs.total > 50 && (
            <div className="flex items-center justify-between px-2">
              <p className="text-xs text-graphite-400">
                Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, allSubs.total)} of {allSubs.total}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => updateParams({ page: page - 1 })}>
                    Previous
                  </Button>
                )}
                {page * 50 < allSubs.total && (
                  <Button variant="ghost" size="sm" onClick={() => updateParams({ page: page + 1 })}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── AT RISK TAB ────────────────────────────────────── */}
      {currentTab === "at_risk" && (
        <Card>
          <CardContent className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 text-left">
                  <th className="pb-3 font-medium text-graphite-400">Customer</th>
                  <th className="pb-3 font-medium text-graphite-400">Plan</th>
                  <th className="pb-3 font-medium text-graphite-400">Risk Signal</th>
                  <th className="pb-3 font-medium text-graphite-400">Inactive</th>
                  <th className="pb-3 font-medium text-graphite-400">Amount</th>
                  <th className="pb-3 font-medium text-graphite-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {atRisk.subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-linen/20">
                    <td className="py-3">
                      <p className="font-medium text-navy">{sub.name}</p>
                      <p className="text-xs text-graphite-400">{sub.email}</p>
                    </td>
                    <td className="py-3 text-graphite-500">{sub.plan}</td>
                    <td className="py-3">
                      <Badge variant={sub.status === "PAST_DUE" ? "destructive" : "warning"}>
                        {sub.riskSignal}
                      </Badge>
                    </td>
                    <td className="py-3 text-graphite-500">
                      {sub.daysInactive !== null ? `${sub.daysInactive}d` : "—"}
                    </td>
                    <td className="py-3 font-medium text-navy">{formatPrice(sub.amount)}/mo</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs"
                          onClick={() => handleOutreach(sub.id, "email", sub.userId, sub.email, sub.name)}
                          disabled={!!actionLoading}>
                          {actionLoading === `${sub.id}-email`
                            ? <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            : actionDone.has(`${sub.id}-email`)
                            ? <CheckCircle className="mr-1 h-3 w-3 text-teal" />
                            : <Mail className="mr-1 h-3 w-3" />}
                          {actionDone.has(`${sub.id}-email`) ? "Sent!" : "Email"}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs"
                          onClick={() => handleOutreach(sub.id, "coupon", sub.userId, sub.email, sub.name)}
                          disabled={!!actionLoading}>
                          {actionLoading === `${sub.id}-coupon`
                            ? <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            : actionDone.has(`${sub.id}-coupon`)
                            ? <CheckCircle className="mr-1 h-3 w-3 text-teal" />
                            : <Tag className="mr-1 h-3 w-3" />}
                          {actionDone.has(`${sub.id}-coupon`) ? "Sent!" : "Coupon"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ── DUNNING TAB ────────────────────────────────────── */}
      {currentTab === "dunning" && (
        <Card>
          <CardContent className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 text-left">
                  <th className="pb-3 font-medium text-graphite-400">Customer</th>
                  <th className="pb-3 font-medium text-graphite-400">Plan</th>
                  <th className="pb-3 font-medium text-graphite-400">Days Past Due</th>
                  <th className="pb-3 font-medium text-graphite-400">Amount</th>
                  <th className="pb-3 font-medium text-graphite-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {dunning.subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-linen/20">
                    <td className="py-3">
                      <p className="font-medium text-navy">{sub.name}</p>
                      <p className="text-xs text-graphite-400">{sub.email}</p>
                    </td>
                    <td className="py-3 text-graphite-500">{sub.plan}</td>
                    <td className="py-3">
                      <Badge variant={sub.daysPastDue > 7 ? "destructive" : "warning"}>
                        {sub.daysPastDue} days
                      </Badge>
                    </td>
                    <td className="py-3 font-medium text-navy">{formatPrice(sub.amount)}/mo</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 text-xs"
                          onClick={() => handleDunning(sub.id, "retry", sub.email, sub.name)}
                          disabled={!!actionLoading}>
                          {actionLoading === `${sub.id}-retry`
                            ? <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            : actionDone.has(`${sub.id}-retry`)
                            ? <CheckCircle className="mr-1 h-3 w-3 text-teal" />
                            : <RefreshCw className="mr-1 h-3 w-3" />}
                          {actionDone.has(`${sub.id}-retry`) ? "Done!" : "Retry"}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs"
                          onClick={() => handleDunning(sub.id, "remind", sub.email, sub.name)}
                          disabled={!!actionLoading}>
                          {actionLoading === `${sub.id}-remind`
                            ? <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            : actionDone.has(`${sub.id}-remind`)
                            ? <CheckCircle className="mr-1 h-3 w-3 text-teal" />
                            : <Mail className="mr-1 h-3 w-3" />}
                          {actionDone.has(`${sub.id}-remind`) ? "Sent!" : "Remind"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ── SAVE OFFERS TAB ────────────────────────────────── */}
      {currentTab === "save_offers" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal" /> Save Offer Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <p className="text-3xl font-bold text-emerald-700">{savePerformance.totalSaved}</p>
                <p className="text-sm text-emerald-600">Customers Saved</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-3xl font-bold text-red-700">{savePerformance.totalCancellations}</p>
                <p className="text-sm text-red-600">Total Cancellations</p>
              </div>
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-center">
                <p className="text-3xl font-bold text-teal">{savePerformance.saveRate}%</p>
                <p className="text-sm text-teal-600">Overall Save Rate</p>
              </div>
            </div>
            <h4 className="mb-3 text-sm font-semibold text-navy">By Offer Type</h4>
            <div className="space-y-2">
              {savePerformance.offers.length === 0 ? (
                <p className="py-4 text-center text-sm text-graphite-300">No save offers applied yet</p>
              ) : savePerformance.offers.map((offer) => {
                const pct = savePerformance.totalSaved > 0 ? (offer.count / savePerformance.totalSaved) * 100 : 0;
                return (
                  <div key={offer.type} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-graphite-500 capitalize">{offer.type}</span>
                    <div className="flex-1 h-4 rounded-full bg-navy-50">
                      <div className="h-4 rounded-full bg-teal" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-16 text-right text-sm font-medium text-navy">{offer.count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── CHURN RISK TAB ─────────────────────────────────── */}
      {currentTab === "churn_risk" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-500" /> Churn Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {churnDistribution.every((b) => b.count === 0) ? (
                <p className="py-8 text-center text-sm text-graphite-300">No churn data yet.</p>
              ) : (
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={churnDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#677A8A" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#677A8A" }} />
                      <Tooltip formatter={(v: number) => [v, "Patients"]} contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {churnDistribution.map((band, i) => <Cell key={i} fill={band.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">High Churn Risk Patients ({highChurn.total})</CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-x-auto">
              {highChurn.patients.length === 0 ? (
                <p className="py-8 text-center text-sm text-graphite-300">No high-churn patients detected</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/40 text-left">
                      <th className="pb-3 font-medium text-graphite-400">Name</th>
                      <th className="pb-3 font-medium text-graphite-400">Churn Risk</th>
                      <th className="pb-3 font-medium text-graphite-400">Health Score</th>
                      <th className="pb-3 font-medium text-graphite-400">Days Inactive</th>
                      <th className="pb-3 font-medium text-graphite-400">Plan</th>
                      <th className="pb-3 font-medium text-graphite-400">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/30">
                    {highChurn.patients.map((patient) => {
                      const rec = recommendations[patient.userId];
                      return (
                        <tr key={patient.userId} className="hover:bg-linen/20">
                          <td className="py-3">
                            <p className="font-medium text-navy">{patient.name}</p>
                            <p className="text-xs text-graphite-400">{patient.email}</p>
                          </td>
                          <td className="py-3">
                            <Badge variant={patient.churnRisk >= 80 ? "destructive" : patient.churnRisk >= 60 ? "warning" : "default"}>
                              {patient.churnRisk}%
                            </Badge>
                          </td>
                          <td className="py-3">
                            <span className={cn("font-medium", patient.healthScore >= 70 ? "text-emerald-600" : patient.healthScore >= 40 ? "text-amber-600" : "text-red-500")}>
                              {patient.healthScore}
                            </span>
                          </td>
                          <td className="py-3 text-graphite-500">
                            {patient.daysInactive !== null ? `${patient.daysInactive}d` : "--"}
                          </td>
                          <td className="py-3 text-graphite-500">{patient.plan}</td>
                          <td className="py-3">
                            {rec ? (
                              <ActionChip recommendation={{ action: rec.action, type: rec.type as any, priority: rec.priority as any }} />
                            ) : (
                              <span className="text-xs text-graphite-300">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── RESELLERS TAB ──────────────────────────────────── */}
      {currentTab === "resellers" && (
        <div className="space-y-4">
          {/* Reseller stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Building2 className="h-5 w-5 text-teal" />
                <div>
                  <p className="text-xs text-graphite-400">Total Resellers</p>
                  <p className="text-xl font-bold text-navy">{resellerStats.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-graphite-400">Total Subscribers via Resellers</p>
                  <p className="text-xl font-bold text-navy">
                    {resellerStats.reduce((s, r) => s + r.activeSubscribers, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-xs text-graphite-400">Total Commission Paid</p>
                  <p className="text-xl font-bold text-navy">
                    {formatPrice(resellerStats.reduce((s, r) => s + r.totalCommission, 0))}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reseller table */}
          <Card>
            <CardContent className="p-0">
              {resellerStats.length === 0 ? (
                <div className="py-16 text-center text-sm text-graphite-300">
                  <Building2 className="mx-auto mb-3 h-8 w-8 opacity-30" />
                  <p>No resellers yet</p>
                </div>
              ) : (
                <div className="divide-y divide-navy-100/30">
                  {resellerStats.map((reseller) => {
                    const isExpanded = expandedReseller === reseller.id;
                    return (
                      <div key={reseller.id}>
                        <div
                          className="flex items-center gap-4 px-6 py-4 hover:bg-navy-50/20 cursor-pointer transition-colors"
                          onClick={() => setExpandedReseller(isExpanded ? null : reseller.id)}
                        >
                          {/* Expand toggle */}
                          <div className="text-graphite-400">
                            {isExpanded
                              ? <ChevronDown className="h-4 w-4" />
                              : <ChevronRight className="h-4 w-4" />}
                          </div>

                          {/* Reseller info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-navy">{reseller.displayName}</p>
                              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", TIER_COLORS[reseller.tier] || TIER_COLORS.STANDARD)}>
                                {reseller.tier}
                              </span>
                              <Badge variant={reseller.status === "ACTIVE" ? "success" : "secondary"} className="text-[10px]">
                                {reseller.status}
                              </Badge>
                            </div>
                            {reseller.companyName && (
                              <p className="text-xs text-graphite-400">{reseller.companyName}</p>
                            )}
                            <p className="text-xs text-graphite-400">{reseller.contactEmail}</p>
                          </div>

                          {/* Stats grid */}
                          <div className="hidden sm:grid grid-cols-4 gap-6 text-center">
                            <div>
                              <p className="text-lg font-bold text-navy">{reseller.activeSubscribers}</p>
                              <p className="text-[10px] text-graphite-400">Active Subs</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-navy">{reseller.totalSubscribers}</p>
                              <p className="text-[10px] text-graphite-400">Total Subs</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-teal">{formatPrice(reseller.mrr)}</p>
                              <p className="text-[10px] text-graphite-400">MRR</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-emerald-600">{formatPrice(reseller.totalCommission)}</p>
                              <p className="text-[10px] text-graphite-400">Commission</p>
                            </div>
                          </div>

                          {/* Commission rate */}
                          <div className="text-right">
                            <p className="text-sm font-semibold text-navy">
                              {reseller.commissionPct !== null ? `${reseller.commissionPct}%` : "Custom"}
                            </p>
                            <p className="text-[10px] text-graphite-400">{reseller.commissionType}</p>
                          </div>
                        </div>

                        {/* Expanded subscriber list */}
                        {isExpanded && (
                          <div className="border-t border-navy-100/20 bg-navy-50/20 px-6 py-4">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-semibold text-navy uppercase tracking-wider">
                                Recent Subscribers ({reseller.totalSubscribers} total)
                              </p>
                              <Link
                                href={`/admin/subscriptions?tab=all&reseller=${reseller.id}`}
                                className="text-xs text-teal hover:underline"
                              >
                                View all →
                              </Link>
                            </div>
                            {reseller.recentSubscribers.length === 0 ? (
                              <p className="text-xs text-graphite-300 py-2">No subscribers yet</p>
                            ) : (
                              <div className="space-y-2">
                                {reseller.recentSubscribers.map((sub) => (
                                  <div key={sub.id} className="flex items-center justify-between rounded-lg bg-white border border-navy-100/40 px-4 py-2">
                                    <div>
                                      <p className="text-sm font-medium text-navy">{sub.name}</p>
                                      <p className="text-xs text-graphite-400">{sub.email}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Badge variant={STATUS_BADGE[sub.status] || "secondary"} className="text-[10px]">
                                        {sub.status}
                                      </Badge>
                                      <span className="text-sm font-semibold text-navy">{formatPrice(sub.amount)}/mo</span>
                                      <Link
                                        href={`/admin/customers/${sub.id}`}
                                        className="text-graphite-400 hover:text-teal"
                                      >
                                        <Eye className="h-3.5 w-3.5" />
                                      </Link>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── MODALS ─────────────────────────────────────────── */}
      {cancelModal && (
        <CancelModal
          sub={cancelModal}
          onClose={() => setCancelModal(null)}
          onDone={(id) => {
            setCancelModal(null);
            router.refresh();
          }}
        />
      )}

      {archiveModal && (
        <ArchiveModal
          userId={archiveModal.userId}
          name={archiveModal.name}
          email={archiveModal.email}
          onClose={() => setArchiveModal(null)}
          onDone={() => {
            setArchiveModal(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
