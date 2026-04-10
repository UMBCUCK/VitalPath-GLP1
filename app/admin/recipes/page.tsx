import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { RecipesClient } from "./recipes-client";

export default async function AdminRecipesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = Math.min(100, Math.max(10, parseInt(params.limit || "25", 10)));
  const search = params.search || "";
  const category = params.category || "";
  const published = params.published || "";

  // Build where clause
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

  return (
    <RecipesClient
      initialRecipes={JSON.parse(JSON.stringify(recipes))}
      total={total}
      page={page}
      limit={limit}
      search={search}
      category={category}
      published={published}
    />
  );
}
