import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

/**
 * GET /api/dashboard/shop
 * Returns marketplace products + patient eligibility status.
 * Products only shown to subscribed, doctor-approved patients.
 */
export async function GET() {
  try {
    const session = await requireAuth();

    // Parallel: check eligibility + fetch products + get active add-ons
    const [intake, subscription, products] = await Promise.all([
      db.intakeSubmission.findFirst({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        select: { status: true },
      }),
      db.subscription.findFirst({
        where: { userId: session.userId, status: "ACTIVE" },
        include: { items: { select: { productId: true, product: { select: { slug: true } } } } },
      }),
      db.product.findMany({
        where: { isMarketplace: true, isActive: true },
        orderBy: [{ isFeatured: "desc" }, { marketplaceOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          marketplaceDesc: true,
          priceMonthly: true,
          type: true,
          category: true,
          badge: true,
          features: true,
          iconName: true,
          imageUrl: true,
          isFeatured: true,
          stripePriceIdMonthly: true,
        },
      }),
    ]);

    // Gate check: must be approved + subscribed
    const isApproved = intake?.status === "APPROVED";
    const isSubscribed = !!subscription;

    if (!isApproved || !isSubscribed) {
      return NextResponse.json({
        eligible: false,
        reason: !isSubscribed ? "no_subscription" : "not_approved",
        products: [],
        activeProductSlugs: [],
      });
    }

    // Get slugs of products patient already has
    const activeProductSlugs = subscription.items.map((item) => item.product.slug);

    return NextResponse.json({
      eligible: true,
      products,
      activeProductSlugs,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Shop API]", error);
    return NextResponse.json({ error: "Failed to load shop" }, { status: 500 });
  }
}
