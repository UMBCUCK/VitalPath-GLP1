import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { generateAIReport, getAIReports } from "@/lib/admin-ai-reports";
import { safeError } from "@/lib/logger";

// ── GET: List previous AI reports ──────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));

    const data = await getAIReports(page, limit);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin AI Reports GET]", error);
    return NextResponse.json({ error: "Failed to fetch AI reports" }, { status: 500 });
  }
}

// ── POST: Generate a new AI report ─────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { reportType } = body;

    const validTypes = ["FULL_ANALYTICS", "CONVERSION_OPTIMIZATION", "SALES_PERFORMANCE", "FINANCIAL", "CUSTOM"];
    if (!reportType || !validTypes.includes(reportType)) {
      return NextResponse.json(
        { error: `reportType must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const report = await generateAIReport(reportType, session.userId);
    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin AI Reports POST]", error);
    return NextResponse.json({ error: "Failed to generate AI report" }, { status: 500 });
  }
}
