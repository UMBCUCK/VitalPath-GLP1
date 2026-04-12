import { db } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────────

type InterventionType =
  | "SAVE_OFFER"
  | "WIN_BACK"
  | "PAUSE_OFFER"
  | "DOWNGRADE_OFFER"
  | "DISCOUNT"
  | "FREE_MONTH";

type TriggeredBy = "SYSTEM" | "ADMIN" | "CANCELLATION_FLOW";

// ─── Queries ───────────────────────────────────────────────

export async function getRetentionInterventions(
  page = 1,
  limit = 25,
  status?: string,
  type?: string
) {
  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (type && type !== "all") where.type = type;

  const [interventions, total] = await Promise.all([
    db.retentionIntervention.findMany({
      where,
      orderBy: { offeredAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.retentionIntervention.count({ where }),
  ]);

  // Enrich with user names
  const userIds = [...new Set(interventions.map((i) => i.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return {
    interventions: interventions.map((i) => {
      const user = userMap.get(i.userId);
      return {
        ...i,
        patientName: user
          ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
          : "Unknown",
        patientEmail: user?.email || "",
      };
    }),
    total,
  };
}

export async function createIntervention(
  userId: string,
  type: InterventionType,
  offerDetails: Record<string, unknown>,
  triggeredBy: TriggeredBy
) {
  // Find active subscription for the user
  const subscription = await db.subscription.findFirst({
    where: { userId, status: { in: ["ACTIVE", "PAST_DUE", "TRIALING"] } },
    select: { id: true },
  });

  return db.retentionIntervention.create({
    data: {
      userId,
      subscriptionId: subscription?.id || null,
      type,
      offerDetails: JSON.parse(JSON.stringify(offerDetails)),
      status: "OFFERED",
      triggeredBy,
      offeredAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });
}

export async function respondToIntervention(id: string, accepted: boolean) {
  const intervention = await db.retentionIntervention.findUnique({
    where: { id },
  });
  if (!intervention) throw new Error("Intervention not found");

  // Calculate revenue saved if accepted
  let revenueSaved: number | null = null;
  if (accepted && intervention.subscriptionId) {
    const subItems = await db.subscriptionItem.findMany({
      where: { subscriptionId: intervention.subscriptionId },
      select: { priceInCents: true },
    });
    const monthlyValue = subItems.reduce((sum, item) => sum + item.priceInCents, 0);

    // Estimate saved based on type
    switch (intervention.type) {
      case "DISCOUNT":
        revenueSaved = Math.round(monthlyValue * 0.8 * 3); // 80% of 3 months
        break;
      case "FREE_MONTH":
        revenueSaved = monthlyValue * 2; // They stay for 3+ months, net 2
        break;
      case "PAUSE_OFFER":
        revenueSaved = monthlyValue * 2; // Expected to resume for 2+ months
        break;
      case "WIN_BACK":
        revenueSaved = monthlyValue * 3; // Expected 3 months retention
        break;
      case "SAVE_OFFER":
        revenueSaved = monthlyValue * 3;
        break;
      case "DOWNGRADE_OFFER":
        revenueSaved = Math.round(monthlyValue * 0.5 * 3); // Half rate for 3 months
        break;
      default:
        revenueSaved = monthlyValue * 2;
    }
  }

  return db.retentionIntervention.update({
    where: { id },
    data: {
      status: accepted ? "ACCEPTED" : "DECLINED",
      respondedAt: new Date(),
      revenueSaved: accepted ? revenueSaved : null,
    },
  });
}

export async function autoTriggerInterventions() {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const created: string[] = [];

  // 1. Active subs with churnRisk > 70 → DISCOUNT (20% off next month)
  const highChurnProfiles = await db.patientProfile.findMany({
    where: { churnRisk: { gte: 70 } },
    select: { userId: true },
  });
  for (const profile of highChurnProfiles) {
    const existing = await db.retentionIntervention.findFirst({
      where: {
        userId: profile.userId,
        type: "DISCOUNT",
        status: "OFFERED",
      },
    });
    if (!existing) {
      await createIntervention(
        profile.userId,
        "DISCOUNT",
        { discountPct: 20, description: "20% off your next month" },
        "SYSTEM"
      );
      created.push(`DISCOUNT for ${profile.userId}`);
    }
  }

  // 2. Past due 3+ days → PAUSE_OFFER
  const pastDueSubs = await db.subscription.findMany({
    where: {
      status: "PAST_DUE",
      updatedAt: { lte: threeDaysAgo },
    },
    select: { userId: true, id: true },
  });
  for (const sub of pastDueSubs) {
    const existing = await db.retentionIntervention.findFirst({
      where: {
        userId: sub.userId,
        type: "PAUSE_OFFER",
        status: "OFFERED",
      },
    });
    if (!existing) {
      await createIntervention(
        sub.userId,
        "PAUSE_OFFER",
        { pauseDays: 30, description: "Pause your subscription for 30 days" },
        "SYSTEM"
      );
      created.push(`PAUSE_OFFER for ${sub.userId}`);
    }
  }

  // 3. Canceled 30-60 days ago → WIN_BACK (free month)
  const recentlyCanceled = await db.subscription.findMany({
    where: {
      status: "CANCELED",
      canceledAt: { gte: sixtyDaysAgo, lte: thirtyDaysAgo },
    },
    select: { userId: true },
  });
  for (const sub of recentlyCanceled) {
    const existing = await db.retentionIntervention.findFirst({
      where: {
        userId: sub.userId,
        type: "WIN_BACK",
        status: "OFFERED",
      },
    });
    if (!existing) {
      await createIntervention(
        sub.userId,
        "WIN_BACK",
        { freeMonths: 1, description: "Come back with a free month on us" },
        "SYSTEM"
      );
      created.push(`WIN_BACK for ${sub.userId}`);
    }
  }

  // 4. Active subs 3+ months with declining engagement → SAVE_OFFER
  const longTermSubs = await db.subscription.findMany({
    where: {
      status: "ACTIVE",
      createdAt: { lte: threeMonthsAgo },
      user: {
        progressEntries: { none: { date: { gte: fourteenDaysAgo } } },
      },
    },
    select: { userId: true },
  });
  for (const sub of longTermSubs) {
    const existing = await db.retentionIntervention.findFirst({
      where: {
        userId: sub.userId,
        type: "SAVE_OFFER",
        status: "OFFERED",
      },
    });
    if (!existing) {
      await createIntervention(
        sub.userId,
        "SAVE_OFFER",
        { discountPct: 15, description: "Special loyalty discount - 15% off for 3 months" },
        "SYSTEM"
      );
      created.push(`SAVE_OFFER for ${sub.userId}`);
    }
  }

  return { triggered: created.length, details: created };
}

export async function getRetentionMetrics() {
  const [
    totalInterventions,
    acceptedCount,
    declinedCount,
    offeredCount,
    revenueSavedAgg,
    byType,
  ] = await Promise.all([
    db.retentionIntervention.count(),
    db.retentionIntervention.count({ where: { status: "ACCEPTED" } }),
    db.retentionIntervention.count({ where: { status: "DECLINED" } }),
    db.retentionIntervention.count({ where: { status: "OFFERED" } }),
    db.retentionIntervention.aggregate({
      where: { status: "ACCEPTED" },
      _sum: { revenueSaved: true },
    }),
    db.retentionIntervention.groupBy({
      by: ["type"],
      _count: true,
    }),
  ]);

  const responded = acceptedCount + declinedCount;
  const acceptanceRate = responded > 0 ? Math.round((acceptedCount / responded) * 100) : 0;

  const typeBreakdown = byType.map((t) => ({
    type: t.type,
    count: t._count,
  }));

  return {
    totalInterventions,
    acceptedCount,
    declinedCount,
    activeOffers: offeredCount,
    acceptanceRate,
    revenueSaved: revenueSavedAgg._sum.revenueSaved || 0,
    typeBreakdown,
  };
}
