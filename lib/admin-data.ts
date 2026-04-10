import { db } from "@/lib/db";

// ── Original queries (kept for backward compat) ───────────────

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

// ── V2: Command Center Dashboard ──────────────────────────────

export async function getAdminDashboardDataV2() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(now.getDate() - 90);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(now.getDate() - 14);

  const [
    activeSubscriptions,
    trialingSubs,
    pastDueSubs,
    canceledRecent,
    canceledPrevMonth,
    activePrevMonth,
    totalPatients,
    newPatients30d,
    newPatientsPrev30d,
    revenue90d,
    revenuePrev90d,
    pendingIntakes,
    recentOrders7d,
    recentSubs,
    recentIntakes,
    recentProgress,
    criticalAlerts,
    subscriptionItems,
  ] = await Promise.all([
    db.subscription.count({ where: { status: "ACTIVE" } }),
    db.subscription.count({ where: { status: "TRIALING" } }),
    db.subscription.count({ where: { status: "PAST_DUE" } }),
    db.subscription.count({ where: { status: "CANCELED", canceledAt: { gte: thirtyDaysAgo } } }),
    db.subscription.count({ where: { status: "CANCELED", canceledAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    db.subscription.count({ where: { status: "ACTIVE", createdAt: { lt: thirtyDaysAgo } } }),
    db.user.count({ where: { role: "PATIENT" } }),
    db.user.count({ where: { role: "PATIENT", createdAt: { gte: thirtyDaysAgo } } }),
    db.user.count({ where: { role: "PATIENT", createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    db.order.aggregate({ where: { createdAt: { gte: ninetyDaysAgo } }, _sum: { totalCents: true } }),
    db.order.aggregate({ where: { createdAt: { gte: new Date(now.getTime() - 180 * 86400000), lt: ninetyDaysAgo } }, _sum: { totalCents: true } }),
    db.intakeSubmission.count({ where: { status: { in: ["SUBMITTED", "NEEDS_INFO"] } } }),
    db.order.findMany({ where: { createdAt: { gte: new Date(now.getTime() - 7 * 86400000) } }, orderBy: { createdAt: "asc" }, select: { totalCents: true, createdAt: true } }),
    db.subscription.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true, email: true } }, items: { include: { product: { select: { name: true } } } } },
    }),
    db.intakeSubmission.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
    }),
    db.progressEntry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { firstName: true, lastName: true } } },
    }),
    db.adminAlert.count({ where: { severity: "CRITICAL", isDismissed: false } }),
    db.subscriptionItem.findMany({
      where: { subscription: { status: { in: ["ACTIVE", "TRIALING"] } } },
      select: { priceInCents: true },
    }),
  ]);

  // Compute MRR
  const mrr = subscriptionItems.reduce((sum, item) => sum + item.priceInCents, 0);
  const activeMembers = activeSubscriptions + trialingSubs;
  const arpu = activeMembers > 0 ? Math.round(mrr / activeMembers) : 0;

  // Churn rate
  const totalSubs30d = activeSubscriptions + canceledRecent;
  const churnRate = totalSubs30d > 0 ? (canceledRecent / totalSubs30d) * 100 : 0;
  const prevTotalSubs = activePrevMonth + canceledPrevMonth;
  const prevChurnRate = prevTotalSubs > 0 ? (canceledPrevMonth / prevTotalSubs) * 100 : 0;

  // Revenue
  const rev90d = revenue90d._sum.totalCents || 0;
  const prevRev90d = revenuePrev90d._sum.totalCents || 0;

  // Sparklines from 7-day orders
  const revenueSparkline: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    const dayRevenue = recentOrders7d
      .filter((o) => o.createdAt >= dayStart && o.createdAt < dayEnd)
      .reduce((sum, o) => sum + o.totalCents, 0);
    revenueSparkline.push(dayRevenue);
  }

  // At-risk count (past due + active with no recent progress)
  const inactiveActive = await db.subscription.count({
    where: {
      status: "ACTIVE",
      user: {
        progressEntries: { none: { date: { gte: fourteenDaysAgo } } },
      },
    },
  });
  const atRiskCount = pastDueSubs + inactiveActive;

  // Patient change
  const patientChange = newPatientsPrev30d > 0 ? ((newPatients30d - newPatientsPrev30d) / newPatientsPrev30d) * 100 : 0;
  const revenueChange = prevRev90d > 0 ? ((rev90d - prevRev90d) / prevRev90d) * 100 : 0;

  // Activity feed
  const activityFeed = [
    ...recentSubs.map((s) => ({
      id: `sub-${s.id}`,
      type: "subscription" as const,
      title: `New subscription: ${s.items[0]?.product?.name || "Plan"}`,
      description: [s.user.firstName, s.user.lastName].filter(Boolean).join(" ") || s.user.email,
      timestamp: s.createdAt.toISOString(),
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
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15);

  return {
    kpis: {
      mrr: { value: mrr, sparkline: revenueSparkline },
      activeMembers: { value: activeMembers, change: 0 },
      newPatients: { value: newPatients30d, change: Math.round(patientChange * 10) / 10 },
      churnRate: { value: Math.round(churnRate * 10) / 10, change: Math.round((churnRate - prevChurnRate) * 10) / 10 },
      arpu: { value: arpu, change: 0 },
      revenue90d: { value: rev90d, change: Math.round(revenueChange * 10) / 10, sparkline: revenueSparkline },
      pendingIntakes: { value: pendingIntakes },
      atRisk: { value: atRiskCount },
    },
    activityFeed,
    criticalAlerts,
    recentSubscriptions: recentSubs.map((s) => ({
      id: s.id,
      customerName: [s.user.firstName, s.user.lastName].filter(Boolean).join(" ") || s.user.email,
      email: s.user.email,
      planName: s.items[0]?.product?.name || "Unknown",
      status: s.status,
      amount: s.items.reduce((sum, item) => sum + item.priceInCents, 0),
      date: s.createdAt,
    })),
  };
}

// ── Customer queries ──────────────────────────────────────────

export async function getAdminCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
}) {
  const { page = 1, limit = 25, search, status, sort = "createdAt", order = "desc" } = params || {};

  const where: Record<string, unknown> = { role: "PATIENT" as const };

  if (search) {
    where.OR = [
      { email: { contains: search } },
      { firstName: { contains: search } },
      { lastName: { contains: search } },
    ];
  }

  if (status && status !== "all") {
    if (status === "active") {
      where.subscriptions = { some: { status: "ACTIVE" } };
    } else if (status === "past_due") {
      where.subscriptions = { some: { status: "PAST_DUE" } };
    } else if (status === "canceled") {
      where.subscriptions = { some: { status: "CANCELED" } };
    } else if (status === "no_subscription") {
      where.subscriptions = { none: {} };
    }
  }

  const [customers, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        profile: { select: { state: true, weightLbs: true, goalWeightLbs: true, healthScore: true, lifecycleStage: true } },
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
    }),
    db.user.count({ where }),
  ]);

  const rows = customers.map((c) => {
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
      healthScore: c.profile?.healthScore,
      lifecycleStage: c.profile?.lifecycleStage,
    };
  });

  return { rows, total };
}

// ── Product queries ───────────────────────────────────────────

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
      priceQuarterly: true,
      priceAnnual: true,
      isActive: true,
      isAddon: true,
      badge: true,
      stripePriceIdMonthly: true,
      stripePriceIdQuarterly: true,
      stripePriceIdAnnual: true,
      stripeProductId: true,
      features: true,
      description: true,
      sortOrder: true,
      _count: { select: { subscriptions: true } },
    },
  });
}
