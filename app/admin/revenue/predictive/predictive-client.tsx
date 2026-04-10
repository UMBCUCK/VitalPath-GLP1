"use client";

import {
  LineChart,
  Line,
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
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Target,
  Info,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ForecastResult } from "@/lib/admin-forecasting";
import type {
  BottomUpForecast,
  CustomerLTV,
} from "@/lib/admin-predictive-revenue";

interface Props {
  topDown: ForecastResult;
  bottomUp: BottomUpForecast;
}

function churnRiskBadge(risk: number) {
  if (risk <= 20) return <Badge variant="success">{risk}%</Badge>;
  if (risk <= 50) return <Badge variant="warning">{risk}%</Badge>;
  return <Badge variant="destructive">{risk}%</Badge>;
}

function formatDollars(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function PredictiveClient({ topDown, bottomUp }: Props) {
  // Build comparison chart data: 12 months
  const chartData = bottomUp.monthlyProjections.map((bu, i) => {
    const tdExpected = topDown.projections.expected[i];
    return {
      month: bu.month,
      bottomUp: Math.round(bu.bottomUpMRR / 100),
      topDown: tdExpected ? Math.round(tdExpected.mrr / 100) : 0,
      customers: bu.customerCount,
    };
  });

  // Gap analysis at 3, 6, 12 months
  const gapMonths = [2, 5, 11]; // indices for month 3, 6, 12
  const gaps = gapMonths.map((idx) => {
    const buVal = bottomUp.monthlyProjections[idx]?.bottomUpMRR ?? 0;
    const tdVal = topDown.projections.expected[idx]?.mrr ?? 0;
    const diff = buVal - tdVal;
    const monthLabel = idx + 1;
    return {
      month: monthLabel,
      bottomUp: buVal,
      topDown: tdVal,
      diff,
      diffPct: tdVal > 0 ? Math.round((diff / tdVal) * 100) : 0,
    };
  });

  const bottomUpWarning = gaps.some((g) => g.diff < 0);

  // Summary KPIs
  const totalProjectedRevenue = bottomUp.monthlyProjections.reduce(
    (sum, m) => sum + m.bottomUpMRR,
    0
  );
  const avgSurvival12 =
    bottomUp.monthlyProjections.length > 0
      ? bottomUp.monthlyProjections[bottomUp.monthlyProjections.length - 1]
          .avgSurvival
      : 0;
  const customerCount12 =
    bottomUp.monthlyProjections.length > 0
      ? bottomUp.monthlyProjections[bottomUp.monthlyProjections.length - 1]
          .customerCount
      : 0;
  const month1MRR =
    bottomUp.monthlyProjections.length > 0
      ? bottomUp.monthlyProjections[0].bottomUpMRR
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Predictive Revenue</h2>
        <p className="text-sm text-graphite-400">
          Bottom-up customer-level revenue modeling vs. top-down trend projection
        </p>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Next Month MRR (Bottom-Up)"
          value={formatDollars(month1MRR)}
          icon={TrendingUp}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="12-Month Projected Revenue"
          value={formatDollars(totalProjectedRevenue)}
          icon={Target}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <KPICard
          title="Surviving Customers (Mo 12)"
          value={String(customerCount12)}
          icon={Users}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Avg Survival Rate (Mo 12)"
          value={`${(avgSurvival12 * 100).toFixed(1)}%`}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Top-Down vs. Bottom-Up MRR Projection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="py-8 text-center text-sm text-graphite-300">
              No subscription data available for projections
            </p>
          ) : (
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(v: number) => `$${v.toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `$${value.toLocaleString()}`,
                      name === "topDown"
                        ? "Top-Down (Expected)"
                        : "Bottom-Up (Customer)",
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="topDown"
                    name="Top-Down (Expected)"
                    stroke="#163A63"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bottomUp"
                    name="Bottom-Up (Customer)"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gap Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            Gap Analysis
            {bottomUpWarning && (
              <Badge variant="warning" className="text-xs">
                Divergence detected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bottomUpWarning && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                Bottom-up analysis suggests lower revenue than the trend
                projection. This may indicate higher churn risk at the customer
                level than historical trends suggest.
              </p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Horizon
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">
                    Top-Down MRR
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">
                    Bottom-Up MRR
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">
                    Difference
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">
                    Variance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {gaps.map((gap) => (
                  <tr key={gap.month} className="hover:bg-linen/20">
                    <td className="px-4 py-3 font-medium text-navy">
                      Month {gap.month}
                    </td>
                    <td className="px-4 py-3 text-right text-graphite-500">
                      {formatDollars(gap.topDown)}
                    </td>
                    <td className="px-4 py-3 text-right text-graphite-500">
                      {formatDollars(gap.bottomUp)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          gap.diff >= 0 ? "text-emerald-600" : "text-red-600"
                        }
                      >
                        {gap.diff >= 0 ? "+" : ""}
                        {formatDollars(gap.diff)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge
                        variant={
                          Math.abs(gap.diffPct) <= 5
                            ? "success"
                            : Math.abs(gap.diffPct) <= 15
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {gap.diffPct >= 0 ? "+" : ""}
                        {gap.diffPct}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Customer LTV Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Top 10 Customers by Projected LTV
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-6 py-3 text-left font-medium text-graphite-400">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-graphite-400">
                    Churn Risk
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">
                    Monthly MRR
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">
                    12-Mo LTV
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-graphite-400">
                    Survival (Mo 12)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {bottomUp.customerBreakdown.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-graphite-300"
                    >
                      No active subscriptions found
                    </td>
                  </tr>
                ) : (
                  bottomUp.customerBreakdown.map(
                    (customer: CustomerLTV) => (
                      <tr
                        key={customer.userId}
                        className="hover:bg-linen/20 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <p className="font-medium text-navy">
                            {customer.name}
                          </p>
                          <p className="text-xs text-graphite-400">
                            {customer.email}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">{customer.plan}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {churnRiskBadge(customer.churnRisk)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-navy">
                          {formatDollars(customer.monthlyMRR)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-navy">
                          {formatDollars(customer.projectedLTV)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={
                              customer.survivalProbability >= 0.5
                                ? "text-emerald-600"
                                : customer.survivalProbability >= 0.2
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }
                          >
                            {(customer.survivalProbability * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Model Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-graphite-400" />
            Model Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-navy mb-2">
                Bottom-Up Model
              </h4>
              <ul className="space-y-1.5 text-sm text-graphite-500">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                  Each customer&apos;s churn risk score drives individual survival
                  probability
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                  Monthly survival = ((100 - churnRisk) / 100) compounded per
                  month
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                  Projected MRR = individual MRR x survival probability at each
                  month
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                  Does not account for new customer acquisition or plan upgrades
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-navy mb-2">
                Top-Down Model
              </h4>
              <ul className="space-y-1.5 text-sm text-graphite-500">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-navy shrink-0" />
                  Based on historical 6-month MRR trend extrapolation
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-navy shrink-0" />
                  Avg growth rate: {topDown.assumptions.avgGrowthRate}%/mo,
                  avg churn rate: {topDown.assumptions.avgChurnRate}%/mo
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-navy shrink-0" />
                  Assumes historical growth and churn patterns continue
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-navy shrink-0" />
                  &quot;Expected&quot; scenario shown (optimistic/pessimistic available in
                  Revenue Intelligence)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
