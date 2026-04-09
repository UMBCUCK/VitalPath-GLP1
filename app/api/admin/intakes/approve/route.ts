import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "PROVIDER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { intakeId, userId, medication } = await req.json();

    // Update intake status
    await db.intakeSubmission.update({
      where: { id: intakeId },
      data: { status: "APPROVED", eligibilityResult: "ELIGIBLE", providerAssignedId: session.userId },
    });

    // Get provider name
    const provider = await db.user.findUnique({ where: { id: session.userId }, select: { firstName: true, lastName: true } });

    // Create treatment plan
    await db.treatmentPlan.create({
      data: {
        userId,
        status: "PRESCRIBED",
        providerName: [provider?.firstName, provider?.lastName].filter(Boolean).join(" "),
        medicationName: medication?.medicationName || "Compounded Semaglutide",
        medicationDose: medication?.dose || "0.25mg",
        medicationFreq: medication?.frequency || "Weekly injection",
        is503A: true,
        prescribedAt: new Date(),
        nextRefillDate: new Date(Date.now() + 30 * 86400000),
        nextCheckInDate: new Date(Date.now() + 14 * 86400000),
      },
    });

    // Create notification for patient
    await db.notification.create({
      data: {
        userId,
        type: "SYSTEM",
        title: "Your treatment plan is ready",
        body: "A licensed provider has reviewed your intake and created your personalized treatment plan. Your medication will ship within 24-48 hours.",
        link: "/dashboard/treatment",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Approve Intake]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
