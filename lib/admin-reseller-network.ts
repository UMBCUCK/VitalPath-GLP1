import { db } from "@/lib/db";

// NOTE: This module references Prisma schema fields that may require
// `npx prisma generate` to be run after schema updates. If you see
// TS errors on fields like referredByResellerId, networkDepth, etc.,
// run `npx prisma generate` to regenerate the Prisma client.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resellerDb = db.resellerProfile as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commissionDb = db.commission as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const networkEventDb = (db as any).resellerNetworkEvent;

// ── Types ─────────────────────────────────────────────────────

interface UplineResult {
  tier1?: ResellerSummary;
  tier2?: ResellerSummary;
  tier3?: ResellerSummary;
}

interface ResellerSummary {
  id: string;
  displayName: string;
  companyName: string | null;
  contactEmail: string;
  tier: string;
  status: string;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  networkDepth: number;
  tier1OverridePct: number;
  tier2OverridePct: number;
  tier3OverridePct: number;
}

interface DownlineResult {
  tier1: ResellerSummary[];
  tier2: ResellerSummary[];
  tier3: ResellerSummary[];
}

interface NetworkTreeNode {
  reseller: ResellerSummary;
  children: NetworkTreeNode[];
}

interface TierPromotionResult {
  currentTier: string;
  qualifiesFor: string | null;
  requirements: {
    salesTarget: number;
    recruitsTarget: number;
    revenueTarget: number;
  };
  progress: {
    sales: number;
    recruits: number;
    networkRevenue: number;
    salesPct: number;
    recruitsPct: number;
    revenuePct: number;
  };
}

interface NetworkMetrics {
  directRecruits: number;
  directRecruitsSales: number;
  tier2Count: number;
  tier2Sales: number;
  tier3Count: number;
  tier3Sales: number;
  totalNetworkRevenue: number;
  totalOverrideEarnings: number;
  networkGrowthByMonth: { month: string; recruits: number }[];
}

interface LeaderboardEntry {
  id: string;
  displayName: string;
  companyName: string | null;
  tier: string;
  status: string;
  directRecruits: number;
  tier2Count: number;
  tier3Count: number;
  totalSales: number;
  totalNetworkRevenue: number;
  totalOverrideEarnings: number;
  networkScore: number;
}

// ── Helpers ───────────────────────────────────────────────────

function toSummary(r: {
  id: string;
  displayName: string;
  companyName: string | null;
  contactEmail: string;
  tier: string;
  status: string;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  networkDepth: number;
  tier1OverridePct: number;
  tier2OverridePct: number;
  tier3OverridePct: number;
}): ResellerSummary {
  return {
    id: r.id,
    displayName: r.displayName,
    companyName: r.companyName,
    contactEmail: r.contactEmail,
    tier: r.tier,
    status: r.status,
    totalSales: r.totalSales,
    totalRevenue: r.totalRevenue,
    totalCommission: r.totalCommission,
    networkDepth: r.networkDepth,
    tier1OverridePct: r.tier1OverridePct,
    tier2OverridePct: r.tier2OverridePct,
    tier3OverridePct: r.tier3OverridePct,
  };
}

// ── Get Network Upline ────────────────────────────────────────
// Walk up the referredByResellerId chain to find 3 upline resellers

export async function getNetworkUpline(resellerId: string): Promise<UplineResult> {
  const result: UplineResult = {};

  const reseller = await resellerDb.findUnique({
    where: { id: resellerId },
    select: { referredByResellerId: true },
  });

  if (!reseller?.referredByResellerId) return result;

  // Tier 1 upline (direct recruiter)
  const tier1 = await resellerDb.findUnique({
    where: { id: reseller.referredByResellerId },
  });
  if (!tier1) return result;
  result.tier1 = toSummary(tier1);

  if (!tier1.referredByResellerId) return result;

  // Tier 2 upline
  const tier2 = await resellerDb.findUnique({
    where: { id: tier1.referredByResellerId },
  });
  if (!tier2) return result;
  result.tier2 = toSummary(tier2);

  if (!tier2.referredByResellerId) return result;

  // Tier 3 upline
  const tier3 = await resellerDb.findUnique({
    where: { id: tier2.referredByResellerId },
  });
  if (!tier3) return result;
  result.tier3 = toSummary(tier3);

  return result;
}

// ── Get Network Downline ──────────────────────────────────────
// Find all resellers in this reseller's network tree

export async function getNetworkDownline(resellerId: string): Promise<DownlineResult> {
  // Tier 1: direct recruits
  const tier1Resellers = await resellerDb.findMany({
    where: { referredByResellerId: resellerId },
  });

  const tier1Ids = tier1Resellers.map((r) => r.id);

  // Tier 2: recruited by tier 1
  const tier2Resellers = tier1Ids.length > 0
    ? await resellerDb.findMany({
        where: { referredByResellerId: { in: tier1Ids } },
      })
    : [];

  const tier2Ids = tier2Resellers.map((r) => r.id);

  // Tier 3: recruited by tier 2
  const tier3Resellers = tier2Ids.length > 0
    ? await resellerDb.findMany({
        where: { referredByResellerId: { in: tier2Ids } },
      })
    : [];

  return {
    tier1: tier1Resellers.map(toSummary),
    tier2: tier2Resellers.map(toSummary),
    tier3: tier3Resellers.map(toSummary),
  };
}

// ── Recruit Sub-Reseller ──────────────────────────────────────

export async function recruitSubReseller(
  recruiterId: string,
  newResellerData: {
    userId: string;
    displayName: string;
    companyName?: string;
    contactEmail: string;
    contactPhone?: string;
    commissionPct?: number;
  }
) {
  const recruiter = await resellerDb.findUnique({
    where: { id: recruiterId },
  });

  if (!recruiter) {
    throw new Error("Recruiter not found");
  }

  if (recruiter.status !== "ACTIVE") {
    throw new Error("Recruiter must be active to recruit sub-resellers");
  }

  if (recruiter.networkDepth >= 3) {
    throw new Error("Maximum network depth of 3 tiers reached. Cannot recruit at this level.");
  }

  // Check if user is already a reseller
  const existing = await resellerDb.findUnique({
    where: { userId: newResellerData.userId },
  });
  if (existing) {
    throw new Error("This user is already a reseller");
  }

  const referralCode = await generateResellerReferralCode(newResellerData.displayName);

  const newReseller = await resellerDb.create({
    data: {
      userId: newResellerData.userId,
      displayName: newResellerData.displayName,
      companyName: newResellerData.companyName || null,
      contactEmail: newResellerData.contactEmail,
      contactPhone: newResellerData.contactPhone || null,
      tier: "STANDARD",
      status: "ACTIVE",
      commissionType: "PERCENTAGE",
      commissionPct: newResellerData.commissionPct ?? 15.0,
      referredByResellerId: recruiterId,
      networkDepth: recruiter.networkDepth + 1,
      referralCode,
    },
  });

  // Increment recruiter's totalSubResellers
  await resellerDb.update({
    where: { id: recruiterId },
    data: { totalSubResellers: { increment: 1 } },
  });

  // Log network event
  await networkEventDb.create({
    data: {
      eventType: "RECRUIT",
      resellerId: newReseller.id,
      relatedResellerId: recruiterId,
      tier: recruiter.networkDepth + 1,
      metadata: {
        recruiterName: recruiter.displayName,
        newResellerName: newResellerData.displayName,
      },
    },
  });

  return newReseller;
}

// ── Process Override Commissions ──────────────────────────────
// When a sale occurs, calculate and create override commissions
// for the selling reseller's upline chain.
// IMPORTANT: Overrides are paid from company margin, NOT deducted
// from the selling reseller's commission.

export async function processOverrideCommissions(originalCommission: {
  id: string;
  resellerId: string;
  amountCents: number;
  orderId?: string | null;
  customerId?: string | null;
}): Promise<{ id: string; resellerId: string; type: string; amountCents: number; overrideTier: number }[]> {
  const upline = await getNetworkUpline(originalCommission.resellerId);
  const createdOverrides: { id: string; resellerId: string; type: string; amountCents: number; overrideTier: number }[] = [];

  const tiers = [
    { key: "tier1" as const, type: "OVERRIDE_TIER1", tierNum: 1 },
    { key: "tier2" as const, type: "OVERRIDE_TIER2", tierNum: 2 },
    { key: "tier3" as const, type: "OVERRIDE_TIER3", tierNum: 3 },
  ];

  for (const { key, type, tierNum } of tiers) {
    const uplineReseller = upline[key];
    if (!uplineReseller || uplineReseller.status !== "ACTIVE") continue;

    // Get the override percentage for this tier from the upline reseller
    const overridePctKey = `tier${tierNum}OverridePct` as
      | "tier1OverridePct"
      | "tier2OverridePct"
      | "tier3OverridePct";
    const overridePct = uplineReseller[overridePctKey];

    if (!overridePct || overridePct <= 0) continue;

    // Calculate override from the SALE amount, not from the commission
    const overrideAmountCents = Math.round(
      originalCommission.amountCents * (overridePct / 100)
    );

    if (overrideAmountCents <= 0) continue;

    const commission = await commissionDb.create({
      data: {
        resellerId: uplineReseller.id,
        orderId: originalCommission.orderId || null,
        customerId: originalCommission.customerId || null,
        type,
        amountCents: overrideAmountCents,
        status: "PENDING",
        sourceResellerId: originalCommission.resellerId,
        overrideTier: tierNum,
        sourceCommissionId: originalCommission.id,
      },
    });

    // Update upline reseller's totalOverrideEarnings
    await resellerDb.update({
      where: { id: uplineReseller.id },
      data: {
        totalOverrideEarnings: { increment: overrideAmountCents },
        totalCommission: { increment: overrideAmountCents },
      },
    });

    // Log network event
    await networkEventDb.create({
      data: {
        eventType: "OVERRIDE_PAID",
        resellerId: uplineReseller.id,
        relatedResellerId: originalCommission.resellerId,
        tier: tierNum,
        amountCents: overrideAmountCents,
        metadata: {
          sourceCommissionId: originalCommission.id,
          overridePct,
          type,
        },
      },
    });

    createdOverrides.push({
      id: commission.id,
      resellerId: uplineReseller.id,
      type,
      amountCents: overrideAmountCents,
      overrideTier: tierNum,
    });
  }

  return createdOverrides;
}

// ── Get Network Metrics ───────────────────────────────────────

export async function getNetworkMetrics(resellerId: string): Promise<NetworkMetrics> {
  const downline = await getNetworkDownline(resellerId);

  const directRecruitsSales = downline.tier1.reduce((sum, r) => sum + r.totalSales, 0);
  const tier2Sales = downline.tier2.reduce((sum, r) => sum + r.totalSales, 0);
  const tier3Sales = downline.tier3.reduce((sum, r) => sum + r.totalSales, 0);

  const totalNetworkRevenue =
    downline.tier1.reduce((sum, r) => sum + r.totalRevenue, 0) +
    downline.tier2.reduce((sum, r) => sum + r.totalRevenue, 0) +
    downline.tier3.reduce((sum, r) => sum + r.totalRevenue, 0);

  // Get total override earnings
  const overrideCommissions = await commissionDb.aggregate({
    where: {
      resellerId,
      type: { in: ["OVERRIDE_TIER1", "OVERRIDE_TIER2", "OVERRIDE_TIER3"] },
    },
    _sum: { amountCents: true },
  });

  // Network growth by month (recruits in the downline)
  const allDownlineIds = [
    ...downline.tier1.map((r) => r.id),
    ...downline.tier2.map((r) => r.id),
    ...downline.tier3.map((r) => r.id),
  ];

  const recruitEvents = allDownlineIds.length > 0
    ? await networkEventDb.findMany({
        where: {
          eventType: "RECRUIT",
          resellerId: { in: allDownlineIds },
        },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      })
    : [];

  const growthByMonth: Record<string, number> = {};
  for (const event of recruitEvents) {
    const key = `${event.createdAt.getFullYear()}-${String(event.createdAt.getMonth() + 1).padStart(2, "0")}`;
    growthByMonth[key] = (growthByMonth[key] || 0) + 1;
  }

  return {
    directRecruits: downline.tier1.length,
    directRecruitsSales,
    tier2Count: downline.tier2.length,
    tier2Sales,
    tier3Count: downline.tier3.length,
    tier3Sales,
    totalNetworkRevenue,
    totalOverrideEarnings: overrideCommissions._sum.amountCents || 0,
    networkGrowthByMonth: Object.entries(growthByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, recruits]) => ({ month, recruits })),
  };
}

// ── Get Network Tree ──────────────────────────────────────────

export async function getNetworkTree(resellerId: string): Promise<NetworkTreeNode | null> {
  const reseller = await resellerDb.findUnique({
    where: { id: resellerId },
  });

  if (!reseller) return null;

  const buildTree = async (parentId: string, depth: number): Promise<NetworkTreeNode[]> => {
    if (depth >= 3) return [];

    const children = await resellerDb.findMany({
      where: { referredByResellerId: parentId },
    });

    const nodes: NetworkTreeNode[] = [];
    for (const child of children) {
      const grandchildren = await buildTree(child.id, depth + 1);
      nodes.push({
        reseller: toSummary(child),
        children: grandchildren,
      });
    }
    return nodes;
  };

  const children = await buildTree(resellerId, 0);

  return {
    reseller: toSummary(reseller),
    children,
  };
}

// ── Generate Reseller Referral Code ───────────────────────────

export async function generateResellerReferralCode(nameOrId?: string): Promise<string> {
  const initials = nameOrId
    ? nameOrId
        .split(/\s+/)
        .map((w) => w[0]?.toUpperCase() || "")
        .join("")
        .slice(0, 3)
    : "VP";

  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const code = `VP-${initials}-${random}`;

  // Check uniqueness
  const existing = await resellerDb.findUnique({
    where: { referralCode: code },
  });

  if (existing) {
    // Retry with different random
    return generateResellerReferralCode(nameOrId);
  }

  return code;
}

// ── Network Leaderboard ───────────────────────────────────────

export async function getNetworkLeaderboard(): Promise<LeaderboardEntry[]> {
  const resellers = await resellerDb.findMany({
    where: { status: "ACTIVE" },
    orderBy: { totalNetworkRevenue: "desc" },
    take: 25,
  });

  const entries: LeaderboardEntry[] = [];

  for (const r of resellers) {
    // Count direct recruits
    const directRecruits = await resellerDb.count({
      where: { referredByResellerId: r.id },
    });

    // Count tier 2
    const tier1Ids = (
      await resellerDb.findMany({
        where: { referredByResellerId: r.id },
        select: { id: true },
      })
    ).map((x) => x.id);

    const tier2Count = tier1Ids.length > 0
      ? await resellerDb.count({
          where: { referredByResellerId: { in: tier1Ids } },
        })
      : 0;

    // Count tier 3
    const tier2Ids = tier1Ids.length > 0
      ? (
          await resellerDb.findMany({
            where: { referredByResellerId: { in: tier1Ids } },
            select: { id: true },
          })
        ).map((x) => x.id)
      : [];

    const tier3Count = tier2Ids.length > 0
      ? await resellerDb.count({
          where: { referredByResellerId: { in: tier2Ids } },
        })
      : 0;

    // Network score: weighted combination
    const networkScore =
      r.totalNetworkRevenue / 100 +
      r.totalOverrideEarnings / 50 +
      directRecruits * 10 +
      (tier2Count + tier3Count) * 5 +
      r.totalSales * 2;

    entries.push({
      id: r.id,
      displayName: r.displayName,
      companyName: r.companyName,
      tier: r.tier,
      status: r.status,
      directRecruits,
      tier2Count,
      tier3Count,
      totalSales: r.totalSales,
      totalNetworkRevenue: r.totalNetworkRevenue,
      totalOverrideEarnings: r.totalOverrideEarnings,
      networkScore: Math.round(networkScore),
    });
  }

  return entries.sort((a, b) => b.networkScore - a.networkScore);
}

// ── Tier Auto-Promotion Check ─────────────────────────────────

export async function getTierAutoPromotion(resellerId: string): Promise<TierPromotionResult> {
  const reseller = await resellerDb.findUnique({
    where: { id: resellerId },
  });

  if (!reseller) {
    throw new Error("Reseller not found");
  }

  const directRecruits = await resellerDb.count({
    where: { referredByResellerId: resellerId },
  });

  const tierRequirements: Record<string, { sales: number; recruits: number; revenue: number; nextTier: string }> = {
    STANDARD: { sales: 10, recruits: 5, revenue: 0, nextTier: "SILVER" },
    SILVER: { sales: 25, recruits: 10, revenue: 1000000, nextTier: "GOLD" }, // $10k in cents
    GOLD: { sales: 50, recruits: 20, revenue: 5000000, nextTier: "AMBASSADOR" }, // $50k in cents
    AMBASSADOR: { sales: 0, recruits: 0, revenue: 0, nextTier: "" }, // max tier
  };

  const currentReqs = tierRequirements[reseller.tier] || tierRequirements.STANDARD;
  const isMaxTier = reseller.tier === "AMBASSADOR" || reseller.tier === "CUSTOM";

  const meetsSales = currentReqs.sales > 0 && reseller.totalSales >= currentReqs.sales;
  const meetsRecruits = currentReqs.recruits > 0 && directRecruits >= currentReqs.recruits;
  const meetsRevenue = currentReqs.revenue <= 0 || reseller.totalNetworkRevenue >= currentReqs.revenue;

  // Qualifies if meets sales OR recruits (with revenue if applicable)
  const qualifies = !isMaxTier && ((meetsSales || meetsRecruits) && meetsRevenue);

  return {
    currentTier: reseller.tier,
    qualifiesFor: qualifies ? currentReqs.nextTier : null,
    requirements: {
      salesTarget: currentReqs.sales,
      recruitsTarget: currentReqs.recruits,
      revenueTarget: currentReqs.revenue,
    },
    progress: {
      sales: reseller.totalSales,
      recruits: directRecruits,
      networkRevenue: reseller.totalNetworkRevenue,
      salesPct: currentReqs.sales > 0 ? Math.min(100, (reseller.totalSales / currentReqs.sales) * 100) : 100,
      recruitsPct: currentReqs.recruits > 0 ? Math.min(100, (directRecruits / currentReqs.recruits) * 100) : 100,
      revenuePct: currentReqs.revenue > 0 ? Math.min(100, (reseller.totalNetworkRevenue / currentReqs.revenue) * 100) : 100,
    },
  };
}

// ── Overall Network Stats ─────────────────────────────────────

export async function getOverallNetworkStats() {
  const [totalResellers, totalActiveResellers, overrideCommissions, avgDepth] = await Promise.all([
    resellerDb.count(),
    resellerDb.count({ where: { status: "ACTIVE" } }),
    commissionDb.aggregate({
      where: { type: { in: ["OVERRIDE_TIER1", "OVERRIDE_TIER2", "OVERRIDE_TIER3"] } },
      _sum: { amountCents: true },
      _count: true,
    }),
    resellerDb.aggregate({
      _avg: { networkDepth: true },
    }),
  ]);

  const totalNetworkRevenue = await resellerDb.aggregate({
    _sum: { totalNetworkRevenue: true },
  });

  return {
    totalResellers,
    totalActiveResellers,
    totalOverridesPaid: overrideCommissions._sum.amountCents || 0,
    totalOverridesCount: overrideCommissions._count || 0,
    totalNetworkRevenue: totalNetworkRevenue._sum.totalNetworkRevenue || 0,
    avgNetworkDepth: Math.round((avgDepth._avg.networkDepth || 0) * 10) / 10,
  };
}

// ── Resellers Qualifying for Promotion ────────────────────────

export async function getResellersQualifyingForPromotion() {
  const activeResellers = await resellerDb.findMany({
    where: {
      status: "ACTIVE",
      tier: { in: ["STANDARD", "SILVER", "GOLD"] },
    },
  });

  const qualifying: {
    reseller: ResellerSummary;
    promotion: TierPromotionResult;
  }[] = [];

  for (const r of activeResellers) {
    const promotion = await getTierAutoPromotion(r.id);
    if (promotion.qualifiesFor) {
      qualifying.push({
        reseller: toSummary(r),
        promotion,
      });
    }
  }

  return qualifying;
}

// ── Promote Reseller Tier ─────────────────────────────────────

export async function promoteResellerTier(resellerId: string, newTier: string) {
  const reseller = await resellerDb.findUnique({
    where: { id: resellerId },
  });

  if (!reseller) throw new Error("Reseller not found");

  const validTiers = ["STANDARD", "SILVER", "GOLD", "AMBASSADOR"];
  if (!validTiers.includes(newTier)) throw new Error("Invalid tier");

  await resellerDb.update({
    where: { id: resellerId },
    data: { tier: newTier },
  });

  await networkEventDb.create({
    data: {
      eventType: "TIER_UPGRADE",
      resellerId,
      tier: validTiers.indexOf(newTier),
      metadata: {
        previousTier: reseller.tier,
        newTier,
      },
    },
  });

  return { previousTier: reseller.tier, newTier };
}

// ── Update Override Rates ─────────────────────────────────────

export async function updateOverrideRates(
  resellerId: string,
  rates: {
    tier1OverridePct?: number;
    tier2OverridePct?: number;
    tier3OverridePct?: number;
  }
) {
  const updateData: Record<string, number> = {};

  if (rates.tier1OverridePct !== undefined) {
    if (rates.tier1OverridePct < 0 || rates.tier1OverridePct > 25) {
      throw new Error("Tier 1 override must be between 0% and 25%");
    }
    updateData.tier1OverridePct = rates.tier1OverridePct;
  }

  if (rates.tier2OverridePct !== undefined) {
    if (rates.tier2OverridePct < 0 || rates.tier2OverridePct > 15) {
      throw new Error("Tier 2 override must be between 0% and 15%");
    }
    updateData.tier2OverridePct = rates.tier2OverridePct;
  }

  if (rates.tier3OverridePct !== undefined) {
    if (rates.tier3OverridePct < 0 || rates.tier3OverridePct > 10) {
      throw new Error("Tier 3 override must be between 0% and 10%");
    }
    updateData.tier3OverridePct = rates.tier3OverridePct;
  }

  return resellerDb.update({
    where: { id: resellerId },
    data: updateData,
  });
}
