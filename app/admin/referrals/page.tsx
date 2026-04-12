export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReferralsClient } from "./referrals-client";

export default async function AdminReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; status?: string; q?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(params.limit || "25", 10)));
  const status = params.status || "";
  const search = params.q || "";

  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") where.status = status;
  if (search) {
    where.OR = [
      { referredEmail: { contains: search } },
      { referrer: { email: { contains: search } } },
      { referrer: { firstName: { contains: search } } },
      { referralCode: { code: { contains: search } } },
    ];
  }

  const [referrals, total, totalReferrals, convertedCount, totalEarnedAgg, pendingPayoutAgg, topReferrers, paidCount, pendingCount] =
    await Promise.all([
      db.referral.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          referrer: { select: { id: true, firstName: true, lastName: true, email: true } },
          referralCode: { select: { code: true, tier: true } },
        },
      }),
      db.referral.count({ where }),
      db.referral.count(),
      db.referral.count({ where: { status: { in: ["CONVERTED", "PAID"] } } }),
      db.referralCode.aggregate({ _sum: { totalEarned: true } }),
      db.referral.aggregate({ where: { status: "CONVERTED" }, _sum: { payoutCents: true } }),
      db.referralCode.findMany({
        orderBy: { totalReferred: "desc" },
        take: 5,
        select: {
          id: true,
          code: true,
          tier: true,
          totalReferred: true,
          totalEarned: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      db.referral.count({ where: { status: "PAID" } }),
      db.referral.count({ where: { status: "PENDING" } }),
    ]);

  const conversionRate =
    totalReferrals > 0 ? ((convertedCount / totalReferrals) * 100).toFixed(1) : "0";

  return (
    <ReferralsClient
      referrals={referrals.map((r) => ({
        id: r.id,
        referrerId: r.referrerId,
        referrerName:
          [r.referrer.firstName, r.referrer.lastName].filter(Boolean).join(" ") ||
          r.referrer.email,
        referrerEmail: r.referrer.email,
        referralCode: r.referralCode.code,
        tier: r.referralCode.tier,
        referredEmail: r.referredEmail,
        status: r.status,
        payoutCents: r.payoutCents,
        paidAt: r.paidAt,
        createdAt: r.createdAt,
      }))}
      total={total}
      page={page}
      limit={limit}
      currentStatus={status}
      currentSearch={search}
      totalReferrals={totalReferrals}
      convertedCount={convertedCount}
      conversionRate={conversionRate}
      totalEarned={totalEarnedAgg._sum.totalEarned || 0}
      pendingPayoutCents={pendingPayoutAgg._sum.payoutCents || 0}
      topReferrers={topReferrers.map((rc) => ({
        id: rc.id,
        name:
          [rc.user?.firstName, rc.user?.lastName].filter(Boolean).join(" ") ||
          rc.user?.email ||
          "Unknown",
        email: rc.user?.email || "",
        code: rc.code,
        tier: rc.tier,
        totalReferred: rc.totalReferred,
        totalEarned: rc.totalEarned,
      }))}
      paidCount={paidCount}
      pendingCount={pendingCount}
    />
  );
}
