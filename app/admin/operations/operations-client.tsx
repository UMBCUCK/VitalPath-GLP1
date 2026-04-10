"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KPICard } from "@/components/admin/kpi-card";
import {
  Clock,
  CreditCard,
  Webhook,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import type { OperationsMetrics } from "@/lib/admin-operations";

interface Props {
  metrics: OperationsMetrics;
}

export function OperationsClient({ metrics }: Props) {
  const intakePass = metrics.intakeAvgHours <= 24;
  const paymentPass = metrics.paymentSuccessRate >= 80;
  const webhookPass = metrics.webhookSuccessRate >= 95;
  const coverageRate =
    metrics.providerCoverage.total > 0
      ? Math.round(
          (metrics.providerCoverage.covered / metrics.providerCoverage.total) * 100
        )
      : 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Operations Dashboard</h2>
        <p className="text-sm text-graphite-400">
          SLA monitoring, system health, and provider coverage
        </p>
      </div>

      {/* SLA breach banner */}
      {metrics.slaBreaches.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/40 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              {metrics.slaBreaches.length} SLA{" "}
              {metrics.slaBreaches.length === 1 ? "Breach" : "Breaches"} Detected
            </p>
            <div className="mt-2 space-y-1">
              {metrics.slaBreaches.map((breach) => (
                <div
                  key={breach.metric}
                  className="flex items-center gap-2 text-sm text-red-700"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>
                    <span className="font-medium">{breach.metric}:</span>{" "}
                    {breach.metric.includes("Time")
                      ? `${breach.current}h (threshold: ${breach.threshold}h)`
                      : `${breach.current}% (threshold: ${breach.threshold}%)`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No breaches */}
      {metrics.slaBreaches.length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">
            All SLA thresholds are within acceptable limits
          </p>
        </div>
      )}

      {/* SLA KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <KPICard
            title="Intake Review Time"
            value={`${metrics.intakeAvgHours}h`}
            icon={Clock}
            iconColor={intakePass ? "text-emerald-600" : "text-red-500"}
            iconBg={intakePass ? "bg-emerald-50" : "bg-red-50"}
          />
          <div className="absolute top-3 right-3">
            {intakePass ? (
              <Badge variant="success" className="text-[10px]">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                PASS
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px]">
                <XCircle className="mr-1 h-3 w-3" />
                FAIL
              </Badge>
            )}
          </div>
          <p className="mt-1 px-5 pb-2 text-[10px] text-graphite-400">
            Threshold: &le;24h
          </p>
        </div>

        <div className="relative">
          <KPICard
            title="Payment Success"
            value={`${metrics.paymentSuccessRate}%`}
            icon={CreditCard}
            iconColor={paymentPass ? "text-emerald-600" : "text-red-500"}
            iconBg={paymentPass ? "bg-emerald-50" : "bg-red-50"}
          />
          <div className="absolute top-3 right-3">
            {paymentPass ? (
              <Badge variant="success" className="text-[10px]">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                PASS
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px]">
                <XCircle className="mr-1 h-3 w-3" />
                FAIL
              </Badge>
            )}
          </div>
          <p className="mt-1 px-5 pb-2 text-[10px] text-graphite-400">
            Threshold: &ge;80%
          </p>
        </div>

        <div className="relative">
          <KPICard
            title="Webhook Success"
            value={`${metrics.webhookSuccessRate}%`}
            icon={Webhook}
            iconColor={webhookPass ? "text-emerald-600" : "text-red-500"}
            iconBg={webhookPass ? "bg-emerald-50" : "bg-red-50"}
          />
          <div className="absolute top-3 right-3">
            {webhookPass ? (
              <Badge variant="success" className="text-[10px]">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                PASS
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px]">
                <XCircle className="mr-1 h-3 w-3" />
                FAIL
              </Badge>
            )}
          </div>
          <p className="mt-1 px-5 pb-2 text-[10px] text-graphite-400">
            Threshold: &ge;95%
          </p>
        </div>

        <div className="relative">
          <KPICard
            title="Provider Coverage"
            value={`${metrics.providerCoverage.covered}/${metrics.providerCoverage.total}`}
            icon={MapPin}
            iconColor={coverageRate >= 80 ? "text-emerald-600" : "text-amber-500"}
            iconBg={coverageRate >= 80 ? "bg-emerald-50" : "bg-amber-50"}
          />
          <div className="absolute top-3 right-3">
            <Badge
              variant={coverageRate >= 80 ? "success" : "warning"}
              className="text-[10px]"
            >
              {coverageRate}%
            </Badge>
          </div>
          <p className="mt-1 px-5 pb-2 text-[10px] text-graphite-400">
            States with active providers
          </p>
        </div>
      </div>

      {/* Provider coverage grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-teal" />
            Provider Coverage by State
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.providerCoverage.total === 0 ? (
            <p className="py-8 text-center text-sm text-graphite-300">
              No available states configured
            </p>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-4 text-xs text-graphite-400">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-emerald-100 border border-emerald-300" />
                  <span>Covered ({metrics.providerCoverage.covered})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-red-100 border border-red-300" />
                  <span>
                    Uncovered ({metrics.providerCoverage.uncoveredStates.length})
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {metrics.providerCoverage.uncoveredStates.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    All {metrics.providerCoverage.total} available states have
                    active provider coverage
                  </div>
                ) : (
                  <>
                    <div className="w-full mb-2">
                      <p className="text-sm font-medium text-navy mb-2">
                        Uncovered States
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {metrics.providerCoverage.uncoveredStates.map(
                          (state) => (
                            <div
                              key={state}
                              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                            >
                              <XCircle className="h-3 w-3" />
                              {state}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <p className="text-sm font-medium text-navy mb-2">
                        Covered States
                      </p>
                      <p className="text-xs text-graphite-400">
                        {metrics.providerCoverage.covered} of{" "}
                        {metrics.providerCoverage.total} available states have
                        active provider credentials
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
