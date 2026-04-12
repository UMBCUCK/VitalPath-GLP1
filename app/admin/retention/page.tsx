export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { RetentionClient } from "./retention-client";

export default async function RetentionPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const now = new Date();

  // Monthly cohorts: users grouped by registration month
  const users = await db.user.findMany({
    where: { role: "PATIENT" },
    select: { id: true, createdAt: true },
  });

  const subscriptions = await db.subscription.findMany({
    select: { userId: true, status: true, createdAt: true, canceledAt: true },
  });

  // Build cohort data: for each month, how many users signed up and how many are still active
  const cohortMap: Record<string, { total: number; active: number; churned: number }> = {};
  for (const user of users) {
    const monthKey = `${user.createdAt.getFullYear()}-${String(user.createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (!cohortMap[monthKey]) cohortMap[monthKey] = { total: 0, active: 0, churned: 0 };
    cohortMap[monthKey].total++;

    const userSub = subscriptions.find((s) => s.userId === user.id);
    if (userSub?.status === "ACTIVE") cohortMap[monthKey].active++;
    if (userSub?.status === "CANCELED") cohortMap[monthKey].churned++;
  }

  const cohortData = Object.entries(cohortMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      ...data,
      retentionRate: data.total > 0 ? Math.round((data.active / data.total) * 100) : 0,
    }));

  // Feature adoption: count users who have used each feature
  const [progressUsers, messageUsers, photoUsers, referralUsers, checkInUsers] = await Promise.all([
    db.progressEntry.groupBy({ by: ["userId"], _count: true }).then((r) => r.length),
    db.message.groupBy({ by: ["userId"], where: { direction: "OUTBOUND" }, _count: true }).then((r) => r.length),
    db.progressPhoto.groupBy({ by: ["userId"], _count: true }).then((r) => r.length),
    db.referralCode.count({ where: { totalReferred: { gt: 0 } } }),
    db.progressEntry.groupBy({ by: ["userId"], where: { moodRating: { not: null } }, _count: true }).then((r) => r.length),
  ]);

  const totalPatients = users.length || 1;
  const featureAdoption = [
    { feature: "Progress Tracking", users: progressUsers, rate: Math.round((progressUsers / totalPatients) * 100) },
    { feature: "Messaging", users: messageUsers, rate: Math.round((messageUsers / totalPatients) * 100) },
    { feature: "Photo Uploads", users: photoUsers, rate: Math.round((photoUsers / totalPatients) * 100) },
    { feature: "Referrals", users: referralUsers, rate: Math.round((referralUsers / totalPatients) * 100) },
    { feature: "Check-Ins", users: checkInUsers, rate: Math.round((checkInUsers / totalPatients) * 100) },
  ];

  // Churn signals: users with past_due status or no activity in 14+ days
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);
  const inactiveCount = await db.user.count({
    where: {
      role: "PATIENT",
      progressEntries: { none: { date: { gte: fourteenDaysAgo } } },
      subscriptions: { some: { status: "ACTIVE" } },
    },
  });
  const pastDueCount = await db.subscription.count({ where: { status: "PAST_DUE" } });

  return (
    <RetentionClient
      cohortData={cohortData}
      featureAdoption={featureAdoption}
      churnSignals={{ inactive14d: inactiveCount, pastDue: pastDueCount, totalActive: subscriptions.filter((s) => s.status === "ACTIVE").length }}
    />
  );
}
