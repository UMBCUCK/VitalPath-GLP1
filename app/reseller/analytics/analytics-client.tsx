"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPriceDecimal } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  Percent,
  Target,
  ArrowDownRight,
} from "lucide-react";

interface AnalyticsData {
  monthlyRevenue: { month: string; revenue: number }[];
  retentionRates: { period: string; rate: number }[];
  commissionBreakdown: { type: string; amount: number }[];
  topCustomers: { name: string; email: string; revenue: number }[];
  conversionFunnel: { stage: string; count: number }[];
}

interface Props {
  analytics: AnalyticsData;
}

const DONUT_COLORS = ["#0d9488", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export function AnalyticsClient({ analytics }: Props) {
  const totalCommissions = analytics.commissionBreakdown.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalRevenue = analytics.monthlyRevenue.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Analytics</h2>
        <p className="text-sm text-graphite-400">
          Detailed performance metrics and insights
        </p>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-navy">
                Revenue Trend
              </CardTitle>
              <p className="text-xs text-graphite-400">
                Monthly revenue from your referrals (last 12 months)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0d9488"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Retention */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-navy">
                  Customer Retention
                </CardTitle>
                <p className="text-xs text-graphite-400">
                  % of referred customers still active
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.retentionRates.map((rate) => (
                <div key={rate.period} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-graphite-500">
                      {rate.period}
                    </span>
                    <span className="font-semibold text-navy">
                      {rate.rate}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-navy-50">
                    <div
                      className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${rate.rate}%` }}
                    />
                  </div>
                </div>
              ))}
              {analytics.retentionRates.every((r) => r.rate === 0) && (
                <p className="py-4 text-center text-sm text-graphite-300">
                  Not enough data to calculate retention rates yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Commission Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                <Percent className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-navy">
                  Commission Breakdown
                </CardTitle>
                <p className="text-xs text-graphite-400">
                  Total: {formatPriceDecimal(totalCommissions)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {analytics.commissionBreakdown.length === 0 ? (
              <div className="flex h-48 items-center justify-center">
                <p className="text-sm text-graphite-300">
                  No commission data yet
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={analytics.commissionBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="amount"
                    nameKey="type"
                  >
                    {analytics.commissionBreakdown.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={DONUT_COLORS[idx % DONUT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatPriceDecimal(value),
                      name,
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value: string) => (
                      <span className="text-xs text-graphite-500">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
              <Target className="h-4 w-4 text-teal" />
            </div>
            <CardTitle className="text-base font-semibold text-navy">
              Top Customers by Revenue
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-linen/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {analytics.topCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-graphite-300"
                    >
                      No customer data yet
                    </td>
                  </tr>
                ) : (
                  analytics.topCustomers.map((customer, idx) => (
                    <tr
                      key={customer.email}
                      className="hover:bg-linen/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-graphite-400">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-navy">
                            {customer.name}
                          </p>
                          <p className="text-xs text-graphite-400">
                            {customer.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-navy">
                        {formatPriceDecimal(customer.revenue)}
                      </td>
                      <td className="px-4 py-3 text-graphite-500">
                        {totalRevenue > 0
                          ? ((customer.revenue / totalRevenue) * 100).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <ArrowDownRight className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-navy">
                Conversion Funnel
              </CardTitle>
              <p className="text-xs text-graphite-400">
                From referral link clicks to subscriptions
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.conversionFunnel.map((step, idx) => {
              const maxCount = analytics.conversionFunnel[0]?.count || 1;
              const widthPct = Math.max(
                (step.count / maxCount) * 100,
                8
              );
              const prevCount =
                idx > 0 ? analytics.conversionFunnel[idx - 1].count : null;
              const dropOff =
                prevCount && prevCount > 0
                  ? ((prevCount - step.count) / prevCount) * 100
                  : null;

              return (
                <div key={step.stage} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-graphite-500">
                      {step.stage}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy">
                        {step.count.toLocaleString()}
                      </span>
                      {dropOff !== null && dropOff > 0 && (
                        <Badge className="bg-red-50 text-red-600 border-red-200 text-[10px]">
                          -{dropOff.toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="h-3 w-full rounded-full bg-navy-50">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-teal to-atlantic transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
