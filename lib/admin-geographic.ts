import { db } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────

export interface StateMetric {
  stateCode: string;
  stateName: string;
  patients: number;
  revenue: number;
  subscriptions: number;
  avgChurnRisk: number;
  avgHealthScore: number;
  providerCount: number;
  restrictions: string | null;
  requiresPhysicalExam: boolean;
  cpomRestrictions: string | null;
  prescriptiveAuthNotes: string | null;
}

export interface StateComparison {
  stateA: StateMetric | null;
  stateB: StateMetric | null;
}

export interface ExpansionOpportunity {
  stateCode: string;
  stateName: string;
  leadCount: number;
  quizInterest: number;
  potentialPatients: number;
  restrictions: string | null;
}

export type HeatMapMetric = "revenue" | "patients" | "churn" | "health";

export interface HeatMapEntry {
  stateCode: string;
  value: number;
}

// ── Helper: build state metrics from raw data ──────────────────

async function buildStateMetric(
  stateCode: string,
  stateName: string,
  stateInfo: {
    restrictions: string | null;
    requiresPhysicalExam: boolean;
    cpomRestrictions: string | null;
    prescriptiveAuthNotes: string | null;
  }
): Promise<StateMetric> {
  // Get patients in this state
  const profiles = await db.patientProfile.findMany({
    where: { state: stateCode },
    select: {
      userId: true,
      churnRisk: true,
      healthScore: true,
    },
  });

  const patientCount = profiles.length;
  const userIds = profiles.map((p) => p.userId);

  // Revenue from orders by users in this state
  const revenueAgg = userIds.length > 0
    ? await db.order.aggregate({
        where: { userId: { in: userIds } },
        _sum: { totalCents: true },
      })
    : { _sum: { totalCents: null } };

  // Active subscriptions
  const subscriptionCount = userIds.length > 0
    ? await db.subscription.count({
        where: {
          userId: { in: userIds },
          status: { in: ["ACTIVE", "TRIALING"] },
        },
      })
    : 0;

  // Average churn risk
  const churnValues = profiles
    .filter((p) => p.churnRisk !== null)
    .map((p) => p.churnRisk as number);
  const avgChurnRisk =
    churnValues.length > 0
      ? Math.round(
          (churnValues.reduce((a, b) => a + b, 0) / churnValues.length) * 10
        ) / 10
      : 0;

  // Average health score
  const healthValues = profiles
    .filter((p) => p.healthScore !== null)
    .map((p) => p.healthScore as number);
  const avgHealthScore =
    healthValues.length > 0
      ? Math.round(
          (healthValues.reduce((a, b) => a + b, 0) / healthValues.length) * 10
        ) / 10
      : 0;

  // Provider count
  const providerCount = await db.providerCredential.count({
    where: { licenseState: stateCode, isActive: true },
  });

  return {
    stateCode,
    stateName,
    patients: patientCount,
    revenue: revenueAgg._sum.totalCents || 0,
    subscriptions: subscriptionCount,
    avgChurnRisk,
    avgHealthScore,
    providerCount,
    restrictions: stateInfo.restrictions,
    requiresPhysicalExam: stateInfo.requiresPhysicalExam,
    cpomRestrictions: stateInfo.cpomRestrictions,
    prescriptiveAuthNotes: stateInfo.prescriptiveAuthNotes,
  };
}

// ── getStateMetrics ────────────────────────────────────────────

export async function getStateMetrics(): Promise<StateMetric[]> {
  const availableStates = await db.stateAvailability.findMany({
    where: { isAvailable: true },
    orderBy: { stateCode: "asc" },
    select: {
      stateCode: true,
      stateName: true,
      restrictions: true,
      requiresPhysicalExam: true,
      cpomRestrictions: true,
      prescriptiveAuthNotes: true,
    },
  });

  // Build metrics for each available state in parallel
  const metrics = await Promise.all(
    availableStates.map((state) =>
      buildStateMetric(state.stateCode, state.stateName, {
        restrictions: state.restrictions,
        requiresPhysicalExam: state.requiresPhysicalExam,
        cpomRestrictions: state.cpomRestrictions,
        prescriptiveAuthNotes: state.prescriptiveAuthNotes,
      })
    )
  );

  return metrics;
}

// ── getStateComparison ─────────────────────────────────────────

export async function getStateComparison(
  stateCodeA: string,
  stateCodeB: string
): Promise<StateComparison> {
  const [stateA, stateB] = await Promise.all([
    db.stateAvailability.findUnique({
      where: { stateCode: stateCodeA },
      select: {
        stateCode: true,
        stateName: true,
        restrictions: true,
        requiresPhysicalExam: true,
        cpomRestrictions: true,
        prescriptiveAuthNotes: true,
      },
    }),
    db.stateAvailability.findUnique({
      where: { stateCode: stateCodeB },
      select: {
        stateCode: true,
        stateName: true,
        restrictions: true,
        requiresPhysicalExam: true,
        cpomRestrictions: true,
        prescriptiveAuthNotes: true,
      },
    }),
  ]);

  const [metricA, metricB] = await Promise.all([
    stateA
      ? buildStateMetric(stateA.stateCode, stateA.stateName, {
          restrictions: stateA.restrictions,
          requiresPhysicalExam: stateA.requiresPhysicalExam,
          cpomRestrictions: stateA.cpomRestrictions,
          prescriptiveAuthNotes: stateA.prescriptiveAuthNotes,
        })
      : null,
    stateB
      ? buildStateMetric(stateB.stateCode, stateB.stateName, {
          restrictions: stateB.restrictions,
          requiresPhysicalExam: stateB.requiresPhysicalExam,
          cpomRestrictions: stateB.cpomRestrictions,
          prescriptiveAuthNotes: stateB.prescriptiveAuthNotes,
        })
      : null,
  ]);

  return { stateA: metricA, stateB: metricB };
}

// ── getExpansionOpportunities ──────────────────────────────────

export async function getExpansionOpportunities(): Promise<
  ExpansionOpportunity[]
> {
  const unavailableStates = await db.stateAvailability.findMany({
    where: { isAvailable: false },
    select: {
      stateCode: true,
      stateName: true,
      restrictions: true,
    },
  });

  const opportunities: ExpansionOpportunity[] = [];

  for (const state of unavailableStates) {
    // Count leads from this state
    const leadCount = await db.lead.count({
      where: { state: state.stateCode },
    });

    // Count quiz submissions that mention this state (via intake submissions with that state)
    const quizInterest = await db.intakeSubmission.count({
      where: { state: state.stateCode },
    });

    // Patients who moved/registered with this state
    const patientProfiles = await db.patientProfile.count({
      where: { state: state.stateCode },
    });

    const potentialPatients = leadCount + quizInterest + patientProfiles;

    if (potentialPatients > 0) {
      opportunities.push({
        stateCode: state.stateCode,
        stateName: state.stateName,
        leadCount,
        quizInterest,
        potentialPatients,
        restrictions: state.restrictions,
      });
    }
  }

  // Sort by potential (highest first)
  return opportunities.sort((a, b) => b.potentialPatients - a.potentialPatients);
}

// ── getStateHeatMapData ────────────────────────────────────────

export async function getStateHeatMapData(
  metric: HeatMapMetric
): Promise<HeatMapEntry[]> {
  const allStates = await db.stateAvailability.findMany({
    where: { isAvailable: true },
    select: { stateCode: true },
  });

  const entries: HeatMapEntry[] = [];

  for (const state of allStates) {
    const profiles = await db.patientProfile.findMany({
      where: { state: state.stateCode },
      select: { userId: true, churnRisk: true, healthScore: true },
    });

    let value = 0;

    if (metric === "patients") {
      value = profiles.length;
    } else if (metric === "revenue") {
      if (profiles.length > 0) {
        const userIds = profiles.map((p) => p.userId);
        const rev = await db.order.aggregate({
          where: { userId: { in: userIds } },
          _sum: { totalCents: true },
        });
        value = rev._sum.totalCents || 0;
      }
    } else if (metric === "churn") {
      const churnValues = profiles
        .filter((p) => p.churnRisk !== null)
        .map((p) => p.churnRisk as number);
      value =
        churnValues.length > 0
          ? Math.round(
              (churnValues.reduce((a, b) => a + b, 0) / churnValues.length) * 10
            ) / 10
          : 0;
    } else if (metric === "health") {
      const healthValues = profiles
        .filter((p) => p.healthScore !== null)
        .map((p) => p.healthScore as number);
      value =
        healthValues.length > 0
          ? Math.round(
              (healthValues.reduce((a, b) => a + b, 0) / healthValues.length) *
                10
            ) / 10
          : 0;
    }

    entries.push({ stateCode: state.stateCode, value });
  }

  return entries;
}
