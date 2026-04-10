import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────

type ReportType = "AGGREGATE" | "PROVIDER" | "MEDICATION" | "PLAN" | "PUBLISHABLE";

interface OutcomeMetrics {
  avgWeightLoss: number;
  avgWeightLossPct: number;
  patientsWithWeightLoss: number;
  totalPatients: number;
  avgHealthScore: number | null;
  avgAdherence: number | null;
  retentionRate: number;
}

// ─── Generate outcome report ─────────────────────────────────

export async function generateOutcomeReport(
  reportType: ReportType,
  periodStart: Date,
  periodEnd: Date,
  generatedBy: string
) {
  const metrics = await computeMetrics(periodStart, periodEnd);

  let breakdown: Record<string, OutcomeMetrics> | null = null;

  if (reportType === "PLAN") {
    breakdown = await computeBreakdownByPlan(periodStart, periodEnd);
  } else if (reportType === "MEDICATION") {
    breakdown = await computeBreakdownByMedication(periodStart, periodEnd);
  } else if (reportType === "PROVIDER") {
    breakdown = await computeBreakdownByProvider(periodStart, periodEnd);
  }

  const title = buildTitle(reportType, periodStart, periodEnd);

  const report = await db.outcomeReport.create({
    data: {
      title,
      reportType,
      periodStart,
      periodEnd,
      metrics: JSON.parse(JSON.stringify(metrics)),
      breakdown: breakdown ? JSON.parse(JSON.stringify(breakdown)) : undefined,
      isPublishable: false,
      complianceApproved: false,
      generatedBy,
    },
  });

  return report;
}

// ─── List reports ───────────────────────────────────────────

export async function getOutcomeReports(
  page = 1,
  limit = 20,
  reportType?: string
) {
  const where = reportType ? { reportType } : {};

  const [reports, total] = await Promise.all([
    db.outcomeReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.outcomeReport.count({ where }),
  ]);

  return { reports, total, page, limit };
}

// ─── Approve for publishing ──────────────────────────────────

export async function approveForPublishing(id: string, approvedBy: string) {
  return db.outcomeReport.update({
    where: { id },
    data: {
      isPublishable: true,
      complianceApproved: true,
      approvedBy,
    },
  });
}

// ─── Quick KPI summary from latest aggregate ─────────────────

export async function getOutcomeSummary() {
  const latest = await db.outcomeReport.findFirst({
    where: { reportType: "AGGREGATE" },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) {
    return {
      avgWeightLoss: 0,
      avgWeightLossPct: 0,
      patientsWithWeightLoss: 0,
      totalPatients: 0,
      avgHealthScore: 0,
      avgAdherence: 0,
      retentionRate: 0,
      reportDate: null,
    };
  }

  const m = latest.metrics as unknown as OutcomeMetrics;
  return {
    avgWeightLoss: m.avgWeightLoss ?? 0,
    avgWeightLossPct: m.avgWeightLossPct ?? 0,
    patientsWithWeightLoss: m.patientsWithWeightLoss ?? 0,
    totalPatients: m.totalPatients ?? 0,
    avgHealthScore: m.avgHealthScore ?? 0,
    avgAdherence: m.avgAdherence ?? 0,
    retentionRate: m.retentionRate ?? 0,
    reportDate: latest.createdAt,
  };
}

// ─── Internal helpers ───────────────────────────────────────

function buildTitle(type: ReportType, start: Date, end: Date): string {
  const s = start.toISOString().slice(0, 10);
  const e = end.toISOString().slice(0, 10);
  const labels: Record<ReportType, string> = {
    AGGREGATE: "Aggregate Outcome Report",
    PLAN: "Plan Breakdown Report",
    MEDICATION: "Medication Breakdown Report",
    PROVIDER: "Provider Breakdown Report",
    PUBLISHABLE: "Publishable Outcome Report",
  };
  return `${labels[type]} (${s} to ${e})`;
}

async function computeMetrics(
  periodStart: Date,
  periodEnd: Date
): Promise<OutcomeMetrics> {
  // Get all users with progress entries in the period
  const entries = await db.progressEntry.findMany({
    where: {
      date: { gte: periodStart, lte: periodEnd },
      weightLbs: { not: null },
    },
    orderBy: { date: "asc" },
    select: { userId: true, weightLbs: true, date: true },
  });

  // Group entries by user
  const byUser = new Map<string, { first: number; last: number }>();
  for (const e of entries) {
    if (e.weightLbs == null) continue;
    const existing = byUser.get(e.userId);
    if (!existing) {
      byUser.set(e.userId, { first: e.weightLbs, last: e.weightLbs });
    } else {
      existing.last = e.weightLbs;
    }
  }

  const totalPatients = byUser.size;
  let totalLoss = 0;
  let totalLossPct = 0;
  let patientsWithWeightLoss = 0;

  for (const [, v] of byUser) {
    const loss = v.first - v.last;
    totalLoss += loss;
    totalLossPct += v.first > 0 ? (loss / v.first) * 100 : 0;
    if (loss > 0) patientsWithWeightLoss++;
  }

  // Avg health score
  const healthScores = await db.patientProfile.aggregate({
    _avg: { healthScore: true },
    where: { healthScore: { not: null } },
  });

  // Avg adherence
  const adherence = await db.dosageSchedule.aggregate({
    _avg: { adherenceRate: true },
    where: { adherenceRate: { not: null }, status: "ACTIVE" },
  });

  // Retention: subs active at end vs those active at start
  const [subsStart, subsEnd] = await Promise.all([
    db.subscription.count({
      where: {
        status: "ACTIVE",
        createdAt: { lte: periodStart },
      },
    }),
    db.subscription.count({
      where: {
        status: "ACTIVE",
        createdAt: { lte: periodEnd },
      },
    }),
  ]);
  const retentionRate = subsStart > 0 ? Math.round((subsEnd / subsStart) * 100) : 100;

  return {
    avgWeightLoss: totalPatients > 0 ? Math.round((totalLoss / totalPatients) * 10) / 10 : 0,
    avgWeightLossPct: totalPatients > 0 ? Math.round((totalLossPct / totalPatients) * 10) / 10 : 0,
    patientsWithWeightLoss,
    totalPatients,
    avgHealthScore: healthScores._avg.healthScore
      ? Math.round(healthScores._avg.healthScore)
      : null,
    avgAdherence: adherence._avg.adherenceRate
      ? Math.round(adherence._avg.adherenceRate * 10) / 10
      : null,
    retentionRate,
  };
}

async function computeBreakdownByPlan(
  periodStart: Date,
  periodEnd: Date
): Promise<Record<string, OutcomeMetrics>> {
  // Get subscriptions with products
  const subs = await db.subscription.findMany({
    where: { status: "ACTIVE" },
    select: {
      userId: true,
      items: { select: { product: { select: { name: true } } } },
    },
  });

  const userPlanMap = new Map<string, string>();
  for (const sub of subs) {
    const planName = sub.items[0]?.product?.name ?? "Unknown";
    userPlanMap.set(sub.userId, planName);
  }

  return computeGroupedMetrics(periodStart, periodEnd, userPlanMap);
}

async function computeBreakdownByMedication(
  periodStart: Date,
  periodEnd: Date
): Promise<Record<string, OutcomeMetrics>> {
  const schedules = await db.dosageSchedule.findMany({
    where: { status: "ACTIVE" },
    select: { userId: true, medicationName: true },
  });

  const userMedMap = new Map<string, string>();
  for (const s of schedules) {
    userMedMap.set(s.userId, s.medicationName);
  }

  return computeGroupedMetrics(periodStart, periodEnd, userMedMap);
}

async function computeBreakdownByProvider(
  periodStart: Date,
  periodEnd: Date
): Promise<Record<string, OutcomeMetrics>> {
  const plans = await db.treatmentPlan.findMany({
    where: { providerName: { not: null } },
    select: { userId: true, providerName: true },
  });

  const userProviderMap = new Map<string, string>();
  for (const p of plans) {
    if (p.providerName) userProviderMap.set(p.userId, p.providerName);
  }

  return computeGroupedMetrics(periodStart, periodEnd, userProviderMap);
}

async function computeGroupedMetrics(
  periodStart: Date,
  periodEnd: Date,
  userGroupMap: Map<string, string>
): Promise<Record<string, OutcomeMetrics>> {
  const entries = await db.progressEntry.findMany({
    where: {
      date: { gte: periodStart, lte: periodEnd },
      weightLbs: { not: null },
    },
    orderBy: { date: "asc" },
    select: { userId: true, weightLbs: true, date: true },
  });

  // Group entries by user
  const byUser = new Map<string, { first: number; last: number }>();
  for (const e of entries) {
    if (e.weightLbs == null) continue;
    const existing = byUser.get(e.userId);
    if (!existing) {
      byUser.set(e.userId, { first: e.weightLbs, last: e.weightLbs });
    } else {
      existing.last = e.weightLbs;
    }
  }

  // Group by plan/med/provider
  const groups = new Map<string, { losses: number[]; lossPcts: number[]; lossCount: number; total: number }>();

  for (const [userId, v] of byUser) {
    const group = userGroupMap.get(userId) ?? "Unknown";
    if (!groups.has(group)) {
      groups.set(group, { losses: [], lossPcts: [], lossCount: 0, total: 0 });
    }
    const g = groups.get(group)!;
    const loss = v.first - v.last;
    g.losses.push(loss);
    g.lossPcts.push(v.first > 0 ? (loss / v.first) * 100 : 0);
    if (loss > 0) g.lossCount++;
    g.total++;
  }

  const result: Record<string, OutcomeMetrics> = {};
  for (const [group, g] of groups) {
    const avgLoss = g.losses.length > 0
      ? Math.round((g.losses.reduce((a, b) => a + b, 0) / g.losses.length) * 10) / 10
      : 0;
    const avgPct = g.lossPcts.length > 0
      ? Math.round((g.lossPcts.reduce((a, b) => a + b, 0) / g.lossPcts.length) * 10) / 10
      : 0;
    result[group] = {
      avgWeightLoss: avgLoss,
      avgWeightLossPct: avgPct,
      patientsWithWeightLoss: g.lossCount,
      totalPatients: g.total,
      avgHealthScore: null,
      avgAdherence: null,
      retentionRate: 0,
    };
  }

  return result;
}
