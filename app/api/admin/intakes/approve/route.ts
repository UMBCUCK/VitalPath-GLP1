import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "PROVIDER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { intakeId, userId, medication, clinicalRationale } = await req.json();

    // ── Look up intake to get patient state ─────────────────
    const intake = await db.intakeSubmission.findUnique({
      where: { id: intakeId },
      select: { state: true, userId: true },
    });

    if (!intake) {
      return NextResponse.json({ error: "Intake not found" }, { status: 404 });
    }

    // ── Verify state is still available ─────────────────────
    const stateRecord = await db.stateAvailability.findUnique({
      where: { stateCode: intake.state },
    });
    if (!stateRecord || !stateRecord.isAvailable) {
      return NextResponse.json(
        { error: `Service is not available in ${intake.state}. Cannot approve.` },
        { status: 400 }
      );
    }

    // ── Verify provider has valid credential for this state ─
    const credential = await db.providerCredential.findFirst({
      where: {
        userId: session.userId,
        licenseState: intake.state,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (!credential) {
      return NextResponse.json(
        { error: `You do not hold an active license for ${intake.state}. Cannot approve this intake.` },
        { status: 403 }
      );
    }

    // ── Update intake status ────────────────────────────────
    await db.intakeSubmission.update({
      where: { id: intakeId },
      data: { status: "APPROVED", eligibilityResult: "ELIGIBLE", providerAssignedId: session.userId },
    });

    // Get provider name
    const provider = await db.user.findUnique({
      where: { id: session.userId },
      select: { firstName: true, lastName: true },
    });

    // ── Create treatment plan with credential reference ─────
    await db.treatmentPlan.create({
      data: {
        userId,
        status: "PRESCRIBED",
        providerName: [provider?.firstName, provider?.lastName].filter(Boolean).join(" "),
        credentialId: credential.id,
        stateVerifiedAt: new Date(),
        clinicalRationale: clinicalRationale || null,
        medicationName: medication?.medicationName || "Compounded Semaglutide",
        medicationDose: medication?.dose || "0.25mg",
        medicationFreq: medication?.frequency || "Weekly injection",
        is503A: true,
        prescribedAt: new Date(),
        nextRefillDate: new Date(Date.now() + 30 * 86400000),
        nextCheckInDate: new Date(Date.now() + 14 * 86400000),
      },
    });

    // ── Write compliance audit log ──────────────────────────
    await db.complianceAuditLog.create({
      data: {
        actorId: session.userId,
        actorRole: session.role,
        action: "INTAKE_APPROVED",
        patientId: userId,
        intakeId,
        credentialId: credential.id,
        stateCode: intake.state,
        clinicalRationale: clinicalRationale || null,
        ipAddress: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
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
    safeError("[Approve Intake]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
