import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getBulkOperations,
  createBulkOperation,
  executeBulkOperation,
} from "@/lib/admin-bulk-operations";
import { safeError } from "@/lib/logger";

// ── GET: List bulk operations ────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));

    const result = await getBulkOperations(page, limit);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Bulk Operations GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch bulk operations" },
      { status: 500 }
    );
  }
}

// ── POST: Create + trigger a bulk operation ──────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { type, targetSegment, targetFilter } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Operation type is required" },
        { status: 400 }
      );
    }

    const validTypes = [
      "RECALC_SCORES",
      "RETRY_PAYMENTS",
      "SEND_CAMPAIGN",
      "APPLY_COUPON",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Create the operation
    const operation = await createBulkOperation({
      type,
      targetSegment,
      targetFilter,
      initiatedBy: session.email,
    });

    // Log to admin audit
    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "BULK_OPERATION_CREATED",
        entity: "BulkOperation",
        entityId: operation.id,
        details: { type, targetSegment },
      },
    });

    // Execute in background (non-blocking)
    executeBulkOperation(operation.id).catch((err) => {
      safeError("[Bulk Operation Execute]", err);
    });

    return NextResponse.json({ operation }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Bulk Operations POST]", error);
    return NextResponse.json(
      { error: "Failed to create bulk operation" },
      { status: 500 }
    );
  }
}
