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

export async function getAllSubscriptions(
  page = 1,
  limit = 50,
  status?: string,
  search?: string,
  resellerId?: string
) {
  const where: any = {};
  if (status && status !== "all") where.status = status.toUpperCase();
  if (resellerId) where.referredByReseller = resellerId;
  if (search) {
    where.user = {
      OR: [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ],
    };
  }

  const [subscriptions, total] = await Promise.all([
    db.subscription.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            orders: {
              where: { status: { notIn: ["CANCELED", "REFUNDED"] } },
              select: { createdAt: true, totalCents: true },
              orderBy: { createdAt: "asc" },
            },
            profile: { select: { state: true } },
          },
        },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.subscription.count({ where }),
  ]);

  return {
    subscriptions: subscriptions.map((s) => {
      const now = Date.now();
      const startMs = new Date(s.createdAt).getTime();
      const durationDays = Math.floor((now - startMs) / 86400000);
      const durationMonths = Math.floor(durationDays / 30);

      // Detect payment gap months (months with no payment after subscription started)
      const paymentMonths = new Set(
        s.user.orders.map((o) => {
          const d = new Date(o.createdAt);
          return `${d.getFullYear()}-${d.getMonth()}`;
        })
      );
      const gaps: string[] = [];
      const startDate = new Date(s.createdAt);
      const endDate = new Date();
      // Only check gaps if subscription is older than 1 month
      if (durationDays > 35 && s.status !== "CANCELED") {
        for (
          let d = new Date(startDate.getFullYear(), startDate.getMonth() + 1);
          d < endDate;
          d.setMonth(d.getMonth() + 1)
        ) {
          const isCurrentMonth =
            d.getFullYear() === endDate.getFullYear() &&
            d.getMonth() === endDate.getMonth();
          if (!isCurrentMonth) {
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            if (!paymentMonths.has(key)) {
              gaps.push(
                d.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
              );
            }
          }
        }
      }

      const totalPaid = s.user.orders.reduce((sum, o) => sum + o.totalCents, 0);
      const isArchived = s.user.email.startsWith("ARCHIVED:");
      const displayEmail = isArchived
        ? s.user.email.replace(/^ARCHIVED:\d+_/, "")
        : s.user.email;
      const displayName =
        [s.user.firstName, s.user.lastName].filter(Boolean).join(" ") ||
        displayEmail;

      return {
        id: s.id,
        userId: s.user.id,
        name: displayName,
        email: displayEmail,
        isArchived,
        state: s.user.profile?.state || null,
        plan: s.items[0]?.product?.name || "Unknown",
        status: s.status,
        interval: s.interval,
        startDate: s.createdAt,
        durationDays,
        durationMonths,
        amount: s.items.reduce((sum, i) => sum + i.priceInCents, 0),
        totalPaid,
        orderCount: s.user.orders.length,
        paymentGaps: gaps,
        currentPeriodStart: s.currentPeriodStart,
        currentPeriodEnd: s.currentPeriodEnd,
        cancelAt: s.cancelAt,
        canceledAt: s.canceledAt,
        cancelReason: s.cancelReason,
        saveOfferApplied: s.saveOfferApplied,
        saveOfferType: s.saveOfferType,
        pausedUntil: s.pausedUntil,
        referredByReseller: s.referredByReseller,
        adminLocked: s.adminLocked,
        adminNotes: s.adminNotes,
        stripeSubscriptionId: s.stripeSubscriptionId,
      };
    }),
    total,
  };
}

export async function getResellerSubscriberStats() {
  const resellers = await db.resellerProfile.findMany({
    orderBy: { totalSales: "desc" },
  });

  // Fetch associated user data separately since there's no relation defined
  const userIds = resellers.map((r) => r.userId);
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  // Attach user data to resellers
  const resellersWithUser = resellers.map((r) => ({
    ...r,
    user: userMap.get(r.userId) || { firstName: null, lastName: null, email: "unknown" },
  }));

  const stats = await Promise.all(
    resellersWithUser.map(async (r) => {
      const [activeCount, totalCount, subs] = await Promise.all([
        db.subscription.count({
          where: {
            referredByReseller: r.id,
            status: { in: ["ACTIVE", "TRIALING"] },
          },
        }),
        db.subscription.count({ where: { referredByReseller: r.id } }),
        db.subscription.findMany({
          where: { referredByReseller: r.id },
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
            items: { select: { priceInCents: true } },
          },
          take: 10,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      const mrr = subs
        .filter((s) => s.status === "ACTIVE" || s.status === "TRIALING")
        .reduce(
          (sum, s) => sum + s.items.reduce((i, item) => i + item.priceInCents, 0),
          0
        );

      return {
        id: r.id,
        displayName: r.displayName,
        companyName: r.companyName,
        contactEmail: r.contactEmail,
        tier: r.tier,
        status: r.status,
        activeSubscribers: activeCount,
        totalSubscribers: totalCount,
        totalSales: r.totalSales,
        totalRevenue: r.totalRevenue,
        totalCommission: r.totalCommission,
        mrr,
        commissionPct: r.commissionPct,
        commissionType: r.commissionType,
        recentSubscribers: subs.map((s) => ({
          id: s.id,
          name:
            [s.user.firstName, s.user.lastName].filter(Boolean).join(" ") ||
            s.user.email,
          email: s.user.email,
          status: s.status,
          amount: s.items.reduce((sum, i) => sum + i.priceInCents, 0),
        })),
      };
    })
  );

  return stats;
}
