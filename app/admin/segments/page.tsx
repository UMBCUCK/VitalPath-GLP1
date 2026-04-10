import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SegmentsClient } from "./segments-client";

export default async function SegmentsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  // Run all segment queries in parallel
  const [highValueUsers, atRiskUsers, powerUsers, newUsers, reengagementUsers] =
    await Promise.all([
      // High-Value: users with orders totaling > $1,000 (100000 cents)
      db.user.findMany({
        where: {
          role: "PATIENT",
          orders: { some: {} },
        },
        select: {
          id: true,
          orders: { select: { totalCents: true } },
        },
      }),

      // At-Risk: healthScore < 40 AND active subscription
      db.user.count({
        where: {
          role: "PATIENT",
          profile: { healthScore: { lt: 40 } },
          subscriptions: { some: { status: "ACTIVE" } },
        },
      }),

      // Power Users: 10+ progress entries
      db.user.findMany({
        where: {
          role: "PATIENT",
          progressEntries: { some: {} },
        },
        select: {
          id: true,
          _count: { select: { progressEntries: true } },
        },
      }),

      // New: created in last 30 days with role PATIENT
      db.user.count({
        where: {
          role: "PATIENT",
          createdAt: { gte: thirtyDaysAgo },
        },
      }),

      // Re-engagement: canceled subscription, canceled 30-90 days ago
      db.user.count({
        where: {
          role: "PATIENT",
          subscriptions: {
            some: {
              status: "CANCELED",
              canceledAt: { gte: ninetyDaysAgo, lte: thirtyDaysAgo },
            },
          },
        },
      }),
    ]);

  // Post-filter High-Value (sum order totals > 100000 cents)
  const highValueCount = highValueUsers.filter((u) => {
    const total = u.orders.reduce((sum, o) => sum + o.totalCents, 0);
    return total > 100000;
  }).length;

  // Post-filter Power Users (10+ progress entries)
  const powerUserCount = powerUsers.filter((u) => u._count.progressEntries >= 10).length;

  const segments = [
    {
      key: "high-value",
      name: "High-Value",
      count: highValueCount,
      description: "Patients with over $1,000 in total orders",
      color: "gold" as const,
    },
    {
      key: "at-risk",
      name: "At-Risk",
      count: atRiskUsers,
      description: "Active subscribers with a health score below 40",
      color: "red" as const,
    },
    {
      key: "power-users",
      name: "Power Users",
      count: powerUserCount,
      description: "Patients with 10 or more progress entries",
      color: "teal" as const,
    },
    {
      key: "new",
      name: "New",
      count: newUsers,
      description: "Patients who joined within the last 30 days",
      color: "blue" as const,
    },
    {
      key: "re-engagement",
      name: "Re-engagement",
      count: reengagementUsers,
      description: "Canceled subscribers from 30-90 days ago",
      color: "amber" as const,
    },
  ];

  return <SegmentsClient segments={segments} />;
}
