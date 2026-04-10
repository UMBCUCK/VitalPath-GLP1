import { db } from "@/lib/db";

/**
 * Compute a 0–100 health score for a patient based on engagement,
 * weight trend, medication adherence, and subscription health.
 */
export async function computeHealthScore(userId: string): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [progressEntries, messages, subscription, profile] = await Promise.all([
    db.progressEntry.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: "asc" },
    }),
    db.message.count({ where: { userId, createdAt: { gte: thirtyDaysAgo } } }),
    db.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    db.patientProfile.findUnique({
      where: { userId },
      select: { goalWeightLbs: true },
    }),
  ]);

  // ── 1. Progress logging frequency (20 pts) ──────────────────
  const entryCount = progressEntries.length;
  let loggingScore = 0;
  if (entryCount >= 20) loggingScore = 20;
  else if (entryCount >= 10) loggingScore = 15;
  else if (entryCount >= 5) loggingScore = 10;
  else if (entryCount >= 1) loggingScore = 5;

  // ── 2. Weight trend toward goal (25 pts) ─────────────────────
  let weightScore = 10; // default: plateau
  const weightEntries = progressEntries.filter((e) => e.weightLbs != null);
  if (weightEntries.length >= 2 && profile?.goalWeightLbs) {
    const first = weightEntries[0].weightLbs!;
    const last = weightEntries[weightEntries.length - 1].weightLbs!;
    const diff = last - first;
    const needsToLose = first > profile.goalWeightLbs;

    if (needsToLose) {
      if (diff <= -2) weightScore = 25;       // losing well
      else if (diff < 0) weightScore = 15;    // losing some
      else if (diff <= 1) weightScore = 10;   // plateau
      else weightScore = 5;                   // gaining
    } else {
      // goal already met or gaining toward goal
      if (Math.abs(diff) <= 1) weightScore = 25;
      else weightScore = 15;
    }
  }

  // ── 3. Medication adherence (20 pts) ─────────────────────────
  const medEntries = progressEntries.filter((e) => e.medicationTaken != null);
  let medScore = 0;
  if (medEntries.length > 0) {
    const takenCount = medEntries.filter((e) => e.medicationTaken === true).length;
    medScore = Math.round((takenCount / medEntries.length) * 20);
  }

  // ── 4. Engagement: messages + progress entries (20 pts) ──────
  const totalEngagement = entryCount + messages;
  let engagementScore = 0;
  if (totalEngagement >= 20) engagementScore = 20;
  else if (totalEngagement >= 10) engagementScore = 15;
  else if (totalEngagement >= 5) engagementScore = 10;
  else if (totalEngagement >= 1) engagementScore = 5;

  // ── 5. Subscription health (15 pts) ──────────────────────────
  let subScore = 0;
  if (subscription) {
    switch (subscription.status) {
      case "ACTIVE":   subScore = 15; break;
      case "TRIALING": subScore = 12; break;
      case "PAST_DUE": subScore = 5;  break;
      default:         subScore = 0;
    }
  }

  const total = loggingScore + weightScore + medScore + engagementScore + subScore;
  const score = Math.max(0, Math.min(100, total));

  // Persist the computed score
  await db.patientProfile.upsert({
    where: { userId },
    update: { healthScore: score, lastScoredAt: new Date() },
    create: { userId, healthScore: score, lastScoredAt: new Date() },
  });

  return score;
}

/**
 * Determine the lifecycle stage for a patient based on their
 * intake, subscription, and health score status.
 */
export async function computeLifecycleStage(userId: string): Promise<string> {
  const [intake, quiz, subscription, profile] = await Promise.all([
    db.intakeSubmission.findUnique({ where: { userId } }),
    db.quizSubmission.findUnique({ where: { userId } }),
    db.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    db.patientProfile.findUnique({
      where: { userId },
      select: { healthScore: true },
    }),
  ]);

  let stage: string;

  if (subscription?.status === "CANCELED") {
    stage = "CHURNED";
  } else if (subscription && ["ACTIVE", "TRIALING", "PAST_DUE"].includes(subscription.status)) {
    // Active subscriber — check health score first for AT_RISK
    if (profile?.healthScore != null && profile.healthScore < 30) {
      stage = "AT_RISK";
    } else {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      stage = subscription.createdAt < ninetyDaysAgo ? "ACTIVE_ESTABLISHED" : "ACTIVE_NEW";
    }
  } else if (intake) {
    stage = "INTAKE_PENDING";
  } else if (quiz) {
    stage = "QUIZ_COMPLETE";
  } else {
    stage = "LEAD";
  }

  // Persist the lifecycle stage
  await db.patientProfile.upsert({
    where: { userId },
    update: { lifecycleStage: stage },
    create: { userId, lifecycleStage: stage },
  });

  return stage;
}
