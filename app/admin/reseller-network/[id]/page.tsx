import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getResellerPerformance } from "@/lib/admin-resellers";
import {
  getNetworkTree,
  getNetworkMetrics,
  getNetworkDownline,
  getNetworkUpline,
  getTierAutoPromotion,
} from "@/lib/admin-reseller-network";
import { db } from "@/lib/db";
import { NetworkDetailClient } from "./network-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResellerNetworkDetailPage({ params }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const { id } = await params;

  // Query the full reseller profile directly to get all network fields
  const resellerRaw = await (db.resellerProfile as any).findUnique({ where: { id } });
  if (!resellerRaw) redirect("/admin/reseller-network");

  const [tree, metrics, downline, upline, promotion, performance, overrideCommissionsRaw] =
    await Promise.all([
      getNetworkTree(id),
      getNetworkMetrics(id),
      getNetworkDownline(id),
      getNetworkUpline(id),
      getTierAutoPromotion(id),
      getResellerPerformance(id),
      (db.commission as any).findMany({
        where: {
          resellerId: id,
          type: { in: ["OVERRIDE_TIER1", "OVERRIDE_TIER2", "OVERRIDE_TIER3"] },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

  // Serialize to plain objects for client component
  const serializedReseller = {
    id: resellerRaw.id,
    userId: resellerRaw.userId,
    displayName: resellerRaw.displayName,
    companyName: resellerRaw.companyName,
    contactEmail: resellerRaw.contactEmail,
    contactPhone: resellerRaw.contactPhone,
    tier: resellerRaw.tier,
    status: resellerRaw.status,
    commissionType: resellerRaw.commissionType,
    commissionPct: resellerRaw.commissionPct,
    totalSales: resellerRaw.totalSales,
    totalRevenue: resellerRaw.totalRevenue,
    totalCommission: resellerRaw.totalCommission,
    totalCustomers: resellerRaw.totalCustomers,
    totalSubResellers: resellerRaw.totalSubResellers,
    totalNetworkRevenue: resellerRaw.totalNetworkRevenue,
    totalOverrideEarnings: resellerRaw.totalOverrideEarnings,
    tier1OverridePct: resellerRaw.tier1OverridePct,
    tier2OverridePct: resellerRaw.tier2OverridePct,
    tier3OverridePct: resellerRaw.tier3OverridePct,
    networkDepth: resellerRaw.networkDepth,
    referredByResellerId: resellerRaw.referredByResellerId,
    referralCode: resellerRaw.referralCode,
    payoutMethod: resellerRaw.payoutMethod,
    payoutBankName: resellerRaw.payoutBankName,
    payoutAccountLast4: resellerRaw.payoutAccountLast4,
    taxIdProvided: resellerRaw.taxIdProvided,
    taxId1099Eligible: resellerRaw.taxId1099Eligible,
    createdAt: resellerRaw.createdAt.toISOString(),
  };

  const serializedOverrides = overrideCommissionsRaw.map((c) => ({
    id: c.id,
    type: c.type,
    amountCents: c.amountCents,
    status: c.status,
    sourceResellerId: c.sourceResellerId,
    overrideTier: c.overrideTier,
    orderId: c.orderId,
    createdAt: c.createdAt.toISOString(),
  }));

  // Monthly network data for chart
  const networkChartData = performance?.salesByMonth.map((m) => ({
    month: m.month,
    directRevenue: m.revenue,
    commission: m.commission,
  })) || [];

  return (
    <NetworkDetailClient
      reseller={serializedReseller}
      tree={tree}
      metrics={metrics}
      downline={downline}
      upline={upline}
      promotion={promotion}
      overrideCommissions={serializedOverrides}
      networkChartData={networkChartData}
    />
  );
}
