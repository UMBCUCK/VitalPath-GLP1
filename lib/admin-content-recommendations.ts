import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────────

export interface RecommendationAnalytics {
  totalRecommendations: number;
  viewRate: number;
  clickRate: number;
  mostRecommendedTitle: string;
  bestPerformingTitle: string;
}

export interface ContentPerformanceRow {
  contentId: string;
  contentType: string;
  title: string;
  timesRecommended: number;
  views: number;
  clicks: number;
  clickRate: number;
  avgScore: number;
}

export interface RecommendationRow {
  id: string;
  userId: string;
  contentType: string;
  contentId: string;
  score: number;
  reason: string;
  wasViewed: boolean;
  wasClicked: boolean;
  createdAt: Date;
}

// ─── Generate recommendations for a single user ────────────────

export async function generateRecommendations(
  userId: string
): Promise<RecommendationRow[]> {
  // Fetch user profile
  const profile = await db.patientProfile.findUnique({
    where: { userId },
    select: {
      mealPlanPreference: true,
      goalWeightLbs: true,
      state: true,
      lifecycleStage: true,
    },
  });

  // Fetch published content
  const [blogPosts, recipes, mealPlans] = await Promise.all([
    db.blogPost.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, category: true, tags: true },
    }),
    db.recipe.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        category: true,
        tags: true,
        isGlp1Friendly: true,
        proteinG: true,
        calories: true,
      },
    }),
    db.mealPlan.findMany({
      where: { isPublished: true },
      select: { id: true, title: true, mode: true },
    }),
  ]);

  const pref = profile?.mealPlanPreference || "standard";
  const stage = profile?.lifecycleStage || "ACTIVE_NEW";

  type ScoredItem = {
    contentType: string;
    contentId: string;
    score: number;
    reason: string;
  };
  const scored: ScoredItem[] = [];

  // Score recipes
  for (const recipe of recipes) {
    let score = 10; // base score
    const reasons: string[] = [];

    if (pref && recipe.category === pref) {
      score += 30;
      reasons.push("Matches meal preference");
    }
    if (recipe.isGlp1Friendly) {
      score += 20;
      reasons.push("GLP-1 friendly");
    }
    if (recipe.proteinG && recipe.proteinG > 30) {
      score += 15;
      reasons.push("High protein");
    }
    if (recipe.calories && recipe.calories < 500) {
      score += 10;
      reasons.push("Low calorie");
    }

    scored.push({
      contentType: "RECIPE",
      contentId: recipe.id,
      score: Math.min(score, 100),
      reason: reasons.length > 0 ? reasons.join(", ") : "General recommendation",
    });
  }

  // Score blog posts
  const stageCategories: Record<string, string[]> = {
    LEAD: ["education", "news"],
    QUIZ_COMPLETE: ["education", "nutrition"],
    INTAKE_PENDING: ["education", "medication"],
    ACTIVE_NEW: ["education", "medication", "nutrition"],
    ACTIVE_ESTABLISHED: ["lifestyle", "nutrition"],
    AT_RISK: ["medication", "lifestyle"],
    CHURNED: ["news", "lifestyle"],
  };

  const relevantCategories = stageCategories[stage] || ["education"];

  for (const post of blogPosts) {
    let score = 10;
    const reasons: string[] = [];

    if (post.category && relevantCategories.includes(post.category)) {
      score += 25;
      reasons.push(`Matches lifecycle stage (${stage})`);
    }

    scored.push({
      contentType: "BLOG_POST",
      contentId: post.id,
      score: Math.min(score, 100),
      reason: reasons.length > 0 ? reasons.join(", ") : "General recommendation",
    });
  }

  // Score meal plans
  for (const plan of mealPlans) {
    let score = 10;
    const reasons: string[] = [];

    if (plan.mode === pref) {
      score += 30;
      reasons.push("Mode matches preference");
    }

    scored.push({
      contentType: "MEAL_PLAN",
      contentId: plan.id,
      score: Math.min(score, 100),
      reason: reasons.length > 0 ? reasons.join(", ") : "General recommendation",
    });
  }

  // Sort by score, take top 10 per content type
  const topByType: Record<string, ScoredItem[]> = {};
  for (const item of scored) {
    if (!topByType[item.contentType]) topByType[item.contentType] = [];
    topByType[item.contentType].push(item);
  }

  const toSave: ScoredItem[] = [];
  for (const type of Object.keys(topByType)) {
    topByType[type].sort((a, b) => b.score - a.score);
    toSave.push(...topByType[type].slice(0, 10));
  }

  // Delete old recommendations for this user
  await db.contentRecommendation.deleteMany({ where: { userId } });

  // Batch create
  if (toSave.length > 0) {
    await db.contentRecommendation.createMany({
      data: toSave.map((item) => ({
        userId,
        contentType: item.contentType,
        contentId: item.contentId,
        score: item.score,
        reason: item.reason,
      })),
    });
  }

  const saved = await db.contentRecommendation.findMany({
    where: { userId },
    orderBy: { score: "desc" },
  });

  return saved as RecommendationRow[];
}

// ─── Analytics KPIs ────────────────────────────────────────────

export async function getRecommendationAnalytics(): Promise<RecommendationAnalytics> {
  const total = await db.contentRecommendation.count();
  const viewed = await db.contentRecommendation.count({
    where: { wasViewed: true },
  });
  const clicked = await db.contentRecommendation.count({
    where: { wasClicked: true },
  });

  const viewRate = total > 0 ? (viewed / total) * 100 : 0;
  const clickRate = total > 0 ? (clicked / total) * 100 : 0;

  // Most recommended content
  const allRecs = await db.contentRecommendation.findMany({
    select: { contentId: true, contentType: true },
  });

  const contentCounts: Record<string, { count: number; type: string }> = {};
  for (const rec of allRecs) {
    const key = `${rec.contentType}:${rec.contentId}`;
    if (!contentCounts[key]) contentCounts[key] = { count: 0, type: rec.contentType };
    contentCounts[key].count++;
  }

  let mostRecommendedId = "";
  let mostRecommendedType = "";
  let maxCount = 0;
  for (const [key, val] of Object.entries(contentCounts)) {
    if (val.count > maxCount) {
      maxCount = val.count;
      mostRecommendedId = key.split(":")[1];
      mostRecommendedType = val.type;
    }
  }

  // Resolve titles
  const mostRecommendedTitle = await resolveContentTitle(
    mostRecommendedId,
    mostRecommendedType
  );

  // Best performing (highest click rate)
  const clickedRecs = await db.contentRecommendation.findMany({
    where: { wasClicked: true },
    select: { contentId: true, contentType: true },
  });

  const clickCounts: Record<string, { clicks: number; type: string }> = {};
  for (const rec of clickedRecs) {
    const key = `${rec.contentType}:${rec.contentId}`;
    if (!clickCounts[key]) clickCounts[key] = { clicks: 0, type: rec.contentType };
    clickCounts[key].clicks++;
  }

  let bestId = mostRecommendedId;
  let bestType = mostRecommendedType;
  let maxClicks = 0;
  for (const [key, val] of Object.entries(clickCounts)) {
    if (val.clicks > maxClicks) {
      maxClicks = val.clicks;
      bestId = key.split(":")[1];
      bestType = val.type;
    }
  }

  const bestPerformingTitle = await resolveContentTitle(bestId, bestType);

  return {
    totalRecommendations: total,
    viewRate: Math.round(viewRate * 10) / 10,
    clickRate: Math.round(clickRate * 10) / 10,
    mostRecommendedTitle: mostRecommendedTitle || "N/A",
    bestPerformingTitle: bestPerformingTitle || "N/A",
  };
}

// ─── Content performance ───────────────────────────────────────

export async function getContentPerformance(): Promise<ContentPerformanceRow[]> {
  const allRecs = await db.contentRecommendation.findMany({
    select: {
      contentId: true,
      contentType: true,
      score: true,
      wasViewed: true,
      wasClicked: true,
    },
  });

  // Aggregate by content
  const agg: Record<
    string,
    {
      contentId: string;
      contentType: string;
      count: number;
      views: number;
      clicks: number;
      totalScore: number;
    }
  > = {};

  for (const rec of allRecs) {
    const key = `${rec.contentType}:${rec.contentId}`;
    if (!agg[key]) {
      agg[key] = {
        contentId: rec.contentId,
        contentType: rec.contentType,
        count: 0,
        views: 0,
        clicks: 0,
        totalScore: 0,
      };
    }
    agg[key].count++;
    if (rec.wasViewed) agg[key].views++;
    if (rec.wasClicked) agg[key].clicks++;
    agg[key].totalScore += rec.score;
  }

  // Resolve titles and compute click rate
  const rows: ContentPerformanceRow[] = [];
  for (const val of Object.values(agg)) {
    const title = await resolveContentTitle(val.contentId, val.contentType);
    rows.push({
      contentId: val.contentId,
      contentType: val.contentType,
      title: title || "Unknown",
      timesRecommended: val.count,
      views: val.views,
      clicks: val.clicks,
      clickRate:
        val.count > 0
          ? Math.round((val.clicks / val.count) * 1000) / 10
          : 0,
      avgScore: Math.round((val.totalScore / val.count) * 10) / 10,
    });
  }

  // Sort by click rate descending
  rows.sort((a, b) => b.clickRate - a.clickRate);
  return rows;
}

// ─── User recommendations ──────────────────────────────────────

export async function getUserRecommendations(
  userId: string,
  type?: string
): Promise<RecommendationRow[]> {
  const where: { userId: string; contentType?: string } = { userId };
  if (type) where.contentType = type;

  return db.contentRecommendation.findMany({
    where,
    orderBy: { score: "desc" },
  }) as Promise<RecommendationRow[]>;
}

// ─── Batch generate ────────────────────────────────────────────

export async function generateBatchRecommendations(): Promise<number> {
  // Get all active patients
  const patients = await db.user.findMany({
    where: {
      role: "PATIENT",
      profile: { isNot: null },
    },
    select: { id: true },
    take: 500, // safety limit
  });

  let count = 0;
  for (const patient of patients) {
    await generateRecommendations(patient.id);
    count++;
  }

  return count;
}

// ─── Helper: resolve content title ─────────────────────────────

async function resolveContentTitle(
  contentId: string,
  contentType: string
): Promise<string> {
  if (!contentId) return "";

  switch (contentType) {
    case "BLOG_POST": {
      const post = await db.blogPost.findUnique({
        where: { id: contentId },
        select: { title: true },
      });
      return post?.title || "";
    }
    case "RECIPE": {
      const recipe = await db.recipe.findUnique({
        where: { id: contentId },
        select: { title: true },
      });
      return recipe?.title || "";
    }
    case "MEAL_PLAN": {
      const plan = await db.mealPlan.findUnique({
        where: { id: contentId },
        select: { title: true },
      });
      return plan?.title || "";
    }
    default:
      return "";
  }
}
