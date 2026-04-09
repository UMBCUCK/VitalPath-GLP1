import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { RevenueClient } from "./revenue-client";

export default async function RevenuePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000);

  // Revenue by plan
  const subscriptions = await db.subscription.findMany({
    where: { status: { in: ["ACTIVE", "CANCELED"] } },
    include: {
      items: { include: { product: { select: { name: true, slug: true, priceMonthly: true } } } },
      user: { select: { createdAt: true } },
    },
  });

  const planRevenue: Record<string, { name: string; mrr: number; subscribers: number }> = {};
  for (const sub of subscriptions) {
    if (sub.status !== "ACTIVE") continue;
    for (const item of sub.items) {
      const slug = item.product?.slug || "unknown";
      if (!planRevenue[slug]) planRevenue[slug] = { name: item.product?.name || slug, mrr: 0, subscribers: 0 };
      planRevenue[slug].mrr += item.priceInCents;
      planRevenue[slug].subscribers++;
    }
  }

  const planData = Object.values(planRevenue).sort((a, b) => b.mrr - a.mrr);

  // LTV calculation: average revenue per user over their lifetime
  const orders = await db.order.findMany({ select: { userId: true, totalCents: true } });
  const userRevenue: Record<string, number> = {};
  for (const order of orders) { userRevenue[order.userId] = (userRevenue[order.userId] || 0) + order.totalCents; }
  const userRevValues = Object.values(userRevenue);
  const avgLTV = userRevValues.length > 0 ? Math.round(userRevValues.reduce((a, b) => a + b, 0) / userRevValues.length) : 0;

  // ARPU: total revenue / total active subscribers
  const totalMRR = planData.reduce((s, p) => s + p.mrr, 0);
  const totalActive = planData.reduce((s, p) => s + p.subscribers, 0);
  const arpu = totalActive > 0 ? Math.round(totalMRR / totalActive) : 0;

  // Coupon usage
  const coupons = await db.coupon.findMany({
    where: { usedCount: { gt: 0 } },
    select: { code: true, type: true, valuePct: true, valueCents: true, usedCount: true },
  });

  // Referral revenue
  const referralCodes = await db.referralCode.findMany({
    where: { totalReferred: { gt: 0 } },
    select: { totalReferred: true, totalEarned: true },
  });
  const totalReferralRevenue = referralCodes.reduce((s, r) => s + r.totalEarned, 0);
  const totalReferrals = referralCodes.reduce((s, r) => s + r.totalReferred, 0);

  // Upgrade/downgrade tracking (placeholder data)
  const upgrades = await db.subscription.count({ where: { status: "ACTIVE" } });

  return (
    <RevenueClient
      planData={planData}
      metrics={{
        totalMRR,
        arpu,
        avgLTV,
        totalActive,
        totalReferralRevenue,
        totalReferrals,
        couponUsage: coupons.reduce((s, c) => s + c.usedCount, 0),
      }}
      coupons={coupons}
    />
  );
}
