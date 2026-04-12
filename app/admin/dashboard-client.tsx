"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Users,
  UserPlus,
  RefreshCw,
  TrendingUp,
  ShoppingCart,
  ClipboardCheck,
  AlertTriangle,
  ArrowRight,
  AlertCircle,
  Lightbulb,
  Clock,
  Settings2,
  Gift,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/admin/kpi-card";
import { ActivityFeed, type ActivityItem } from "@/components/admin/activity-feed";
import { WidgetRenderer } from "@/components/admin/widget-renderer";
import { formatPrice } from "@/lib/utils";
import { type WidgetConfig, getDefaultLayout } from "@/lib/admin-widgets";

interface InsightItem {
  id: string;
  type: string;
  metric: string;
  title: string;
  description: string;
  severity: string;
  currentValue: number;
  expectedValue: number;
  deviation: number;
  createdAt: Date | string;
}

interface DashboardData {
  kpis: {
    mrr: { value: number; sparkline: number[] };
    activeMembers: { value: number; change: number };
    newPatients: { value: number; change: number };
    churnRate: { value: number; change: number };
    arpu: { value: number; change: number };
    revenue90d: { value: number; change: number; sparkline: number[] };
    pendingIntakes: { value: number };
    atRisk: { value: number };
  };
  activityFeed: ActivityItem[];
  criticalAlerts: number;
  recentSubscriptions: {
    id: string;
    customerName: string;
    email: string;
    planName: string;
    status: string;
    amount: number;
    date: Date;
  }[];
}

const insightTypeConfig: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  ANOMALY: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
  TREND: { icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
  OPPORTUNITY: { icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50" },
  WARNING: { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50" },
};

interface ReferralStats {
  totalReferred: number;
  totalEarned: number;
  pendingPayout: number;
  activeReferrers: number;
}

function insightTimeAgo(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function DashboardClient({ data, recentInsights = [], widgetLayout, referralStats }: { data: DashboardData; recentInsights?: InsightItem[]; widgetLayout?: WidgetConfig[]; referralStats?: ReferralStats }) {
  const defaultLayout = getDefaultLayout();
  const isCustomLayout =
    widgetLayout &&
    JSON.stringify(widgetLayout.map((w) => w.type)) !==
      JSON.stringify(defaultLayout.map((w) => w.type));
  // Fire-and-forget: evaluate smart alert rules on dashboard load
  useEffect(() => {
    fetch("/api/admin/alerts/evaluate", { method: "POST" }).catch(() => {
      // Silent failure — alerts are non-critical
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Critical alert banner */}
      {data.criticalAlerts > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm font-medium text-red-800">
            {data.criticalAlerts} critical alert{data.criticalAlerts > 1 ? "s" : ""} require attention
          </p>
          <Link href="/admin/webhooks" className="ml-auto text-sm font-medium text-red-600 hover:underline">
            View alerts
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Command Center</h2>
          <p className="text-sm text-muted-foreground">Real-time platform overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/customize">
              <Settings2 className="mr-1.5 h-3.5 w-3.5" />
              Customize
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/customers?status=intake_review">
              <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
              Review Intakes ({data.kpis.pendingIntakes.value})
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/subscriptions?tab=past_due">
              <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
              Past Due ({data.kpis.atRisk.value})
            </Link>
          </Button>
        </div>
      </div>

      {/* Custom widget layout or default dashboard */}
      {isCustomLayout ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {widgetLayout!.map((widget) => {
            return (
              <div
                key={widget.id}
                style={{ gridColumn: `span ${Math.min(widget.position.w, 4)}` }}
              >
                <WidgetRenderer
                  type={widget.type}
                  data={data}
                  recentInsights={recentInsights}
                  config={widget.config}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {/* KPI Cards - 4x2 grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="MRR"
              value={formatPrice(data.kpis.mrr.value)}
              icon={DollarSign}
              sparklineData={data.kpis.mrr.sparkline}
              sparklineColor="#0d9488"
              iconColor="text-teal"
              iconBg="bg-teal-50"
            />
            <KPICard
              title="Active Members"
              value={String(data.kpis.activeMembers.value)}
              change={data.kpis.activeMembers.change}
              changeLabel="vs prev"
              icon={Users}
              iconColor="text-navy"
              iconBg="bg-navy-50"
            />
            <KPICard
              title="New Patients (30d)"
              value={String(data.kpis.newPatients.value)}
              change={data.kpis.newPatients.change}
              changeLabel="vs prev"
              icon={UserPlus}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <KPICard
              title="Churn Rate"
              value={`${data.kpis.churnRate.value}%`}
              change={data.kpis.churnRate.change}
              changeLabel="vs prev"
              icon={RefreshCw}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
              sparklineColor="#d97706"
            />
            <KPICard
              title="ARPU"
              value={formatPrice(data.kpis.arpu.value)}
              icon={TrendingUp}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-50"
            />
            <KPICard
              title="Revenue (90d)"
              value={formatPrice(data.kpis.revenue90d.value)}
              change={data.kpis.revenue90d.change}
              changeLabel="vs prev"
              icon={ShoppingCart}
              sparklineData={data.kpis.revenue90d.sparkline}
              sparklineColor="#1e3a5f"
            />
            <KPICard
              title="Pending Intakes"
              value={String(data.kpis.pendingIntakes.value)}
              icon={ClipboardCheck}
              iconColor="text-amber-600"
              iconBg="bg-amber-50"
            />
            <KPICard
              title="At-Risk"
              value={String(data.kpis.atRisk.value)}
              icon={AlertTriangle}
              iconColor="text-red-500"
              iconBg="bg-red-50"
              sparklineColor="#ef4444"
            />
          </div>

          {/* Referral Program Health */}
          {referralStats && (
            <Card className="border-teal/20 bg-gradient-to-r from-teal-50/30 to-sage/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/10">
                      <Gift className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy">Referral Program</p>
                      <p className="text-xs text-graphite-400">{referralStats.activeReferrers} active referrers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="text-center">
                      <p className="text-lg font-bold text-navy">{referralStats.totalReferred}</p>
                      <p className="text-[10px] text-graphite-400 uppercase tracking-wide">Total Referred</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-navy">{formatPrice(referralStats.totalEarned)}</p>
                      <p className="text-[10px] text-graphite-400 uppercase tracking-wide">Total Earned</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-amber-600">{formatPrice(referralStats.pendingPayout)}</p>
                      <p className="text-[10px] text-graphite-400 uppercase tracking-wide">Pending Payout</p>
                    </div>
                  </div>
                  <Link href="/admin/referrals" className="text-xs font-medium text-teal hover:underline flex items-center gap-1">
                    Manage <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main content: Subscriptions + Activity Feed */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent subscriptions */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Recent Subscriptions</CardTitle>
                <Link href="/admin/subscriptions" className="flex items-center gap-1 text-xs font-medium text-teal hover:underline">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent>
                {data.recentSubscriptions.length === 0 ? (
                  <p className="py-8 text-center text-sm text-graphite-300">No subscriptions yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-navy-100/40 text-left">
                          <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                          <th className="pb-3 font-medium text-muted-foreground">Plan</th>
                          <th className="pb-3 font-medium text-muted-foreground">Amount</th>
                          <th className="pb-3 font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-100/30">
                        {data.recentSubscriptions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-linen/20 transition-colors">
                            <td className="py-3">
                              <p className="font-medium text-foreground">{sub.customerName}</p>
                              <p className="text-xs text-muted-foreground">{sub.email}</p>
                            </td>
                            <td className="py-3 text-muted-foreground">{sub.planName}</td>
                            <td className="py-3 font-medium text-foreground">{formatPrice(sub.amount)}/mo</td>
                            <td className="py-3">
                              <Badge
                                variant={
                                  sub.status === "ACTIVE"
                                    ? "success"
                                    : sub.status === "PAST_DUE"
                                    ? "destructive"
                                    : sub.status === "TRIALING"
                                    ? "default"
                                    : "warning"
                                }
                              >
                                {sub.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right column: Activity feed + Insights */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Live Activity</CardTitle>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto">
                  <ActivityFeed items={data.activityFeed} />
                </CardContent>
              </Card>

              {/* Recent Insights */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-base">Insights</CardTitle>
                  <Link href="/admin/insights" className="flex items-center gap-1 text-xs font-medium text-teal hover:underline">
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentInsights.length === 0 ? (
                    <div className="py-6 text-center">
                      <Lightbulb className="mx-auto h-5 w-5 text-graphite-300" />
                      <p className="mt-2 text-xs text-graphite-300">No insights yet</p>
                      <Link href="/admin/insights" className="mt-1 inline-block text-xs text-teal hover:underline">
                        Run detection
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentInsights.map((insight) => {
                        const tc = insightTypeConfig[insight.type] || insightTypeConfig.WARNING;
                        const Icon = tc.icon;
                        return (
                          <div key={insight.id} className="flex items-start gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-linen/30">
                            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tc.bg}`}>
                              <Icon className={`h-3.5 w-3.5 ${tc.color}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-navy truncate">{insight.title}</p>
                              <p className="text-[10px] text-graphite-400 line-clamp-2">{insight.description}</p>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-0.5">
                              <Badge
                                variant={insight.severity === "HIGH" ? "destructive" : insight.severity === "MEDIUM" ? "warning" : "secondary"}
                                className="text-[9px] px-1.5 py-0"
                              >
                                {insight.severity}
                              </Badge>
                              <span className="flex items-center gap-0.5 text-[9px] text-graphite-300">
                                <Clock className="h-2.5 w-2.5" />
                                {insightTimeAgo(insight.createdAt)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
