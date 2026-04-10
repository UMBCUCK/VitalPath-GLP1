import { db } from "@/lib/db";

export async function getSubscriptionHealth() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000);

  const [active, trialing, pastDue, paused, canceledRecent, newRecent] = await Promise.all([
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.subscription.count({ where: { status: "TRIALING" } }),
    db.subscription.count({ where: { status: "PAST_DUE" } }),
    db.subscription.count({ where: { status: "PAUSED" } }),
    db.subscription.count({ where: { status: "CANCELED", canceledAt: { gte: thirtyDaysAgo } } }),
    db.subscription.count({ where: { createdAt: { gte: thirtyDaysAgo }, status: { in: ["ACTIVE", "TRIALING"] } } }),
  ]);

  return {
    active,
    trialing,
    pastDue,
    paused,
    canceledRecent,
    newRecent,
    netGrowth: newRecent - canceledRecent,
  };
}

export async function getAtRiskSubscriptions(page = 1, limit = 25) {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000);

  // Combine past_due + active with no recent progress + scheduled cancellations
  const [subscriptions, total] = await Promise.all([
    db.subscription.findMany({
      where: {
        OR: [
          { status: "PAST_DUE" },
          { cancelAt: { not: null, gt: new Date() } },
          {
            status: "ACTIVE",
            user: {
              progressEntries: { none: { date: { gte: fourteenDaysAgo } } },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            progressEntries: { orderBy: { date: "desc" }, take: 1, select: { date: true } },
          },
        },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.subscription.count({
      where: {
        OR: [
          { status: "PAST_DUE" },
          { cancelAt: { not: null, gt: new Date() } },
          {
            status: "ACTIVE",
            user: {
              progressEntries: { none: { date: { gte: fourteenDaysAgo } } },
            },
          },
        ],
      },
    }),
  ]);

  return {
    subscriptions: subscriptions.map((s) => {
      let riskSignal = "Inactive 14+ days";
      if (s.status === "PAST_DUE") riskSignal = "Payment past due";
      else if (s.cancelAt) riskSignal = "Scheduled cancellation";

      const lastActivity = s.user.progressEntries[0]?.date;
      const daysInactive = lastActivity
        ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / 86400000)
        : null;

      return {
        id: s.id,
        userId: s.user.id,
        name: [s.user.firstName, s.user.lastName].filter(Boolean).join(" ") || s.user.email,
        email: s.user.email,
        plan: s.items[0]?.product?.name || "Unknown",
        status: s.status,
        riskSignal,
        daysInactive,
        cancelAt: s.cancelAt,
        amount: s.items.reduce((sum, i) => sum + i.priceInCents, 0),
      };
    }),
    total,
  };
}

export async function getSaveOfferPerformance() {
  const [saveOffers, totalCancellations] = await Promise.all([
    db.subscription.groupBy({
      by: ["saveOfferType"],
      where: { saveOfferApplied: true },
      _count: true,
    }),
    db.subscription.count({ where: { status: "CANCELED" } }),
  ]);

  const totalSaved = saveOffers.reduce((sum, s) => sum + s._count, 0);

  return {
    offers: saveOffers.map((s) => ({
      type: s.saveOfferType || "Unknown",
      count: s._count,
    })),
    totalSaved,
    totalCancellations,
    saveRate: totalCancellations > 0 ? Math.round((totalSaved / (totalSaved + totalCancellations)) * 100 * 10) / 10 : 0,
  };
}

export async function getDunningSubscriptions(page = 1, limit = 25) {
  const [subs, total] = await Promise.all([
    db.subscription.findMany({
      where: { status: "PAST_DUE" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { updatedAt: "asc" }, // oldest first
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.subscription.count({ where: { status: "PAST_DUE" } }),
  ]);

  return {
    subscriptions: subs.map((s) => {
      const daysPastDue = s.currentPeriodEnd
        ? Math.max(0, Math.floor((Date.now() - new Date(s.currentPeriodEnd).getTime()) / 86400000))
        : 0;
      return {
        id: s.id,
        userId: s.user.id,
        name: [s.user.firstName, s.user.lastName].filter(Boolean).join(" ") || s.user.email,
        email: s.user.email,
        plan: s.items[0]?.product?.name || "Unknown",
        amount: s.items.reduce((sum, i) => sum + i.priceInCents, 0),
        daysPastDue,
        periodEnd: s.currentPeriodEnd,
      };
    }),
    total,
  };
}
