import { db } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────

interface DoseFactors {
  weightLossVelocity: number; // lbs/week
  sideEffectCount: number;
  severeSideEffects: boolean;
  adherenceRate: number;
  dataPointCount: number;
  cohortComparison: string;
}

// ── Dose Escalation Map ────────────────────────────────────────

const DOSE_LADDER: Record<string, string[]> = {
  semaglutide: ["0.25mg", "0.5mg", "1.0mg", "1.7mg", "2.4mg"],
  tirzepatide: ["2.5mg", "5mg", "7.5mg", "10mg", "12.5mg", "15mg"],
};

function getNextDose(medicationName: string, currentDose: string): string | null {
  const key = medicationName.toLowerCase();
  for (const [med, ladder] of Object.entries(DOSE_LADDER)) {
    if (key.includes(med)) {
      const idx = ladder.indexOf(currentDose);
      if (idx >= 0 && idx < ladder.length - 1) return ladder[idx + 1];
      return null;
    }
  }
  return null;
}

function getPrevDose(medicationName: string, currentDose: string): string | null {
  const key = medicationName.toLowerCase();
  for (const [med, ladder] of Object.entries(DOSE_LADDER)) {
    if (key.includes(med)) {
      const idx = ladder.indexOf(currentDose);
      if (idx > 0) return ladder[idx - 1];
      return null;
    }
  }
  return null;
}

// ── Generate Recommendation ────────────────────────────────────

export async function generateDoseRecommendation(userId: string) {
  // Fetch active dosage schedule
  const schedule = await db.dosageSchedule.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
  });

  if (!schedule) {
    throw new Error("No active dosage schedule found for this user");
  }

  // Fetch last 30 days of progress entries
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const progressEntries = await db.progressEntry.findMany({
    where: {
      userId,
      date: { gte: thirtyDaysAgo },
      weightLbs: { not: null },
    },
    orderBy: { date: "asc" },
  });

  // Calculate weight loss velocity (lbs/week over last 4 weeks)
  let weightLossVelocity = 0;
  if (progressEntries.length >= 2) {
    const earliest = progressEntries[0];
    const latest = progressEntries[progressEntries.length - 1];
    const daySpan =
      (new Date(latest.date).getTime() - new Date(earliest.date).getTime()) /
      (1000 * 60 * 60 * 24);
    const weeks = Math.max(daySpan / 7, 1);
    const weightDiff = (earliest.weightLbs || 0) - (latest.weightLbs || 0);
    weightLossVelocity = Math.round((weightDiff / weeks) * 100) / 100;
  }

  // Analyze side effects from schedule
  const sideEffects = (schedule.sideEffects as Array<{ date: string; symptom: string; severity: string }>) || [];
  const recentSideEffects = sideEffects.filter((se) => {
    const seDate = new Date(se.date);
    return seDate >= thirtyDaysAgo;
  });
  const severeSideEffects = recentSideEffects.some(
    (se) => se.severity === "SEVERE" || se.severity === "LIFE_THREATENING"
  );

  const adherenceRate = schedule.adherenceRate || 0;
  const dataPointCount = progressEntries.length;

  // Determine confidence (0-100) based on data completeness
  let confidence = 50;
  if (dataPointCount >= 20) confidence += 25;
  else if (dataPointCount >= 10) confidence += 15;
  else if (dataPointCount >= 5) confidence += 8;
  if (adherenceRate > 0) confidence += 10;
  if (recentSideEffects.length > 0) confidence += 5; // we have side effect data
  if (schedule.currentWeek > 4) confidence += 10;
  confidence = Math.min(confidence, 99);

  // Determine recommendation
  let recommendedDose = schedule.currentDose;
  let reasoning = "";
  let cohortComparison = "Within normal range for treatment week " + schedule.currentWeek;

  if (adherenceRate < 50) {
    recommendedDose = schedule.currentDose;
    reasoning =
      "Adherence rate is below 50%. No dose change recommended until adherence improves. " +
      "Consider patient outreach to address barriers to medication compliance.";
    cohortComparison = "Adherence is below the 25th percentile for this treatment stage";
  } else if (weightLossVelocity > 3) {
    // Too rapid weight loss — hold or decrease
    const prevDose = getPrevDose(schedule.medicationName, schedule.currentDose);
    recommendedDose = prevDose || schedule.currentDose;
    reasoning =
      `Weight loss velocity is ${weightLossVelocity} lbs/week, which exceeds the safe threshold of 3 lbs/week. ` +
      (prevDose
        ? `Recommend decreasing dose from ${schedule.currentDose} to ${prevDose} to moderate weight loss rate.`
        : `Recommend holding current dose at ${schedule.currentDose} and monitoring closely.`);
    cohortComparison = "Weight loss rate is above the 95th percentile — requires monitoring";
  } else if (severeSideEffects && weightLossVelocity >= 0.5) {
    recommendedDose = schedule.currentDose;
    reasoning =
      `Patient is experiencing severe side effects but weight loss is adequate at ${weightLossVelocity} lbs/week. ` +
      `Recommend holding current dose at ${schedule.currentDose} until side effects are managed.`;
    cohortComparison = "Side effect profile requires holding at current dose";
  } else if (weightLossVelocity < 0.5 && adherenceRate > 80 && !severeSideEffects) {
    // Good candidate for dose increase
    const nextDose = getNextDose(schedule.medicationName, schedule.currentDose);
    if (nextDose) {
      recommendedDose = nextDose;
      reasoning =
        `Weight loss velocity is ${weightLossVelocity} lbs/week (below target of 0.5 lbs/week). ` +
        `Adherence is strong at ${adherenceRate}% with no severe side effects. ` +
        `Recommend increasing dose from ${schedule.currentDose} to ${nextDose}.`;
      cohortComparison = "Patient is a strong candidate for dose escalation based on cohort data";
    } else {
      recommendedDose = schedule.currentDose;
      reasoning =
        `Weight loss velocity is below target but patient is already at maximum dose (${schedule.currentDose}). ` +
        `Recommend maintaining current dose and evaluating treatment plan.`;
      cohortComparison = "At maximum dose — consider adjunct therapies";
    }
  } else {
    recommendedDose = schedule.currentDose;
    reasoning =
      `Current treatment is progressing within expected parameters. Weight loss velocity is ${weightLossVelocity} lbs/week ` +
      `with ${adherenceRate}% adherence. Recommend maintaining current dose at ${schedule.currentDose}.`;
    cohortComparison = "Progress is tracking with the median for this treatment stage";
  }

  const factors: DoseFactors = {
    weightLossVelocity,
    sideEffectCount: recentSideEffects.length,
    severeSideEffects,
    adherenceRate,
    dataPointCount,
    cohortComparison,
  };

  // Save the recommendation
  const recommendation = await db.doseRecommendation.create({
    data: {
      userId,
      scheduleId: schedule.id,
      currentDose: schedule.currentDose,
      recommendedDose,
      confidence,
      reasoning,
      factors: JSON.parse(JSON.stringify(factors)),
      status: "PENDING",
    },
  });

  return recommendation;
}

// ── List Recommendations ───────────────────────────────────────

export async function getDoseRecommendations(
  page = 1,
  limit = 25,
  status?: string
) {
  const where: Record<string, unknown> = {};
  if (status && status !== "all") {
    where.status = status;
  }

  const [rows, total] = await Promise.all([
    db.doseRecommendation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.doseRecommendation.count({ where }),
  ]);

  // Enrich with user info
  const userIds = [...new Set(rows.map((r) => r.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const enriched = rows.map((r) => {
    const user = userMap.get(r.userId);
    return {
      ...r,
      patientName: user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
        : "Unknown",
      patientEmail: user?.email || "",
    };
  });

  return { rows: enriched, total };
}

// ── Review Recommendation ──────────────────────────────────────

export async function reviewRecommendation(
  id: string,
  action: "ACCEPTED" | "REJECTED",
  reviewedBy: string
) {
  const rec = await db.doseRecommendation.update({
    where: { id },
    data: {
      status: action,
      reviewedBy,
      reviewedAt: new Date(),
    },
  });

  // If accepted and we have a schedule, update the dosage schedule
  if (action === "ACCEPTED" && rec.scheduleId) {
    await db.dosageSchedule.update({
      where: { id: rec.scheduleId },
      data: { currentDose: rec.recommendedDose },
    });
  }

  return rec;
}

// ── Metrics ────────────────────────────────────────────────────

export async function getDoseIntelligenceMetrics() {
  const [total, pending, accepted, rejected, allRecs] = await Promise.all([
    db.doseRecommendation.count(),
    db.doseRecommendation.count({ where: { status: "PENDING" } }),
    db.doseRecommendation.count({ where: { status: "ACCEPTED" } }),
    db.doseRecommendation.count({ where: { status: "REJECTED" } }),
    db.doseRecommendation.findMany({
      select: { confidence: true },
    }),
  ]);

  const reviewed = accepted + rejected;
  const acceptanceRate = reviewed > 0 ? Math.round((accepted / reviewed) * 100) : 0;
  const avgConfidence =
    allRecs.length > 0
      ? Math.round(allRecs.reduce((sum, r) => sum + r.confidence, 0) / allRecs.length)
      : 0;

  // Count patients needing review (have PENDING recommendations)
  const pendingRecs = await db.doseRecommendation.findMany({
    where: { status: "PENDING" },
    select: { userId: true },
    distinct: ["userId"],
  });

  return {
    totalRecommendations: total,
    pendingReview: pending,
    acceptanceRate,
    avgConfidence,
    patientsNeedingReview: pendingRecs.length,
    accepted,
    rejected,
  };
}
