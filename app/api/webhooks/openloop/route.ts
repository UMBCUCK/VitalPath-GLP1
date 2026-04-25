import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createEmailService } from "@/lib/services/email";
import { safeError, safeLog } from "@/lib/logger";
import crypto from "crypto";

/**
 * OpenLoop Health Webhook Receiver
 *
 * Receives order and consultation status updates from OpenLoop.
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

// ─── Webhook signature verification (HMAC-SHA256) ─────────────

function verifyWebhookSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  // Ensure both buffers are the same length for timingSafeEqual
  const sigBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (sigBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}

// ─── Helper: log webhook event to DB ──────────────────────────

async function logWebhookEvent(
  eventId: string,
  eventType: string,
  success: boolean,
  payload: unknown,
  errorMessage?: string
) {
  try {
    await db.webhookEvent.create({
      data: {
        id: eventId,
        type: `openloop.${eventType}`,
        success,
        errorMessage: errorMessage || null,
        payload: payload as never,
      },
    });
  } catch (err) {
    safeError("[OpenLoop Webhook]", `Failed to log webhook event: ${err}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.TELEHEALTH_WEBHOOK_SECRET;

    // Verify signature — always enforced when secret is configured
    if (webhookSecret) {
      const signature = req.headers.get("x-openloop-signature");
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        safeError("[OpenLoop Webhook]", "Invalid webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
    const event = body.event as string;

    safeLog("[OpenLoop Webhook]", `Received: ${event}`);

    // Generate a deterministic event ID for idempotency
    const webhookEventId = `ol_${body.timestamp || Date.now()}_${event}_${crypto.randomBytes(4).toString("hex")}`;

    try {
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

            // Update ConsultationTracker if linked to this user
            await db.consultationTracker.updateMany({
              where: { userId: order.userId, status: "COMPLETED" },
              data: { notes: `Order ${data.orderId} confirmed` },
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

            if (order.user) {
              const emailService = createEmailService();
              await emailService.send({
                to: order.user.email,
                subject: "Your Nature's Journey medication has shipped",
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

          // Match by telehealthReferralId (the OpenLoop patientId stored during intake)
          const intake = await db.intakeSubmission.findFirst({
            where: {
              telehealthReferralId: data.patientId,
              status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
            },
            include: { user: true },
          });

          if (!intake) {
            safeLog("[OpenLoop Webhook]", `No matching intake for patientId: ${data.patientId}`);
            break;
          }

          const statusMap = {
            approved: "APPROVED" as const,
            denied: "DENIED" as const,
            needs_info: "NEEDS_INFO" as const,
          };

          await db.intakeSubmission.update({
            where: { id: intake.id },
            data: {
              status: statusMap[data.decision] || "NEEDS_INFO",
              telehealthConsultationId: data.consultationId,
              reviewedAt: new Date(),
            },
          });

          // Update or create treatment plan with provider info if approved
          if (data.decision === "approved") {
            const existingPlan = await db.treatmentPlan.findFirst({
              where: { userId: intake.userId, status: { in: ["PENDING", "ACTIVE"] } },
            });

            if (existingPlan) {
              await db.treatmentPlan.update({
                where: { id: existingPlan.id },
                data: {
                  providerName: data.providerName,
                  providerVendor: "openloop",
                  providerRefId: data.consultationId,
                  status: "ACTIVE",
                },
              });
            } else {
              await db.treatmentPlan.create({
                data: {
                  userId: intake.userId,
                  providerName: data.providerName,
                  providerVendor: "openloop",
                  providerRefId: data.consultationId,
                  status: "ACTIVE",
                },
              });
            }
          }

          // Create or update ConsultationTracker record
          const eligibilityMap: Record<string, string> = {
            approved: "ELIGIBLE",
            denied: "NOT_ELIGIBLE",
            needs_info: "PENDING",
          };

          const existingTracker = await db.consultationTracker.findFirst({
            where: {
              OR: [
                { consultationId: data.consultationId },
                { userId: intake.userId, openloopPatientId: data.patientId },
              ],
            },
          });

          if (existingTracker) {
            await db.consultationTracker.update({
              where: { id: existingTracker.id },
              data: {
                status: "COMPLETED",
                completedAt: new Date(),
                providerName: data.providerName || existingTracker.providerName,
                eligibilityResult: eligibilityMap[data.decision] || "PENDING",
                prescriptionId: data.prescriptionId || existingTracker.prescriptionId,
                notes: data.notes || existingTracker.notes,
                lastSyncAt: new Date(),
              },
            });
          } else {
            await db.consultationTracker.create({
              data: {
                userId: intake.userId,
                intakeId: intake.id,
                openloopPatientId: data.patientId,
                consultationId: data.consultationId,
                status: "COMPLETED",
                completedAt: new Date(),
                providerName: data.providerName,
                eligibilityResult: eligibilityMap[data.decision] || "PENDING",
                prescriptionId: data.prescriptionId,
                notes: data.notes,
                lastSyncAt: new Date(),
              },
            });
          }

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

          // Send email notification
          if (intake.user) {
            const emailService = createEmailService();
            await emailService.send({
              to: intake.user.email,
              subject: msg.title,
              html: `<p>Hi ${intake.user.firstName || "there"},</p>
                <p>${msg.body}</p>
                <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/treatment">View your treatment plan</a></p>`,
            });
          }
          break;
        }

        // Tier 12.1 — Provider-side message arrives from OpenLoop. Mirror
        // it into our local Message inbox so the patient sees it on
        // /dashboard/messages without a refresh delay.
        case "message.received": {
          const data = (body as unknown as { data: {
            patientId: string;
            providerName?: string;
            body: string;
            sentAt?: string;
          } }).data;

          const profile = await db.patientProfile.findFirst({
            where: { telehealthPatientId: data.patientId },
            select: { userId: true, user: { select: { email: true, firstName: true } } },
          });
          if (profile?.userId) {
            await db.message.create({
              data: {
                userId: profile.userId,
                direction: "INBOUND",
                channel: "APP",
                body: data.body,
                createdAt: data.sentAt ? new Date(data.sentAt) : undefined,
                metadata: { senderName: data.providerName ?? "Care team" },
              },
            });
            await db.notification.create({
              data: {
                userId: profile.userId,
                type: "PROVIDER_MESSAGE",
                title: `New message from ${data.providerName ?? "your care team"}`,
                body: data.body.slice(0, 160),
                link: "/dashboard/messages",
              },
            });
          }
          break;
        }

        // Tier 12.1 — Provider-flagged adverse event mirrors into our
        // AdverseEventReport ledger and notifies admins for review.
        case "adverse_event.flagged": {
          const data = (body as unknown as { data: {
            patientId: string;
            severity: string;
            description: string;
            medicationName?: string;
          } }).data;

          const profile = await db.patientProfile.findFirst({
            where: { telehealthPatientId: data.patientId },
            select: { userId: true },
          });
          if (profile?.userId) {
            await db.adverseEventReport.create({
              data: {
                userId: profile.userId,
                severity: data.severity || "MILD",
                description: data.description,
                medicationName: data.medicationName,
              },
            });

            // Page admins so a human triages high-severity events fast
            const admins = await db.user.findMany({
              where: { role: "ADMIN" },
              select: { id: true },
              take: 5,
            });
            for (const a of admins) {
              await db.notification.create({
                data: {
                  userId: a.id,
                  type: "SYSTEM",
                  title: `Adverse event flagged · ${data.severity}`,
                  body: data.description.slice(0, 160),
                  link: "/admin/adverse-events",
                },
              });
            }
          }
          break;
        }

        default:
          safeLog("[OpenLoop Webhook]", `Unhandled event: ${event}`);
      }

      // Log successful webhook event
      await logWebhookEvent(webhookEventId, event, true, body);

      return NextResponse.json({ received: true });
    } catch (processingError) {
      // Log failed webhook event with error details
      const errorMsg = processingError instanceof Error ? processingError.message : "Unknown processing error";
      await logWebhookEvent(webhookEventId, event, false, body, errorMsg);
      throw processingError;
    }
  } catch (error) {
    safeError("[OpenLoop Webhook]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
