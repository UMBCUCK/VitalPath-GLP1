import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Server-Sent Events stream for admin real-time activity.
 * Polls AdminAuditLog, Notification count, and AdminAlert count
 * every 5 seconds, sending updates as SSE events.
 */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const encoder = new TextEncoder();
  let lastCheckAt = new Date();
  let isActive = true;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "connected", data: { timestamp: new Date().toISOString() } })}\n\n`
        )
      );

      const sendEvent = (type: string, data: unknown) => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type, data })}\n\n`)
          );
        } catch {
          // Stream may have been closed
          isActive = false;
        }
      };

      // Poll interval: 5 seconds for activity, 30 seconds for keep-alive
      let tickCount = 0;

      const poll = async () => {
        while (isActive) {
          try {
            tickCount++;

            // Every 5 seconds: check for new activity
            const now = new Date();

            const [recentAuditLogs, notificationCount, alertCount] =
              await Promise.all([
                db.adminAuditLog.findMany({
                  where: { createdAt: { gt: lastCheckAt } },
                  orderBy: { createdAt: "desc" },
                  take: 10,
                  include: {
                    user: {
                      select: { firstName: true, lastName: true, email: true },
                    },
                  },
                }),
                db.notification.count({ where: { isRead: false } }),
                db.adminAlert.count({
                  where: { isDismissed: false },
                }),
              ]);

            lastCheckAt = now;

            if (recentAuditLogs.length > 0) {
              sendEvent("activity", {
                logs: recentAuditLogs.map((log) => ({
                  id: log.id,
                  action: log.action,
                  entity: log.entity,
                  entityId: log.entityId,
                  userName:
                    [log.user.firstName, log.user.lastName]
                      .filter(Boolean)
                      .join(" ") || log.user.email,
                  timestamp: log.createdAt.toISOString(),
                })),
              });
            }

            sendEvent("counts", {
              unreadNotifications: notificationCount,
              activeAlerts: alertCount,
              timestamp: now.toISOString(),
            });

            // Every 30 seconds (6 ticks): send keep-alive ping
            if (tickCount % 6 === 0) {
              sendEvent("ping", { timestamp: now.toISOString() });
            }

            // Wait 5 seconds
            await new Promise((resolve) => setTimeout(resolve, 5000));
          } catch {
            // If we can't query DB, wait and retry
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      };

      // Start polling — don't await (it runs forever)
      poll().catch(() => {
        isActive = false;
      });
    },
    cancel() {
      isActive = false;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
