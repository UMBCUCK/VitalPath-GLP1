"use client";

import { useRouter } from "next/navigation";
import {
  Target,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  TrendingUp,
  Clock,
  Tag,
  Handshake,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { formatPrice } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface FunnelStage {
  name: string;
  label: string;
  count: number;
  conversionRate: number;
  dropOffRate: number;
  overallRate: number;
}

interface ConversionMetrics {
  stages: FunnelStage[];
  bottleneck: { stage: string; label: string; dropOffRate: number } | null;
  overallConversion: number;
  avgTimeToConvert: { avgDays: number; medianDays: number };
}

interface ConversionSegments {
  byPlan: { plan: string; total: number; active: number; conversionRate: number }[];
  bySource: { source: string; visitors: number; conversions: number; conversionRate: number }[];
  byState: { state: string; patients: number; subscribers: number; conversionRate: number }[];
}

interface SpendEfficiency {
  couponSpend: number;
  commissionSpend: number;
  totalMarketingSpend: number;
  revenue: number;
  revenuePerDollar: number;
  highestROIChannel: string;
  lowestROIChannel: string;
  channelROI: { source: string; conversions: number }[];
}

interface Suggestion {
  suggestion: string;
  priority: "high" | "medium" | "low";
  metric: string;
  currentValue: number;
  targetValue: number;
}

interface ConversionClientProps {
  metrics: ConversionMetrics;
  segments: ConversionSegments;
  spend: SpendEfficiency;
  suggestions: Suggestion[];
  initialFrom: string;
  initialTo: string;
}

export function ConversionClient({
  metrics,
  segments,
  spend,
  suggestions,
  initialFrom,
  initialTo,
}: ConversionClientProps) {
  const router = useRouter();

  const handleDateChange = (from: string, to: string) => {
    router.push(`/admin/conversion?from=${from}&to=${to}`);
  };

  const maxCount = Math.max(...metrics.stages.map((s) => s.count), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Conversion Optimization</h1>
          <p className="text-sm text-graphite-400">
            Funnel analysis, segmented performance, and spend efficiency
          </p>
        </div>
        <DateRangePicker
          from={initialFrom}
          to={initialTo}
          onChange={handleDateChange}
        />
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Overall Conversion"
          value={`${metrics.overallConversion}%`}
          icon={Target}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Avg Days to Convert"
          value={`${metrics.avgTimeToConvert.avgDays}d`}
          icon={Clock}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Revenue / Marketing $"
          value={`${spend.revenuePerDollar}x`}
          icon={DollarSign}
          iconColor="text-gold-600"
          iconBg="bg-gold-50"
        />
        <KPICard
          title="Best Channel"
          value={spend.highestROIChannel}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-teal" /> Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.stages.map((stage, i) => {
              const widthPct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
              const isBottleneck = metrics.bottleneck?.stage === stage.name;

              return (
                <div key={stage.name} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-navy">{stage.label}</span>
                      {isBottleneck && (
                        <Badge variant="destructive" className="text-[10px]">
                          <AlertTriangle className="mr-1 h-3 w-3" /> Bottleneck
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-semibold text-navy">{stage.count.toLocaleString()}</span>
                      {i > 0 && (
                        <>
                          <span className="text-emerald-600">{stage.conversionRate}% conv</span>
                          <span className={isBottleneck ? "text-red-600 font-semibold" : "text-graphite-400"}>
                            {stage.dropOffRate}% drop
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="h-8 rounded-lg bg-navy-50/50 overflow-hidden">
                    <div
                      className={`h-full rounded-lg transition-all ${
                        isBottleneck ? "bg-red-400" : "bg-teal"
                      }`}
                      style={{ width: `${Math.max(widthPct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-gold-600" /> Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-navy-100/60 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        s.priority === "high"
                          ? "destructive"
                          : s.priority === "medium"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {s.priority}
                    </Badge>
                    <span className="text-xs text-graphite-400">{s.metric}</span>
                  </div>
                  <p className="text-sm text-graphite-600">{s.suggestion}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-red-500">Current: {s.currentValue}%</span>
                    <span className="text-graphite-300">{"->"}</span>
                    <span className="text-emerald-600">Target: {s.targetValue}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion by Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {segments.byPlan.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={segments.byPlan}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="plan" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#1e3a5f" name="Total" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="active" fill="#0d9488" name="Active" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-graphite-300">No plan data available</p>
            )}
          </CardContent>
        </Card>

        {/* Conversion by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion by Source</CardTitle>
          </CardHeader>
          <CardContent>
            {segments.bySource.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-navy-100/60">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/40 bg-linen/30">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">Source</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Visitors</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Conversions</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/30">
                    {segments.bySource.map((s) => (
                      <tr key={s.source} className="hover:bg-linen/20">
                        <td className="px-4 py-3 font-medium text-navy">{s.source}</td>
                        <td className="px-4 py-3 text-right text-graphite-500">{s.visitors}</td>
                        <td className="px-4 py-3 text-right text-graphite-500">{s.conversions}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={s.conversionRate > 10 ? "text-emerald-600 font-medium" : "text-graphite-500"}>
                            {s.conversionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-12 text-center text-sm text-graphite-300">No source data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Spend Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gold-600" /> Spend Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-navy-50/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Tag className="h-3.5 w-3.5 text-graphite-400" />
                <p className="text-xs text-graphite-400">Coupon Spend</p>
              </div>
              <p className="text-xl font-bold text-navy">{formatPrice(spend.couponSpend)}</p>
            </div>
            <div className="rounded-xl bg-navy-50/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Handshake className="h-3.5 w-3.5 text-graphite-400" />
                <p className="text-xs text-graphite-400">Commission Spend</p>
              </div>
              <p className="text-xl font-bold text-navy">{formatPrice(spend.commissionSpend)}</p>
            </div>
            <div className="rounded-xl bg-navy-50/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-3.5 w-3.5 text-graphite-400" />
                <p className="text-xs text-graphite-400">Revenue per Marketing $</p>
              </div>
              <p className="text-xl font-bold text-teal">{spend.revenuePerDollar}x</p>
            </div>
            <div className="rounded-xl bg-navy-50/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-graphite-400" />
                <p className="text-xs text-graphite-400">Highest ROI Channel</p>
              </div>
              <p className="text-xl font-bold text-emerald-600">{spend.highestROIChannel}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time to Convert */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-navy" /> Time to Convert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
                    <span className="text-lg font-bold text-teal">{metrics.avgTimeToConvert.avgDays}</span>
                  </div>
                  <span className="mt-1 text-xs text-graphite-400">Avg Days</span>
                </div>
                <div className="flex-1 h-1 bg-navy-100/40 rounded-full relative">
                  <div className="absolute inset-y-0 left-0 bg-teal rounded-full" style={{ width: "50%" }} />
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-navy-50 flex items-center justify-center">
                    <span className="text-lg font-bold text-navy">{metrics.avgTimeToConvert.medianDays}</span>
                  </div>
                  <span className="mt-1 text-xs text-graphite-400">Median Days</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-graphite-400 text-center">
                Time from account creation to first purchase
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* State Conversion Table */}
      {segments.byState.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion by State (Top 15)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-navy-100/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">State</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Patients</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Subscribers</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {segments.byState.slice(0, 15).map((s) => (
                    <tr key={s.state} className="hover:bg-linen/20">
                      <td className="px-4 py-3 font-medium text-navy">{s.state}</td>
                      <td className="px-4 py-3 text-right text-graphite-500">{s.patients}</td>
                      <td className="px-4 py-3 text-right text-graphite-500">{s.subscribers}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={s.conversionRate > 50 ? "text-emerald-600 font-medium" : "text-graphite-500"}>
                          {s.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
