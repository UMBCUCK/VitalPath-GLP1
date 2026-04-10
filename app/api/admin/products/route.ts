import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { safeError } from "@/lib/logger";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  type: z.enum(["MEMBERSHIP", "ADDON", "BUNDLE", "SUPPLEMENT", "CONTENT", "LAB", "COACHING"]),
  category: z.enum(["WEIGHT_MANAGEMENT", "METABOLIC_SUPPORT", "NUTRITION", "HYDRATION_PROTEIN", "DIGESTIVE", "MENS_HEALTH", "HAIR_SKIN", "HEALTHY_AGING", "LABS", "COACHING", "MEAL_PLANS"]),
  priceMonthly: z.number().min(0),
  priceQuarterly: z.number().min(0).optional().nullable(),
  priceAnnual: z.number().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
  isAddon: z.boolean().default(false),
  isMarketplace: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  marketplaceOrder: z.number().default(0),
  marketplaceDesc: z.string().optional().nullable(),
  badge: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  sortOrder: z.number().default(0),
  iconName: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  // Stripe IDs — admin can paste these from Stripe Dashboard
  stripeProductId: z.string().optional().nullable(),
  stripePriceIdMonthly: z.string().optional().nullable(),
  stripePriceIdQuarterly: z.string().optional().nullable(),
  stripePriceIdAnnual: z.string().optional().nullable(),
});

export async function GET() {
  try {
    await requireAdmin();
    const products = await db.product.findMany({
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
      include: {
        _count: { select: { subscriptions: true } },
      },
    });
    return NextResponse.json({ products });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Products GET]", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }
    const product = await db.product.create({
      data: {
        ...parsed.data,
        features: parsed.data.features || [],
      },
    });
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Products POST]", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const parsed = productSchema.partial().safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid data" }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Products PUT]", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    // Check for active subscriptions before deleting
    const activeItems = await db.subscription.count({
      where: { items: { some: { productId: id } } },
    });
    if (activeItems > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${activeItems} active subscription(s) use this product. Deactivate it instead.` },
        { status: 409 }
      );
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Products DELETE]", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
