export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingDown, Clock, Pill } from "lucide-react";

export default async function ProviderPatientsPage() {
  const session = await getSession();
  if (!session || (session.role !== "PROVIDER" && session.role !== "ADMIN")) redirect("/login");

  const provider = await db.user.findUnique({ where: { id: session.userId }, select: { firstName: true, lastName: true } });
  const providerName = [provider?.firstName, provider?.lastName].filter(Boolean).join(" ");

  // Find patients with treatment plans assigned to this provider
  const treatments = await db.treatmentPlan.findMany({
    where: { providerName: { contains: providerName || "NONE" } },
    select: { userId: true, status: true, medicationName: true, medicationDose: true, nextRefillDate: true, nextCheckInDate: true },
  });

  const patientIds = treatments.map((t) => t.userId);

  const patients = await db.user.findMany({
    where: { id: { in: patientIds.length > 0 ? patientIds : ["none"] } },
    select: {
      id: true, firstName: true, lastName: true, email: true, createdAt: true,
      profile: { select: { weightLbs: true, goalWeightLbs: true, state: true } },
      subscriptions: { where: { status: "ACTIVE" }, take: 1, include: { items: { include: { product: { select: { name: true } } } } } },
      progressEntries: { orderBy: { date: "desc" }, take: 1, select: { date: true, weightLbs: true, moodRating: true } },
    },
  });

  const treatmentMap = new Map<string, typeof treatments[number]>(treatments.map((t) => [t.userId, t]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">My Patients</h2>
        <p className="text-sm text-graphite-400">{patients.length} patients assigned to you</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-4"><Users className="h-5 w-5 text-atlantic" /><div><p className="text-xs text-graphite-400">Total Patients</p><p className="text-xl font-bold text-navy">{patients.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Pill className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Active Treatments</p><p className="text-xl font-bold text-navy">{treatments.filter((t) => t.status === "ACTIVE").length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Clock className="h-5 w-5 text-gold-600" /><div><p className="text-xs text-graphite-400">Check-Ins Due</p><p className="text-xl font-bold text-navy">{treatments.filter((t) => t.nextCheckInDate && t.nextCheckInDate <= new Date(Date.now() + 3 * 86400000)).length}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100/40 bg-navy-50/30">
                <th className="px-6 py-3 text-left font-medium text-graphite-400">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Medication</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Weight</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Last Check-In</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100/30">
              {patients.map((p) => {
                const treatment = treatmentMap.get(p.id);
                const lastEntry = p.progressEntries[0];
                const plan = p.subscriptions[0]?.items[0]?.product?.name || "No plan";
                const startW = p.profile?.weightLbs || 0;
                const currentW = lastEntry?.weightLbs || startW;
                const lost = Math.round((startW - currentW) * 10) / 10;

                return (
                  <tr key={p.id} className="hover:bg-navy-50/20 transition-colors">
                    <td className="px-6 py-3">
                      <p className="font-medium text-navy">{[p.firstName, p.lastName].filter(Boolean).join(" ") || p.email}</p>
                      <p className="text-xs text-graphite-400">{p.profile?.state || "—"} &middot; Since {p.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                    </td>
                    <td className="px-4 py-3"><Badge variant="secondary">{plan}</Badge></td>
                    <td className="px-4 py-3 text-xs text-graphite-500">
                      {treatment?.medicationName ? `${treatment.medicationName} ${treatment.medicationDose}` : "Pending"}
                    </td>
                    <td className="px-4 py-3">
                      {lost > 0 ? <span className="text-sm font-semibold text-teal flex items-center gap-1"><TrendingDown className="h-3 w-3" />-{lost} lbs</span> : <span className="text-xs text-graphite-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-graphite-400">
                      {lastEntry ? new Date(lastEntry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Never"}
                    </td>
                    <td className="px-4 py-3"><Badge variant={treatment?.status === "ACTIVE" ? "success" : "warning"}>{treatment?.status || "PENDING"}</Badge></td>
                  </tr>
                );
              })}
              {patients.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-sm text-graphite-300">No patients assigned yet</td></tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
