import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { safeError } from "@/lib/logger";

const recipeSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  prepMinutes: z.number().int().min(0).optional().nullable(),
  cookMinutes: z.number().int().min(0).optional().nullable(),
  servings: z.number().int().min(1).optional().nullable(),
  calories: z.number().int().min(0).optional().nullable(),
  proteinG: z.number().int().min(0).optional().nullable(),
  carbsG: z.number().int().min(0).optional().nullable(),
  fatG: z.number().int().min(0).optional().nullable(),
  fiberG: z.number().int().min(0).optional().nullable(),
  ingredients: z.unknown(),
  instructions: z.unknown(),
  tips: z.string().optional().nullable(),
  category: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "SMOOTHIE", "MEAL_PREP", "HIGH_PROTEIN", "LOW_EFFORT", "FAMILY"]),
  tags: z.unknown().optional().nullable(),
  difficulty: z.string().optional().nullable(),
  isGlp1Friendly: z.boolean().default(true),
  tierRequired: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
});

const recipeUpdateSchema = recipeSchema.partial();

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "25", 10)));
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const published = searchParams.get("published") || "";

    const where: Record<string, unknown> = {};
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }
    if (category) {
      where.category = category;
    }
    if (published === "true") {
      where.isPublished = true;
    } else if (published === "false") {
      where.isPublished = false;
    }

    const [recipes, total] = await Promise.all([
      db.recipe.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.recipe.count({ where }),
    ]);

    return NextResponse.json({ recipes, total, page, limit });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Recipes API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = recipeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }
    const recipe = await db.recipe.create({ data: parsed.data as any });
    return NextResponse.json({ recipe });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Recipes API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const parsed = recipeUpdateSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }
    const recipe = await db.recipe.update({ where: { id }, data: parsed.data as any });
    return NextResponse.json({ recipe });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Recipes API]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
