import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// ─── Create Payment Plan ───────────────────────────────────

export async function createPaymentPlan(
  userId: string,
  totalCents: number,
  installments: number,
  subscriptionId?: string
) {
  const installmentCents = Math.ceil(totalCents / installments);
  const now = new Date();

  // Create plan + installment records in a transaction
  const plan = await db.$transaction(async (tx) => {
    const paymentPlan = await tx.paymentPlan.create({
      data: {
        userId,
        subscriptionId: subscriptionId || null,
        totalCents,
        installments,
        installmentCents,
        paidCount: 0,
        remainingCents: totalCents,
        status: "ACTIVE",
        nextPaymentDate: now, // First payment is due immediately
      },
    });

    // Create individual installment records with staggered due dates
    const installmentRecords: Prisma.InstallmentCreateManyInput[] = [];
    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(now);
      dueDate.setMonth(dueDate.getMonth() + i);

      installmentRecords.push({
        planId: paymentPlan.id,
        sequenceNum: i + 1,
        amountCents: i === installments - 1
          ? totalCents - installmentCents * (installments - 1) // Last payment absorbs rounding
          : installmentCents,
        status: "PENDING",
        dueDate,
      });
    }

    await tx.installment.createMany({ data: installmentRecords });

    return paymentPlan;
  });

  return plan;
}

// ─── Get User's Active Payment Plan ────────────────────────

export async function getPaymentPlan(userId: string) {
  return db.paymentPlan.findFirst({
    where: { userId, status: { in: ["ACTIVE", "COMPLETED"] } },
    orderBy: { createdAt: "desc" },
    include: {
      payments: {
        orderBy: { sequenceNum: "asc" },
      },
    },
  });
}

// ─── Process an Installment ────────────────────────────────

export async function processInstallment(installmentId: string, stripePaymentId?: string) {
  return db.$transaction(async (tx) => {
    const installment = await tx.installment.findUnique({
      where: { id: installmentId },
      include: { plan: true },
    });

    if (!installment) {
      throw new Error("Installment not found");
    }

    if (installment.status === "PAID") {
      throw new Error("Installment already paid");
    }

    // Mark installment as paid
    await tx.installment.update({
      where: { id: installmentId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        stripePaymentId: stripePaymentId || null,
      },
    });

    // Update payment plan
    const newPaidCount = installment.plan.paidCount + 1;
    const newRemainingCents = installment.plan.remainingCents - installment.amountCents;
    const isComplete = newPaidCount >= installment.plan.installments;

    // Find next pending installment for nextPaymentDate
    const nextInstallment = isComplete
      ? null
      : await tx.installment.findFirst({
          where: {
            planId: installment.planId,
            status: "PENDING",
            sequenceNum: { gt: installment.sequenceNum },
          },
          orderBy: { sequenceNum: "asc" },
        });

    await tx.paymentPlan.update({
      where: { id: installment.planId },
      data: {
        paidCount: newPaidCount,
        remainingCents: Math.max(0, newRemainingCents),
        status: isComplete ? "COMPLETED" : "ACTIVE",
        nextPaymentDate: nextInstallment?.dueDate || null,
      },
    });

    return { success: true, isComplete, remainingCents: Math.max(0, newRemainingCents) };
  });
}

// ─── Admin: Get All Payment Plans ──────────────────────────

export async function getAdminPaymentPlans(
  page = 1,
  limit = 25,
  status?: string
) {
  const where = status && status !== "ALL" ? { status } : {};

  const [plans, total] = await Promise.all([
    db.paymentPlan.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        payments: {
          orderBy: { sequenceNum: "asc" },
          select: { id: true, sequenceNum: true, amountCents: true, status: true, dueDate: true, paidAt: true },
        },
      },
    }),
    db.paymentPlan.count({ where }),
  ]);

  // Fetch user info for each plan
  const userIds = [...new Set(plans.map((p) => p.userId))];
  const users = userIds.length
    ? await db.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, firstName: true, lastName: true, email: true },
      })
    : [];
  const userMap = new Map(users.map((u) => [u.id, u]));

  const enriched = plans.map((plan) => {
    const user = userMap.get(plan.userId);
    return {
      ...plan,
      customerName: user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
        : "Unknown",
      customerEmail: user?.email || "",
    };
  });

  return { plans: enriched, total, page, limit };
}
