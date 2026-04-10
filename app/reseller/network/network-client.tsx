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
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { formatPriceDecimal } from "@/lib/utils";
import {
  Users,
  DollarSign,
  TrendingUp,
  Crown,
  Copy,
  Check,
  Mail,
  Link2,
  ArrowRight,
} from "lucide-react";

interface SubResellerRow {
  id: string;
  displayName: string;
  companyName: string | null;
  tier: string;
  status: string;
  totalSales: number;
  totalRevenue: number;
  overrideEarned: number;
  joinedAt: string;
}

interface NetworkData {
  directRecruits: SubResellerRow[];
  totalDirectRecruits: number;
  totalNetworkRevenue: number;
  totalOverrideEarnings: number;
  referralCode: string | null;
  tier1OverridePct: number;
  tier2OverridePct: number;
  tier3OverridePct: number;
}

interface MonthlyOverrideEarning {
  month: string;
  tier1: number;
  tier2: number;
  tier3: number;
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

interface Props {
  network: NetworkData;
  overrideEarnings: MonthlyOverrideEarning[];
  tierProgress: TierProgressData;
  signupLink: string | null;
}

export function NetworkClient({
  network,
  overrideEarnings,
  tierProgress,
  signupLink,
}: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = async () => {
    if (!signupLink) return;
    await navigator.clipboard.writeText(signupLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = async () => {
    if (!network.referralCode) return;
    await navigator.clipboard.writeText(network.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleEmailInvite = () => {
    const subject = encodeURIComponent("Join Nature's Journey Partner Program");
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to invite you to join the Nature's Journey reseller partner program. As a partner, you'll earn commissions on every sale you generate.\n\nSign up using my referral link:\n${signupLink}\n\nOr use my referral code: ${network.referralCode}\n\nLooking forward to working together!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const tierColor = (t: string) => {
    const colors: Record<string, string> = {
      STANDARD: "bg-gray-100 text-gray-700",
      SILVER: "bg-slate-100 text-slate-700",
      GOLD: "bg-amber-50 text-amber-700 border-amber-200",
      AMBASSADOR: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[t] || "bg-gray-100 text-gray-700";
  };

  const statusColor = (s: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
      PAUSED: "bg-amber-50 text-amber-700 border-amber-200",
      SUSPENDED: "bg-red-50 text-red-700 border-red-200",
      TERMINATED: "bg-gray-100 text-gray-500 border-gray-200",
    };
    return colors[s] || "bg-gray-100 text-gray-600";
  };

  const progressBarWidth = (current: number, needed: number) => {
    if (needed === 0) return 100;
    return Math.min(Math.round((current / needed) * 100), 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">My Network</h2>
          <p className="text-sm text-graphite-400">
            Manage your partner network and track override earnings
          </p>
        </div>
        {network.referralCode && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-graphite-400">Referral Code:</span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 rounded-lg border border-navy-100 bg-white px-3 py-1.5 text-sm font-mono font-semibold text-navy hover:bg-linen/30 transition-colors"
            >
              {network.referralCode}
              {copiedCode ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-graphite-400" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Direct Recruits"
          value={String(network.totalDirectRecruits)}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Network Revenue"
          value={formatPriceDecimal(network.totalNetworkRevenue)}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Override Earnings"
          value={formatPriceDecimal(network.totalOverrideEarnings)}
          icon={TrendingUp}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Network Tier"
          value={tierProgress.currentTier}
          icon={Crown}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Invite Section */}
      <Card className="border-teal/20 bg-gradient-to-br from-teal-50/30 to-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal/10">
              <Users className="h-6 w-6 text-teal" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-navy">
                Invite a Partner
              </h3>
              <p className="mt-1 text-sm text-graphite-500 leading-relaxed">
                Earn override bonuses when your recruited partners make sales.
                You earn{" "}
                <span className="font-semibold text-teal">
                  {network.tier1OverridePct}%
                </span>{" "}
                on direct recruit sales,{" "}
                <span className="font-semibold text-blue-600">
                  {network.tier2OverridePct}%
                </span>{" "}
                on their recruits' sales, and{" "}
                <span className="font-semibold text-purple-600">
                  {network.tier3OverridePct}%
                </span>{" "}
                on 3rd-level sales. Bonuses are paid from company funds and do
                not reduce your recruits' commissions.
              </p>

              {signupLink && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-lg border border-navy-100 bg-white px-4 py-2.5">
                      <code className="text-sm text-navy break-all">
                        {signupLink}
                      </code>
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="h-4 w-4" /> Copied
                        </>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4" /> Copy Link
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleEmailInvite}
                      className="flex items-center gap-1.5 rounded-lg border border-navy-100 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-linen/30 transition-colors"
                    >
                      <Mail className="h-4 w-4" /> Send Email Invite
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Recruits Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-navy">
            My Recruits
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-linen/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    Tier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    Your Override
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {network.directRecruits.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-graphite-300"
                    >
                      No recruits yet. Share your referral link to grow your
                      network.
                    </td>
                  </tr>
                ) : (
                  network.directRecruits.map((recruit) => (
                    <tr
                      key={recruit.id}
                      className="hover:bg-linen/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-navy">
                            {recruit.displayName}
                          </p>
                          {recruit.companyName && (
                            <p className="text-xs text-graphite-400">
                              {recruit.companyName}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusColor(recruit.status)}>
                          {recruit.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={tierColor(recruit.tier)}>
                          {recruit.tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {recruit.totalSales}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatPriceDecimal(recruit.totalRevenue)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-teal">
                        {formatPriceDecimal(recruit.overrideEarned)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Override Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-navy">
            Override Earnings by Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={overrideEarnings}>
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
                formatter={(value: number, name: string) => [
                  formatPriceDecimal(value),
                  name === "tier1"
                    ? "Tier 1 (Direct)"
                    : name === "tier2"
                      ? "Tier 2"
                      : "Tier 3",
                ]}
              />
              <Legend
                formatter={(value: string) =>
                  value === "tier1"
                    ? "Tier 1 (Direct)"
                    : value === "tier2"
                      ? "Tier 2"
                      : "Tier 3"
                }
              />
              <Bar
                dataKey="tier1"
                stackId="overrides"
                fill="#0d9488"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="tier2"
                stackId="overrides"
                fill="#3b82f6"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="tier3"
                stackId="overrides"
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tier Progression */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-navy">
              Tier Progression
            </CardTitle>
            <Badge className={tierColor(tierProgress.currentTier)}>
              {tierProgress.currentTier}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {tierProgress.nextTier ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-sm">
                <Badge className={tierColor(tierProgress.currentTier)}>
                  {tierProgress.currentTier}
                </Badge>
                <ArrowRight className="h-4 w-4 text-graphite-300" />
                <Badge className={tierColor(tierProgress.nextTier)}>
                  {tierProgress.nextTier}
                </Badge>
                <span className="ml-auto text-graphite-400">
                  {tierProgress.progressPct}% complete
                </span>
              </div>

              {/* Overall progress */}
              <div className="h-2 w-full rounded-full bg-navy-50">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-teal to-atlantic transition-all duration-500"
                  style={{ width: `${tierProgress.progressPct}%` }}
                />
              </div>

              {/* Individual requirements */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-graphite-500">Sales</span>
                    <span className="text-graphite-400">
                      {tierProgress.requirements.sales.current} /{" "}
                      {tierProgress.requirements.sales.needed}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-navy-50">
                    <div
                      className="h-1.5 rounded-full bg-teal transition-all duration-500"
                      style={{
                        width: `${progressBarWidth(
                          tierProgress.requirements.sales.current,
                          tierProgress.requirements.sales.needed
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-graphite-500">
                      Recruits
                    </span>
                    <span className="text-graphite-400">
                      {tierProgress.requirements.recruits.current} /{" "}
                      {tierProgress.requirements.recruits.needed}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-navy-50">
                    <div
                      className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                      style={{
                        width: `${progressBarWidth(
                          tierProgress.requirements.recruits.current,
                          tierProgress.requirements.recruits.needed
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-graphite-500">
                      Revenue
                    </span>
                    <span className="text-graphite-400">
                      {formatPriceDecimal(
                        tierProgress.requirements.revenue.current
                      )}{" "}
                      /{" "}
                      {formatPriceDecimal(
                        tierProgress.requirements.revenue.needed
                      )}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-navy-50">
                    <div
                      className="h-1.5 rounded-full bg-purple-500 transition-all duration-500"
                      style={{
                        width: `${progressBarWidth(
                          tierProgress.requirements.revenue.current,
                          tierProgress.requirements.revenue.needed
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <Crown className="mx-auto h-8 w-8 text-amber-500 mb-2" />
              <p className="text-sm font-medium text-navy">
                You have reached the highest tier
              </p>
              <p className="text-xs text-graphite-400 mt-1">
                Congratulations on achieving Ambassador status
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
