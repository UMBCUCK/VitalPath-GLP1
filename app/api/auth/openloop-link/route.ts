/**
 * /api/auth/openloop-link
 * ─────────────────────────────────────────────────────────────
 * Tier 13.6 — On-demand "Connect to OpenLoop" endpoint. Used by the
 * dashboard prompt that appears when a logged-in user has no
 * telehealthPatientId on their PatientProfile yet.
 *
 * Behavior:
 *   - Requires authenticated session
 *   - Looks up patient by the user's email in the configured telehealth
 *     vendor (OpenLoop in production, mock in dev)
 *   - If found, persists the externalId to PatientProfile.telehealthPatientId
 *   - Returns the linkage state so the UI can update without a reload
 *
 * Failure modes:
 *   - 401 if not signed in
 *   - 404 if no matching telehealth patient exists for this email
 *   - 500 on adapter exceptions
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTelehealthService } from "@/lib/services/telehealth";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { safeError, safeLog } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Limit calls — this hits the OpenLoop API
  const { success } = await rateLimit(getRateLimitKey(req, "openloop-link"), {
    maxTokens: 3,
  });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  try {
    const session = await requireAuth();
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profile: { select: { id: true, telehealthPatientId: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.profile?.telehealthPatientId) {
      return NextResponse.json({
        ok: true,
        already_linked: true,
        patientId: user.profile.telehealthPatientId,
      });
    }

    const telehealth = createTelehealthService();
    const patient = await telehealth.findPatientByEmail(
      user.email.toLowerCase().trim(),
    );

    if (!patient) {
      return NextResponse.json(
        {
          error: "No matching telehealth patient found",
          hint:
            "If you completed an intake but expected a match, the email on file with the provider may differ. Use the same email at /qualify or contact support.",
        },
        { status: 404 },
      );
    }

    if (user.profile) {
      await db.patientProfile.update({
        where: { id: user.profile.id },
        data: { telehealthPatientId: patient.externalId },
      });
    } else {
      await db.patientProfile.create({
        data: {
          userId: user.id,
          telehealthPatientId: patient.externalId,
          state: patient.state || null,
        },
      });
    }

    safeLog(
      "[OpenLoop Link]",
      `Linked ${user.email} to OpenLoop patient ${patient.externalId}`,
    );

    return NextResponse.json({
      ok: true,
      linked: true,
      patientId: patient.externalId,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[OpenLoop Link]", error);
    return NextResponse.json({ error: "Failed to link" }, { status: 500 });
  }
}
