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
  Network,
  Users,
  DollarSign,
  TrendingUp,
  Layers,
  Award,
  ChevronRight,
  UserPlus,
  ArrowUpCircle,
  Loader2,
  X,
  GitBranch,
} from "lucide-react";

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

interface LeaderboardEntry {
  id: string;
  displayName: string;
  companyName: string | null;
  tier: string;
  status: string;
  directRecruits: number;
  tier2Count: number;
  tier3Count: number;
  totalSales: number;
  totalNetworkRevenue: number;
  totalOverrideEarnings: number;
  networkScore: number;
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

interface PromotionCandidate {
  reseller: ResellerSummary;
  promotion: TierPromotionResult;
}

interface NetworkStats {
  totalResellers: number;
  totalActiveResellers: number;
  totalOverridesPaid: number;
  totalOverridesCount: number;
  totalNetworkRevenue: number;
  avgNetworkDepth: number;
}

interface ActiveReseller {
  id: string;
  displayName: string;
  companyName: string | null;
  tier: string;
  networkDepth: number;
}

interface NetworkClientProps {
  leaderboard: LeaderboardEntry[];
  stats: NetworkStats;
  promotions: PromotionCandidate[];
  activeResellers: ActiveReseller[];
}

// ── Badge helpers ─────────────────────────────────────────────

const TIER_BADGE: Record<string, "secondary" | "outline" | "gold" | "default" | "warning"> = {
  STANDARD: "secondary",
  SILVER: "outline",
  GOLD: "gold",
  AMBASSADOR: "default",
  CUSTOM: "warning",
};

// ── Tree Node Component ───────────────────────────────────────

function TreeNode({
  node,
  depth = 0,
  parentOverridePct,
  onNodeClick,
}: {
  node: NetworkTreeNode;
  depth?: number;
  parentOverridePct?: number;
  onNodeClick: (id: string) => void;
}) {
  const statusColor = node.reseller.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-400";
  const indentPx = depth * 48;

  return (
    <div>
      <div
        className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-navy-50/60 transition-colors cursor-pointer"
        style={{ paddingLeft: `${16 + indentPx}px` }}
        onClick={() => onNodeClick(node.reseller.id)}
      >
        {/* Connector line + node */}
        {depth > 0 && (
          <div className="flex items-center gap-1.5 text-graphite-300">
            <div className="w-5 border-t border-navy-200" />
            {parentOverridePct !== undefined && (
              <span className="text-[9px] font-medium text-teal bg-teal-50 rounded px-1 py-0.5">
                {parentOverridePct}%
              </span>
            )}
          </div>
        )}

        {/* Status dot */}
        <div className={`h-2.5 w-2.5 rounded-full ${statusColor} shrink-0`} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-navy truncate">
              {node.reseller.displayName}
            </span>
            <Badge variant={TIER_BADGE[node.reseller.tier] || "secondary"} className="text-[9px] px-1.5 py-0">
              {node.reseller.tier}
            </Badge>
          </div>
          {node.reseller.companyName && (
            <p className="text-[10px] text-graphite-400 truncate">{node.reseller.companyName}</p>
          )}
        </div>

        {/* Stats */}
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

        <ChevronRight className="h-4 w-4 text-graphite-300 shrink-0" />
      </div>

      {/* Children */}
      {node.children.map((child) => {
        const overridePctForChild =
          depth === 0
            ? node.reseller.tier1OverridePct
            : depth === 1
            ? node.reseller.tier2OverridePct
            : node.reseller.tier3OverridePct;
        return (
          <TreeNode
            key={child.reseller.id}
            node={child}
            depth={depth + 1}
            parentOverridePct={overridePctForChild}
            onNodeClick={onNodeClick}
          />
        );
      })}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────

export function NetworkClient({
  leaderboard,
  stats,
  promotions,
  activeResellers,
}: NetworkClientProps) {
  const router = useRouter();
  const [selectedTree, setSelectedTree] = useState<NetworkTreeNode | null>(null);
  const [loadingTree, setLoadingTree] = useState<string | null>(null);
  const [showRecruitForm, setShowRecruitForm] = useState(false);
  const [recruitSaving, setRecruitSaving] = useState(false);
  const [recruitError, setRecruitError] = useState<string | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  // Override rate editing
  const [editingRates, setEditingRates] = useState<string | null>(null);
  const [rateForm, setRateForm] = useState({ tier1: "", tier2: "", tier3: "" });
  const [rateSaving, setRateSaving] = useState(false);

  // Recruit form
  const [recruitForm, setRecruitForm] = useState({
    recruiterId: "",
    userId: "",
    displayName: "",
    contactEmail: "",
    companyName: "",
    contactPhone: "",
  });

  const loadTree = async (resellerId: string) => {
    setLoadingTree(resellerId);
    try {
      const res = await fetch(`/api/admin/reseller-network?action=tree&id=${resellerId}`);
      const data = await res.json();
      if (data.tree) {
        setSelectedTree(data.tree);
      }
    } catch {
      // Fail silently
    } finally {
      setLoadingTree(null);
    }
  };

  const handleRecruit = async () => {
    if (!recruitForm.recruiterId || !recruitForm.userId || !recruitForm.displayName || !recruitForm.contactEmail) {
      setRecruitError("Recruiter, user ID, display name, and email are required");
      return;
    }
    setRecruitSaving(true);
    setRecruitError(null);
    try {
      const res = await fetch("/api/admin/reseller-network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "recruit",
          recruiterId: recruitForm.recruiterId,
          newReseller: {
            userId: recruitForm.userId,
            displayName: recruitForm.displayName,
            contactEmail: recruitForm.contactEmail,
            companyName: recruitForm.companyName || undefined,
            contactPhone: recruitForm.contactPhone || undefined,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to recruit");
      }
      setShowRecruitForm(false);
      setRecruitForm({ recruiterId: "", userId: "", displayName: "", contactEmail: "", companyName: "", contactPhone: "" });
      router.refresh();
    } catch (err) {
      setRecruitError(err instanceof Error ? err.message : "Failed to recruit");
    } finally {
      setRecruitSaving(false);
    }
  };

  const handlePromote = async (resellerId: string, newTier: string) => {
    setPromotingId(resellerId);
    try {
      await fetch("/api/admin/reseller-network", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "promote", resellerId, newTier }),
      });
      router.refresh();
    } catch {
      // Fail silently
    } finally {
      setPromotingId(null);
    }
  };

  const handleSaveRates = async (resellerId: string) => {
    setRateSaving(true);
    try {
      const rates: Record<string, number> = {};
      if (rateForm.tier1) rates.tier1OverridePct = parseFloat(rateForm.tier1);
      if (rateForm.tier2) rates.tier2OverridePct = parseFloat(rateForm.tier2);
      if (rateForm.tier3) rates.tier3OverridePct = parseFloat(rateForm.tier3);

      await fetch("/api/admin/reseller-network", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update-rates", resellerId, rates }),
      });
      setEditingRates(null);
      router.refresh();
    } catch {
      // Fail silently
    } finally {
      setRateSaving(false);
    }
  };

  // Leaderboard columns — rank is derived from the sorted leaderboard position
  const leaderboardRankMap = new Map(leaderboard.map((entry, i) => [entry.id, i]));

  const leaderboardColumns: ColumnDef<LeaderboardEntry>[] = [
    {
      key: "rank",
      header: "#",
      render: (row) => {
        const i = leaderboardRankMap.get(row.id) ?? 0;
        return (
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
            i === 0 ? "bg-gold-100 text-gold-700" : i === 1 ? "bg-navy-200 text-navy" : i === 2 ? "bg-gold-50 text-gold-600" : "bg-navy-100 text-graphite-500"
          }`}>
            {i + 1}
          </span>
        );
      },
    },
    {
      key: "displayName",
      header: "Reseller",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-navy">{row.displayName}</p>
          {row.companyName && <p className="text-[10px] text-graphite-400">{row.companyName}</p>}
        </div>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      render: (row) => (
        <Badge variant={TIER_BADGE[row.tier] || "secondary"}>{row.tier}</Badge>
      ),
    },
    {
      key: "directRecruits",
      header: "Direct",
      sortable: true,
      render: (row) => <span className="text-sm font-medium text-navy">{row.directRecruits}</span>,
    },
    {
      key: "tier2Count",
      header: "T2+T3",
      render: (row) => (
        <span className="text-sm text-graphite-500">{row.tier2Count + row.tier3Count}</span>
      ),
    },
    {
      key: "totalSales",
      header: "Sales",
      sortable: true,
      render: (row) => <span className="text-sm font-medium text-navy">{row.totalSales}</span>,
    },
    {
      key: "totalNetworkRevenue",
      header: "Network Rev",
      sortable: true,
      render: (row) => <span className="text-sm font-bold text-navy">{formatPrice(row.totalNetworkRevenue)}</span>,
    },
    {
      key: "totalOverrideEarnings",
      header: "Overrides",
      sortable: true,
      render: (row) => <span className="text-sm font-semibold text-teal">{formatPrice(row.totalOverrideEarnings)}</span>,
    },
    {
      key: "networkScore",
      header: "Score",
      sortable: true,
      render: (row) => (
        <span className="text-sm font-bold text-gold-700">{row.networkScore.toLocaleString()}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            disabled={loadingTree === row.id}
            onClick={() => loadTree(row.id)}
          >
            {loadingTree === row.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <GitBranch className="h-3 w-3" />
            )}
            <span className="ml-1">Tree</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => {
              setEditingRates(row.id);
              setRateForm({ tier1: "", tier2: "", tier3: "" });
            }}
          >
            Rates
          </Button>
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
            <Network className="h-6 w-6 text-teal" />
            Reseller Network
          </h2>
          <p className="text-sm text-graphite-400">
            Multi-tier referral bonus program management and analytics
          </p>
        </div>
        <Button onClick={() => setShowRecruitForm(!showRecruitForm)}>
          {showRecruitForm ? <X className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
          {showRecruitForm ? "Cancel" : "Recruit Reseller"}
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <KPICard title="Total Resellers" value={String(stats.totalResellers)} icon={Users} />
        <KPICard
          title="Active"
          value={String(stats.totalActiveResellers)}
          icon={Users}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Network Revenue"
          value={formatPrice(stats.totalNetworkRevenue)}
          icon={DollarSign}
          iconColor="text-gold-600"
          iconBg="bg-gold-50"
        />
        <KPICard
          title="Overrides Paid"
          value={formatPrice(stats.totalOverridesPaid)}
          icon={TrendingUp}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Override Txns"
          value={String(stats.totalOverridesCount)}
          icon={Layers}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Avg Depth"
          value={String(stats.avgNetworkDepth)}
          icon={GitBranch}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
      </div>

      {/* Recruit Form */}
      {showRecruitForm && (
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-teal" />
              Recruit Sub-Reseller
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recruitError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2">{recruitError}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="text-xs font-medium text-graphite-500">Recruiter (Upline) *</label>
                <select
                  className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm mt-1"
                  value={recruitForm.recruiterId}
                  onChange={(e) => setRecruitForm({ ...recruitForm, recruiterId: e.target.value })}
                >
                  <option value="">Select recruiter...</option>
                  {activeResellers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.displayName} ({r.tier}){r.companyName ? ` - ${r.companyName}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">New Reseller User ID *</label>
                <Input
                  className="mt-1"
                  value={recruitForm.userId}
                  onChange={(e) => setRecruitForm({ ...recruitForm, userId: e.target.value })}
                  placeholder="cuid of existing user"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">Display Name *</label>
                <Input
                  className="mt-1"
                  value={recruitForm.displayName}
                  onChange={(e) => setRecruitForm({ ...recruitForm, displayName: e.target.value })}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">Contact Email *</label>
                <Input
                  className="mt-1"
                  type="email"
                  value={recruitForm.contactEmail}
                  onChange={(e) => setRecruitForm({ ...recruitForm, contactEmail: e.target.value })}
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">Company Name</label>
                <Input
                  className="mt-1"
                  value={recruitForm.companyName}
                  onChange={(e) => setRecruitForm({ ...recruitForm, companyName: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-graphite-500">Phone</label>
                <Input
                  className="mt-1"
                  value={recruitForm.contactPhone}
                  onChange={(e) => setRecruitForm({ ...recruitForm, contactPhone: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowRecruitForm(false)}>Cancel</Button>
              <Button onClick={handleRecruit} disabled={recruitSaving}>
                {recruitSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Recruit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Override Rate Editor Modal */}
      {editingRates && (
        <Card className="border-teal-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Edit Override Rates</span>
              <Button variant="ghost" size="sm" onClick={() => setEditingRates(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-graphite-400 mb-4">
              Override rates determine what percentage of a sub-reseller&apos;s sale amount goes to this reseller as a bonus.
              Paid from company margin.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
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
                  placeholder="e.g. 5.0"
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
                  placeholder="e.g. 3.0"
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
                  placeholder="e.g. 1.5"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingRates(null)}>Cancel</Button>
              <Button onClick={() => handleSaveRates(editingRates)} disabled={rateSaving}>
                {rateSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Rates
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Tree Visualization */}
      {selectedTree && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-teal" />
                Network Tree: {selectedTree.reseller.displayName}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTree(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTree.children.length === 0 ? (
              <p className="text-sm text-graphite-400 py-4 text-center">
                No sub-resellers in this network yet.
              </p>
            ) : (
              <div className="divide-y divide-navy-100/30">
                <TreeNode
                  node={selectedTree}
                  onNodeClick={(id) => router.push(`/admin/reseller-network/${id}`)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tier Promotions */}
      {promotions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowUpCircle className="h-4 w-4 text-gold-600" />
              Resellers Qualifying for Promotion ({promotions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {promotions.map(({ reseller, promotion }) => (
                <div
                  key={reseller.id}
                  className="flex items-center justify-between rounded-xl bg-gold-50/30 border border-gold-100/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-navy">{reseller.displayName}</p>
                      <p className="text-[10px] text-graphite-400">
                        {reseller.companyName || ""}{" "}
                        <Badge variant={TIER_BADGE[promotion.currentTier] || "secondary"} className="text-[9px] px-1.5 py-0">
                          {promotion.currentTier}
                        </Badge>
                        {" "}
                        <span className="text-graphite-300">&rarr;</span>
                        {" "}
                        <Badge variant={TIER_BADGE[promotion.qualifiesFor || ""] || "default"} className="text-[9px] px-1.5 py-0">
                          {promotion.qualifiesFor}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-[10px] text-graphite-400">
                      <p>Sales: {promotion.progress.sales}/{promotion.requirements.salesTarget}</p>
                      <p>Recruits: {promotion.progress.recruits}/{promotion.requirements.recruitsTarget}</p>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      disabled={promotingId === reseller.id}
                      onClick={() => handlePromote(reseller.id, promotion.qualifiesFor || "")}
                    >
                      {promotingId === reseller.id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Award className="h-3 w-3 mr-1" />
                      )}
                      Promote
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Leaderboard Table */}
      <DataTable
        data={leaderboard}
        columns={leaderboardColumns}
        total={leaderboard.length}
        page={1}
        limit={25}
        onPageChange={() => {}}
        searchPlaceholder="Search network..."
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/reseller-network/${row.id}`)}
        emptyMessage="No resellers in network yet"
      />
    </div>
  );
}
