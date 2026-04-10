import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { generateReportData, REPORT_TEMPLATES } from "@/lib/admin-reports";
import { safeError } from "@/lib/logger";

// ── POST: Generate report data for a template ────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { templateKey } = body;
    if (!templateKey) {
      return NextResponse.json({ error: "templateKey is required" }, { status: 400 });
    }

    const validTemplates = REPORT_TEMPLATES.map((t) => t.key);
    if (!validTemplates.includes(templateKey)) {
      return NextResponse.json(
        { error: `templateKey must be one of: ${validTemplates.join(", ")}` },
        { status: 400 }
      );
    }

    const report = await generateReportData(templateKey);
    return NextResponse.json({ report });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Reports Generate]", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
