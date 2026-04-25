import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Tier 13.7 — Enrich the /me response with OpenLoop linkage status,
  // active treatment summary, and a flag the dashboard can use to drive
  // the "Connect to OpenLoop" prompt.
  const [profile, treatment] = await Promise.all([
    db.patientProfile.findUnique({
      where: { userId: user.id },
      select: {
        telehealthPatientId: true,
        state: true,
      },
    }),
    db.treatmentPlan.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        status: true,
        medicationName: true,
        medicationDose: true,
        nextRefillDate: true,
        nextCheckInDate: true,
        providerName: true,
        providerVendor: true,
      },
    }),
  ]);

  return NextResponse.json({
    user,
    openloop: {
      linked: !!profile?.telehealthPatientId,
      patientId: profile?.telehealthPatientId ?? null,
      state: profile?.state ?? null,
    },
    treatment: treatment
      ? {
          status: treatment.status,
          medicationName: treatment.medicationName,
          medicationDose: treatment.medicationDose,
          nextRefillDate: treatment.nextRefillDate?.toISOString() ?? null,
          nextCheckInDate: treatment.nextCheckInDate?.toISOString() ?? null,
          providerName: treatment.providerName,
          providerVendor: treatment.providerVendor,
        }
      : null,
  });
}
