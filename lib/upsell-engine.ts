/**
 * Smart Upsell Engine
 * Evaluates rules against user state and returns contextual upsell suggestions.
 */

import { db } from "@/lib/db";

export interface UpsellSuggestion {
  id: string;
  productSlug: string;
  productName: string;
  headline: string;
  description: string;
  discountPct?: number;
  priority: number;
}

interface UserState {
  userId: string;
  planSlug: string | null;
  addOnSlugs: string[];
  avgProtein3d: number;
  avgWater3d: number;
  progressCount: number;
  daysSinceJoin: number;
  hasLabMembership: boolean;
}

// ─── Rule definitions ───────────────────────────────────────

const UPSELL_RULES: Array<{
  id: string;
  condition: (state: UserState) => boolean;
  suggestion: Omit<UpsellSuggestion, "id">;
}> = [
  {
    id: "meal_plan_low_protein",
    condition: (s) => !s.addOnSlugs.includes("meal-plans") && s.avgProtein3d < 100 && s.avgProtein3d > 0,
    suggestion: {
      productSlug: "meal-plans",
      productName: "Meal Plans & Recipes",
      headline: "Your protein intake is trending low",
      description: "Members who add meal plans average 35% higher protein adherence. Get weekly plans with high-protein recipes tailored to your treatment.",
      discountPct: 20,
      priority: 10,
    },
  },
  {
    id: "coaching_no_checkins",
    condition: (s) => !s.addOnSlugs.includes("coaching-upgrade") && s.progressCount > 14 && s.planSlug === "essential",
    suggestion: {
      productSlug: "coaching-upgrade",
      productName: "Premium Coaching",
      headline: "Ready for more accountability?",
      description: "You've been consistent with tracking. Coaching check-ins help members stay on track during the critical months 2-4.",
      priority: 8,
    },
  },
  {
    id: "metabolic_support_month2",
    condition: (s) => !s.addOnSlugs.includes("metabolic-support") && s.daysSinceJoin >= 30 && s.daysSinceJoin <= 90,
    suggestion: {
      productSlug: "metabolic-support",
      productName: "Metabolic Support Bundle",
      headline: "Support your metabolism during active treatment",
      description: "Targeted nutritional support that complements your medication. Most popular during months 2-3 of treatment.",
      priority: 6,
    },
  },
  {
    id: "hydration_low_water",
    condition: (s) => !s.addOnSlugs.includes("protein-hydration") && s.avgWater3d < 60 && s.avgWater3d > 0,
    suggestion: {
      productSlug: "protein-hydration",
      productName: "Protein & Hydration Bundle",
      headline: "Your hydration needs attention",
      description: "Adequate hydration is especially important during GLP-1 treatment. This bundle makes hitting your daily targets easier.",
      priority: 7,
    },
  },
  {
    id: "upgrade_essential_to_premium",
    condition: (s) => s.planSlug === "essential" && s.daysSinceJoin >= 14,
    suggestion: {
      productSlug: "premium",
      productName: "Premium Plan",
      headline: "Unlock meal plans, coaching, and more",
      description: "Premium members have 40% higher adherence rates. Upgrade to get weekly meal plans, bi-weekly coaching, and advanced tracking.",
      priority: 9,
    },
  },
  {
    id: "lab_membership_month3",
    condition: (s) => !s.hasLabMembership && s.daysSinceJoin >= 75,
    suggestion: {
      productSlug: "lab-membership",
      productName: "Lab Membership",
      headline: "Track your metabolic health markers",
      description: "You're approaching month 3 — a great time for a metabolic panel. See how your biomarkers are responding to treatment.",
      priority: 5,
    },
  },
];

// ─── Engine ─────────────────────────────────────────────────

export async function evaluateUpsells(userId: string): Promise<UpsellSuggestion[]> {
  // Fetch user state in parallel
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000);
  const [subscription, user, recentProgress, progressCount] = await Promise.all([
    db.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { items: { include: { product: { select: { slug: true } } } } },
    }),
    db.user.findUnique({ where: { id: userId }, select: { createdAt: true } }),
    db.progressEntry.findMany({
      where: { userId, date: { gte: threeDaysAgo } },
      select: { proteinG: true, waterOz: true },
    }),
    db.progressEntry.count({ where: { userId } }),
  ]);

  const planSlug = subscription?.items[0]?.product?.slug || null;
  const addOnSlugs = subscription?.items.slice(1).map((i) => i.product?.slug).filter(Boolean) as string[] || [];

  const avgProtein3d = recentProgress.length > 0
    ? recentProgress.reduce((s, e) => s + (e.proteinG || 0), 0) / recentProgress.length
    : 0;
  const avgWater3d = recentProgress.length > 0
    ? recentProgress.reduce((s, e) => s + (e.waterOz || 0), 0) / recentProgress.length
    : 0;

  const daysSinceJoin = user ? Math.floor((Date.now() - user.createdAt.getTime()) / 86400000) : 0;

  const state: UserState = {
    userId,
    planSlug,
    addOnSlugs,
    avgProtein3d,
    avgWater3d,
    progressCount,
    daysSinceJoin,
    hasLabMembership: addOnSlugs.includes("lab-membership"),
  };

  // Evaluate rules
  return UPSELL_RULES
    .filter((rule) => rule.condition(state))
    .map((rule) => ({ id: rule.id, ...rule.suggestion }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 2); // Max 2 upsells at a time
}
