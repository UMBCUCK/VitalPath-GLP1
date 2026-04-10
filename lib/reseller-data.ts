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
  firstName: string | null;
  lastName: string | null;
  email: string;
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
  const subscriptions = await db.subscription.findMany({
    where: { referredByReseller: resellerId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
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

  const customers: ResellerCustomerRow[] = subscriptions.map((sub) => {
    const plan =
      sub.items.map((i) => i.product.name).join(", ") || "Unknown Plan";

    // Get total revenue from orders for this user
    return {
      id: sub.user.id,
      firstName: sub.user.firstName,
      lastName: sub.user.lastName,
      email: sub.user.email,
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
