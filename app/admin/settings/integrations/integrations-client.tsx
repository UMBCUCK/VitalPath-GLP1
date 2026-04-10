"use client";

import { useState, useCallback } from "react";
import {
  Download,
  FileJson,
  FileSpreadsheet,
  Key,
  Webhook,
  MessageSquare,
  Zap,
  Globe,
  Calendar,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────

type ExportEntity = "customers" | "orders" | "subscriptions" | "analytics" | "consultations";
type ExportFormat = "csv" | "json";

const entities: { value: ExportEntity; label: string; description: string }[] = [
  { value: "customers", label: "Customers", description: "User profiles, subscriptions, health data" },
  { value: "orders", label: "Orders", description: "Order history with items and shipping" },
  { value: "subscriptions", label: "Subscriptions", description: "Subscription plans, MRR, billing" },
  { value: "analytics", label: "Analytics Events", description: "Page views, funnels, conversions" },
  { value: "consultations", label: "Consultations", description: "OpenLoop consultation pipeline" },
];

// ── Main Component ─────────────────────────────────────────────

export function IntegrationsClient() {
  const [selectedEntity, setSelectedEntity] = useState<ExportEntity>("customers");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [exporting, setExporting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        entity: selectedEntity,
        format,
      });
      if (dateFrom) params.set("from", dateFrom);
      if (dateTo) params.set("to", dateTo);
      if (status) params.set("status", status);

      const res = await fetch(`/api/admin/export?${params}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedEntity}-export-${new Date().toISOString().slice(0, 10)}.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      setLastExport(new Date().toISOString());
    } catch {
      // Error silently handled — user sees no download
    } finally {
      setExporting(false);
    }
  }, [selectedEntity, format, dateFrom, dateTo, status]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
            <Database className="h-5 w-5 text-teal" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy">
              Data Export & Integrations
            </h1>
            <p className="text-sm text-graphite-400">
              Export data, manage API keys, and configure outbound webhooks
            </p>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-navy">
            <Download className="h-5 w-5 text-teal" />
            Data Export
          </CardTitle>
          <CardDescription>
            Export up to 10,000 rows per entity. Apply date range and status filters to narrow results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Entity Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-navy">
              Entity
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {entities.map((e) => (
                <button
                  key={e.value}
                  onClick={() => setSelectedEntity(e.value)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    selectedEntity === e.value
                      ? "border-teal bg-teal-50/50 ring-1 ring-teal/20"
                      : "border-navy-100/60 hover:border-navy-200"
                  }`}
                >
                  <p className="text-sm font-medium text-navy">{e.label}</p>
                  <p className="text-xs text-graphite-400">{e.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Format Toggle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-navy">
              Format
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormat("csv")}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  format === "csv"
                    ? "border-teal bg-teal-50 text-teal"
                    : "border-navy-100/60 text-graphite-500 hover:border-navy-200"
                }`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                CSV
              </button>
              <button
                onClick={() => setFormat("json")}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  format === "json"
                    ? "border-teal bg-teal-50 text-teal"
                    : "border-navy-100/60 text-graphite-500 hover:border-navy-200"
                }`}
              >
                <FileJson className="h-4 w-4" />
                JSON
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-navy-100/60 px-3 py-2 text-sm text-navy focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-navy-100/60 px-3 py-2 text-sm text-navy focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Status filter
              </label>
              <input
                type="text"
                placeholder="e.g. ACTIVE, SHIPPED"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-navy-100/60 px-3 py-2 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/20"
              />
            </div>
          </div>

          {/* Export Button + Last Export */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handleExport}
              disabled={exporting}
              className="gap-2 bg-teal text-white hover:bg-teal/90"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {exporting ? "Exporting..." : "Export"}
            </Button>

            {lastExport && (
              <div className="flex items-center gap-1.5 text-xs text-graphite-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Last export: {new Date(lastExport).toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Integration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-navy">
            <Key className="h-5 w-5 text-teal" />
            API Integration
          </CardTitle>
          <CardDescription>
            Manage API keys for programmatic access to Nature's Journey data endpoints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-navy-100/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                <Key className="h-5 w-5 text-navy" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy">API Keys</p>
                <p className="text-xs text-graphite-400">
                  Create and manage API keys for external integrations
                </p>
              </div>
            </div>
            <Link href="/admin/settings/api-keys">
              <Button variant="outline" size="sm" className="gap-1.5">
                Manage
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-graphite-300">
              Available Endpoints
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { method: "GET", path: "/api/admin/export", desc: "Bulk data export" },
                { method: "GET", path: "/api/admin/telehealth", desc: "Telehealth pipeline" },
                { method: "POST", path: "/api/admin/telehealth", desc: "Sync consultation" },
                { method: "GET", path: "/api/admin/events/stream", desc: "SSE activity stream" },
              ].map((ep) => (
                <div
                  key={ep.path}
                  className="flex items-center gap-2 rounded-lg bg-linen/30 px-3 py-2"
                >
                  <Badge
                    variant="outline"
                    className={
                      ep.method === "GET"
                        ? "border-blue-200 text-blue-600"
                        : "border-emerald-200 text-emerald-600"
                    }
                  >
                    {ep.method}
                  </Badge>
                  <code className="text-xs text-navy">{ep.path}</code>
                  <span className="ml-auto text-xs text-graphite-300">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Outbound Section (future) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-navy">
            <Webhook className="h-5 w-5 text-teal" />
            Outbound Webhooks
            <Badge variant="secondary" className="ml-1 text-[10px]">
              Coming Soon
            </Badge>
          </CardTitle>
          <CardDescription>
            Send Nature's Journey events to external services in real time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                icon: MessageSquare,
                title: "Slack",
                description: "Send new orders, cancellations, and alerts to a Slack channel",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: Zap,
                title: "Zapier",
                description: "Connect to 5000+ apps via Zapier triggers",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                icon: Globe,
                title: "Custom Webhook",
                description: "Send events to any URL with HMAC signature verification",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-dashed border-navy-100/60 p-4 opacity-60"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg}`}
                  >
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <p className="text-sm font-medium text-navy">{item.title}</p>
                </div>
                <p className="mt-2 text-xs text-graphite-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
