import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { createEmailService } from "@/lib/services/email";
import { safeError, safeLog } from "@/lib/logger";

// POST /api/admin/subscriptions/outreach
// action: "email" | "coupon"
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const { subscriptionId, action, userId, email, name } = await req.json();

    if (!subscriptionId || !action || !userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailService = createEmailService();

    if (action === "email") {
      // Send a retention/re-engagement email
      await emailService.send({
        to: email,
        subject: "We noticed you might need some support",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#0D2B45 0%,#2ab5a5 100%);padding:40px 32px;border-radius:16px 16px 0 0;">
              <h1 style="color:#fff;font-size:24px;margin:0;">We're here for you, ${name || "there"}</h1>
            </div>
            <div style="background:#fff;border:1px solid #e8edf4;border-top:none;padding:32px;border-radius:0 0 16px 16px;">
              <p style="color:#677A8A;font-size:15px;line-height:1.6;">
                We noticed you haven't logged in recently and wanted to check in. Your health journey matters, and we're here to support you every step of the way.
              </p>
              <p style="color:#677A8A;font-size:15px;line-height:1.6;">
                If you've been experiencing any challenges or have questions about your treatment, your care team is ready to help.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://app.vitalpath.com"}/dashboard"
                   style="background:#2ab5a5;color:#fff;padding:14px 32px;border-radius:99px;text-decoration:none;font-weight:600;display:inline-block;">
                  Return to Your Dashboard
                </a>
              </div>
              <p style="color:#9BAAB5;font-size:13px;text-align:center;">
                Questions? Reply to this email or message your provider directly in the app.
              </p>
            </div>
          </div>
        `,
      });

      // Log action
      await db.adminAuditLog.create({
        data: {
          userId: session.userId,
          action: "subscription.retention_email",
          entity: "Subscription",
          entityId: subscriptionId,
          details: { sentTo: email },
        },
      });

      safeLog("[Subscriptions Outreach]", `Retention email sent to ${email}`);
      return NextResponse.json({ success: true, message: "Retention email sent" });
    }

    if (action === "coupon") {
      // Create a one-time 20% save offer coupon for this user
      const code = `SAVE20-${userId.slice(-6).toUpperCase()}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7-day expiry

      // Upsert so we don't duplicate if clicked twice
      await db.coupon.upsert({
        where: { code },
        update: { expiresAt, isActive: true },
        create: {
          code,
          type: "PERCENTAGE",
          valuePct: 20,
          maxUses: 1,
          expiresAt,
          firstMonthOnly: true,
          isActive: true,
        },
      });

      // Send the coupon via email
      await emailService.send({
        to: email,
        subject: "A special offer, just for you — 20% off your next month",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#0D2B45 0%,#2ab5a5 100%);padding:40px 32px;border-radius:16px 16px 0 0;">
              <h1 style="color:#fff;font-size:24px;margin:0;">A gift from your care team 🎁</h1>
            </div>
            <div style="background:#fff;border:1px solid #e8edf4;border-top:none;padding:32px;border-radius:0 0 16px 16px;">
              <p style="color:#677A8A;font-size:15px;line-height:1.6;">Hi ${name || "there"},</p>
              <p style="color:#677A8A;font-size:15px;line-height:1.6;">
                We want to make sure you get the most out of your weight loss program. As a thank you for your commitment, here's a special 20% discount on your next month:
              </p>
              <div style="background:#f0faf9;border:2px dashed #2ab5a5;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                <p style="color:#677A8A;font-size:12px;margin:0 0 8px;">Your exclusive code</p>
                <p style="color:#0D2B45;font-size:28px;font-weight:700;font-family:monospace;margin:0;">${code}</p>
                <p style="color:#9BAAB5;font-size:11px;margin:8px 0 0;">Valid for 7 days · One use only · Applied to next month</p>
              </div>
              <div style="text-align:center;margin:24px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://app.vitalpath.com"}/dashboard/settings"
                   style="background:#2ab5a5;color:#fff;padding:14px 32px;border-radius:99px;text-decoration:none;font-weight:600;display:inline-block;">
                  Apply My Discount
                </a>
              </div>
            </div>
          </div>
        `,
      });

      await db.adminAuditLog.create({
        data: {
          userId: session.userId,
          action: "subscription.save_coupon_sent",
          entity: "Subscription",
          entityId: subscriptionId,
          details: { couponCode: code, sentTo: email },
        },
      });

      safeLog("[Subscriptions Outreach]", `Save coupon ${code} sent to ${email}`);
      return NextResponse.json({ success: true, message: "Save offer coupon sent", code });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    safeError("[Subscriptions Outreach] Error", err);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
