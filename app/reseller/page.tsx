export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getResellerSession } from "@/lib/reseller-auth";
import { db } from "@/lib/db";
import {
  getResellerDashboard,
  getResellerCustomers,
  getResellerCommissions,
  getResellerEarnings,
  getResellerReferralLink,
  getResellerTierProgress,
  getResellerPayoutSummary,
  getResellerNetwork,
} from "@/lib/reseller-data";
import { getMarketingAssets } from "@/lib/admin-marketing-assets";
import { ResellerDashboardClient } from "./dashboard-client";

export default async function ResellerPage() {
  const session = await getResellerSession();
  if (!session) redirect("/reseller/login");

  const [dashboard, customers, commissions, earnings, referralLink, marketingData, tierProgress, payoutSummary, networkData, complianceStatus] =
    await Promise.all([
      getResellerDashboard(session.resellerId),
      getResellerCustomers(session.resellerId, 1, 10),
      getResellerCommissions(session.resellerId, 1, 10),
      getResellerEarnings(session.resellerId),
      getResellerReferralLink(session.resellerId),
      getMarketingAssets(1, 50, undefined, undefined).then((res) => ({
        assets: res.assets.filter((a) => a.isActive),
      })),
      getResellerTierProgress(session.resellerId),
      getResellerPayoutSummary(session.resellerId),
      getResellerNetwork(session.resellerId),
      // Check if re-attestation is needed (signed > 90 days ago)
      db.resellerProfile.findUnique({
        where: { id: session.resellerId },
        select: { attestationSignedAt: true, complianceViolationCount: true },
      }),
    ]);

  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);
  const reattestationRequired = complianceStatus?.attestationSignedAt
    ? new Date(complianceStatus.attestationSignedAt) < ninetyDaysAgo
    : false;

  return (
    <ResellerDashboardClient
      dashboard={JSON.parse(JSON.stringify(dashboard))}
      customers={JSON.parse(JSON.stringify(customers))}
      commissions={JSON.parse(JSON.stringify(commissions))}
      earnings={JSON.parse(JSON.stringify(earnings))}
      referralLink={referralLink}
      displayName={session.displayName}
      tier={session.tier}
      marketingAssets={JSON.parse(JSON.stringify(marketingData.assets))}
      tierProgress={JSON.parse(JSON.stringify(tierProgress))}
      payoutSummary={JSON.parse(JSON.stringify(payoutSummary))}
      networkOverview={{
        totalSubResellers: networkData.totalDirectRecruits,
        totalOverrideEarnings: networkData.totalOverrideEarnings,
      }}
      reattestationRequired={reattestationRequired}
    />
  );
}
