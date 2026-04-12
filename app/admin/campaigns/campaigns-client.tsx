"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import { formatPrice } from "@/lib/utils";
import { Send, Users, TrendingUp, DollarSign, MousePointerClick } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  trigger: string;
  offerText: string | null;
  couponId: string | null;
  emailSubject: string | null;
  emailBody: string | null;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  convertedCount: number;
  revenueGenerated: number;
  startedAt: string | null;
  pausedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Summary {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalConverted: number;
  totalRevenue: number;
}

interface Props {
  campaigns: Campaign[];
  total: number;
  page: number;
  limit: number;
  statusFilter: string;
  typeFilter: string;
  summary: Summary;
}

const STATUS_BADGE: Record<
  string,
  "success" | "secondary" | "warning" | "outline"
> = {
  ACTIVE: "success",
  DRAFT: "secondary",
  PAUSED: "warning",
  COMPLETED: "outline",
};

const TYPE_LABELS: Record<string, string> = {
  REACTIVATION: "Reactivation",
  RECOVERY: "Recovery",
  UPGRADE: "Upgrade",
  RETENTION: "Retention",
  ENGAGEMENT: "Engagement",
};

const columns: ColumnDef<Campaign>[] = [
  {
    key: "name",
    header: "Campaign",
    sortable: true,
    render: (row) => (
      <div>
        <p className="font-medium text-navy">{row.name}</p>
        <span className="text-[10px] text-graphite-400">{row.trigger}</span>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (row) => (
      <Badge variant="secondary" className="text-[10px]">
        {TYPE_LABELS[row.type] || row.type}
      </Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => (
      <Badge variant={STATUS_BADGE[row.status] || "outline"}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: "sentCount",
    header: "Sent",
    sortable: true,
    className: "text-right",
    render: (row) => (
      <span className="tabular-nums text-navy">
        {row.sentCount.toLocaleString()}
      </span>
    ),
  },
  {
    key: "openedCount",
    header: "Opened",
    sortable: true,
    className: "text-right",
    render: (row) => (
      <div className="text-right">
        <span className="tabular-nums text-navy">
          {row.openedCount.toLocaleString()}
        </span>
        {row.sentCount > 0 && (
          <span className="ml-1 text-xs text-graphite-400">
            ({((row.openedCount / row.sentCount) * 100).toFixed(0)}%)
          </span>
        )}
      </div>
    ),
  },
  {
    key: "clickedCount",
    header: "Clicked",
    sortable: true,
    className: "text-right",
    render: (row) => (
      <div className="text-right">
        <span className="tabular-nums text-navy">
          {row.clickedCount.toLocaleString()}
        </span>
        {row.openedCount > 0 && (
          <span className="ml-1 text-xs text-graphite-400">
            ({((row.clickedCount / row.openedCount) * 100).toFixed(0)}%)
          </span>
        )}
      </div>
    ),
  },
  {
    key: "convertedCount",
    header: "Converted",
    sortable: true,
    className: "text-right",
    render: (row) => (
      <div className="text-right">
        <span className="font-medium tabular-nums text-navy">
          {row.convertedCount.toLocaleString()}
        </span>
        {row.sentCount > 0 && (
          <span className="ml-1 text-xs text-graphite-400">
            ({((row.convertedCount / row.sentCount) * 100).toFixed(1)}%)
          </span>
        )}
      </div>
    ),
  },
  {
    key: "revenueGenerated",
    header: "Revenue",
    sortable: true,
    className: "text-right",
    render: (row) => (
      <span className="font-medium tabular-nums text-navy">
        {row.revenueGenerated > 0
          ? formatPrice(row.revenueGenerated)
          : "--"}
      </span>
    ),
  },
];

export function CampaignsClient({
  campaigns,
  total,
  page,
  limit,
  statusFilter,
  typeFilter,
  summary,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    for (const [k, v] of Object.entries(overrides)) {
      if (v === "all" || !v) params.delete(k);
      else params.set(k, v);
    }
    router.push(`/admin/campaigns?${params.toString()}`);
  }

  const kpis = [
    {
      icon: Send,
      label: "Emails Sent",
      value: summary.totalSent.toLocaleString(),
      color: "text-teal",
    },
    {
      icon: MousePointerClick,
      label: "Clicked",
      value: summary.totalClicked.toLocaleString(),
      color: "text-atlantic",
    },
    {
      icon: Users,
      label: "Conversions",
      value: summary.totalConverted.toLocaleString(),
      color: "text-gold-600",
    },
    {
      icon: TrendingUp,
      label: "Avg Conv. Rate",
      value:
        summary.totalSent > 0
          ? `${((summary.totalConverted / summary.totalSent) * 100).toFixed(1)}%`
          : "0%",
      color: "text-emerald-500",
    },
    {
      icon: DollarSign,
      label: "Attributed Revenue",
      value: formatPrice(summary.totalRevenue),
      color: "text-navy",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Campaigns</h2>
        <p className="text-sm text-graphite-400">
          Automated email campaigns for recovery, retention, and growth
        </p>
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <k.icon className={`h-5 w-5 ${k.color}`} />
              <div>
                <p className="text-xs text-graphite-400">{k.label}</p>
                <p className="text-xl font-bold text-navy">{k.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        data={campaigns}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        onPageChange={(p) => navigate({ page: String(p) })}
        getRowId={(row) => row.id}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "ACTIVE" },
              { label: "Draft", value: "DRAFT" },
              { label: "Paused", value: "PAUSED" },
              { label: "Completed", value: "COMPLETED" },
            ],
          },
          {
            key: "type",
            label: "Type",
            options: [
              { label: "All Types", value: "all" },
              { label: "Reactivation", value: "REACTIVATION" },
              { label: "Recovery", value: "RECOVERY" },
              { label: "Upgrade", value: "UPGRADE" },
              { label: "Retention", value: "RETENTION" },
              { label: "Engagement", value: "ENGAGEMENT" },
            ],
          },
        ]}
        activeFilters={{ status: statusFilter, type: typeFilter }}
        onFilterChange={(key, value) => navigate({ [key]: value, page: "1" })}
        emptyMessage="No campaigns found for these filters"
      />
    </div>
  );
}
