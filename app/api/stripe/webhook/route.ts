import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { createEmailService, emailTemplates } from "@/lib/services/email";
import { sendLifecycleEmail, welcomeSequence } from "@/lib/services/lifecycle-emails";
import { trackServerEvent } from "@/lib/analytics";
import Stripe from "stripe";
import { safeError, safeLog } from "@/lib/logger";

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
    safeError("[Stripe Webhook] Signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: check if we already processed this event
  try {
    const existing = await db.webhookEvent.findUnique({ where: { id: event.id } });
    if (existing) {
      safeLog("[Webhook]", `Duplicate event skipped: ${event.id}`);
      return NextResponse.json({ received: true, duplicate: true });
    }
    // Record event before processing
    await db.webhookEvent.create({
      data: { id: event.id, type: event.type, processedAt: new Date() },
    });
  } catch {
    // If webhookEvent table doesn't exist yet, continue without idempotency
    // This gracefully handles pre-migration deployments
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const planSlug = session.metadata?.planSlug;
        const interval = session.metadata?.interval || "monthly";
        const referralCode = session.metadata?.referralCode;

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

        // Resolve the product from the plan slug stored in checkout metadata
        const plan = planSlug
          ? await db.product.findUnique({ where: { slug: planSlug } })
          : null;

        // Create subscription record
        if (subscriptionId) {
          const stripeSub = await stripe.subscriptions.retrieve(subscriptionId) as unknown as Stripe.Subscription;

          const intervalMap: Record<string, "MONTHLY" | "QUARTERLY" | "ANNUAL"> = {
            monthly: "MONTHLY",
            quarterly: "QUARTERLY",
            annual: "ANNUAL",
          };

          await db.subscription.create({
            data: {
              userId: user.id,
              stripeSubscriptionId: subscriptionId,
              status: "ACTIVE",
              interval: intervalMap[interval] || "MONTHLY",
              currentPeriodStart: new Date(((stripeSub as any).current_period_start || 0) * 1000),
              currentPeriodEnd: new Date(((stripeSub as any).current_period_end || 0) * 1000),
              items: {
                create: stripeSub.items.data.map((item) => ({
                  productId: plan?.id || "unknown",
                  quantity: item.quantity || 1,
                  priceInCents: item.price.unit_amount || 0,
                })),
              },
            },
          });
        }

        // Convert referral if a referral code was used at checkout
        if (referralCode) {
          try {
            const refCodeRecord = await db.referralCode.findUnique({ where: { code: referralCode } });
            if (refCodeRecord && refCodeRecord.userId !== user.id) {
              // Get payout amount from settings or code override
              const settings = await db.referralSetting.findFirst({ where: { isActive: true } });
              const payoutCents = refCodeRecord.payoutCents ?? settings?.defaultPayoutCents ?? 5000;

              // Find an existing pending invite for this email, or create a new conversion record
              const existingReferral = await db.referral.findFirst({
                where: { referralCodeId: refCodeRecord.id, referredEmail: email, status: "PENDING" },
              });

              if (existingReferral) {
                await db.referral.update({
                  where: { id: existingReferral.id },
                  data: { status: "CONVERTED", referredId: user.id, payoutCents },
                });
              } else {
                await db.referral.create({
                  data: {
                    referralCodeId: refCodeRecord.id,
                    referrerId: refCodeRecord.userId,
                    referredId: user.id,
                    referredEmail: email,
                    status: "CONVERTED",
                    payoutCents,
                  },
                });
              }

              // Increment referral code stats
              await db.referralCode.update({
                where: { id: refCodeRecord.id },
                data: {
                  totalReferred: { increment: 1 },
                  totalEarned: { increment: payoutCents },
                },
              });

              // Notify referrer (in-app)
              await db.notification.create({
                data: {
                  userId: refCodeRecord.userId,
                  type: "OFFER",
                  title: "Referral converted!",
                  body: `Someone you referred just signed up. You earned $${(payoutCents / 100).toFixed(2)} in referral credit.`,
                  link: "/dashboard/referrals",
                },
              });

              // Email referrer
              try {
                const referrer = await db.user.findUnique({
                  where: { id: refCodeRecord.userId },
                  select: { email: true, firstName: true },
                });
                if (referrer) {
                  const updatedCode = await db.referralCode.findUnique({
                    where: { id: refCodeRecord.id },
                    select: { totalEarned: true },
                  });
                  const emailService = createEmailService();
                  const template = emailTemplates.referralConverted(
                    referrer.firstName || "there",
                    email,
                    payoutCents,
                    updatedCode?.totalEarned || payoutCents
                  );
                  await emailService.send({ to: referrer.email, ...template });
                }
              } catch (emailErr) {
                safeError("[Webhook] Referrer notification email failed", emailErr);
              }
            }
          } catch (refErr) {
            safeError("[Webhook] Referral conversion error", refErr);
            // Non-fatal — don't block the rest of checkout processing
          }
        }

        // Send welcome email + queue lifecycle sequence
        const emailService = createEmailService();
        const template = emailTemplates.welcome(user.firstName || "there");
        await emailService.send({ to: email, ...template });

        // Fire day-0 lifecycle welcome email with onboarding tips
        try {
          const day0 = welcomeSequence.day0(user.firstName || "there");
          await sendLifecycleEmail(email, day0, ["welcome", "day0"]);
        } catch (lifecycleErr) {
          safeError("[Webhook] Lifecycle welcome email failed", lifecycleErr);
        }

        // Meta CAPI: Purchase event for ROAS optimization
        try {
          const userAgent = req.headers.get("user-agent") || undefined;
          const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || undefined;
          await trackServerEvent("Purchase", {
            email,
            userAgent,
            ip,
          }, {
            currency: "USD",
            value: (session.amount_total || 0) / 100,
            content_name: planSlug || "subscription",
            content_type: "product",
            order_id: session.id,
          });
        } catch (metaErr) {
          safeError("[Webhook] Meta CAPI Purchase event failed", metaErr);
        }

        safeLog("[Webhook]", "Checkout completed and persisted");
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
        safeLog("[Webhook]", "Subscription updated");
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
        safeLog("[Webhook]", "Subscription canceled");
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
        safeLog("[Webhook]", "Payment succeeded");
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
        safeLog("[Webhook]", "Payment failed");
        break;
      }

      default:
        safeLog("[Webhook]", `Unhandled event: ${event.type}`);
    }
  } catch (err) {
    safeError("[Webhook] Handler error", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
