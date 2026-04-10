import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { WebhooksClient } from "./webhooks-client";

export default async function WebhooksPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [events, total] = await Promise.all([
    db.webhookEvent.findMany({
      orderBy: { processedAt: "desc" },
      take: 100,
    }),
    db.webhookEvent.count(),
  ]);

  // Summary stats
  const [successCount, failureCount] = await Promise.all([
    db.webhookEvent.count({ where: { success: true } }),
    db.webhookEvent.count({ where: { success: false } }),
  ]);

  // Distinct event types for filter dropdown
  const typeRows = await db.webhookEvent.findMany({
    select: { type: true },
    distinct: ["type"],
    orderBy: { type: "asc" },
  });
  const eventTypes = typeRows.map((r) => r.type);

  // Compute daily health for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentEvents = await db.webhookEvent.findMany({
    where: { processedAt: { gte: sevenDaysAgo } },
    select: { processedAt: true, success: true },
    orderBy: { processedAt: "asc" },
  });

  const dailyMap: Record<string, { total: number; success: number }> = {};
  for (const e of recentEvents) {
    const d = e.processedAt.toISOString().slice(0, 10);
    if (!dailyMap[d]) dailyMap[d] = { total: 0, success: 0 };
    dailyMap[d].total++;
    if (e.success) dailyMap[d].success++;
  }
  const dailyHealth = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({
      date,
      total: stats.total,
      success: stats.success,
      rate: stats.total > 0 ? (stats.success / stats.total) * 100 : 0,
    }));

  // Compute error groups
  const failedEvents = await db.webhookEvent.findMany({
    where: { success: false, errorMessage: { not: null } },
    select: { errorMessage: true },
  });
  const errorMap: Record<string, number> = {};
  for (const e of failedEvents) {
    const msg = (e.errorMessage || "Unknown error").slice(0, 80);
    errorMap[msg] = (errorMap[msg] || 0) + 1;
  }
  const errorGroups = Object.entries(errorMap)
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <WebhooksClient
      initialEvents={JSON.parse(JSON.stringify(events))}
      initialTotal={total}
      summaryStats={{ total, successCount, failureCount }}
      eventTypes={eventTypes}
      dailyHealth={dailyHealth}
      errorGroups={errorGroups}
    />
  );
}
