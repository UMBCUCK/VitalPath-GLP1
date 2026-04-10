import { db } from "@/lib/db";

// ── Funnel stage definitions ────────────────────────────────

const FUNNEL_STAGES = [
  "page_view",
  "quiz_started",
  "quiz_completed",
  "intake_completed",
  "checkout_initiated",
  "payment_succeeded",
  "subscription_active",
] as const;

type FunnelStage = (typeof FUNNEL_STAGES)[number];

// ── Conversion Metrics (funnel) ─────────────────────────────

export async function getConversionMetrics(from: Date, to: Date) {
  // Get event counts per stage
  const stageCounts: Record<FunnelStage, number> = {
    page_view: 0,
    quiz_started: 0,
    quiz_completed: 0,
    intake_completed: 0,
    checkout_initiated: 0,
    payment_succeeded: 0,
    subscription_active: 0,
  };

  const eventGroups = await db.analyticsEvent.groupBy({
    by: ["eventName"],
    where: {
      timestamp: { gte: from, lte: to },
      eventName: { in: [...FUNNEL_STAGES] },
    },
    _count: true,
  });

  for (const g of eventGroups) {
    if (g.eventName in stageCounts) {
      stageCounts[g.eventName as FunnelStage] = g._count;
    }
  }

  // Supplement with DB counts if analytics events are sparse
  if (stageCounts.quiz_completed === 0) {
    stageCounts.quiz_completed = await db.quizSubmission.count({
      where: { completedAt: { gte: from, lte: to } },
    });
  }
  if (stageCounts.intake_completed === 0) {
    stageCounts.intake_completed = await db.intakeSubmission.count({
      where: {
        status: { in: ["SUBMITTED", "APPROVED", "UNDER_REVIEW"] },
        createdAt: { gte: from, lte: to },
      },
    });
  }
  if (stageCounts.payment_succeeded === 0) {
    stageCounts.payment_succeeded = await db.order.count({
      where: { createdAt: { gte: from, lte: to } },
    });
  }
  if (stageCounts.subscription_active === 0) {
    stageCounts.subscription_active = await db.subscription.count({
      where: { createdAt: { gte: from, lte: to } },
    });
  }

  // Build funnel stages with conversion + drop-off rates
  const stages = FUNNEL_STAGES.map((name, i) => {
    const count = stageCounts[name];
    const prevCount = i > 0 ? stageCounts[FUNNEL_STAGES[i - 1]] : count;
    const conversionRate = prevCount > 0 ? Math.round((count / prevCount) * 1000) / 10 : 0;
    const dropOffRate = prevCount > 0 ? Math.round(((prevCount - count) / prevCount) * 1000) / 10 : 0;
    const overallRate = stageCounts.page_view > 0 ? Math.round((count / stageCounts.page_view) * 1000) / 10 : 0;

    return {
      name,
      label: formatStageName(name),
      count,
      conversionRate,
      dropOffRate,
      overallRate,
    };
  });

  // Bottleneck: stage with highest drop-off (skip first)
  const stagesWithDropOff = stages.slice(1);
  const bottleneck = stagesWithDropOff.reduce(
    (max, s) => (s.dropOffRate > max.dropOffRate ? s : max),
    stagesWithDropOff[0]
  );

  // Average time between key stages (rough estimate from events)
  const avgTimeToConvert = await estimateTimeToConvert(from, to);

  return {
    stages,
    bottleneck: bottleneck
      ? { stage: bottleneck.name, label: bottleneck.label, dropOffRate: bottleneck.dropOffRate }
      : null,
    overallConversion:
      stageCounts.page_view > 0
        ? Math.round((stageCounts.subscription_active / stageCounts.page_view) * 1000) / 10
        : 0,
    avgTimeToConvert,
  };
}

async function estimateTimeToConvert(from: Date, to: Date) {
  // Estimate by checking user creation vs first order
  const usersWithOrders = await db.user.findMany({
    where: {
      role: "PATIENT",
      orders: { some: { createdAt: { gte: from, lte: to } } },
    },
    select: {
      createdAt: true,
      orders: {
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { createdAt: true },
      },
    },
    take: 100,
  });

  if (usersWithOrders.length === 0) return { avgDays: 0, medianDays: 0 };

  const daysToConvert = usersWithOrders
    .filter((u) => u.orders[0])
    .map((u) => {
      const diff = u.orders[0].createdAt.getTime() - u.createdAt.getTime();
      return Math.max(0, Math.round(diff / 86400000));
    });

  daysToConvert.sort((a, b) => a - b);
  const avg = Math.round((daysToConvert.reduce((s, d) => s + d, 0) / daysToConvert.length) * 10) / 10;
  const median = daysToConvert[Math.floor(daysToConvert.length / 2)] || 0;

  return { avgDays: avg, medianDays: median };
}

function formatStageName(name: string): string {
  const map: Record<string, string> = {
    page_view: "Page View",
    quiz_started: "Quiz Started",
    quiz_completed: "Quiz Completed",
    intake_completed: "Intake Completed",
    checkout_initiated: "Checkout Initiated",
    payment_succeeded: "Payment Succeeded",
    subscription_active: "Subscription Active",
  };
  return map[name] || name;
}

// ── Conversion by Segment ───────────────────────────────────

export async function getConversionBySegment(from: Date, to: Date) {
  // By plan
  const subscriptionsInRange = await db.subscription.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: {
      id: true,
      status: true,
      items: {
        select: {
          product: { select: { name: true, slug: true } },
        },
      },
    },
  });

  const planMap: Record<string, { plan: string; total: number; active: number }> = {};
  for (const sub of subscriptionsInRange) {
    const planName = sub.items[0]?.product?.name || "Unknown";
    if (!planMap[planName]) planMap[planName] = { plan: planName, total: 0, active: 0 };
    planMap[planName].total += 1;
    if (sub.status === "ACTIVE") planMap[planName].active += 1;
  }

  const byPlan = Object.values(planMap).map((p) => ({
    ...p,
    conversionRate: p.total > 0 ? Math.round((p.active / p.total) * 1000) / 10 : 0,
  }));

  // By source (from leads)
  const leads = await db.lead.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: { utmSource: true, convertedAt: true },
  });

  const sourceMap: Record<string, { source: string; visitors: number; conversions: number }> = {};
  for (const l of leads) {
    const source = l.utmSource || "Direct";
    if (!sourceMap[source]) sourceMap[source] = { source, visitors: 0, conversions: 0 };
    sourceMap[source].visitors += 1;
    if (l.convertedAt) sourceMap[source].conversions += 1;
  }

  const bySource = Object.values(sourceMap).map((s) => ({
    ...s,
    conversionRate: s.visitors > 0 ? Math.round((s.conversions / s.visitors) * 1000) / 10 : 0,
  }));

  // By state
  const patientsByState = await db.patientProfile.groupBy({
    by: ["state"],
    where: {
      user: { createdAt: { gte: from, lte: to } },
      state: { not: null },
    },
    _count: true,
  });

  const subsByState = await db.subscription.findMany({
    where: { createdAt: { gte: from, lte: to }, status: "ACTIVE" },
    select: {
      user: { select: { profile: { select: { state: true } } } },
    },
  });

  const stateSubMap: Record<string, number> = {};
  for (const sub of subsByState) {
    const state = sub.user?.profile?.state || "Unknown";
    stateSubMap[state] = (stateSubMap[state] || 0) + 1;
  }

  const byState = patientsByState
    .filter((p) => p.state)
    .map((p) => ({
      state: p.state!,
      patients: p._count,
      subscribers: stateSubMap[p.state!] || 0,
      conversionRate: p._count > 0
        ? Math.round(((stateSubMap[p.state!] || 0) / p._count) * 1000) / 10
        : 0,
    }))
    .sort((a, b) => b.patients - a.patients);

  return { byPlan, bySource, byState };
}

// ── Spend Efficiency ────────────────────────────────────────

export async function getSpendEfficiency() {
  const [totalCouponDiscount, totalCommissions, approvedCommissions, totalRevenue] =
    await Promise.all([
      db.order.aggregate({ _sum: { discountCents: true } }),
      db.commission.aggregate({ _sum: { amountCents: true } }),
      db.commission.aggregate({
        where: { status: { in: ["APPROVED", "PAID"] } },
        _sum: { amountCents: true },
      }),
      db.order.aggregate({ _sum: { totalCents: true } }),
    ]);

  const couponSpend = totalCouponDiscount._sum.discountCents || 0;
  const commissionSpend = approvedCommissions._sum.amountCents || 0;
  const revenue = totalRevenue._sum.totalCents || 0;
  const totalMarketingSpend = couponSpend + commissionSpend;

  // Revenue per marketing dollar
  const revenuePerDollar =
    totalMarketingSpend > 0 ? Math.round((revenue / totalMarketingSpend) * 100) / 100 : 0;

  // Channel ROI estimate from leads
  const leads = await db.lead.findMany({
    where: { convertedAt: { not: null } },
    select: { utmSource: true },
  });

  const channelConversions: Record<string, number> = {};
  for (const l of leads) {
    const source = l.utmSource || "Direct";
    channelConversions[source] = (channelConversions[source] || 0) + 1;
  }

  const channelROI = Object.entries(channelConversions)
    .map(([source, conversions]) => ({
      source,
      conversions,
    }))
    .sort((a, b) => b.conversions - a.conversions);

  return {
    couponSpend,
    commissionSpend,
    totalMarketingSpend,
    revenue,
    revenuePerDollar,
    highestROIChannel: channelROI[0]?.source || "N/A",
    lowestROIChannel: channelROI[channelROI.length - 1]?.source || "N/A",
    channelROI,
  };
}

// ── Conversion Suggestions ──────────────────────────────────

interface ConversionStage {
  name: string;
  label: string;
  count: number;
  conversionRate: number;
  dropOffRate: number;
}

interface Suggestion {
  suggestion: string;
  priority: "high" | "medium" | "low";
  metric: string;
  currentValue: number;
  targetValue: number;
}

export function getConversionSuggestions(stages: ConversionStage[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  const quizToIntake = stages.find((s) => s.name === "intake_completed");
  if (quizToIntake && quizToIntake.dropOffRate > 30) {
    suggestions.push({
      suggestion:
        "High drop-off between quiz and intake. Consider simplifying the intake form, adding a progress indicator, or sending reminder emails to quiz completers.",
      priority: "high",
      metric: "Quiz-to-Intake Drop-off",
      currentValue: quizToIntake.dropOffRate,
      targetValue: 25,
    });
  }

  const checkoutToPayment = stages.find((s) => s.name === "payment_succeeded");
  if (checkoutToPayment && checkoutToPayment.dropOffRate > 20) {
    suggestions.push({
      suggestion:
        "Checkout-to-payment drop-off is above 20%. Review pricing page layout, add trust signals (security badges, money-back guarantee), and test streamlined payment forms.",
      priority: "high",
      metric: "Checkout-to-Payment Drop-off",
      currentValue: checkoutToPayment.dropOffRate,
      targetValue: 15,
    });
  }

  const quizStart = stages.find((s) => s.name === "quiz_started");
  if (quizStart && quizStart.dropOffRate > 40) {
    suggestions.push({
      suggestion:
        "Many visitors leave before starting the quiz. Improve above-the-fold messaging, add a more compelling CTA, or test a shorter quiz entry point.",
      priority: "medium",
      metric: "Page-to-Quiz Drop-off",
      currentValue: quizStart.dropOffRate,
      targetValue: 30,
    });
  }

  const quizCompletion = stages.find((s) => s.name === "quiz_completed");
  if (quizCompletion && quizCompletion.dropOffRate > 25) {
    suggestions.push({
      suggestion:
        "Quiz completion rate needs improvement. Consider reducing the number of questions, adding a progress bar, or making questions more engaging.",
      priority: "medium",
      metric: "Quiz Completion Drop-off",
      currentValue: quizCompletion.dropOffRate,
      targetValue: 15,
    });
  }

  const paymentToSub = stages.find((s) => s.name === "subscription_active");
  if (paymentToSub && paymentToSub.dropOffRate > 10) {
    suggestions.push({
      suggestion:
        "Some payments succeed but subscriptions are not activated. Check for webhook delivery issues, Stripe configuration, or post-payment flow errors.",
      priority: "high",
      metric: "Payment-to-Subscription Drop-off",
      currentValue: paymentToSub.dropOffRate,
      targetValue: 5,
    });
  }

  // General: if overall conversion is very low
  const overallConv = stages[stages.length - 1];
  if (overallConv && overallConv.count > 0 && stages[0].count > 0) {
    const overallRate = (overallConv.count / stages[0].count) * 100;
    if (overallRate < 2) {
      suggestions.push({
        suggestion:
          "Overall visitor-to-subscriber conversion is below 2%. Focus on the highest drop-off stage first, then optimize landing page messaging and social proof.",
        priority: "low",
        metric: "Overall Conversion Rate",
        currentValue: Math.round(overallRate * 10) / 10,
        targetValue: 3,
      });
    }
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
