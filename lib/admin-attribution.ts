import { db } from "@/lib/db";

// ── Types ─────────────────────────────────────────────────────

export type AttributionModel = "first_click" | "last_click" | "linear";

export interface AttributionOverview {
  totalTouches: number;
  uniqueLeads: number;
  conversions: number;
  revenueAttributed: number;
  avgTouchesPerConversion: number;
  topChannel: string;
}

export interface ChannelAttribution {
  channel: string;
  touches: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  avgLTV: number;
}

export interface ContentAttribution {
  content: string;
  type: string;
  touches: number;
  conversions: number;
  revenue: number;
}

export interface CampaignAttribution {
  campaign: string;
  touches: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

// ── Overview KPIs ─────────────────────────────────────────────

export async function getAttributionOverview(
  from: Date,
  to: Date
): Promise<AttributionOverview> {
  const touches = await db.attributionTouch.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: {
      id: true,
      leadId: true,
      userId: true,
      channel: true,
      convertedAt: true,
      revenueCents: true,
    },
  });

  const totalTouches = touches.length;
  const uniqueLeadIds = new Set(touches.map((t) => t.leadId || t.userId).filter(Boolean));
  const uniqueLeads = uniqueLeadIds.size;
  const converted = touches.filter((t) => t.convertedAt != null);
  const conversions = new Set(converted.map((t) => t.userId || t.leadId).filter(Boolean)).size;
  const revenueAttributed = touches.reduce((sum, t) => sum + (t.revenueCents || 0), 0);

  const avgTouchesPerConversion = conversions > 0 ? Math.round((totalTouches / conversions) * 10) / 10 : 0;

  // Top channel by touch count
  const channelCounts: Record<string, number> = {};
  for (const t of touches) {
    channelCounts[t.channel] = (channelCounts[t.channel] || 0) + 1;
  }
  const topChannel =
    Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "none";

  return {
    totalTouches,
    uniqueLeads,
    conversions,
    revenueAttributed,
    avgTouchesPerConversion,
    topChannel,
  };
}

// ── Channel Attribution ───────────────────────────────────────

export async function getChannelAttribution(
  from: Date,
  to: Date,
  model: AttributionModel = "last_click"
): Promise<ChannelAttribution[]> {
  const touches = await db.attributionTouch.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: {
      channel: true,
      touchType: true,
      convertedAt: true,
      revenueCents: true,
      userId: true,
      leadId: true,
    },
  });

  // Group by channel
  const channelMap: Record<
    string,
    { touches: number; convertedUsers: Set<string>; totalRevenue: number }
  > = {};

  for (const t of touches) {
    if (!channelMap[t.channel]) {
      channelMap[t.channel] = { touches: 0, convertedUsers: new Set(), totalRevenue: 0 };
    }
    const entry = channelMap[t.channel];
    entry.touches++;

    if (t.convertedAt) {
      const uid = t.userId || t.leadId || "";
      entry.convertedUsers.add(uid);

      const rev = t.revenueCents || 0;
      if (model === "first_click" && t.touchType === "FIRST_CLICK") {
        entry.totalRevenue += rev;
      } else if (model === "last_click" && t.touchType === "LAST_CLICK") {
        entry.totalRevenue += rev;
      } else if (model === "linear") {
        entry.totalRevenue += rev;
      }
    }
  }

  return Object.entries(channelMap)
    .map(([channel, data]) => {
      const conversions = data.convertedUsers.size;
      return {
        channel,
        touches: data.touches,
        conversions,
        revenue: data.totalRevenue,
        conversionRate: data.touches > 0 ? Math.round((conversions / data.touches) * 1000) / 10 : 0,
        avgLTV: conversions > 0 ? Math.round(data.totalRevenue / conversions) : 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

// ── Content Attribution ───────────────────────────────────────

export async function getContentAttribution(
  from: Date,
  to: Date
): Promise<ContentAttribution[]> {
  const touches = await db.attributionTouch.findMany({
    where: {
      createdAt: { gte: from, lte: to },
      content: { not: null },
    },
    select: {
      content: true,
      channel: true,
      convertedAt: true,
      revenueCents: true,
    },
  });

  const contentMap: Record<
    string,
    { type: string; touches: number; conversions: number; revenue: number }
  > = {};

  for (const t of touches) {
    const key = t.content || "unknown";
    if (!contentMap[key]) {
      // Infer type from channel
      const type =
        t.channel === "email"
          ? "Email"
          : t.channel === "paid"
            ? "Ad"
            : t.channel === "organic"
              ? "Blog"
              : t.channel === "social"
                ? "Social"
                : "Other";
      contentMap[key] = { type, touches: 0, conversions: 0, revenue: 0 };
    }
    contentMap[key].touches++;
    if (t.convertedAt) {
      contentMap[key].conversions++;
      contentMap[key].revenue += t.revenueCents || 0;
    }
  }

  return Object.entries(contentMap)
    .map(([content, data]) => ({ content, ...data }))
    .sort((a, b) => b.revenue - a.revenue);
}

// ── Campaign Attribution ──────────────────────────────────────

export async function getCampaignAttribution(
  from: Date,
  to: Date
): Promise<CampaignAttribution[]> {
  const touches = await db.attributionTouch.findMany({
    where: {
      createdAt: { gte: from, lte: to },
      campaign: { not: null },
    },
    select: {
      campaign: true,
      convertedAt: true,
      revenueCents: true,
    },
  });

  const campaignMap: Record<
    string,
    { touches: number; conversions: number; revenue: number }
  > = {};

  for (const t of touches) {
    const key = t.campaign || "unknown";
    if (!campaignMap[key]) {
      campaignMap[key] = { touches: 0, conversions: 0, revenue: 0 };
    }
    campaignMap[key].touches++;
    if (t.convertedAt) {
      campaignMap[key].conversions++;
      campaignMap[key].revenue += t.revenueCents || 0;
    }
  }

  return Object.entries(campaignMap)
    .map(([campaign, data]) => ({
      campaign,
      ...data,
      conversionRate:
        data.touches > 0
          ? Math.round((data.conversions / data.touches) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

// ── Record a Touch ────────────────────────────────────────────

export async function recordTouch(data: {
  leadId?: string;
  userId?: string;
  channel: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  landingPage?: string;
}) {
  // Determine touch type by checking existing touches for this user/lead
  const identifier = data.userId || data.leadId;
  let touchType = "FIRST_CLICK";

  if (identifier) {
    const existing = await db.attributionTouch.count({
      where: data.userId
        ? { userId: data.userId }
        : { leadId: data.leadId },
    });
    touchType = existing === 0 ? "FIRST_CLICK" : "ASSIST";
  }

  return db.attributionTouch.create({
    data: {
      leadId: data.leadId,
      userId: data.userId,
      sessionId: crypto.randomUUID(),
      touchType,
      channel: data.channel,
      source: data.source,
      medium: data.medium,
      campaign: data.campaign,
      content: data.content,
      landingPage: data.landingPage,
    },
  });
}

// ── Attribute Conversion ──────────────────────────────────────

export async function attributeConversion(
  userId: string,
  _orderId: string,
  revenueCents: number
) {
  // Find all touches for this user
  const touches = await db.attributionTouch.findMany({
    where: {
      OR: [{ userId }, { leadId: userId }],
      convertedAt: null,
    },
    orderBy: { createdAt: "asc" },
  });

  if (touches.length === 0) return;

  const now = new Date();
  const linearShare = touches.length > 0 ? Math.round(revenueCents / touches.length) : 0;

  // Update all touches with conversion data using all 3 models
  const updates = touches.map((touch, index) => {
    let attributedRevenue = 0;

    // First-click: all revenue to first touch
    if (index === 0) {
      attributedRevenue += revenueCents; // first_click model weight
    }

    // Last-click: all revenue to last touch
    if (index === touches.length - 1) {
      // Mark as LAST_CLICK
      return db.attributionTouch.update({
        where: { id: touch.id },
        data: {
          convertedAt: now,
          revenueCents: attributedRevenue + revenueCents + linearShare, // first + last + linear combined
          touchType: index === 0 ? "FIRST_CLICK" : "LAST_CLICK",
        },
      });
    }

    return db.attributionTouch.update({
      where: { id: touch.id },
      data: {
        convertedAt: now,
        revenueCents: (index === 0 ? revenueCents : 0) + linearShare,
        touchType: index === 0 ? "FIRST_CLICK" : "ASSIST",
      },
    });
  });

  await Promise.all(updates);

  return { touchesAttributed: touches.length };
}
