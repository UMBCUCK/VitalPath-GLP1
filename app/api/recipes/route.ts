import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const published = url.searchParams.get("published") !== "false";

  const recipes = await db.recipe.findMany({
    where: {
      isPublished: published,
      ...(category ? { category: category as never } : {}),
    },
    orderBy: { category: "asc" },
  });

  return NextResponse.json({ recipes });
}
