import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { safeError } from "@/lib/logger";

/**
 * Creates a Stripe Billing Portal session for self-service management.
 * Customers can: update payment method, view invoices, cancel subscription.
 */
export async function POST() {
  try {
    const session = await requireAuth();

    const profile = await db.patientProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing account found" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${appUrl}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Billing Portal]", error);
    return NextResponse.json({ error: "Failed to create billing portal session" }, { status: 500 });
  }
}
