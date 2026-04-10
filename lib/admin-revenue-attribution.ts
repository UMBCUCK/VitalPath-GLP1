import { db } from "@/lib/db";

// ─── Revenue by Content Piece ──────────────────────────────────

export async function getRevenueByContent(from: Date, to: Date) {
  const rows = await db.revenueAttribution.groupBy({
    by: ["contentPiece", "contentType"],
    where: {
      createdAt: { gte: from, lte: to },
      contentPiece: { not: null },
    },
    _sum: { revenueCents: true },
    _count: { id: true },
    _avg: { revenueCents: true },
    orderBy: { _sum: { revenueCents: "desc" } },
  });

  return rows.map((r) => ({
    contentPiece: r.contentPiece ?? "Unknown",
    contentType: r.contentType ?? "UNKNOWN",
    totalRevenue: r._sum.revenueCents ?? 0,
    orderCount: r._count.id,
    avgOrderValue: Math.round(r._avg.revenueCents ?? 0),
  }));
}

// ─── Content ROI (Blog Posts joined) ───────────────────────────

export async function getContentROI(from: Date, to: Date) {
  const attributions = await db.revenueAttribution.groupBy({
    by: ["contentPiece"],
    where: {
      createdAt: { gte: from, lte: to },
      contentType: "BLOG_POST",
      contentPiece: { not: null },
    },
    _sum: { revenueCents: true },
    _count: { id: true },
    orderBy: { _sum: { revenueCents: "desc" } },
  });

  const slugs = attributions
    .map((a) => a.contentPiece)
    .filter((s): s is string => !!s);

  const posts = await db.blogPost.findMany({
    where: { slug: { in: slugs } },
    select: { slug: true, title: true, isPublished: true },
  });

  const postMap = new Map(posts.map((p) => [p.slug, p]));

  return attributions.map((a) => {
    const post = postMap.get(a.contentPiece ?? "");
    return {
      slug: a.contentPiece ?? "",
      title: post?.title ?? a.contentPiece ?? "Unknown",
      isPublished: post?.isPublished ?? false,
      totalRevenue: a._sum.revenueCents ?? 0,
      orderCount: a._count.id,
    };
  });
}

// ─── Channel ROI ───────────────────────────────────────────────

export async function getChannelROI(
  from: Date,
  to: Date,
  model?: string
) {
  const where: Record<string, unknown> = {
    createdAt: { gte: from, lte: to },
  };
  if (model) where.model = model;

  const rows = await db.revenueAttribution.groupBy({
    by: ["channel"],
    where,
    _sum: { revenueCents: true },
    _count: { id: true },
    _avg: { revenueCents: true },
    orderBy: { _sum: { revenueCents: "desc" } },
  });

  return rows.map((r) => ({
    channel: r.channel,
    totalRevenue: r._sum.revenueCents ?? 0,
    orderCount: r._count.id,
    avgLTV: Math.round(r._avg.revenueCents ?? 0),
  }));
}

// ─── Marketing Spend Recommendations ───────────────────────────

interface Recommendation {
  recommendation: string;
  channel: string;
  metric: string;
  currentValue: string;
  projectedImpact: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export async function getMarketingSpendRecommendations(
  from: Date,
  to: Date
): Promise<Recommendation[]> {
  const channels = await getChannelROI(from, to);
  if (channels.length === 0) return [];

  const recommendations: Recommendation[] = [];
  const totalRevenue = channels.reduce((s, c) => s + c.totalRevenue, 0);

  // Sort by revenue desc
  const sorted = [...channels].sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  // Highest ROI channel
  if (sorted[0]) {
    const pct = totalRevenue > 0
      ? ((sorted[0].totalRevenue / totalRevenue) * 100).toFixed(1)
      : "0";
    recommendations.push({
      recommendation: `Increase spend on ${sorted[0].channel} — top-performing channel at ${pct}% of attributed revenue`,
      channel: sorted[0].channel,
      metric: "Revenue share",
      currentValue: `$${(sorted[0].totalRevenue / 100).toLocaleString()}`,
      projectedImpact: `+15-25% revenue with 20% budget increase`,
      priority: "HIGH",
    });
  }

  // Lowest ROI channel with significant volume (>5% of orders)
  const totalOrders = channels.reduce((s, c) => s + c.orderCount, 0);
  const lowPerformers = sorted
    .filter(
      (c) =>
        c.orderCount > 0 &&
        totalOrders > 0 &&
        c.orderCount / totalOrders > 0.05
    )
    .reverse();

  if (lowPerformers[0] && lowPerformers[0] !== sorted[0]) {
    recommendations.push({
      recommendation: `Consider reducing ${lowPerformers[0].channel} spend — lowest ROI among active channels`,
      channel: lowPerformers[0].channel,
      metric: "Avg order value",
      currentValue: `$${(lowPerformers[0].avgLTV / 100).toFixed(2)}`,
      projectedImpact: `Reallocate budget to higher-performing channels`,
      priority: "MEDIUM",
    });
  }

  // Check for growing channels — compare first half vs second half of period
  const midpoint = new Date(
    (from.getTime() + to.getTime()) / 2
  );

  const firstHalf = await db.revenueAttribution.groupBy({
    by: ["channel"],
    where: { createdAt: { gte: from, lt: midpoint } },
    _count: { id: true },
  });

  const secondHalf = await db.revenueAttribution.groupBy({
    by: ["channel"],
    where: { createdAt: { gte: midpoint, lte: to } },
    _count: { id: true },
  });

  const firstMap = new Map(firstHalf.map((r) => [r.channel, r._count.id]));
  const secondMap = new Map(secondHalf.map((r) => [r.channel, r._count.id]));

  for (const [channel, secondCount] of secondMap.entries()) {
    const firstCount = firstMap.get(channel) ?? 0;
    if (firstCount > 0 && secondCount > firstCount) {
      const growthPct = (
        ((secondCount - firstCount) / firstCount) * 100
      ).toFixed(0);
      if (Number(growthPct) >= 20) {
        recommendations.push({
          recommendation: `Scale ${channel} — conversions up ${growthPct}% in recent period`,
          channel,
          metric: "Conversion growth",
          currentValue: `${secondCount} orders (2nd half)`,
          projectedImpact: `Sustained growth potential with increased investment`,
          priority: Number(growthPct) >= 50 ? "HIGH" : "MEDIUM",
        });
      }
    }
  }

  // If we have few recommendations, add a general one
  if (recommendations.length < 2 && channels.length > 1) {
    recommendations.push({
      recommendation: `Diversify across channels — ${channels.length} active channels detected`,
      channel: "all",
      metric: "Channel count",
      currentValue: `${channels.length} channels`,
      projectedImpact: `Reduced risk from single-channel dependency`,
      priority: "LOW",
    });
  }

  return recommendations;
}
