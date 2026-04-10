"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/admin/kpi-card";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/utils";
import {
  Users,
  UserPlus,
  DollarSign,
  TrendingUp,
  Percent,
  Award,
  X,
  Loader2,
  Store,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────

interface ResellerRow {
  id: string;
  userId: string;
  displayName: string;
  companyName: string | null;
  contactEmail: string;
  contactPhone: string | null;
  tier: string;
  status: string;
  commissionType: string;
  commissionPct: number | null;
  commissionFlat: number | null;
  commissionCap: number | null;
  tieredRates: unknown;
  subscriptionCommissionEnabled: boolean;
  subscriptionCommissionPct: number | null;
  maxRecurringMonths: number | null;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  totalCustomers: number;
  conversionRate: number | null;
  lastSaleAt: string | null;
  adminNotes: string | null;
  commissionCount: number;
  createdAt: string;
  updatedAt: string;
}

interface LeaderboardEntry {
  id: string;
  displayName: string;
  companyName: string | null;
  tier: string;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  totalCustomers: number;
  conversionRate: number | null;
}

interface ResellersClientProps {
  resellers: ResellerRow[];
  leaderboard: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
  searchQuery: string;
  statusFilter: string;
}

// ── Badge helpers ─────────────────────────────────────────────

const TIER_BADGE: Record<string, "secondary" | "outline" | "gold" | "default" | "warning"> = {
  STANDARD: "secondary",
  SILVER: "outline",
  GOLD: "gold",
  AMBASSADOR: "default",
  CUSTOM: "warning",
};

const STATUS_BADGE: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  ACTIVE: "success",
  SUSPENDED: "warning",
  PAUSED: "secondary",
  TERMINATED: "destructive",
};

// ── Component ─────────────────────────────────────────────────

export function ResellersClient({
  resellers,
  leaderboard,
  total,
  page,
  limit,
  searchQuery,
  statusFilter,
}: ResellersClientProps) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    userId: "",
    displayName: "",
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    tier: "STANDARD",
    commissionType: "PERCENTAGE",
    commissionPct: "15",
    commissionFlat: "",
    commissionCap: "",
    subscriptionCommissionEnabled: true,
    subscriptionCommissionPct: "10",
    maxRecurringMonths: "",
  });

  // KPIs
  const totalResellers = total;
  const activeResellers = resellers.filter((r) => r.status === "ACTIVE").length;
  const totalRevenueGenerated = resellers.reduce((sum, r) => sum + r.totalRevenue, 0);
  const totalCommissionsPaid = resellers.reduce((sum, r) => sum + r.totalCommission, 0);
  const avgConversion = resellers.length > 0
    ? resellers.reduce((sum, r) => sum + (r.conversionRate || 0), 0) / resellers.length
    : 0;

  const navigateTo = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v) sp.set(k, v);
    }
    router.push(`/admin/resellers?${sp.toString()}`);
  };

  const handleCreate = async () => {
    if (!form.userId || !form.displayName || !form.contactEmail) {
      setError("User ID, display name, and contact email are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        userId: form.userId,
        displayName: form.displayName,
        contactEmail: form.contactEmail,
        tier: form.tier,
        commissionType: form.commissionType,
        subscriptionCommissionEnabled: form.subscriptionCommissionEnabled,
      };
      if (form.companyName) body.companyName = form.companyName;
      if (form.contactPhone) body.contactPhone = form.contactPhone;
      if (form.commissionPct) body.commissionPct = parseFloat(form.commissionPct);
      if (form.commissionFlat) body.commissionFlat = parseInt(form.commissionFlat);
      if (form.commissionCap) body.commissionCap = parseInt(form.commissionCap);
      if (form.subscriptionCommissionPct) body.subscriptionCommissionPct = parseFloat(form.subscriptionCommissionPct);
      if (form.maxRecurringMonths) body.maxRecurringMonths = parseInt(form.maxRecurringMonths);

      const res = await fetch("/api/admin/resellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create reseller");
      }
      setShowAddForm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create reseller");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const endpoint = newStatus === "TERMINATED"
        ? `/api/admin/resellers/${id}`
        : "/api/admin/resellers";
      const method = newStatus === "TERMINATED" ? "DELETE" : "PUT";
      const body = newStatus === "TERMINATED" ? undefined : JSON.stringify({ id, status: newStatus });

      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      router.refresh();
    } catch {
      // Silently fail, user can retry
    }
  };

  // Table columns
  const columns: ColumnDef<ResellerRow>[] = [
    {
      key: "displayName",
      header: "Name / Company",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-navy">{row.displayName}</p>
          {row.companyName && (
            <p className="text-[10px] text-graphite-400">{row.companyName}</p>
          )}
        </div>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      render: (row) => (
        <Badge variant={TIER_BADGE[row.tier] || "secondary"}>
          {row.tier}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={STATUS_BADGE[row.status] || "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "commissionType",
      header: "Commission",
      render: (row) => (
        <div className="text-xs">
          <span className="font-medium text-navy">
            {row.commissionType === "PERCENTAGE"
              ? `${row.commissionPct || 0}%`
              : row.commissionType === "FLAT"
              ? formatPrice(row.commissionFlat || 0)
              : "Tiered"}
          </span>
          <span className="text-graphite-400"> ({row.commissionType})</span>
        </div>
      ),
    },
    {
      key: "subscriptionCommissionEnabled",
      header: "Sub Commission",
      render: (row) => (
        <Badge variant={row.subscriptionCommissionEnabled ? "success" : "secondary"}>
          {row.subscriptionCommissionEnabled
            ? `${row.subscriptionCommissionPct || 0}%`
            : "Disabled"}
        </Badge>
      ),
    },
    {
      key: "totalSales",
      header: "Sales",
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-navy">{row.totalSales}</span>
      ),
    },
    {
      key: "totalRevenue",
      header: "Revenue",
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-navy">{formatPrice(row.totalRevenue)}</span>
      ),
    },
    {
      key: "totalCommission",
      header: "Commission",
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-teal">{formatPrice(row.totalCommission)}</span>
      ),
    },
    {
      key: "conversionRate",
      header: "Conv. Rate",
      render: (row) => (
        <span className="text-xs text-graphite-500">
          {row.conversionRate !== null ? `${row.conversionRate.toFixed(1)}%` : "--"}
        </span>
      ),
    },
    {
      key: "lastSaleAt",
      header: "Last Sale",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.lastSaleAt ? new Date(row.lastSaleAt).toLocaleDateString() : "--"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {row.status === "ACTIVE" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => handleStatusChange(row.id, "SUSPENDED")}
            >
              Suspend
            </Button>
          )}
          {row.status === "SUSPENDED" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => handleStatusChange(row.id, "ACTIVE")}
            >
              Reactivate
            </Button>
          )}
          {row.status !== "TERMINATED" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2 text-red-600 hover:text-red-700"
              onClick={() => handleStatusChange(row.id, "TERMINATED")}
            >
              Terminate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-navy">
            <Store className="h-6 w-6 text-teal" />
            Reseller Management
          </h2>
          <p className="text-sm text-graphite-400">
            Manage reseller profiles, commission structures, and performance
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
          {showAddForm ? "Cancel" : "Add Reseller"}
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-5">
        <KPICard title="Total Resellers" value={String(totalResellers)} icon={Users} />
        <KPICard
          title="Active"
          value={String(activeResellers)}
          icon={UserPlus}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Revenue Generated"
          value={formatPrice(totalRevenueGenerated)}
          icon={DollarSign}
          iconColor="text-gold-600"
          iconBg="bg-gold-50"
        />
        <KPICard
          title="Commissions Paid"
          value={formatPrice(totalCommissionsPaid)}
          icon={TrendingUp}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Avg Conversion"
          value={`${avgConversion.toFixed(1)}%`}
          icon={Percent}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Add reseller form */}
      {showAddForm && (
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="text-base">Add New Reseller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2">{error}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-graphite-500">User ID *</label>
                <Input
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  placeholder="cuid of existing user"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">Display Name *</label>
                <Input
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">Company Name</label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Acme Health LLC"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">Contact Email *</label>
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="john@acme.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">Contact Phone</label>
                <Input
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">Tier</label>
                <select
                  className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm"
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                >
                  <option value="STANDARD">Standard</option>
                  <option value="SILVER">Silver</option>
                  <option value="GOLD">Gold</option>
                  <option value="AMBASSADOR">Ambassador</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>
            </div>

            {/* Commission config */}
            <div className="border-t border-navy-100/40 pt-4">
              <h4 className="text-xs font-semibold text-graphite-500 uppercase tracking-wider mb-3">
                Commission Configuration
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="text-xs font-medium text-graphite-500">Commission Type</label>
                  <div className="mt-1 flex gap-2">
                    {["PERCENTAGE", "FLAT", "TIERED"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setForm({ ...form, commissionType: type })}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          form.commissionType === type
                            ? "border-teal bg-teal-50 text-teal"
                            : "border-navy-200 text-graphite-500 hover:border-navy-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {form.commissionType === "PERCENTAGE" && (
                  <div>
                    <label className="text-xs font-medium text-graphite-500">Commission %</label>
                    <Input
                      type="number"
                      value={form.commissionPct}
                      onChange={(e) => setForm({ ...form, commissionPct: e.target.value })}
                      placeholder="15"
                    />
                  </div>
                )}
                {form.commissionType === "FLAT" && (
                  <div>
                    <label className="text-xs font-medium text-graphite-500">Flat Amount (cents)</label>
                    <Input
                      type="number"
                      value={form.commissionFlat}
                      onChange={(e) => setForm({ ...form, commissionFlat: e.target.value })}
                      placeholder="5000"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-graphite-500">Commission Cap (cents/mo)</label>
                  <Input
                    type="number"
                    value={form.commissionCap}
                    onChange={(e) => setForm({ ...form, commissionCap: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Subscription commission */}
            <div className="border-t border-navy-100/40 pt-4">
              <div className="flex items-center gap-3 mb-3">
                <label className="text-xs font-semibold text-graphite-500 uppercase tracking-wider">
                  Subscription Commission
                </label>
                <button
                  onClick={() =>
                    setForm({ ...form, subscriptionCommissionEnabled: !form.subscriptionCommissionEnabled })
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    form.subscriptionCommissionEnabled ? "bg-teal" : "bg-navy-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      form.subscriptionCommissionEnabled ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {form.subscriptionCommissionEnabled && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-graphite-500">Sub Commission %</label>
                    <Input
                      type="number"
                      value={form.subscriptionCommissionPct}
                      onChange={(e) => setForm({ ...form, subscriptionCommissionPct: e.target.value })}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-graphite-500">Max Recurring Months</label>
                    <Input
                      type="number"
                      value={form.maxRecurringMonths}
                      onChange={(e) => setForm({ ...form, maxRecurringMonths: e.target.value })}
                      placeholder="Unlimited"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Reseller
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-gold-600" />
              Top Resellers by Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-xl bg-navy-50/30 px-4 py-3 cursor-pointer hover:bg-navy-50/60 transition-colors"
                  onClick={() => router.push(`/admin/resellers/${entry.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0
                          ? "bg-gold-100 text-gold-700"
                          : i === 1
                          ? "bg-navy-200 text-navy"
                          : i === 2
                          ? "bg-gold-50 text-gold-600"
                          : "bg-navy-100 text-graphite-500"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-navy">{entry.displayName}</p>
                      <p className="text-[10px] text-graphite-400">
                        {entry.companyName || ""} {entry.companyName ? " - " : ""}
                        <Badge variant={TIER_BADGE[entry.tier] || "secondary"} className="text-[9px] px-1.5 py-0">
                          {entry.tier}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-sm font-bold text-navy">{formatPrice(entry.totalRevenue)}</p>
                      <p className="text-[10px] text-graphite-400">revenue</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-graphite-600">{entry.totalSales}</p>
                      <p className="text-[10px] text-graphite-400">sales</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-teal">{formatPrice(entry.totalCommission)}</p>
                      <p className="text-[10px] text-graphite-400">commission</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reseller DataTable */}
      <DataTable
        data={resellers}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        search={searchQuery}
        onPageChange={(p) => navigateTo({ page: String(p), search: searchQuery, status: statusFilter })}
        onSearchChange={(s) => navigateTo({ page: "1", search: s, status: statusFilter })}
        searchPlaceholder="Search resellers..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "All", value: "all" },
              { label: "Active", value: "ACTIVE" },
              { label: "Suspended", value: "SUSPENDED" },
              { label: "Paused", value: "PAUSED" },
              { label: "Terminated", value: "TERMINATED" },
            ],
          },
        ]}
        activeFilters={{ status: statusFilter }}
        onFilterChange={(key, value) => {
          if (key === "status") navigateTo({ page: "1", search: searchQuery, status: value });
        }}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/resellers/${row.id}`)}
        onExportCSV={() =>
          exportToCSV(
            resellers,
            [
              { key: "displayName", header: "Name", getValue: (r) => r.displayName },
              { key: "companyName", header: "Company", getValue: (r) => r.companyName || "" },
              { key: "contactEmail", header: "Email", getValue: (r) => r.contactEmail },
              { key: "tier", header: "Tier", getValue: (r) => r.tier },
              { key: "status", header: "Status", getValue: (r) => r.status },
              { key: "commissionType", header: "Commission Type", getValue: (r) => r.commissionType },
              { key: "totalSales", header: "Total Sales", getValue: (r) => String(r.totalSales) },
              { key: "totalRevenue", header: "Revenue (cents)", getValue: (r) => String(r.totalRevenue) },
              { key: "totalCommission", header: "Commission (cents)", getValue: (r) => String(r.totalCommission) },
            ],
            "resellers"
          )
        }
        emptyMessage="No resellers found"
      />
    </div>
  );
}
