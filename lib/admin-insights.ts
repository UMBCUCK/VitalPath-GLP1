import { db } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────────────

interface InsightInput {
  type: "ANOMALY" | "TREND" | "OPPORTUNITY" | "WARNING";
  metric: string;
  title: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  currentValue: number;
  expectedValue: number;
  deviation: number;
}

// ─── Helpers ───────────────────────────────────────────────────

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfDay(d: Date): Date {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

function severityFromDeviation(dev: number): "LOW" | "MEDIUM" | "HIGH" {
  const abs = Math.abs(dev);
  if (abs >= 3) return "HIGH";
  if (abs >= 2) return "MEDIUM";
  return "LOW";
}

async function hasCooldown(type: string, metric: string): Promise<boolean> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await db.insightRecord.findFirst({
    where: {
      type,
      metric,
      createdAt: { gte: oneDayAgo },
    },
  });
  return !!existing;
}

async function createInsightIfNew(input: InsightInput) {
  const cooldown = await hasCooldown(input.type, input.metric);
  if (cooldown) return null;

  return db.insightRecord.create({
    data: {
      type: input.type,
      metric: input.metric,
      title: input.title,
      description: input.description,
      severity: input.severity,
      currentValue: input.currentValue,
      expectedValue: input.expectedValue,
      deviation: input.deviation,
    },
  });
}

// ─── Daily metric collection helpers ───────────────────────────

async function getDailyMRR(date: Date): Promise<number> {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  // Sum of all active subscription items for subscriptions active on this date
  const subs = await db.subscription.findMany({
    where: {
      status: "ACTIVE",
      createdAt: { lte: nextDay },
    },
    include: { items: true },
  });

  return subs.reduce(
    (total, sub) =>
      total + sub.items.reduce((s, item) => s + item.priceInCents * item.quantity, 0),
    0
  );
}

async function getDailySignups(date: Date): Promise<number> {
  const start = startOfDay(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return db.user.count({
    where: {
      role: "PATIENT",
      createdAt: { gte: start, lt: end },
    },
  });
}

async function getDailyCancellations(date: Date): Promise<number> {
  const start = startOfDay(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return db.subscription.count({
    where: {
      status: "CANCELED",
      canceledAt: { gte: start, lt: end },
    },
  });
}

async function getDailyProgressEntries(date: Date): Promise<number> {
  const start = startOfDay(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return db.progressEntry.count({
    where: { date: { gte: start, lt: end } },
  });
}

async function getDailyPaymentFailures(date: Date): Promise<number> {
  const start = startOfDay(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return db.subscription.count({
    where: {
      status: "PAST_DUE",
      updatedAt: { gte: start, lt: end },
    },
  });
}

async function getDailyAverageOrderValue(date: Date): Promise<number> {
  const start = startOfDay(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const result = await db.order.aggregate({
    where: { createdAt: { gte: start, lt: end } },
    _avg: { totalCents: true },
    _count: true,
  });

  return result._count > 0 ? (result._avg.totalCents ?? 0) : 0;
}

// ─── Collect N days of a metric ────────────────────────────────

async function collectDailyMetric(
  fetcher: (date: Date) => Promise<number>,
  days: number
): Promise<number[]> {
  const values: number[] = [];
  for (let i = days; i >= 1; i--) {
    const date = daysAgo(i);
    const val = await fetcher(date);
    values.push(val);
  }
  return values;
}

// ─── Anomaly Detection ─────────────────────────────────────────

export async function detectAnomalies() {
  const created: Array<Record<string, unknown>> = [];

  const checks: Array<{
    metric: string;
    label: string;
    fetcher: (date: Date) => Promise<number>;
    format: (v: number) => string;
    inverseAlert?: boolean; // if true, a big drop is alarming
  }> = [
    {
      metric: "mrr",
      label: "MRR",
      fetcher: getDailyMRR,
      format: (v) => `$${(v / 100).toLocaleString()}`,
    },
    {
      metric: "daily_signups",
      label: "Daily Signups",
      fetcher: getDailySignups,
      format: (v) => String(Math.round(v)),
    },
    {
      metric: "churn_rate",
      label: "Churn (Cancellations)",
      fetcher: getDailyCancellations,
      format: (v) => String(Math.round(v)),
      inverseAlert: true,
    },
    {
      metric: "engagement",
      label: "Progress Entries",
      fetcher: getDailyProgressEntries,
      format: (v) => String(Math.round(v)),
    },
    {
      metric: "payment_failures",
      label: "Payment Failures",
      fetcher: getDailyPaymentFailures,
      format: (v) => String(Math.round(v)),
      inverseAlert: true,
    },
    {
      metric: "revenue_per_order",
      label: "Avg Order Value",
      fetcher: getDailyAverageOrderValue,
      format: (v) => `$${(v / 100).toFixed(0)}`,
    },
  ];

  for (const check of checks) {
    try {
      // Collect 30 days for baseline
      const baseline = await collectDailyMetric(check.fetcher, 30);
      const recent = baseline.slice(-7); // last 7 days
      const today = await check.fetcher(new Date());

      const avg = mean(baseline);
      const sd = stddev(baseline);

      if (sd === 0) continue; // No variance, skip

      const deviation = (today - avg) / sd;

      if (Math.abs(deviation) >= 1.5) {
        const isSpike = deviation > 0;
        const isAlarming = check.inverseAlert ? isSpike : !isSpike;

        const insight = await createInsightIfNew({
          type: "ANOMALY",
          metric: check.metric,
          title: `${check.label} ${isSpike ? "spike" : "drop"} detected`,
          description: `Today's ${check.label.toLowerCase()} (${check.format(today)}) is ${Math.abs(deviation).toFixed(1)} standard deviations ${isSpike ? "above" : "below"} the 30-day average (${check.format(avg)}). ${isAlarming ? "This may require attention." : "This is a positive signal."}`,
          severity: severityFromDeviation(deviation),
          currentValue: today,
          expectedValue: avg,
          deviation: Math.round(deviation * 100) / 100,
        });
        if (insight) created.push(insight as unknown as Record<string, unknown>);
      }
    } catch {
      // Skip metric on error
    }
  }

  return created;
}

// ─── Trend Detection ───────────────────────────────────────────

export async function detectTrends() {
  const created: Array<Record<string, unknown>> = [];

  try {
    // MRR trend: 3+ consecutive days of growth
    const mrrValues = await collectDailyMetric(getDailyMRR, 7);
    let mrrGrowthStreak = 0;
    for (let i = 1; i < mrrValues.length; i++) {
      if (mrrValues[i] > mrrValues[i - 1]) {
        mrrGrowthStreak++;
      } else {
        mrrGrowthStreak = 0;
      }
    }
    if (mrrGrowthStreak >= 3) {
      const first = mrrValues[mrrValues.length - 1 - mrrGrowthStreak];
      const last = mrrValues[mrrValues.length - 1];
      const pctChange = first > 0 ? ((last - first) / first) * 100 : 0;

      const insight = await createInsightIfNew({
        type: "TREND",
        metric: "mrr",
        title: "MRR growing consistently",
        description: `MRR has increased for ${mrrGrowthStreak} consecutive days, growing ${pctChange.toFixed(1)}% over this period. Current MRR: $${(last / 100).toLocaleString()}.`,
        severity: "LOW",
        currentValue: last,
        expectedValue: first,
        deviation: mrrGrowthStreak,
      });
      if (insight) created.push(insight as unknown as Record<string, unknown>);
    }
  } catch {
    // Skip on error
  }

  try {
    // Churn trend: 3+ consecutive days of increasing cancellations
    const churnValues = await collectDailyMetric(getDailyCancellations, 7);
    let churnStreak = 0;
    for (let i = 1; i < churnValues.length; i++) {
      if (churnValues[i] > churnValues[i - 1]) {
        churnStreak++;
      } else {
        churnStreak = 0;
      }
    }
    if (churnStreak >= 3) {
      const insight = await createInsightIfNew({
        type: "WARNING",
        metric: "churn_rate",
        title: "Churn rate trending upward",
        description: `Cancellations have increased for ${churnStreak} consecutive days. Today: ${churnValues[churnValues.length - 1]} cancellations vs ${churnValues[churnValues.length - 1 - churnStreak]} at the start of the trend.`,
        severity: "HIGH",
        currentValue: churnValues[churnValues.length - 1],
        expectedValue: churnValues[churnValues.length - 1 - churnStreak],
        deviation: churnStreak,
      });
      if (insight) created.push(insight as unknown as Record<string, unknown>);
    }
  } catch {
    // Skip on error
  }

  try {
    // Engagement trend: progress entries improving
    const engValues = await collectDailyMetric(getDailyProgressEntries, 7);
    let engStreak = 0;
    for (let i = 1; i < engValues.length; i++) {
      if (engValues[i] > engValues[i - 1]) {
        engStreak++;
      } else {
        engStreak = 0;
      }
    }
    if (engStreak >= 3) {
      const insight = await createInsightIfNew({
        type: "OPPORTUNITY",
        metric: "engagement",
        title: "Patient engagement improving",
        description: `Progress entry activity has increased for ${engStreak} consecutive days. This trend suggests growing patient engagement with the platform.`,
        severity: "LOW",
        currentValue: engValues[engValues.length - 1],
        expectedValue: mean(engValues),
        deviation: engStreak,
      });
      if (insight) created.push(insight as unknown as Record<string, unknown>);
    }
  } catch {
    // Skip on error
  }

  return created;
}

// ─── Get & manage insights ─────────────────────────────────────

export async function getInsights(
  page = 1,
  limit = 20,
  type?: string
) {
  const where: Record<string, unknown> = { isDismissed: false };
  if (type && type !== "ALL") {
    where.type = type;
  }

  const [insights, total] = await Promise.all([
    db.insightRecord.findMany({
      where,
      orderBy: [
        { severity: "desc" },
        { createdAt: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.insightRecord.count({ where }),
  ]);

  // Sort severity properly (HIGH > MEDIUM > LOW) since string sort is alphabetical
  const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  insights.sort((a, b) => {
    const sa = severityOrder[a.severity as keyof typeof severityOrder] ?? 3;
    const sb = severityOrder[b.severity as keyof typeof severityOrder] ?? 3;
    if (sa !== sb) return sa - sb;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return { insights, total, page, limit };
}

export async function getRecentInsights(limit = 3) {
  const insights = await db.insightRecord.findMany({
    where: { isDismissed: false },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  // Sort severity properly
  const severityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  insights.sort((a, b) => {
    const sa = severityOrder[a.severity as keyof typeof severityOrder] ?? 3;
    const sb = severityOrder[b.severity as keyof typeof severityOrder] ?? 3;
    if (sa !== sb) return sa - sb;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return insights;
}

export async function dismissInsight(id: string) {
  return db.insightRecord.update({
    where: { id },
    data: { isDismissed: true },
  });
}
