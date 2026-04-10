import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  runReconciliation,
  getReconciliations,
  resolveReconciliation,
  getReconciliationSummary,
  getReconciliationTrend,
} from "@/lib/admin-reconciliation";

// ── GET: List reconciliations + summary ────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const view = searchParams.get("view"); // "summary" | "trend" | default list

    if (view === "summary") {
      const summary = await getReconciliationSummary();
      return NextResponse.json(summary);
    }

    if (view === "trend") {
      const trend = await getReconciliationTrend();
      return NextResponse.json(trend);
    }

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));

    const data = await getReconciliations(page, limit);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("[Reconciliation GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch reconciliations" },
      { status: 500 }
    );
  }
}

// ── POST: Run new reconciliation ───────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { periodStart, periodEnd } = body;
    if (!periodStart || !periodEnd) {
      return NextResponse.json(
        { error: "periodStart and periodEnd are required" },
        { status: 400 }
      );
    }

    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (start >= end) {
      return NextResponse.json(
        { error: "periodStart must be before periodEnd" },
        { status: 400 }
      );
    }

    const record = await runReconciliation(start, end);
    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("[Reconciliation POST]", error);
    return NextResponse.json(
      { error: "Failed to run reconciliation" },
      { status: 500 }
    );
  }
}

// ── PUT: Resolve reconciliation ────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { id, notes } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Reconciliation ID is required" },
        { status: 400 }
      );
    }

    const record = await resolveReconciliation(
      id,
      notes || "",
      session.email
    );
    return NextResponse.json({ record });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("[Reconciliation PUT]", error);
    return NextResponse.json(
      { error: "Failed to resolve reconciliation" },
      { status: 500 }
    );
  }
}
