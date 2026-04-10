import { db } from "@/lib/db";

/**
 * Compute a 0-100 churn risk score for a patient based on 5 factors (20pts each):
 * 1. Health Score Inverse
 * 2. Inactivity (days since last progress entry)
 * 3. Payment Failure (past-due subscription, refunded/canceled orders)
 * 4. Engagement Decay (recent vs previous 14-day entry counts)
 * 5. Lifecycle Stage risk mapping
 */
export async function computeChurnRisk(userId: string): Promise<number> {
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);
  const twentyEightDaysAgo = new Date(now.getTime() - 28 * 86400000);

  const [profile, lastProgress, subscription, recentEntries, prevEntries, problemOrders] =
    await Promise.all([
      db.patientProfile.findUnique({
        where: { userId },
        select: { healthScore: true, lifecycleStage: true },
      }),
      db.progressEntry.findFirst({
        where: { userId },
        orderBy: { date: "desc" },
        select: { date: true },
      }),
      db.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { status: true },
      }),
      // Last 14 days entries
      db.progressEntry.count({
        where: { userId, date: { gte: fourteenDaysAgo } },
      }),
      // Previous 14 days entries (14-28 days ago)
      db.progressEntry.count({
        where: { userId, date: { gte: twentyEightDaysAgo, lt: fourteenDaysAgo } },
      }),
      // Refunded or canceled orders
      db.order.count({
        where: { userId, status: { in: ["REFUNDED", "CANCELED"] } },
      }),
    ]);

  // ── 1. Health Score Inverse (20 pts) ─────────────────────
  const healthScore = profile?.healthScore ?? 50;
  const healthInverse = Math.round((100 - healthScore) * 0.2);

  // ── 2. Inactivity (20 pts) ───────────────────────────────
  let inactivity = 0;
  if (lastProgress) {
    const daysSince = Math.floor((now.getTime() - new Date(lastProgress.date).getTime()) / 86400000);
    if (daysSince >= 22) inactivity = 20;
    else if (daysSince >= 15) inactivity = 15;
    else if (daysSince >= 8) inactivity = 10;
    else if (daysSince >= 4) inactivity = 5;
    else inactivity = 0;
  } else {
    // No progress entries at all
    inactivity = 20;
  }

  // ── 3. Payment Failure (20 pts) ──────────────────────────
  let payment = 0;
  if (subscription?.status === "PAST_DUE") payment += 15;
  if (problemOrders > 0) payment += 5;
  payment = Math.min(payment, 20);

  // ── 4. Engagement Decay (20 pts) ─────────────────────────
  let engagementDecay = 0;
  if (prevEntries > 0) {
    const ratio = recentEntries / prevEntries;
    if (ratio < 0.25) engagementDecay = 20;
    else if (ratio < 0.5) engagementDecay = 15;
    else if (ratio < 0.75) engagementDecay = 10;
    else engagementDecay = 0;
  } else if (recentEntries === 0) {
    // No entries in either period
    engagementDecay = 15;
  }

  // ── 5. Lifecycle Stage (20 pts) ──────────────────────────
  let lifecycle = 10;
  const stage = profile?.lifecycleStage;
  switch (stage) {
    case "CHURNED":
      lifecycle = 20;
      break;
    case "AT_RISK":
      lifecycle = 18;
      break;
    case "LEAD":
      lifecycle = 15;
      break;
    case "QUIZ_COMPLETE":
      lifecycle = 12;
      break;
    case "INTAKE_PENDING":
      lifecycle = 10;
      break;
    case "ACTIVE_NEW":
      lifecycle = 5;
      break;
    case "ACTIVE_ESTABLISHED":
      lifecycle = 3;
      break;
    default:
      lifecycle = 10;
  }

  const total = Math.max(0, Math.min(100, healthInverse + inactivity + payment + engagementDecay + lifecycle));

  const factors = { healthInverse, inactivity, payment, engagementDecay, lifecycle };

  // Persist
  await db.patientProfile.upsert({
    where: { userId },
    update: {
      churnRisk: total,
      churnRiskFactors: JSON.parse(JSON.stringify(factors)),
      lastChurnScoredAt: now,
    },
    create: {
      userId,
      churnRisk: total,
      churnRiskFactors: JSON.parse(JSON.stringify(factors)),
      lastChurnScoredAt: now,
    },
  });

  return total;
}

/**
 * Group all patient profiles by churn risk bands and return counts.
 */
export async function getChurnRiskDistribution() {
  const profiles = await db.patientProfile.findMany({
    where: { churnRisk: { not: null } },
    select: { churnRisk: true },
  });

  const bands = [
    { label: "Very Low (0-20)", min: 0, max: 20, count: 0, color: "#10b981" },
    { label: "Low (21-40)", min: 21, max: 40, count: 0, color: "#34d399" },
    { label: "Medium (41-60)", min: 41, max: 60, count: 0, color: "#f59e0b" },
    { label: "High (61-80)", min: 61, max: 80, count: 0, color: "#f97316" },
    { label: "Critical (81-100)", min: 81, max: 100, count: 0, color: "#ef4444" },
  ];

  for (const p of profiles) {
    const score = p.churnRisk!;
    for (const band of bands) {
      if (score >= band.min && score <= band.max) {
        band.count++;
        break;
      }
    }
  }

  return bands;
}

/**
 * Paginated list of users with high churn risk (>= 50),
 * ordered by churnRisk descending.
 */
export async function getHighChurnPatients(page = 1, limit = 25) {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000);

  const where = {
    churnRisk: { gte: 50 },
  };

  const [profiles, total] = await Promise.all([
    db.patientProfile.findMany({
      where,
      orderBy: { churnRisk: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            subscriptions: {
              orderBy: { createdAt: "desc" },
              take: 1,
              include: {
                items: {
                  include: { product: { select: { name: true } } },
                },
              },
            },
            progressEntries: {
              orderBy: { date: "desc" },
              take: 1,
              select: { date: true },
            },
          },
        },
      },
    }),
    db.patientProfile.count({ where }),
  ]);

  return {
    patients: profiles.map((p) => {
      const user = p.user;
      const sub = user.subscriptions[0];
      const lastActivity = user.progressEntries[0]?.date;
      const daysInactive = lastActivity
        ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / 86400000)
        : null;

      return {
        userId: user.id,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
        email: user.email,
        churnRisk: p.churnRisk ?? 0,
        healthScore: p.healthScore ?? 0,
        churnRiskFactors: p.churnRiskFactors as Record<string, number> | null,
        daysInactive,
        plan: sub?.items[0]?.product?.name || "No plan",
        subscriptionStatus: sub?.status || "NONE",
      };
    }),
    total,
  };
}
