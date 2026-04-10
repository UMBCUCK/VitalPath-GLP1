import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { previewBulkOperation } from "@/lib/admin-bulk-operations";
import { safeError } from "@/lib/logger";

// ── POST: Preview a bulk operation ───────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { type, targetFilter } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Operation type is required" },
        { status: 400 }
      );
    }

    const preview = await previewBulkOperation(type, targetFilter);

    return NextResponse.json(preview);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Bulk Operations Preview]", error);
    return NextResponse.json(
      { error: "Failed to preview operation" },
      { status: 500 }
    );
  }
}
