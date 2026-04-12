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
  AlertTriangle,
  RotateCcw,
  Shield,
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

interface ComplianceData {
  onboardingStep: number;
  onboardingCompletedAt: string | null;
  complianceTrainingCompletedAt: string | null;
  agreementSignedAt: string | null;
  agreementVersion: string | null;
  agreementIpAddress: string | null;
  w9SubmittedAt: string | null;
  w9LegalName: string | null;
  w9BusinessName: string | null;
  w9TaxClassification: string | null;
  w9TinType: string | null;
  w9TinLast4: string | null;
  healthcareProviderAttestation: boolean;
  attestationSignedAt: string | null;
  oigCheckPassedAt: string | null;
  oigCheckResult: string | null;
  samCheckPassedAt: string | null;
  samCheckResult: string | null;
  marketingApprovalRequired: boolean;
  lastComplianceAuditAt: string | null;
  complianceViolationCount: number;
}

interface ResellerDetailClientProps {
  reseller: ResellerData;
  performance: PerformanceData | null;
  commissions: CommissionRow[];
  commissionsTotal: number;
  compliance: ComplianceData | null;
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
  compliance,
}: ResellerDetailClientProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [commissionPage, setCommissionPage] = useState(1);

  // Compliance action state
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationLevel, setViolationLevel] = useState<"WARNING" | "SUSPENSION" | "TERMINATION">("WARNING");
  const [violationDesc, setViolationDesc] = useState("");
  const [violationLoading, setViolationLoading] = useState(false);
  const [violationError, setViolationError] = useState("");
  const [recertLoading, setRecertLoading] = useState(false);
  const [violationHistory, setViolationHistory] = useState<Array<{
    action: string; details: any; createdAt: string;
  }> | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  async function handleLogViolation() {
    if (!violationDesc.trim()) { setViolationError("Description is required."); return; }
    setViolationError("");
    setViolationLoading(true);
    try {
      const res = await fetch(`/api/admin/resellers/${reseller.id}/violations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: violationLevel, description: violationDesc }),
      });
      const data = await res.json();
      if (!res.ok) { setViolationError(data.error || "Failed"); return; }
      setShowViolationModal(false);
      setViolationDesc("");
      router.refresh();
    } catch { setViolationError("Network error."); }
    finally { setViolationLoading(false); }
  }

  async function handleRecertification() {
    if (!confirm("This will reset all onboarding progress and force the reseller to redo compliance training, re-sign the agreement, and re-submit their W-9. Continue?")) return;
    setRecertLoading(true);
    try {
      const res = await fetch(`/api/admin/resellers/${reseller.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          onboardingStep: 0,
          onboardingCompletedAt: null,
          complianceTrainingCompletedAt: null,
          agreementSignedAt: null,
          recertification: true,
        }),
      });
      if (res.ok) router.refresh();
      else alert("Failed to trigger re-certification.");
    } catch { alert("Network error."); }
    finally { setRecertLoading(false); }
  }

  async function loadViolationHistory() {
    if (violationHistory !== null) return; // already loaded
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/admin/resellers/${reseller.id}/violations`);
      if (res.ok) {
        const data = await res.json();
        setViolationHistory(data.violations || []);
      }
    } catch { /* fail silently */ }
    finally { setHistoryLoading(false); }
  }

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

      {/* ── Compliance & Onboarding Status ─────────────────────── */}
      {compliance && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-graphite-500 uppercase tracking-wider">
              Compliance & Onboarding
            </h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs border border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => setShowViolationModal(true)}
              >
                <AlertTriangle className="mr-1 h-3 w-3" /> Log Violation
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs border border-navy-200"
                onClick={handleRecertification}
                disabled={recertLoading}
              >
                {recertLoading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <RotateCcw className="mr-1 h-3 w-3" />}
                Force Re-certification
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Onboarding Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Onboarding Status</span>
                  {compliance.onboardingCompletedAt ? (
                    <Badge variant="success" className="text-[10px]">Complete</Badge>
                  ) : (
                    <Badge variant="warning" className="text-[10px]">Step {compliance.onboardingStep}/6</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Compliance Training", date: compliance.complianceTrainingCompletedAt, done: !!compliance.complianceTrainingCompletedAt },
                  { label: "Agreement Signed", date: compliance.agreementSignedAt, done: !!compliance.agreementSignedAt, extra: compliance.agreementVersion ? `v${compliance.agreementVersion}` : null },
                  { label: "Provider Attestation", date: compliance.attestationSignedAt, done: compliance.healthcareProviderAttestation },
                  { label: "W-9 Submitted", date: compliance.w9SubmittedAt, done: !!compliance.w9SubmittedAt },
                  { label: "OIG Check", date: compliance.oigCheckPassedAt, done: compliance.oigCheckResult === "CLEAR", extra: compliance.oigCheckResult },
                  { label: "SAM.gov Check", date: compliance.samCheckPassedAt, done: compliance.samCheckResult === "CLEAR", extra: compliance.samCheckResult },
                  { label: "Onboarding Complete", date: compliance.onboardingCompletedAt, done: !!compliance.onboardingCompletedAt },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {item.done ? (
                        <CheckCircle className="h-4 w-4 text-teal" />
                      ) : (
                        <XCircle className="h-4 w-4 text-graphite-300" />
                      )}
                      <span className={item.done ? "text-navy" : "text-graphite-400"}>{item.label}</span>
                      {item.extra && (
                        <Badge variant="secondary" className="text-[9px]">{item.extra}</Badge>
                      )}
                    </div>
                    {item.date && (
                      <span className="text-xs text-graphite-400">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Compliance Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compliance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Violations */}
                <div className="flex items-center justify-between rounded-xl border border-navy-100/40 p-3">
                  <div>
                    <p className="text-sm font-medium text-navy">Compliance Violations</p>
                    <p className="text-xs text-graphite-400">Auto-suspend at 3 warnings</p>
                  </div>
                  <span className={`text-2xl font-bold ${compliance.complianceViolationCount >= 3 ? "text-red-500" : compliance.complianceViolationCount > 0 ? "text-amber-500" : "text-teal"}`}>
                    {compliance.complianceViolationCount}
                  </span>
                </div>

                {/* W-9 Summary */}
                {compliance.w9SubmittedAt && (
                  <div className="rounded-xl border border-navy-100/40 p-3">
                    <p className="text-xs font-semibold text-navy mb-2">W-9 Summary</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-graphite-400">Legal Name:</span> <span className="text-navy font-medium">{compliance.w9LegalName}</span></div>
                      {compliance.w9BusinessName && <div><span className="text-graphite-400">Business:</span> <span className="text-navy font-medium">{compliance.w9BusinessName}</span></div>}
                      <div><span className="text-graphite-400">Classification:</span> <span className="text-navy font-medium">{compliance.w9TaxClassification}</span></div>
                      <div><span className="text-graphite-400">TIN:</span> <span className="text-navy font-medium">{compliance.w9TinType} ***{compliance.w9TinLast4}</span></div>
                    </div>
                  </div>
                )}

                {/* Agreement */}
                {compliance.agreementSignedAt && (
                  <div className="rounded-xl border border-navy-100/40 p-3">
                    <p className="text-xs font-semibold text-navy mb-2">Agreement Record</p>
                    <div className="text-xs space-y-1">
                      <p><span className="text-graphite-400">Version:</span> <span className="text-navy font-medium">{compliance.agreementVersion}</span></p>
                      <p><span className="text-graphite-400">Signed:</span> <span className="text-navy font-medium">{new Date(compliance.agreementSignedAt).toLocaleString()}</span></p>
                      <p><span className="text-graphite-400">IP Address:</span> <span className="text-navy font-mono">{compliance.agreementIpAddress}</span></p>
                    </div>
                  </div>
                )}

                {/* Marketing & Audit */}
                <div className="rounded-xl border border-navy-100/40 p-3">
                  <p className="text-xs font-semibold text-navy mb-2">Marketing Controls</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-graphite-400">Pre-approval required:</span>
                    <Badge variant={compliance.marketingApprovalRequired ? "warning" : "success"} className="text-[9px]">
                      {compliance.marketingApprovalRequired ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-graphite-400">Last compliance audit:</span>
                    <span className="text-navy">
                      {compliance.lastComplianceAuditAt
                        ? new Date(compliance.lastComplianceAuditAt).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Violation History */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Violation History</span>
                {violationHistory === null && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={loadViolationHistory} disabled={historyLoading}>
                    {historyLoading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Shield className="mr-1 h-3 w-3" />}
                    Load History
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {violationHistory === null ? (
                <p className="text-xs text-graphite-300 text-center py-4">Click &ldquo;Load History&rdquo; to view past violations</p>
              ) : violationHistory.length === 0 ? (
                <p className="text-xs text-graphite-300 text-center py-4">No violations recorded</p>
              ) : (
                <div className="space-y-2">
                  {violationHistory.map((v, i) => {
                    const level = v.details?.level || "UNKNOWN";
                    const colors: Record<string, string> = {
                      WARNING: "border-l-amber-400 bg-amber-50/30",
                      SUSPENSION: "border-l-red-400 bg-red-50/30",
                      TERMINATION: "border-l-red-700 bg-red-50/50",
                    };
                    return (
                      <div key={i} className={`border-l-4 rounded-r-lg p-3 ${colors[level] || "border-l-navy-200"}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={level === "WARNING" ? "warning" : "destructive"} className="text-[9px]">
                              {level}
                            </Badge>
                            <span className="text-[10px] text-graphite-400">Violation #{v.details?.violationNumber}</span>
                          </div>
                          <span className="text-[10px] text-graphite-400">
                            {new Date(v.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-graphite-600">{v.details?.description}</p>
                        {v.details?.resultingStatus && v.details.resultingStatus !== reseller.status && (
                          <p className="text-[10px] text-red-500 mt-1">
                            Status changed to: {v.details.resultingStatus}
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
      )}

      {/* ── Violation Modal ─────────────────────────────────────── */}
      {showViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Log Compliance Violation</h3>
                <p className="text-xs text-graphite-400">{reseller.displayName}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-2">Severity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["WARNING", "SUSPENSION", "TERMINATION"] as const).map((level) => {
                    const active = violationLevel === level;
                    const colors: Record<string, string> = {
                      WARNING: active ? "border-amber-400 bg-amber-50 text-amber-700" : "border-navy-100 text-graphite-500",
                      SUSPENSION: active ? "border-red-400 bg-red-50 text-red-700" : "border-navy-100 text-graphite-500",
                      TERMINATION: active ? "border-red-700 bg-red-100 text-red-800" : "border-navy-100 text-graphite-500",
                    };
                    return (
                      <button
                        key={level}
                        onClick={() => setViolationLevel(level)}
                        className={`rounded-xl border-2 px-3 py-2 text-xs font-semibold transition-colors ${colors[level]}`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Description *</label>
                <textarea
                  value={violationDesc}
                  onChange={(e) => setViolationDesc(e.target.value)}
                  placeholder="Describe the violation (e.g., unapproved drug claims on Instagram, missing FTC disclosure...)"
                  rows={3}
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30 resize-none"
                  disabled={violationLoading}
                />
              </div>

              {violationLevel === "WARNING" && compliance && compliance.complianceViolationCount >= 2 && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                  <p className="text-xs text-red-600 font-semibold">
                    This will be warning #{compliance.complianceViolationCount + 1}. The reseller will be auto-suspended.
                  </p>
                </div>
              )}

              {violationLevel === "TERMINATION" && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                  <p className="text-xs text-red-600 font-semibold">
                    This will permanently terminate the reseller account. All pending commissions will be forfeited.
                  </p>
                </div>
              )}

              {violationError && <p className="text-xs text-red-500">{violationError}</p>}
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setShowViolationModal(false); setViolationError(""); }} disabled={violationLoading}>
                Cancel
              </Button>
              <Button
                size="sm"
                className={violationLevel === "TERMINATION" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-amber-600 hover:bg-amber-700 text-white"}
                onClick={handleLogViolation}
                disabled={violationLoading || !violationDesc.trim()}
              >
                {violationLoading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <AlertTriangle className="mr-1 h-3 w-3" />}
                Log {violationLevel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
