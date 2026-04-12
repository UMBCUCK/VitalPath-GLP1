export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdverseEventsClient } from "./adverse-events-client";

export default async function AdverseEventsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [events, total] = await Promise.all([
    db.adverseEventReport.findMany({
      orderBy: { reportedAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }),
    db.adverseEventReport.count(),
  ]);

  // Severity breakdown
  const severityCounts = {
    mild: await db.adverseEventReport.count({ where: { severity: "MILD" } }),
    moderate: await db.adverseEventReport.count({ where: { severity: "MODERATE" } }),
    severe: await db.adverseEventReport.count({ where: { severity: "SEVERE" } }),
    lifeThreatening: await db.adverseEventReport.count({
      where: { severity: "LIFE_THREATENING" },
    }),
    unresolved: await db.adverseEventReport.count({
      where: { resolvedAt: null },
    }),
    unreviewed: await db.adverseEventReport.count({
      where: { reviewedBy: null },
    }),
  };

  return (
    <AdverseEventsClient
      initialEvents={JSON.parse(JSON.stringify(events))}
      initialTotal={total}
      severityCounts={severityCounts}
    />
  );
}
