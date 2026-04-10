import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getReportSchedules,
  createReportSchedule,
  updateReportSchedule,
  deleteReportSchedule,
  REPORT_TEMPLATES,
} from "@/lib/admin-reports";
import { safeError } from "@/lib/logger";

// ── GET: List schedules + templates ──────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));

    const data = await getReportSchedules(page, limit);

    return NextResponse.json({
      ...data,
      templates: REPORT_TEMPLATES,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Reports GET]", error);
    return NextResponse.json({ error: "Failed to fetch report schedules" }, { status: 500 });
  }
}

// ── POST: Create schedule ────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { name, templateKey, frequency, recipients } = body;

    if (!name || !templateKey || !frequency || !recipients) {
      return NextResponse.json(
        { error: "name, templateKey, frequency, and recipients are required" },
        { status: 400 }
      );
    }

    const validTemplates = REPORT_TEMPLATES.map((t) => t.key);
    if (!validTemplates.includes(templateKey)) {
      return NextResponse.json(
        { error: `templateKey must be one of: ${validTemplates.join(", ")}` },
        { status: 400 }
      );
    }

    const validFrequencies = ["DAILY", "WEEKLY", "MONTHLY"];
    if (!validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: `frequency must be one of: ${validFrequencies.join(", ")}` },
        { status: 400 }
      );
    }

    const schedule = await createReportSchedule({
      name,
      templateKey,
      frequency,
      recipients: Array.isArray(recipients) ? recipients : [recipients],
      createdBy: session.userId,
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Reports POST]", error);
    return NextResponse.json({ error: "Failed to create report schedule" }, { status: 500 });
  }
}

// ── PUT: Update schedule ─────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Schedule ID is required" }, { status: 400 });
    }

    const schedule = await updateReportSchedule(id, updates);
    return NextResponse.json({ schedule });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Reports PUT]", error);
    return NextResponse.json({ error: "Failed to update report schedule" }, { status: 500 });
  }
}

// ── DELETE: Remove schedule ──────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Schedule ID is required" }, { status: 400 });
    }

    await deleteReportSchedule(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Reports DELETE]", error);
    return NextResponse.json({ error: "Failed to delete report schedule" }, { status: 500 });
  }
}
