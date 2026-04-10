import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { safeError, safeLog } from "@/lib/logger";

/**
 * Add an item (add-on) to an existing Stripe subscription.
 * Used by the upsell modal and dashboard upgrade flows.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { productSlug } = await req.json();

    if (!productSlug) {
      return NextResponse.json({ error: "Product slug required" }, { status: 400 });
    }

    // Find the add-on product
    const product = await db.product.findUnique({ where: { slug: productSlug } });
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "Product not found or inactive" }, { status: 404 });
    }

    if (!product.stripePriceIdMonthly) {
      return NextResponse.json({ error: "Product not configured in Stripe" }, { status: 400 });
    }

    // Find active subscription
    const subscription = await db.subscription.findFirst({
      where: { userId: session.userId, status: "ACTIVE" },
    });

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json({ error: "No active subscription" }, { status: 400 });
    }

    // Add the item to the Stripe subscription
    const stripeItem = await stripe.subscriptionItems.create({
      subscription: subscription.stripeSubscriptionId,
      price: product.stripePriceIdMonthly,
      quantity: 1,
      proration_behavior: "create_prorations",
    });

    // Track in local database
    await db.subscriptionItem.create({
      data: {
        subscriptionId: subscription.id,
        productId: product.id,
        quantity: 1,
        priceInCents: product.priceMonthly,
        stripeItemId: stripeItem.id,
      },
    });

    safeLog("[Add Item]", "Add-on added to subscription", {
      product: product.name,
      price: product.priceMonthly,
    });

    return NextResponse.json({
      ok: true,
      product: product.name,
      priceMonthly: product.priceMonthly,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Add Item API]", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
