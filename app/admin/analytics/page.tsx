import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);

  // Revenue by week (last 90 days)
  const orders = await db.order.findMany({
    where: { createdAt: { gte: ninetyDaysAgo } },
    select: { totalCents: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by week
  const revenueByWeek: Record<string, number> = {};
  orders.forEach((o: { totalCents: number; createdAt: Date }) => {
    const weekStart = new Date(o.createdAt);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    revenueByWeek[key] = (revenueByWeek[key] || 0) + o.totalCents;
  });
  const revenueData = Object.entries(revenueByWeek).map(([week, cents]) => ({ week, revenue: cents / 100 }));

  // Funnel events (last 30 days)
  const events = await db.analyticsEvent.groupBy({
    by: ["eventName"],
    where: { timestamp: { gte: thirtyDaysAgo } },
    _count: true,
  });
  const funnelMap: Record<string, number> = {};
  events.forEach((e: { eventName: string; _count: number }) => { funnelMap[e.eventName] = e._count; });

  const funnelData = [
    { stage: "Quiz Start", count: funnelMap["quiz_start"] || 0 },
    { stage: "Quiz Complete", count: funnelMap["quiz_complete"] || 0 },
    { stage: "Intake Complete", count: funnelMap["intake_complete"] || 0 },
    { stage: "Checkout Start", count: funnelMap["checkout_start"] || 0 },
    { stage: "Subscribed", count: funnelMap["checkout_complete"] || 0 },
  ];

  // Top metrics
  const totalRevenue = orders.reduce((s: number, o: { totalCents: number }) => s + o.totalCents, 0);
  const activeMembers = await db.subscription.count({ where: { status: "ACTIVE" } });
  const newThisMonth = await db.user.count({ where: { createdAt: { gte: thirtyDaysAgo }, role: "PATIENT" } });
  const referralConversions = await db.referral.count({ where: { status: "CONVERTED" } });

  return (
    <AnalyticsClient
      revenueData={revenueData}
      funnelData={funnelData}
      metrics={{
        totalRevenue90d: totalRevenue,
        activeMembers,
        newPatientsMonth: newThisMonth,
        referralConversions,
        totalOrders: orders.length,
      }}
    />
  );
}
