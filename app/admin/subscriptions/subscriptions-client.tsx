"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/admin/kpi-card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  Users, AlertTriangle, PauseCircle, XCircle, TrendingUp, TrendingDown,
  Mail, Tag, RefreshCw, Shield, Activity,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ActionChip } from "@/components/admin/action-chip";

interface Props {
  health: {
    active: number; trialing: number; pastDue: number; paused: number;
    canceledRecent: number; newRecent: number; netGrowth: number;
  };
  atRisk: {
    subscriptions: {
      id: string; userId: string; name: string; email: string; plan: string;
      status: string; riskSignal: string; daysInactive: number | null;
      cancelAt: Date | null; amount: number;
    }[];
    total: number;
  };
  savePerformance: {
    offers: { type: string; count: number }[];
    totalSaved: number; totalCancellations: number; saveRate: number;
  };
  dunning: {
    subscriptions: {
      id: string; userId: string; name: string; email: string; plan: string;
      amount: number; daysPastDue: number; periodEnd: Date | null;
    }[];
    total: number;
  };
  churnDistribution: {
    label: string; min: number; max: number; count: number; color: string;
  }[];
  highChurn: {
    patients: {
      userId: string; name: string; email: string; churnRisk: number;
      healthScore: number; churnRiskFactors: Record<string, number> | null;
      daysInactive: number | null; plan: string; subscriptionStatus: string;
    }[];
    total: number;
  };
  recommendations: Record<string, { action: string; type: string; priority: string }>;
  currentTab: string;
  page: number;
}

export function SubscriptionsClient({ health, atRisk, savePerformance, dunning, churnDistribution, highChurn, recommendations, currentTab, page }: Props) {
  const router = useRouter();

  const setTab = (tab: string) => router.push(`/admin/subscriptions?tab=${tab}`);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "at_risk", label: `At-Risk (${atRisk.total})` },
    { key: "churn_risk", label: `Churn Risk (${highChurn.total})` },
    { key: "dunning", label: `Dunning (${dunning.total})` },
    { key: "save_offers", label: "Save Offers" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Subscription Operations</h2>
        <p className="text-sm text-graphite-400">Health monitoring, churn prevention, and dunning management</p>
      </div>

      {/* Health cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <KPICard title="Active" value={String(health.active)} icon={Users} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
        <KPICard title="Trialing" value={String(health.trialing)} icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" />
        <KPICard title="Past Due" value={String(health.pastDue)} icon={AlertTriangle} iconColor="text-red-500" iconBg="bg-red-50" />
        <KPICard title="Paused" value={String(health.paused)} icon={PauseCircle} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <KPICard title="Canceled (30d)" value={String(health.canceledRecent)} icon={XCircle} iconColor="text-red-500" iconBg="bg-red-50" />
        <KPICard title="Net Growth" value={`${health.netGrowth >= 0 ? "+" : ""}${health.netGrowth}`} icon={health.netGrowth >= 0 ? TrendingUp : TrendingDown} iconColor={health.netGrowth >= 0 ? "text-emerald-600" : "text-red-500"} iconBg={health.netGrowth >= 0 ? "bg-emerald-50" : "bg-red-50"} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-linen/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTab(tab.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              currentTab === tab.key
                ? "bg-white text-navy shadow-sm"
                : "text-graphite-400 hover:text-graphite-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {currentTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Recent At-Risk</CardTitle></CardHeader>
            <CardContent>
              {atRisk.subscriptions.slice(0, 5).map((sub) => (
                <div key={sub.id} className="flex items-center justify-between border-b border-navy-100/20 py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-navy">{sub.name}</p>
                    <p className="text-xs text-graphite-400">{sub.plan} - {sub.riskSignal}</p>
                  </div>
                  <Badge variant={sub.status === "PAST_DUE" ? "destructive" : "warning"}>
                    {sub.status}
                  </Badge>
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

      {currentTab === "at_risk" && (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
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
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Mail className="mr-1 h-3 w-3" /> Email
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Tag className="mr-1 h-3 w-3" /> Coupon
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === "dunning" && (
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
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
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <RefreshCw className="mr-1 h-3 w-3" /> Retry
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Mail className="mr-1 h-3 w-3" /> Remind
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === "save_offers" && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-teal" /> Save Offer Analytics</CardTitle></CardHeader>
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
              ) : (
                savePerformance.offers.map((offer) => {
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
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === "churn_risk" && (
        <div className="space-y-6">
          {/* Churn Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-500" /> Churn Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {churnDistribution.every((b) => b.count === 0) ? (
                <p className="py-8 text-center text-sm text-graphite-300">No churn data yet. Run recalculation first.</p>
              ) : (
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={churnDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 10, fill: "#677A8A" }}
                      />
                      <YAxis tick={{ fontSize: 10, fill: "#677A8A" }} />
                      <Tooltip
                        formatter={(v: number) => [v, "Patients"]}
                        contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {churnDistribution.map((band, i) => (
                          <Cell key={i} fill={band.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* High Churn Patients Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">High Churn Risk Patients ({highChurn.total})</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {highChurn.patients.length === 0 ? (
                <p className="py-8 text-center text-sm text-graphite-300">No high-churn patients detected</p>
              ) : (
                <div className="overflow-x-auto">
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
                              <Badge
                                variant={
                                  patient.churnRisk >= 80
                                    ? "destructive"
                                    : patient.churnRisk >= 60
                                    ? "warning"
                                    : "default"
                                }
                              >
                                {patient.churnRisk}%
                              </Badge>
                            </td>
                            <td className="py-3">
                              <span
                                className={cn(
                                  "font-medium",
                                  patient.healthScore >= 70
                                    ? "text-emerald-600"
                                    : patient.healthScore >= 40
                                    ? "text-amber-600"
                                    : "text-red-500"
                                )}
                              >
                                {patient.healthScore}
                              </span>
                            </td>
                            <td className="py-3 text-graphite-500">
                              {patient.daysInactive !== null ? `${patient.daysInactive}d` : "--"}
                            </td>
                            <td className="py-3 text-graphite-500">{patient.plan}</td>
                            <td className="py-3">
                              {rec ? (
                                <ActionChip
                                  recommendation={{
                                    action: rec.action,
                                    type: rec.type as "payment" | "engagement" | "upgrade" | "winback",
                                    priority: rec.priority as "high" | "medium" | "low",
                                  }}
                                />
                              ) : (
                                <span className="text-xs text-graphite-300">--</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
