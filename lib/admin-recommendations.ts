import { db } from "@/lib/db";

export interface Recommendation {
  action: string;
  type: "payment" | "engagement" | "upgrade" | "winback";
  priority: "high" | "medium" | "low";
}

/**
 * Generate a single recommended action for a customer based on their
 * churn risk, health score, subscription status, and activity.
 */
export async function getCustomerRecommendation(userId: string): Promise<Recommendation> {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000);
  const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);

  const [profile, subscription, recentProgress, topPlan] = await Promise.all([
    db.patientProfile.findUnique({
      where: { userId },
      select: { churnRisk: true, healthScore: true, lifecycleStage: true },
    }),
    db.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        status: true,
        canceledAt: true,
        items: {
          include: { product: { select: { name: true, slug: true, priceMonthly: true } } },
        },
      },
    }),
    db.progressEntry.count({
      where: { userId, date: { gte: fourteenDaysAgo } },
    }),
    // Get highest-priced product to check if on top plan
    db.product.findFirst({
      where: { type: "MEMBERSHIP", isActive: true },
      orderBy: { priceMonthly: "desc" },
      select: { slug: true },
    }),
  ]);

  const churnRisk = profile?.churnRisk ?? 0;
  const healthScore = profile?.healthScore ?? 50;
  const subStatus = subscription?.status;
  const currentPlanSlug = subscription?.items[0]?.product?.slug;
  const isTopPlan = currentPlanSlug && topPlan && currentPlanSlug === topPlan.slug;

  // Rule 1: High churn + past due payment
  if (churnRisk >= 70 && subStatus === "PAST_DUE") {
    return {
      action: "Retry payment + send dunning email",
      type: "payment",
      priority: "high",
    };
  }

  // Rule 2: High churn + no recent progress
  if (churnRisk >= 60 && recentProgress === 0) {
    return {
      action: "Send engagement check-in",
      type: "engagement",
      priority: "high",
    };
  }

  // Rule 3: Low churn + high health + not on top plan
  if (churnRisk < 30 && healthScore >= 70 && !isTopPlan && subStatus === "ACTIVE") {
    return {
      action: "Suggest Premium upgrade",
      type: "upgrade",
      priority: "medium",
    };
  }

  // Rule 4: Canceled 30-60 days ago + decent health score
  if (
    subStatus === "CANCELED" &&
    subscription?.canceledAt &&
    new Date(subscription.canceledAt) >= sixtyDaysAgo &&
    new Date(subscription.canceledAt) <= thirtyDaysAgo &&
    healthScore >= 50
  ) {
    return {
      action: "Win-back campaign eligible",
      type: "winback",
      priority: "medium",
    };
  }

  // Rule 5: Moderate churn + active
  if (churnRisk >= 40 && subStatus && ["ACTIVE", "TRIALING"].includes(subStatus)) {
    return {
      action: "Schedule wellness check-in",
      type: "engagement",
      priority: "low",
    };
  }

  // Default
  return {
    action: "No action needed",
    type: "engagement",
    priority: "low",
  };
}

/**
 * Batch version: get recommendations for multiple users in parallel.
 */
export async function getRecommendationsForList(
  userIds: string[]
): Promise<Map<string, Recommendation>> {
  const results = new Map<string, Recommendation>();

  const recommendations = await Promise.all(
    userIds.map(async (userId) => {
      const rec = await getCustomerRecommendation(userId);
      return { userId, rec };
    })
  );

  for (const { userId, rec } of recommendations) {
    results.set(userId, rec);
  }

  return results;
}
