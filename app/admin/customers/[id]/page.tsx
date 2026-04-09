import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Pill, Scale, MessageCircle, CreditCard, Share2, TrendingDown } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

export default async function PatientDetailPage({ params }: PageProps) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    include: {
      profile: true,
      intakeSubmission: true,
      subscriptions: { include: { items: { include: { product: true } } } },
      orders: { orderBy: { createdAt: "desc" }, take: 10 },
      progressEntries: { orderBy: { date: "desc" }, take: 14 },
      messages: { orderBy: { createdAt: "desc" }, take: 10 },
      referralCode: true,
    },
  });

  if (!user) notFound();

  const treatment = await db.treatmentPlan.findFirst({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const startWeight = user.profile?.weightLbs || 0;
  const currentWeight = user.progressEntries[0]?.weightLbs || startWeight;
  const weightLost = Math.round((startWeight - currentWeight) * 10) / 10;
  const activeSub = user.subscriptions.find((s: { status: string }) => s.status === "ACTIVE");
  const totalRevenue = user.orders.reduce((s: number, o: { totalCents: number }) => s + o.totalCents, 0);

  return (
    <div className="space-y-6">
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-graphite-400 hover:text-navy">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Customers
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">{name}</h2>
          <p className="text-sm text-graphite-400">{user.email} &middot; {user.profile?.state || "—"} &middot; Joined {user.createdAt.toLocaleDateString()}</p>
        </div>
        <Badge variant={activeSub ? "success" : "secondary"}>{activeSub ? activeSub.items[0]?.product?.name || "Active" : "No Subscription"}</Badge>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><TrendingDown className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Weight Lost</p><p className="text-xl font-bold text-navy">{weightLost > 0 ? `-${weightLost} lbs` : "—"}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><CreditCard className="h-5 w-5 text-gold-600" /><div><p className="text-xs text-graphite-400">Total Revenue</p><p className="text-xl font-bold text-navy">{formatPrice(totalRevenue)}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Scale className="h-5 w-5 text-atlantic" /><div><p className="text-xs text-graphite-400">Progress Entries</p><p className="text-xl font-bold text-navy">{user.progressEntries.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><MessageCircle className="h-5 w-5 text-navy" /><div><p className="text-xs text-graphite-400">Messages</p><p className="text-xl font-bold text-navy">{user.messages.length}</p></div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile + Intake */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-teal" /> Profile & Intake</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-graphite-400">Height</p><p className="text-navy">{user.profile?.heightInches ? `${Math.floor(user.profile.heightInches / 12)}'${user.profile.heightInches % 12}"` : "—"}</p></div>
              <div><p className="text-xs text-graphite-400">Start Weight</p><p className="text-navy">{startWeight || "—"} lbs</p></div>
              <div><p className="text-xs text-graphite-400">Current Weight</p><p className="text-navy">{currentWeight || "—"} lbs</p></div>
              <div><p className="text-xs text-graphite-400">Goal Weight</p><p className="text-navy">{user.profile?.goalWeightLbs || "—"} lbs</p></div>
            </div>
            <div className="border-t border-navy-100/40 pt-3">
              <p className="text-xs font-semibold text-navy">Intake Status</p>
              <Badge variant={user.intakeSubmission?.status === "APPROVED" ? "success" : user.intakeSubmission?.status === "SUBMITTED" ? "warning" : "secondary"} className="mt-1">
                {user.intakeSubmission?.status || "Not submitted"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Plan */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Pill className="h-4 w-4 text-teal" /> Treatment Plan</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {treatment ? (
              <>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-graphite-400">Medication</p><p className="text-navy">{treatment.medicationName} {treatment.medicationDose}</p></div>
                  <div><p className="text-xs text-graphite-400">Frequency</p><p className="text-navy">{treatment.medicationFreq}</p></div>
                  <div><p className="text-xs text-graphite-400">Provider</p><p className="text-navy">{treatment.providerName}</p></div>
                  <div><p className="text-xs text-graphite-400">Status</p><Badge variant="success">{treatment.status}</Badge></div>
                </div>
                {treatment.notes && <p className="text-xs text-graphite-500 bg-navy-50/50 rounded-lg p-3">{treatment.notes}</p>}
              </>
            ) : (
              <p className="text-sm text-graphite-300 py-4 text-center">No treatment plan</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Progress */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Progress</CardTitle></CardHeader>
          <CardContent>
            {user.progressEntries.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {user.progressEntries.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg bg-navy-50/30 px-3 py-2 text-xs">
                    <span className="text-graphite-400">{e.date.toLocaleDateString()}</span>
                    <div className="flex gap-3">
                      {e.weightLbs && <span className="font-medium text-navy">{Math.round(e.weightLbs * 10) / 10} lbs</span>}
                      {e.proteinG && <span className="text-graphite-400">{e.proteinG}g protein</span>}
                      {e.moodRating && <span className="text-graphite-400">Mood {e.moodRating}/5</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-graphite-300 py-4 text-center">No progress entries</p>
            )}
          </CardContent>
        </Card>

        {/* Orders + Referrals */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4 text-gold-600" /> Orders & Referrals</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {user.orders.length > 0 ? (
              <div className="space-y-1.5">
                {user.orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between text-xs rounded-lg bg-navy-50/30 px-3 py-2">
                    <span className="text-graphite-400">{o.createdAt.toLocaleDateString()}</span>
                    <span className="font-medium text-navy">{formatPrice(o.totalCents)}</span>
                    <Badge variant={o.status === "DELIVERED" ? "success" : "secondary"} className="text-[9px]">{o.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-graphite-300">No orders</p>
            )}
            {user.referralCode && (
              <div className="border-t border-navy-100/40 pt-3 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-teal" />
                <div>
                  <p className="text-xs font-medium text-navy">Code: {user.referralCode.code}</p>
                  <p className="text-[10px] text-graphite-400">{user.referralCode.totalReferred} referrals · {formatPrice(user.referralCode.totalEarned)} earned</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
