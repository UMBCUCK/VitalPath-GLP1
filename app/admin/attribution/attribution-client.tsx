"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import { DataTable, type ColumnDef, exportToCSV } from "@/components/admin/data-table";
import { DateRangePicker } from "@/components/admin/date-range-picker";
import { formatPrice } from "@/lib/utils";
import {
  MousePointerClick,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  BarChart3,
} from "lucide-react";
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
import type {
  AttributionOverview,
  ChannelAttribution,
  ContentAttribution,
  CampaignAttribution,
  AttributionModel,
} from "@/lib/admin-attribution";

// ── Types ─────────────────────────────────────────────────────

interface ModelComparison {
  firstClick: string;
  lastClick: string;
  linear: string;
  firstClickRevenue: number;
  lastClickRevenue: number;
  linearRevenue: number;
}

interface Props {
  overview: AttributionOverview;
  channels: ChannelAttribution[];
  content: ContentAttribution[];
  campaigns: CampaignAttribution[];
  model: AttributionModel;
  from: string;
  to: string;
  modelComparison: ModelComparison;
}

// ── Channel color map ─────────────────────────────────────────

const CHANNEL_COLORS: Record<string, string> = {
  organic: "#0d9488",
  paid: "#f59e0b",
  referral: "#8b5cf6",
  email: "#3b82f6",
  social: "#ec4899",
  direct: "#6b7280",
};

function channelColor(channel: string): string {
  return CHANNEL_COLORS[channel.toLowerCase()] || "#94a3b8";
}

// ── Model label helper ────────────────────────────────────────

const MODEL_LABELS: Record<AttributionModel, string> = {
  first_click: "First Click",
  last_click: "Last Click",
  linear: "Linear",
};

// ── Column definitions ────────────────────────────────────────

const channelColumns: ColumnDef<ChannelAttribution>[] = [
  {
    key: "channel",
    header: "Channel",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: channelColor(row.channel) }}
        />
        <span className="font-medium text-navy capitalize">{row.channel}</span>
      </div>
    ),
  },
  {
    key: "touches",
    header: "Touches",
    sortable: true,
    render: (row) => <span className="text-graphite-600">{row.touches.toLocaleString()}</span>,
  },
  {
    key: "conversions",
    header: "Conversions",
    sortable: true,
    render: (row) => <span className="font-medium text-navy">{row.conversions.toLocaleString()}</span>,
  },
  {
    key: "conversionRate",
    header: "CVR",
    sortable: true,
    render: (row) => <span className="text-graphite-600">{row.conversionRate}%</span>,
  },
  {
    key: "revenue",
    header: "Revenue",
    sortable: true,
    render: (row) => <span className="font-semibold text-navy">{formatPrice(row.revenue)}</span>,
  },
  {
    key: "avgLTV",
    header: "Avg LTV",
    sortable: true,
    render: (row) => <span className="text-graphite-600">{formatPrice(row.avgLTV)}</span>,
  },
];

const contentColumns: ColumnDef<ContentAttribution>[] = [
  {
    key: "content",
    header: "Content",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-navy truncate max-w-[240px]">{row.content}</p>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (row) => {
      const variantMap: Record<string, "default" | "secondary" | "gold" | "outline"> = {
        Blog: "default",
        Email: "secondary",
        Ad: "gold",
        Social: "outline",
      };
      return <Badge variant={variantMap[row.type] || "outline"}>{row.type}</Badge>;
    },
  },
  {
    key: "touches",
    header: "Touches",
    sortable: true,
    render: (row) => <span className="text-graphite-600">{row.touches.toLocaleString()}</span>,
  },
  {
    key: "conversions",
    header: "Conversions",
    sortable: true,
    render: (row) => <span className="font-medium text-navy">{row.conversions.toLocaleString()}</span>,
  },
  {
    key: "revenue",
    header: "Revenue",
    sortable: true,
    render: (row) => <span className="font-semibold text-navy">{formatPrice(row.revenue)}</span>,
  },
];

const campaignColumns: ColumnDef<CampaignAttribution>[] = [
  {
    key: "campaign",
    header: "Campaign",
    sortable: true,
    render: (row) => <span className="font-medium text-navy">{row.campaign}</span>,
  },
  {
    key: "touches",
    header: "Touches",
    sortable: true,
    render: (row) => <span className="text-graphite-600">{row.touches.toLocaleString()}</span>,
  },
  {
    key: "conversions",
    header: "Conversions",
    sortable: true,
    render: (row) => <span className="font-medium text-navy">{row.conversions.toLocaleString()}</span>,
  },
  {
    key: "conversionRate",
    header: "CVR",
    sortable: true,
    render: (row) => <span className="text-graphite-600">{row.conversionRate}%</span>,
  },
  {
    key: "revenue",
    header: "Revenue",
    sortable: true,
    render: (row) => <span className="font-semibold text-navy">{formatPrice(row.revenue)}</span>,
  },
];

// ── Custom Tooltip ────────────────────────────────────────────

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { channel: string } }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="rounded-lg border border-navy-100/60 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-navy capitalize">{data.payload.channel}</p>
      <p className="text-sm font-bold text-teal">{formatPrice(data.value)}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────

export function AttributionClient({
  overview,
  channels,
  content,
  campaigns,
  model,
  from,
  to,
  modelComparison,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      params.set(key, value);
    }
    router.push(`/admin/attribution?${params.toString()}`);
  }

  // Chart data
  const chartData = channels.map((c) => ({
    channel: c.channel,
    revenue: c.revenue,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Attribution Analytics</h1>
          <p className="mt-1 text-sm text-graphite-400">
            Track how channels, content, and campaigns drive conversions and revenue
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="inline-flex rounded-xl border border-navy-200 bg-white p-0.5">
            {(["first_click", "last_click", "linear"] as AttributionModel[]).map((m) => (
              <button
                key={m}
                onClick={() => updateParams({ model: m })}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  model === m
                    ? "bg-navy text-white"
                    : "text-graphite-500 hover:text-navy"
                }`}
              >
                {MODEL_LABELS[m]}
              </button>
            ))}
          </div>
          <DateRangePicker
            from={from}
            to={to}
            onChange={(f, t) => updateParams({ from: f, to: t })}
          />
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KPICard
          title="Total Touches"
          value={overview.totalTouches.toLocaleString()}
          icon={MousePointerClick}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Conversions"
          value={overview.conversions.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Attributed Revenue"
          value={formatPrice(overview.revenueAttributed)}
          icon={DollarSign}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Avg Touches / Conv"
          value={String(overview.avgTouchesPerConversion)}
          icon={Users}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="Top Channel"
          value={overview.topChannel.charAt(0).toUpperCase() + overview.topChannel.slice(1)}
          icon={Award}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Channel Performance Chart + Table */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-teal" />
              <h2 className="text-lg font-bold text-navy">Channel Performance</h2>
            </div>
            <Badge variant="secondary">{MODEL_LABELS[model]} Model</Badge>
          </div>

          {/* Horizontal Bar Chart */}
          {chartData.length > 0 ? (
            <div className="mb-6" style={{ height: Math.max(200, chartData.length * 48) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v: number) => formatPrice(v)}
                    tick={{ fontSize: 11, fill: "#6b7280" }}
                  />
                  <YAxis
                    dataKey="channel"
                    type="category"
                    tick={{ fontSize: 12, fill: "#1e293b" }}
                    width={70}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={28}>
                    {chartData.map((entry) => (
                      <Cell key={entry.channel} fill={channelColor(entry.channel)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-graphite-400">
              No attribution data for this period
            </div>
          )}

          {/* Channel Table */}
          <DataTable
            data={channels}
            columns={channelColumns}
            total={channels.length}
            page={1}
            limit={channels.length || 10}
            onPageChange={() => {}}
            onExportCSV={() =>
              exportToCSV(
                channels,
                [
                  { key: "channel", header: "Channel", getValue: (r) => r.channel },
                  { key: "touches", header: "Touches", getValue: (r) => String(r.touches) },
                  { key: "conversions", header: "Conversions", getValue: (r) => String(r.conversions) },
                  { key: "conversionRate", header: "CVR %", getValue: (r) => String(r.conversionRate) },
                  { key: "revenue", header: "Revenue", getValue: (r) => formatPrice(r.revenue) },
                  { key: "avgLTV", header: "Avg LTV", getValue: (r) => formatPrice(r.avgLTV) },
                ],
                "channel-attribution"
              )
            }
            emptyMessage="No channel data for this period"
          />
        </CardContent>
      </Card>

      {/* Content Attribution */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy">Content Attribution</h2>
          <DataTable
            data={content}
            columns={contentColumns}
            total={content.length}
            page={1}
            limit={content.length || 10}
            onPageChange={() => {}}
            onExportCSV={() =>
              exportToCSV(
                content,
                [
                  { key: "content", header: "Content", getValue: (r) => r.content },
                  { key: "type", header: "Type", getValue: (r) => r.type },
                  { key: "touches", header: "Touches", getValue: (r) => String(r.touches) },
                  { key: "conversions", header: "Conversions", getValue: (r) => String(r.conversions) },
                  { key: "revenue", header: "Revenue", getValue: (r) => formatPrice(r.revenue) },
                ],
                "content-attribution"
              )
            }
            emptyMessage="No content attribution data for this period"
          />
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-bold text-navy">Campaign Performance</h2>
          <DataTable
            data={campaigns}
            columns={campaignColumns}
            total={campaigns.length}
            page={1}
            limit={campaigns.length || 10}
            onPageChange={() => {}}
            onExportCSV={() =>
              exportToCSV(
                campaigns,
                [
                  { key: "campaign", header: "Campaign", getValue: (r) => r.campaign },
                  { key: "touches", header: "Touches", getValue: (r) => String(r.touches) },
                  { key: "conversions", header: "Conversions", getValue: (r) => String(r.conversions) },
                  { key: "conversionRate", header: "CVR %", getValue: (r) => String(r.conversionRate) },
                  { key: "revenue", header: "Revenue", getValue: (r) => formatPrice(r.revenue) },
                ],
                "campaign-attribution"
              )
            }
            emptyMessage="No campaign data for this period"
          />
        </CardContent>
      </Card>

      {/* Model Comparison */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-navy">Model Comparison</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              {
                label: "First Click",
                channel: modelComparison.firstClick,
                revenue: modelComparison.firstClickRevenue,
                description: "Credits the channel that first brought the user",
                color: "border-blue-200 bg-blue-50/30",
              },
              {
                label: "Last Click",
                channel: modelComparison.lastClick,
                revenue: modelComparison.lastClickRevenue,
                description: "Credits the last channel before conversion",
                color: "border-emerald-200 bg-emerald-50/30",
              },
              {
                label: "Linear",
                channel: modelComparison.linear,
                revenue: modelComparison.linearRevenue,
                description: "Distributes credit equally across all touches",
                color: "border-purple-200 bg-purple-50/30",
              },
            ] as const
          ).map((m) => (
            <Card key={m.label} className={`border ${m.color}`}>
              <CardContent className="p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-graphite-400">
                  {m.label} Model
                </p>
                <p className="mt-2 text-xl font-bold capitalize text-navy">{m.channel}</p>
                <p className="mt-1 text-sm font-semibold text-teal">
                  {formatPrice(m.revenue)}
                </p>
                <p className="mt-2 text-xs text-graphite-400">{m.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
