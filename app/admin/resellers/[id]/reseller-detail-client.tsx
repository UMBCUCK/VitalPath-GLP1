"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/admin/kpi-card";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/utils";
import {
  ArrowLeft,
  Save,
  Loader2,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  BarChart3,
  Users,
  Store,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────

interface TieredRate {
  minSales: number;
  maxSales?: number;
  rate: number;
}

interface CommissionRow {
  id: string;
  resellerId: string;
  resellerName: string;
  resellerCompany: string | null;
  orderId: string | null;
  subscriptionId: string | null;
  customerId: string | null;
  type: string;
  amountCents: number;
  status: string;
  paidAt: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  notes: string | null;
  createdAt: string;
}

interface ResellerData {
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
  tieredRates: TieredRate[] | null;
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
  createdAt: string;
  updatedAt: string;
  commissions: Array<{
    id: string;
    type: string;
    amountCents: number;
    status: string;
    createdAt: string;
  }>;
}

interface PerformanceData {
  salesByMonth: Array<{ month: string; sales: number; revenue: number; commission: number }>;
  commissionByType: Array<{ type: string; count: number; total: number }>;
  commissionByStatus: Array<{ status: string; count: number; total: number }>;
  totalCommissions: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
}

interface ResellerDetailClientProps {
  reseller: ResellerData;
  performance: PerformanceData | null;
  commissions: CommissionRow[];
  commissionsTotal: number;
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

const COMMISSION_TYPE_BADGE: Record<string, "default" | "secondary" | "gold" | "warning"> = {
  INITIAL_SALE: "default",
  RECURRING: "secondary",
  BONUS: "gold",
  ADJUSTMENT: "warning",
};

const COMMISSION_STATUS_BADGE: Record<string, "secondary" | "warning" | "success" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "warning",
  PAID: "success",
  REJECTED: "destructive",
  CLAWBACK: "destructive",
};

// ── Component ─────────────────────────────────────────────────

export function ResellerDetailClient({
  reseller,
  performance,
  commissions,
  commissionsTotal,
}: ResellerDetailClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [commissionPage, setCommissionPage] = useState(1);

  // Edit form state
  const [form, setForm] = useState({
    displayName: reseller.displayName,
    companyName: reseller.companyName || "",
    contactEmail: reseller.contactEmail,
    contactPhone: reseller.contactPhone || "",
    tier: reseller.tier,
    commissionType: reseller.commissionType,
    commissionPct: String(reseller.commissionPct ?? ""),
    commissionFlat: String(reseller.commissionFlat ?? ""),
    commissionCap: String(reseller.commissionCap ?? ""),
    subscriptionCommissionEnabled: reseller.subscriptionCommissionEnabled,
    subscriptionCommissionPct: String(reseller.subscriptionCommissionPct ?? ""),
    maxRecurringMonths: String(reseller.maxRecurringMonths ?? ""),
    adminNotes: reseller.adminNotes || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        displayName: form.displayName,
        companyName: form.companyName || null,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone || null,
        tier: form.tier,
        commissionType: form.commissionType,
        subscriptionCommissionEnabled: form.subscriptionCommissionEnabled,
        adminNotes: form.adminNotes || null,
      };
      if (form.commissionPct) body.commissionPct = parseFloat(form.commissionPct);
      if (form.commissionFlat) body.commissionFlat = parseInt(form.commissionFlat);
      if (form.commissionCap) body.commissionCap = parseInt(form.commissionCap);
      else body.commissionCap = null;
      if (form.subscriptionCommissionPct) body.subscriptionCommissionPct = parseFloat(form.subscriptionCommissionPct);
      if (form.maxRecurringMonths) body.maxRecurringMonths = parseInt(form.maxRecurringMonths);
      else body.maxRecurringMonths = null;

      await fetch(`/api/admin/resellers/${reseller.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      router.refresh();
    } catch {
      // Silently fail
    } finally {
      setSaving(false);
    }
  };

  const handleCommissionAction = async (commissionId: string, action: string) => {
    try {
      await fetch("/api/admin/commissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commissionId, action }),
      });
      router.refresh();
    } catch {
      // Silently fail
    }
  };

  // Commission table columns
  const commissionColumns: ColumnDef<CommissionRow>[] = [
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <Badge variant={COMMISSION_TYPE_BADGE[row.type] || "secondary"}>
          {row.type.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "amountCents",
      header: "Amount",
      render: (row) => (
        <span className="text-sm font-semibold text-navy">{formatPrice(row.amountCents)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={COMMISSION_STATUS_BADGE[row.status] || "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "customerId",
      header: "Customer",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {row.customerId ? row.customerId.slice(0, 8) + "..." : "--"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => (
        <span className="text-xs text-graphite-400">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {row.status === "PENDING" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-emerald-600"
                onClick={() => handleCommissionAction(row.id, "approve")}
              >
                <CheckCircle className="mr-1 h-3 w-3" /> Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-red-600"
                onClick={() => handleCommissionAction(row.id, "reject")}
              >
                <XCircle className="mr-1 h-3 w-3" /> Reject
              </Button>
            </>
          )}
          {row.status === "APPROVED" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-teal"
              onClick={() => handleCommissionAction(row.id, "pay")}
            >
              <CreditCard className="mr-1 h-3 w-3" /> Mark Paid
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/admin/resellers")}
            className="mb-2 flex items-center gap-1 text-xs text-graphite-400 hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Resellers
          </button>
          <div className="flex items-center gap-3">
            <Store className="h-6 w-6 text-teal" />
            <h2 className="text-2xl font-bold text-navy">{reseller.displayName}</h2>
            <Badge variant={TIER_BADGE[reseller.tier] || "secondary"}>
              {reseller.tier}
            </Badge>
            <Badge variant={STATUS_BADGE[reseller.status] || "secondary"}>
              {reseller.status}
            </Badge>
          </div>
          {reseller.companyName && (
            <p className="mt-0.5 text-sm text-graphite-400">{reseller.companyName}</p>
          )}
          <p className="text-xs text-graphite-300">
            Joined {new Date(reseller.createdAt).toLocaleDateString()} | {reseller.contactEmail}
          </p>
        </div>
      </div>

      {/* Performance KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <KPICard
          title="Total Sales"
          value={String(reseller.totalSales)}
          icon={BarChart3}
        />
        <KPICard
          title="Revenue Generated"
          value={formatPrice(reseller.totalRevenue)}
          icon={DollarSign}
          iconColor="text-gold-600"
          iconBg="bg-gold-50"
        />
        <KPICard
          title="Total Commission"
          value={formatPrice(reseller.totalCommission)}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Customers Referred"
          value={String(reseller.totalCustomers)}
          icon={Users}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
      </div>

      {/* Performance chart */}
      {performance && performance.salesByMonth.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Sales & Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance.salesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === "sales" ? value : formatPrice(value)
                    }
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#0d9488" name="Sales" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="commission" fill="#f59e0b" name="Commission (cents)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commission summary cards */}
      {performance && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Clock className="h-5 w-5 text-graphite-400" />
              <div>
                <p className="text-xs text-graphite-400">Pending</p>
                <p className="text-lg font-bold text-navy">{formatPrice(performance.pendingCommission)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-xs text-graphite-400">Approved</p>
                <p className="text-lg font-bold text-navy">{formatPrice(performance.approvedCommission)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-xs text-graphite-400">Paid</p>
                <p className="text-lg font-bold text-navy">{formatPrice(performance.paidCommission)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Commission Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-graphite-500">Display Name</label>
              <Input
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-graphite-500">Company Name</label>
              <Input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-graphite-500">Contact Email</label>
              <Input
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-graphite-500">Contact Phone</label>
              <Input
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
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

          {/* Commission type */}
          <div className="border-t border-navy-100/40 pt-4">
            <h4 className="text-xs font-semibold text-graphite-500 uppercase tracking-wider mb-3">
              Commission Structure
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
                    step="0.5"
                    value={form.commissionPct}
                    onChange={(e) => setForm({ ...form, commissionPct: e.target.value })}
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
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-graphite-500">Cap (cents/month)</label>
                <Input
                  type="number"
                  value={form.commissionCap}
                  onChange={(e) => setForm({ ...form, commissionCap: e.target.value })}
                  placeholder="No cap"
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
                    step="0.5"
                    value={form.subscriptionCommissionPct}
                    onChange={(e) => setForm({ ...form, subscriptionCommissionPct: e.target.value })}
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

          {/* Admin notes */}
          <div className="border-t border-navy-100/40 pt-4">
            <label className="text-xs font-medium text-graphite-500">Admin Notes</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm min-h-[80px]"
              value={form.adminNotes}
              onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
              placeholder="Internal notes about this reseller..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Commission History */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-graphite-500 uppercase tracking-wider">
          Commission History ({commissionsTotal})
        </h3>
        <DataTable
          data={commissions}
          columns={commissionColumns}
          total={commissionsTotal}
          page={commissionPage}
          limit={50}
          onPageChange={(p) => setCommissionPage(p)}
          getRowId={(row) => row.id}
          emptyMessage="No commissions yet"
        />
      </div>
    </div>
  );
}
