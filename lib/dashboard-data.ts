/**
 * Server-side data fetching for the patient dashboard.
 * Used by server components and API routes.
 */

import { db } from "@/lib/db";
import { evaluateUpsells } from "@/lib/upsell-engine";

export async function getDashboardData(userId: string) {
  const [user, profile, subscription, recentProgress, notifications, referralCode, intakeSubmission, progressCount, treatment] =
    await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, createdAt: true },
      }),
      db.patientProfile.findUnique({
        where: { userId },
        select: {
          weightLbs: true,
          goalWeightLbs: true,
          heightInches: true,
          state: true,
        },
      }),
      db.subscription.findFirst({
        where: { userId, status: { in: ["ACTIVE", "TRIALING"] } },
        include: { items: { include: { product: { select: { name: true, slug: true } } } } },
        orderBy: { createdAt: "desc" },
      }),
      db.progressEntry.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 90,
      }),
      db.notification.findMany({
        where: { userId, isRead: false },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.referralCode.findUnique({
        where: { userId },
        select: { code: true, tier: true, totalReferred: true, totalEarned: true },
      }),
      db.intakeSubmission.findUnique({
        where: { userId },
        select: { status: true },
      }),
      db.progressEntry.count({ where: { userId } }),
      db.treatmentPlan.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { medicationName: true, medicationDose: true, status: true, nextRefillDate: true },
      }),
    ]);

  // Calculate derived values
  const firstProgressEntry = recentProgress.length > 0
    ? recentProgress[recentProgress.length - 1]
    : null;
  const latestProgressEntry = recentProgress.length > 0 ? recentProgress[0] : null;

  const startWeight = firstProgressEntry?.weightLbs || profile?.weightLbs || 0;
  const currentWeight = latestProgressEntry?.weightLbs || profile?.weightLbs || 0;
  const goalWeight = profile?.goalWeightLbs || 0;
  const weightLost = startWeight - currentWeight;

  // Determine month number
  const memberSince = user?.createdAt || new Date();
  const monthNumber = Math.max(
    1,
    Math.ceil((Date.now() - memberSince.getTime()) / (30 * 24 * 60 * 60 * 1000))
  );

  // Today's entries
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Real logs this week count + habit adherence
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekEntries = recentProgress.filter((e) => new Date(e.date) >= sevenDaysAgo);
  const logsThisWeek = thisWeekEntries.length;
  const proteinDaysHit = thisWeekEntries.filter((e) => e.proteinG && e.proteinG >= 112).length; // 80% of 140g target
  const waterDaysHit = thisWeekEntries.filter((e) => e.waterOz && e.waterOz >= 80).length;     // 80% of 100oz target
  const todayEntry = recentProgress.find((e) => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  // Streak calculation
  let streakDays = 0;
  const dayMs = 24 * 60 * 60 * 1000;
  for (let i = 0; i < recentProgress.length; i++) {
    const entryDate = new Date(recentProgress[i].date);
    entryDate.setHours(0, 0, 0, 0);
    const expectedDate = new Date(today.getTime() - i * dayMs);
    expectedDate.setHours(0, 0, 0, 0);
    if (entryDate.getTime() === expectedDate.getTime()) {
      streakDays++;
    } else {
      break;
    }
  }

  // Plan name
  const planName = subscription?.items?.[0]?.product?.name || "No active plan";

  // Weight chart data (recent 90 days with weight)
  const weightChartData = recentProgress
    .filter((e) => e.weightLbs !== null)
    .reverse()
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: e.weightLbs,
    }));

  // Daily logs (last 7)
  const dailyLogs = recentProgress.slice(0, 7).map((e) => ({
    date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: e.weightLbs,
    protein: e.proteinG,
    water: e.waterOz,
    medication: e.medicationTaken,
    mood: e.moodRating,
  }));

  return {
    user,
    profile,
    subscription: subscription
      ? {
          id: subscription.id,
          status: subscription.status,
          planName,
          currentPeriodEnd: subscription.currentPeriodEnd,
        }
      : null,
    stats: {
      startWeight,
      currentWeight,
      goalWeight,
      weightLost,
      monthNumber,
      streakDays,
      logsThisWeek,
      proteinDaysHit,
      waterDaysHit,
      todayProtein: todayEntry?.proteinG || 0,
      todayWater: todayEntry?.waterOz || 0,
      proteinTarget: 140,
      waterTarget: 100,
    },
    weightChartData,
    dailyLogs,
    notifications,
    referralCode,
    onboarding: {
      hasProfile: !!(profile?.state && profile?.heightInches),
      hasIntake: !!intakeSubmission,
      hasGoalWeight: !!(profile?.goalWeightLbs && profile.goalWeightLbs > 0),
      hasFirstWeight: progressCount > 0,
      hasViewedMeals: false, // tracked client-side via localStorage
    },
    upsellSuggestions: await evaluateUpsells(userId),
    treatment: treatment
      ? {
          medicationName: treatment.medicationName,
          medicationDose: treatment.medicationDose,
          status: treatment.status,
          nextRefillDaysAway: treatment.nextRefillDate
            ? Math.ceil((treatment.nextRefillDate.getTime() - Date.now()) / 86400000)
            : null,
          nextRefillLabel: treatment.nextRefillDate
            ? treatment.nextRefillDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : null,
          // Hard-coded as "delivered" for demo; real implementation would pull from shipment model
          shipmentStep: 3,
        }
      : null,
  };
}

export async function getProgressData(userId: string, days: number = 90) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [entries, profile] = await Promise.all([
    db.progressEntry.findMany({
      where: { userId, date: { gte: since } },
      orderBy: { date: "asc" },
    }),
    db.patientProfile.findUnique({
      where: { userId },
      select: { weightLbs: true, goalWeightLbs: true, heightInches: true },
    }),
  ]);

  const weightData = entries
    .filter((e) => e.weightLbs !== null)
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: e.weightLbs,
    }));

  const measurementData = entries
    .filter((e) => e.waistInches !== null || e.hipsInches !== null)
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      waist: e.waistInches,
      hips: e.hipsInches,
      chest: e.chestInches,
    }));

  const dailyLogs = entries
    .reverse()
    .slice(0, 14)
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: e.weightLbs,
      protein: e.proteinG,
      water: e.waterOz,
      medication: e.medicationTaken,
      mood: e.moodRating,
    }));

  const latest = entries.length > 0 ? entries[entries.length - 1] : null;
  const first = entries.length > 0 ? entries[0] : null;

  return {
    weightData,
    measurementData,
    dailyLogs,
    stats: {
      currentWeight: latest?.weightLbs || profile?.weightLbs || 0,
      startWeight: first?.weightLbs || profile?.weightLbs || 0,
      goalWeight: profile?.goalWeightLbs || 0,
      weightLost: (first?.weightLbs || 0) - (latest?.weightLbs || 0),
      waistChange: (first?.waistInches || 0) - (latest?.waistInches || 0),
    },
  };
}
