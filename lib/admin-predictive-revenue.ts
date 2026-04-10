import { db } from "@/lib/db";
import { getRevenueForecast, type ForecastResult } from "@/lib/admin-forecasting";

// ─── Types ──────────────────────────────────────────────────

export interface MonthlyProjection {
  month: string;       // "Month 1", "Month 2", ...
  bottomUpMRR: number; // cents
  customerCount: number;
  avgSurvival: number; // 0-1
}

export interface CustomerLTV {
  userId: string;
  name: string;
  email: string;
  plan: string;
  churnRisk: number;         // 0-100
  monthlyMRR: number;        // cents
  projectedLTV: number;      // cents (12-month)
  survivalProbability: number; // 0-1 at month 12
}

export interface BottomUpForecast {
  monthlyProjections: MonthlyProjection[];
  customerBreakdown: CustomerLTV[];
}

export interface TopDownVsBottomUp {
  topDown: ForecastResult;
  bottomUp: BottomUpForecast;
}

// ─── Bottom-Up Forecast ─────────────────────────────────────

/**
 * Per-customer revenue prediction using individual churn risk scores.
 * For each active subscription user:
 *   - Fetch churnRisk from PatientProfile (0-100)
 *   - Get current MRR from subscription items
 *   - Compute monthly survival: ((100 - churnRisk) / 100) ^ month
 *   - Project revenue for 12 months: MRR * survival^month
 *   - Sum across all customers for bottom-up monthly projection
 */
export async function getBottomUpForecast(): Promise<BottomUpForecast> {
  // Fetch all active subscriptions with user profiles
  const activeSubscriptions = await db.subscription.findMany({
    where: {
      status: { in: ["ACTIVE", "TRIALING"] },
    },
    select: {
      userId: true,
      createdAt: true,
      items: {
        select: {
          priceInCents: true,
          product: { select: { name: true } },
        },
      },
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profile: {
            select: {
              churnRisk: true,
              healthScore: true,
              lifecycleStage: true,
            },
          },
        },
      },
    },
  });

  // Build per-customer data
  const customers: {
    userId: string;
    name: string;
    email: string;
    plan: string;
    churnRisk: number;
    monthlyMRR: number;
    monthsActive: number;
  }[] = [];

  const now = new Date();

  for (const sub of activeSubscriptions) {
    const mrr = sub.items.reduce((sum, item) => sum + item.priceInCents, 0);
    if (mrr <= 0) continue;

    const churnRisk = sub.user.profile?.churnRisk ?? 30; // Default 30% if no score
    const planName = sub.items[0]?.product?.name ?? "Unknown Plan";
    const monthsActive = Math.max(
      1,
      Math.floor(
        (now.getTime() - new Date(sub.createdAt).getTime()) / (30 * 24 * 60 * 60 * 1000)
      )
    );

    const firstName = sub.user.firstName ?? "";
    const lastName = sub.user.lastName ?? "";
    const name = `${firstName} ${lastName}`.trim() || sub.user.email;

    customers.push({
      userId: sub.user.id,
      name,
      email: sub.user.email,
      plan: planName,
      churnRisk,
      monthlyMRR: mrr,
      monthsActive,
    });
  }

  // Project 12 months for each customer
  const monthlyProjections: MonthlyProjection[] = [];

  for (let month = 1; month <= 12; month++) {
    let totalMRR = 0;
    let survivingCustomers = 0;
    let totalSurvival = 0;

    for (const customer of customers) {
      const survivalRate = (100 - customer.churnRisk) / 100;
      const survivalAtMonth = Math.pow(survivalRate, month);
      const projectedMRR = Math.round(customer.monthlyMRR * survivalAtMonth);

      totalMRR += projectedMRR;
      totalSurvival += survivalAtMonth;

      if (survivalAtMonth > 0.1) {
        survivingCustomers++;
      }
    }

    monthlyProjections.push({
      month: `Month ${month}`,
      bottomUpMRR: totalMRR,
      customerCount: survivingCustomers,
      avgSurvival:
        customers.length > 0
          ? Math.round((totalSurvival / customers.length) * 1000) / 1000
          : 0,
    });
  }

  // Build customer breakdown with projected 12-month LTV, take top 10
  const customerBreakdown: CustomerLTV[] = customers
    .map((customer) => {
      const survivalRate = (100 - customer.churnRisk) / 100;
      let projectedLTV = 0;
      for (let m = 1; m <= 12; m++) {
        projectedLTV += customer.monthlyMRR * Math.pow(survivalRate, m);
      }
      const survival12 = Math.pow(survivalRate, 12);

      return {
        userId: customer.userId,
        name: customer.name,
        email: customer.email,
        plan: customer.plan,
        churnRisk: customer.churnRisk,
        monthlyMRR: customer.monthlyMRR,
        projectedLTV: Math.round(projectedLTV),
        survivalProbability: Math.round(survival12 * 1000) / 1000,
      };
    })
    .sort((a, b) => b.projectedLTV - a.projectedLTV)
    .slice(0, 10);

  return { monthlyProjections, customerBreakdown };
}

// ─── Combined Top-Down vs Bottom-Up ─────────────────────────

/**
 * Returns both the existing top-down forecast (from admin-forecasting.ts)
 * and the new bottom-up forecast for comparison.
 */
export async function getTopDownVsBottomUp(): Promise<TopDownVsBottomUp> {
  const [topDown, bottomUp] = await Promise.all([
    getRevenueForecast(),
    getBottomUpForecast(),
  ]);

  return { topDown, bottomUp };
}
