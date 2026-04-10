import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { resolveComplianceScan } from "@/lib/admin-compliance-scanner";
import { safeError } from "@/lib/logger";

// ── PUT: Resolve a compliance scan flag ─────────────────────
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { id, resolution } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Scan result ID is required" },
        { status: 400 }
      );
    }

    if (!["APPROVED", "DISMISSED", "FIXED"].includes(resolution)) {
      return NextResponse.json(
        { error: "Resolution must be APPROVED, DISMISSED, or FIXED" },
        { status: 400 }
      );
    }

    const result = await resolveComplianceScan(
      id,
      resolution as "APPROVED" | "DISMISSED" | "FIXED",
      session.email
    );

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Compliance Resolve PUT]", error);
    return NextResponse.json(
      { error: "Failed to resolve scan result" },
      { status: 500 }
    );
  }
}
