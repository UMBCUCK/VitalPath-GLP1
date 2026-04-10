import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createEmailService } from "@/lib/services/email";
import { safeError, safeLog } from "@/lib/logger";

/**
 * OpenLoop Health Webhook Receiver
 *
 * Receives order status updates from OpenLoop's pharmacy fulfillment system.
 * Statuses: confirmed → processing → shipped → delivered
 *
 * Configure in OpenLoop dashboard:
 *   Webhook URL: https://your-domain.com/api/webhooks/openloop
 *   Events: order.confirmed, order.shipped, order.delivered, consultation.completed
 */

interface OpenLoopOrderWebhook {
  event: string;
  data: {
    orderId: string;
    patientId: string;
    status: string;
    medication?: string;
    pharmacy?: string;
    trackingNumber?: string;
    shippedDate?: string;
    deliveredDate?: string;
    estimatedDelivery?: string;
  };
  timestamp: string;
}

interface OpenLoopConsultationWebhook {
  event: string;
  data: {
    consultationId: string;
    patientId: string;
    decision: "approved" | "denied" | "needs_info";
    providerName?: string;
    prescriptionId?: string;
    notes?: string;
  };
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event as string;

    // TODO: Verify webhook signature when OpenLoop provides signing secret
    // const signature = req.headers.get("x-openloop-signature");

    safeLog("[OpenLoop Webhook]", `Received: ${event}`);

    switch (event) {
      case "order.confirmed": {
        const { data } = body as OpenLoopOrderWebhook;

        const order = await db.order.findFirst({
          where: { pharmacyOrderId: data.orderId },
          include: { user: true },
        });

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: {
              status: "PROCESSING",
              pharmacyVendor: data.pharmacy,
            },
          });

          await db.notification.create({
            data: {
              userId: order.userId,
              type: "SHIPMENT_UPDATE",
              title: "Order confirmed",
              body: "Your medication order has been confirmed and is being prepared.",
              link: "/dashboard/treatment",
            },
          });
        }
        break;
      }

      case "order.shipped": {
        const { data } = body as OpenLoopOrderWebhook;

        const order = await db.order.findFirst({
          where: { pharmacyOrderId: data.orderId },
          include: { user: true },
        });

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: {
              status: "SHIPPED",
              trackingNumber: data.trackingNumber,
              shippedAt: data.shippedDate ? new Date(data.shippedDate) : new Date(),
            },
          });

          await db.notification.create({
            data: {
              userId: order.userId,
              type: "SHIPMENT_UPDATE",
              title: "Medication shipped!",
              body: data.trackingNumber
                ? `Your medication is on its way! Tracking: ${data.trackingNumber}`
                : "Your medication has shipped and is on its way to you.",
              link: "/dashboard/treatment",
            },
          });

          // Send shipping notification email
          if (order.user) {
            const emailService = createEmailService();
            await emailService.send({
              to: order.user.email,
              subject: "Your VitalPath medication has shipped",
              html: `<p>Hi ${order.user.firstName || "there"},</p>
                <p>Great news! Your medication has been shipped.</p>
                ${data.trackingNumber ? `<p><strong>Tracking:</strong> ${data.trackingNumber}</p>` : ""}
                ${data.estimatedDelivery ? `<p><strong>Estimated delivery:</strong> ${data.estimatedDelivery}</p>` : ""}
                <p>You can track your order in your <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/treatment">dashboard</a>.</p>`,
            });
          }
        }
        break;
      }

      case "order.delivered": {
        const { data } = body as OpenLoopOrderWebhook;

        const order = await db.order.findFirst({
          where: { pharmacyOrderId: data.orderId },
          include: { user: true },
        });

        if (order) {
          await db.order.update({
            where: { id: order.id },
            data: {
              status: "DELIVERED",
              deliveredAt: data.deliveredDate ? new Date(data.deliveredDate) : new Date(),
            },
          });

          await db.notification.create({
            data: {
              userId: order.userId,
              type: "SHIPMENT_UPDATE",
              title: "Medication delivered",
              body: "Your medication has been delivered. Check your dashboard for first-dose guidance.",
              link: "/dashboard/treatment",
            },
          });
        }
        break;
      }

      case "consultation.completed": {
        const { data } = body as OpenLoopConsultationWebhook;

        // Find the patient's most recent pending intake
        // In production, store OpenLoop patientId in the intake metadata
        const intake = await db.intakeSubmission.findFirst({
          where: { status: "UNDER_REVIEW" },
          orderBy: { createdAt: "desc" },
          include: { user: true },
        });

        if (intake) {
          await db.intakeSubmission.update({
            where: { id: intake.id },
            data: {
              status: data.decision === "approved" ? "APPROVED"
                : data.decision === "denied" ? "DENIED"
                : "NEEDS_INFO",
            },
          });

          const messages: Record<string, { title: string; body: string }> = {
            approved: {
              title: "Treatment approved!",
              body: "Your provider has approved your treatment plan. Medication will ship within 24-48 hours.",
            },
            denied: {
              title: "Treatment update",
              body: "Your provider has reviewed your profile. Please check your dashboard for details and alternative options.",
            },
            needs_info: {
              title: "Additional information needed",
              body: "Your provider needs more information to complete your evaluation. Please check your messages.",
            },
          };

          const msg = messages[data.decision] || messages.needs_info;
          await db.notification.create({
            data: {
              userId: intake.userId,
              type: "PROVIDER_MESSAGE",
              title: msg.title,
              body: msg.body,
              link: "/dashboard/treatment",
            },
          });
        }
        break;
      }

      default:
        safeLog("[OpenLoop Webhook]", `Unhandled event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    safeError("[OpenLoop Webhook]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
