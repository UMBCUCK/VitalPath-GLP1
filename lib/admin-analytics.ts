import { db } from "@/lib/db";

// ── Types ──────────────────────────────────────────────────────

export interface FunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
}

export interface AcquisitionRow {
  source: string;
  users: number;
  conversions: number;
  revenueCents: number;
}

export interface UpsellMetric {
  id: string;
  headline: string;
  triggerEvent: string;
  productName: string;
  shownCount: number;
  clickedCount: number;
  conversionRate: number;
}

// ── Funnel Data ────────────────────────────────────────────────

export async function getFunnelData(from: Date, to: Date): Promise<FunnelStage[]> {
  const [
    quizStartedEvents,
    quizCompletedCount,
    intakeCompletedCount,
    checkoutStartedEvents,
    subscribedCount,
  ] = await Promise.all([
    db.analyticsEvent.count({
      where: { eventName: "quiz_started", timestamp: { gte: from, lte: to } },
    }),
    db.quizSubmission.count({
      where: { completedAt: { gte: from, lte: to } },
    }),
    db.intakeSubmission.count({
      where: {
        status: { not: "PENDING" },
        createdAt: { gte: from, lte: to },
      },
    }),
    db.analyticsEvent.count({
      where: { eventName: "checkout_initiated", timestamp: { gte: from, lte: to } },
    }),
    db.subscription.count({
      where: { createdAt: { gte: from, lte: to } },
    }),
  ]);

  const stages = [
    { stage: "Quiz Started", count: quizStartedEvents },
    { stage: "Quiz Completed", count: quizCompletedCount },
    { stage: "Intake Completed", count: intakeCompletedCount },
    { stage: "Checkout Started", count: checkoutStartedEvents },
    { stage: "Subscribed", count: subscribedCount },
  ];

  return stages.map((s, i) => {
    const prev = i > 0 ? stages[i - 1].count : s.count;
    return {
      ...s,
      conversionRate: prev > 0 ? Math.round((s.count / prev) * 1000) / 10 : 0,
    };
  });
}

// ── Acquisition Attribution ────────────────────────────────────

export async function getAcquisitionAttribution(
  from: Date,
  to: Date
): Promise<AcquisitionRow[]> {
  // Group leads by UTM source
  const leads = await db.lead.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: {
      utmSource: true,
      convertedAt: true,
      userId: true,
    },
  });

  // Collect unique converted user IDs for revenue lookup
  const convertedUserIds = leads
    .filter((l) => l.convertedAt && l.userId)
    .map((l) => l.userId as string);

  // Fetch order revenue for converted leads
  const orders =
    convertedUserIds.length > 0
      ? await db.order.findMany({
          where: { userId: { in: convertedUserIds } },
          select: { userId: true, totalCents: true },
        })
      : [];

  // Build revenue map
  const revenueByUser: Record<string, number> = {};
  for (const o of orders) {
    revenueByUser[o.userId] = (revenueByUser[o.userId] || 0) + o.totalCents;
  }

  // Aggregate by source
  const sourceMap: Record<
    string,
    { users: number; conversions: number; revenueCents: number }
  > = {};

  for (const lead of leads) {
    const src = lead.utmSource || "Direct / Unknown";
    if (!sourceMap[src]) {
      sourceMap[src] = { users: 0, conversions: 0, revenueCents: 0 };
    }
    sourceMap[src].users++;
    if (lead.convertedAt) {
      sourceMap[src].conversions++;
      if (lead.userId) {
        sourceMap[src].revenueCents += revenueByUser[lead.userId] || 0;
      }
    }
  }

  return Object.entries(sourceMap)
    .map(([source, data]) => ({ source, ...data }))
    .sort((a, b) => b.revenueCents - a.revenueCents);
}

// ── Upsell Performance ─────────────────────────────────────────

export async function getUpsellPerformance(): Promise<UpsellMetric[]> {
  const offers = await db.upsellOffer.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { sortOrder: "asc" },
  });

  // Count shown/clicked events per offer
  const [shownEvents, clickedEvents] = await Promise.all([
    db.analyticsEvent.findMany({
      where: { eventName: "upsell_shown" },
      select: { properties: true },
    }),
    db.analyticsEvent.findMany({
      where: { eventName: "upsell_clicked" },
      select: { properties: true },
    }),
  ]);

  // Build counts by offer ID
  const shownByOffer: Record<string, number> = {};
  const clickedByOffer: Record<string, number> = {};

  for (const e of shownEvents) {
    const props = e.properties as Record<string, unknown> | null;
    const offerId = props?.offerId as string | undefined;
    if (offerId) shownByOffer[offerId] = (shownByOffer[offerId] || 0) + 1;
  }
  for (const e of clickedEvents) {
    const props = e.properties as Record<string, unknown> | null;
    const offerId = props?.offerId as string | undefined;
    if (offerId) clickedByOffer[offerId] = (clickedByOffer[offerId] || 0) + 1;
  }

  return offers.map((offer) => {
    const shown = shownByOffer[offer.id] || 0;
    const clicked = clickedByOffer[offer.id] || 0;
    return {
      id: offer.id,
      headline: offer.headline,
      triggerEvent: offer.triggerEvent,
      productName: offer.product.name,
      shownCount: shown,
      clickedCount: clicked,
      conversionRate: shown > 0 ? Math.round((clicked / shown) * 1000) / 10 : 0,
    };
  });
}
