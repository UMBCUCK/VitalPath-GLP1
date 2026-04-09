import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductsClient } from "./products-client";

export default async function ProductsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const products = await db.product.findMany({ orderBy: { sortOrder: "asc" } });
  return <ProductsClient initialProducts={products} />;
}
