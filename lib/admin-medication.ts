import { db } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────

export interface DosageOverview {
  totalActive: number;
  avgAdherence: number;
  atTargetDose: number;
  avgWeeksToTarget: number;
  patientsWithSideEffects: number;
}

export interface DosageScheduleRow {
  id: string;
  userId: string;
  patientName: string;
  patientEmail: string;
  medicationName: string;
  currentDose: string;
  targetDose: string;
  frequency: string;
  currentWeek: number;
  adherenceRate: number | null;
  sideEffectsCount: number;
  status: string;
  nextDoseDate: string | null;
  lastDoseDate: string | null;
  startedAt: string;
  escalationPlan: { week: number; dose: string; notes?: string }[];
  providerNotes: string | null;
}

interface SideEffectEntry {
  date: string;
  symptom: string;
  severity: string;
}

export interface DoseDistribution {
  dose: string;
  count: number;
}

export interface AdherenceByWeek {
  week: number;
  avgAdherence: number;
}

export interface SideEffectFrequency {
  symptom: string;
  count: number;
  severityBreakdown: { mild: number; moderate: number; severe: number };
}

export interface WeightLossByDose {
  dose: string;
  avgWeightLoss: number;
  patientCount: number;
}

export interface TimeToTarget {
  weeks: number;
  count: number;
}

export interface DosageAnalytics {
  doseDistribution: DoseDistribution[];
  adherenceByWeek: AdherenceByWeek[];
  sideEffectFrequency: SideEffectFrequency[];
  weightLossByDose: WeightLossByDose[];
  timeToTarget: TimeToTarget[];
}

export interface AdherenceCorrelation {
  weightLoss: { highAdherence: number; lowAdherence: number };
  churnRisk: { highAdherence: number; lowAdherence: number };
  retention: { highAdherence: number; lowAdherence: number };
}

// ── getDosageOverview ──────────────────────────────────────────

export async function getDosageOverview(): Promise<DosageOverview> {
  const allSchedules = await db.dosageSchedule.findMany({
    select: {
      status: true,
      adherenceRate: true,
      currentDose: true,
      targetDose: true,
      currentWeek: true,
      sideEffects: true,
    },
  });

  const active = allSchedules.filter((s) => s.status === "ACTIVE");
  const totalActive = active.length;

  const adherenceValues = allSchedules
    .filter((s) => s.adherenceRate !== null)
    .map((s) => s.adherenceRate as number);
  const avgAdherence =
    adherenceValues.length > 0
      ? Math.round(
          (adherenceValues.reduce((a, b) => a + b, 0) / adherenceValues.length) * 10
        ) / 10
      : 0;

  const atTargetDose = allSchedules.filter(
    (s) => s.currentDose === s.targetDose
  ).length;

  const completedSchedules = allSchedules.filter(
    (s) => s.status === "COMPLETED" || s.currentDose === s.targetDose
  );
  const avgWeeksToTarget =
    completedSchedules.length > 0
      ? Math.round(
          (completedSchedules.reduce((sum, s) => sum + s.currentWeek, 0) /
            completedSchedules.length) *
            10
        ) / 10
      : 0;

  const patientsWithSideEffects = allSchedules.filter((s) => {
    if (!s.sideEffects) return false;
    const effects = s.sideEffects as unknown as SideEffectEntry[];
    return Array.isArray(effects) && effects.length > 0;
  }).length;

  return {
    totalActive,
    avgAdherence,
    atTargetDose,
    avgWeeksToTarget,
    patientsWithSideEffects,
  };
}

// ── getDosageSchedules ─────────────────────────────────────────

export async function getDosageSchedules(
  page = 1,
  limit = 25,
  status?: string
): Promise<{ rows: DosageScheduleRow[]; total: number }> {
  const where: Record<string, unknown> = {};
  if (status && status !== "all") {
    where.status = status;
  }

  const [schedules, total] = await Promise.all([
    db.dosageSchedule.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.dosageSchedule.count({ where }),
  ]);

  // Fetch user info for all schedules
  const userIds = [...new Set(schedules.map((s) => s.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const rows: DosageScheduleRow[] = schedules.map((s) => {
    const user = userMap.get(s.userId);
    const sideEffects = (s.sideEffects as unknown as SideEffectEntry[] | null) || [];
    return {
      id: s.id,
      userId: s.userId,
      patientName:
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        user?.email ||
        "Unknown",
      patientEmail: user?.email || "",
      medicationName: s.medicationName,
      currentDose: s.currentDose,
      targetDose: s.targetDose,
      frequency: s.frequency,
      currentWeek: s.currentWeek,
      adherenceRate: s.adherenceRate,
      sideEffectsCount: Array.isArray(sideEffects) ? sideEffects.length : 0,
      status: s.status,
      nextDoseDate: s.nextDoseDate?.toISOString() || null,
      lastDoseDate: s.lastDoseDate?.toISOString() || null,
      startedAt: s.startedAt.toISOString(),
      escalationPlan: (s.escalationPlan as { week: number; dose: string; notes?: string }[]) || [],
      providerNotes: s.providerNotes,
    };
  });

  return { rows, total };
}

// ── createDosageSchedule ───────────────────────────────────────

export async function createDosageSchedule(data: {
  userId: string;
  treatmentPlanId?: string;
  medicationName: string;
  currentDose: string;
  targetDose: string;
  frequency: string;
  escalationPlan: { week: number; dose: string; notes?: string }[];
  providerNotes?: string;
}) {
  return db.dosageSchedule.create({
    data: {
      userId: data.userId,
      treatmentPlanId: data.treatmentPlanId || null,
      medicationName: data.medicationName,
      currentDose: data.currentDose,
      targetDose: data.targetDose,
      frequency: data.frequency,
      escalationPlan: data.escalationPlan,
      currentWeek: 1,
      status: "ACTIVE",
      startedAt: new Date(),
      nextDoseDate: new Date(Date.now() + 7 * 86400000),
      providerNotes: data.providerNotes || null,
    },
  });
}

// ── updateDosageSchedule ───────────────────────────────────────

export async function updateDosageSchedule(
  id: string,
  data: {
    currentWeek?: number;
    currentDose?: string;
    adherenceRate?: number;
    sideEffects?: SideEffectEntry[];
    status?: string;
    nextDoseDate?: string;
    lastDoseDate?: string;
    providerNotes?: string;
  }
) {
  const updateData: Record<string, unknown> = {};
  if (data.currentWeek !== undefined) updateData.currentWeek = data.currentWeek;
  if (data.currentDose !== undefined) updateData.currentDose = data.currentDose;
  if (data.adherenceRate !== undefined) updateData.adherenceRate = data.adherenceRate;
  if (data.sideEffects !== undefined) updateData.sideEffects = data.sideEffects;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.nextDoseDate !== undefined) updateData.nextDoseDate = new Date(data.nextDoseDate);
  if (data.lastDoseDate !== undefined) updateData.lastDoseDate = new Date(data.lastDoseDate);
  if (data.providerNotes !== undefined) updateData.providerNotes = data.providerNotes;

  return db.dosageSchedule.update({ where: { id }, data: updateData });
}

// ── getDosageAnalytics ─────────────────────────────────────────

export async function getDosageAnalytics(): Promise<DosageAnalytics> {
  const allSchedules = await db.dosageSchedule.findMany({
    select: {
      userId: true,
      currentDose: true,
      targetDose: true,
      currentWeek: true,
      adherenceRate: true,
      sideEffects: true,
      status: true,
      startedAt: true,
    },
  });

  // 1. Dose distribution
  const doseCounts = new Map<string, number>();
  for (const s of allSchedules) {
    doseCounts.set(s.currentDose, (doseCounts.get(s.currentDose) || 0) + 1);
  }
  const doseDistribution: DoseDistribution[] = Array.from(doseCounts.entries())
    .map(([dose, count]) => ({ dose, count }))
    .sort((a, b) => {
      const numA = parseFloat(a.dose) || 0;
      const numB = parseFloat(b.dose) || 0;
      return numA - numB;
    });

  // 2. Adherence by week
  const weekMap = new Map<number, { sum: number; count: number }>();
  for (const s of allSchedules) {
    if (s.adherenceRate === null) continue;
    const existing = weekMap.get(s.currentWeek) || { sum: 0, count: 0 };
    existing.sum += s.adherenceRate;
    existing.count += 1;
    weekMap.set(s.currentWeek, existing);
  }
  const adherenceByWeek: AdherenceByWeek[] = Array.from(weekMap.entries())
    .map(([week, { sum, count }]) => ({
      week,
      avgAdherence: Math.round((sum / count) * 10) / 10,
    }))
    .sort((a, b) => a.week - b.week);

  // 3. Side effect frequency
  const symptomMap = new Map<
    string,
    { count: number; mild: number; moderate: number; severe: number }
  >();
  for (const s of allSchedules) {
    if (!s.sideEffects) continue;
    const effects = s.sideEffects as unknown as SideEffectEntry[];
    if (!Array.isArray(effects)) continue;
    for (const effect of effects) {
      const key = effect.symptom || "Unknown";
      const existing = symptomMap.get(key) || {
        count: 0,
        mild: 0,
        moderate: 0,
        severe: 0,
      };
      existing.count += 1;
      const sev = (effect.severity || "").toLowerCase();
      if (sev === "mild") existing.mild += 1;
      else if (sev === "moderate") existing.moderate += 1;
      else existing.severe += 1;
      symptomMap.set(key, existing);
    }
  }
  const sideEffectFrequency: SideEffectFrequency[] = Array.from(
    symptomMap.entries()
  )
    .map(([symptom, data]) => ({
      symptom,
      count: data.count,
      severityBreakdown: {
        mild: data.mild,
        moderate: data.moderate,
        severe: data.severe,
      },
    }))
    .sort((a, b) => b.count - a.count);

  // 4. Weight loss by dose — correlate current dose with weight change
  const userIds = [...new Set(allSchedules.map((s) => s.userId))];
  const profiles = await db.patientProfile.findMany({
    where: { userId: { in: userIds } },
    select: { userId: true, weightLbs: true },
  });
  const latestProgress = await db.progressEntry.findMany({
    where: { userId: { in: userIds }, weightLbs: { not: null } },
    orderBy: { date: "desc" },
    distinct: ["userId"],
    select: { userId: true, weightLbs: true },
  });
  const profileMap = new Map(profiles.map((p) => [p.userId, p.weightLbs]));
  const progressMap = new Map(latestProgress.map((p) => [p.userId, p.weightLbs]));

  const doseLossMap = new Map<
    string,
    { totalLoss: number; count: number }
  >();
  for (const s of allSchedules) {
    const startWeight = profileMap.get(s.userId);
    const currentWeight = progressMap.get(s.userId);
    if (!startWeight || !currentWeight) continue;
    const loss = startWeight - currentWeight;
    const existing = doseLossMap.get(s.currentDose) || {
      totalLoss: 0,
      count: 0,
    };
    existing.totalLoss += loss;
    existing.count += 1;
    doseLossMap.set(s.currentDose, existing);
  }
  const weightLossByDose: WeightLossByDose[] = Array.from(
    doseLossMap.entries()
  )
    .map(([dose, { totalLoss, count }]) => ({
      dose,
      avgWeightLoss: Math.round((totalLoss / count) * 10) / 10,
      patientCount: count,
    }))
    .sort((a, b) => {
      const numA = parseFloat(a.dose) || 0;
      const numB = parseFloat(b.dose) || 0;
      return numA - numB;
    });

  // 5. Time to target
  const completedOrAtTarget = allSchedules.filter(
    (s) => s.status === "COMPLETED" || s.currentDose === s.targetDose
  );
  const weekCounts = new Map<number, number>();
  for (const s of completedOrAtTarget) {
    weekCounts.set(s.currentWeek, (weekCounts.get(s.currentWeek) || 0) + 1);
  }
  const timeToTarget: TimeToTarget[] = Array.from(weekCounts.entries())
    .map(([weeks, count]) => ({ weeks, count }))
    .sort((a, b) => a.weeks - b.weeks);

  return {
    doseDistribution,
    adherenceByWeek,
    sideEffectFrequency,
    weightLossByDose,
    timeToTarget,
  };
}

// ── getMedicationAdherenceCorrelation ───────────────────────────

export async function getMedicationAdherenceCorrelation(): Promise<AdherenceCorrelation> {
  const schedules = await db.dosageSchedule.findMany({
    where: { adherenceRate: { not: null } },
    select: { userId: true, adherenceRate: true },
  });

  const userIds = schedules.map((s) => s.userId);
  const [profiles, progressEntries, subscriptions] = await Promise.all([
    db.patientProfile.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, weightLbs: true, churnRisk: true },
    }),
    db.progressEntry.findMany({
      where: { userId: { in: userIds }, weightLbs: { not: null } },
      orderBy: { date: "desc" },
      distinct: ["userId"],
      select: { userId: true, weightLbs: true },
    }),
    db.subscription.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, status: true },
    }),
  ]);

  const profileMap = new Map(profiles.map((p) => [p.userId, p]));
  const progressMap = new Map(progressEntries.map((p) => [p.userId, p.weightLbs]));
  const subMap = new Map(subscriptions.map((s) => [s.userId, s.status]));
  const adherenceMap = new Map(
    schedules.map((s) => [s.userId, s.adherenceRate as number])
  );

  const HIGH_THRESHOLD = 80;

  // Weight loss correlation
  let highAdherenceWeightLoss = 0;
  let highCount = 0;
  let lowAdherenceWeightLoss = 0;
  let lowCount = 0;

  for (const [userId, adherence] of adherenceMap) {
    const profile = profileMap.get(userId);
    const currentWeight = progressMap.get(userId);
    if (!profile?.weightLbs || !currentWeight) continue;
    const loss = profile.weightLbs - currentWeight;

    if (adherence >= HIGH_THRESHOLD) {
      highAdherenceWeightLoss += loss;
      highCount++;
    } else {
      lowAdherenceWeightLoss += loss;
      lowCount++;
    }
  }

  // Churn risk correlation
  let highAdherenceChurn = 0;
  let highChurnCount = 0;
  let lowAdherenceChurn = 0;
  let lowChurnCount = 0;

  for (const [userId, adherence] of adherenceMap) {
    const profile = profileMap.get(userId);
    if (profile?.churnRisk === null || profile?.churnRisk === undefined) continue;

    if (adherence >= HIGH_THRESHOLD) {
      highAdherenceChurn += profile.churnRisk;
      highChurnCount++;
    } else {
      lowAdherenceChurn += profile.churnRisk;
      lowChurnCount++;
    }
  }

  // Retention correlation
  let highAdherenceRetained = 0;
  let highRetCount = 0;
  let lowAdherenceRetained = 0;
  let lowRetCount = 0;

  for (const [userId, adherence] of adherenceMap) {
    const status = subMap.get(userId);
    if (!status) continue;
    const retained = status === "ACTIVE" || status === "TRIALING" ? 1 : 0;

    if (adherence >= HIGH_THRESHOLD) {
      highAdherenceRetained += retained;
      highRetCount++;
    } else {
      lowAdherenceRetained += retained;
      lowRetCount++;
    }
  }

  return {
    weightLoss: {
      highAdherence:
        highCount > 0
          ? Math.round((highAdherenceWeightLoss / highCount) * 10) / 10
          : 0,
      lowAdherence:
        lowCount > 0
          ? Math.round((lowAdherenceWeightLoss / lowCount) * 10) / 10
          : 0,
    },
    churnRisk: {
      highAdherence:
        highChurnCount > 0
          ? Math.round((highAdherenceChurn / highChurnCount) * 10) / 10
          : 0,
      lowAdherence:
        lowChurnCount > 0
          ? Math.round((lowAdherenceChurn / lowChurnCount) * 10) / 10
          : 0,
    },
    retention: {
      highAdherence:
        highRetCount > 0
          ? Math.round((highAdherenceRetained / highRetCount) * 100 * 10) / 10
          : 0,
      lowAdherence:
        lowRetCount > 0
          ? Math.round((lowAdherenceRetained / lowRetCount) * 100 * 10) / 10
          : 0,
    },
  };
}
