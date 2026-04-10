"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import {
  DataTable,
  type ColumnDef,
} from "@/components/admin/data-table";
import { formatPriceDecimal } from "@/lib/utils";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Wallet,
  Clock,
  TrendingUp,
  Copy,
  Check,
  Link2,
  Download,
  Image,
  Mail,
  Share2,
  Globe,
  FileText,
  Megaphone,
  Crown,
  ArrowRight,
} from "lucide-react";

interface DashboardData {
  totalCustomers: number;
  totalRevenueCents: number;
  totalCommissionCents: number;
  pendingCommissionCents: number;
  conversionRate: number;
  currentTier: string;
  displayName: string;
  companyName: string | null;
}

interface CustomerRow {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  plan: string;
  status: string;
  signupDate: string;
  revenueCents: number;
}

interface CommissionRow {
  id: string;
  type: string;
  amountCents: number;
  status: string;
  paidAt: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  createdAt: string;
  notes: string | null;
}

interface MonthlyEarning {
  month: string;
  earnings: number;
}

interface MarketingAssetRow {
  id: string;
  name: string;
  type: string;
  fileUrl: string | null;
  thumbnail: string | null;
  category: string | null;
  downloads: number;
}

interface TierProgressData {
  currentTier: string;
  nextTier: string | null;
  requirements: {
    sales: { current: number; needed: number };
    recruits: { current: number; needed: number };
    revenue: { current: number; needed: number };
  };
  progressPct: number;
}

interface PayoutSummaryData {
  totalEarned: number;
  totalPaid: number;
  pendingPayout: number;
  nextPayoutEstimate: string;
}

interface NetworkOverviewData {
  totalSubResellers: number;
  totalOverrideEarnings: number;
}

interface Props {
  dashboard: DashboardData;
  customers: {
    customers: CustomerRow[];
    total: number;
    page: number;
    limit: number;
  };
  commissions: {
    commissions: CommissionRow[];
    total: number;
    page: number;
    limit: number;
  };
  earnings: MonthlyEarning[];
  referralLink: string;
  displayName: string;
  tier: string;
  marketingAssets?: MarketingAssetRow[];
  tierProgress?: TierProgressData | null;
  payoutSummary?: PayoutSummaryData | null;
  networkOverview?: NetworkOverviewData | null;
}

const assetTypeIcons: Record<string, typeof Image> = {
  BANNER: Image,
  EMAIL_TEMPLATE: Mail,
  SOCIAL_POST: Share2,
  LANDING_PAGE: Globe,
  DOCUMENT: FileText,
};

const assetTypeBadgeColors: Record<string, string> = {
  BANNER: "bg-blue-50 text-blue-700 border-blue-200",
  EMAIL_TEMPLATE: "bg-purple-50 text-purple-700 border-purple-200",
  SOCIAL_POST: "bg-pink-50 text-pink-700 border-pink-200",
  LANDING_PAGE: "bg-teal-50 text-teal-700 border-teal-200",
  DOCUMENT: "bg-amber-50 text-amber-700 border-amber-200",
};

export function ResellerDashboardClient({
  dashboard,
  customers,
  commissions,
  earnings,
  referralLink,
  displayName,
  tier,
  marketingAssets = [],
  tierProgress,
  payoutSummary,
  networkOverview,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [custPage, setCustPage] = useState(customers.page);
  const [commPage, setCommPage] = useState(commissions.page);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tierColor = (t: string) => {
    const colors: Record<string, string> = {
      STANDARD: "bg-gray-100 text-gray-700",
      SILVER: "bg-slate-100 text-slate-700",
      GOLD: "bg-amber-50 text-amber-700 border-amber-200",
      AMBASSADOR: "bg-purple-50 text-purple-700 border-purple-200",
      CUSTOM: "bg-teal-50 text-teal-700 border-teal-200",
    };
    return colors[t] || "bg-gray-100 text-gray-700";
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
      PAUSED: "bg-amber-50 text-amber-700 border-amber-200",
      CANCELED: "bg-red-50 text-red-700 border-red-200",
      EXPIRED: "bg-gray-50 text-gray-500 border-gray-200",
      PENDING: "bg-amber-50 text-amber-700 border-amber-200",
      APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
      PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-600"}>
        {status}
      </Badge>
    );
  };

  const commissionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      INITIAL_SALE: "bg-navy-50 text-navy",
      RECURRING: "bg-blue-50 text-blue-700",
      BONUS: "bg-amber-50 text-amber-700",
      ADJUSTMENT: "bg-gray-100 text-gray-600",
    };
    return (
      <Badge className={colors[type] || "bg-gray-100 text-gray-600"}>
        {type.replace("_", " ")}
      </Badge>
    );
  };

  const customerColumns: ColumnDef<CustomerRow>[] = [
    {
      key: "name",
      header: "Customer",
      render: (row) => (
        <div>
          <p className="font-medium text-navy">
            {row.firstName || ""} {row.lastName || ""}
          </p>
          <p className="text-xs text-graphite-400">{row.email}</p>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (row) => (
        <span className="text-sm">{row.plan}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => statusBadge(row.status),
    },
    {
      key: "signupDate",
      header: "Signup",
      render: (row) => (
        <span className="text-sm">
          {new Date(row.signupDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "revenue",
      header: "Revenue",
      render: (row) => (
        <span className="font-medium">
          {formatPriceDecimal(row.revenueCents)}
        </span>
      ),
    },
  ];

  const commissionColumns: ColumnDef<CommissionRow>[] = [
    {
      key: "type",
      header: "Type",
      render: (row) => commissionTypeBadge(row.type),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <span className="font-semibold text-navy">
          {formatPriceDecimal(row.amountCents)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => statusBadge(row.status),
    },
    {
      key: "period",
      header: "Period",
      render: (row) => {
        if (row.periodStart && row.periodEnd) {
          return (
            <span className="text-sm">
              {new Date(row.periodStart).toLocaleDateString()} -{" "}
              {new Date(row.periodEnd).toLocaleDateString()}
            </span>
          );
        }
        return (
          <span className="text-sm">
            {new Date(row.createdAt).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: "paidAt",
      header: "Paid",
      render: (row) =>
        row.paidAt ? (
          <span className="text-sm text-emerald-600">
            {new Date(row.paidAt).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-xs text-graphite-300">--</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">
            Welcome, {displayName}
          </h2>
          <p className="text-sm text-graphite-400">
            Your reseller dashboard and performance overview
          </p>
        </div>
        <Badge className={`text-sm px-3 py-1 ${tierColor(tier)}`}>
          {tier}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Customers"
          value={String(dashboard.totalCustomers)}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Revenue Generated"
          value={formatPriceDecimal(dashboard.totalRevenueCents)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Commission Earned"
          value={formatPriceDecimal(dashboard.totalCommissionCents)}
          icon={Wallet}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Pending Payout"
          value={formatPriceDecimal(dashboard.pendingCommissionCents)}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Conversion Rate"
          value={`${dashboard.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Referral Link */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
              <Link2 className="h-5 w-5 text-teal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">
                Your Referral Link
              </p>
              <p className="text-xs text-graphite-400">
                Share this link to earn commissions on signups
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-navy-100 bg-linen/30 px-4 py-2.5">
              <code className="text-sm text-navy break-all">
                {referralLink}
              </code>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Network / Tier / Payout Overview Row */}
      {(networkOverview || tierProgress || payoutSummary) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Network Overview */}
          {networkOverview && networkOverview.totalSubResellers > 0 && (
            <Card className="border-teal/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy">
                      Partner Network
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-2xl font-bold text-navy">
                      {networkOverview.totalSubResellers}
                    </p>
                    <p className="text-xs text-graphite-400">Partners</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-teal">
                      {formatPriceDecimal(networkOverview.totalOverrideEarnings)}
                    </p>
                    <p className="text-xs text-graphite-400">Override Earnings</p>
                  </div>
                </div>
                <Link
                  href="/reseller/network"
                  className="flex items-center gap-1 text-sm font-medium text-teal hover:underline"
                >
                  View Network <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Tier Progression */}
          {tierProgress && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                    <Crown className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy">
                      Tier Progression
                    </p>
                  </div>
                  <Badge className={tierColor(tierProgress.currentTier)}>
                    {tierProgress.currentTier}
                  </Badge>
                </div>
                {tierProgress.nextTier ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-graphite-400">
                      <span>Progress to {tierProgress.nextTier}</span>
                      <span>{tierProgress.progressPct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-navy-50">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-teal to-atlantic transition-all duration-500"
                        style={{ width: `${tierProgress.progressPct}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-graphite-400">
                    Highest tier achieved
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payout Summary */}
          {payoutSummary && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy">
                      Payout Summary
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-graphite-400">Total Earned</span>
                    <span className="font-semibold text-navy">
                      {formatPriceDecimal(payoutSummary.totalEarned)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-graphite-400">Pending</span>
                    <span className="font-semibold text-amber-600">
                      {formatPriceDecimal(payoutSummary.pendingPayout)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-graphite-400">Next Payout</span>
                    <span className="font-medium text-navy">
                      {payoutSummary.nextPayoutEstimate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Monthly Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-navy">
            Monthly Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={earnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                tickFormatter={(v: number) => `$${(v / 100).toFixed(0)}`}
              />
              <Tooltip
                formatter={(value: number) => [
                  formatPriceDecimal(value),
                  "Earnings",
                ]}
              />
              <Bar
                dataKey="earnings"
                fill="#0d9488"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-navy">
            Recent Customers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={customers.customers}
            columns={customerColumns}
            total={customers.total}
            page={custPage}
            limit={customers.limit}
            onPageChange={setCustPage}
            getRowId={(r) => r.id}
            emptyMessage="No customers yet. Share your referral link to get started."
          />
        </CardContent>
      </Card>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-navy">
            Commission History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={commissions.commissions}
            columns={commissionColumns}
            total={commissions.total}
            page={commPage}
            limit={commissions.limit}
            onPageChange={setCommPage}
            getRowId={(r) => r.id}
            emptyMessage="No commissions yet."
          />
        </CardContent>
      </Card>

      {/* Marketing Materials */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
              <Megaphone className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-navy">
                Marketing Materials
              </CardTitle>
              <p className="text-xs text-graphite-400">
                Download approved marketing assets to promote Nature's Journey
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {marketingAssets.length === 0 ? (
            <div className="py-8 text-center">
              <Megaphone className="mx-auto h-10 w-10 text-graphite-300 mb-2" />
              <p className="text-sm text-graphite-400">
                No marketing materials available yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {marketingAssets.map((asset) => {
                const TypeIcon = assetTypeIcons[asset.type] || FileText;
                return (
                  <div
                    key={asset.id}
                    className="group flex items-start gap-3 rounded-lg border border-navy-100/60 p-3 transition-colors hover:bg-linen/30"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy-50">
                      {asset.thumbnail ? (
                        <img
                          src={asset.thumbnail}
                          alt={asset.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <TypeIcon className="h-5 w-5 text-graphite-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">
                        {asset.name}
                      </p>
                      <Badge
                        className={`mt-1 text-[10px] px-1.5 py-0 ${
                          assetTypeBadgeColors[asset.type] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {asset.type.replace("_", " ")}
                      </Badge>
                    </div>
                    {asset.fileUrl && (
                      <a
                        href={asset.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 rounded-lg bg-teal/10 p-2 text-teal hover:bg-teal/20 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
