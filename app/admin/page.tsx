import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/admin-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, ShoppingCart, ArrowUpRight, RefreshCw, AlertTriangle, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const data = await getAdminDashboardData();

  const stats = [
    { title: "Monthly Revenue", value: formatPrice(data.stats.revenue), icon: DollarSign },
    { title: "Active Members", value: String(data.stats.activeMembers), icon: Users },
    { title: "Total Patients", value: String(data.stats.totalPatients), icon: ShoppingCart },
    { title: "Churn Rate", value: `${data.stats.churnRate}%`, icon: RefreshCw },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Dashboard</h2>
        <p className="text-sm text-graphite-400">Real-time platform overview</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-graphite-400">{stat.title}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
                  <stat.icon className="h-4 w-4 text-teal" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-navy">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent subscriptions */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Recent Subscriptions</CardTitle></CardHeader>
          <CardContent>
            {data.recentSubscriptions.length === 0 ? (
              <p className="py-8 text-center text-sm text-graphite-300">No subscriptions yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-100/40 text-left">
                      <th className="pb-3 font-medium text-graphite-400">Customer</th>
                      <th className="pb-3 font-medium text-graphite-400">Plan</th>
                      <th className="pb-3 font-medium text-graphite-400">Amount</th>
                      <th className="pb-3 font-medium text-graphite-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-100/30">
                    {data.recentSubscriptions.map((sub) => (
                      <tr key={sub.id}>
                        <td className="py-3">
                          <p className="font-medium text-navy">{sub.customerName}</p>
                          <p className="text-xs text-graphite-400">{sub.email}</p>
                        </td>
                        <td className="py-3 text-graphite-500">{sub.planName}</td>
                        <td className="py-3 font-medium text-navy">{formatPrice(sub.amount)}/mo</td>
                        <td className="py-3">
                          <Badge variant={sub.status === "ACTIVE" ? "success" : sub.status === "PAST_DUE" ? "destructive" : "warning"}>
                            {sub.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending actions */}
        <Card>
          <CardHeader><CardTitle className="text-base">Pending Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-amber-50/50 px-4 py-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-navy">Intake Reviews</p>
                  <p className="text-xs text-graphite-400">{data.stats.pendingIntakes} pending</p>
                </div>
              </div>
              <Badge variant={data.stats.pendingIntakes > 0 ? "warning" : "success"}>
                {data.stats.pendingIntakes > 0 ? "action needed" : "clear"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-navy-50/50 px-4 py-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-navy-400" />
                <div>
                  <p className="text-sm font-medium text-navy">Claim Reviews</p>
                  <p className="text-xs text-graphite-400">{data.claimStats.pending} pending</p>
                </div>
              </div>
              <Badge variant="secondary">{data.claimStats.approved} approved</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-navy-50/50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-navy">Active Products</p>
                <p className="text-xs text-graphite-400">{data.stats.productCount} in catalog</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
