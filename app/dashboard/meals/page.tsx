import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MealsClient } from "./meals-client";
export const dynamic = "force-dynamic";

export default async function MealsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const recipes = await db.recipe.findMany({
    where: { isPublished: true },
    orderBy: { category: "asc" },
  });

  return <MealsClient recipes={recipes} />;
}
