import { db } from "@/lib/db";

interface MonthlyMRR {
  month: string; // YYYY-MM
  mrr: number;   // cents
}

interface ProjectionPoint {
  month: string;
  mrr: number;
  arr: number;
}

export interface ForecastResult {
  historical: MonthlyMRR[];
  projections: {
    optimistic: ProjectionPoint[];
    expected: ProjectionPoint[];
    pessimistic: ProjectionPoint[];
  };
  assumptions: {
    currentMRR: number;
    avgChurnRate: number;
    avgGrowthRate: number;
  };
}

/**
 * Build a 12-month revenue forecast based on the last 6 months of MRR data.
 * Projects 3 scenarios: optimistic, expected, pessimistic.
 */
export async function getRevenueForecast(): Promise<ForecastResult> {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  // ── Gather historical monthly MRR ─────────────────────────
  // Get all subscriptions that were active at any point in the last 6 months
  const subscriptions = await db.subscription.findMany({
    where: {
      OR: [
        { status: { in: ["ACTIVE", "TRIALING"] } },
        {
          status: "CANCELED",
          canceledAt: { gte: sixMonthsAgo },
        },
      ],
    },
    select: {
      status: true,
      createdAt: true,
      canceledAt: true,
      items: { select: { priceInCents: true } },
    },
  });

  const historical: MonthlyMRR[] = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

    let mrr = 0;
    for (const sub of subscriptions) {
      // Was this subscription active at month-end?
      const createdBefore = sub.createdAt <= monthEnd;
      const notCanceledYet =
        !sub.canceledAt || new Date(sub.canceledAt) > monthEnd;

      if (createdBefore && notCanceledYet) {
        mrr += sub.items.reduce((sum, item) => sum + item.priceInCents, 0);
      }
    }

    historical.push({ month: monthKey, mrr });
  }

  // ── Calculate growth and churn rates ──────────────────────
  const monthlyChanges: { growth: number; churn: number }[] = [];
  for (let i = 1; i < historical.length; i++) {
    const prev = historical[i - 1].mrr;
    const curr = historical[i].mrr;
    if (prev > 0) {
      const change = (curr - prev) / prev;
      if (change >= 0) {
        monthlyChanges.push({ growth: change, churn: 0 });
      } else {
        monthlyChanges.push({ growth: 0, churn: Math.abs(change) });
      }
    }
  }

  const avgGrowthRate =
    monthlyChanges.length > 0
      ? monthlyChanges.reduce((s, c) => s + c.growth, 0) / monthlyChanges.length
      : 0.03; // default 3% if no data

  const avgChurnRate =
    monthlyChanges.length > 0
      ? monthlyChanges.reduce((s, c) => s + c.churn, 0) / monthlyChanges.length
      : 0.05; // default 5% if no data

  const currentMRR = historical.length > 0 ? historical[historical.length - 1].mrr : 0;

  // ── Project 12 months forward ──────────────────────────────
  const scenarios = {
    optimistic: { growth: avgGrowthRate * 1.5, churn: avgChurnRate * 0.5 },
    expected: { growth: avgGrowthRate, churn: avgChurnRate },
    pessimistic: { growth: avgGrowthRate * 0.5, churn: avgChurnRate * 1.5 },
  };

  function project(growth: number, churn: number): ProjectionPoint[] {
    const points: ProjectionPoint[] = [];
    let mrr = currentMRR;

    for (let i = 1; i <= 12; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;

      mrr = Math.round(mrr * (1 + growth - churn));
      mrr = Math.max(0, mrr); // can't go below 0
      points.push({ month: monthKey, mrr, arr: mrr * 12 });
    }

    return points;
  }

  return {
    historical,
    projections: {
      optimistic: project(scenarios.optimistic.growth, scenarios.optimistic.churn),
      expected: project(scenarios.expected.growth, scenarios.expected.churn),
      pessimistic: project(scenarios.pessimistic.growth, scenarios.pessimistic.churn),
    },
    assumptions: {
      currentMRR,
      avgChurnRate: Math.round(avgChurnRate * 1000) / 10, // as percentage with 1 decimal
      avgGrowthRate: Math.round(avgGrowthRate * 1000) / 10,
    },
  };
}
