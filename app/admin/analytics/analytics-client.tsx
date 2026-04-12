"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { formatPrice } from "@/lib/utils";
import {
  Filter,
  TrendingUp,
  Megaphone,
  ArrowRight,
  Globe,
  Zap,
} from "lucide-react";
import type {
  FunnelStage,
  AcquisitionRow,
  UpsellMetric,
} from "@/lib/admin-analytics";

interface Props {
  funnelData: FunnelStage[];
  attributionData: AcquisitionRow[];
  upsellData: UpsellMetric[];
  initialFrom: string;
  initialTo: string;
}

// Navy-to-teal gradient for funnel bars
const FUNNEL_COLORS = [
  "#0f172a",
  "#1e3a5f",
  "#1a5c6b",
  "#1f6f78",
  "#0d9488",
];

export function AnalyticsClient({
  funnelData,
  attributionData,
  upsellData,
  initialFrom,
  initialTo,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFrom = searchParams?.get("from") || initialFrom;
  const currentTo = searchParams?.get("to") || initialTo;

  function handleDateChange(from: string, to: string) {
    const params = new URLSearchParams();
    params.set("from", from);
    params.set("to", to);
    router.push(`/admin/analytics?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Growth Analytics</h2>
          <p className="text-sm text-graphite-400">
            Funnel performance, acquisition attribution, and upsell metrics
          </p>
        </div>
        <DateRangePicker
          from={currentFrom}
          to={currentTo}
          onChange={handleDateChange}
        />
      </div>

      {/* ── Conversion Funnel ──────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4 text-teal" />
            Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" barCategoryGap={12}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E8EDF4"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#677A8A" }}
                />
                <YAxis
                  dataKey="stage"
                  type="category"
                  width={130}
                  tick={{ fontSize: 12, fill: "#0f172a" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E8EDF4",
                  }}
                  formatter={(value: number, _name: string, props: { payload?: FunnelStage }) => [
                    `${value.toLocaleString()} (${props.payload?.conversionRate ?? 0}% conv.)`,
                    "Count",
                  ]}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {funnelData.map((_, i) => (
                    <Cell
                      key={`funnel-${i}`}
                      fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stage-to-stage conversion rates */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {funnelData.slice(0, -1).map((stage, i) => {
              const next = funnelData[i + 1];
              const rate =
                stage.count > 0
                  ? ((next.count / stage.count) * 100).toFixed(1)
                  : "0.0";
              return (
                <div
                  key={stage.stage}
                  className="flex flex-col items-center rounded-xl bg-navy-50/30 p-3"
                >
                  <div className="flex items-center gap-1 text-[10px] text-graphite-400">
                    <span className="truncate max-w-[60px]">
                      {stage.stage.split(" ")[0]}
                    </span>
                    <ArrowRight className="h-2.5 w-2.5 shrink-0" />
                    <span className="truncate max-w-[60px]">
                      {next.stage.split(" ")[0]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-lg font-bold text-navy">{rate}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Acquisition Attribution ────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-atlantic" />
            Acquisition Attribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attributionData.length === 0 ? (
            <p className="py-8 text-center text-graphite-300">
              No lead data for this date range
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-navy-100/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Conv. Rate
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {attributionData.map((row) => (
                    <tr
                      key={row.source}
                      className="transition-colors hover:bg-linen/20"
                    >
                      <td className="px-4 py-3 font-medium text-navy">
                        {row.source}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-navy">
                        {row.users.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-navy">
                        {row.conversions.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-navy">
                        {row.users > 0
                          ? ((row.conversions / row.users) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-navy">
                        {row.revenueCents > 0
                          ? formatPrice(row.revenueCents)
                          : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Upsell Performance ─────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-gold-600" />
            Upsell Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upsellData.length === 0 ? (
            <p className="py-8 text-center text-graphite-300">
              No upsell offers configured
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-navy-100/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Offer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Trigger
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Shown
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Clicked
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-graphite-400 uppercase tracking-wider">
                      Conv. Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {upsellData.map((offer) => (
                    <tr
                      key={offer.id}
                      className="transition-colors hover:bg-linen/20"
                    >
                      <td className="px-4 py-3 font-medium text-navy max-w-[220px] truncate">
                        {offer.headline}
                      </td>
                      <td className="px-4 py-3 text-graphite-500">
                        {offer.productName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {offer.triggerEvent.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-navy">
                        {offer.shownCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-navy">
                        {offer.clickedCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={
                            offer.conversionRate >= 10
                              ? "font-semibold text-emerald-600"
                              : offer.conversionRate >= 5
                              ? "font-medium text-navy"
                              : "text-graphite-400"
                          }
                        >
                          {offer.conversionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
