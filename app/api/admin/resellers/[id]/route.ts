import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { getReseller, updateReseller } from "@/lib/admin-resellers";
import { safeError, safeLog } from "@/lib/logger";

// ── GET: Single reseller detail ─────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const reseller = await getReseller(id);

    if (!reseller) {
      return NextResponse.json({ error: "Reseller not found" }, { status: 404 });
    }

    return NextResponse.json({ reseller });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Reseller GET]", error);
    return NextResponse.json({ error: "Failed to fetch reseller" }, { status: 500 });
  }
}

// ── PUT: Update reseller ────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();

    const { id } = await params;
    const body = await req.json();

    // Handle re-certification request
    if (body.recertification === true) {
      await db.resellerProfile.update({
        where: { id },
        data: {
          onboardingStep: 0,
          onboardingCompletedAt: null,
          complianceTrainingCompletedAt: null,
          agreementSignedAt: null,
          agreementVersion: null,
          agreementIpAddress: null,
          // W-9 and attestation preserved — they need to re-sign agreement & re-train
        },
      });

      await db.adminAuditLog.create({
        data: {
          userId: session.userId,
          action: "reseller.recertification_triggered",
          entity: "ResellerProfile",
          entityId: id,
          details: { triggeredBy: session.userId },
        },
      });

      safeLog("[Reseller]", `Re-certification triggered for reseller ${id}`);
      return NextResponse.json({ success: true, recertification: true });
    }

    const reseller = await updateReseller(id, body);
    return NextResponse.json({ reseller });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Reseller PUT]", error);
    return NextResponse.json({ error: "Failed to update reseller" }, { status: 500 });
  }
}

// ── DELETE: Terminate reseller ──────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const reseller = await updateReseller(id, { status: "TERMINATED" });
    return NextResponse.json({ reseller });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Reseller DELETE]", error);
    return NextResponse.json({ error: "Failed to terminate reseller" }, { status: 500 });
  }
}
