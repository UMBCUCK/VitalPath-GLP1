import { db } from "@/lib/db";

export async function getMRRWaterfall(from: Date, to: Date) {
  const [newSubs, canceledSubs, allActiveItems] = await Promise.all([
    // New MRR: subscriptions created in period
    db.subscription.findMany({
      where: { createdAt: { gte: from, lte: to }, status: { in: ["ACTIVE", "TRIALING"] } },
      include: { items: { select: { priceInCents: true } } },
    }),
    // Churned MRR: subscriptions canceled in period
    db.subscription.findMany({
      where: { canceledAt: { gte: from, lte: to }, status: "CANCELED" },
      include: { items: { select: { priceInCents: true } } },
    }),
    // Current MRR
    db.subscriptionItem.aggregate({
      where: { subscription: { status: { in: ["ACTIVE", "TRIALING"] } } },
      _sum: { priceInCents: true },
    }),
  ]);

  const newMRR = newSubs.reduce((sum, s) => sum + s.items.reduce((a, i) => a + i.priceInCents, 0), 0);
  const churnedMRR = canceledSubs.reduce((sum, s) => sum + s.items.reduce((a, i) => a + i.priceInCents, 0), 0);
  const currentMRR = allActiveItems._sum.priceInCents || 0;
  const netNewMRR = newMRR - churnedMRR;

  return { currentMRR, newMRR, churnedMRR, netNewMRR, expansionMRR: 0, contractionMRR: 0 };
}

export async function getRevenueBySegment(from: Date, to: Date) {
  const orders = await db.order.findMany({
    where: { createdAt: { gte: from, lte: to } },
    include: { items: { include: { product: { select: { name: true, type: true, isAddon: true, category: true } } } } },
  });

  const byPlan: Record<string, number> = {};
  const byAddon: Record<string, number> = {};
  let totalRevenue = 0;

  for (const order of orders) {
    totalRevenue += order.totalCents;
    for (const item of order.items) {
      if (item.product.isAddon) {
        byAddon[item.product.name] = (byAddon[item.product.name] || 0) + item.totalCents;
      } else {
        byPlan[item.product.name] = (byPlan[item.product.name] || 0) + item.totalCents;
      }
    }
  }

  // Revenue by interval
  const subscriptions = await db.subscription.findMany({
    where: { status: { in: ["ACTIVE", "TRIALING"] } },
    select: { interval: true, items: { select: { priceInCents: true } } },
  });

  const byInterval: Record<string, number> = { MONTHLY: 0, QUARTERLY: 0, ANNUAL: 0 };
  for (const sub of subscriptions) {
    const mrr = sub.items.reduce((sum, i) => sum + i.priceInCents, 0);
    byInterval[sub.interval] = (byInterval[sub.interval] || 0) + mrr;
  }

  return {
    totalRevenue,
    byPlan: Object.entries(byPlan).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    byAddon: Object.entries(byAddon).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    byInterval: Object.entries(byInterval).map(([name, value]) => ({ name, value })),
  };
}

export async function getRevenueTimeSeries(from: Date, to: Date) {
  const orders = await db.order.findMany({
    where: { createdAt: { gte: from, lte: to } },
    orderBy: { createdAt: "asc" },
    select: { totalCents: true, createdAt: true },
  });

  // Group by week
  const weeks: Record<string, number> = {};
  for (const order of orders) {
    const weekStart = new Date(order.createdAt);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    weeks[key] = (weeks[key] || 0) + order.totalCents;
  }

  return Object.entries(weeks).map(([week, revenue]) => ({ week, revenue }));
}

export async function getCohortLTV() {
  // Group users by signup month, compute cumulative revenue
  const users = await db.user.findMany({
    where: { role: "PATIENT" },
    select: {
      id: true,
      createdAt: true,
      orders: { select: { totalCents: true, createdAt: true } },
    },
  });

  const cohorts: Record<string, { userCount: number; revenueByMonth: Record<number, number> }> = {};

  for (const user of users) {
    const cohortKey = `${user.createdAt.getFullYear()}-${String(user.createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (!cohorts[cohortKey]) {
      cohorts[cohortKey] = { userCount: 0, revenueByMonth: {} };
    }
    cohorts[cohortKey].userCount++;

    for (const order of user.orders) {
      const monthsSinceJoin = Math.floor(
        (order.createdAt.getTime() - user.createdAt.getTime()) / (30 * 86400000)
      );
      const month = Math.max(0, monthsSinceJoin);
      cohorts[cohortKey].revenueByMonth[month] =
        (cohorts[cohortKey].revenueByMonth[month] || 0) + order.totalCents;
    }
  }

  return Object.entries(cohorts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // last 6 months
    .map(([cohort, data]) => {
      // Compute cumulative LTV per user
      const months = Object.keys(data.revenueByMonth).map(Number).sort((a, b) => a - b);
      let cumulative = 0;
      const ltvByMonth: { month: number; ltv: number }[] = [];
      for (const m of months) {
        cumulative += data.revenueByMonth[m];
        ltvByMonth.push({ month: m, ltv: Math.round(cumulative / data.userCount) });
      }
      return { cohort, userCount: data.userCount, ltvByMonth };
    });
}

export async function getRefundMetrics(from: Date, to: Date) {
  const [refundedOrders, totalOrders] = await Promise.all([
    db.order.findMany({
      where: { status: "REFUNDED", updatedAt: { gte: from, lte: to } },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    db.order.count({ where: { createdAt: { gte: from, lte: to } } }),
  ]);

  const totalRefunded = refundedOrders.reduce((sum, o) => sum + o.totalCents, 0);
  const refundRate = totalOrders > 0 ? (refundedOrders.length / totalOrders) * 100 : 0;

  return {
    totalRefunded,
    refundCount: refundedOrders.length,
    refundRate: Math.round(refundRate * 10) / 10,
    totalOrders,
    recentRefunds: refundedOrders.map((o) => ({
      id: o.id,
      amount: o.totalCents,
      customer: [o.user.firstName, o.user.lastName].filter(Boolean).join(" ") || o.user.email,
      date: o.updatedAt,
    })),
  };
}

export async function getPayments(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  from?: Date;
  to?: Date;
}) {
  const { page = 1, limit = 25, status, search, from, to } = params;
  const where: Record<string, unknown> = {};

  if (status && status !== "all") {
    where.status = status.toUpperCase();
  }
  if (from || to) {
    where.createdAt = {};
    if (from) (where.createdAt as Record<string, unknown>).gte = from;
    if (to) (where.createdAt as Record<string, unknown>).lte = to;
  }
  if (search) {
    where.user = {
      OR: [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ],
    };
  }

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
        coupon: { select: { code: true, type: true } },
      },
    }),
    db.order.count({ where }),
  ]);

  return {
    orders: orders.map((o) => ({
      id: o.id,
      customer: [o.user.firstName, o.user.lastName].filter(Boolean).join(" ") || o.user.email,
      email: o.user.email,
      total: o.totalCents,
      subtotal: o.subtotalCents,
      discount: o.discountCents,
      tax: o.taxCents,
      status: o.status,
      items: o.items.map((i) => i.product.name),
      coupon: o.coupon?.code ?? null,
      stripePaymentId: o.stripePaymentId,
      createdAt: o.createdAt,
    })),
    total,
  };
}
