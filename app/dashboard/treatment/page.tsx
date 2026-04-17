export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoseAdjustmentForm } from "@/components/dashboard/dose-adjustment-form";
import { Pill, Calendar, Package, Stethoscope, Clock, TrendingUp, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function TreatmentPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [treatment, peptideProducts] = await Promise.all([
    db.treatmentPlan.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    // Tier 3.4 — top 3 HEALTHY_AGING products for the marketplace strip
    db.product.findMany({
      where: { category: "HEALTHY_AGING", isActive: true, isMarketplace: true },
      orderBy: [{ isFeatured: "desc" }, { marketplaceOrder: "asc" }],
      take: 3,
      select: { id: true, slug: true, name: true, marketplaceDesc: true, priceMonthly: true, badge: true },
    }),
  ]);

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
            <Link href="/qualify">
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

  // Treatment timeline — built from real treatment dates
  const prescribedDate = treatment.prescribedAt ? new Date(treatment.prescribedAt) : null;
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const timeline: { date: string; event: string; detail: string; upcoming?: boolean }[] = [];

  if (prescribedDate) {
    timeline.push({
      date: fmt(prescribedDate),
      event: "Treatment started",
      detail: treatment.medicationName
        ? `${treatment.medicationName} · ${treatment.medicationDose || "initial dose"}`
        : "Initial provider prescription",
    });
  } else {
    timeline.push({ date: "Pending", event: "Awaiting provider evaluation", detail: "Your provider will review your intake and create a plan.", upcoming: true });
  }

  if (daysSincePrescribed >= 28 && treatment.medicationDose) {
    timeline.push({
      date: prescribedDate ? fmt(new Date(prescribedDate.getTime() + 28 * 86400000)) : "Week 4",
      event: "First check-in completed",
      detail: `Dose reviewed: ${treatment.medicationDose}`,
    });
  } else if (prescribedDate) {
    const week4 = new Date(prescribedDate.getTime() + 28 * 86400000);
    timeline.push({
      date: fmt(week4),
      event: "4-week check-in",
      detail: "Dose review and tolerance assessment",
      upcoming: week4 > new Date(),
    });
  }

  if (treatment.nextCheckInDate) {
    timeline.push({
      date: fmt(treatment.nextCheckInDate),
      event: "Next scheduled check-in",
      detail: "Discuss progress, side effects, and potential titration",
      upcoming: treatment.nextCheckInDate > new Date(),
    });
  }

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
            <div className="relative space-y-5">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-teal via-atlantic to-navy-200" />
              {timeline.map((item, i) => (
                <div key={i} className="relative flex gap-4">
                  <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${item.upcoming ? "border-2 border-navy-200 bg-white" : "bg-teal"}`}>
                    <div className={`h-2 w-2 rounded-full ${item.upcoming ? "bg-navy-300" : "bg-white"}`} />
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm font-bold ${item.upcoming ? "text-graphite-400" : "text-navy"}`}>{item.event}</p>
                      <span className={`text-[10px] rounded-full px-2 py-0.5 ${item.upcoming ? "bg-navy-50 text-graphite-400" : "bg-teal-50 text-teal"}`}>{item.date}</span>
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
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-teal" /> Medication Shipment</CardTitle></CardHeader>
        <CardContent>
          {treatment.status === "PENDING" ? (
            <div className="py-6 text-center">
              <Package className="mx-auto h-10 w-10 text-graphite-200 mb-3" />
              <p className="text-sm font-medium text-navy">Awaiting provider approval</p>
              <p className="text-xs text-graphite-400 mt-1">Your first shipment will be tracked here once your provider approves your treatment plan.</p>
            </div>
          ) : treatment.status === "PRESCRIBED" ? (
            <div>
              <div className="flex items-center gap-0 overflow-x-auto">
                {["Order Received", "Processing", "Shipped", "Delivered"].map((step, i) => (
                  <div key={step} className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= 1 ? "bg-teal text-white" : "bg-navy-100 text-graphite-400"}`}>
                        {i + 1}
                      </div>
                      {i < 3 && <div className={`h-0.5 flex-1 ${i < 1 ? "bg-teal" : "bg-navy-200"}`} />}
                    </div>
                    <p className={`mt-2 text-xs truncate ${i <= 1 ? "text-navy font-medium" : "text-graphite-400"}`}>{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                <p className="text-sm font-medium text-navy">Prescription received — preparing your order</p>
                <p className="text-xs text-graphite-500 mt-0.5">Your medication is being prepared. Tracking info will appear here once shipped (typically 1-2 business days).</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-0 overflow-x-auto">
                {["Order Received", "Processing", "Shipped", "Delivered"].map((step, i) => (
                  <div key={step} className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-teal text-white`}>
                        {i + 1}
                      </div>
                      {i < 3 && <div className="h-0.5 flex-1 bg-teal" />}
                    </div>
                    <p className="mt-2 text-xs truncate text-navy font-medium">{step}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                <p className="text-sm font-medium text-navy">Your most recent shipment was delivered</p>
                <p className="text-xs text-graphite-500 mt-0.5">
                  Contact your care team via{" "}
                  <Link href="/dashboard/messages" className="text-teal hover:underline">secure messaging</Link>
                  {" "}if you have questions about your medication or next refill.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tier 3.4 — "Recommended for you" peptides marketplace strip.
          Only show if the member is actively on treatment (≥30 days) and we have peptide products seeded. */}
      {daysSincePrescribed >= 30 && peptideProducts.length > 0 && (
        <Card className="border-navy-100/60 bg-gradient-to-br from-white to-sage/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                Recommended for you
              </span>
              <Link
                href="/dashboard/shop"
                className="text-xs font-semibold text-teal hover:underline"
              >
                View all &rarr;
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-xs text-graphite-500">
              Provider-supervised add-ons popular with members at your stage of treatment.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {peptideProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/dashboard/shop?product=${p.slug}`}
                  className="group relative rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-teal"
                >
                  {p.badge && (
                    <Badge variant="gold" className="absolute -top-2 right-2 text-[9px] uppercase">
                      {p.badge}
                    </Badge>
                  )}
                  <p className="text-sm font-bold text-navy">{p.name}</p>
                  {p.marketplaceDesc && (
                    <p className="mt-1 text-[11px] leading-relaxed text-graphite-500 line-clamp-2">
                      {p.marketplaceDesc}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-navy-100/40 pt-2.5">
                    <span className="text-sm font-bold text-navy">
                      ${(p.priceMonthly / 100).toFixed(0)}
                      <span className="text-xs font-normal text-graphite-400">/mo</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-graphite-400 group-hover:text-teal transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-graphite-400">
              Eligibility and dosing determined by your provider. Compounded medications are not FDA-approved.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Emergency Information */}
      <Card className="border-2 border-red-300 bg-red-50/30">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-bold text-red-800">Emergency Information</h3>
              <p className="text-sm font-semibold text-red-700">
                If you are experiencing a medical emergency, call 911 immediately.
              </p>
              <p className="text-xs text-red-600/90 leading-relaxed">
                For severe side effects, contact your provider through secure messaging or call our care line:{" "}
                <a href="tel:8885092745" className="font-semibold underline">(888) 509-2745</a>
              </p>
              <Link href="/dashboard/report-event">
                <Button variant="outline" size="sm" className="mt-1 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800 gap-1.5 text-xs">
                  Report a side effect or adverse event
                </Button>
              </Link>
            </div>
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
