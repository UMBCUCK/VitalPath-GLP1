"use client";

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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/admin/kpi-card";
import { ActivityFeed, type ActivityItem } from "@/components/admin/activity-feed";
import { formatPrice } from "@/lib/utils";

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

export function DashboardClient({ data }: { data: DashboardData }) {
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
          <h2 className="text-2xl font-bold text-navy">Command Center</h2>
          <p className="text-sm text-graphite-400">Real-time platform overview</p>
        </div>
        <div className="flex gap-2">
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
                      <th className="pb-3 font-medium text-graphite-400">Customer</th>
                      <th className="pb-3 font-medium text-graphite-400">Plan</th>
                      <th className="pb-3 font-medium text-graphite-400">Amount</th>
                      <th className="pb-3 font-medium text-graphite-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/30">
                    {data.recentSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-linen/20 transition-colors">
                        <td className="py-3">
                          <p className="font-medium text-navy">{sub.customerName}</p>
                          <p className="text-xs text-graphite-400">{sub.email}</p>
                        </td>
                        <td className="py-3 text-graphite-500">{sub.planName}</td>
                        <td className="py-3 font-medium text-navy">{formatPrice(sub.amount)}/mo</td>
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

        {/* Activity feed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Live Activity</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            <ActivityFeed items={data.activityFeed} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
