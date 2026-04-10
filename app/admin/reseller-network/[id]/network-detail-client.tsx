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
  Users,
  DollarSign,
  TrendingUp,
  GitBranch,
  Award,
  ChevronRight,
  Save,
  Loader2,
  Layers,
  ArrowUpCircle,
  Mail,
  Phone,
  Building2,
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

interface ResellerSummary {
  id: string;
  displayName: string;
  companyName: string | null;
  contactEmail: string;
  tier: string;
  status: string;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  networkDepth: number;
  tier1OverridePct: number;
  tier2OverridePct: number;
  tier3OverridePct: number;
}

interface NetworkTreeNode {
  reseller: ResellerSummary;
  children: NetworkTreeNode[];
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
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  totalCustomers: number;
  totalSubResellers: number;
  totalNetworkRevenue: number;
  totalOverrideEarnings: number;
  tier1OverridePct: number;
  tier2OverridePct: number;
  tier3OverridePct: number;
  networkDepth: number;
  referredByResellerId: string | null;
  referralCode: string | null;
  payoutMethod: string;
  payoutBankName: string | null;
  payoutAccountLast4: string | null;
  taxIdProvided: boolean;
  taxId1099Eligible: boolean;
  createdAt: string;
}

interface UplineResult {
  tier1?: ResellerSummary;
  tier2?: ResellerSummary;
  tier3?: ResellerSummary;
}

interface DownlineResult {
  tier1: ResellerSummary[];
  tier2: ResellerSummary[];
  tier3: ResellerSummary[];
}

interface NetworkMetrics {
  directRecruits: number;
  directRecruitsSales: number;
  tier2Count: number;
  tier2Sales: number;
  tier3Count: number;
  tier3Sales: number;
  totalNetworkRevenue: number;
  totalOverrideEarnings: number;
  networkGrowthByMonth: { month: string; recruits: number }[];
}

interface TierPromotionResult {
  currentTier: string;
  qualifiesFor: string | null;
  requirements: { salesTarget: number; recruitsTarget: number; revenueTarget: number };
  progress: {
    sales: number;
    recruits: number;
    networkRevenue: number;
    salesPct: number;
    recruitsPct: number;
    revenuePct: number;
  };
}

interface OverrideCommission {
  id: string;
  type: string;
  amountCents: number;
  status: string;
  sourceResellerId: string | null;
  overrideTier: number | null;
  orderId: string | null;
  createdAt: string;
}

interface ChartDataPoint {
  month: string;
  directRevenue: number;
  commission: number;
}

interface NetworkDetailClientProps {
  reseller: ResellerData;
  tree: NetworkTreeNode | null;
  metrics: NetworkMetrics;
  downline: DownlineResult;
  upline: UplineResult;
  promotion: TierPromotionResult;
  overrideCommissions: OverrideCommission[];
  networkChartData: ChartDataPoint[];
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

const COMMISSION_STATUS_BADGE: Record<string, "success" | "warning" | "secondary" | "destructive" | "default"> = {
  PENDING: "warning",
  APPROVED: "default",
  PAID: "success",
  REJECTED: "destructive",
  CLAWBACK: "destructive",
};

// ── Progress Bar ──────────────────────────────────────────────

function ProgressBar({ value, label, target }: { value: number; label: string; target: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-graphite-500">{label}</span>
        <span className="font-medium text-navy">{target}</span>
      </div>
      <div className="h-2 rounded-full bg-navy-100/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-emerald-500" : "bg-teal"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Tree Node ─────────────────────────────────────────────────

function TreeNode({
  node,
  depth = 0,
  onNodeClick,
}: {
  node: NetworkTreeNode;
  depth?: number;
  onNodeClick: (id: string) => void;
}) {
  const statusColor = node.reseller.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-400";
  const indentPx = depth * 40;

  const overridePcts = [
    node.reseller.tier1OverridePct,
    node.reseller.tier2OverridePct,
    node.reseller.tier3OverridePct,
  ];

  return (
    <div>
      <div
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-navy-50/60 transition-colors cursor-pointer group"
        style={{ paddingLeft: `${12 + indentPx}px` }}
        onClick={() => onNodeClick(node.reseller.id)}
      >
        {depth > 0 && (
          <div className="flex items-center gap-1 text-graphite-300">
            <div className="w-4 border-t border-dashed border-navy-200" />
            <span className="text-[8px] font-medium text-teal bg-teal-50 rounded px-1 py-0.5 shrink-0">
              {overridePcts[depth - 1] ?? 0}%
            </span>
          </div>
        )}

        <div className={`h-2 w-2 rounded-full ${statusColor} shrink-0`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-navy truncate">{node.reseller.displayName}</span>
            <Badge variant={TIER_BADGE[node.reseller.tier] || "secondary"} className="text-[9px] px-1.5 py-0">
              {node.reseller.tier}
            </Badge>
            {depth === 0 && (
              <span className="text-[9px] text-graphite-300 font-medium bg-navy-50 rounded px-1.5 py-0.5">ROOT</span>
            )}
          </div>
          {node.reseller.companyName && (
            <p className="text-[10px] text-graphite-400 truncate">{node.reseller.companyName}</p>
          )}
        </div>

        <div className="flex items-center gap-4 text-right shrink-0">
          <div>
            <p className="text-xs font-semibold text-navy">{node.reseller.totalSales}</p>
            <p className="text-[9px] text-graphite-400">sales</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-navy">{formatPrice(node.reseller.totalRevenue)}</p>
            <p className="text-[9px] text-graphite-400">revenue</p>
          </div>
        </div>

        <ChevronRight className="h-3.5 w-3.5 text-graphite-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>

      {node.children.map((child) => (
        <TreeNode
          key={child.reseller.id}
          node={child}
          depth={depth + 1}
          onNodeClick={onNodeClick}
        />
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────

export function NetworkDetailClient({
  reseller,
  tree,
  metrics,
  downline,
  upline,
  promotion,
  overrideCommissions,
  networkChartData,
}: NetworkDetailClientProps) {
  const router = useRouter();
  const [promotingTier, setPromotingTier] = useState(false);
  const [savingRates, setSavingRates] = useState(false);
  const [rateForm, setRateForm] = useState({
    tier1: String(reseller.tier1OverridePct),
    tier2: String(reseller.tier2OverridePct),
    tier3: String(reseller.tier3OverridePct),
  });

  const handlePromote = async () => {
    if (!promotion.qualifiesFor) return;
    setPromotingTier(true);
    try {
      await fetch("/api/admin/reseller-network", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "promote",
          resellerId: reseller.id,
          newTier: promotion.qualifiesFor,
        }),
      });
      router.refresh();
    } catch {
      // Fail silently
    } finally {
      setPromotingTier(false);
    }
  };

  const handleSaveRates = async () => {
    setSavingRates(true);
    try {
      const rates: Record<string, number> = {};
      if (rateForm.tier1) rates.tier1OverridePct = parseFloat(rateForm.tier1);
      if (rateForm.tier2) rates.tier2OverridePct = parseFloat(rateForm.tier2);
      if (rateForm.tier3) rates.tier3OverridePct = parseFloat(rateForm.tier3);

      await fetch("/api/admin/reseller-network", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-rates", resellerId: reseller.id, rates }),
      });
      router.refresh();
    } catch {
      // Fail silently
    } finally {
      setSavingRates(false);
    }
  };

  // Sub-reseller table columns (all tiers combined)
  const allSubResellers = [
    ...downline.tier1.map((r) => ({ ...r, tierLabel: "Tier 1" })),
    ...downline.tier2.map((r) => ({ ...r, tierLabel: "Tier 2" })),
    ...downline.tier3.map((r) => ({ ...r, tierLabel: "Tier 3" })),
  ];

  const subResellerColumns: ColumnDef<typeof allSubResellers[number]>[] = [
    {
      key: "displayName",
      header: "Name",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-navy">{row.displayName}</p>
          {row.companyName && <p className="text-[10px] text-graphite-400">{row.companyName}</p>}
        </div>
      ),
    },
    {
      key: "tierLabel",
      header: "Network Tier",
      render: (row) => {
        const colors = { "Tier 1": "default", "Tier 2": "secondary", "Tier 3": "outline" } as const;
        return <Badge variant={colors[row.tierLabel as keyof typeof colors] || "secondary"}>{row.tierLabel}</Badge>;
      },
    },
    {
      key: "tier",
      header: "Reseller Tier",
      render: (row) => <Badge variant={TIER_BADGE[row.tier] || "secondary"}>{row.tier}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${row.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-400"}`} />
          <span className="text-xs">{row.status}</span>
        </div>
      ),
    },
    {
      key: "totalSales",
      header: "Sales",
      sortable: true,
      render: (row) => <span className="text-sm font-medium text-navy">{row.totalSales}</span>,
    },
    {
      key: "totalRevenue",
      header: "Revenue",
      sortable: true,
      render: (row) => <span className="text-sm font-medium text-navy">{formatPrice(row.totalRevenue)}</span>,
    },
    {
      key: "totalCommission",
      header: "Commission",
      render: (row) => <span className="text-sm font-semibold text-teal">{formatPrice(row.totalCommission)}</span>,
    },
  ];

  // Override commission table columns
  const overrideColumns: ColumnDef<OverrideCommission>[] = [
    {
      key: "createdAt",
      header: "Date",
      render: (row) => (
        <span className="text-xs text-graphite-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => {
        const labels: Record<string, string> = {
          OVERRIDE_TIER1: "Tier 1 Override",
          OVERRIDE_TIER2: "Tier 2 Override",
          OVERRIDE_TIER3: "Tier 3 Override",
        };
        return <Badge variant="default">{labels[row.type] || row.type}</Badge>;
      },
    },
    {
      key: "amountCents",
      header: "Amount",
      render: (row) => <span className="text-sm font-bold text-teal">{formatPrice(row.amountCents)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={COMMISSION_STATUS_BADGE[row.status] || "secondary"}>{row.status}</Badge>
      ),
    },
    {
      key: "overrideTier",
      header: "From Tier",
      render: (row) => <span className="text-xs text-graphite-500">Tier {row.overrideTier}</span>,
    },
    {
      key: "orderId",
      header: "Order",
      render: (row) => (
        <span className="text-[10px] text-graphite-400 font-mono">{row.orderId?.slice(0, 8) || "--"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/reseller-network")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-navy">{reseller.displayName}</h2>
            <Badge variant={TIER_BADGE[reseller.tier] || "secondary"}>{reseller.tier}</Badge>
            <Badge variant={STATUS_BADGE[reseller.status] || "secondary"}>{reseller.status}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-graphite-400">
            {reseller.companyName && (
              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {reseller.companyName}</span>
            )}
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {reseller.contactEmail}</span>
            {reseller.contactPhone && (
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {reseller.contactPhone}</span>
            )}
            <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> Depth: {reseller.networkDepth}</span>
            {reseller.referralCode && (
              <span className="font-mono bg-navy-50 px-1.5 py-0.5 rounded">{reseller.referralCode}</span>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push(`/admin/resellers/${reseller.id}`)}>
          Full Profile
        </Button>
      </div>

      {/* Upline */}
      {(upline.tier1 || upline.tier2 || upline.tier3) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-graphite-500">Upline Chain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 flex-wrap">
              {upline.tier3 && (
                <>
                  <button
                    className="rounded-lg bg-navy-50/50 px-3 py-2 text-xs hover:bg-navy-50 transition-colors"
                    onClick={() => router.push(`/admin/reseller-network/${upline.tier3!.id}`)}
                  >
                    <p className="font-medium text-navy">{upline.tier3.displayName}</p>
                    <p className="text-[9px] text-graphite-400">Tier 3 Upline</p>
                  </button>
                  <ChevronRight className="h-3 w-3 text-graphite-300" />
                </>
              )}
              {upline.tier2 && (
                <>
                  <button
                    className="rounded-lg bg-navy-50/50 px-3 py-2 text-xs hover:bg-navy-50 transition-colors"
                    onClick={() => router.push(`/admin/reseller-network/${upline.tier2!.id}`)}
                  >
                    <p className="font-medium text-navy">{upline.tier2.displayName}</p>
                    <p className="text-[9px] text-graphite-400">Tier 2 Upline</p>
                  </button>
                  <ChevronRight className="h-3 w-3 text-graphite-300" />
                </>
              )}
              {upline.tier1 && (
                <>
                  <button
                    className="rounded-lg bg-teal-50/50 px-3 py-2 text-xs hover:bg-teal-50 transition-colors border border-teal-100/40"
                    onClick={() => router.push(`/admin/reseller-network/${upline.tier1!.id}`)}
                  >
                    <p className="font-medium text-teal-800">{upline.tier1.displayName}</p>
                    <p className="text-[9px] text-graphite-400">Direct Recruiter</p>
                  </button>
                  <ChevronRight className="h-3 w-3 text-graphite-300" />
                </>
              )}
              <div className="rounded-lg bg-navy-100/40 px-3 py-2 text-xs border border-navy-200/40">
                <p className="font-bold text-navy">{reseller.displayName}</p>
                <p className="text-[9px] text-graphite-400">Current</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <KPICard
          title="Direct Recruits"
          value={String(metrics.directRecruits)}
          icon={Users}
        />
        <KPICard
          title="Direct Sales"
          value={String(metrics.directRecruitsSales)}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Tier 2 + 3"
          value={`${metrics.tier2Count} + ${metrics.tier3Count}`}
          icon={Layers}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Network Revenue"
          value={formatPrice(metrics.totalNetworkRevenue)}
          icon={DollarSign}
          iconColor="text-gold-600"
          iconBg="bg-gold-50"
        />
        <KPICard
          title="Override Earnings"
          value={formatPrice(metrics.totalOverrideEarnings)}
          icon={TrendingUp}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Total Sales (own)"
          value={String(reseller.totalSales)}
          icon={Award}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
      </div>

      {/* Two Column: Tree + Tier Promotion */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Network Tree */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GitBranch className="h-4 w-4 text-teal" />
                Network Tree
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tree && tree.children.length > 0 ? (
                <div className="divide-y divide-navy-100/20">
                  <TreeNode
                    node={tree}
                    onNodeClick={(id) => router.push(`/admin/reseller-network/${id}`)}
                  />
                </div>
              ) : (
                <p className="text-sm text-graphite-400 text-center py-8">
                  No sub-resellers in this network yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tier Promotion + Override Rates */}
        <div className="space-y-6">
          {/* Tier Promotion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ArrowUpCircle className="h-4 w-4 text-gold-600" />
                Tier Progression
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={TIER_BADGE[promotion.currentTier] || "secondary"}>
                  {promotion.currentTier}
                </Badge>
                {promotion.qualifiesFor && (
                  <>
                    <span className="text-graphite-300">&rarr;</span>
                    <Badge variant={TIER_BADGE[promotion.qualifiesFor] || "default"}>
                      {promotion.qualifiesFor}
                    </Badge>
                  </>
                )}
              </div>

              <ProgressBar
                value={promotion.progress.salesPct}
                label="Sales"
                target={`${promotion.progress.sales} / ${promotion.requirements.salesTarget}`}
              />
              <ProgressBar
                value={promotion.progress.recruitsPct}
                label="Recruits"
                target={`${promotion.progress.recruits} / ${promotion.requirements.recruitsTarget}`}
              />
              {promotion.requirements.revenueTarget > 0 && (
                <ProgressBar
                  value={promotion.progress.revenuePct}
                  label="Network Revenue"
                  target={`${formatPrice(promotion.progress.networkRevenue)} / ${formatPrice(promotion.requirements.revenueTarget)}`}
                />
              )}

              {promotion.qualifiesFor && (
                <Button
                  className="w-full"
                  size="sm"
                  disabled={promotingTier}
                  onClick={handlePromote}
                >
                  {promotingTier ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Award className="h-3 w-3 mr-1" />
                  )}
                  Promote to {promotion.qualifiesFor}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Override Rates Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Override Commission Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-[10px] text-graphite-400">
                Percentage of each sub-reseller sale amount paid as override bonus from company margin.
              </p>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-graphite-500">Tier 1 Override %</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="25"
                    className="mt-1"
                    value={rateForm.tier1}
                    onChange={(e) => setRateForm({ ...rateForm, tier1: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-graphite-500">Tier 2 Override %</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="15"
                    className="mt-1"
                    value={rateForm.tier2}
                    onChange={(e) => setRateForm({ ...rateForm, tier2: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-graphite-500">Tier 3 Override %</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    className="mt-1"
                    value={rateForm.tier3}
                    onChange={(e) => setRateForm({ ...rateForm, tier3: e.target.value })}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                disabled={savingRates}
                onClick={handleSaveRates}
              >
                {savingRates ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                Save Override Rates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Network Performance Chart */}
      {networkChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Network Performance (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={networkChartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatPrice(value),
                    name === "directRevenue" ? "Revenue" : "Commission",
                  ]}
                />
                <Legend />
                <Bar dataKey="directRevenue" name="Revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="commission" name="Commission" fill="#d4a847" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Sub-Reseller Performance Table */}
      {allSubResellers.length > 0 && (
        <DataTable
          data={allSubResellers}
          columns={subResellerColumns}
          total={allSubResellers.length}
          page={1}
          limit={50}
          onPageChange={() => {}}
          searchPlaceholder="Search sub-resellers..."
          getRowId={(row) => row.id}
          onRowClick={(row) => router.push(`/admin/reseller-network/${row.id}`)}
          emptyMessage="No sub-resellers"
        />
      )}

      {/* Override Commission History */}
      {overrideCommissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Override Commission History</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={overrideCommissions}
              columns={overrideColumns}
              total={overrideCommissions.length}
              page={1}
              limit={50}
              onPageChange={() => {}}
              getRowId={(row) => row.id}
              emptyMessage="No override commissions yet"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
