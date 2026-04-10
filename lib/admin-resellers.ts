import { db } from "@/lib/db";

// ── Types ─────────────────────────────────────────────────────

interface TieredRate {
  minSales: number;
  maxSales?: number;
  rate: number;
}

// ── List resellers ────────────────────────────────────────────

export async function getResellers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const { page = 1, limit = 25, search, status } = params || {};

  const where: Record<string, unknown> = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { displayName: { contains: search } },
      { companyName: { contains: search } },
      { contactEmail: { contains: search } },
    ];
  }

  const [resellers, total] = await Promise.all([
    db.resellerProfile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { commissions: true } },
      },
    }),
    db.resellerProfile.count({ where }),
  ]);

  return {
    resellers: resellers.map((r) => ({
      id: r.id,
      userId: r.userId,
      displayName: r.displayName,
      companyName: r.companyName,
      contactEmail: r.contactEmail,
      contactPhone: r.contactPhone,
      tier: r.tier,
      status: r.status,
      commissionType: r.commissionType,
      commissionPct: r.commissionPct,
      commissionFlat: r.commissionFlat,
      commissionCap: r.commissionCap,
      tieredRates: r.tieredRates as TieredRate[] | null,
      subscriptionCommissionEnabled: r.subscriptionCommissionEnabled,
      subscriptionCommissionPct: r.subscriptionCommissionPct,
      maxRecurringMonths: r.maxRecurringMonths,
      totalSales: r.totalSales,
      totalRevenue: r.totalRevenue,
      totalCommission: r.totalCommission,
      totalCustomers: r.totalCustomers,
      conversionRate: r.conversionRate,
      lastSaleAt: r.lastSaleAt,
      adminNotes: r.adminNotes,
      commissionCount: r._count.commissions,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    })),
    total,
    page,
    limit,
  };
}

// ── Get single reseller ───────────────────────────────────────

export async function getReseller(id: string) {
  const reseller = await db.resellerProfile.findUnique({
    where: { id },
    include: {
      commissions: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!reseller) return null;

  return {
    ...reseller,
    tieredRates: reseller.tieredRates as TieredRate[] | null,
    commissions: reseller.commissions.map((c) => ({
      id: c.id,
      resellerId: c.resellerId,
      orderId: c.orderId,
      subscriptionId: c.subscriptionId,
      customerId: c.customerId,
      type: c.type,
      amountCents: c.amountCents,
      status: c.status,
      paidAt: c.paidAt,
      periodStart: c.periodStart,
      periodEnd: c.periodEnd,
      notes: c.notes,
      createdAt: c.createdAt,
    })),
  };
}

// ── Create reseller ───────────────────────────────────────────

export async function createReseller(data: {
  userId: string;
  displayName: string;
  companyName?: string;
  contactEmail: string;
  contactPhone?: string;
  tier?: string;
  commissionType?: string;
  commissionPct?: number;
  commissionFlat?: number;
  commissionCap?: number;
  tieredRates?: TieredRate[];
  subscriptionCommissionEnabled?: boolean;
  subscriptionCommissionPct?: number;
  maxRecurringMonths?: number;
  adminNotes?: string;
}) {
  return db.resellerProfile.create({
    data: {
      userId: data.userId,
      displayName: data.displayName,
      companyName: data.companyName || null,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || null,
      tier: data.tier || "STANDARD",
      status: "ACTIVE",
      commissionType: data.commissionType || "PERCENTAGE",
      commissionPct: data.commissionPct ?? 15.0,
      commissionFlat: data.commissionFlat || null,
      commissionCap: data.commissionCap || null,
      tieredRates: data.tieredRates ? (data.tieredRates as never) : undefined,
      subscriptionCommissionEnabled: data.subscriptionCommissionEnabled ?? true,
      subscriptionCommissionPct: data.subscriptionCommissionPct ?? 10.0,
      maxRecurringMonths: data.maxRecurringMonths || null,
      adminNotes: data.adminNotes || null,
    },
  });
}

// ── Update reseller ───────────────────────────────────────────

export async function updateReseller(
  id: string,
  data: Partial<{
    displayName: string;
    companyName: string | null;
    contactEmail: string;
    contactPhone: string | null;
    tier: string;
    status: string;
    commissionType: string;
    commissionPct: number | null;
    commissionFlat: number | null;
    commissionCap: number | null;
    tieredRates: TieredRate[] | null;
    subscriptionCommissionEnabled: boolean;
    subscriptionCommissionPct: number | null;
    maxRecurringMonths: number | null;
    adminNotes: string | null;
  }>
) {
  const updateData: Record<string, unknown> = {};

  if (data.displayName !== undefined) updateData.displayName = data.displayName;
  if (data.companyName !== undefined) updateData.companyName = data.companyName;
  if (data.contactEmail !== undefined) updateData.contactEmail = data.contactEmail;
  if (data.contactPhone !== undefined) updateData.contactPhone = data.contactPhone;
  if (data.tier !== undefined) updateData.tier = data.tier;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.commissionType !== undefined) updateData.commissionType = data.commissionType;
  if (data.commissionPct !== undefined) updateData.commissionPct = data.commissionPct;
  if (data.commissionFlat !== undefined) updateData.commissionFlat = data.commissionFlat;
  if (data.commissionCap !== undefined) updateData.commissionCap = data.commissionCap;
  if (data.tieredRates !== undefined) updateData.tieredRates = data.tieredRates as never;
  if (data.subscriptionCommissionEnabled !== undefined) updateData.subscriptionCommissionEnabled = data.subscriptionCommissionEnabled;
  if (data.subscriptionCommissionPct !== undefined) updateData.subscriptionCommissionPct = data.subscriptionCommissionPct;
  if (data.maxRecurringMonths !== undefined) updateData.maxRecurringMonths = data.maxRecurringMonths;
  if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes;

  return db.resellerProfile.update({
    where: { id },
    data: updateData,
  });
}

// ── Reseller performance metrics ──────────────────────────────

export async function getResellerPerformance(resellerId: string) {
  const reseller = await db.resellerProfile.findUnique({
    where: { id: resellerId },
    include: {
      commissions: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!reseller) return null;

  // Group commissions by month
  const salesByMonth: Record<string, { sales: number; revenue: number; commission: number }> = {};
  for (const c of reseller.commissions) {
    const key = `${c.createdAt.getFullYear()}-${String(c.createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (!salesByMonth[key]) {
      salesByMonth[key] = { sales: 0, revenue: 0, commission: 0 };
    }
    salesByMonth[key].sales++;
    salesByMonth[key].commission += c.amountCents;
  }

  // Commission breakdown by type
  const commissionByType: Record<string, { count: number; total: number }> = {};
  for (const c of reseller.commissions) {
    if (!commissionByType[c.type]) {
      commissionByType[c.type] = { count: 0, total: 0 };
    }
    commissionByType[c.type].count++;
    commissionByType[c.type].total += c.amountCents;
  }

  // Commission breakdown by status
  const commissionByStatus: Record<string, { count: number; total: number }> = {};
  for (const c of reseller.commissions) {
    if (!commissionByStatus[c.status]) {
      commissionByStatus[c.status] = { count: 0, total: 0 };
    }
    commissionByStatus[c.status].count++;
    commissionByStatus[c.status].total += c.amountCents;
  }

  return {
    salesByMonth: Object.entries(salesByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data })),
    commissionByType: Object.entries(commissionByType).map(([type, data]) => ({ type, ...data })),
    commissionByStatus: Object.entries(commissionByStatus).map(([status, data]) => ({ status, ...data })),
    totalCommissions: reseller.commissions.length,
    pendingCommission: reseller.commissions
      .filter((c) => c.status === "PENDING")
      .reduce((sum, c) => sum + c.amountCents, 0),
    approvedCommission: reseller.commissions
      .filter((c) => c.status === "APPROVED")
      .reduce((sum, c) => sum + c.amountCents, 0),
    paidCommission: reseller.commissions
      .filter((c) => c.status === "PAID")
      .reduce((sum, c) => sum + c.amountCents, 0),
  };
}

// ── Calculate commission for an order ─────────────────────────

export function calculateCommission(
  reseller: {
    commissionType: string;
    commissionPct: number | null;
    commissionFlat: number | null;
    commissionCap: number | null;
    tieredRates: unknown;
    subscriptionCommissionEnabled: boolean;
    subscriptionCommissionPct: number | null;
    totalSales: number;
  },
  orderAmountCents: number,
  isRecurring = false
): number {
  // For recurring commissions
  if (isRecurring) {
    if (!reseller.subscriptionCommissionEnabled) return 0;
    const pct = reseller.subscriptionCommissionPct ?? reseller.commissionPct ?? 10;
    return Math.round(orderAmountCents * (pct / 100));
  }

  let commission = 0;

  switch (reseller.commissionType) {
    case "PERCENTAGE": {
      const pct = reseller.commissionPct ?? 15;
      commission = Math.round(orderAmountCents * (pct / 100));
      break;
    }
    case "FLAT": {
      commission = reseller.commissionFlat ?? 0;
      break;
    }
    case "TIERED": {
      const tiers = (reseller.tieredRates as TieredRate[] | null) || [];
      const currentSales = reseller.totalSales;
      // Find applicable tier
      let rate = 10; // default
      for (const tier of tiers) {
        if (currentSales >= tier.minSales && (tier.maxSales === undefined || currentSales <= tier.maxSales)) {
          rate = tier.rate;
        }
      }
      commission = Math.round(orderAmountCents * (rate / 100));
      break;
    }
  }

  // Apply cap if set
  if (reseller.commissionCap && commission > reseller.commissionCap) {
    commission = reseller.commissionCap;
  }

  return commission;
}

// ── List commissions ──────────────────────────────────────────

export async function getCommissions(params?: {
  resellerId?: string;
  page?: number;
  limit?: number;
  status?: string;
}) {
  const { resellerId, page = 1, limit = 25, status } = params || {};

  const where: Record<string, unknown> = {};
  if (resellerId) where.resellerId = resellerId;
  if (status && status !== "all") where.status = status;

  const [commissions, total] = await Promise.all([
    db.commission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        reseller: {
          select: { displayName: true, companyName: true },
        },
      },
    }),
    db.commission.count({ where }),
  ]);

  return {
    commissions: commissions.map((c) => ({
      id: c.id,
      resellerId: c.resellerId,
      resellerName: c.reseller.displayName,
      resellerCompany: c.reseller.companyName,
      orderId: c.orderId,
      subscriptionId: c.subscriptionId,
      customerId: c.customerId,
      type: c.type,
      amountCents: c.amountCents,
      status: c.status,
      paidAt: c.paidAt,
      periodStart: c.periodStart,
      periodEnd: c.periodEnd,
      notes: c.notes,
      createdAt: c.createdAt,
    })),
    total,
    page,
    limit,
  };
}

// ── Commission status transitions ─────────────────────────────

export async function approveCommission(id: string) {
  return db.commission.update({
    where: { id },
    data: { status: "APPROVED" },
  });
}

export async function rejectCommission(id: string) {
  return db.commission.update({
    where: { id },
    data: { status: "REJECTED" },
  });
}

export async function markCommissionPaid(id: string) {
  return db.commission.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });
}

// ── Reseller leaderboard ──────────────────────────────────────

export async function getResellerLeaderboard() {
  const resellers = await db.resellerProfile.findMany({
    where: { status: "ACTIVE" },
    orderBy: { totalRevenue: "desc" },
    take: 10,
    select: {
      id: true,
      displayName: true,
      companyName: true,
      tier: true,
      totalSales: true,
      totalRevenue: true,
      totalCommission: true,
      totalCustomers: true,
      conversionRate: true,
    },
  });

  return resellers;
}
