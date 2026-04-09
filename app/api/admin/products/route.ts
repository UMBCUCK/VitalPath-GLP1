import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["MEMBERSHIP", "ADDON", "BUNDLE", "SUPPLEMENT", "CONTENT", "LAB", "COACHING"]),
  category: z.enum(["WEIGHT_MANAGEMENT", "METABOLIC_SUPPORT", "NUTRITION", "HYDRATION_PROTEIN", "DIGESTIVE", "MENS_HEALTH", "HAIR_SKIN", "HEALTHY_AGING", "LABS", "COACHING", "MEAL_PLANS"]),
  priceMonthly: z.number().min(0),
  isActive: z.boolean().default(true),
  isAddon: z.boolean().default(false),
  badge: z.string().optional(),
  features: z.array(z.string()).optional(),
  sortOrder: z.number().default(0),
  stripePriceIdMonthly: z.string().optional(),
});

export async function GET() {
  try {
    await requireAdmin();
    const products = await db.product.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ products });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
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
    const product = await db.product.create({ data: { ...parsed.data, features: parsed.data.features || [] } });
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const product = await db.product.update({ where: { id }, data });
    return NextResponse.json({ product });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
