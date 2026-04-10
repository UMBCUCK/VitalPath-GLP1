import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getResellers, createReseller, updateReseller } from "@/lib/admin-resellers";
import { safeError } from "@/lib/logger";

// ── GET: List resellers ─────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 25));
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;

    const data = await getResellers({ page, limit, search, status });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Resellers GET]", error);
    return NextResponse.json({ error: "Failed to fetch resellers" }, { status: 500 });
  }
}

// ── POST: Create reseller ───────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { userId, displayName, contactEmail } = body;

    if (!userId || !displayName || !contactEmail) {
      return NextResponse.json(
        { error: "userId, displayName, and contactEmail are required" },
        { status: 400 }
      );
    }

    const reseller = await createReseller(body);
    return NextResponse.json({ reseller }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Resellers POST]", error);
    return NextResponse.json({ error: "Failed to create reseller" }, { status: 500 });
  }
}

// ── PUT: Update reseller ────────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Reseller ID is required" }, { status: 400 });
    }

    const reseller = await updateReseller(id, updates);
    return NextResponse.json({ reseller });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Resellers PUT]", error);
    return NextResponse.json({ error: "Failed to update reseller" }, { status: 500 });
  }
}
