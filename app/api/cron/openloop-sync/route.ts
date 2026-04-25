/**
 * /api/cron/openloop-sync
 * ─────────────────────────────────────────────────────────────
 * Tier 12.2 — Backstop for OpenLoop's webhook delivery. Webhooks can
 * miss events (network blips, Vercel cold-start drops, signature
 * mismatches during key rotation). This cron polls OpenLoop for any
 * intake submission whose consultation hasn't reached a terminal state,
 * and reconciles the local IntakeSubmission + TreatmentPlan rows.
 *
 * Runs every 30 minutes (configured in vercel.json). Idempotent — only
 * touches state that has actually changed since the last poll.
 *
 * Auth: shared `x-cron-secret` header matching CRON_SECRET.
 * Skip: when TELEHEALTH_VENDOR isn't "openloop" (mock dev environments
 * shouldn't poll a real API).
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createTelehealthService } from "@/lib/services/telehealth";
import { safeError, safeLog } from "@/lib/logger";

const STALE_AFTER_HOURS = 1; // only re-check consultations older than this
const HARD_TIMEOUT_HOURS = 72; // give up polling after 72h — admin escalates

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  return runSync(req);
}
export async function POST(req: NextRequest) {
  return runSync(req);
}

async function runSync(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const provided =
      req.headers.get("x-cron-secret") || req.nextUrl.searchParams.get("secret");
    if (provided !== expected) return unauthorized();
  }

  if ((process.env.TELEHEALTH_VENDOR ?? "").toLowerCase() !== "openloop") {
    return NextResponse.json({ ok: true, skipped: "not_openloop" });
  }

  const now = Date.now();
  const staleCutoff = new Date(now - STALE_AFTER_HOURS * 60 * 60 * 1000);
  const hardCutoff = new Date(now - HARD_TIMEOUT_HOURS * 60 * 60 * 1000);

  const pending = await db.intakeSubmission.findMany({
    where: {
      status: { in: ["SUBMITTED", "UNDER_REVIEW", "NEEDS_INFO"] },
      telehealthConsultationId: { not: null },
      updatedAt: { lt: staleCutoff, gt: hardCutoff },
    },
    select: {
      id: true,
      userId: true,
      telehealthConsultationId: true,
    },
    take: 100,
  });

  if (pending.length === 0) {
    return NextResponse.json({ ok: true, polled: 0 });
  }

  const telehealth = createTelehealthService();
  const stats = { polled: 0, updated: 0, errors: 0 };

  for (const intake of pending) {
    if (!intake.telehealthConsultationId) continue;
    stats.polled++;
    try {
      // Pull current consultation status + eligibility from OpenLoop
      const [consultation, eligibility] = await Promise.all([
        telehealth.getConsultationStatus(intake.telehealthConsultationId),
        telehealth
          .getEligibilityDecision(intake.telehealthConsultationId)
          .catch(() => null),
      ]);

      // Only mutate if status actually progressed.
      // TelehealthConsultation.status is one of: pending / scheduled /
      // in_progress / completed / canceled. The ELIGIBILITY decision is
      // what tells us approve / deny / needs_info — see EligibilityDecision.
      let nextStatus: "APPROVED" | "DENIED" | "NEEDS_INFO" | null = null;
      if (consultation.status === "completed") {
        if (eligibility?.eligible) {
          nextStatus = "APPROVED";
        } else if (eligibility?.alternativePath) {
          nextStatus = "NEEDS_INFO";
        } else if (eligibility?.reason) {
          nextStatus = "DENIED";
        } else {
          nextStatus = "NEEDS_INFO";
        }
      } else if (consultation.status === "canceled") {
        nextStatus = "DENIED";
      }

      if (!nextStatus) continue;

      await db.intakeSubmission.update({
        where: { id: intake.id },
        data: {
          status: nextStatus,
          eligibilityResult:
            nextStatus === "APPROVED"
              ? "ELIGIBLE"
              : nextStatus === "DENIED"
                ? "NOT_ELIGIBLE"
                : "PENDING_REVIEW",
          reviewedAt: new Date(),
        },
      });

      // If approved, ensure a TreatmentPlan exists. Fetch the prescription
      // OpenLoop has assigned (if any) and reflect it locally.
      if (nextStatus === "APPROVED") {
        const prescription = await telehealth
          .getPrescription(intake.telehealthConsultationId)
          .catch(() => null);

        const existing = await db.treatmentPlan.findFirst({
          where: { userId: intake.userId, status: { in: ["PENDING", "ACTIVE", "PRESCRIBED"] } },
        });

        if (existing) {
          await db.treatmentPlan.update({
            where: { id: existing.id },
            data: {
              status: prescription ? "ACTIVE" : "PENDING",
              medicationName: prescription?.medicationName ?? existing.medicationName,
              medicationDose: prescription?.dosage ?? existing.medicationDose,
              medicationFreq: prescription?.frequency ?? existing.medicationFreq,
              prescribedAt: prescription?.prescribedAt ?? existing.prescribedAt,
              providerVendor: "openloop",
              providerRefId: intake.telehealthConsultationId,
            },
          });
        } else {
          await db.treatmentPlan.create({
            data: {
              userId: intake.userId,
              status: prescription ? "ACTIVE" : "PENDING",
              medicationName: prescription?.medicationName,
              medicationDose: prescription?.dosage,
              medicationFreq: prescription?.frequency,
              prescribedAt: prescription?.prescribedAt,
              providerVendor: "openloop",
              providerRefId: intake.telehealthConsultationId,
            },
          });
        }
      }

      stats.updated++;
    } catch (err) {
      stats.errors++;
      safeError("[OpenLoop Sync]", err);
    }
  }

  // Anything pending past 72h with no movement gets escalated to admin
  const stale = await db.intakeSubmission.count({
    where: {
      status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
      updatedAt: { lt: hardCutoff },
    },
  });

  if (stale > 0) {
    safeLog(
      "[OpenLoop Sync]",
      `${stale} intakes stuck >72h — surface to admin in lead-insights`,
    );
  }

  return NextResponse.json({ ok: true, ...stats, stuck: stale });
}
