import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  scanContentForCompliance,
  getComplianceScanResults,
} from "@/lib/admin-compliance-scanner";
import { safeError } from "@/lib/logger";

// ── POST: Trigger a compliance scan ─────────────────────────
export async function POST() {
  try {
    await requireAdmin();

    const results = await scanContentForCompliance();

    return NextResponse.json({
      results,
      count: results.length,
      message: `Scan complete. Found ${results.length} new flag(s).`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Compliance Scan POST]", error);
    return NextResponse.json(
      { error: "Failed to run compliance scan" },
      { status: 500 }
    );
  }
}

// ── GET: List scan results with pagination and severity filter ─
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "25", 10);
    const severity = url.searchParams.get("severity") || undefined;

    const data = await getComplianceScanResults(page, limit, severity);

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Compliance Scan GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch scan results" },
      { status: 500 }
    );
  }
}
