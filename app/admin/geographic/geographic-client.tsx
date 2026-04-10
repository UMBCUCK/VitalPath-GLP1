"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/admin/kpi-card";
import {
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  Heart,
  AlertTriangle,
  MapPin,
  Stethoscope,
  ChevronRight,
  X,
  ArrowUpDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type {
  StateMetric,
  ExpansionOpportunity,
} from "@/lib/admin-geographic";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────

interface Props {
  stateMetrics: StateMetric[];
  expansionOpportunities: ExpansionOpportunity[];
}

type MetricType = "revenue" | "patients" | "churn" | "health";

// ── Helpers ────────────────────────────────────────────────────

function formatMetricValue(metric: MetricType, value: number): string {
  switch (metric) {
    case "revenue":
      return `$${Math.round(value / 100).toLocaleString()}`;
    case "patients":
      return value.toLocaleString();
    case "churn":
      return `${value}%`;
    case "health":
      return value.toString();
    default:
      return value.toString();
  }
}

function getMetricLabel(metric: MetricType): string {
  switch (metric) {
    case "revenue":
      return "Revenue";
    case "patients":
      return "Patients";
    case "churn":
      return "Churn Risk";
    case "health":
      return "Health Score";
    default:
      return metric;
  }
}

function getMetricFromState(state: StateMetric, metric: MetricType): number {
  switch (metric) {
    case "revenue":
      return state.revenue;
    case "patients":
      return state.patients;
    case "churn":
      return state.avgChurnRisk;
    case "health":
      return state.avgHealthScore;
    default:
      return 0;
  }
}

function getColorIntensity(
  value: number,
  max: number,
  metric: MetricType
): string {
  if (max === 0) return "bg-gray-50 text-gray-400";
  const ratio = value / max;

  // For churn, higher is worse (red). For others, higher is better (teal).
  if (metric === "churn") {
    if (ratio === 0) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (ratio < 0.25) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (ratio < 0.5) return "bg-orange-50 text-orange-700 border-orange-200";
    if (ratio < 0.75) return "bg-red-50 text-red-700 border-red-200";
    return "bg-red-100 text-red-800 border-red-300";
  }

  if (ratio === 0) return "bg-gray-50 text-gray-400 border-gray-200";
  if (ratio < 0.2) return "bg-teal-50 text-teal-600 border-teal-200";
  if (ratio < 0.4) return "bg-teal-100 text-teal-700 border-teal-300";
  if (ratio < 0.6) return "bg-teal-200 text-teal-800 border-teal-400";
  if (ratio < 0.8) return "bg-teal-300 text-teal-900 border-teal-500";
  return "bg-teal-400 text-white border-teal-600";
}

// ── Component ──────────────────────────────────────────────────

export function GeographicClient({
  stateMetrics,
  expansionOpportunities,
}: Props) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("revenue");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [compareA, setCompareA] = useState<string>("");
  const [compareB, setCompareB] = useState<string>("");

  // ── Derived data ───────────────────────────────────────────

  const maxMetricValue = useMemo(() => {
    if (stateMetrics.length === 0) return 1;
    return Math.max(
      ...stateMetrics.map((s) => getMetricFromState(s, selectedMetric)),
      1
    );
  }, [stateMetrics, selectedMetric]);

  const sortedByMetric = useMemo(() => {
    return [...stateMetrics].sort(
      (a, b) =>
        getMetricFromState(b, selectedMetric) -
        getMetricFromState(a, selectedMetric)
    );
  }, [stateMetrics, selectedMetric]);

  const topStates = sortedByMetric.slice(0, 5);
  const bottomStates = [...sortedByMetric].reverse().slice(0, 5);

  const selectedStateData = stateMetrics.find(
    (s) => s.stateCode === selectedState
  );

  const comparisonA = stateMetrics.find((s) => s.stateCode === compareA);
  const comparisonB = stateMetrics.find((s) => s.stateCode === compareB);

  // Totals for KPIs
  const totalPatients = stateMetrics.reduce((sum, s) => sum + s.patients, 0);
  const totalRevenue = stateMetrics.reduce((sum, s) => sum + s.revenue, 0);
  const totalSubscriptions = stateMetrics.reduce(
    (sum, s) => sum + s.subscriptions,
    0
  );
  const avgChurn =
    stateMetrics.length > 0
      ? Math.round(
          (stateMetrics.reduce((sum, s) => sum + s.avgChurnRisk, 0) /
            stateMetrics.length) *
            10
        ) / 10
      : 0;

  // Comparison chart data
  const comparisonChartData = useMemo(() => {
    if (!comparisonA || !comparisonB) return [];
    return [
      {
        metric: "Patients",
        [comparisonA.stateCode]: comparisonA.patients,
        [comparisonB.stateCode]: comparisonB.patients,
      },
      {
        metric: "Revenue ($)",
        [comparisonA.stateCode]: Math.round(comparisonA.revenue / 100),
        [comparisonB.stateCode]: Math.round(comparisonB.revenue / 100),
      },
      {
        metric: "Subscriptions",
        [comparisonA.stateCode]: comparisonA.subscriptions,
        [comparisonB.stateCode]: comparisonB.subscriptions,
      },
      {
        metric: "Providers",
        [comparisonA.stateCode]: comparisonA.providerCount,
        [comparisonB.stateCode]: comparisonB.providerCount,
      },
    ];
  }, [comparisonA, comparisonB]);

  return (
    <div className="space-y-6">
      {/* Header with metric selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">
            Geographic Intelligence
          </h1>
          <p className="mt-1 text-sm text-graphite-400">
            State-level patient distribution, revenue, and expansion
            opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-graphite-400">
            Color by:
          </span>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
            className="rounded-lg border border-navy-100/60 bg-white px-3 py-1.5 text-sm font-medium text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-teal/30"
          >
            <option value="revenue">Revenue</option>
            <option value="patients">Patients</option>
            <option value="churn">Churn Risk</option>
            <option value="health">Health Score</option>
          </select>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active States"
          value={stateMetrics.length.toString()}
          icon={Globe}
          iconColor="text-teal"
          iconBg="bg-teal-50"
        />
        <KPICard
          title="Total Patients"
          value={totalPatients.toLocaleString()}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <KPICard
          title="Total Revenue"
          value={`$${Math.round(totalRevenue / 100).toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <KPICard
          title="Active Subscriptions"
          value={totalSubscriptions.toLocaleString()}
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* US State Grid */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-navy">
            State Grid -- {getMetricLabel(selectedMetric)}
          </CardTitle>
          <p className="text-xs text-graphite-400">
            Click any state to view details. Color intensity reflects{" "}
            {getMetricLabel(selectedMetric).toLowerCase()}.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13">
            {stateMetrics.map((state) => {
              const value = getMetricFromState(state, selectedMetric);
              const colorClass = getColorIntensity(
                value,
                maxMetricValue,
                selectedMetric
              );
              const isSelected = selectedState === state.stateCode;

              return (
                <button
                  key={state.stateCode}
                  onClick={() =>
                    setSelectedState(
                      isSelected ? null : state.stateCode
                    )
                  }
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border p-2 transition-all hover:shadow-md",
                    colorClass,
                    isSelected && "ring-2 ring-navy ring-offset-1"
                  )}
                >
                  <span className="text-lg font-bold leading-none">
                    {state.stateCode}
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium leading-none">
                    {formatMetricValue(selectedMetric, value)}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* State Detail (expandable) */}
      {selectedStateData && (
        <Card className="border-teal/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                  <MapPin className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-navy">
                    {selectedStateData.stateName} ({selectedStateData.stateCode})
                  </CardTitle>
                  <p className="text-xs text-graphite-400">
                    Full state metrics and compliance details
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedState(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              <div className="rounded-lg bg-linen/30 p-3 text-center">
                <p className="text-xs text-graphite-400">Patients</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  {selectedStateData.patients}
                </p>
              </div>
              <div className="rounded-lg bg-linen/30 p-3 text-center">
                <p className="text-xs text-graphite-400">Revenue</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  ${Math.round(selectedStateData.revenue / 100).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-linen/30 p-3 text-center">
                <p className="text-xs text-graphite-400">Subscriptions</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  {selectedStateData.subscriptions}
                </p>
              </div>
              <div className="rounded-lg bg-linen/30 p-3 text-center">
                <p className="text-xs text-graphite-400">Churn Risk</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  {selectedStateData.avgChurnRisk}%
                </p>
              </div>
              <div className="rounded-lg bg-linen/30 p-3 text-center">
                <p className="text-xs text-graphite-400">Health Score</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  {selectedStateData.avgHealthScore}
                </p>
              </div>
              <div className="rounded-lg bg-linen/30 p-3 text-center">
                <p className="text-xs text-graphite-400">Providers</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  {selectedStateData.providerCount}
                </p>
              </div>
            </div>

            {/* Compliance notes */}
            <div className="mt-4 space-y-2">
              {selectedStateData.requiresPhysicalExam && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50/50 p-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-xs text-amber-700">
                    Requires physical exam
                  </span>
                </div>
              )}
              {selectedStateData.cpomRestrictions && (
                <div className="flex items-start gap-2 rounded-lg bg-blue-50/50 p-2">
                  <Stethoscope className="mt-0.5 h-4 w-4 text-blue-600" />
                  <span className="text-xs text-blue-700">
                    CPOM: {selectedStateData.cpomRestrictions}
                  </span>
                </div>
              )}
              {selectedStateData.prescriptiveAuthNotes && (
                <div className="flex items-start gap-2 rounded-lg bg-purple-50/50 p-2">
                  <Heart className="mt-0.5 h-4 w-4 text-purple-600" />
                  <span className="text-xs text-purple-700">
                    Prescriptive Auth: {selectedStateData.prescriptiveAuthNotes}
                  </span>
                </div>
              )}
              {selectedStateData.restrictions && (
                <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-graphite-400" />
                  <span className="text-xs text-graphite-500">
                    Restrictions: {selectedStateData.restrictions}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top / Bottom States */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-navy">
              Top 5 States by {getMetricLabel(selectedMetric)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topStates.map((state, i) => {
                const value = getMetricFromState(state, selectedMetric);
                return (
                  <div
                    key={state.stateCode}
                    className="flex items-center justify-between rounded-lg bg-linen/20 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-navy">
                          {state.stateName}
                        </p>
                        <p className="text-xs text-graphite-400">
                          {state.stateCode}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-navy">
                      {formatMetricValue(selectedMetric, value)}
                    </span>
                  </div>
                );
              })}
              {topStates.length === 0 && (
                <p className="py-4 text-center text-sm text-graphite-300">
                  No state data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-navy">
              Bottom 5 States by {getMetricLabel(selectedMetric)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bottomStates.map((state, i) => {
                const value = getMetricFromState(state, selectedMetric);
                return (
                  <div
                    key={state.stateCode}
                    className="flex items-center justify-between rounded-lg bg-linen/20 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                        {sortedByMetric.length - i}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-navy">
                          {state.stateName}
                        </p>
                        <p className="text-xs text-graphite-400">
                          {state.stateCode}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-navy">
                      {formatMetricValue(selectedMetric, value)}
                    </span>
                  </div>
                );
              })}
              {bottomStates.length === 0 && (
                <p className="py-4 text-center text-sm text-graphite-300">
                  No state data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expansion Opportunities */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-navy">
            Expansion Opportunities
          </CardTitle>
          <p className="text-xs text-graphite-400">
            Unavailable states ranked by demand signals (leads, quiz
            submissions, profiles)
          </p>
        </CardHeader>
        <CardContent>
          {expansionOpportunities.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-navy-100/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-linen/30">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-graphite-400">
                      State
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-graphite-400">
                      Leads
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-graphite-400">
                      Quiz Interest
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-graphite-400">
                      Potential
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-graphite-400">
                      Restrictions
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-graphite-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {expansionOpportunities.map((opp) => (
                    <tr
                      key={opp.stateCode}
                      className="transition-colors hover:bg-linen/20"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-navy">
                            {opp.stateName}
                          </p>
                          <p className="text-xs text-graphite-400">
                            {opp.stateCode}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {opp.leadCount}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {opp.quizInterest}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            opp.potentialPatients >= 10
                              ? "success"
                              : opp.potentialPatients >= 5
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {opp.potentialPatients}
                        </Badge>
                      </td>
                      <td className="max-w-[200px] px-4 py-3 text-xs text-graphite-400">
                        {opp.restrictions || "None noted"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" size="sm">
                          Enable State
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-graphite-300">
              No expansion opportunities found. All states with demand signals
              are already enabled.
            </div>
          )}
        </CardContent>
      </Card>

      {/* State Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <ArrowUpDown className="h-5 w-5 text-navy" />
            <div>
              <CardTitle className="text-base font-semibold text-navy">
                State Comparison
              </CardTitle>
              <p className="text-xs text-graphite-400">
                Select two states to compare side-by-side
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <select
              value={compareA}
              onChange={(e) => setCompareA(e.target.value)}
              className="rounded-lg border border-navy-100/60 bg-white px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/30"
            >
              <option value="">Select State A</option>
              {stateMetrics.map((s) => (
                <option key={s.stateCode} value={s.stateCode}>
                  {s.stateName} ({s.stateCode})
                </option>
              ))}
            </select>

            <span className="text-xs font-medium text-graphite-400">vs</span>

            <select
              value={compareB}
              onChange={(e) => setCompareB(e.target.value)}
              className="rounded-lg border border-navy-100/60 bg-white px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/30"
            >
              <option value="">Select State B</option>
              {stateMetrics.map((s) => (
                <option key={s.stateCode} value={s.stateCode}>
                  {s.stateName} ({s.stateCode})
                </option>
              ))}
            </select>
          </div>

          {comparisonA && comparisonB ? (
            <div className="space-y-4">
              {/* KPI comparison cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {(
                  [
                    {
                      label: "Patients",
                      a: comparisonA.patients,
                      b: comparisonB.patients,
                    },
                    {
                      label: "Revenue",
                      a: comparisonA.revenue,
                      b: comparisonB.revenue,
                      isCurrency: true,
                    },
                    {
                      label: "Subscriptions",
                      a: comparisonA.subscriptions,
                      b: comparisonB.subscriptions,
                    },
                    {
                      label: "Churn Risk",
                      a: comparisonA.avgChurnRisk,
                      b: comparisonB.avgChurnRisk,
                      isPercent: true,
                      invertColor: true,
                    },
                    {
                      label: "Health Score",
                      a: comparisonA.avgHealthScore,
                      b: comparisonB.avgHealthScore,
                    },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-navy-100/40 p-3"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wider text-graphite-400">
                      {item.label}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="text-center">
                        <p className="text-xs text-graphite-400">
                          {comparisonA.stateCode}
                        </p>
                        <p
                          className={cn(
                            "text-lg font-bold",
                            !("invertColor" in item && item.invertColor)
                              ? item.a >= item.b
                                ? "text-emerald-600"
                                : "text-navy"
                              : item.a <= item.b
                              ? "text-emerald-600"
                              : "text-red-600"
                          )}
                        >
                          {"isCurrency" in item && item.isCurrency
                            ? `$${Math.round(item.a / 100).toLocaleString()}`
                            : "isPercent" in item && item.isPercent
                            ? `${item.a}%`
                            : item.a.toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs text-graphite-300">vs</span>
                      <div className="text-center">
                        <p className="text-xs text-graphite-400">
                          {comparisonB.stateCode}
                        </p>
                        <p
                          className={cn(
                            "text-lg font-bold",
                            !("invertColor" in item && item.invertColor)
                              ? item.b >= item.a
                                ? "text-emerald-600"
                                : "text-navy"
                              : item.b <= item.a
                              ? "text-emerald-600"
                              : "text-red-600"
                          )}
                        >
                          {"isCurrency" in item && item.isCurrency
                            ? `$${Math.round(item.b / 100).toLocaleString()}`
                            : "isPercent" in item && item.isPercent
                            ? `${item.b}%`
                            : item.b.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison bar chart */}
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparisonChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="metric"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar
                    dataKey={comparisonA.stateCode}
                    name={comparisonA.stateName}
                    fill="#0d9488"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey={comparisonB.stateCode}
                    name={comparisonB.stateName}
                    fill="#7c3aed"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-graphite-300">
              Select two states above to see a side-by-side comparison
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
