export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPricingRules, getPricingAnalytics } from "@/lib/admin-pricing-engine";
import { db } from "@/lib/db";
import { PricingClient } from "./pricing-client";

export default async function PricingPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [rulesData, analytics, products] = await Promise.all([
    getPricingRules(1, 50),
    getPricingAnalytics(),
    db.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, priceMonthly: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <PricingClient
      initialRules={JSON.parse(JSON.stringify(rulesData.rules))}
      initialTotal={rulesData.total}
      initialAnalytics={JSON.parse(JSON.stringify(analytics))}
      products={JSON.parse(JSON.stringify(products))}
    />
  );
}
