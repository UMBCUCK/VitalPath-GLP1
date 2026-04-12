export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getNetworkLeaderboard,
  getOverallNetworkStats,
  getResellersQualifyingForPromotion,
} from "@/lib/admin-reseller-network";
import { getResellers } from "@/lib/admin-resellers";
import { NetworkClient } from "./network-client";

export default async function ResellerNetworkPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [leaderboard, stats, promotions, resellersData] = await Promise.all([
    getNetworkLeaderboard(),
    getOverallNetworkStats(),
    getResellersQualifyingForPromotion(),
    getResellers({ page: 1, limit: 100, status: "ACTIVE" }),
  ]);

  // Serialize promotions (dates in reseller summaries)
  const serializedPromotions = promotions.map((p) => ({
    reseller: p.reseller,
    promotion: p.promotion,
  }));

  // Active resellers for recruiter picker
  const activeResellers = resellersData.resellers.map((r) => ({
    id: r.id,
    displayName: r.displayName,
    companyName: r.companyName,
    tier: r.tier,
    networkDepth: 0, // Will be enriched client-side if needed
  }));

  return (
    <NetworkClient
      leaderboard={leaderboard}
      stats={stats}
      promotions={serializedPromotions}
      activeResellers={activeResellers}
    />
  );
}
