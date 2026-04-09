import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Users, DollarSign, TrendingUp, Award } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminReferralsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [totalReferrals, convertedReferrals, totalPayout, topReferrers, recentReferrals] =
    await Promise.all([
      db.referral.count(),
      db.referral.count({ where: { status: "CONVERTED" } }),
      db.referralCode.aggregate({ _sum: { totalEarned: true } }),
      db.referralCode.findMany({
        where: { totalReferred: { gt: 0 } },
        orderBy: { totalReferred: "desc" },
        take: 10,
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
      db.referral.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          referrer: { select: { firstName: true, lastName: true, email: true } },
          referralCode: { select: { code: true } },
        },
      }),
    ]);

  const conversionRate = totalReferrals > 0 ? ((convertedReferrals / totalReferrals) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Referral Program</h2>
        <p className="text-sm text-graphite-400">Track referrals, conversions, and payouts</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><Share2 className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Total Referrals</p><p className="text-xl font-bold text-navy">{totalReferrals}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-5 w-5 text-emerald-500" /><div><p className="text-xs text-graphite-400">Converted</p><p className="text-xl font-bold text-navy">{convertedReferrals}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><TrendingUp className="h-5 w-5 text-gold-600" /><div><p className="text-xs text-graphite-400">Conversion Rate</p><p className="text-xl font-bold text-navy">{conversionRate}%</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><DollarSign className="h-5 w-5 text-navy" /><div><p className="text-xs text-graphite-400">Total Payouts</p><p className="text-xl font-bold text-navy">{formatPrice(totalPayout._sum.totalEarned || 0)}</p></div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-gold-600" /> Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topReferrers.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No referrals yet</p>
            ) : (
              <div className="space-y-2">
                {topReferrers.map((ref, i) => (
                  <div key={ref.id} className="flex items-center justify-between rounded-xl bg-navy-50/30 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0 ? "bg-gold-100 text-gold-700" : i === 1 ? "bg-navy-200 text-navy" : i === 2 ? "bg-gold-50 text-gold-600" : "bg-navy-100 text-graphite-500"
                      }`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-navy">
                          {[ref.user.firstName, ref.user.lastName].filter(Boolean).join(" ") || ref.user.email}
                        </p>
                        <p className="text-[10px] text-graphite-400">{ref.code} &middot; {ref.tier}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-navy">{ref.totalReferred} referrals</p>
                      <p className="text-[10px] text-graphite-400">{formatPrice(ref.totalEarned)} earned</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent referrals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            {recentReferrals.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No referrals yet</p>
            ) : (
              <div className="space-y-2">
                {recentReferrals.map((ref) => (
                  <div key={ref.id} className="flex items-center justify-between rounded-xl border border-navy-100/30 px-4 py-3">
                    <div>
                      <p className="text-sm text-navy">{ref.referredEmail || "Pending"}</p>
                      <p className="text-[10px] text-graphite-400">
                        via {[ref.referrer.firstName, ref.referrer.lastName].filter(Boolean).join(" ") || ref.referrer.email} ({ref.referralCode.code})
                      </p>
                    </div>
                    <Badge variant={ref.status === "CONVERTED" || ref.status === "PAID" ? "success" : ref.status === "PENDING" ? "warning" : "secondary"}>
                      {ref.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
