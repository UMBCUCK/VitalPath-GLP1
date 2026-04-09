import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MealPlanClient } from "./meal-plan-client";

export default async function MealPlansPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const recipes = await db.recipe.findMany({
    where: { isPublished: true },
    orderBy: { category: "asc" },
    select: { id: true, title: true, slug: true, category: true, calories: true, proteinG: true, prepMinutes: true },
  });

  const mealPlans = await db.mealPlan.findMany({
    orderBy: [{ year: "desc" }, { weekNumber: "desc" }],
    take: 10,
    include: {
      items: { include: { recipe: { select: { title: true, category: true } } } },
    },
  });

  return <MealPlanClient recipes={recipes} mealPlans={mealPlans} />;
}
