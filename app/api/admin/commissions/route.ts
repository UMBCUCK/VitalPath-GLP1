import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
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

    let commission;
    switch (action) {
      case "approve":
        commission = await approveCommission(id);
        break;
      case "reject":
        commission = await rejectCommission(id);
        break;
      case "pay":
        commission = await markCommissionPaid(id);
        break;
    }

    return NextResponse.json({ commission });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Commissions PUT]", error);
    return NextResponse.json({ error: "Failed to update commission" }, { status: 500 });
  }
}
