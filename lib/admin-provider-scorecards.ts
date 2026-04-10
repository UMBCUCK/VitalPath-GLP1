import { db } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────────────

export interface ScorecardResult {
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

// ─── Weighted score computation ────────────────────────────────

const WEIGHTS = {
  patients: 0.15,
  consultations: 0.20,
  satisfaction: 0.20,
  weightLoss: 0.15,
  adherence: 0.15,
  credentials: 0.15,
};

function computeOverallScore(metrics: {
  patientsScore: number;
  consultationsScore: number;
  satisfaction: number | null;
  weightLossScore: number;
  adherenceRate: number | null;
  credentialScore: number | null;
}): number {
  // Normalize: satisfaction is 0-5 -> 0-100, others are already 0-100 or scored
  const satisfactionNorm = metrics.satisfaction != null ? (metrics.satisfaction / 5) * 100 : 50;
  const adherenceNorm = metrics.adherenceRate ?? 50;
  const credentialNorm = metrics.credentialScore ?? 50;

  const score =
    metrics.patientsScore * WEIGHTS.patients +
    metrics.consultationsScore * WEIGHTS.consultations +
    satisfactionNorm * WEIGHTS.satisfaction +
    metrics.weightLossScore * WEIGHTS.weightLoss +
    adherenceNorm * WEIGHTS.adherence +
    credentialNorm * WEIGHTS.credentials;

  return Math.round(Math.min(100, Math.max(0, score)) * 10) / 10;
}

// ─── Generate scorecard for a single provider ──────────────────

export async function generateProviderScorecard(
  providerId: string,
  periodStart: Date,
  periodEnd: Date
) {
  // 1. Find the provider
  const provider = await db.user.findUnique({
    where: { id: providerId },
    select: { id: true, firstName: true, lastName: true },
  });
  if (!provider) throw new Error("Provider not found");

  const providerName = [provider.firstName, provider.lastName].filter(Boolean).join(" ") || "Unknown";

  // 2. Count patients via TreatmentPlan where providerName matches
  const treatmentPlans = await db.treatmentPlan.findMany({
    where: {
      providerName: { contains: providerName },
      createdAt: { gte: periodStart, lte: periodEnd },
    },
    select: { userId: true },
  });
  const uniquePatientIds = [...new Set(treatmentPlans.map((tp) => tp.userId))];
  const totalPatients = uniquePatientIds.length;

  // 3. Consultations completed
  const consultationsCompleted = await db.consultationTracker.count({
    where: {
      providerName: { contains: providerName },
      status: "COMPLETED",
      completedAt: { gte: periodStart, lte: periodEnd },
    },
  });

  // 4. Avg weight loss for provider's patients
  let avgWeightLoss: number | null = null;
  if (uniquePatientIds.length > 0) {
    const weightLosses: number[] = [];
    for (const patientId of uniquePatientIds) {
      const entries = await db.progressEntry.findMany({
        where: {
          userId: patientId,
          weightLbs: { not: null },
          date: { gte: periodStart, lte: periodEnd },
        },
        orderBy: { date: "asc" },
        select: { weightLbs: true },
      });
      if (entries.length >= 2) {
        const first = entries[0].weightLbs!;
        const last = entries[entries.length - 1].weightLbs!;
        const loss = first - last;
        if (loss > 0) weightLosses.push(loss);
      }
    }
    if (weightLosses.length > 0) {
      avgWeightLoss =
        Math.round(
          (weightLosses.reduce((a, b) => a + b, 0) / weightLosses.length) * 10
        ) / 10;
    }
  }

  // 5. Adherence rate: avg from DosageSchedule
  let adherenceRate: number | null = null;
  if (uniquePatientIds.length > 0) {
    const schedules = await db.dosageSchedule.findMany({
      where: {
        userId: { in: uniquePatientIds },
        adherenceRate: { not: null },
      },
      select: { adherenceRate: true },
    });
    if (schedules.length > 0) {
      adherenceRate =
        Math.round(
          (schedules.reduce((sum, s) => sum + (s.adherenceRate ?? 0), 0) /
            schedules.length) *
            10
        ) / 10;
    }
  }

  // 6. Credential score: % of active and verified credentials
  const allCredentials = await db.providerCredential.findMany({
    where: { userId: providerId },
    select: { isActive: true, verifiedAt: true, expiresAt: true },
  });
  let credentialScore: number | null = null;
  if (allCredentials.length > 0) {
    const now = new Date();
    const validCount = allCredentials.filter(
      (c) => c.isActive && c.verifiedAt != null && new Date(c.expiresAt) > now
    ).length;
    credentialScore = Math.round((validCount / allCredentials.length) * 100 * 10) / 10;
  }

  // 7. Compute dimension scores for overall
  // Patients score: scale based on count (10+ patients = 100)
  const patientsScore = Math.min(100, totalPatients * 10);
  // Consultations score: scale based on count (20+ = 100)
  const consultationsScore = Math.min(100, consultationsCompleted * 5);
  // Weight loss score: scale lbs (10+ lbs avg = 100)
  const weightLossScore = avgWeightLoss != null ? Math.min(100, avgWeightLoss * 10) : 0;

  const overallScore = computeOverallScore({
    patientsScore,
    consultationsScore,
    satisfaction: null, // no satisfaction data in current schema
    weightLossScore,
    adherenceRate,
    credentialScore,
  });

  // 8. Upsert the scorecard
  const existing = await db.providerScorecard.findFirst({
    where: {
      providerId,
      periodStart,
      periodEnd,
    },
  });

  const data = {
    providerId,
    periodStart,
    periodEnd,
    totalPatients,
    consultationsCompleted,
    avgResponseTime: null,
    patientSatisfaction: null,
    avgWeightLoss,
    adherenceRate,
    prescriptionAccuracy: null,
    credentialScore,
    overallScore,
  };

  let scorecard;
  if (existing) {
    scorecard = await db.providerScorecard.update({
      where: { id: existing.id },
      data,
    });
  } else {
    scorecard = await db.providerScorecard.create({ data });
  }

  return scorecard;
}

// ─── Get scorecards with optional provider filter ──────────────

export async function getProviderScorecards(providerId?: string) {
  const where = providerId ? { providerId } : {};

  const scorecards = await db.providerScorecard.findMany({
    where,
    orderBy: [{ periodEnd: "desc" }, { overallScore: "desc" }],
  });

  // Attach provider names
  const providerIds = [...new Set(scorecards.map((s) => s.providerId))];
  const providers = await db.user.findMany({
    where: { id: { in: providerIds } },
    select: { id: true, firstName: true, lastName: true },
  });
  const providerMap = new Map(
    providers.map((p) => [
      p.id,
      [p.firstName, p.lastName].filter(Boolean).join(" ") || "Unknown",
    ])
  );

  return scorecards.map((s) => ({
    ...s,
    providerName: providerMap.get(s.providerId) || "Unknown",
    periodStart: s.periodStart.toISOString(),
    periodEnd: s.periodEnd.toISOString(),
    createdAt: s.createdAt.toISOString(),
  }));
}

// ─── Generate and rank all providers ───────────────────────────

export async function getAllProviderRankings(periodStart: Date, periodEnd: Date) {
  const providers = await db.user.findMany({
    where: { role: "PROVIDER" },
    select: { id: true, firstName: true, lastName: true },
  });

  const scorecards: ScorecardResult[] = [];

  for (const provider of providers) {
    try {
      const sc = await generateProviderScorecard(provider.id, periodStart, periodEnd);
      scorecards.push({
        ...sc,
        providerName: [provider.firstName, provider.lastName].filter(Boolean).join(" ") || "Unknown",
        periodStart: sc.periodStart.toISOString(),
        periodEnd: sc.periodEnd.toISOString(),
        createdAt: sc.createdAt.toISOString(),
      });
    } catch {
      // Skip providers that fail
    }
  }

  // Sort by overall score descending
  scorecards.sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0));

  return scorecards;
}

// ─── Side-by-side comparison ───────────────────────────────────

export async function getProviderComparison(
  providerIdA: string,
  providerIdB: string
) {
  const [scorecardsA, scorecardsB] = await Promise.all([
    getProviderScorecards(providerIdA),
    getProviderScorecards(providerIdB),
  ]);

  return {
    providerA: scorecardsA[0] || null,
    providerB: scorecardsB[0] || null,
  };
}

// ─── Credential alerts ────────────────────────────────────────

export async function getCredentialAlerts() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringCredentials = await db.providerCredential.findMany({
    where: {
      OR: [
        { expiresAt: { lte: thirtyDaysFromNow } },
        { isActive: false },
        { verifiedAt: null },
      ],
    },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { expiresAt: "asc" },
  });

  return expiringCredentials.map((c) => ({
    id: c.id,
    providerId: c.userId,
    providerName:
      [c.user.firstName, c.user.lastName].filter(Boolean).join(" ") || c.user.email,
    licenseState: c.licenseState,
    licenseType: c.licenseType,
    expiresAt: c.expiresAt.toISOString(),
    isActive: c.isActive,
    isVerified: c.verifiedAt != null,
    isExpired: new Date(c.expiresAt) < new Date(),
    isExpiringSoon:
      new Date(c.expiresAt) > new Date() &&
      new Date(c.expiresAt) <= thirtyDaysFromNow,
  }));
}
