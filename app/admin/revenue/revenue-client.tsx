"use client";

import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { KPICard } from "@/components/admin/kpi-card";
import { DollarSign, TrendingUp, TrendingDown, Target, RotateCcw, Tag, Share2, Calendar, Telescope } from "lucide-react";
import type { ForecastResult } from "@/lib/admin-forecasting";
import { formatPrice } from "@/lib/utils";

const COLORS = ["#1F6F78", "#163A63", "#B79B6C", "#0E223D", "#DDE9E3", "#F59E0B", "#8B5CF6"];

interface Props {
  dateRange: { from: string; to: string };
  waterfall: { currentMRR: number; newMRR: number; churnedMRR: number; netNewMRR: number; expansionMRR: number; contractionMRR: number };
  segments: {
    totalRevenue: number;
    byPlan: { name: string; value: number }[];
    byAddon: { name: string; value: number }[];
    byInterval: { name: string; value: number }[];
  };
  timeSeries: { week: string; revenue: number }[];
  cohortLTV: { cohort: string; userCount: number; ltvByMonth: { month: number; ltv: number }[] }[];
  refunds: { totalRefunded: number; refundCount: number; refundRate: number; totalOrders: number; recentRefunds: { id: string; amount: number; customer: string; date: Date }[] };
  projectedARR: number;
  coupons: { code: string; type: string; valuePct: number | null; valueCents: number | null; usedCount: number }[];
  referralMetrics: { totalReferralRevenue: number; totalReferrals: number };
  forecast: ForecastResult;
}

export function RevenueClient({ dateRange, waterfall, segments, timeSeries, cohortLTV, refunds, projectedARR, coupons, referralMetrics, forecast }: Props) {
  const router = useRouter();

  const handleDateChange = (from: string, to: string) => {
    router.push(`/admin/revenue?from=${from}&to=${to}`);
  };

  // Waterfall chart data
  const waterfallData = [
    { name: "Starting MRR", value: waterfall.currentMRR - waterfall.netNewMRR, fill: "#1F6F78" },
    { name: "New", value: waterfall.newMRR, fill: "#10B981" },
    { name: "Expansion", value: waterfall.expansionMRR, fill: "#34D399" },
    { name: "Contraction", value: -waterfall.contractionMRR, fill: "#F59E0B" },
    { name: "Churned", value: -waterfall.churnedMRR, fill: "#EF4444" },
    { name: "Net MRR", value: waterfall.currentMRR, fill: "#163A63" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Revenue Intelligence</h2>
          <p className="text-sm text-graphite-400">MRR waterfall, cohort LTV, and revenue segmentation</p>
        </div>
        <DateRangePicker from={dateRange.from} to={dateRange.to} onChange={handleDateChange} />
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard title="Current MRR" value={formatPrice(waterfall.currentMRR)} icon={DollarSign} iconColor="text-teal" iconBg="bg-teal-50" />
        <KPICard title="Net New MRR" value={formatPrice(waterfall.netNewMRR)} icon={waterfall.netNewMRR >= 0 ? TrendingUp : TrendingDown} iconColor={waterfall.netNewMRR >= 0 ? "text-emerald-600" : "text-red-500"} iconBg={waterfall.netNewMRR >= 0 ? "bg-emerald-50" : "bg-red-50"} />
        <KPICard title="Projected ARR" value={formatPrice(projectedARR)} icon={Target} iconColor="text-indigo-600" iconBg="bg-indigo-50" />
        <KPICard title="Refund Rate" value={`${refunds.refundRate}%`} icon={RotateCcw} iconColor="text-amber-600" iconBg="bg-amber-50" />
        <KPICard title="Referral Revenue" value={formatPrice(referralMetrics.totalReferralRevenue)} icon={Share2} iconColor="text-teal" iconBg="bg-teal-50" />
      </div>

      {/* Revenue trend + MRR waterfall */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            {timeSeries.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No revenue data</p>
            ) : (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeries}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1F6F78" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#1F6F78" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#677A8A" }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tickFormatter={(v) => `$${Math.round(v / 100)}`} tick={{ fontSize: 10, fill: "#677A8A" }} />
                    <Tooltip formatter={(v: number) => [formatPrice(v), "Revenue"]} contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }} />
                    <Area type="monotone" dataKey="revenue" stroke="#1F6F78" fill="url(#revGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">MRR Waterfall</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#677A8A" }} />
                  <YAxis tickFormatter={(v) => `$${Math.round(Math.abs(v) / 100)}`} tick={{ fontSize: 10, fill: "#677A8A" }} />
                  <Tooltip formatter={(v: number) => [formatPrice(Math.abs(v)), ""]} contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {waterfallData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by plan, addon, interval */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Plan</CardTitle></CardHeader>
          <CardContent>
            {segments.byPlan.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No plan data</p>
            ) : (
              <>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={segments.byPlan} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                        {segments.byPlan.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [formatPrice(v), "Revenue"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-1.5">
                  {segments.byPlan.map((p, i) => (
                    <div key={p.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-graphite-500">{p.name}</span>
                      </div>
                      <span className="font-medium text-navy">{formatPrice(p.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Add-on Revenue</CardTitle></CardHeader>
          <CardContent>
            {segments.byAddon.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No add-on data</p>
            ) : (
              <div className="space-y-2">
                {segments.byAddon.map((a, i) => {
                  const maxVal = Math.max(...segments.byAddon.map((x) => x.value));
                  const pct = maxVal > 0 ? (a.value / maxVal) * 100 : 0;
                  return (
                    <div key={a.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-graphite-500">{a.name}</span>
                        <span className="font-medium text-navy">{formatPrice(a.value)}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-navy-50">
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Revenue by Interval</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segments.byInterval} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                  <XAxis type="number" tickFormatter={(v) => `$${Math.round(v / 100)}`} tick={{ fontSize: 10, fill: "#677A8A" }} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: "#677A8A" }} />
                  <Tooltip formatter={(v: number) => [formatPrice(v), "MRR"]} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {segments.byInterval.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort LTV */}
      <Card>
        <CardHeader><CardTitle className="text-base">Cohort LTV (Last 6 Months)</CardTitle></CardHeader>
        <CardContent>
          {cohortLTV.length === 0 ? (
            <p className="py-8 text-center text-sm text-graphite-300">Insufficient data for cohort analysis</p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                  <XAxis dataKey="month" type="number" domain={[0, "auto"]} label={{ value: "Months since signup", position: "insideBottom", offset: -5, fontSize: 11, fill: "#677A8A" }} tick={{ fontSize: 10, fill: "#677A8A" }} />
                  <YAxis tickFormatter={(v) => `$${Math.round(v / 100)}`} tick={{ fontSize: 10, fill: "#677A8A" }} />
                  <Tooltip formatter={(v: number) => [formatPrice(v), "LTV/user"]} contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }} />
                  <Legend />
                  {cohortLTV.map((cohort, i) => (
                    <Line
                      key={cohort.cohort}
                      data={cohort.ltvByMonth}
                      dataKey="ltv"
                      name={`${cohort.cohort} (${cohort.userCount})`}
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Telescope className="h-4 w-4 text-indigo-500" /> Revenue Forecast (12-Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {forecast.historical.length === 0 ? (
            <p className="py-8 text-center text-sm text-graphite-300">Insufficient data for forecasting</p>
          ) : (
            <>
              <div className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart>
                    <defs>
                      <linearGradient id="forecastOptGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="forecastPessGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF4" />
                    <XAxis
                      dataKey="month"
                      type="category"
                      allowDuplicatedCategory={false}
                      tick={{ fontSize: 10, fill: "#677A8A" }}
                      tickFormatter={(v) => v.slice(5)}
                    />
                    <YAxis
                      tickFormatter={(v) => `$${Math.round(v / 100)}`}
                      tick={{ fontSize: 10, fill: "#677A8A" }}
                    />
                    <Tooltip
                      formatter={(v: number) => [formatPrice(v), "MRR"]}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #E8EDF4" }}
                    />
                    <Legend />
                    {/* Historical */}
                    <Area
                      data={forecast.historical}
                      dataKey="mrr"
                      name="Historical"
                      stroke="#163A63"
                      fill="none"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                    {/* Pessimistic */}
                    <Area
                      data={forecast.projections.pessimistic}
                      dataKey="mrr"
                      name="Pessimistic"
                      stroke="#ef4444"
                      fill="url(#forecastPessGrad)"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                    {/* Expected */}
                    <Area
                      data={forecast.projections.expected}
                      dataKey="mrr"
                      name="Expected"
                      stroke="#163A63"
                      fill="none"
                      strokeWidth={2}
                      strokeDasharray="6 3"
                      dot={false}
                    />
                    {/* Optimistic */}
                    <Area
                      data={forecast.projections.optimistic}
                      dataKey="mrr"
                      name="Optimistic"
                      stroke="#0d9488"
                      fill="url(#forecastOptGrad)"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Assumptions */}
              <div className="mt-3 flex items-center gap-4 rounded-lg bg-linen/30 px-4 py-2 text-xs text-graphite-400">
                <span>Current MRR: <strong className="text-navy">{formatPrice(forecast.assumptions.currentMRR)}</strong></span>
                <span>Avg Growth: <strong className="text-emerald-600">{forecast.assumptions.avgGrowthRate}%</strong></span>
                <span>Avg Churn: <strong className="text-red-500">{forecast.assumptions.avgChurnRate}%</strong></span>
              </div>

              {/* Projected ARR grid */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                {(["optimistic", "expected", "pessimistic"] as const).map((scenario) => {
                  const data = forecast.projections[scenario];
                  const label = scenario.charAt(0).toUpperCase() + scenario.slice(1);
                  const colors = {
                    optimistic: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal", subtext: "text-teal-600" },
                    expected: { bg: "bg-navy-50", border: "border-navy-200", text: "text-navy", subtext: "text-graphite-500" },
                    pessimistic: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", subtext: "text-red-500" },
                  };
                  const c = colors[scenario];
                  const arr3 = data[2]?.arr ?? 0;
                  const arr6 = data[5]?.arr ?? 0;
                  const arr12 = data[11]?.arr ?? 0;

                  return (
                    <div key={scenario} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${c.subtext}`}>{label}</p>
                      <div className="mt-2 space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-graphite-400">3mo ARR</span>
                          <span className={`font-bold ${c.text}`}>{formatPrice(arr3)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-graphite-400">6mo ARR</span>
                          <span className={`font-bold ${c.text}`}>{formatPrice(arr6)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-graphite-400">12mo ARR</span>
                          <span className={`font-bold ${c.text}`}>{formatPrice(arr12)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Refunds + Coupons */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><RotateCcw className="h-4 w-4 text-red-500" /> Refunds</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-red-50 p-3 text-center">
                <p className="text-lg font-bold text-red-600">{formatPrice(refunds.totalRefunded)}</p>
                <p className="text-[10px] text-red-400">Total Refunded</p>
              </div>
              <div className="rounded-xl bg-navy-50 p-3 text-center">
                <p className="text-lg font-bold text-navy">{refunds.refundCount}</p>
                <p className="text-[10px] text-graphite-400">Refund Count</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-center">
                <p className="text-lg font-bold text-amber-600">{refunds.refundRate}%</p>
                <p className="text-[10px] text-amber-500">Refund Rate</p>
              </div>
            </div>
            {refunds.recentRefunds.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-graphite-400">Recent Refunds</p>
                {refunds.recentRefunds.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg bg-linen/30 px-3 py-2 text-sm">
                    <span className="text-graphite-500">{r.customer}</span>
                    <span className="font-medium text-red-600">-{formatPrice(r.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4 text-gold-600" /> Coupon Performance</CardTitle></CardHeader>
          <CardContent>
            {coupons.length === 0 ? (
              <p className="py-4 text-center text-sm text-graphite-300">No coupons used</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/40 text-left">
                      <th className="pb-2 text-xs font-medium text-graphite-400">Code</th>
                      <th className="pb-2 text-xs font-medium text-graphite-400">Type</th>
                      <th className="pb-2 text-xs font-medium text-graphite-400">Discount</th>
                      <th className="pb-2 text-xs font-medium text-graphite-400">Uses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/30">
                    {coupons.map((c) => (
                      <tr key={c.code}>
                        <td className="py-2 font-mono font-bold text-navy">{c.code}</td>
                        <td className="py-2"><Badge variant="secondary" className="text-[9px]">{c.type}</Badge></td>
                        <td className="py-2 text-graphite-500">{c.valuePct ? `${c.valuePct}%` : c.valueCents ? formatPrice(c.valueCents) : "Free"}</td>
                        <td className="py-2 font-medium text-navy">{c.usedCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
