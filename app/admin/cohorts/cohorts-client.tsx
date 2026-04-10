"use client";

import { useRouter } from "next/navigation";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompareArrows, Users, TrendingUp, Heart, PieChart as PieIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PlanDistribution {
  name: string;
  count: number;
}

interface CohortMetrics {
  month: string;
  totalUsers: number;
  retentionMonth1: number;
  retentionMonth3: number;
  retentionMonth6: number;
  avgLTV: number;
  avgHealthScore: number;
  planDistribution: PlanDistribution[];
  topChurnReasons: { reason: string; count: number }[];
}

interface Props {
  availableCohorts: string[];
  comparison: { cohortA: CohortMetrics; cohortB: CohortMetrics } | null;
  initialCohortA: string;
  initialCohortB: string;
}

const PIE_COLORS = ["#0d9488", "#1e3a5f", "#d4a24e", "#059669", "#6366f1", "#ec4899"];

export function CohortsClient({
  availableCohorts,
  comparison,
  initialCohortA,
  initialCohortB,
}: Props) {
  const router = useRouter();
  const [cohortA, setCohortA] = useState(initialCohortA);
  const [cohortB, setCohortB] = useState(initialCohortB);

  const handleCohortChange = (which: "a" | "b", value: string) => {
    const nextA = which === "a" ? value : cohortA;
    const nextB = which === "b" ? value : cohortB;

    if (which === "a") setCohortA(value);
    else setCohortB(value);

    if (nextA && nextB) {
      router.push(`/admin/cohorts?cohortA=${nextA}&cohortB=${nextB}`);
    }
  };

  // Build retention chart data
  const retentionData = comparison
    ? [
        {
          period: "Month 1",
          [comparison.cohortA.month]: comparison.cohortA.retentionMonth1,
          [comparison.cohortB.month]: comparison.cohortB.retentionMonth1,
        },
        {
          period: "Month 3",
          [comparison.cohortA.month]: comparison.cohortA.retentionMonth3,
          [comparison.cohortB.month]: comparison.cohortB.retentionMonth3,
        },
        {
          period: "Month 6",
          [comparison.cohortA.month]: comparison.cohortA.retentionMonth6,
          [comparison.cohortB.month]: comparison.cohortB.retentionMonth6,
        },
      ]
    : [];

  // Metrics comparison rows
  const metricsRows = comparison
    ? [
        {
          metric: "Total Users",
          a: String(comparison.cohortA.totalUsers),
          b: String(comparison.cohortB.totalUsers),
        },
        {
          metric: "Retention (1m)",
          a: `${comparison.cohortA.retentionMonth1}%`,
          b: `${comparison.cohortB.retentionMonth1}%`,
        },
        {
          metric: "Retention (3m)",
          a: `${comparison.cohortA.retentionMonth3}%`,
          b: `${comparison.cohortB.retentionMonth3}%`,
        },
        {
          metric: "Retention (6m)",
          a: `${comparison.cohortA.retentionMonth6}%`,
          b: `${comparison.cohortB.retentionMonth6}%`,
        },
        {
          metric: "Avg LTV",
          a: formatPrice(comparison.cohortA.avgLTV),
          b: formatPrice(comparison.cohortB.avgLTV),
        },
        {
          metric: "Avg Health Score",
          a: String(comparison.cohortA.avgHealthScore),
          b: String(comparison.cohortB.avgHealthScore),
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Cohort Comparison</h2>
        <p className="text-sm text-graphite-400">
          Compare retention, LTV, and plan mix across monthly patient cohorts
        </p>
      </div>

      {/* Cohort selectors */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="mb-1.5 block text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                Cohort A
              </label>
              <select
                value={cohortA}
                onChange={(e) => handleCohortChange("a", e.target.value)}
                className="w-full rounded-xl border border-navy-100/60 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
              >
                <option value="">Select month...</option>
                {availableCohorts.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center pb-2">
              <GitCompareArrows className="h-5 w-5 text-graphite-300" />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="mb-1.5 block text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                Cohort B
              </label>
              <select
                value={cohortB}
                onChange={(e) => handleCohortChange("b", e.target.value)}
                className="w-full rounded-xl border border-navy-100/60 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
              >
                <option value="">Select month...</option>
                {availableCohorts.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {!comparison && (
        <Card>
          <CardContent className="py-16 text-center">
            <GitCompareArrows className="mx-auto h-12 w-12 text-graphite-200" />
            <p className="mt-4 text-lg font-semibold text-navy">
              Select two cohorts to compare
            </p>
            <p className="mt-1 text-sm text-graphite-400">
              Choose a month for Cohort A and Cohort B above to see side-by-side metrics
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comparison results */}
      {comparison && (
        <>
          {/* Retention bar chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-teal" />
                Retention Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={retentionData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12, fill: "#677A8A" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#677A8A" }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #E8EDF4",
                      }}
                      formatter={(value: number) => [`${value}%`, undefined]}
                    />
                    <Legend />
                    <Bar
                      dataKey={comparison.cohortA.month}
                      name={`Cohort A (${comparison.cohortA.month})`}
                      fill="#0d9488"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey={comparison.cohortB.month}
                      name={`Cohort B (${comparison.cohortB.month})`}
                      fill="#1e3a5f"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Metrics table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-teal" />
                Metrics Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-navy-100/60">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/40 bg-linen/30">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                        <Badge variant="default" className="text-[10px]">
                          {comparison.cohortA.month}
                        </Badge>
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                        <Badge variant="secondary" className="text-[10px]">
                          {comparison.cohortB.month}
                        </Badge>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/30">
                    {metricsRows.map((row) => (
                      <tr key={row.metric} className="hover:bg-linen/20">
                        <td className="px-4 py-3 font-medium text-navy">
                          {row.metric}
                        </td>
                        <td className="px-4 py-3 text-center text-graphite-600">
                          {row.a}
                        </td>
                        <td className="px-4 py-3 text-center text-graphite-600">
                          {row.b}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Plan distribution pie charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieIcon className="h-4 w-4 text-teal" />
                  Plan Mix: {comparison.cohortA.month}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comparison.cohortA.planDistribution.length === 0 ? (
                  <p className="py-8 text-center text-sm text-graphite-300">
                    No plan data
                  </p>
                ) : (
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={comparison.cohortA.planDistribution}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(0)}%)`
                          }
                          labelLine={{ stroke: "#677A8A" }}
                        >
                          {comparison.cohortA.planDistribution.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #E8EDF4",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieIcon className="h-4 w-4 text-navy" />
                  Plan Mix: {comparison.cohortB.month}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comparison.cohortB.planDistribution.length === 0 ? (
                  <p className="py-8 text-center text-sm text-graphite-300">
                    No plan data
                  </p>
                ) : (
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={comparison.cohortB.planDistribution}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(0)}%)`
                          }
                          labelLine={{ stroke: "#677A8A" }}
                        >
                          {comparison.cohortB.planDistribution.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #E8EDF4",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top churn reasons */}
          {(comparison.cohortA.topChurnReasons.length > 0 ||
            comparison.cohortB.topChurnReasons.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  Top Churn Reasons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                      {comparison.cohortA.month}
                    </p>
                    {comparison.cohortA.topChurnReasons.length === 0 ? (
                      <p className="text-sm text-graphite-300">No churn data</p>
                    ) : (
                      <div className="space-y-2">
                        {comparison.cohortA.topChurnReasons.map((r) => (
                          <div
                            key={r.reason}
                            className="flex items-center justify-between rounded-lg bg-linen/30 px-3 py-2"
                          >
                            <span className="text-sm text-navy">{r.reason}</span>
                            <Badge variant="outline">{r.count}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                      {comparison.cohortB.month}
                    </p>
                    {comparison.cohortB.topChurnReasons.length === 0 ? (
                      <p className="text-sm text-graphite-300">No churn data</p>
                    ) : (
                      <div className="space-y-2">
                        {comparison.cohortB.topChurnReasons.map((r) => (
                          <div
                            key={r.reason}
                            className="flex items-center justify-between rounded-lg bg-linen/30 px-3 py-2"
                          >
                            <span className="text-sm text-navy">{r.reason}</span>
                            <Badge variant="outline">{r.count}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
