import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { trackServerEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planSlug, addOnSlugs = [], email, interval = "monthly" } = body as {
      planSlug: string;
      addOnSlugs?: string[];
      email?: string;
      interval?: "monthly" | "quarterly" | "annual";
    };

    // Fetch plan from database
    const plan = await db.product.findUnique({ where: { slug: planSlug } });
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Determine correct price ID based on interval
    const priceId = interval === "annual"
      ? plan.stripePriceIdAnnual
      : interval === "quarterly"
        ? plan.stripePriceIdQuarterly
        : plan.stripePriceIdMonthly;

    if (!priceId) {
      return NextResponse.json({ error: "Price not configured for this interval" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment processing is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const lineItems: Array<{ price: string; quantity: number }> = [
      { price: priceId, quantity: 1 },
    ];

    // Fetch and add selected add-ons from database
    if (addOnSlugs.length > 0) {
      const addOns = await db.product.findMany({
        where: { slug: { in: addOnSlugs }, isAddon: true, isActive: true },
      });
      for (const addon of addOns) {
        const addonPriceId = addon.stripePriceIdMonthly;
        if (addonPriceId) {
          lineItems.push({ price: addonPriceId, quantity: 1 });
        }
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      allow_promotion_codes: true,
      customer_email: email || undefined,
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      metadata: {
        planSlug: plan.slug,
        planName: plan.name,
        interval,
        addOns: addOnSlugs.join(","),
      },
    });

    await trackServerEvent("InitiateCheckout", { email }, {
      plan_slug: planSlug,
      plan_name: plan.name,
      interval,
      value: plan.priceMonthly / 100,
      currency: "USD",
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Checkout]", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
