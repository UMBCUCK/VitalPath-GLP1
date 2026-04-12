"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Share2, Users, DollarSign, TrendingUp, Award,
  CheckCircle, Ban, Flag, RotateCcw, Settings2, Zap, Trophy, Mail, RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ReferralRow {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail: string;
  referralCode: string;
  tier: string;
  referredEmail: string | null;
  status: string;
  payoutCents: number | null;
  paidAt: Date | string | null;
  createdAt: Date | string;
}

interface TopReferrer {
  id: string;
  name: string;
  email: string;
  code: string;
  tier: string;
  totalReferred: number;
  totalEarned: number;
}

interface Props {
  referrals: ReferralRow[];
  total: number;
  page: number;
  limit: number;
  currentStatus: string;
  currentSearch: string;
  totalReferrals: number;
  convertedCount: number;
  conversionRate: string;
  totalEarned: number;
  pendingPayoutCents: number;
  topReferrers: TopReferrer[];
  paidCount: number;
  pendingCount: number;
}

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary" | "default"> = {
  CONVERTED: "warning",
  PAID: "success",
  PENDING: "secondary",
  FLAGGED: "destructive",
  EXPIRED: "secondary",
};

function ReferralActions({ row, onRefresh }: { row: ReferralRow; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);

  const doAction = async (action: string) => {
    if (!confirm(`${action} this referral for ${row.referredEmail}?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/referrals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, action }),
      });
      if (res.ok) onRefresh();
      else {
        const d = await res.json();
        alert(d.error || "Action failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (row.status === "PAID") return null;

  return (
    <div className="flex gap-1">
      {row.status === "CONVERTED" && (
        <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-700" onClick={() => doAction("pay")} disabled={loading}>
          <CheckCircle className="mr-1 h-3 w-3" />
          Pay
        </Button>
      )}
      {(row.status === "CONVERTED" || row.status === "PENDING") && (
        <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-700" onClick={() => doAction("flag")} disabled={loading}>
          <Flag className="mr-1 h-3 w-3" />
          Flag
        </Button>
      )}
      {(row.status === "CONVERTED" || row.status === "PENDING") && (
        <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600" onClick={() => doAction("cancel")} disabled={loading}>
          <Ban className="mr-1 h-3 w-3" />
          Cancel
        </Button>
      )}
      {(row.status === "FLAGGED" || row.status === "EXPIRED") && (
        <Button variant="ghost" size="sm" className="h-7 text-xs text-teal-700" onClick={() => doAction("unconvert")} disabled={loading}>
          <RotateCcw className="mr-1 h-3 w-3" />
          Restore
        </Button>
      )}
    </div>
  );
}

const TIER_THRESHOLDS = [
  { name: "Standard", min: 0 },
  { name: "Silver", min: 5 },
  { name: "Gold", min: 10 },
  { name: "Ambassador", min: 25 },
];

export function ReferralsClient({
  referrals,
  total,
  page,
  limit,
  currentStatus,
  currentSearch,
  totalReferrals,
  convertedCount,
  conversionRate,
  totalEarned,
  pendingPayoutCents,
  topReferrers,
  paidCount,
  pendingCount,
}: Props) {
  const router = useRouter();
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [remindLoading, setRemindLoading] = useState(false);
  const [remindResult, setRemindResult] = useState<{ sent: number; skipped: number } | null>(null);
  const [recalcLoading, setRecalcLoading] = useState(false);
  const [recalcResult, setRecalcResult] = useState<{ updated: number; total: number } | null>(null);
  const [settingsPayout, setSettingsPayout] = useState("50");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const convertedReferrals = referrals.filter((r) => r.status === "CONVERTED");

  const handleBulkPay = async () => {
    if (convertedReferrals.length === 0) return;
    if (!confirm(`Mark all ${convertedReferrals.length} CONVERTED referrals as paid? Total: ${formatPrice(convertedReferrals.reduce((s, r) => s + (r.payoutCents || 0), 0))}`)) return;
    setBulkLoading(true);
    try {
      await Promise.all(
        convertedReferrals.map((r) =>
          fetch("/api/admin/referrals", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: r.id, action: "pay" }),
          })
        )
      );
      router.refresh();
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    const cents = Math.round(parseFloat(settingsPayout) * 100);
    if (!cents || cents < 100) return;
    setSettingsSaving(true);
    try {
      await fetch("/api/admin/referral-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultPayoutCents: cents }),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSendReminders = async () => {
    if (!confirm("Send reminder emails to all PENDING referrals older than 24 hours?")) return;
    setRemindLoading(true);
    setRemindResult(null);
    try {
      const res = await fetch("/api/admin/referrals/remind", { method: "POST" });
      const data = await res.json();
      setRemindResult(data);
      setTimeout(() => setRemindResult(null), 8000);
    } finally {
      setRemindLoading(false);
    }
  };

  const handleRecalcTiers = async () => {
    setRecalcLoading(true);
    setRecalcResult(null);
    try {
      const res = await fetch("/api/admin/referrals/recalculate-tiers", { method: "POST" });
      const data = await res.json();
      setRecalcResult(data);
      router.refresh();
      setTimeout(() => setRecalcResult(null), 8000);
    } finally {
      setRecalcLoading(false);
    }
  };

  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`/admin/referrals?${params.toString()}`);
  };

  const columns: ColumnDef<ReferralRow>[] = [
    {
      key: "referrer",
      header: "Referrer",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-navy text-sm">{row.referrerName}</p>
          <p className="text-xs text-graphite-400">{row.referralCode} &middot; {row.tier}</p>
        </div>
      ),
    },
    {
      key: "referredEmail",
      header: "Referred",
      render: (row) => (
        <p className="text-sm text-graphite-600">{row.referredEmail || "—"}</p>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => (
        <Badge variant={statusVariant[row.status] || "secondary"}>{row.status}</Badge>
      ),
    },
    {
      key: "payoutCents",
      header: "Payout",
      render: (row) => (
        <p className="text-sm font-medium text-navy">
          {row.payoutCents ? formatPrice(row.payoutCents) : "—"}
        </p>
      ),
    },
    {
      key: "paidAt",
      header: "Paid At",
      render: (row) => (
        <p className="text-xs text-graphite-400">
          {row.paidAt ? new Date(row.paidAt).toLocaleDateString() : "—"}
        </p>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (row) => (
        <p className="text-xs text-graphite-400">
          {new Date(row.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => <ReferralActions row={row} onRefresh={() => router.refresh()} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-navy">Referral Program</h2>
          <p className="text-sm text-graphite-400">Track, manage, and pay out referrals</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {convertedReferrals.length > 0 && (
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleBulkPay}
              disabled={bulkLoading}
            >
              <Zap className="h-3.5 w-3.5" />
              {bulkLoading ? "Processing..." : `Pay All Converted (${convertedReferrals.length})`}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowSettings((v) => !v)}
          >
            <Settings2 className="h-3.5 w-3.5" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleSendReminders}
            disabled={remindLoading}
          >
            <Mail className="h-3.5 w-3.5" />
            {remindLoading ? "Sending..." : "Send Reminders"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleRecalcTiers}
            disabled={recalcLoading}
            title="Recalculate all referrer tiers based on current counts"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {recalcLoading ? "Recalculating..." : "Sync Tiers"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(
                referrals,
                [
                  { key: "referrerName", header: "Referrer", getValue: (r) => r.referrerName },
                  { key: "referrerEmail", header: "Referrer Email", getValue: (r) => r.referrerEmail },
                  { key: "referralCode", header: "Code", getValue: (r) => r.referralCode },
                  { key: "referredEmail", header: "Referred Email", getValue: (r) => r.referredEmail || "" },
                  { key: "status", header: "Status", getValue: (r) => r.status },
                  { key: "payoutCents", header: "Payout ($)", getValue: (r) => r.payoutCents ? (r.payoutCents / 100).toFixed(2) : "0" },
                  { key: "createdAt", header: "Date", getValue: (r) => new Date(r.createdAt).toISOString().slice(0, 10) },
                ],
                "referrals"
              )
            }
          >
            Export CSV
          </Button>
        </div>
      </div>

      {(remindResult || recalcResult) && (
        <div className="flex flex-wrap gap-3">
          {remindResult && (
            <div className="flex items-center gap-2 rounded-xl bg-teal-50 border border-teal/20 px-4 py-2.5 text-sm">
              <span className="text-teal">✓</span>
              <span className="text-navy">Reminders sent: <strong>{remindResult.sent}</strong> delivered, {remindResult.skipped} skipped</span>
            </div>
          )}
          {recalcResult && (
            <div className="flex items-center gap-2 rounded-xl bg-teal-50 border border-teal/20 px-4 py-2.5 text-sm">
              <span className="text-teal">✓</span>
              <span className="text-navy">Tiers updated: <strong>{recalcResult.updated}</strong> of {recalcResult.total} codes recalculated</span>
            </div>
          )}
        </div>
      )}

      {/* Funnel + Top Performers */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                layout="vertical"
                data={[
                  { stage: "Total Referrals", count: totalReferrals },
                  { stage: "Converted", count: convertedCount },
                  { stage: "Paid Out", count: paidCount },
                  { stage: "Pending", count: pendingCount },
                ]}
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={100} />
                <Tooltip formatter={(v: number) => [v, "Count"]} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  <Cell key="total" fill="#dbeafe" stroke="#1e3a5f" />
                  <Cell key="converted" fill="#2ab5a5" />
                  <Cell key="paid" fill="#10b981" />
                  <Cell key="pending" fill="#f59e0b" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-2 text-center text-xs text-graphite-400">
              {totalReferrals > 0
                ? `${((convertedCount / totalReferrals) * 100).toFixed(1)}% conversion rate`
                : "No referrals yet"}
            </p>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topReferrers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-graphite-400">
                <Trophy className="mb-2 h-8 w-8 opacity-30" />
                <p className="text-sm">No referrers yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topReferrers.map((r, i) => {
                  const nextTier = TIER_THRESHOLDS.find((t) => t.min > r.totalReferred);
                  const awayFromNext = nextTier ? nextTier.min - r.totalReferred : null;
                  const rankBg =
                    i === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : i === 1
                      ? "bg-slate-200 text-slate-600"
                      : i === 2
                      ? "bg-amber-100 text-amber-700"
                      : "bg-navy-100 text-graphite-500";
                  return (
                    <div key={r.id} className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${rankBg}`}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-navy truncate">{r.name}</p>
                          <Badge variant="secondary" className="mt-0.5 text-[10px]">
                            {r.tier}
                          </Badge>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-navy">{r.totalReferred} refs</p>
                          <p className="text-xs text-graphite-400">{formatPrice(r.totalEarned)}</p>
                        </div>
                      </div>
                      {awayFromNext !== null && awayFromNext <= 2 && (
                        <p className="ml-9 text-[10px] font-medium text-orange-500">
                          {awayFromNext} away from {nextTier!.name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <Card className="border-teal/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-teal" /> Referral Program Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Default Payout (USD)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite-400 text-sm">$</span>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={settingsPayout}
                      onChange={(e) => setSettingsPayout(e.target.value)}
                      className="pl-7"
                      placeholder="50"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSaveSettings}
                    disabled={settingsSaving}
                    className={settingsSaved ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  >
                    {settingsSaved ? "✓ Saved" : settingsSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
                <p className="text-[11px] text-graphite-400 mt-1">Applied to all new conversions (existing referrals unaffected)</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Tier Payouts</label>
                <div className="space-y-1 rounded-xl border border-navy-100/40 bg-navy-50/20 p-3">
                  {[
                    { tier: "Standard", min: "0+", payout: "$50" },
                    { tier: "Silver", min: "5+", payout: "$60" },
                    { tier: "Gold", min: "10+", payout: "$75" },
                    { tier: "Ambassador", min: "25+", payout: "$100" },
                  ].map((t) => (
                    <div key={t.tier} className="flex justify-between text-xs">
                      <span className="text-graphite-500">{t.tier} ({t.min} refs)</span>
                      <span className="font-semibold text-navy">{t.payout}/referral</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Share2 className="h-5 w-5 text-teal" />
            <div>
              <p className="text-xs text-graphite-400">Total Referrals</p>
              <p className="text-xl font-bold text-navy">{totalReferrals}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-graphite-400">Converted</p>
              <p className="text-xl font-bold text-navy">{convertedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <TrendingUp className="h-5 w-5 text-gold-600" />
            <div>
              <p className="text-xs text-graphite-400">Conversion Rate</p>
              <p className="text-xl font-bold text-navy">{conversionRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Award className="h-5 w-5 text-navy" />
            <div>
              <p className="text-xs text-graphite-400">Total Paid Out</p>
              <p className="text-xl font-bold text-navy">{formatPrice(totalEarned)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <DollarSign className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-xs text-graphite-400">Pending Payout</p>
              <p className="text-xl font-bold text-amber-700">{formatPrice(pendingPayoutCents)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={referrals}
            columns={columns}
            total={total}
            page={page}
            limit={limit}
            search={currentSearch}
            onPageChange={(p) => updateParams({ page: p })}
            onLimitChange={(l) => updateParams({ limit: l, page: 1 })}
            onSearchChange={(q) => updateParams({ q: q || null, page: 1 })}
            searchPlaceholder="Search by email, name, or code..."
            getRowId={(r) => r.id}
            filters={[
              {
                key: "status",
                label: "All Statuses",
                options: [
                  { label: "Pending", value: "PENDING" },
                  { label: "Converted", value: "CONVERTED" },
                  { label: "Paid", value: "PAID" },
                  { label: "Flagged", value: "FLAGGED" },
                  { label: "Expired", value: "EXPIRED" },
                ],
              },
            ]}
            activeFilters={{ status: currentStatus }}
            onFilterChange={(key, value) => updateParams({ [key]: value || null, page: 1 })}
            emptyMessage="No referrals found"
          />
        </CardContent>
      </Card>
    </div>
  );
}
