"use client";

import { useRouter } from "next/navigation";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Tag,
  Megaphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { exportToCSV } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0d9488", "#1e3a5f", "#d4a843", "#6366f1", "#ec4899", "#f97316", "#14b8a6"];

interface SalesOverview {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  newSubscriptions: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
  revenueByProduct: { name: string; revenue: number; orders: number; isAddon: boolean }[];
  revenueBySource: { source: string; revenue: number; orders: number; users: number }[];
  newCustomerRevenue: number;
  returningCustomerRevenue: number;
  couponImpact: {
    totalDiscount: number;
    ordersWithCoupons: number;
    avgDiscountPerOrder: number;
    topCoupon: { code: string; uses: number; discount: number } | null;
    coupons: { code: string; uses: number; discount: number }[];
  };
}

interface SalesPerformance {
  resellerPerformance: {
    id: string;
    name: string;
    company: string | null;
    tier: string;
    commissionType: string;
    commissionPct: number | null;
    totalRevenue: number;
    totalCommission: number;
    totalCustomers: number;
    conversionRate: number | null;
    periodEarned: number;
    periodOrders: number;
  }[];
  channels: {
    source: string;
    leads: number;
    conversions: number;
    conversionRate: number;
  }[];
  totalCommissionPaid: number;
  totalCommissionPending: number;
}

interface TrendPoint {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  newSubscriptions: number;
}

interface SalesClientProps {
  overview: SalesOverview;
  performance: SalesPerformance;
  trend: TrendPoint[];
  initialFrom: string;
  initialTo: string;
}

export function SalesClient({
  overview,
  performance,
  trend,
  initialFrom,
  initialTo,
}: SalesClientProps) {
  const router = useRouter();

  const handleDateChange = (from: string, to: string) => {
    router.push(`/admin/sales?from=${from}&to=${to}`);
  };

  const topChannel = overview.revenueBySource[0]?.source || "N/A";

  const sourceData = overview.revenueBySource.map((s) => ({
    name: s.source,
    value: s.revenue,
  }));

  const handleExportSales = () => {
    exportToCSV(
      overview.revenueByDay,
      [
        { key: "date", header: "Date", getValue: (r) => r.date },
        { key: "revenue", header: "Revenue", getValue: (r) => formatPrice(r.revenue) },
        { key: "orders", header: "Orders", getValue: (r) => String(r.orders) },
      ],
      "sales-by-day"
    );
  };

  const handleExportResellers = () => {
    exportToCSV(
      performance.resellerPerformance,
      [
        { key: "name", header: "Reseller", getValue: (r) => r.name },
        { key: "company", header: "Company", getValue: (r) => r.company || "" },
        { key: "tier", header: "Tier", getValue: (r) => r.tier },
        { key: "revenue", header: "Total Revenue", getValue: (r) => formatPrice(r.totalRevenue) },
        { key: "commission", header: "Total Commission", getValue: (r) => formatPrice(r.totalCommission) },
        { key: "customers", header: "Customers", getValue: (r) => String(r.totalCustomers) },
        { key: "rate", header: "Conversion Rate", getValue: (r) => `${r.conversionRate ?? 0}%` },
      ],
      "reseller-performance"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Sales Monitor</h1>
          <p className="text-sm text-graphite-400">
            Revenue, orders, and sales performance insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportSales}
            className="rounded-xl border border-navy-200 px-3 py-2 text-sm text-navy hover:bg-navy-50 transition-colors"
          >
            Export CSV
          </button>
          <DateRangePicker
            from={initialFrom}
            to={initialTo}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title="Total Revenue"
          value={formatPrice(overview.totalRevenue)}
          icon={DollarSign}
          sparklineData={trend.map((t) => t.revenue)}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Orders"
          value={String(overview.totalOrders)}
          icon={ShoppingBag}
          sparklineData={trend.map((t) => t.orders)}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Avg Order Value"
          value={formatPrice(overview.avgOrderValue)}
          icon={TrendingUp}
          iconColor="text-gold-600"
          iconBg="bg-gold-50"
        />
        <KPICard
          title="New Subscriptions"
          value={String(overview.newSubscriptions)}
          icon={Users}
          sparklineData={trend.map((t) => t.newSubscriptions)}
          iconColor="text-atlantic"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Coupon Discounts"
          value={formatPrice(overview.couponImpact.totalDiscount)}
          icon={Tag}
          iconColor="text-red-500"
          iconBg="bg-red-50"
        />
        <KPICard
          title="Top Channel"
          value={topChannel}
          icon={Megaphone}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 100).toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), "Revenue"]}
                  labelFormatter={(label) =>
                    new Date(label).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0d9488"
                  fill="#0d948820"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Product */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overview.revenueByProduct.slice(0, 8)}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `$${(v / 100).toLocaleString()}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip formatter={(value: number) => [formatPrice(value), "Revenue"]} />
                  <Bar dataKey="revenue" fill="#0d9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Source</CardTitle>
          </CardHeader>
          <CardContent>
            {sourceData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {sourceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatPrice(value), "Revenue"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-graphite-300">No source data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Type Split */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">New vs Returning Customer Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-graphite-500">New Customers</span>
                <span className="font-semibold text-navy">{formatPrice(overview.newCustomerRevenue)}</span>
              </div>
              <div className="h-3 rounded-full bg-navy-50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal transition-all"
                  style={{
                    width: `${overview.totalRevenue > 0 ? (overview.newCustomerRevenue / overview.totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-graphite-500">Returning Customers</span>
                <span className="font-semibold text-navy">{formatPrice(overview.returningCustomerRevenue)}</span>
              </div>
              <div className="h-3 rounded-full bg-navy-50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-navy transition-all"
                  style={{
                    width: `${overview.totalRevenue > 0 ? (overview.returningCustomerRevenue / overview.totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seller Performance Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Seller Performance</CardTitle>
          <button
            onClick={handleExportResellers}
            className="rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs text-navy hover:bg-navy-50 transition-colors"
          >
            Export
          </button>
        </CardHeader>
        <CardContent>
          {performance.resellerPerformance.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-navy-100/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">Reseller</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">Tier</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Period Orders</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Customers</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Conv. Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Commission Earned</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Commission Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {performance.resellerPerformance.map((r) => (
                    <tr key={r.id} className="hover:bg-linen/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy">{r.name}</p>
                        {r.company && <p className="text-xs text-graphite-400">{r.company}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={r.tier === "AMBASSADOR" ? "success" : r.tier === "GOLD" ? "warning" : "secondary"}>
                          {r.tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-navy">{formatPrice(r.totalRevenue)}</td>
                      <td className="px-4 py-3 text-right text-graphite-500">{r.periodOrders}</td>
                      <td className="px-4 py-3 text-right text-graphite-500">{r.totalCustomers}</td>
                      <td className="px-4 py-3 text-right text-graphite-500">{r.conversionRate ?? 0}%</td>
                      <td className="px-4 py-3 text-right font-medium text-teal">{formatPrice(r.periodEarned)}</td>
                      <td className="px-4 py-3 text-right text-graphite-500">{r.commissionPct ?? 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-graphite-300">No reseller data available</p>
          )}
        </CardContent>
      </Card>

      {/* Channel Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue by Channel</CardTitle>
        </CardHeader>
        <CardContent>
          {performance.channels.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-navy-100/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">Source</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Leads</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Conversions</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Conv. Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">CAC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {performance.channels.map((ch) => (
                    <tr key={ch.source} className="hover:bg-linen/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-navy">{ch.source}</td>
                      <td className="px-4 py-3 text-right text-graphite-500">{ch.leads}</td>
                      <td className="px-4 py-3 text-right text-graphite-500">{ch.conversions}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={ch.conversionRate > 10 ? "text-emerald-600 font-medium" : "text-graphite-500"}>
                          {ch.conversionRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-graphite-400 text-xs italic">Track</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-graphite-300">No channel data available</p>
          )}
        </CardContent>
      </Card>

      {/* Coupon Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4 text-teal" /> Coupon Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4 mb-6">
            <div className="rounded-xl bg-navy-50/50 p-4">
              <p className="text-xs text-graphite-400">Total Discounts Given</p>
              <p className="mt-1 text-xl font-bold text-navy">{formatPrice(overview.couponImpact.totalDiscount)}</p>
            </div>
            <div className="rounded-xl bg-navy-50/50 p-4">
              <p className="text-xs text-graphite-400">Orders with Coupons</p>
              <p className="mt-1 text-xl font-bold text-navy">{overview.couponImpact.ordersWithCoupons}</p>
            </div>
            <div className="rounded-xl bg-navy-50/50 p-4">
              <p className="text-xs text-graphite-400">Avg Discount / Order</p>
              <p className="mt-1 text-xl font-bold text-navy">{formatPrice(overview.couponImpact.avgDiscountPerOrder)}</p>
            </div>
            <div className="rounded-xl bg-navy-50/50 p-4">
              <p className="text-xs text-graphite-400">Most Used Coupon</p>
              <p className="mt-1 text-xl font-bold text-navy">
                {overview.couponImpact.topCoupon?.code || "None"}
              </p>
              {overview.couponImpact.topCoupon && (
                <p className="text-xs text-graphite-400">{overview.couponImpact.topCoupon.uses} uses</p>
              )}
            </div>
          </div>

          {overview.couponImpact.coupons.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-navy-100/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Uses</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Total Discount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {overview.couponImpact.coupons.map((c) => (
                    <tr key={c.code} className="hover:bg-linen/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-navy font-mono">{c.code}</td>
                      <td className="px-4 py-3 text-right text-graphite-500">{c.uses}</td>
                      <td className="px-4 py-3 text-right font-medium text-red-600">{formatPrice(c.discount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commission Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-graphite-400 uppercase tracking-wider">Commission Paid (Period)</p>
            <p className="mt-1 text-2xl font-bold text-navy">{formatPrice(performance.totalCommissionPaid)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-graphite-400 uppercase tracking-wider">Commission Pending</p>
            <p className="mt-1 text-2xl font-bold text-gold-600">{formatPrice(performance.totalCommissionPending)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
