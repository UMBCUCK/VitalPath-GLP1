import { db } from "@/lib/db";

// ── Sales Overview ──────────────────────────────────────────

export async function getSalesOverview(from: Date, to: Date) {
  const [
    orders,
    ordersWithCoupons,
    allOrders,
    products,
    leads,
    subscriptions,
  ] = await Promise.all([
    // All orders in range
    db.order.findMany({
      where: { createdAt: { gte: from, lte: to } },
      select: {
        id: true,
        totalCents: true,
        subtotalCents: true,
        discountCents: true,
        couponId: true,
        createdAt: true,
        userId: true,
        items: {
          select: {
            productId: true,
            totalCents: true,
            product: { select: { name: true, slug: true, isAddon: true } },
          },
        },
        user: {
          select: {
            createdAt: true,
          },
        },
      },
    }),
    // Orders with coupons
    db.order.findMany({
      where: {
        createdAt: { gte: from, lte: to },
        couponId: { not: null },
      },
      select: {
        id: true,
        discountCents: true,
        couponId: true,
        coupon: { select: { code: true, type: true, valuePct: true, valueCents: true } },
      },
    }),
    // Total orders ever for returning customer check
    db.order.groupBy({
      by: ["userId"],
      _count: true,
    }),
    // Products for mapping
    db.product.findMany({
      select: { id: true, name: true, slug: true, isAddon: true },
    }),
    // Leads with UTM data that converted
    db.lead.findMany({
      where: {
        convertedAt: { gte: from, lte: to },
        userId: { not: null },
      },
      select: { userId: true, utmSource: true, utmMedium: true },
    }),
    // New subscriptions in range
    db.subscription.count({
      where: { createdAt: { gte: from, lte: to } },
    }),
  ]);

  // Total revenue & orders
  const totalRevenue = orders.reduce((s, o) => s + o.totalCents, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Revenue by day
  const revenueByDay: Record<string, { date: string; revenue: number; orders: number }> = {};
  const dayMs = 86400000;
  for (let d = new Date(from); d <= to; d = new Date(d.getTime() + dayMs)) {
    const key = d.toISOString().slice(0, 10);
    revenueByDay[key] = { date: key, revenue: 0, orders: 0 };
  }
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    if (revenueByDay[key]) {
      revenueByDay[key].revenue += o.totalCents;
      revenueByDay[key].orders += 1;
    }
  }

  // Revenue by product
  const productRevMap: Record<string, { name: string; revenue: number; orders: number; isAddon: boolean }> = {};
  for (const o of orders) {
    for (const item of o.items) {
      const key = item.productId;
      if (!productRevMap[key]) {
        productRevMap[key] = {
          name: item.product?.name || "Unknown",
          revenue: 0,
          orders: 0,
          isAddon: item.product?.isAddon || false,
        };
      }
      productRevMap[key].revenue += item.totalCents;
      productRevMap[key].orders += 1;
    }
  }

  // Revenue by source (UTM)
  const userSourceMap: Record<string, string> = {};
  for (const lead of leads) {
    if (lead.userId) {
      userSourceMap[lead.userId] = lead.utmSource || "Direct";
    }
  }

  const sourceRevMap: Record<string, { source: string; revenue: number; orders: number; users: number }> = {};
  for (const o of orders) {
    const source = userSourceMap[o.userId] || "Organic";
    if (!sourceRevMap[source]) {
      sourceRevMap[source] = { source, revenue: 0, orders: 0, users: 0 };
    }
    sourceRevMap[source].revenue += o.totalCents;
    sourceRevMap[source].orders += 1;
  }
  // Count unique users per source
  const sourceUsers: Record<string, Set<string>> = {};
  for (const o of orders) {
    const source = userSourceMap[o.userId] || "Organic";
    if (!sourceUsers[source]) sourceUsers[source] = new Set();
    sourceUsers[source].add(o.userId);
  }
  for (const [source, users] of Object.entries(sourceUsers)) {
    if (sourceRevMap[source]) sourceRevMap[source].users = users.size;
  }

  // New vs returning
  const orderCountByUser: Record<string, number> = {};
  for (const g of allOrders) {
    orderCountByUser[g.userId] = g._count;
  }
  let newCustomerRevenue = 0;
  let returningCustomerRevenue = 0;
  for (const o of orders) {
    if ((orderCountByUser[o.userId] || 0) <= 1) {
      newCustomerRevenue += o.totalCents;
    } else {
      returningCustomerRevenue += o.totalCents;
    }
  }

  // Coupon impact
  const totalDiscount = ordersWithCoupons.reduce((s, o) => s + o.discountCents, 0);
  const couponCodeCounts: Record<string, { code: string; uses: number; discount: number }> = {};
  for (const o of ordersWithCoupons) {
    const code = o.coupon?.code || "Unknown";
    if (!couponCodeCounts[code]) {
      couponCodeCounts[code] = { code, uses: 0, discount: 0 };
    }
    couponCodeCounts[code].uses += 1;
    couponCodeCounts[code].discount += o.discountCents;
  }
  const topCoupon = Object.values(couponCodeCounts).sort((a, b) => b.uses - a.uses)[0] || null;

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    newSubscriptions: subscriptions,
    revenueByDay: Object.values(revenueByDay),
    revenueByProduct: Object.values(productRevMap).sort((a, b) => b.revenue - a.revenue),
    revenueBySource: Object.values(sourceRevMap).sort((a, b) => b.revenue - a.revenue),
    newCustomerRevenue,
    returningCustomerRevenue,
    couponImpact: {
      totalDiscount,
      ordersWithCoupons: ordersWithCoupons.length,
      avgDiscountPerOrder: ordersWithCoupons.length > 0 ? Math.round(totalDiscount / ordersWithCoupons.length) : 0,
      topCoupon,
      coupons: Object.values(couponCodeCounts).sort((a, b) => b.uses - a.uses),
    },
  };
}

// ── Sales Performance (Sellers / Channels) ──────────────────

export async function getSalesPerformance(from: Date, to: Date) {
  const [resellers, commissions, leads] = await Promise.all([
    db.resellerProfile.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        displayName: true,
        companyName: true,
        tier: true,
        commissionType: true,
        commissionPct: true,
        totalSales: true,
        totalRevenue: true,
        totalCommission: true,
        totalCustomers: true,
        conversionRate: true,
      },
    }),
    db.commission.findMany({
      where: { createdAt: { gte: from, lte: to } },
      select: {
        resellerId: true,
        amountCents: true,
        status: true,
        type: true,
      },
    }),
    db.lead.findMany({
      where: { createdAt: { gte: from, lte: to } },
      select: { utmSource: true, utmMedium: true, convertedAt: true },
    }),
  ]);

  // Revenue by reseller (from commissions in period)
  const resellerCommMap: Record<string, { earned: number; orders: number }> = {};
  for (const c of commissions) {
    if (!resellerCommMap[c.resellerId]) {
      resellerCommMap[c.resellerId] = { earned: 0, orders: 0 };
    }
    resellerCommMap[c.resellerId].earned += c.amountCents;
    resellerCommMap[c.resellerId].orders += 1;
  }

  const resellerPerformance = resellers.map((r) => ({
    id: r.id,
    name: r.displayName,
    company: r.companyName,
    tier: r.tier,
    commissionType: r.commissionType,
    commissionPct: r.commissionPct,
    totalRevenue: r.totalRevenue,
    totalCommission: r.totalCommission,
    totalCustomers: r.totalCustomers,
    conversionRate: r.conversionRate,
    periodEarned: resellerCommMap[r.id]?.earned || 0,
    periodOrders: resellerCommMap[r.id]?.orders || 0,
  })).sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Channel performance from leads
  const channelMap: Record<string, { source: string; leads: number; conversions: number }> = {};
  for (const l of leads) {
    const source = l.utmSource || "Direct";
    if (!channelMap[source]) {
      channelMap[source] = { source, leads: 0, conversions: 0 };
    }
    channelMap[source].leads += 1;
    if (l.convertedAt) channelMap[source].conversions += 1;
  }

  const channels = Object.values(channelMap)
    .map((ch) => ({
      ...ch,
      conversionRate: ch.leads > 0 ? Math.round((ch.conversions / ch.leads) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.conversions - a.conversions);

  return {
    resellerPerformance,
    channels,
    totalCommissionPaid: commissions
      .filter((c) => c.status === "PAID")
      .reduce((s, c) => s + c.amountCents, 0),
    totalCommissionPending: commissions
      .filter((c) => c.status === "PENDING" || c.status === "APPROVED")
      .reduce((s, c) => s + c.amountCents, 0),
  };
}

// ── Sales Trend (sparklines) ────────────────────────────────

export async function getSalesTrend(days: number) {
  const from = new Date();
  from.setDate(from.getDate() - days);
  from.setHours(0, 0, 0, 0);

  const orders = await db.order.findMany({
    where: { createdAt: { gte: from } },
    select: { totalCents: true, createdAt: true },
  });

  const newSubs = await db.subscription.findMany({
    where: { createdAt: { gte: from } },
    select: { createdAt: true },
  });

  const dayMs = 86400000;
  const trend: { date: string; revenue: number; orders: number; avgOrderValue: number; newSubscriptions: number }[] = [];

  for (let i = days; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart.getTime() + dayMs);
    const key = dayStart.toISOString().slice(0, 10);

    const dayOrders = orders.filter((o) => o.createdAt >= dayStart && o.createdAt < dayEnd);
    const dayRev = dayOrders.reduce((s, o) => s + o.totalCents, 0);
    const daySubs = newSubs.filter((s) => s.createdAt >= dayStart && s.createdAt < dayEnd).length;

    trend.push({
      date: key,
      revenue: dayRev,
      orders: dayOrders.length,
      avgOrderValue: dayOrders.length > 0 ? Math.round(dayRev / dayOrders.length) : 0,
      newSubscriptions: daySubs,
    });
  }

  return trend;
}
