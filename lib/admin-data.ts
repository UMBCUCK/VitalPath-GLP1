import { db } from "@/lib/db";

export async function getAdminDashboardData() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    activeSubscriptions,
    totalRevenue,
    pendingIntakes,
    recentSubscriptions,
    productCount,
    claimStats,
    canceledRecent,
  ] = await Promise.all([
    db.user.count({ where: { role: "PATIENT" } }),
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.order.aggregate({ _sum: { totalCents: true } }),
    db.intakeSubmission.count({ where: { status: { in: ["SUBMITTED", "NEEDS_INFO"] } } }),
    db.subscription.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    }),
    db.product.count({ where: { isActive: true } }),
    db.claim.groupBy({ by: ["status"], _count: true }),
    db.subscription.count({
      where: { status: "CANCELED", canceledAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  const totalSubs = activeSubscriptions + canceledRecent;
  const churnRate = totalSubs > 0 ? (canceledRecent / totalSubs) * 100 : 0;

  return {
    stats: {
      revenue: totalRevenue._sum.totalCents || 0,
      activeMembers: activeSubscriptions,
      totalPatients: totalUsers,
      pendingIntakes,
      productCount,
      churnRate: Math.round(churnRate * 10) / 10,
    },
    recentSubscriptions: recentSubscriptions.map((s) => ({
      id: s.id,
      customerName: [s.user.firstName, s.user.lastName].filter(Boolean).join(" ") || s.user.email,
      email: s.user.email,
      planName: s.items[0]?.product?.name || "Unknown",
      status: s.status,
      amount: s.items.reduce((sum, item) => sum + item.priceInCents, 0),
      date: s.createdAt,
    })),
    claimStats: {
      approved: claimStats.find((c) => c.status === "APPROVED")?._count || 0,
      pending: claimStats.find((c) => c.status === "PENDING_REVIEW")?._count || 0,
      total: claimStats.reduce((sum, c) => sum + c._count, 0),
    },
  };
}

export async function getAdminCustomers() {
  const customers = await db.user.findMany({
    where: { role: "PATIENT" },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      profile: { select: { state: true, weightLbs: true, goalWeightLbs: true } },
      intakeSubmission: { select: { status: true, eligibilityResult: true } },
      subscriptions: {
        where: { status: { in: ["ACTIVE", "PAST_DUE", "TRIALING"] } },
        take: 1,
        include: { items: { include: { product: { select: { name: true } } } } },
      },
      progressEntries: {
        orderBy: { date: "desc" },
        take: 1,
        select: { weightLbs: true },
      },
    },
  });

  return customers.map((c) => {
    const sub = c.subscriptions[0];
    const startWeight = c.profile?.weightLbs || 0;
    const currentWeight = c.progressEntries[0]?.weightLbs || startWeight;
    return {
      id: c.id,
      name: [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email,
      email: c.email,
      state: c.profile?.state || "—",
      plan: sub?.items[0]?.product?.name || "None",
      subscriptionStatus: sub?.status || "none",
      intakeStatus: c.intakeSubmission?.status || "NOT_STARTED",
      joinDate: c.createdAt,
      weightLost: Math.round((startWeight - currentWeight) * 10) / 10,
    };
  });
}

export async function getAdminProducts() {
  return db.product.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      category: true,
      priceMonthly: true,
      isActive: true,
      isAddon: true,
      badge: true,
      stripePriceIdMonthly: true,
      features: true,
      sortOrder: true,
      _count: { select: { subscriptions: true } },
    },
  });
}
