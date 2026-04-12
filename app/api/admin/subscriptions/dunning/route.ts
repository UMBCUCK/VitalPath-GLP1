import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { createEmailService } from "@/lib/services/email";
import { safeError, safeLog } from "@/lib/logger";

// POST /api/admin/subscriptions/dunning
// action: "retry" | "remind"
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const { subscriptionId, action, email, name } = await req.json();

    if (!subscriptionId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sub = await db.subscription.findUnique({
      where: { id: subscriptionId },
      select: { id: true, stripeSubscriptionId: true, status: true },
    });

    if (!sub) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (action === "retry") {
      // Attempt to pay the latest open invoice via Stripe
      if (!sub.stripeSubscriptionId) {
        return NextResponse.json({ error: "No Stripe subscription linked" }, { status: 400 });
      }

      try {
        const invoices = await stripe.invoices.list({
          subscription: sub.stripeSubscriptionId,
          status: "open",
          limit: 1,
        });

        if (invoices.data[0]) {
          await stripe.invoices.pay(invoices.data[0].id);

          // Update subscription status optimistically
          await db.subscription.update({
            where: { id: subscriptionId },
            data: { status: "ACTIVE" },
          });
        }
      } catch (stripeErr: any) {
        safeError("[Dunning] Stripe retry error", stripeErr);
        // Return a friendly error — Stripe may decline due to insufficient funds etc.
        return NextResponse.json({
          error: stripeErr?.message || "Payment retry failed — card may have been declined",
        }, { status: 402 });
      }

      await db.adminAuditLog.create({
        data: {
          userId: session.userId,
          action: "subscription.payment_retry",
          entity: "Subscription",
          entityId: subscriptionId,
        },
      });

      safeLog("[Dunning]", `Payment retry triggered for subscription ${subscriptionId}`);
      return NextResponse.json({ success: true, message: "Payment retry initiated" });
    }

    if (action === "remind") {
      // Send payment reminder email
      if (!email) {
        return NextResponse.json({ error: "Email is required for remind action" }, { status: 400 });
      }

      const emailService = createEmailService();
      await emailService.send({
        to: email,
        subject: "Action needed: update your payment method",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#ef4444;padding:40px 32px;border-radius:16px 16px 0 0;">
              <h1 style="color:#fff;font-size:22px;margin:0;">Payment issue — action required</h1>
            </div>
            <div style="background:#fff;border:1px solid #e8edf4;border-top:none;padding:32px;border-radius:0 0 16px 16px;">
              <p style="color:#677A8A;font-size:15px;line-height:1.6;">Hi ${name || "there"},</p>
              <p style="color:#677A8A;font-size:15px;line-height:1.6;">
                We were unable to process your most recent payment. To avoid any interruption to your care and medication delivery, please update your payment method as soon as possible.
              </p>
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px;margin:24px 0;">
                <p style="color:#dc2626;font-size:13px;font-weight:600;margin:0 0 4px;">⚠️ Your subscription is currently past due</p>
                <p style="color:#9BAAB5;font-size:12px;margin:0;">Updating your payment method takes less than 60 seconds</p>
              </div>
              <div style="text-align:center;margin:24px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://app.vitalpath.com"}/dashboard/settings"
                   style="background:#ef4444;color:#fff;padding:14px 32px;border-radius:99px;text-decoration:none;font-weight:600;display:inline-block;">
                  Update Payment Method
                </a>
              </div>
              <p style="color:#9BAAB5;font-size:12px;text-align:center;">
                Questions? Reply to this email or contact support.
              </p>
            </div>
          </div>
        `,
      });

      await db.adminAuditLog.create({
        data: {
          userId: session.userId,
          action: "subscription.payment_reminder",
          entity: "Subscription",
          entityId: subscriptionId,
          details: { sentTo: email },
        },
      });

      safeLog("[Dunning]", `Payment reminder sent to ${email}`);
      return NextResponse.json({ success: true, message: "Payment reminder sent" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    safeError("[Dunning] Error", err);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
