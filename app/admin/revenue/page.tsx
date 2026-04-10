import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  getMRRWaterfall,
  getRevenueBySegment,
  getRevenueTimeSeries,
  getCohortLTV,
  getRefundMetrics,
} from "@/lib/admin-financial";
import { getRevenueForecast } from "@/lib/admin-forecasting";
import { db } from "@/lib/db";
import { RevenueClient } from "./revenue-client";

export default async function RevenuePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const to = params.to ? new Date(params.to) : new Date();
  const from = params.from ? new Date(params.from) : new Date(to.getTime() - 90 * 86400000);

  const [waterfall, segments, timeSeries, cohortLTV, refunds, coupons, referralCodes, forecast] =
    await Promise.all([
      getMRRWaterfall(from, to),
      getRevenueBySegment(from, to),
      getRevenueTimeSeries(from, to),
      getCohortLTV(),
      getRefundMetrics(from, to),
      db.coupon.findMany({
        where: { usedCount: { gt: 0 } },
        select: { code: true, type: true, valuePct: true, valueCents: true, usedCount: true },
      }),
      db.referralCode.findMany({
        where: { totalReferred: { gt: 0 } },
        select: { totalReferred: true, totalEarned: true },
      }),
      getRevenueForecast(),
    ]);

  const totalReferralRevenue = referralCodes.reduce((s, r) => s + r.totalEarned, 0);
  const totalReferrals = referralCodes.reduce((s, r) => s + r.totalReferred, 0);

  // Projected ARR
  const projectedARR = waterfall.currentMRR * 12;

  return (
    <RevenueClient
      dateRange={{ from: from.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10) }}
      waterfall={waterfall}
      segments={segments}
      timeSeries={timeSeries}
      cohortLTV={cohortLTV}
      refunds={refunds}
      projectedARR={projectedARR}
      coupons={coupons}
      referralMetrics={{ totalReferralRevenue, totalReferrals }}
      forecast={forecast}
    />
  );
}
