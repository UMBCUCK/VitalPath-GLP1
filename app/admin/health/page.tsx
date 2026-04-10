import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  runHealthChecks,
  getHealthHistory,
  getErrorLogs,
  getErrorStats,
  getPerformanceMetrics,
} from "@/lib/admin-health-monitor";
import { HealthClient } from "./health-client";

export default async function HealthPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [healthChecks, history, errorData, errorStats, performance] =
    await Promise.all([
      runHealthChecks(),
      getHealthHistory(undefined, 24),
      getErrorLogs({ page: 1, limit: 25 }),
      getErrorStats(),
      getPerformanceMetrics(),
    ]);

  // Group history by service for sparklines
  const serviceHistory: Record<string, { status: string; checkedAt: string }[]> = {};
  for (const h of history) {
    if (!serviceHistory[h.service]) serviceHistory[h.service] = [];
    serviceHistory[h.service].push({
      status: h.status,
      checkedAt: h.checkedAt.toISOString(),
    });
  }

  const serializedChecks = healthChecks.map((c) => ({
    id: c.id,
    service: c.service,
    status: c.status,
    responseTime: c.responseTime,
    errorMessage: c.errorMessage,
    checkedAt: c.checkedAt.toISOString(),
  }));

  const serializedLogs = errorData.logs.map((l) => ({
    id: l.id,
    route: l.route,
    method: l.method,
    statusCode: l.statusCode,
    message: l.message,
    userId: l.userId,
    duration: l.duration,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <HealthClient
      checks={serializedChecks}
      serviceHistory={serviceHistory}
      errorLogs={serializedLogs}
      errorTotal={errorData.total}
      errorStats={errorStats}
      performance={performance}
    />
  );
}
