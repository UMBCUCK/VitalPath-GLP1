"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Loader2,
  ArrowRight,
  Shield,
  AlertTriangle,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────

interface SubResellerRow {
  id: string;
  displayName: string;
  companyName: string | null;
  tier: string;
  status: string;
  totalSales: number;
  totalRevenue: number;
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

// ─── Component ─────────────────────────────────────────────

export function NetworkClient({
  network,
  tierProgress,
  signupLink,
}: Props) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<"sent" | "error" | null>(null);

  const handleCopyCode = async () => {
    if (!network.referralCode) return;
    await navigator.clipboard.writeText(network.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleEmailInvite = async () => {
    if (!inviteEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim())) return;
    setInviteLoading(true);
    setInviteResult(null);
    try {
      const res = await fetch("/api/reseller/network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      if (res.ok) {
        setInviteResult("sent");
        setInviteEmail("");
        setTimeout(() => setInviteResult(null), 5000);
      } else {
        setInviteResult("error");
      }
    } catch {
      setInviteResult("error");
    } finally {
      setInviteLoading(false);
    }
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
            Introduce partners to VitalPath and track your introductions
          </p>
        </div>
        {network.referralCode && (
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-lg border border-navy-100 bg-white px-3 py-1.5 text-sm font-mono font-semibold text-navy hover:bg-linen/30 transition-colors"
          >
            {network.referralCode}
            {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-graphite-400" />}
          </button>
        )}
      </div>

      {/* KPIs — no override earnings displayed */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPICard
          title="Partners Introduced"
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
          title="Current Tier"
          value={tierProgress.currentTier}
          icon={Crown}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Compliance notice */}
      <div className="rounded-xl border border-teal/20 bg-teal-50/20 p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-teal shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-navy">How Partner Introductions Work</p>
          <p className="text-xs text-graphite-500 mt-1 leading-relaxed">
            You can introduce potential resellers to VitalPath. If they complete onboarding and become
            an active reseller, you may receive a <strong>one-time flat introduction bonus</strong> (subject to
            admin approval). You do <strong>not</strong> earn ongoing commissions from their sales — all
            commissions are based on your own direct subscription sales only. This structure ensures
            compliance with federal healthcare regulations.
          </p>
        </div>
      </div>

      {/* Introduce a Partner */}
      <Card className="border-teal/20">
        <CardHeader>
          <CardTitle className="text-base">Introduce a Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-graphite-400 mb-3">
            Enter their email address to send an introduction email. They will go through
            the full compliance onboarding process.
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="partner@example.com"
              disabled={inviteLoading}
              className="flex-1"
            />
            <Button
              onClick={handleEmailInvite}
              disabled={inviteLoading || !inviteEmail.trim()}
            >
              {inviteLoading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-1 h-4 w-4" />
              )}
              Send Invite
            </Button>
          </div>
          {inviteResult === "sent" && (
            <p className="mt-2 text-xs text-teal flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Invitation sent successfully!
            </p>
          )}
          {inviteResult === "error" && (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Failed to send. They may already be a reseller.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Introduced Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-navy">
            Partners You Introduced ({network.totalDirectRecruits})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-linen/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">Partner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">Tier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">Sales</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {network.directRecruits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-graphite-300">
                      You haven&apos;t introduced any partners yet. Use the form above to get started.
                    </td>
                  </tr>
                ) : (
                  network.directRecruits.map((recruit) => (
                    <tr key={recruit.id} className="hover:bg-linen/20 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-navy">{recruit.displayName}</p>
                          {recruit.companyName && (
                            <p className="text-xs text-graphite-400">{recruit.companyName}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusColor(recruit.status)}>{recruit.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={tierColor(recruit.tier)}>{recruit.tier}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium">{recruit.totalSales}</td>
                      <td className="px-4 py-3 text-graphite-400 text-xs">
                        {new Date(recruit.joinedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tier Progression — removed "recruits" from requirements display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-navy">Tier Progression</CardTitle>
            <Badge className={tierColor(tierProgress.currentTier)}>{tierProgress.currentTier}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {tierProgress.nextTier ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-sm">
                <Badge className={tierColor(tierProgress.currentTier)}>{tierProgress.currentTier}</Badge>
                <ArrowRight className="h-4 w-4 text-graphite-300" />
                <Badge className={tierColor(tierProgress.nextTier)}>{tierProgress.nextTier}</Badge>
                <span className="ml-auto text-graphite-400">{tierProgress.progressPct}% complete</span>
              </div>

              <div className="h-2 w-full rounded-full bg-navy-50">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-teal to-atlantic transition-all duration-500"
                  style={{ width: `${tierProgress.progressPct}%` }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-graphite-500">Direct Sales</span>
                    <span className="text-graphite-400">
                      {tierProgress.requirements.sales.current} / {tierProgress.requirements.sales.needed}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-navy-50">
                    <div
                      className="h-1.5 rounded-full bg-teal transition-all duration-500"
                      style={{ width: `${progressBarWidth(tierProgress.requirements.sales.current, tierProgress.requirements.sales.needed)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-graphite-500">Revenue Generated</span>
                    <span className="text-graphite-400">
                      {formatPriceDecimal(tierProgress.requirements.revenue.current)} / {formatPriceDecimal(tierProgress.requirements.revenue.needed)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-navy-50">
                    <div
                      className="h-1.5 rounded-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${progressBarWidth(tierProgress.requirements.revenue.current, tierProgress.requirements.revenue.needed)}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-graphite-400 italic">
                Tier advancement is based on your own direct sales and revenue only. Partner introductions do not count toward tier requirements.
              </p>
            </div>
          ) : (
            <div className="py-4 text-center">
              <Crown className="mx-auto h-8 w-8 text-amber-500 mb-2" />
              <p className="text-sm font-medium text-navy">You have reached the highest tier</p>
              <p className="text-xs text-graphite-400 mt-1">Congratulations on achieving Ambassador status</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
