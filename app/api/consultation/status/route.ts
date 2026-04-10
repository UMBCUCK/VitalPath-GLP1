import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTelehealthService } from "@/lib/services/telehealth";
import { safeError } from "@/lib/logger";

/**
 * GET /api/consultation/status
 *
 * Returns the current consultation status for the logged-in patient.
 * If a telehealthConsultationId exists, polls the vendor for live status.
 */
export async function GET() {
  try {
    const session = await requireAuth();

    const intake = await db.intakeSubmission.findUnique({
      where: { userId: session.userId },
      select: {
        id: true,
        status: true,
        eligibilityResult: true,
        telehealthReferralId: true,
        telehealthConsultationId: true,
        reviewedAt: true,
        createdAt: true,
      },
    });

    if (!intake) {
      return NextResponse.json({ status: "none", message: "No intake submitted" });
    }

    // If we have a consultation ID and status is still pending, poll the vendor
    if (intake.telehealthConsultationId && intake.status === "UNDER_REVIEW") {
      try {
        const telehealth = createTelehealthService();
        const consultation = await telehealth.getConsultationStatus(intake.telehealthConsultationId);

        return NextResponse.json({
          status: intake.status,
          consultationStatus: consultation.status,
          providerId: consultation.providerId,
          scheduledAt: consultation.scheduledAt,
          message: getStatusMessage(consultation.status),
        });
      } catch {
        // Vendor unreachable — return DB state
      }
    }

    return NextResponse.json({
      status: intake.status,
      eligibilityResult: intake.eligibilityResult,
      reviewedAt: intake.reviewedAt,
      message: getStatusMessage(intake.status),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Consultation Status API]", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}

function getStatusMessage(status: string): string {
  const messages: Record<string, string> = {
    SUBMITTED: "Your intake has been submitted and is being processed.",
    UNDER_REVIEW: "A licensed provider is reviewing your health profile.",
    APPROVED: "Your treatment has been approved! Medication will ship within 24-48 hours.",
    DENIED: "Please check your dashboard for details and alternative options.",
    NEEDS_INFO: "Your provider needs additional information. Please check your messages.",
    pending: "Your consultation request is in the queue.",
    scheduled: "Your provider review has been scheduled.",
    in_progress: "A provider is currently reviewing your profile.",
    completed: "Your provider has completed the review.",
  };
  return messages[status] || "Processing your request.";
}
