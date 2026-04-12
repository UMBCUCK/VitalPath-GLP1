import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

// GET /api/admin/coupons — list all coupons
export async function GET() {
  try {
    await requireAdmin();
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ coupons });
  } catch (err) {
    safeError("[Admin Coupons] GET failed", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST /api/admin/coupons — create a new coupon
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { code, type, valueCents, valuePct, maxUses, expiresAt, firstMonthOnly } = body;

    if (!code || !type) {
      return NextResponse.json({ error: "Code and type are required" }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type,
        valueCents: valueCents ? Number(valueCents) : null,
        valuePct: valuePct ? Number(valuePct) : null,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        firstMonthOnly: Boolean(firstMonthOnly),
        isActive: true,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (err: any) {
    safeError("[Admin Coupons] POST failed", err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "A coupon with that code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

// PUT /api/admin/coupons — update a coupon (toggle active, etc.)
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    // Sanitize updatable fields
    const data: Record<string, unknown> = {};
    if (typeof updates.isActive === "boolean") data.isActive = updates.isActive;
    if (updates.maxUses !== undefined) data.maxUses = updates.maxUses ? Number(updates.maxUses) : null;
    if (updates.expiresAt !== undefined) data.expiresAt = updates.expiresAt ? new Date(updates.expiresAt) : null;
    if (updates.firstMonthOnly !== undefined) data.firstMonthOnly = Boolean(updates.firstMonthOnly);

    const coupon = await db.coupon.update({ where: { id }, data });
    return NextResponse.json({ coupon });
  } catch (err) {
    safeError("[Admin Coupons] PUT failed", err);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

// DELETE /api/admin/coupons?id=... — delete a coupon
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    safeError("[Admin Coupons] DELETE failed", err);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
