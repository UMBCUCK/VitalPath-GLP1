import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Public API endpoint to fetch active plans and add-ons.
 * Used by the checkout page and pricing section to get database-driven pricing.
 * Falls back to hardcoded data if database is unavailable.
 */
export async function GET() {
  try {
    const [plans, addOns] = await Promise.all([
      db.product.findMany({
        where: { isActive: true, isAddon: false, type: "MEMBERSHIP" },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          priceMonthly: true,
          priceQuarterly: true,
          priceAnnual: true,
          badge: true,
          features: true,
          stripePriceIdMonthly: true,
          stripePriceIdQuarterly: true,
          stripePriceIdAnnual: true,
        },
      }),
      db.product.findMany({
        where: { isActive: true, isAddon: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          priceMonthly: true,
          iconName: true,
          category: true,
        },
      }),
    ]);

    return NextResponse.json({
      plans,
      addOns,
      source: "database",
    });
  } catch {
    // Fallback: return empty arrays — checkout will use hardcoded lib/pricing.ts
    return NextResponse.json({
      plans: [],
      addOns: [],
      source: "fallback",
    });
  }
}
