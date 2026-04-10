import { db } from "@/lib/db";

// ── Types ─────────────────────────────────────────────────────

export interface PlaybookStep {
  dayOffset: number;
  action: "send_email" | "send_notification" | "create_alert";
  channel: "APP" | "EMAIL" | "SMS";
  templateKey?: string;
  subject: string;
  body: string;
}

export interface TriggerConfig {
  daysInactive?: number;
  churnRiskThreshold?: number;
  daysSinceCancel?: number;
  milestoneType?: string;
}

export interface PlaybookMetrics {
  totalPlaybooks: number;
  activePlaybooks: number;
  activeEnrollments: number;
  completionRate: number;
  conversionRate: number;
  topPerformer: string;
}

export interface PlaybookWithStats {
  id: string;
  name: string;
  triggerType: string;
  triggerConfig: TriggerConfig;
  steps: PlaybookStep[];
  isActive: boolean;
  enrolledCount: number;
  completedCount: number;
  convertedCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  _count: { enrollments: number };
  activeEnrollments: number;
}

export interface EnrollmentRow {
  id: string;
  userId: string;
  userName: string;
  email: string;
  status: string;
  currentStep: number;
  enrolledAt: string;
  completedAt: string | null;
  convertedAt: string | null;
  exitedAt: string | null;
  exitReason: string | null;
}

// ── List Playbooks ────────────────────────────────────────────

export async function getPlaybooks(page = 1, limit = 20) {
  const [playbooks, total] = await Promise.all([
    db.retentionPlaybook.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { enrollments: true } },
        enrollments: {
          where: { status: "ACTIVE" },
          select: { id: true },
        },
      },
    }),
    db.retentionPlaybook.count(),
  ]);

  const rows: PlaybookWithStats[] = playbooks.map((p) => ({
    id: p.id,
    name: p.name,
    triggerType: p.triggerType,
    triggerConfig: p.triggerConfig as TriggerConfig,
    steps: p.steps as unknown as PlaybookStep[],
    isActive: p.isActive,
    enrolledCount: p.enrolledCount,
    completedCount: p.completedCount,
    convertedCount: p.convertedCount,
    createdBy: p.createdBy,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    _count: p._count,
    activeEnrollments: p.enrollments.length,
  }));

  return { rows, total };
}

// ── Create Playbook ───────────────────────────────────────────

export async function createPlaybook(data: {
  name: string;
  triggerType: string;
  triggerConfig: TriggerConfig;
  steps: PlaybookStep[];
  createdBy: string;
}) {
  return db.retentionPlaybook.create({
    data: {
      name: data.name,
      triggerType: data.triggerType,
      triggerConfig: data.triggerConfig as object,
      steps: data.steps as unknown as object[],
      createdBy: data.createdBy,
    },
  });
}

// ── Update Playbook ───────────────────────────────────────────

export async function updatePlaybook(
  id: string,
  data: {
    name?: string;
    triggerType?: string;
    triggerConfig?: TriggerConfig;
    steps?: PlaybookStep[];
    isActive?: boolean;
  }
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.triggerType !== undefined) updateData.triggerType = data.triggerType;
  if (data.triggerConfig !== undefined) updateData.triggerConfig = data.triggerConfig as object;
  if (data.steps !== undefined) updateData.steps = data.steps as unknown as object[];
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return db.retentionPlaybook.update({
    where: { id },
    data: updateData,
  });
}

// ── Delete (Soft) ─────────────────────────────────────────────

export async function deletePlaybook(id: string) {
  return db.retentionPlaybook.update({
    where: { id },
    data: { isActive: false },
  });
}

// ── Playbook Detail ───────────────────────────────────────────

export async function getPlaybookDetail(id: string) {
  const playbook = await db.retentionPlaybook.findUnique({
    where: { id },
    include: {
      enrollments: {
        orderBy: { enrolledAt: "desc" },
        take: 100,
      },
    },
  });

  if (!playbook) return null;

  // Fetch user info for enrollments
  const userIds = playbook.enrollments.map((e) => e.userId);
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  const enrollments: EnrollmentRow[] = playbook.enrollments.map((e) => {
    const user = userMap.get(e.userId);
    return {
      id: e.id,
      userId: e.userId,
      userName: user
        ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
        : "Unknown",
      email: user?.email || "",
      status: e.status,
      currentStep: e.currentStep,
      enrolledAt: e.enrolledAt.toISOString(),
      completedAt: e.completedAt?.toISOString() || null,
      convertedAt: e.convertedAt?.toISOString() || null,
      exitedAt: e.exitedAt?.toISOString() || null,
      exitReason: e.exitReason,
    };
  });

  return {
    id: playbook.id,
    name: playbook.name,
    triggerType: playbook.triggerType,
    triggerConfig: playbook.triggerConfig as TriggerConfig,
    steps: playbook.steps as unknown as PlaybookStep[],
    isActive: playbook.isActive,
    enrolledCount: playbook.enrolledCount,
    completedCount: playbook.completedCount,
    convertedCount: playbook.convertedCount,
    createdBy: playbook.createdBy,
    createdAt: playbook.createdAt.toISOString(),
    updatedAt: playbook.updatedAt.toISOString(),
    enrollments,
  };
}

// ── Enroll User ───────────────────────────────────────────────

export async function enrollUser(playbookId: string, userId: string) {
  // Check if already enrolled
  const existing = await db.playbookEnrollment.findUnique({
    where: { playbookId_userId: { playbookId, userId } },
  });
  if (existing) return existing;

  const enrollment = await db.playbookEnrollment.create({
    data: { playbookId, userId },
  });

  await db.retentionPlaybook.update({
    where: { id: playbookId },
    data: { enrolledCount: { increment: 1 } },
  });

  return enrollment;
}

// ── Advance Step ──────────────────────────────────────────────

export async function advanceStep(enrollmentId: string) {
  const enrollment = await db.playbookEnrollment.findUnique({
    where: { id: enrollmentId },
    include: { playbook: true },
  });
  if (!enrollment || enrollment.status !== "ACTIVE") return null;

  const steps = enrollment.playbook.steps as unknown as PlaybookStep[];
  const nextStep = enrollment.currentStep + 1;

  if (nextStep >= steps.length) {
    // Mark as completed
    await db.playbookEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: "COMPLETED",
        currentStep: nextStep,
        completedAt: new Date(),
      },
    });
    await db.retentionPlaybook.update({
      where: { id: enrollment.playbookId },
      data: { completedCount: { increment: 1 } },
    });
    return { status: "COMPLETED", currentStep: nextStep };
  }

  await db.playbookEnrollment.update({
    where: { id: enrollmentId },
    data: { currentStep: nextStep },
  });

  return { status: "ACTIVE", currentStep: nextStep };
}

// ── Convert Enrollment ────────────────────────────────────────

export async function convertEnrollment(enrollmentId: string) {
  const enrollment = await db.playbookEnrollment.findUnique({
    where: { id: enrollmentId },
  });
  if (!enrollment) return null;

  await db.playbookEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "CONVERTED",
      convertedAt: new Date(),
    },
  });

  await db.retentionPlaybook.update({
    where: { id: enrollment.playbookId },
    data: { convertedCount: { increment: 1 } },
  });

  return { status: "CONVERTED" };
}

// ── Exit Enrollment ───────────────────────────────────────────

export async function exitEnrollment(enrollmentId: string, reason: string) {
  await db.playbookEnrollment.update({
    where: { id: enrollmentId },
    data: {
      status: "EXITED",
      exitedAt: new Date(),
      exitReason: reason,
    },
  });

  return { status: "EXITED" };
}

// ── Playbook Metrics ──────────────────────────────────────────

export async function getPlaybookMetrics(): Promise<PlaybookMetrics> {
  const [
    totalPlaybooks,
    activePlaybooks,
    activeEnrollments,
    completedEnrollments,
    convertedEnrollments,
    totalEnrollments,
    topPlaybook,
  ] = await Promise.all([
    db.retentionPlaybook.count(),
    db.retentionPlaybook.count({ where: { isActive: true } }),
    db.playbookEnrollment.count({ where: { status: "ACTIVE" } }),
    db.playbookEnrollment.count({ where: { status: "COMPLETED" } }),
    db.playbookEnrollment.count({ where: { status: "CONVERTED" } }),
    db.playbookEnrollment.count(),
    db.retentionPlaybook.findFirst({
      orderBy: { convertedCount: "desc" },
      select: { name: true },
    }),
  ]);

  const completionRate =
    totalEnrollments > 0
      ? Math.round(((completedEnrollments + convertedEnrollments) / totalEnrollments) * 1000) / 10
      : 0;

  const conversionRate =
    totalEnrollments > 0
      ? Math.round((convertedEnrollments / totalEnrollments) * 1000) / 10
      : 0;

  return {
    totalPlaybooks,
    activePlaybooks,
    activeEnrollments,
    completionRate,
    conversionRate,
    topPerformer: topPlaybook?.name || "None",
  };
}

// ── Evaluate Triggers ─────────────────────────────────────────

export async function evaluatePlaybookTriggers(): Promise<number> {
  const activePlaybooks = await db.retentionPlaybook.findMany({
    where: { isActive: true },
    include: {
      enrollments: { select: { userId: true } },
    },
  });

  let totalEnrolled = 0;
  const now = new Date();

  for (const playbook of activePlaybooks) {
    const enrolledUserIds = new Set(playbook.enrollments.map((e) => e.userId));
    const config = playbook.triggerConfig as TriggerConfig;
    let matchingUsers: { id: string }[] = [];

    switch (playbook.triggerType) {
      case "ONBOARDING": {
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        matchingUsers = await db.user.findMany({
          where: {
            role: "PATIENT",
            createdAt: { gte: oneDayAgo },
          },
          select: { id: true },
        });
        break;
      }

      case "INACTIVITY": {
        const daysInactive = config.daysInactive || 14;
        const cutoff = new Date(now.getTime() - daysInactive * 24 * 60 * 60 * 1000);
        matchingUsers = await db.user.findMany({
          where: {
            role: "PATIENT",
            subscriptions: { some: { status: "ACTIVE" } },
            progressEntries: { none: { date: { gte: cutoff } } },
          },
          select: { id: true },
        });
        break;
      }

      case "CHURN_RISK": {
        const threshold = config.churnRiskThreshold || 70;
        matchingUsers = await db.user.findMany({
          where: {
            role: "PATIENT",
            profile: { healthScore: { lte: threshold } },
            subscriptions: { some: { status: "ACTIVE" } },
          },
          select: { id: true },
        });
        break;
      }

      case "WIN_BACK": {
        const daysSinceCancel = config.daysSinceCancel || 30;
        const cancelCutoff = new Date(now.getTime() - daysSinceCancel * 24 * 60 * 60 * 1000);
        matchingUsers = await db.user.findMany({
          where: {
            role: "PATIENT",
            subscriptions: {
              some: {
                status: "CANCELED",
                canceledAt: { gte: cancelCutoff },
              },
            },
          },
          select: { id: true },
        });
        break;
      }

      case "MILESTONE": {
        // Milestone: users who recently hit a weight milestone (5+ lbs lost)
        matchingUsers = await db.user.findMany({
          where: {
            role: "PATIENT",
            profile: { isNot: null },
            subscriptions: { some: { status: "ACTIVE" } },
          },
          select: { id: true },
          take: 50,
        });
        break;
      }
    }

    // Filter out already-enrolled users and enroll new matches
    const newUsers = matchingUsers.filter((u) => !enrolledUserIds.has(u.id));

    for (const user of newUsers) {
      try {
        await enrollUser(playbook.id, user.id);
        totalEnrolled++;
      } catch {
        // Skip duplicates (race condition guard)
      }
    }
  }

  return totalEnrolled;
}
