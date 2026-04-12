export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminDashboardDataV2 } from "@/lib/admin-data";
import { getRecentInsights } from "@/lib/admin-insights";
import { getWidgetLayout } from "@/lib/admin-widgets";
import { db } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [data, recentInsights, widgetLayout, referralStats] = await Promise.all([
    getAdminDashboardDataV2(),
    getRecentInsights(3),
    getWidgetLayout(session.userId),
    db.referralCode.aggregate({ _sum: { totalReferred: true, totalEarned: true }, where: { isActive: true } })
      .then(async (agg) => {
        const pendingPayout = await db.referral.aggregate({ where: { status: "CONVERTED" }, _sum: { payoutCents: true } });
        const activeReferrers = await db.referralCode.count({ where: { isActive: true, totalReferred: { gt: 0 } } });
        return {
          totalReferred: agg._sum.totalReferred || 0,
          totalEarned: agg._sum.totalEarned || 0,
          pendingPayout: pendingPayout._sum.payoutCents || 0,
          activeReferrers,
        };
      }),
  ]);

  return (
    <DashboardClient
      data={data}
      recentInsights={recentInsights}
      widgetLayout={widgetLayout}
      referralStats={referralStats}
    />
  );
}
