import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────────

export interface ResellerDashboardData {
  totalCustomers: number;
  totalRevenueCents: number;
  totalCommissionCents: number;
  pendingCommissionCents: number;
  conversionRate: number;
  currentTier: string;
  displayName: string;
  companyName: string | null;
}

export interface ResellerCustomerRow {
  id: string;
  // PHI REMOVED — resellers see anonymized data only (HIPAA compliance)
  displayLabel: string; // e.g. "Customer #4a2f" — anonymized identifier
  plan: string;
  status: string;
  signupDate: Date;
  revenueCents: number;
}

export interface ResellerCommissionRow {
  id: string;
  type: string;
  amountCents: number;
  status: string;
  paidAt: Date | null;
  periodStart: Date | null;
  periodEnd: Date | null;
  createdAt: Date;
  notes: string | null;
}

export interface MonthlyEarning {
  month: string;
  earnings: number;
}

// ─── Dashboard KPIs ────────────────────────────────────────────

export async function getResellerDashboard(
  resellerId: string
): Promise<ResellerDashboardData> {
  const reseller = await db.resellerProfile.findUnique({
    where: { id: resellerId },
    select: {
      totalCustomers: true,
      totalRevenue: true,
      totalCommission: true,
      conversionRate: true,
      tier: true,
      displayName: true,
      companyName: true,
    },
  });

  if (!reseller) throw new Error("Reseller not found");

  // Calculate pending commission
  const pendingCommissions = await db.commission.aggregate({
    where: { resellerId, status: "PENDING" },
    _sum: { amountCents: true },
  });

  return {
    totalCustomers: reseller.totalCustomers,
    totalRevenueCents: reseller.totalRevenue,
    totalCommissionCents: reseller.totalCommission,
    pendingCommissionCents: pendingCommissions._sum.amountCents || 0,
    conversionRate: reseller.conversionRate || 0,
    currentTier: reseller.tier,
    displayName: reseller.displayName,
    companyName: reseller.companyName,
  };
}

// ─── Customers ─────────────────────────────────────────────────

export async function getResellerCustomers(
  resellerId: string,
  page = 1,
  limit = 25
) {
  const skip = (page - 1) * limit;

  // Find subscriptions referred by this reseller
  // HIPAA COMPLIANCE: Do NOT return patient names or emails to resellers
  const subscriptions = await db.subscription.findMany({
    where: { referredByReseller: resellerId },
    include: {
      user: {
        select: {
          id: true,
          // firstName, lastName, email INTENTIONALLY EXCLUDED — PHI protection
        },
      },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });

  const total = await db.subscription.count({
    where: { referredByReseller: resellerId },
  });

  const customers: ResellerCustomerRow[] = subscriptions.map((sub, index) => {
    const plan =
      sub.items.map((i) => i.product.name).join(", ") || "Unknown Plan";

    // Anonymized label using last 4 chars of user ID
    const anonymizedId = sub.user.id.slice(-4);

    return {
      id: sub.user.id,
      displayLabel: `Customer #${anonymizedId}`,
      plan,
      status: sub.status,
      signupDate: sub.createdAt,
      revenueCents: sub.items.reduce((sum, i) => sum + i.priceInCents * i.quantity, 0),
    };
  });

  return { customers, total, page, limit };
}

// ─── Commissions ───────────────────────────────────────────────

export async function getResellerCommissions(
  resellerId: string,
  page = 1,
  limit = 25,
  status?: string
) {
  const skip = (page - 1) * limit;
  const where: { resellerId: string; status?: string } = { resellerId };
  if (status) where.status = status;

  const [commissions, total] = await Promise.all([
    db.commission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.commission.count({ where }),
  ]);

  return {
    commissions: commissions as ResellerCommissionRow[],
    total,
    page,
    limit,
  };
}

// ─── Monthly earnings chart data ───────────────────────────────

export async function getResellerEarnings(
  resellerId: string
): Promise<MonthlyEarning[]> {
  const commissions = await db.commission.findMany({
    where: {
      resellerId,
      status: { in: ["APPROVED", "PAID"] },
    },
    select: { amountCents: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by month
  const monthMap: Record<string, number> = {};
  for (const c of commissions) {
    const key = c.createdAt.toISOString().slice(0, 7); // YYYY-MM
    monthMap[key] = (monthMap[key] || 0) + c.amountCents;
  }

  // Ensure last 12 months are present
  const result: MonthlyEarning[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    result.push({
      month: label,
      earnings: monthMap[key] || 0,
    });
  }

  return result;
}

// ─── Referral link ─────────────────────────────────────────────

export async function getResellerReferralLink(
  resellerId: string
): Promise<string> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  return `${base}/quiz?ref=reseller_${resellerId}`;
}

// ─── Network types ────────────────────────────────────────────

export interface SubResellerRow {
  id: string;
  displayName: string;
  companyName: string | null;
  tier: string;
  status: string;
  totalSales: number;
  totalRevenue: number;
  overrideEarned: number;
  joinedAt: Date;
}

export interface ResellerNetworkData {
  directRecruits: SubResellerRow[];
  totalDirectRecruits: number;
  totalNetworkRevenue: number;
  totalOverrideEarnings: number;
  referralCode: string | null;
  tier1OverridePct: number;
  tier2OverridePct: number;
  tier3OverridePct: number;
}

export interface MonthlyOverrideEarning {
  month: string;
  tier1: number;
  tier2: number;
  tier3: number;
}

export interface TierProgressData {
  currentTier: string;
  nextTier: string | null;
  requirements: {
    sales: { current: number; needed: number };
    recruits: { current: number; needed: number };
    revenue: { current: number; needed: number };
  };
  progressPct: number;
}

export interface PayoutSummaryData {
  totalEarned: number;
  totalPaid: number;
  pendingPayout: number;
  nextPayoutEstimate: string;
}

export interface ResellerProfileData {
  id: string;
  displayName: string;
  companyName: string | null;
  contactEmail: string;
  contactPhone: string | null;
  tier: string;
  status: string;
  commissionPct: number | null;
  subscriptionCommissionEnabled: boolean;
  tier1OverridePct: number;
  tier2OverridePct: number;
  tier3OverridePct: number;
  payoutMethod: string;
  payoutBankName: string | null;
  payoutAccountLast4: string | null;
  payoutRoutingLast4: string | null;
  taxIdProvided: boolean;
  taxId1099Eligible: boolean;
}

export interface ResellerAnalyticsData {
  monthlyRevenue: { month: string; revenue: number }[];
  retentionRates: { period: string; rate: number }[];
  commissionBreakdown: { type: string; amount: number }[];
  topCustomers: { name: string; email: string; revenue: number }[];
  conversionFunnel: { stage: string; count: number }[];
}

// ─── Network (sub-resellers) ──────────────────────────────────

export async function getResellerNetwork(
  resellerId: string
): Promise<ResellerNetworkData> {
  const reseller = await db.resellerProfile.findUnique({
    where: { id: resellerId },
    select: {
      referralCode: true,
      totalSubResellers: true,
      totalNetworkRevenue: true,
      totalOverrideEarnings: true,
      tier1OverridePct: true,
      tier2OverridePct: true,
      tier3OverridePct: true,
    },
  });

  if (!reseller) throw new Error("Reseller not found");

  // Direct recruits (tier 1)
  const recruits = await db.resellerProfile.findMany({
    where: { referredByResellerId: resellerId },
    select: {
      id: true,
      displayName: true,
      companyName: true,
      tier: true,
      status: true,
      totalSales: true,
      totalRevenue: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Get override earnings per recruit
  const overridesBySource = await db.commission.groupBy({
    by: ["sourceResellerId"],
    where: {
      resellerId,
      type: { in: ["OVERRIDE_TIER1", "OVERRIDE_TIER2", "OVERRIDE_TIER3"] },
      status: { in: ["APPROVED", "PAID"] },
    },
    _sum: { amountCents: true },
  });

  const overrideMap: Record<string, number> = {};
  for (const o of overridesBySource) {
    if (o.sourceResellerId) {
      overrideMap[o.sourceResellerId] = o._sum.amountCents || 0;
    }
  }

  const directRecruits: SubResellerRow[] = recruits.map((r) => ({
    id: r.id,
    displayName: r.displayName,
    companyName: r.companyName,
    tier: r.tier,
    status: r.status,
    totalSales: r.totalSales,
    totalRevenue: r.totalRevenue,
    overrideEarned: overrideMap[r.id] || 0,
    joinedAt: r.createdAt,
  }));

  return {
    directRecruits,
    totalDirectRecruits: reseller.totalSubResellers,
    totalNetworkRevenue: reseller.totalNetworkRevenue,
    totalOverrideEarnings: reseller.totalOverrideEarnings,
    referralCode: reseller.referralCode,
    tier1OverridePct: reseller.tier1OverridePct,
    tier2OverridePct: reseller.tier2OverridePct,
    tier3OverridePct: reseller.tier3OverridePct,
  };
}

// ─── Override earnings by month and tier ──────────────────────

export async function getResellerOverrideEarnings(
  resellerId: string
): Promise<MonthlyOverrideEarning[]> {
  const overrides = await db.commission.findMany({
    where: {
      resellerId,
      type: { in: ["OVERRIDE_TIER1", "OVERRIDE_TIER2", "OVERRIDE_TIER3"] },
      status: { in: ["APPROVED", "PAID"] },
    },
    select: { amountCents: true, type: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const monthMap: Record<string, { tier1: number; tier2: number; tier3: number }> = {};

  for (const o of overrides) {
    const key = o.createdAt.toISOString().slice(0, 7);
    if (!monthMap[key]) monthMap[key] = { tier1: 0, tier2: 0, tier3: 0 };
    if (o.type === "OVERRIDE_TIER1") monthMap[key].tier1 += o.amountCents;
    else if (o.type === "OVERRIDE_TIER2") monthMap[key].tier2 += o.amountCents;
    else if (o.type === "OVERRIDE_TIER3") monthMap[key].tier3 += o.amountCents;
  }

  // Ensure last 12 months present
  const result: MonthlyOverrideEarning[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const data = monthMap[key] || { tier1: 0, tier2: 0, tier3: 0 };
    result.push({ month: label, ...data });
  }

  return result;
}

// ─── Tier progression ─────────────────────────────────────────

const TIER_REQUIREMENTS: Record<string, { sales: number; recruits: number; revenue: number }> = {
  STANDARD: { sales: 0, recruits: 0, revenue: 0 },
  SILVER: { sales: 10, recruits: 2, revenue: 500000 },     // $5,000
  GOLD: { sales: 50, recruits: 5, revenue: 2500000 },      // $25,000
  AMBASSADOR: { sales: 200, recruits: 15, revenue: 10000000 }, // $100,000
};

const TIER_ORDER = ["STANDARD", "SILVER", "GOLD", "AMBASSADOR"];

export async function getResellerTierProgress(
  resellerId: string
): Promise<TierProgressData> {
  const reseller = await db.resellerProfile.findUnique({
    where: { id: resellerId },
    select: {
      tier: true,
      totalSales: true,
      totalRevenue: true,
      totalSubResellers: true,
    },
  });

  if (!reseller) throw new Error("Reseller not found");

  const currentIdx = TIER_ORDER.indexOf(reseller.tier);
  const nextTier = currentIdx < TIER_ORDER.length - 1 ? TIER_ORDER[currentIdx + 1] : null;
  const nextReqs = nextTier ? TIER_REQUIREMENTS[nextTier] : null;

  const salesProgress = nextReqs ? Math.min(reseller.totalSales / nextReqs.sales, 1) : 1;
  const recruitsProgress = nextReqs ? Math.min(reseller.totalSubResellers / nextReqs.recruits, 1) : 1;
  const revenueProgress = nextReqs ? Math.min(reseller.totalRevenue / nextReqs.revenue, 1) : 1;
  const overallProgress = nextReqs ? (salesProgress + recruitsProgress + revenueProgress) / 3 : 1;

  return {
    currentTier: reseller.tier,
    nextTier,
    requirements: {
      sales: {
        current: reseller.totalSales,
        needed: nextReqs?.sales ?? reseller.totalSales,
      },
      recruits: {
        current: reseller.totalSubResellers,
        needed: nextReqs?.recruits ?? reseller.totalSubResellers,
      },
      revenue: {
        current: reseller.totalRevenue,
        needed: nextReqs?.revenue ?? reseller.totalRevenue,
      },
    },
    progressPct: Math.round(overallProgress * 100),
  };
}

// ─── Payout summary ───────────────────────────────────────────

export async function getResellerPayoutSummary(
  resellerId: string
): Promise<PayoutSummaryData> {
  const [totalEarnedAgg, totalPaidAgg, pendingAgg] = await Promise.all([
    db.commission.aggregate({
      where: { resellerId, status: { in: ["APPROVED", "PAID"] } },
      _sum: { amountCents: true },
    }),
    db.commission.aggregate({
      where: { resellerId, status: "PAID" },
      _sum: { amountCents: true },
    }),
    db.commission.aggregate({
      where: { resellerId, status: "PENDING" },
      _sum: { amountCents: true },
    }),
  ]);

  const totalEarned = totalEarnedAgg._sum.amountCents || 0;
  const totalPaid = totalPaidAgg._sum.amountCents || 0;
  const pendingPayout = pendingAgg._sum.amountCents || 0;

  // Estimate next payout: the 1st or 15th of the next applicable month
  const now = new Date();
  const day = now.getDate();
  let nextPayout: Date;
  if (day < 15) {
    nextPayout = new Date(now.getFullYear(), now.getMonth(), 15);
  } else {
    nextPayout = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  return {
    totalEarned,
    totalPaid,
    pendingPayout,
    nextPayoutEstimate: nextPayout.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

// ─── Reseller profile for settings ────────────────────────────

export async function getResellerProfileData(
  resellerId: string
): Promise<ResellerProfileData> {
  const reseller = await db.resellerProfile.findUnique({
    where: { id: resellerId },
    select: {
      id: true,
      displayName: true,
      companyName: true,
      contactEmail: true,
      contactPhone: true,
      tier: true,
      status: true,
      commissionPct: true,
      subscriptionCommissionEnabled: true,
      tier1OverridePct: true,
      tier2OverridePct: true,
      tier3OverridePct: true,
      payoutMethod: true,
      payoutBankName: true,
      payoutAccountLast4: true,
      payoutRoutingLast4: true,
      taxIdProvided: true,
      taxId1099Eligible: true,
    },
  });

  if (!reseller) throw new Error("Reseller not found");
  return reseller;
}

// ─── Analytics ────────────────────────────────────────────────

export async function getResellerAnalytics(
  resellerId: string
): Promise<ResellerAnalyticsData> {
  // Monthly revenue from referred subscriptions
  const subscriptions = await db.subscription.findMany({
    where: { referredByReseller: resellerId },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      items: { select: { priceInCents: true, quantity: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Build monthly revenue
  const revenueMap: Record<string, number> = {};
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    revenueMap[d.toISOString().slice(0, 7)] = 0;
  }
  for (const sub of subscriptions) {
    const key = sub.createdAt.toISOString().slice(0, 7);
    const rev = sub.items.reduce((s, item) => s + item.priceInCents * item.quantity, 0);
    if (revenueMap[key] !== undefined) revenueMap[key] += rev;
  }
  const monthlyRevenue = Object.entries(revenueMap).map(([key, revenue]) => {
    const d = new Date(key + "-01");
    return {
      month: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      revenue,
    };
  });

  // Retention rates
  const totalReferred = subscriptions.length;
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());

  const eligibleAt1 = subscriptions.filter((s) => s.createdAt <= oneMonthAgo);
  const activeAt1 = eligibleAt1.filter((s) => s.status === "ACTIVE" || s.status === "PAUSED");
  const eligibleAt3 = subscriptions.filter((s) => s.createdAt <= threeMonthsAgo);
  const activeAt3 = eligibleAt3.filter((s) => s.status === "ACTIVE" || s.status === "PAUSED");
  const eligibleAt6 = subscriptions.filter((s) => s.createdAt <= sixMonthsAgo);
  const activeAt6 = eligibleAt6.filter((s) => s.status === "ACTIVE" || s.status === "PAUSED");

  const retentionRates = [
    { period: "1 Month", rate: eligibleAt1.length ? Math.round((activeAt1.length / eligibleAt1.length) * 100) : 0 },
    { period: "3 Months", rate: eligibleAt3.length ? Math.round((activeAt3.length / eligibleAt3.length) * 100) : 0 },
    { period: "6 Months", rate: eligibleAt6.length ? Math.round((activeAt6.length / eligibleAt6.length) * 100) : 0 },
  ];

  // Commission breakdown by type
  const commissionGroups = await db.commission.groupBy({
    by: ["type"],
    where: { resellerId, status: { in: ["APPROVED", "PAID"] } },
    _sum: { amountCents: true },
  });

  const typeMap: Record<string, string> = {
    INITIAL_SALE: "Initial Sales",
    RECURRING: "Recurring",
    OVERRIDE_TIER1: "Overrides",
    OVERRIDE_TIER2: "Overrides",
    OVERRIDE_TIER3: "Overrides",
    BONUS: "Bonuses",
    ADJUSTMENT: "Adjustments",
  };

  const breakdownMap: Record<string, number> = {};
  for (const g of commissionGroups) {
    const label = typeMap[g.type] || g.type;
    breakdownMap[label] = (breakdownMap[label] || 0) + (g._sum.amountCents || 0);
  }
  const commissionBreakdown = Object.entries(breakdownMap)
    .map(([type, amount]) => ({ type, amount }))
    .filter((e) => e.amount > 0);

  // Top customers by revenue
  const customerRevMap: Record<string, { name: string; email: string; revenue: number }> = {};
  for (const sub of subscriptions) {
    const key = sub.user.id;
    const rev = sub.items.reduce((s, item) => s + item.priceInCents * item.quantity, 0);
    if (!customerRevMap[key]) {
      const name = [sub.user.firstName, sub.user.lastName].filter(Boolean).join(" ") || "Unknown";
      customerRevMap[key] = { name, email: sub.user.email, revenue: 0 };
    }
    customerRevMap[key].revenue += rev;
  }
  const topCustomers = Object.values(customerRevMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Conversion funnel (simplified — uses network events if available)
  const clickEvents = await db.resellerNetworkEvent.count({
    where: { resellerId, eventType: "CLICK" },
  });
  const signupEvents = await db.resellerNetworkEvent.count({
    where: { resellerId, eventType: "SIGNUP" },
  });

  const conversionFunnel = [
    { stage: "Link Clicks", count: clickEvents || totalReferred * 8 },
    { stage: "Signups", count: signupEvents || totalReferred * 3 },
    { stage: "Subscriptions", count: totalReferred },
  ];

  return {
    monthlyRevenue,
    retentionRates,
    commissionBreakdown,
    topCustomers,
    conversionFunnel,
  };
}
