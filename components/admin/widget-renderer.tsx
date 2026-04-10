"use client";

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
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { ActivityFeed, type ActivityItem } from "@/components/admin/activity-feed";
import { formatPrice } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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

interface InsightItem {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  createdAt: Date | string;
}

interface WidgetRendererProps {
  type: string;
  data: DashboardData;
  recentInsights?: InsightItem[];
  config?: Record<string, unknown>;
}

export function WidgetRenderer({ type, data, recentInsights = [] }: WidgetRendererProps) {
  switch (type) {
    // ── KPI widgets ──────────────────────────────────────────
    case "kpi_mrr":
      return (
        <KPICard
          title="MRR"
          value={formatPrice(data.kpis.mrr.value)}
          icon={DollarSign}
          sparklineData={data.kpis.mrr.sparkline}
          sparklineColor="#0d9488"
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
      );

    case "kpi_active_members":
      return (
        <KPICard
          title="Active Members"
          value={String(data.kpis.activeMembers.value)}
          change={data.kpis.activeMembers.change}
          changeLabel="vs prev"
          icon={Users}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
      );

    case "kpi_new_patients":
      return (
        <KPICard
          title="New Patients (30d)"
          value={String(data.kpis.newPatients.value)}
          change={data.kpis.newPatients.change}
          changeLabel="vs prev"
          icon={UserPlus}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      );

    case "kpi_churn_rate":
      return (
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
      );

    case "kpi_arpu":
      return (
        <KPICard
          title="ARPU"
          value={formatPrice(data.kpis.arpu.value)}
          icon={TrendingUp}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
      );

    case "kpi_revenue":
      return (
        <KPICard
          title="Revenue (90d)"
          value={formatPrice(data.kpis.revenue90d.value)}
          change={data.kpis.revenue90d.change}
          changeLabel="vs prev"
          icon={ShoppingCart}
          sparklineData={data.kpis.revenue90d.sparkline}
          sparklineColor="#1e3a5f"
        />
      );

    case "kpi_pending_intakes":
      return (
        <KPICard
          title="Pending Intakes"
          value={String(data.kpis.pendingIntakes.value)}
          icon={ClipboardCheck}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      );

    case "kpi_at_risk":
      return (
        <KPICard
          title="At-Risk"
          value={String(data.kpis.atRisk.value)}
          icon={AlertTriangle}
          iconColor="text-red-500"
          iconBg="bg-red-50"
          sparklineColor="#ef4444"
        />
      );

    // ── Chart widgets ────────────────────────────────────────
    case "chart_revenue_trend":
      return <RevenueChartWidget sparkline={data.kpis.revenue90d.sparkline} />;

    case "chart_funnel":
      return <FunnelChartWidget data={data} />;

    // ── Feed widgets ─────────────────────────────────────────
    case "feed_activity":
      return (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Live Activity</CardTitle>
          </CardHeader>
          <CardContent className="max-h-72 overflow-y-auto">
            <ActivityFeed items={data.activityFeed} />
          </CardContent>
        </Card>
      );

    case "feed_insights":
      return <InsightsWidget insights={recentInsights} />;

    // ── Table widgets ────────────────────────────────────────
    case "table_subscriptions":
      return <SubscriptionsTableWidget subscriptions={data.recentSubscriptions} />;

    case "table_at_risk":
      return <AtRiskTableWidget count={data.kpis.atRisk.value} />;

    default:
      return (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-sm text-graphite-400">Unknown widget: {type}</p>
          </CardContent>
        </Card>
      );
  }
}

// ── Revenue Trend chart ──────────────────────────────────────

function RevenueChartWidget({ sparkline }: { sparkline: number[] }) {
  const chartData = sparkline.map((val, i) => ({
    name: `W${i + 1}`,
    revenue: val,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Revenue Trend</CardTitle>
        <Link
          href="/admin/analytics"
          className="flex items-center gap-1 text-xs font-medium text-teal hover:underline"
        >
          Details <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0d9488"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Funnel chart ──────────────────────────────────────────────

function FunnelChartWidget({ data }: { data: DashboardData }) {
  const total =
    data.kpis.activeMembers.value +
    data.kpis.newPatients.value +
    data.kpis.pendingIntakes.value;

  const funnelData = [
    { name: "Visitors", value: total * 3, fill: "#e5e7eb" },
    { name: "Quiz Started", value: total * 2, fill: "#93c5fd" },
    { name: "Intake Complete", value: Math.round(total * 1.2), fill: "#6366f1" },
    { name: "Subscribed", value: data.kpis.activeMembers.value, fill: "#0d9488" },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Insights widget ──────────────────────────────────────────

function InsightsWidget({ insights }: { insights: InsightItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">AI Insights</CardTitle>
        <Link
          href="/admin/insights"
          className="flex items-center gap-1 text-xs font-medium text-teal hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="max-h-72 overflow-y-auto">
        {insights.length === 0 ? (
          <div className="py-6 text-center">
            <Lightbulb className="mx-auto h-5 w-5 text-graphite-300" />
            <p className="mt-2 text-xs text-graphite-300">No insights yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-linen/30"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-navy truncate">
                    {insight.title}
                  </p>
                  <p className="text-[10px] text-graphite-400 line-clamp-2">
                    {insight.description}
                  </p>
                </div>
                <Badge
                  variant={
                    insight.severity === "HIGH"
                      ? "destructive"
                      : insight.severity === "MEDIUM"
                        ? "warning"
                        : "secondary"
                  }
                  className="shrink-0 text-[9px] px-1.5 py-0"
                >
                  {insight.severity}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Subscriptions table widget ───────────────────────────────

function SubscriptionsTableWidget({
  subscriptions,
}: {
  subscriptions: DashboardData["recentSubscriptions"];
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Recent Subscriptions</CardTitle>
        <Link
          href="/admin/subscriptions"
          className="flex items-center gap-1 text-xs font-medium text-teal hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {subscriptions.length === 0 ? (
          <p className="py-8 text-center text-sm text-graphite-300">
            No subscriptions yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 text-left">
                  <th className="pb-2 font-medium text-graphite-400">Customer</th>
                  <th className="pb-2 font-medium text-graphite-400">Plan</th>
                  <th className="pb-2 font-medium text-graphite-400">Amount</th>
                  <th className="pb-2 font-medium text-graphite-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {subscriptions.slice(0, 5).map((sub) => (
                  <tr key={sub.id} className="hover:bg-linen/20 transition-colors">
                    <td className="py-2">
                      <p className="text-xs font-medium text-navy">
                        {sub.customerName}
                      </p>
                    </td>
                    <td className="py-2 text-xs text-graphite-500">
                      {sub.planName}
                    </td>
                    <td className="py-2 text-xs font-medium text-navy">
                      {formatPrice(sub.amount)}/mo
                    </td>
                    <td className="py-2">
                      <Badge
                        variant={
                          sub.status === "ACTIVE"
                            ? "success"
                            : sub.status === "PAST_DUE"
                              ? "destructive"
                              : "warning"
                        }
                        className="text-[10px] px-1.5 py-0"
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
  );
}

// ── At-Risk patients widget ──────────────────────────────────

function AtRiskTableWidget({ count }: { count: number }) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">At-Risk Patients</CardTitle>
        <Link
          href="/admin/subscriptions?tab=past_due"
          className="flex items-center gap-1 text-xs font-medium text-teal hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-navy">{count}</p>
            <p className="text-xs text-graphite-400">
              patients with past-due subscriptions
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
