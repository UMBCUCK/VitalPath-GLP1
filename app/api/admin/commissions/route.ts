import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getCommissions,
  approveCommission,
  rejectCommission,
  markCommissionPaid,
} from "@/lib/admin-resellers";
import { safeError } from "@/lib/logger";

// ── GET: List commissions ───────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));
    const resellerId = searchParams.get("resellerId") || undefined;
    const status = searchParams.get("status") || undefined;

    const data = await getCommissions({ resellerId, page, limit, status });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Commissions GET]", error);
    return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 });
  }
}

// ── PUT: Update commission status (approve/reject/pay) ──────────

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: "id and action are required" },
        { status: 400 }
      );
    }

    const validActions = ["approve", "reject", "pay"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `action must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    // ── Payout compliance gate ──────────────────────────────
    // Before approving or paying, verify the reseller has completed
    // onboarding, submitted W-9, and passed OIG/SAM checks.
    if (action === "approve" || action === "pay") {
      const commission = await db.commission.findUnique({
        where: { id },
        select: { resellerId: true, type: true },
      });
      if (!commission) {
        return NextResponse.json({ error: "Commission not found" }, { status: 404 });
      }

      // Block all override commissions (AKS/FTC compliance)
      if (
        commission.type === "OVERRIDE_TIER1" ||
        commission.type === "OVERRIDE_TIER2" ||
        commission.type === "OVERRIDE_TIER3"
      ) {
        return NextResponse.json({
          error: "Override commissions are disabled for healthcare regulatory compliance (AKS/FTC). This commission cannot be approved or paid.",
        }, { status: 403 });
      }

      const reseller = await db.resellerProfile.findUnique({
        where: { id: commission.resellerId },
        select: {
          status: true,
          onboardingCompletedAt: true,
          w9SubmittedAt: true,
          oigCheckResult: true,
        },
      });

      if (!reseller) {
        return NextResponse.json({ error: "Reseller not found" }, { status: 404 });
      }

      if (reseller.status !== "ACTIVE") {
        return NextResponse.json({
          error: `Payout blocked: reseller status is ${reseller.status}. Only ACTIVE resellers can receive payments.`,
        }, { status: 403 });
      }

      if (!reseller.onboardingCompletedAt) {
        return NextResponse.json({
          error: "Payout blocked: reseller has not completed compliance onboarding.",
        }, { status: 403 });
      }

      if (!reseller.w9SubmittedAt) {
        return NextResponse.json({
          error: "Payout blocked: reseller has not submitted W-9 tax information.",
        }, { status: 403 });
      }

      if (reseller.oigCheckResult === "FLAGGED") {
        return NextResponse.json({
          error: "Payout blocked: reseller flagged on OIG exclusion database.",
        }, { status: 403 });
      }
    }

    // ── Execute the action ──────────────────────────────────
    let result;
    switch (action) {
      case "approve":
        result = await approveCommission(id);
        break;
      case "reject":
        result = await rejectCommission(id);
        break;
      case "pay":
        result = await markCommissionPaid(id);
        break;
    }

    return NextResponse.json({ commission: result });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Commissions PUT]", error);
    return NextResponse.json({ error: "Failed to update commission" }, { status: 500 });
  }
}
