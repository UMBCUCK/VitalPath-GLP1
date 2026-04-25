import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { trackServerEvent } from "@/lib/analytics";
import { safeError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planSlug, addOnSlugs = [], email, interval = "monthly", couponCode, referralCode } = body as {
      planSlug: string;
      addOnSlugs?: string[];
      email?: string;
      interval?: "monthly" | "quarterly" | "annual";
      couponCode?: string;
      referralCode?: string;
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
        // Use the matching interval price ID so add-ons bill on the same cycle as the plan
        const addonPriceId =
          interval === "annual"
            ? (addon.stripePriceIdAnnual ?? addon.stripePriceIdMonthly)
            : interval === "quarterly"
              ? (addon.stripePriceIdQuarterly ?? addon.stripePriceIdMonthly)
              : addon.stripePriceIdMonthly;
        if (addonPriceId) {
          lineItems.push({ price: addonPriceId, quantity: 1 });
        }
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

    // Build Stripe checkout session options.
    //
    // Tier 7.1 — Express wallet payments:
    //   • `card` is the primary method. Apple Pay and Google Pay ride on
    //     top of the card rail and surface automatically when the user's
    //     browser + device supports them (iOS Safari → Apple Pay;
    //     Chrome/Android → Google Pay). No extra config needed beyond
    //     having domains verified in Stripe Dashboard → Settings → Apple Pay.
    //   • `link` enables Stripe Link one-click checkout (auto-fills card
    //     for repeat Link users — big mobile-conversion win).
    //   • `cashapp` enables Cash App Pay (US-only, popular with 18–34 demo).
    //
    // We also turn on phone_number_collection so Stripe captures the best
    // contact number at payment time — feeds into Meta CAPI advanced
    // matching and our SMS lifecycle automations.
    const checkoutOptions: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: "subscription",
      payment_method_types: ["card", "link", "cashapp"],
      line_items: lineItems,
      customer_email: email || undefined,
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=true`,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      metadata: {
        planSlug: plan.slug,
        planName: plan.name,
        interval,
        addOns: addOnSlugs.join(","),
        ...(referralCode ? { referralCode } : {}),
        // Tier 9.4 — reseller click-attribution (first-touch, 60-day cookie
        // set by middleware when a visitor lands with ?rx=CODE). Stored on
        // the Stripe session so the webhook can credit the reseller at
        // conversion time, even if the cookie expired between click + buy.
        ...(req.cookies.get("nj-rx-attr")?.value
          ? { resellerAttr: req.cookies.get("nj-rx-attr")!.value }
          : {}),
      },
      subscription_data: {
        metadata: {
          planSlug: plan.slug,
          interval,
        },
      },
    };

    // Apply coupon if provided, otherwise allow Stripe promo codes
    if (couponCode) {
      checkoutOptions.discounts = [{ coupon: couponCode }];
    } else {
      checkoutOptions.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(checkoutOptions);

    // Tier 5.1 — Advanced matching: include phone, IP, UA for higher match rate.
    // Look up phone from user table or Lead table (email is the shared key).
    let userPhone: string | undefined;
    if (email) {
      const [user, lead] = await Promise.all([
        db.user.findUnique({ where: { email }, select: { phone: true } }),
        db.lead.findUnique({ where: { email }, select: { phone: true } }),
      ]);
      userPhone = user?.phone || lead?.phone || undefined;
    }

    await trackServerEvent(
      "InitiateCheckout",
      {
        email,
        phone: userPhone,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      },
      {
        plan_slug: planSlug,
        plan_name: plan.name,
        interval,
        value: plan.priceMonthly / 100,
        currency: "USD",
      },
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    safeError("[Stripe Checkout]", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
