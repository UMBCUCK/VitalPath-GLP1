import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  simulatePriceChange,
  getPricingAnalytics,
} from "@/lib/admin-pricing-engine";
import { safeError } from "@/lib/logger";

// ── GET: list pricing rules + analytics ─────────────────────

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "analytics") {
      const analytics = await getPricingAnalytics();
      return NextResponse.json(analytics);
    }

    if (action === "simulate") {
      const productId = url.searchParams.get("productId") || "";
      const newPrice = parseInt(url.searchParams.get("newPrice") || "0", 10);
      if (!productId || !newPrice) {
        return NextResponse.json(
          { error: "productId and newPrice required" },
          { status: 400 }
        );
      }
      const result = await simulatePriceChange(productId, newPrice);
      return NextResponse.json(result);
    }

    if (action === "products") {
      const products = await db.product.findMany({
        where: { isActive: true },
        select: { id: true, name: true, priceMonthly: true, slug: true },
        orderBy: { name: "asc" },
      });
      return NextResponse.json({ products });
    }

    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);

    const result = await getPricingRules(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Pricing Rules GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing rules" },
      { status: 500 }
    );
  }
}

// ── POST: create a new pricing rule ─────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { name, productId, ruleType, conditions, adjustment, adjustmentValue, priority, isActive, startsAt, endsAt } = body;

    if (!name || !ruleType || !adjustment || adjustmentValue === undefined) {
      return NextResponse.json(
        { error: "name, ruleType, adjustment, and adjustmentValue are required" },
        { status: 400 }
      );
    }

    const rule = await createPricingRule({
      name,
      productId: productId || null,
      ruleType,
      conditions: conditions || [],
      adjustment,
      adjustmentValue: parseInt(String(adjustmentValue), 10),
      priority: priority ? parseInt(String(priority), 10) : 0,
      isActive: isActive ?? true,
      startsAt: startsAt || null,
      endsAt: endsAt || null,
    });

    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "CREATE",
        entity: "PricingRule",
        entityId: rule.id,
        details: { name, ruleType, adjustment },
      },
    });

    return NextResponse.json({ rule });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Pricing Rules POST]", error);
    return NextResponse.json(
      { error: "Failed to create pricing rule" },
      { status: 500 }
    );
  }
}

// ── PUT: update a pricing rule ──────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Rule ID required" },
        { status: 400 }
      );
    }

    const rule = await updatePricingRule(id, rest);

    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE",
        entity: "PricingRule",
        entityId: id,
        details: { fieldsUpdated: Object.keys(rest) },
      },
    });

    return NextResponse.json({ rule });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Pricing Rules PUT]", error);
    return NextResponse.json(
      { error: "Failed to update pricing rule" },
      { status: 500 }
    );
  }
}

// ── DELETE: delete a pricing rule ───────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Rule ID required" },
        { status: 400 }
      );
    }

    await deletePricingRule(id);

    await db.adminAuditLog.create({
      data: {
        userId: session.userId,
        action: "DELETE",
        entity: "PricingRule",
        entityId: id,
        details: {},
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Pricing Rules DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete pricing rule" },
      { status: 500 }
    );
  }
}
