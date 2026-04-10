import { db } from "@/lib/db";

// ─── Run Health Checks ─────────────────────────────────────────

interface HealthCheckData {
  service: string;
  status: string;
  responseTime: number | null;
  errorMessage: string | null;
  metadata: Record<string, unknown> | null;
}

export async function runHealthChecks() {
  const checks: HealthCheckData[] = [];

  // DATABASE
  const dbCheck = await checkDatabase();
  checks.push(dbCheck);

  // STRIPE
  checks.push(checkEnvKey("STRIPE", "STRIPE_SECRET_KEY"));

  // OPENLOOP
  checks.push(checkEnvKey("OPENLOOP", "TELEHEALTH_API_KEY"));

  // PHARMACY
  checks.push(checkEnvKey("PHARMACY", "PHARMACY_API_KEY"));

  // EMAIL
  checks.push(checkEnvKey("EMAIL", "RESEND_API_KEY"));

  // API self-check
  checks.push(await checkAPI());

  // Save all checks to database
  const saved = await Promise.all(
    checks.map((c) =>
      db.healthCheck.create({
        data: {
          service: c.service,
          status: c.status,
          responseTime: c.responseTime,
          errorMessage: c.errorMessage,
          metadata: c.metadata ? JSON.parse(JSON.stringify(c.metadata)) : undefined,
        },
      })
    )
  );

  return saved;
}

async function checkDatabase(): Promise<{
  service: string;
  status: string;
  responseTime: number | null;
  errorMessage: string | null;
  metadata: Record<string, unknown> | null;
}> {
  const start = Date.now();
  try {
    const count = await db.user.count();
    const elapsed = Date.now() - start;
    return {
      service: "DATABASE",
      status: elapsed > 5000 ? "DEGRADED" : "HEALTHY",
      responseTime: elapsed,
      errorMessage: null,
      metadata: { userCount: count },
    };
  } catch (err) {
    return {
      service: "DATABASE",
      status: "DOWN",
      responseTime: Date.now() - start,
      errorMessage: err instanceof Error ? err.message : "Unknown error",
      metadata: null,
    };
  }
}

function checkEnvKey(
  service: string,
  envVar: string
): {
  service: string;
  status: string;
  responseTime: number | null;
  errorMessage: string | null;
  metadata: Record<string, unknown> | null;
} {
  const value = process.env[envVar];
  if (value && value.length > 0) {
    return {
      service,
      status: "HEALTHY",
      responseTime: 0,
      errorMessage: null,
      metadata: { configured: true, keyLength: value.length },
    };
  }
  return {
    service,
    status: "DOWN",
    responseTime: null,
    errorMessage: `${envVar} is not configured`,
    metadata: { configured: false },
  };
}

async function checkAPI(): Promise<{
  service: string;
  status: string;
  responseTime: number | null;
  errorMessage: string | null;
  metadata: Record<string, unknown> | null;
}> {
  const start = Date.now();
  try {
    // Self-check: just verify the DB connection is alive (proxy for API health)
    await db.$queryRaw`SELECT 1`;
    const elapsed = Date.now() - start;
    return {
      service: "API",
      status: elapsed > 3000 ? "DEGRADED" : "HEALTHY",
      responseTime: elapsed,
      errorMessage: null,
      metadata: { selfCheck: true },
    };
  } catch (err) {
    return {
      service: "API",
      status: "DEGRADED",
      responseTime: Date.now() - start,
      errorMessage: err instanceof Error ? err.message : "Unknown error",
      metadata: null,
    };
  }
}

// ─── Health History ────────────────────────────────────────────

export async function getHealthHistory(
  service?: string,
  hours: number = 24
) {
  const since = new Date(Date.now() - hours * 3600000);

  const where: Record<string, unknown> = {
    checkedAt: { gte: since },
  };
  if (service) where.service = service;

  return db.healthCheck.findMany({
    where,
    orderBy: { checkedAt: "desc" },
    take: 500,
  });
}

// ─── Error Logs ────────────────────────────────────────────────

export async function getErrorLogs(opts: {
  page?: number;
  limit?: number;
  route?: string;
  statusCode?: number;
  from?: Date;
  to?: Date;
}) {
  const page = opts.page ?? 1;
  const limit = opts.limit ?? 25;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (opts.route) where.route = { contains: opts.route };
  if (opts.statusCode) where.statusCode = opts.statusCode;
  if (opts.from || opts.to) {
    where.createdAt = {};
    if (opts.from) (where.createdAt as Record<string, unknown>).gte = opts.from;
    if (opts.to) (where.createdAt as Record<string, unknown>).lte = opts.to;
  }

  const [logs, total] = await Promise.all([
    db.errorLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.errorLog.count({ where }),
  ]);

  return { logs, total, page, limit };
}

// ─── Error Stats ───────────────────────────────────────────────

export async function getErrorStats(from?: Date, to?: Date) {
  const now = new Date();
  const since = from ?? new Date(now.getTime() - 24 * 3600000);
  const until = to ?? now;

  const where = {
    createdAt: { gte: since, lte: until },
  };

  const [totalErrors, byRoute, byStatusCode] = await Promise.all([
    db.errorLog.count({ where }),
    db.errorLog.groupBy({
      by: ["route"],
      where,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    db.errorLog.groupBy({
      by: ["statusCode"],
      where,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  const topErrorRoute = byRoute[0]?.route ?? "N/A";
  const topErrorCount = byRoute[0]?._count.id ?? 0;

  // Most common error message
  const topMessage = await db.errorLog.groupBy({
    by: ["message"],
    where,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });

  return {
    totalErrors,
    topErrorRoute,
    topErrorCount,
    mostCommonError: topMessage[0]?.message ?? "N/A",
    byRoute: byRoute.map((r) => ({
      route: r.route,
      count: r._count.id,
    })),
    byStatusCode: byStatusCode.map((r) => ({
      statusCode: r.statusCode,
      count: r._count.id,
    })),
  };
}

// ─── Performance Metrics ───────────────────────────────────────

export async function getPerformanceMetrics() {
  // Get response times from error logs (which log all requests with duration)
  const routePerf = await db.errorLog.groupBy({
    by: ["route"],
    where: { duration: { not: null } },
    _avg: { duration: true },
    _count: { id: true },
    orderBy: { _avg: { duration: "desc" } },
    take: 20,
  });

  // Get all durations for percentile estimates
  const allDurations = await db.errorLog.findMany({
    where: { duration: { not: null } },
    select: { duration: true },
    orderBy: { duration: "asc" },
    take: 1000,
  });

  const durations = allDurations
    .map((d) => d.duration)
    .filter((d): d is number => d !== null)
    .sort((a, b) => a - b);

  const p50 = durations.length > 0 ? durations[Math.floor(durations.length * 0.5)] : 0;
  const p95 = durations.length > 0 ? durations[Math.floor(durations.length * 0.95)] : 0;
  const p99 = durations.length > 0 ? durations[Math.floor(durations.length * 0.99)] : 0;

  // Health check response times
  const healthPerf = await db.healthCheck.groupBy({
    by: ["service"],
    where: { responseTime: { not: null } },
    _avg: { responseTime: true },
    _max: { responseTime: true },
    _count: { id: true },
  });

  return {
    routes: routePerf.map((r) => ({
      route: r.route,
      avgDuration: Math.round(r._avg.duration ?? 0),
      requestCount: r._count.id,
    })),
    percentiles: { p50, p95, p99 },
    servicePerformance: healthPerf.map((h) => ({
      service: h.service,
      avgResponseTime: Math.round(h._avg.responseTime ?? 0),
      maxResponseTime: h._max.responseTime ?? 0,
      checkCount: h._count.id,
    })),
  };
}
