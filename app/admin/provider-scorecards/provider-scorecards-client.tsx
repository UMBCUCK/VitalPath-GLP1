"use client";

import { useState, useCallback } from "react";
import {
  Users,
  Stethoscope,
  Award,
  TrendingDown,
  Shield,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KPICard } from "@/components/admin/kpi-card";
import { DataTable, type ColumnDef } from "@/components/admin/data-table";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// ─── Types ─────────────────────────────────────────────────────

interface Scorecard {
  id: string;
  providerId: string;
  providerName: string;
  periodStart: string;
  periodEnd: string;
  totalPatients: number;
  consultationsCompleted: number;
  avgResponseTime: number | null;
  patientSatisfaction: number | null;
  avgWeightLoss: number | null;
  adherenceRate: number | null;
  prescriptionAccuracy: number | null;
  credentialScore: number | null;
  overallScore: number | null;
  createdAt: string;
}

interface CredentialAlert {
  id: string;
  providerId: string;
  providerName: string;
  licenseState: string;
  licenseType: string;
  expiresAt: string;
  isActive: boolean;
  isVerified: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

interface Provider {
  id: string;
  name: string;
  email: string;
}

interface Props {
  initialScorecards: Scorecard[];
  credentialAlerts: CredentialAlert[];
  providers: Provider[];
}

// ─── Component ─────────────────────────────────────────────────

export function ProviderScorecardsClient({
  initialScorecards,
  credentialAlerts,
  providers,
}: Props) {
  const [scorecards, setScorecards] = useState<Scorecard[]>(initialScorecards);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Date range for generation
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const [periodStart, setPeriodStart] = useState(
    thirtyDaysAgo.toISOString().slice(0, 10)
  );
  const [periodEnd, setPeriodEnd] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Comparison
  const [compareA, setCompareA] = useState("");
  const [compareB, setCompareB] = useState("");
  const [comparison, setComparison] = useState<{
    providerA: Scorecard | null;
    providerB: Scorecard | null;
  } | null>(null);

  // ─── Generate scorecards ────────────────────────────────────

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/provider-scorecards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodStart, periodEnd }),
      });
      const data = await res.json();
      if (data.rankings) {
        setScorecards(data.rankings);
      }
    } catch {
      // handle error silently
    }
    setLoading(false);
  }, [periodStart, periodEnd]);

  // ─── Comparison ─────────────────────────────────────────────

  const handleCompare = useCallback(async () => {
    if (!compareA || !compareB) return;
    try {
      const res = await fetch(
        `/api/admin/provider-scorecards?action=compare&providerIdA=${compareA}&providerIdB=${compareB}`
      );
      const data = await res.json();
      if (data.comparison) {
        setComparison(data.comparison);
      }
    } catch {
      // handle error silently
    }
  }, [compareA, compareB]);

  // ─── Score color helper ─────────────────────────────────────

  function scoreColor(score: number | null) {
    if (score == null) return "bg-gray-100 text-gray-600";
    if (score >= 80) return "bg-emerald-100 text-emerald-700";
    if (score >= 60) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  }

  function scoreBadge(score: number | null) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreColor(score)}`}
      >
        {score != null ? score.toFixed(1) : "N/A"}
      </span>
    );
  }

  // ─── Radar data for expanded row ────────────────────────────

  function getRadarData(sc: Scorecard) {
    return [
      {
        subject: "Patients",
        score: Math.min(100, sc.totalPatients * 10),
        fullMark: 100,
      },
      {
        subject: "Consultations",
        score: Math.min(100, sc.consultationsCompleted * 5),
        fullMark: 100,
      },
      {
        subject: "Satisfaction",
        score: sc.patientSatisfaction != null ? (sc.patientSatisfaction / 5) * 100 : 50,
        fullMark: 100,
      },
      {
        subject: "Weight Loss",
        score: sc.avgWeightLoss != null ? Math.min(100, sc.avgWeightLoss * 10) : 0,
        fullMark: 100,
      },
      {
        subject: "Adherence",
        score: sc.adherenceRate ?? 0,
        fullMark: 100,
      },
      {
        subject: "Credentials",
        score: sc.credentialScore ?? 0,
        fullMark: 100,
      },
    ];
  }

  // ─── KPI summary ───────────────────────────────────────────

  const avgOverall =
    scorecards.length > 0
      ? scorecards.reduce((s, sc) => s + (sc.overallScore ?? 0), 0) /
        scorecards.length
      : 0;
  const totalProviders = scorecards.length;
  const topPerformer = scorecards[0];
  const alertCount = credentialAlerts.length;

  // ─── Table columns ─────────────────────────────────────────

  const columns: ColumnDef<Scorecard & { rank: number }>[] = [
    {
      key: "rank",
      header: "#",
      sortable: true,
      className: "w-12",
      render: (row) => (
        <span className="font-bold text-navy">{row.rank}</span>
      ),
    },
    {
      key: "providerName",
      header: "Provider",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-navy">{row.providerName}</p>
          <p className="text-xs text-graphite-400">
            {new Date(row.periodStart).toLocaleDateString()} -{" "}
            {new Date(row.periodEnd).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "overallScore",
      header: "Overall",
      sortable: true,
      render: (row) => scoreBadge(row.overallScore),
    },
    {
      key: "totalPatients",
      header: "Patients",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-graphite-600">{row.totalPatients}</span>
      ),
    },
    {
      key: "consultationsCompleted",
      header: "Consults",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-graphite-600">
          {row.consultationsCompleted}
        </span>
      ),
    },
    {
      key: "patientSatisfaction",
      header: "Satisfaction",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-graphite-600">
          {row.patientSatisfaction != null
            ? `${row.patientSatisfaction.toFixed(1)}/5`
            : "--"}
        </span>
      ),
    },
    {
      key: "avgWeightLoss",
      header: "Avg Loss",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-graphite-600">
          {row.avgWeightLoss != null
            ? `${row.avgWeightLoss.toFixed(1)} lbs`
            : "--"}
        </span>
      ),
    },
    {
      key: "adherenceRate",
      header: "Adherence",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-graphite-600">
          {row.adherenceRate != null ? `${row.adherenceRate.toFixed(0)}%` : "--"}
        </span>
      ),
    },
    {
      key: "credentialScore",
      header: "Credentials",
      sortable: true,
      render: (row) => scoreBadge(row.credentialScore),
    },
    {
      key: "expand",
      header: "",
      className: "w-10",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpandedRow(expandedRow === row.id ? null : row.id);
          }}
          className="p-1 hover:bg-navy-50 rounded"
        >
          {expandedRow === row.id ? (
            <ChevronUp className="h-4 w-4 text-graphite-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-graphite-400" />
          )}
        </button>
      ),
    },
  ];

  const rankedScorecards = scorecards.map((sc, idx) => ({
    ...sc,
    rank: idx + 1,
  }));

  // ─── Comparison chart data ──────────────────────────────────

  function getComparisonData() {
    if (!comparison?.providerA || !comparison?.providerB) return [];
    const a = comparison.providerA;
    const b = comparison.providerB;
    return [
      {
        metric: "Overall",
        [a.providerName]: a.overallScore ?? 0,
        [b.providerName]: b.overallScore ?? 0,
      },
      {
        metric: "Patients",
        [a.providerName]: Math.min(100, a.totalPatients * 10),
        [b.providerName]: Math.min(100, b.totalPatients * 10),
      },
      {
        metric: "Adherence",
        [a.providerName]: a.adherenceRate ?? 0,
        [b.providerName]: b.adherenceRate ?? 0,
      },
      {
        metric: "Credentials",
        [a.providerName]: a.credentialScore ?? 0,
        [b.providerName]: b.credentialScore ?? 0,
      },
      {
        metric: "Weight Loss",
        [a.providerName]: a.avgWeightLoss != null ? Math.min(100, a.avgWeightLoss * 10) : 0,
        [b.providerName]: b.avgWeightLoss != null ? Math.min(100, b.avgWeightLoss * 10) : 0,
      },
    ];
  }

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Provider Scorecards</h1>
          <p className="text-sm text-graphite-400 mt-1">
            Performance metrics, rankings, and credential compliance for all providers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-graphite-400" />
            <Input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-36 text-sm"
            />
            <span className="text-graphite-400">to</span>
            <Input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-36 text-sm"
            />
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Generating..." : "Generate Scorecards"}
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Providers"
          value={String(totalProviders)}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Avg Overall Score"
          value={avgOverall.toFixed(1)}
          icon={BarChart3}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Top Performer"
          value={topPerformer?.providerName || "N/A"}
          icon={Award}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <KPICard
          title="Credential Alerts"
          value={String(alertCount)}
          icon={AlertTriangle}
          iconColor={alertCount > 0 ? "text-red-600" : "text-emerald-600"}
          iconBg={alertCount > 0 ? "bg-red-50" : "bg-emerald-50"}
        />
      </div>

      {/* Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Provider Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          {rankedScorecards.length === 0 ? (
            <div className="py-12 text-center text-graphite-300">
              <Stethoscope className="mx-auto mb-3 h-10 w-10 opacity-50" />
              <p>No scorecards generated yet.</p>
              <p className="text-sm mt-1">
                Select a date range and click &quot;Generate Scorecards&quot; to get started.
              </p>
            </div>
          ) : (
            <>
              <DataTable
                data={rankedScorecards.slice((page - 1) * 10, page * 10)}
                columns={columns}
                total={rankedScorecards.length}
                page={page}
                limit={10}
                onPageChange={setPage}
                getRowId={(row) => row.id}
                emptyMessage="No scorecards found"
              />

              {/* Expanded radar chart */}
              {expandedRow && (
                <div className="mt-4 rounded-xl border border-navy-100/60 bg-linen/20 p-6">
                  {(() => {
                    const sc = scorecards.find((s) => s.id === expandedRow);
                    if (!sc) return null;
                    const radarData = getRadarData(sc);
                    return (
                      <div>
                        <h3 className="text-base font-semibold text-navy mb-4">
                          {sc.providerName} — Dimension Breakdown
                        </h3>
                        <div className="flex justify-center">
                          <ResponsiveContainer width={400} height={300}>
                            <RadarChart data={radarData}>
                              <PolarGrid stroke="#e5e7eb" />
                              <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                              />
                              <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={{ fontSize: 10 }}
                              />
                              <Radar
                                name={sc.providerName}
                                dataKey="score"
                                stroke="#0d9488"
                                fill="#0d9488"
                                fillOpacity={0.25}
                                strokeWidth={2}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Provider Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Provider Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-xs font-medium text-graphite-400 uppercase tracking-wider mb-1 block">
                Provider A
              </label>
              <select
                value={compareA}
                onChange={(e) => setCompareA(e.target.value)}
                className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal"
              >
                <option value="">Select provider...</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center text-sm text-graphite-300 font-medium">vs</div>
            <div className="flex-1">
              <label className="text-xs font-medium text-graphite-400 uppercase tracking-wider mb-1 block">
                Provider B
              </label>
              <select
                value={compareB}
                onChange={(e) => setCompareB(e.target.value)}
                className="w-full rounded-lg border border-navy-200 bg-white px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal"
              >
                <option value="">Select provider...</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleCompare}
              disabled={!compareA || !compareB || compareA === compareB}
              variant="outline"
            >
              Compare
            </Button>
          </div>

          {comparison && (
            <div className="mt-6 space-y-6">
              {/* Side-by-side KPIs */}
              <div className="grid grid-cols-2 gap-4">
                {comparison.providerA && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-navy text-center">
                      {comparison.providerA.providerName}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-navy-50/50 p-3 text-center">
                        <p className="text-xs text-graphite-400">Overall</p>
                        <p className="text-lg font-bold text-navy">
                          {comparison.providerA.overallScore?.toFixed(1) ?? "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-navy-50/50 p-3 text-center">
                        <p className="text-xs text-graphite-400">Patients</p>
                        <p className="text-lg font-bold text-navy">
                          {comparison.providerA.totalPatients}
                        </p>
                      </div>
                      <div className="rounded-lg bg-navy-50/50 p-3 text-center">
                        <p className="text-xs text-graphite-400">Adherence</p>
                        <p className="text-lg font-bold text-navy">
                          {comparison.providerA.adherenceRate?.toFixed(0) ?? "N/A"}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-navy-50/50 p-3 text-center">
                        <p className="text-xs text-graphite-400">Credentials</p>
                        <p className="text-lg font-bold text-navy">
                          {comparison.providerA.credentialScore?.toFixed(0) ?? "N/A"}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {comparison.providerB && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-navy text-center">
                      {comparison.providerB.providerName}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-navy-50/50 p-3 text-center">
                        <p className="text-xs text-graphite-400">Overall</p>
                        <p className="text-lg font-bold text-navy">
                          {comparison.providerB.overallScore?.toFixed(1) ?? "N/A"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-navy-50/50 p-3 text-center">
                        <p className="text-xs text-graphite-400">Patients</p>
                        <p className="text-lg font-bold text-navy">
                          {comparison.providerB.totalPatients}
                        </p>
                      </div>
                      <div className="rounded-lg bg-navy-50/50 p-3 text-center">
                        <p className="text-xs text-graphite-400">Adherence</p>
                        <p className="text-lg font-bold text-navy">
                          {comparison.providerB.adherenceRate?.toFixed(0) ?? "N/A"}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-navy-50/50 p-3 text-center">
                        <p className="text-xs text-graphite-400">Credentials</p>
                        <p className="text-lg font-bold text-navy">
                          {comparison.providerB.credentialScore?.toFixed(0) ?? "N/A"}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Comparison bar chart */}
              {comparison.providerA && comparison.providerB && (
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getComparisonData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey={comparison.providerA.providerName}
                        fill="#0d9488"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey={comparison.providerB.providerName}
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credential Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-amber-600" />
            Credential Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {credentialAlerts.length === 0 ? (
            <div className="py-8 text-center text-graphite-300">
              <Shield className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>All provider credentials are current and verified.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {credentialAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-lg border border-navy-100/60 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        alert.isExpired
                          ? "bg-red-100"
                          : alert.isExpiringSoon
                            ? "bg-amber-100"
                            : "bg-gray-100"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-4 w-4 ${
                          alert.isExpired
                            ? "text-red-600"
                            : alert.isExpiringSoon
                              ? "text-amber-600"
                              : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">
                        {alert.providerName}
                      </p>
                      <p className="text-xs text-graphite-400">
                        {alert.licenseType} - {alert.licenseState}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.isExpired && (
                      <Badge variant="destructive">Expired</Badge>
                    )}
                    {alert.isExpiringSoon && !alert.isExpired && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                        Expiring Soon
                      </Badge>
                    )}
                    {!alert.isVerified && (
                      <Badge variant="outline">Unverified</Badge>
                    )}
                    {!alert.isActive && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    <span className="text-xs text-graphite-400">
                      {new Date(alert.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
