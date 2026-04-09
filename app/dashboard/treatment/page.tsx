import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoseAdjustmentForm } from "@/components/dashboard/dose-adjustment-form";
import { Pill, Calendar, Package, Stethoscope, Clock, TrendingUp, MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function TreatmentPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const treatment = await db.treatmentPlan.findFirst({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  if (!treatment) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-navy">Treatment Plan</h2>
        <Card className="py-16 text-center">
          <CardContent>
            <Pill className="mx-auto h-12 w-12 text-graphite-200" />
            <h3 className="mt-4 text-lg font-bold text-navy">No active treatment plan</h3>
            <p className="mt-2 text-sm text-graphite-400 max-w-md mx-auto">
              Complete your medical intake to get evaluated by a licensed provider.
              If eligible, your treatment plan will appear here.
            </p>
            <Link href="/intake">
              <Button className="mt-6">Complete Intake</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysSincePrescribed = treatment.prescribedAt
    ? Math.floor((Date.now() - treatment.prescribedAt.getTime()) / 86400000)
    : 0;
  const daysToRefill = treatment.nextRefillDate
    ? Math.ceil((treatment.nextRefillDate.getTime() - Date.now()) / 86400000)
    : null;
  const daysToCheckIn = treatment.nextCheckInDate
    ? Math.ceil((treatment.nextCheckInDate.getTime() - Date.now()) / 86400000)
    : null;

  const statusColor = {
    PENDING: "warning",
    PRESCRIBED: "default",
    ACTIVE: "success",
    ON_HOLD: "warning",
    COMPLETED: "secondary",
    DISCONTINUED: "destructive",
  } as const;

  // Treatment timeline (simulated dose history)
  const timeline = [
    { date: treatment.prescribedAt ? new Date(treatment.prescribedAt.getTime()).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Start", event: "Treatment started", detail: "Initial dose: 0.25mg weekly" },
    { date: treatment.prescribedAt ? new Date(treatment.prescribedAt.getTime() + 28 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Week 4", event: "Dose titration", detail: "Increased to 0.5mg weekly" },
    { date: "Upcoming", event: "Month 3 check-in", detail: "Review for potential titration to 1mg" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Treatment Plan</h2>
          <p className="text-sm text-graphite-400">Managed by {treatment.providerName || "your care team"}</p>
        </div>
        <Badge variant={statusColor[treatment.status] || "secondary"} className="text-xs">
          {treatment.status}
        </Badge>
      </div>

      {/* Key cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                <Pill className="h-5 w-5 text-teal" />
              </div>
              <div>
                <p className="text-xs text-graphite-400">Current Medication</p>
                <p className="text-sm font-bold text-navy">{treatment.medicationName || "Pending"}</p>
                <p className="text-xs text-graphite-400">{treatment.medicationDose} &middot; {treatment.medicationFreq}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={daysToRefill !== null && daysToRefill <= 7 ? "border-amber-200 bg-amber-50/20" : ""}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50">
                <Calendar className="h-5 w-5 text-gold-600" />
              </div>
              <div>
                <p className="text-xs text-graphite-400">Next Refill</p>
                <p className="text-sm font-bold text-navy">
                  {treatment.nextRefillDate
                    ? treatment.nextRefillDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Not scheduled"}
                </p>
                {daysToRefill !== null && (
                  <p className="text-xs text-graphite-400">{daysToRefill > 0 ? `In ${daysToRefill} days` : "Due today"}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-atlantic/5">
                <Stethoscope className="h-5 w-5 text-atlantic" />
              </div>
              <div>
                <p className="text-xs text-graphite-400">Next Check-In</p>
                <p className="text-sm font-bold text-navy">
                  {treatment.nextCheckInDate
                    ? treatment.nextCheckInDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : "Not scheduled"}
                </p>
                {daysToCheckIn !== null && (
                  <p className="text-xs text-graphite-400">{daysToCheckIn > 0 ? `In ${daysToCheckIn} days` : "Due today"}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Treatment details */}
        <Card>
          <CardHeader><CardTitle className="text-base">Treatment Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-navy-50/50 px-4 py-3">
              <div><p className="text-xs text-graphite-400">Provider</p><p className="text-sm font-medium text-navy">{treatment.providerName || "Pending assignment"}</p></div>
              <Link href="/dashboard/messages"><Button variant="ghost" size="sm" className="gap-1"><MessageCircle className="h-3.5 w-3.5" /> Message</Button></Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-navy-50/30 px-4 py-3">
                <p className="text-xs text-graphite-400">Medication Source</p>
                <p className="text-sm font-medium text-navy">{treatment.is503A ? "503A Compounding" : treatment.is503B ? "503B Outsourcing" : treatment.isBrandMed ? "Brand Medication" : "Pending"}</p>
              </div>
              <div className="rounded-xl bg-navy-50/30 px-4 py-3">
                <p className="text-xs text-graphite-400">Days on Treatment</p>
                <p className="text-sm font-medium text-navy">{daysSincePrescribed} days</p>
              </div>
            </div>
            {treatment.notes && (
              <div className="rounded-xl bg-teal-50/30 border border-teal/10 px-4 py-3">
                <p className="text-xs font-semibold text-teal-700 mb-1">Provider Notes</p>
                <p className="text-sm text-graphite-600 leading-relaxed">{treatment.notes}</p>
              </div>
            )}

            <DoseAdjustmentForm />
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal" /> Treatment Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="relative space-y-6">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-teal via-atlantic to-navy-200" />
              {timeline.map((item, i) => (
                <div key={i} className="relative flex gap-4">
                  <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${i < timeline.length - 1 ? "bg-teal" : "bg-navy-200"}`}>
                    <div className={`h-2 w-2 rounded-full ${i < timeline.length - 1 ? "bg-white" : "bg-navy-400"}`} />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-navy">{item.event}</p>
                      <span className="text-[10px] text-graphite-400">{item.date}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-graphite-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipment tracking */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-teal" /> Recent Shipment</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            {["Order Received", "Processing", "Shipped", "Delivered"].map((step, i) => (
              <div key={step} className="flex-1">
                <div className="flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= 3 ? "bg-teal text-white" : "bg-navy-100 text-graphite-400"}`}>
                    {i + 1}
                  </div>
                  {i < 3 && <div className={`h-0.5 flex-1 ${i < 3 ? "bg-teal" : "bg-navy-200"}`} />}
                </div>
                <p className={`mt-2 text-xs ${i <= 3 ? "text-navy font-medium" : "text-graphite-400"}`}>{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-navy-50/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-navy">Tracking: 1Z999AA10123456784</p>
              <p className="text-xs text-graphite-400">UPS &middot; Delivered Apr 4</p>
            </div>
            <Badge variant="success">Delivered</Badge>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-graphite-300 text-center">
        Compounded medications are not FDA-approved. They are prepared by state-licensed pharmacies
        based on individual prescriptions from licensed providers.
      </p>
    </div>
  );
}
