import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSubscriptionHealth, getAtRiskSubscriptions, getSaveOfferPerformance, getDunningSubscriptions } from "@/lib/admin-subscriptions";
import { getChurnRiskDistribution, getHighChurnPatients } from "@/lib/admin-churn";
import { getRecommendationsForList } from "@/lib/admin-recommendations";
import { SubscriptionsClient } from "./subscriptions-client";

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  const [health, atRisk, savePerformance, dunning, churnDistribution, highChurn] = await Promise.all([
    getSubscriptionHealth(),
    getAtRiskSubscriptions(page),
    getSaveOfferPerformance(),
    getDunningSubscriptions(page),
    getChurnRiskDistribution(),
    getHighChurnPatients(page),
  ]);

  // Get recommendations for high-churn patients
  const highChurnUserIds = highChurn.patients.map((p) => p.userId);
  const recommendations = highChurnUserIds.length > 0
    ? await getRecommendationsForList(highChurnUserIds)
    : new Map();

  // Serialize recommendations map for client
  const recommendationsObj: Record<string, { action: string; type: string; priority: string }> = {};
  for (const [userId, rec] of recommendations) {
    recommendationsObj[userId] = rec;
  }

  return (
    <SubscriptionsClient
      health={health}
      atRisk={atRisk}
      savePerformance={savePerformance}
      dunning={dunning}
      churnDistribution={churnDistribution}
      highChurn={highChurn}
      recommendations={recommendationsObj}
      currentTab={params.tab || "overview"}
      page={page}
    />
  );
}
