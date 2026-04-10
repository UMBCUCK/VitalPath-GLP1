import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ActivityClient } from "./activity-client";

export default async function ActivityPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [recentSubs, recentOrders, recentIntakes, recentProgress, recentAlerts, recentAudit] =
    await Promise.all([
      db.subscription.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true, email: true } }, items: { include: { product: { select: { name: true } } } } },
      }),
      db.order.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
      db.intakeSubmission.findMany({
        take: 15,
        orderBy: { updatedAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
      db.progressEntry.findMany({
        take: 15,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true } } },
      }),
      db.adminAlert.findMany({
        where: { isDismissed: false },
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
      db.adminAuditLog.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
    ]);

  // Merge into unified activity feed
  const feed = [
    ...recentSubs.map((s) => ({
      id: `sub-${s.id}`,
      type: "subscription" as const,
      title: `New subscription: ${s.items[0]?.product?.name || "Plan"}`,
      description: [s.user.firstName, s.user.lastName].filter(Boolean).join(" ") || s.user.email,
      timestamp: s.createdAt.toISOString(),
    })),
    ...recentOrders.map((o) => ({
      id: `order-${o.id}`,
      type: "order" as const,
      title: `Order ${o.status}: $${(o.totalCents / 100).toFixed(0)}`,
      description: [o.user.firstName, o.user.lastName].filter(Boolean).join(" ") || o.user.email,
      timestamp: o.createdAt.toISOString(),
    })),
    ...recentIntakes.map((i) => ({
      id: `intake-${i.id}`,
      type: "intake" as const,
      title: `Intake ${i.status.toLowerCase().replace(/_/g, " ")}`,
      description: [i.user.firstName, i.user.lastName].filter(Boolean).join(" ") || i.user.email,
      timestamp: i.updatedAt.toISOString(),
    })),
    ...recentProgress.map((p) => ({
      id: `progress-${p.id}`,
      type: "progress" as const,
      title: p.weightLbs ? `Weight logged: ${p.weightLbs} lbs` : "Progress entry",
      description: [p.user.firstName, p.user.lastName].filter(Boolean).join(" ") || "Patient",
      timestamp: p.createdAt.toISOString(),
    })),
    ...recentAudit.map((a) => ({
      id: `audit-${a.id}`,
      type: "audit" as const,
      title: `${a.action} on ${a.entity}`,
      description: [a.user.firstName, a.user.lastName].filter(Boolean).join(" ") || a.user.email,
      timestamp: a.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50);

  const alerts = recentAlerts.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return <ActivityClient feed={feed} alerts={alerts} />;
}
