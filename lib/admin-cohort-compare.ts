import { db } from "@/lib/db";

/**
 * Get distinct year-month values from User.createdAt where role=PATIENT.
 * Returns sorted strings like ["2025-10", "2025-11", "2026-01"]
 */
export async function getAvailableCohorts(): Promise<string[]> {
  const patients = await db.user.findMany({
    where: { role: "PATIENT" },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const months = new Set<string>();
  for (const p of patients) {
    const d = p.createdAt;
    months.add(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return Array.from(months).sort();
}

interface PlanDistribution {
  name: string;
  count: number;
}

interface CohortMetrics {
  month: string;
  totalUsers: number;
  retentionMonth1: number;
  retentionMonth3: number;
  retentionMonth6: number;
  avgLTV: number;
  avgHealthScore: number;
  planDistribution: PlanDistribution[];
  topChurnReasons: { reason: string; count: number }[];
}

/**
 * Compare two cohorts (by year-month).
 * For each month, computes retention at 1/3/6 month marks, avg LTV, avg health score,
 * plan distribution, and top churn reasons.
 */
export async function getCohortComparison(
  cohortA: string,
  cohortB: string
): Promise<{ cohortA: CohortMetrics; cohortB: CohortMetrics }> {
  const [metricsA, metricsB] = await Promise.all([
    getCohortMetrics(cohortA),
    getCohortMetrics(cohortB),
  ]);
  return { cohortA: metricsA, cohortB: metricsB };
}

async function getCohortMetrics(month: string): Promise<CohortMetrics> {
  const [year, mon] = month.split("-").map(Number);
  const start = new Date(year, mon - 1, 1);
  const end = new Date(year, mon, 1);

  // Users created in this month with role PATIENT
  const users = await db.user.findMany({
    where: {
      role: "PATIENT",
      createdAt: { gte: start, lt: end },
    },
    select: { id: true, createdAt: true },
  });

  const userIds = users.map((u) => u.id);
  const totalUsers = userIds.length;

  if (totalUsers === 0) {
    return {
      month,
      totalUsers: 0,
      retentionMonth1: 0,
      retentionMonth3: 0,
      retentionMonth6: 0,
      avgLTV: 0,
      avgHealthScore: 0,
      planDistribution: [],
      topChurnReasons: [],
    };
  }

  // Retention: % with an active subscription at N months after their createdAt
  const subscriptions = await db.subscription.findMany({
    where: { userId: { in: userIds } },
    select: {
      userId: true,
      status: true,
      createdAt: true,
      canceledAt: true,
      currentPeriodEnd: true,
      items: {
        select: { product: { select: { name: true } } },
      },
    },
  });

  const now = new Date();
  const retentionMonth1 = computeRetention(users, subscriptions, 1, now);
  const retentionMonth3 = computeRetention(users, subscriptions, 3, now);
  const retentionMonth6 = computeRetention(users, subscriptions, 6, now);

  // Avg LTV: sum of all orders / total users
  const orders = await db.order.findMany({
    where: { userId: { in: userIds } },
    select: { totalCents: true },
  });
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalCents, 0);
  const avgLTV = totalUsers > 0 ? Math.round(totalRevenue / totalUsers) : 0;

  // Avg health score
  const profiles = await db.patientProfile.findMany({
    where: { userId: { in: userIds }, healthScore: { not: null } },
    select: { healthScore: true },
  });
  const avgHealthScore =
    profiles.length > 0
      ? Math.round(
          profiles.reduce((sum, p) => sum + (p.healthScore ?? 0), 0) /
            profiles.length
        )
      : 0;

  // Plan distribution: grouped by product name
  const planMap: Record<string, number> = {};
  for (const sub of subscriptions) {
    for (const item of sub.items) {
      const name = item.product.name;
      planMap[name] = (planMap[name] || 0) + 1;
    }
  }
  const planDistribution = Object.entries(planMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Top churn reasons
  const canceledSubs = await db.subscription.findMany({
    where: {
      userId: { in: userIds },
      status: "CANCELED",
      cancelReason: { not: null },
    },
    select: { cancelReason: true },
  });
  const reasonMap: Record<string, number> = {};
  for (const s of canceledSubs) {
    const r = s.cancelReason || "Unknown";
    reasonMap[r] = (reasonMap[r] || 0) + 1;
  }
  const topChurnReasons = Object.entries(reasonMap)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    month,
    totalUsers,
    retentionMonth1,
    retentionMonth3,
    retentionMonth6,
    avgLTV,
    avgHealthScore,
    planDistribution,
    topChurnReasons,
  };
}

function computeRetention(
  users: { id: string; createdAt: Date }[],
  subscriptions: {
    userId: string;
    status: string;
    createdAt: Date;
    canceledAt: Date | null;
    currentPeriodEnd: Date | null;
  }[],
  monthsOffset: number,
  now: Date
): number {
  let eligible = 0;
  let retained = 0;

  for (const user of users) {
    const checkDate = new Date(user.createdAt);
    checkDate.setMonth(checkDate.getMonth() + monthsOffset);

    // Only count users who have had enough time to reach this offset
    if (checkDate > now) continue;

    eligible++;

    // Check if user had an active subscription at that point
    const userSubs = subscriptions.filter((s) => s.userId === user.id);
    const wasActive = userSubs.some((s) => {
      // Sub was created before or at the check date
      if (s.createdAt > checkDate) return false;
      // Sub was not canceled before the check date
      if (s.canceledAt && s.canceledAt < checkDate) return false;
      // Sub period covers the check date, or status is still active
      if (s.status === "ACTIVE" || s.status === "TRIALING") return true;
      if (s.currentPeriodEnd && s.currentPeriodEnd >= checkDate) return true;
      return false;
    });

    if (wasActive) retained++;
  }

  return eligible > 0 ? Math.round((retained / eligible) * 100) : 0;
}
