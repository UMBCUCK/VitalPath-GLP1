"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/admin/kpi-card";
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Scan,
  FileText,
  Clock,
  Loader2,
} from "lucide-react";
import type {
  ScanResult,
  ScanResultsPage,
  ConsentExpiryInfo,
} from "@/lib/admin-compliance-scanner";

interface Props {
  scanResults: ScanResultsPage;
  consentExpiry: ConsentExpiryInfo;
  kpis: {
    totalFlags: number;
    violations: number;
    warnings: number;
    info: number;
    resolved: number;
  };
}

function severityBadge(severity: string) {
  switch (severity) {
    case "VIOLATION":
      return <Badge variant="destructive">Violation</Badge>;
    case "WARNING":
      return <Badge variant="warning">Warning</Badge>;
    case "INFO":
      return <Badge variant="secondary">Info</Badge>;
    default:
      return <Badge variant="secondary">{severity}</Badge>;
  }
}

function entityTypeBadge(entityType: string) {
  switch (entityType) {
    case "BLOG_POST":
      return (
        <Badge variant="default" className="text-xs">
          Blog Post
        </Badge>
      );
    case "RECIPE":
      return (
        <Badge variant="gold" className="text-xs">
          Recipe
        </Badge>
      );
    case "COMPARISON_PAGE":
      return (
        <Badge variant="secondary" className="text-xs">
          Comparison
        </Badge>
      );
    default:
      return <Badge variant="secondary">{entityType}</Badge>;
  }
}

function resolutionBadge(resolution: string | null) {
  if (!resolution)
    return (
      <span className="text-xs text-graphite-400">Unresolved</span>
    );
  switch (resolution) {
    case "APPROVED":
      return <Badge variant="success">Approved</Badge>;
    case "DISMISSED":
      return <Badge variant="secondary">Dismissed</Badge>;
    case "FIXED":
      return <Badge variant="default">Fixed</Badge>;
    default:
      return <Badge variant="secondary">{resolution}</Badge>;
  }
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function ScannerClient({ scanResults, consentExpiry, kpis }: Props) {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [resolving, setResolving] = useState<string | null>(null);
  const [results, setResults] = useState(scanResults.results);

  const runScan = async () => {
    setScanning(true);
    try {
      const res = await fetch("/api/admin/compliance/scan", {
        method: "POST",
      });
      if (res.ok) {
        // Refresh the page to show new results
        router.refresh();
      }
    } catch {
      // scan failed silently
    } finally {
      setScanning(false);
    }
  };

  const resolveFlag = async (
    id: string,
    resolution: "APPROVED" | "DISMISSED" | "FIXED"
  ) => {
    setResolving(id);
    try {
      const res = await fetch("/api/admin/compliance/scan/resolve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resolution }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update local state
        setResults((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  resolution: data.result.resolution,
                  resolvedBy: data.result.resolvedBy,
                  resolvedAt: data.result.resolvedAt,
                }
              : r
          )
        );
      }
    } catch {
      // resolve failed silently
    } finally {
      setResolving(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Compliance Scanner</h2>
          <p className="text-sm text-graphite-400">
            Scan content for unapproved claims and track consent expiry
          </p>
        </div>
        <Button
          onClick={runScan}
          disabled={scanning}
          className="gap-2"
        >
          {scanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Scan className="h-4 w-4" />
              Run Scan
            </>
          )}
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Flags"
          value={String(kpis.totalFlags)}
          icon={FileText}
          iconColor="text-navy"
          iconBg="bg-navy-50"
        />
        <KPICard
          title="Violations"
          value={String(kpis.violations)}
          icon={AlertOctagon}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
        <KPICard
          title="Warnings"
          value={String(kpis.warnings)}
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Resolved"
          value={String(kpis.resolved)}
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Scan Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Scan Results ({scanResults.total} total)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Content
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Flagged Text
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-graphite-400">
                    Severity
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-graphite-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-graphite-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-graphite-300"
                    >
                      No compliance flags found. Run a scan to check content.
                    </td>
                  </tr>
                ) : (
                  results.map((result: ScanResult) => (
                    <tr
                      key={result.id}
                      className="hover:bg-linen/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {entityTypeBadge(result.entityType)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-navy text-xs max-w-[200px] truncate">
                          {result.entityTitle}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block max-w-[250px] truncate rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-800 border border-amber-200">
                          {result.flaggedText}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {severityBadge(result.severity)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {resolutionBadge(result.resolution)}
                      </td>
                      <td className="px-4 py-3">
                        {!result.resolution ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() =>
                                resolveFlag(result.id, "APPROVED")
                              }
                              disabled={resolving === result.id}
                              className="rounded px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors disabled:opacity-50"
                              title="Mark as acceptable"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                resolveFlag(result.id, "DISMISSED")
                              }
                              disabled={resolving === result.id}
                              className="rounded px-2 py-1 text-xs font-medium text-graphite-500 hover:bg-navy-50 border border-navy-200 transition-colors disabled:opacity-50"
                              title="Not a real issue"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() =>
                                resolveFlag(result.id, "FIXED")
                              }
                              disabled={resolving === result.id}
                              className="rounded px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-50 border border-teal-200 transition-colors disabled:opacity-50"
                              title="Content was updated"
                            >
                              Fixed
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-graphite-400">
                            by {result.resolvedBy}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Consent Expiry Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-teal" />
            Consent Expiry Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-navy-100/60 p-4">
              <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                Total Consents
              </p>
              <p className="mt-1 text-2xl font-bold text-navy">
                {consentExpiry.totalConsents}
              </p>
            </div>
            <div className="rounded-lg border border-navy-100/60 p-4">
              <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                Users Needing Renewal
              </p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {consentExpiry.expiringCount}
              </p>
            </div>
            <div className="rounded-lg border border-navy-100/60 p-4">
              <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                Consent Types
              </p>
              <p className="mt-1 text-2xl font-bold text-navy">
                {consentExpiry.byType.length}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Consent Type
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">
                    Count
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">
                    Oldest Consent
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-graphite-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {consentExpiry.byType.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-graphite-300"
                    >
                      No consent records found
                    </td>
                  </tr>
                ) : (
                  consentExpiry.byType.map((item) => (
                    <tr
                      key={item.type}
                      className="hover:bg-linen/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-graphite-400" />
                          <span className="font-medium text-navy">
                            {item.type.replace(/_/g, " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-navy">
                        {item.count}
                      </td>
                      <td className="px-4 py-3 text-graphite-500">
                        {formatDate(item.oldestDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.needsRenewal ? (
                          <Badge variant="warning">Needs Renewal</Badge>
                        ) : (
                          <Badge variant="success">Current</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
