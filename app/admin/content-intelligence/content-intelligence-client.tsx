"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import {
  DataTable,
  type ColumnDef,
  exportToCSV,
} from "@/components/admin/data-table";
import {
  Sparkles,
  Eye,
  MousePointerClick,
  Star,
  Zap,
  FileText,
  ChefHat,
  Calendar,
} from "lucide-react";

interface Analytics {
  totalRecommendations: number;
  viewRate: number;
  clickRate: number;
  mostRecommendedTitle: string;
  bestPerformingTitle: string;
}

interface ContentPerformanceRow {
  contentId: string;
  contentType: string;
  title: string;
  timesRecommended: number;
  views: number;
  clicks: number;
  clickRate: number;
  avgScore: number;
}

interface Props {
  analytics: Analytics;
  performance: ContentPerformanceRow[];
}

export function ContentIntelligenceClient({ analytics, performance }: Props) {
  const [performanceData, setPerformanceData] = useState(performance);
  const [loading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 25;

  const typeBadge = (type: string) => {
    if (type === "BLOG_POST") {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
          <FileText className="mr-1 h-3 w-3" /> Blog
        </Badge>
      );
    }
    if (type === "RECIPE") {
      return (
        <Badge className="bg-orange-50 text-orange-700 border-orange-200">
          <ChefHat className="mr-1 h-3 w-3" /> Recipe
        </Badge>
      );
    }
    if (type === "MEAL_PLAN") {
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200">
          <Calendar className="mr-1 h-3 w-3" /> Meal Plan
        </Badge>
      );
    }
    return <Badge variant="secondary">{type}</Badge>;
  };

  const handleGenerateBatch = async () => {
    setGenerating(true);
    setBatchMessage(null);
    try {
      const res = await fetch("/api/admin/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setBatchMessage(data.message);
        const perfRes = await fetch(
          "/api/admin/recommendations?view=performance"
        );
        const perfData = await perfRes.json();
        setPerformanceData(perfData);
      } else {
        setBatchMessage(data.error || "Failed to generate");
      }
    } finally {
      setGenerating(false);
    }
  };

  const paginatedData = performanceData.slice(
    (page - 1) * limit,
    page * limit
  );

  const columns: ColumnDef<ContentPerformanceRow>[] = [
    {
      key: "title",
      header: "Content",
      sortable: true,
      render: (row) => (
        <div className="max-w-[250px]">
          <p className="font-medium text-navy truncate">{row.title}</p>
        </div>
      ),
    },
    {
      key: "contentType",
      header: "Type",
      sortable: true,
      render: (row) => typeBadge(row.contentType),
    },
    {
      key: "timesRecommended",
      header: "Times Recommended",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-navy">{row.timesRecommended}</span>
      ),
    },
    {
      key: "views",
      header: "Views",
      sortable: true,
      render: (row) => <span>{row.views}</span>,
    },
    {
      key: "clicks",
      header: "Clicks",
      sortable: true,
      render: (row) => (
        <span className="font-medium">{row.clicks}</span>
      ),
    },
    {
      key: "clickRate",
      header: "Click Rate",
      sortable: true,
      render: (row) => {
        let color = "text-graphite-400";
        if (row.clickRate > 20) color = "font-semibold text-emerald-600";
        else if (row.clickRate > 10) color = "text-amber-600";
        return <span className={color}>{row.clickRate.toFixed(1)}%</span>;
      },
    },
    {
      key: "avgScore",
      header: "Avg Relevance",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <div
            className="h-2 rounded-full bg-teal"
            style={{ width: `${Math.min(row.avgScore, 100)}%`, maxWidth: 60 }}
          />
          <span className="text-xs text-graphite-400">
            {row.avgScore.toFixed(0)}
          </span>
        </div>
      ),
    },
  ];

  const handleExport = () => {
    exportToCSV(
      performanceData,
      [
        { key: "title", header: "Title", getValue: (r: ContentPerformanceRow) => r.title },
        { key: "type", header: "Type", getValue: (r: ContentPerformanceRow) => r.contentType },
        {
          key: "timesRecommended",
          header: "Times Recommended",
          getValue: (r: ContentPerformanceRow) => String(r.timesRecommended),
        },
        { key: "views", header: "Views", getValue: (r: ContentPerformanceRow) => String(r.views) },
        {
          key: "clicks",
          header: "Clicks",
          getValue: (r: ContentPerformanceRow) => String(r.clicks),
        },
        {
          key: "clickRate",
          header: "Click Rate %",
          getValue: (r: ContentPerformanceRow) => r.clickRate.toFixed(1),
        },
        {
          key: "avgScore",
          header: "Avg Relevance",
          getValue: (r: ContentPerformanceRow) => r.avgScore.toFixed(1),
        },
      ],
      "content-intelligence"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">
            Content Intelligence
          </h2>
          <p className="text-sm text-graphite-400">
            AI-driven content recommendations and engagement analytics
          </p>
        </div>
        <button
          onClick={handleGenerateBatch}
          disabled={generating}
          className="rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy/90 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          {generating ? "Generating..." : "Generate Batch"}
        </button>
      </div>

      {/* Batch message */}
      {batchMessage && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
          {batchMessage}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Recommendations"
          value={analytics.totalRecommendations.toLocaleString()}
          icon={Sparkles}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <KPICard
          title="View Rate"
          value={`${analytics.viewRate}%`}
          icon={Eye}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Click Rate"
          value={`${analytics.clickRate}%`}
          icon={MousePointerClick}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Top Content"
          value={
            analytics.mostRecommendedTitle.length > 20
              ? analytics.mostRecommendedTitle.slice(0, 20) + "..."
              : analytics.mostRecommendedTitle
          }
          icon={Star}
          iconColor="text-amber-500"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Best Performing Note */}
      {analytics.bestPerformingTitle !== "N/A" && (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <MousePointerClick className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-graphite-400">
                Best Performing Content
              </p>
              <p className="text-sm font-semibold text-navy">
                {analytics.bestPerformingTitle}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Performance Table */}
      <Card>
        <CardContent className="p-0 pt-4">
          <DataTable
            data={paginatedData}
            columns={columns}
            total={performanceData.length}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onExportCSV={handleExport}
            getRowId={(r) => `${r.contentType}:${r.contentId}`}
            emptyMessage="No content performance data yet. Generate recommendations to see results."
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
