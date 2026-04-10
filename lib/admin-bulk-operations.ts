import { db } from "@/lib/db";
import { computeHealthScore } from "@/lib/patient-scoring";

// ── List bulk operations (paginated) ─────────────────────────────

export async function getBulkOperations(page = 1, limit = 25) {
  const skip = (page - 1) * limit;

  const [operations, total] = await Promise.all([
    db.bulkOperation.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.bulkOperation.count(),
  ]);

  return { operations, total, page, limit };
}

// ── Create a bulk operation ──────────────────────────────────────

export async function createBulkOperation(params: {
  type: string;
  targetSegment?: string;
  targetFilter?: Record<string, unknown>;
  initiatedBy: string;
}) {
  return db.bulkOperation.create({
    data: {
      type: params.type,
      status: "PENDING",
      targetSegment: params.targetSegment ?? null,
      targetFilter: params.targetFilter ? JSON.parse(JSON.stringify(params.targetFilter)) : undefined,
      initiatedBy: params.initiatedBy,
      affectedCount: 0,
      processedCount: 0,
      errorCount: 0,
    },
  });
}

// ── Execute a bulk operation ─────────────────────────────────────

export async function executeBulkOperation(operationId: string) {
  // Mark as RUNNING
  await db.bulkOperation.update({
    where: { id: operationId },
    data: { status: "RUNNING", startedAt: new Date() },
  });

  const operation = await db.bulkOperation.findUnique({
    where: { id: operationId },
  });

  if (!operation) {
    throw new Error("Operation not found");
  }

  try {
    let processedCount = 0;
    let errorCount = 0;
    const errorDetails: string[] = [];

    switch (operation.type) {
      case "RECALC_SCORES": {
        // Get all users with active subscriptions
        const activeUsers = await db.subscription.findMany({
          where: { status: "ACTIVE" },
          select: { userId: true },
          distinct: ["userId"],
        });

        const affectedCount = activeUsers.length;
        await db.bulkOperation.update({
          where: { id: operationId },
          data: { affectedCount },
        });

        for (const { userId } of activeUsers) {
          try {
            await computeHealthScore(userId);
            processedCount++;
          } catch (err) {
            errorCount++;
            errorDetails.push(
              `User ${userId}: ${err instanceof Error ? err.message : "Unknown error"}`
            );
          }
        }
        break;
      }

      case "RETRY_PAYMENTS": {
        // Get PAST_DUE subscriptions
        const pastDueSubs = await db.subscription.findMany({
          where: { status: "PAST_DUE" },
          select: { userId: true, id: true },
        });

        const affectedCount = pastDueSubs.length;
        await db.bulkOperation.update({
          where: { id: operationId },
          data: { affectedCount },
        });

        for (const sub of pastDueSubs) {
          try {
            // Find the most recent order for this user and note retry attempted
            const latestOrder = await db.order.findFirst({
              where: { userId: sub.userId },
              orderBy: { createdAt: "desc" },
            });
            if (latestOrder) {
              await db.order.update({
                where: { id: latestOrder.id },
                data: { status: "PROCESSING" },
              });
            }
            processedCount++;
          } catch (err) {
            errorCount++;
            errorDetails.push(
              `Sub ${sub.id}: ${err instanceof Error ? err.message : "Unknown error"}`
            );
          }
        }
        break;
      }

      case "SEND_CAMPAIGN":
      case "APPLY_COUPON":
      default: {
        // For other types, just mark as completed
        processedCount = 0;
        break;
      }
    }

    // Mark COMPLETED
    await db.bulkOperation.update({
      where: { id: operationId },
      data: {
        status: errorCount > 0 && processedCount === 0 ? "FAILED" : "COMPLETED",
        processedCount,
        errorCount,
        errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    // Mark FAILED
    await db.bulkOperation.update({
      where: { id: operationId },
      data: {
        status: "FAILED",
        errorDetails: [
          error instanceof Error ? error.message : "Unknown error",
        ],
        completedAt: new Date(),
      },
    });
    throw error;
  }
}

// ── Preview a bulk operation ─────────────────────────────────────

export async function previewBulkOperation(
  type: string,
  _targetFilter?: Record<string, unknown>
): Promise<{ affectedCount: number; sampleUsers: { name: string; email: string }[] }> {
  let affectedCount = 0;
  let sampleUsers: { name: string; email: string }[] = [];

  switch (type) {
    case "RECALC_SCORES": {
      const activeUsers = await db.subscription.findMany({
        where: { status: "ACTIVE" },
        select: {
          userId: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
        distinct: ["userId"],
      });
      affectedCount = activeUsers.length;
      sampleUsers = activeUsers.slice(0, 5).map((u) => ({
        name: `${u.user.firstName || ""} ${u.user.lastName || ""}`.trim() || "Unknown",
        email: u.user.email,
      }));
      break;
    }

    case "RETRY_PAYMENTS": {
      const pastDueSubs = await db.subscription.findMany({
        where: { status: "PAST_DUE" },
        select: {
          userId: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
        distinct: ["userId"],
      });
      affectedCount = pastDueSubs.length;
      sampleUsers = pastDueSubs.slice(0, 5).map((u) => ({
        name: `${u.user.firstName || ""} ${u.user.lastName || ""}`.trim() || "Unknown",
        email: u.user.email,
      }));
      break;
    }

    case "SEND_CAMPAIGN": {
      const patients = await db.user.findMany({
        where: { role: "PATIENT" },
        select: { firstName: true, lastName: true, email: true },
        take: 5,
      });
      affectedCount = await db.user.count({ where: { role: "PATIENT" } });
      sampleUsers = patients.map((u) => ({
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown",
        email: u.email,
      }));
      break;
    }

    case "APPLY_COUPON": {
      const activeSubs = await db.subscription.findMany({
        where: { status: "ACTIVE" },
        select: {
          userId: true,
          user: { select: { firstName: true, lastName: true, email: true } },
        },
        distinct: ["userId"],
      });
      affectedCount = activeSubs.length;
      sampleUsers = activeSubs.slice(0, 5).map((u) => ({
        name: `${u.user.firstName || ""} ${u.user.lastName || ""}`.trim() || "Unknown",
        email: u.user.email,
      }));
      break;
    }

    default:
      break;
  }

  return { affectedCount, sampleUsers };
}
