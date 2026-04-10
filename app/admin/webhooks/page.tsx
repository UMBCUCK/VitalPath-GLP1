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

  return (
    <WebhooksClient
      initialEvents={JSON.parse(JSON.stringify(events))}
      initialTotal={total}
      summaryStats={{ total, successCount, failureCount }}
      eventTypes={eventTypes}
    />
  );
}
