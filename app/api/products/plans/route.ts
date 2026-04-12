import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";
import type { PricingPlan, AddOn } from "@/lib/pricing";

// Public endpoint — no auth required. Returns active plans + add-ons from DB.
export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    const plans: PricingPlan[] = products
      .filter((p) => p.type === "MEMBERSHIP" && !p.isAddon)
      .map((p) => ({
        id: p.slug,
        name: p.name,
        slug: p.slug,
        priceMonthly: p.priceMonthly,
        priceQuarterly: p.priceQuarterly ?? undefined,
        priceAnnual: p.priceAnnual ?? undefined,
        stripePriceId: p.stripePriceIdMonthly ?? "",
        badge: p.badge ?? undefined,
        description: p.description ?? "",
        features: normalizeFeatures(p.features),
        highlighted: p.isFeatured,
        imageUrl: p.imageUrl ?? undefined,
      }));

    const addOns: AddOn[] = products
      .filter((p) => p.isAddon && p.isActive)
      .map((p) => ({
        id: p.slug,
        name: p.name,
        slug: p.slug,
        priceMonthly: p.priceMonthly,
        description: p.description ?? "",
        iconName: p.iconName ?? "Package",
        category: p.category.toLowerCase().replace(/_/g, "-"),
      }));

    return NextResponse.json({ plans, addOns });
  } catch (error) {
    safeError("[Products Plans GET]", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

function normalizeFeatures(features: unknown): string[] {
  if (!Array.isArray(features)) return [];
  return features
    .map((f) => {
      if (typeof f === "string") return f;
      if (f && typeof f === "object" && "text" in f) return String((f as { text: string }).text);
      return String(f ?? "");
    })
    .filter(Boolean);
}
