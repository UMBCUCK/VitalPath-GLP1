"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
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
import { PieChart as PieChartIcon, TrendingUp, Hash, DollarSign, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";

// ── Types ──────────────────────────────────────────────────────

interface ContentRow {
  contentPiece: string;
  contentType: string;
  totalRevenue: number;
  orderCount: number;
  avgOrderValue: number;
}

interface ContentROIRow {
  slug: string;
  title: string;
  isPublished: boolean;
  totalRevenue: number;
  orderCount: number;
}

interface ChannelRow {
  channel: string;
  totalRevenue: number;
  orderCount: number;
  avgLTV: number;
}

interface Recommendation {
  recommendation: string;
  channel: string;
  metric: string;
  currentValue: string;
  projectedImpact: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

interface Props {
  contentData: ContentRow[];
  contentROI: ContentROIRow[];
  channelData: ChannelRow[];
  recommendations: Recommendation[];
  totalRevenue: number;
  totalOrders: number;
  topContent: string;
  topChannel: string;
  initialFrom: string;
  initialTo: string;
  initialModel: string;
}

const COLORS = ["#0d9488", "#0284c7", "#7c3aed", "#ea580c", "#d946ef", "#059669", "#dc2626", "#ca8a04"];

const TYPE_COLORS: Record<string, string> = {
  BLOG_POST: "bg-blue-100 text-blue-800",
  EMAIL: "bg-purple-100 text-purple-800",
  AD: "bg-orange-100 text-orange-800",
  REFERRAL: "bg-emerald-100 text-emerald-800",
  UNKNOWN: "bg-gray-100 text-gray-600",
};

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: "bg-red-100 text-red-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  LOW: "bg-blue-100 text-blue-800",
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function RevenueAttributionClient({
  contentData,
  contentROI,
  channelData,
  recommendations,
  totalRevenue,
  totalOrders,
  topContent,
  topChannel,
  initialFrom,
  initialTo,
  initialModel,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tablePage, setTablePage] = useState(1);
  const [activeModel, setActiveModel] = useState(initialModel);

  const handleDateChange = (from: string, to: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", from);
    params.set("to", to);
    router.push(`/admin/revenue-attribution?${params.toString()}`);
  };

  const handleModelChange = (model: string) => {
    setActiveModel(model);
    const params = new URLSearchParams(searchParams.toString());
    if (model === "all") params.delete("model");
    else params.set("model", model);
    router.push(`/admin/revenue-attribution?${params.toString()}`);
  };

  // ── Content table columns ────────────────────────────────────
  const contentColumns: ColumnDef<ContentRow>[] = [
    {
      key: "contentPiece",
      header: "Content",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-navy">{row.contentPiece}</p>
        </div>
      ),
    },
    {
      key: "contentType",
      header: "Type",
      render: (row) => (
        <Badge className={TYPE_COLORS[row.contentType] ?? TYPE_COLORS.UNKNOWN}>
          {row.contentType}
        </Badge>
      ),
    },
    {
      key: "totalRevenue",
      header: "Revenue",
      sortable: true,
      render: (row) => (
        <span className="font-semibold text-navy">{formatCents(row.totalRevenue)}</span>
      ),
    },
    {
      key: "orderCount",
      header: "Orders",
      sortable: true,
      render: (row) => <span>{row.orderCount}</span>,
    },
    {
      key: "avgOrderValue",
      header: "Avg Order",
      sortable: true,
      render: (row) => <span>{formatCents(row.avgOrderValue)}</span>,
    },
  ];

  // ── Channel bar chart data ───────────────────────────────────
  const barData = channelData.map((c) => ({
    channel: c.channel,
    revenue: c.totalRevenue / 100,
  }));

  // ── Pie chart data ───────────────────────────────────────────
  const totalChannelRevenue = channelData.reduce((s, c) => s + c.totalRevenue, 0);
  const pieData = channelData.map((c) => ({
    name: c.channel,
    value: totalChannelRevenue > 0
      ? Math.round((c.totalRevenue / totalChannelRevenue) * 1000) / 10
      : 0,
  }));

  const PAGE_SIZE = 10;
  const paginatedContent = contentData.slice(
    (tablePage - 1) * PAGE_SIZE,
    tablePage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Revenue Attribution</h1>
          <p className="text-sm text-graphite-400">
            Track which content and channels drive the most revenue
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
          title="Total Attributed Revenue"
          value={formatCents(totalRevenue)}
          icon={DollarSign}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Top Content Piece"
          value={topContent.length > 20 ? topContent.slice(0, 20) + "..." : topContent}
          icon={PieChartIcon}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Top Channel"
          value={topChannel.charAt(0).toUpperCase() + topChannel.slice(1)}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Orders Attributed"
          value={totalOrders.toLocaleString()}
          icon={Hash}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
      </div>

      {/* Content ROI Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={paginatedContent}
            columns={contentColumns}
            total={contentData.length}
            page={tablePage}
            limit={PAGE_SIZE}
            onPageChange={setTablePage}
            onExportCSV={() =>
              exportToCSV(
                contentData,
                [
                  { key: "contentPiece", header: "Content", getValue: (r) => r.contentPiece },
                  { key: "contentType", header: "Type", getValue: (r) => r.contentType },
                  { key: "totalRevenue", header: "Revenue", getValue: (r) => formatCents(r.totalRevenue) },
                  { key: "orderCount", header: "Orders", getValue: (r) => String(r.orderCount) },
                  { key: "avgOrderValue", header: "Avg Order", getValue: (r) => formatCents(r.avgOrderValue) },
                ],
                "content-roi"
              )
            }
            emptyMessage="No content attribution data for this period"
          />
        </CardContent>
      </Card>

      {/* Channel Performance + Pie */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Channel Performance</CardTitle>
              <div className="flex gap-1">
                {["all", "FIRST_CLICK", "LAST_CLICK", "LINEAR"].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleModelChange(m)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      activeModel === m
                        ? "bg-teal text-white"
                        : "bg-linen/50 text-graphite-500 hover:bg-navy-50"
                    }`}
                  >
                    {m === "all" ? "All" : m.replace("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="revenue" fill="#0d9488" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-graphite-300">
                No channel data for this period
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Spend Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-64 items-center justify-center text-graphite-300">
                No allocation data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Marketing Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Marketing Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-navy-100/60 p-4 transition-colors hover:bg-linen/20"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Badge className={PRIORITY_COLORS[rec.priority]}>
                      {rec.priority}
                    </Badge>
                    <span className="text-xs text-graphite-400">{rec.channel}</span>
                  </div>
                  <p className="text-sm font-medium text-navy">{rec.recommendation}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-graphite-400">{rec.metric}</span>
                      <span className="font-medium text-navy">{rec.currentValue}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-graphite-400">Projected Impact</span>
                      <span className="font-medium text-emerald-600">{rec.projectedImpact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-graphite-300">
              Not enough data to generate recommendations. Accumulate more attribution data to see insights.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
