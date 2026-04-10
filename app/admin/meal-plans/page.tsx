import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MealPlansClient } from "./meal-plans-client";

export default async function MealPlansPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [mealPlans, recipes, totalMealPlans] = await Promise.all([
    db.mealPlan.findMany({
      orderBy: [{ year: "desc" }, { weekNumber: "desc" }],
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
    }),
    db.recipe.findMany({
      where: { isPublished: true },
      orderBy: { category: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        calories: true,
        proteinG: true,
        prepMinutes: true,
      },
    }),
    db.mealPlan.count(),
  ]);

  return (
    <MealPlansClient
      initialMealPlans={JSON.parse(JSON.stringify(mealPlans))}
      recipes={JSON.parse(JSON.stringify(recipes))}
      total={totalMealPlans}
    />
  );
}
