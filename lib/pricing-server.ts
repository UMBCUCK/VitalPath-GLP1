/**
 * Server-only helpers for fetching plans from the database.
 * Do NOT import this in client components — it imports `db`.
 */
import { db } from "@/lib/db";
import { plans as fallbackPlans, addOns as fallbackAddOns } from "@/lib/pricing";
import type { PricingPlan, AddOn } from "@/lib/pricing";

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

export async function fetchDbPlans(): Promise<PricingPlan[]> {
  try {
    const products = await db.product.findMany({
      where: { isActive: true, type: "MEMBERSHIP" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (products.length === 0) return fallbackPlans;
    return products.map((p) => ({
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
    }));
  } catch {
    // DB unavailable — serve hardcoded fallback so the page still renders
    return fallbackPlans;
  }
}

export async function fetchDbAddOns(): Promise<AddOn[]> {
  try {
    const products = await db.product.findMany({
      where: { isActive: true, isAddon: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (products.length === 0) return fallbackAddOns;
    return products.map((p) => ({
      id: p.slug,
      name: p.name,
      slug: p.slug,
      priceMonthly: p.priceMonthly,
      description: p.description ?? "",
      iconName: p.iconName ?? "Package",
      category: p.category.toLowerCase().replace(/_/g, "-"),
    }));
  } catch {
    return fallbackAddOns;
  }
}
