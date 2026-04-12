import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

// PUT /api/admin/meal-plans — toggle published status
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { id, isPublished } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Meal plan ID is required" }, { status: 400 });
    }

    const plan = await db.mealPlan.update({
      where: { id },
      data: { isPublished },
    });

    return NextResponse.json({ plan });
  } catch (err) {
    safeError("[Admin MealPlans] PUT failed", err);
    return NextResponse.json({ error: "Failed to update meal plan" }, { status: 500 });
  }
}

// POST /api/admin/meal-plans — create a new meal plan with items
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { title, weekNumber, year, mode, assignments } = body;

    if (!title || !weekNumber || !year) {
      return NextResponse.json({ error: "Title, week number, and year are required" }, { status: 400 });
    }

    const slug = `week-${weekNumber}-${year}-${mode}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    // Build meal plan items from assignments object: { "dayIdx-mealType": recipeId }
    const items: Array<{ dayOfWeek: number; mealType: string; sortOrder: number; recipeId: string }> = [];
    let sortOrder = 0;
    for (const [key, recipeId] of Object.entries(assignments as Record<string, string>)) {
      if (!recipeId) continue;
      const [dayStr, mealType] = key.split("-");
      items.push({
        dayOfWeek: parseInt(dayStr),
        mealType,
        sortOrder: sortOrder++,
        recipeId: recipeId as string,
      });
    }

    const plan = await db.mealPlan.create({
      data: {
        title,
        slug,
        weekNumber: Number(weekNumber),
        year: Number(year),
        mode,
        isPublished: false,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          include: {
            recipe: {
              select: { id: true, title: true, category: true, calories: true, proteinG: true },
            },
          },
          orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
        },
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (err: any) {
    safeError("[Admin MealPlans] POST failed", err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "A meal plan with that week/year/mode already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create meal plan" }, { status: 500 });
  }
}

// DELETE /api/admin/meal-plans?id=... — delete a meal plan
export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Meal plan ID is required" }, { status: 400 });
    }

    // Items cascade via Prisma relation
    await db.mealPlan.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    safeError("[Admin MealPlans] DELETE failed", err);
    return NextResponse.json({ error: "Failed to delete meal plan" }, { status: 500 });
  }
}
