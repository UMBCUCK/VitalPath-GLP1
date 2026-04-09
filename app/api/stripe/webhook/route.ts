import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { createEmailService, emailTemplates } from "@/lib/services/email";
import Stripe from "stripe";

const statusMap: Record<string, "ACTIVE" | "PAUSED" | "PAST_DUE" | "CANCELED" | "EXPIRED" | "TRIALING"> = {
  active: "ACTIVE",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  unpaid: "PAST_DUE",
  trialing: "TRIALING",
  paused: "PAUSED",
  incomplete: "PAST_DUE",
  incomplete_expired: "EXPIRED",
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const planId = session.metadata?.planId;

        if (!email) break;

        // Find or create user
        let user = await db.user.findUnique({ where: { email } });
        if (!user) {
          user = await db.user.create({
            data: { email, role: "PATIENT" },
          });
        }

        // Link Stripe customer
        await db.patientProfile.upsert({
          where: { userId: user.id },
          update: { stripeCustomerId: customerId },
          create: { userId: user.id, stripeCustomerId: customerId },
        });

        // Create subscription record
        if (subscriptionId) {
          const stripeSub = await stripe.subscriptions.retrieve(subscriptionId) as unknown as Stripe.Subscription;

          await db.subscription.create({
            data: {
              userId: user.id,
              stripeSubscriptionId: subscriptionId,
              status: "ACTIVE",
              interval: "MONTHLY",
              currentPeriodStart: new Date(((stripeSub as any).current_period_start || 0) * 1000),
              currentPeriodEnd: new Date(((stripeSub as any).current_period_end || 0) * 1000),
              items: {
                create: stripeSub.items.data.map((item) => {
                  const product = planId
                    ? undefined // will link by slug later
                    : undefined;
                  return {
                    productId: product || "unknown",
                    quantity: item.quantity || 1,
                    priceInCents: item.price.unit_amount || 0,
                  };
                }),
              },
            },
          });
        }

        // Send welcome email
        const emailService = createEmailService();
        const template = emailTemplates.welcome(user.firstName || "there");
        await emailService.send({ to: email, ...template });

        console.log("[Webhook] Checkout completed and persisted:", session.id);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription & {
          current_period_start: number;
          current_period_end: number;
        };
        const dbSub = await db.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSub) {
          await db.subscription.update({
            where: { id: dbSub.id },
            data: {
              status: statusMap[subscription.status] || "ACTIVE",
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
              canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
            },
          });
        }
        console.log("[Webhook] Subscription updated:", subscription.id, subscription.status);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const dbSub = await db.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (dbSub) {
          await db.subscription.update({
            where: { id: dbSub.id },
            data: {
              status: "CANCELED",
              canceledAt: new Date(),
            },
          });

          // Create notification for reactivation campaign
          await db.notification.create({
            data: {
              userId: dbSub.userId,
              type: "SYSTEM",
              title: "Subscription canceled",
              body: "Your subscription has been canceled. You can reactivate anytime from your dashboard.",
              link: "/dashboard/settings",
            },
          });
        }
        console.log("[Webhook] Subscription canceled:", subscription.id);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & {
          payment_intent: string | null;
          tax: number | null;
        };
        const customerId = invoice.customer as string;

        const profile = await db.patientProfile.findUnique({
          where: { stripeCustomerId: customerId },
          include: { user: true },
        });

        if (profile) {
          await db.order.create({
            data: {
              userId: profile.userId,
              stripePaymentId: invoice.payment_intent || undefined,
              status: "PROCESSING",
              totalCents: invoice.amount_paid,
              subtotalCents: invoice.subtotal,
              taxCents: invoice.tax || 0,
            },
          });
        }
        console.log("[Webhook] Payment succeeded:", invoice.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const profile = await db.patientProfile.findUnique({
          where: { stripeCustomerId: customerId },
          include: { user: true },
        });

        if (profile) {
          // Update subscription status
          await db.subscription.updateMany({
            where: { userId: profile.userId, status: "ACTIVE" },
            data: { status: "PAST_DUE" },
          });

          // Notify user
          await db.notification.create({
            data: {
              userId: profile.userId,
              type: "SYSTEM",
              title: "Payment failed",
              body: "Your recent payment could not be processed. Please update your payment method to avoid service interruption.",
              link: "/dashboard/settings",
            },
          });

          // Send email notification
          const emailService = createEmailService();
          await emailService.send({
            to: profile.user.email,
            subject: "Action needed: payment issue",
            html: `<p>Hi ${profile.user.firstName || "there"},</p><p>Your recent payment could not be processed. Please update your payment method in your dashboard to avoid any interruption to your care.</p>`,
          });
        }
        console.log("[Webhook] Payment failed:", invoice.id);
        break;
      }

      default:
        console.log("[Webhook] Unhandled event:", event.type);
    }
  } catch (err) {
    console.error("[Webhook] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
