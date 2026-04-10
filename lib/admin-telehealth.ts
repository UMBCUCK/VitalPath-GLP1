import { db } from "@/lib/db";
import { createTelehealthService } from "@/lib/services/telehealth";
import { safeError, safeLog } from "@/lib/logger";

// ── Consultation Pipeline ──────────────────────────────────────

export async function getConsultationPipeline(
  page = 1,
  limit = 25,
  status?: string
) {
  const where: Record<string, unknown> = {};
  if (status && status !== "all") {
    where.status = status;
  }

  const [trackers, total] = await Promise.all([
    db.consultationTracker.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.consultationTracker.count({ where }),
  ]);

  // Enrich with user info
  const userIds = [...new Set(trackers.map((t) => t.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const rows = trackers.map((t) => {
    const user = userMap.get(t.userId);
    return {
      id: t.id,
      userId: t.userId,
      patientName: user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
        : "Unknown",
      patientEmail: user?.email || "",
      consultationId: t.consultationId || "",
      openloopPatientId: t.openloopPatientId || "",
      status: t.status,
      providerName: t.providerName || "",
      scheduledAt: t.scheduledAt?.toISOString() || null,
      completedAt: t.completedAt?.toISOString() || null,
      eligibilityResult: t.eligibilityResult || "",
      prescriptionId: t.prescriptionId || "",
      notes: t.notes || "",
      lastSyncAt: t.lastSyncAt?.toISOString() || null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    };
  });

  return { rows, total };
}

// ── Sync Consultation Status ───────────────────────────────────

export async function syncConsultationStatus(trackerId: string) {
  const tracker = await db.consultationTracker.findUnique({
    where: { id: trackerId },
  });

  if (!tracker) {
    return { error: "Consultation tracker not found" };
  }

  if (!tracker.consultationId) {
    return { error: "No consultation ID to sync" };
  }

  try {
    const telehealth = createTelehealthService();
    const consultation = await telehealth.getConsultationStatus(
      tracker.consultationId
    );

    const statusMap: Record<string, string> = {
      pending: "PENDING",
      scheduled: "SCHEDULED",
      in_progress: "IN_PROGRESS",
      completed: "COMPLETED",
      canceled: "CANCELED",
    };

    const updateData: Record<string, unknown> = {
      status: statusMap[consultation.status] || tracker.status,
      lastSyncAt: new Date(),
    };

    if (consultation.providerId) {
      // Try to get provider name from the consultation
      updateData.providerName =
        consultation.notes || tracker.providerName || consultation.providerId;
    }
    if (consultation.scheduledAt) {
      updateData.scheduledAt = consultation.scheduledAt;
    }
    if (consultation.completedAt) {
      updateData.completedAt = consultation.completedAt;
    }

    // If completed, also fetch eligibility and prescription
    if (consultation.status === "completed") {
      try {
        const eligibility = await telehealth.getEligibilityDecision(
          tracker.consultationId
        );
        updateData.eligibilityResult = eligibility.eligible
          ? "ELIGIBLE"
          : "NOT_ELIGIBLE";
      } catch {
        safeLog("[Telehealth Sync]", "Could not fetch eligibility decision");
      }

      try {
        const prescription = await telehealth.getPrescription(
          tracker.consultationId
        );
        if (prescription) {
          updateData.prescriptionId = prescription.id;
        }
      } catch {
        safeLog("[Telehealth Sync]", "Could not fetch prescription");
      }
    }

    const updated = await db.consultationTracker.update({
      where: { id: trackerId },
      data: updateData,
    });

    safeLog("[Telehealth Sync]", `Synced tracker ${trackerId}`, {
      status: updated.status,
    });

    return { success: true, status: updated.status };
  } catch (error) {
    safeError("[Telehealth Sync]", error);
    return { error: "Failed to sync with OpenLoop" };
  }
}

// ── Consultation Metrics ───────────────────────────────────────

export async function getConsultationMetrics() {
  const [total, pending, scheduled, inProgress, completed, canceled] =
    await Promise.all([
      db.consultationTracker.count(),
      db.consultationTracker.count({ where: { status: "PENDING" } }),
      db.consultationTracker.count({ where: { status: "SCHEDULED" } }),
      db.consultationTracker.count({ where: { status: "IN_PROGRESS" } }),
      db.consultationTracker.count({ where: { status: "COMPLETED" } }),
      db.consultationTracker.count({ where: { status: "CANCELED" } }),
    ]);

  // Avg time to completion: from createdAt to completedAt for completed consultations
  const completedTrackers = await db.consultationTracker.findMany({
    where: { status: "COMPLETED", completedAt: { not: null } },
    select: { createdAt: true, completedAt: true },
  });

  let avgTimeHours = 0;
  if (completedTrackers.length > 0) {
    const totalMs = completedTrackers.reduce((sum, t) => {
      const diff =
        (t.completedAt as Date).getTime() - t.createdAt.getTime();
      return sum + diff;
    }, 0);
    avgTimeHours = Math.round(totalMs / completedTrackers.length / 3600000);
  }

  // Approval rate: eligible / (eligible + not_eligible)
  const eligible = await db.consultationTracker.count({
    where: { eligibilityResult: "ELIGIBLE" },
  });
  const notEligible = await db.consultationTracker.count({
    where: { eligibilityResult: "NOT_ELIGIBLE" },
  });
  const approvalRate =
    eligible + notEligible > 0
      ? Math.round((eligible / (eligible + notEligible)) * 100)
      : 0;

  return {
    total,
    pending,
    scheduled,
    inProgress,
    completed,
    canceled,
    avgTimeHours,
    approvalRate,
  };
}

// ── Prescription Pipeline ──────────────────────────────────────

export async function getPrescriptionPipeline() {
  const treatments = await db.treatmentPlan.findMany({
    where: { status: { in: ["ACTIVE", "PRESCRIBED"] } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  // Enrich with user info
  const userIds = [...new Set(treatments.map((t) => t.userId))];
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return treatments.map((t) => {
    const user = userMap.get(t.userId);
    return {
      id: t.id,
      userId: t.userId,
      patientName: user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
        : "Unknown",
      patientEmail: user?.email || "",
      medication: t.medicationName || "—",
      dosage: t.medicationDose || "—",
      frequency: t.medicationFreq || "—",
      pharmacyVendor: t.pharmacyVendor || "—",
      nextRefillDate: t.nextRefillDate?.toISOString() || null,
      status: t.status,
      providerName: t.providerName || "—",
      prescribedAt: t.prescribedAt?.toISOString() || null,
    };
  });
}
