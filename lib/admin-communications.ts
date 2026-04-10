import { db } from "@/lib/db";

// ─── Types ──────────────────────────────────────────────────

type ThreadStatus = "OPEN" | "WAITING" | "RESOLVED" | "CLOSED";
type ThreadPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";
type MessageChannel = "APP" | "EMAIL" | "SMS";

// ─── Get Threads (paginated with filters) ───────────────────

export async function getThreads(
  page = 1,
  limit = 50,
  status?: string,
  assignedTo?: string,
  priority?: string,
  search?: string
) {
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status && status !== "all") where.status = status;
  if (assignedTo && assignedTo !== "all") where.assignedTo = assignedTo;
  if (priority && priority !== "all") where.priority = priority;

  // For search, we need to match patient name
  let patientFilter: string[] | undefined;
  if (search) {
    const matchingUsers = await db.user.findMany({
      where: {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
        ],
      },
      select: { id: true },
    });
    patientFilter = matchingUsers.map((u) => u.id);
    if (patientFilter.length > 0) {
      where.patientId = { in: patientFilter };
    } else {
      // Also search in subject
      where.subject = { contains: search };
    }
  }

  const [threads, total] = await Promise.all([
    db.messageThread.findMany({
      where,
      orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    db.messageThread.count({ where }),
  ]);

  // Enrich threads with patient info + last message preview
  const patientIds = [...new Set(threads.map((t) => t.patientId))];
  const patients = await db.user.findMany({
    where: { id: { in: patientIds } },
    select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
  });
  const patientMap = new Map(patients.map((p) => [p.id, p]));

  // Get last message for each thread
  const threadIds = threads.map((t) => t.id);
  const lastMessages =
    threadIds.length > 0
      ? await db.message.findMany({
          where: { threadId: { in: threadIds } },
          orderBy: { createdAt: "desc" },
          distinct: ["threadId"],
          select: {
            threadId: true,
            body: true,
            direction: true,
            channel: true,
            isRead: true,
            createdAt: true,
          },
        })
      : [];
  const lastMessageMap = new Map(lastMessages.map((m) => [m.threadId, m]));

  // Get unread count per thread
  const unreadCounts =
    threadIds.length > 0
      ? await Promise.all(
          threadIds.map(async (id) => ({
            threadId: id,
            count: await db.message.count({
              where: { threadId: id, isRead: false, direction: "INBOUND" },
            }),
          }))
        )
      : [];
  const unreadMap = new Map(unreadCounts.map((u) => [u.threadId, u.count]));

  // Get assigned admin names
  const assignedIds = threads
    .map((t) => t.assignedTo)
    .filter((id): id is string => id !== null);
  const admins =
    assignedIds.length > 0
      ? await db.user.findMany({
          where: { id: { in: assignedIds } },
          select: { id: true, firstName: true, lastName: true },
        })
      : [];
  const adminMap = new Map(admins.map((a) => [a.id, `${a.firstName || ""} ${a.lastName || ""}`.trim()]));

  const enrichedThreads = threads.map((t) => {
    const patient = patientMap.get(t.patientId);
    const lastMsg = lastMessageMap.get(t.id);
    return {
      ...t,
      patientName: patient
        ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || patient.email
        : "Unknown Patient",
      patientEmail: patient?.email ?? "",
      patientAvatar: patient?.avatarUrl ?? null,
      lastMessagePreview: lastMsg?.body?.slice(0, 120) ?? "",
      lastMessageDirection: lastMsg?.direction ?? null,
      lastMessageChannel: lastMsg?.channel ?? null,
      unreadCount: unreadMap.get(t.id) ?? 0,
      assignedName: t.assignedTo ? adminMap.get(t.assignedTo) ?? "Unassigned" : "Unassigned",
    };
  });

  return { threads: enrichedThreads, total, page, limit };
}

// ─── Get Single Thread with Messages ────────────────────────

export async function getThread(threadId: string) {
  const thread = await db.messageThread.findUnique({
    where: { id: threadId },
  });

  if (!thread) return null;

  const [messages, patient] = await Promise.all([
    db.message.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
    }),
    db.user.findUnique({
      where: { id: thread.patientId },
      select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
    }),
  ]);

  // Mark inbound messages as read
  await db.message.updateMany({
    where: { threadId, direction: "INBOUND", isRead: false },
    data: { isRead: true },
  });

  // Get assigned admin name
  let assignedName = "Unassigned";
  if (thread.assignedTo) {
    const admin = await db.user.findUnique({
      where: { id: thread.assignedTo },
      select: { firstName: true, lastName: true },
    });
    if (admin) {
      assignedName = `${admin.firstName || ""} ${admin.lastName || ""}`.trim();
    }
  }

  return {
    ...thread,
    patientName: patient
      ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim() || patient.email
      : "Unknown Patient",
    patientEmail: patient?.email ?? "",
    patientAvatar: patient?.avatarUrl ?? null,
    assignedName,
    messages,
  };
}

// ─── Create Thread ──────────────────────────────────────────

export async function createThread(
  patientId: string,
  subject: string,
  firstMessage: string,
  adminId: string,
  channel: MessageChannel = "APP"
) {
  const now = new Date();

  const thread = await db.messageThread.create({
    data: {
      patientId,
      subject,
      status: "OPEN",
      assignedTo: adminId,
      priority: "NORMAL",
      lastMessageAt: now,
      messageCount: 1,
    },
  });

  await db.message.create({
    data: {
      userId: adminId,
      threadId: thread.id,
      direction: "OUTBOUND",
      channel,
      subject,
      body: firstMessage,
      isRead: true,
    },
  });

  return thread;
}

// ─── Reply to Thread ────────────────────────────────────────

export async function replyToThread(
  threadId: string,
  body: string,
  adminId: string,
  channel: MessageChannel = "APP"
) {
  const now = new Date();

  const message = await db.message.create({
    data: {
      userId: adminId,
      threadId,
      direction: "OUTBOUND",
      channel,
      body,
      isRead: true,
    },
  });

  await db.messageThread.update({
    where: { id: threadId },
    data: {
      lastMessageAt: now,
      messageCount: { increment: 1 },
      status: "WAITING",
    },
  });

  return message;
}

// ─── Update Thread Status ───────────────────────────────────

export async function updateThreadStatus(threadId: string, status: ThreadStatus) {
  return db.messageThread.update({
    where: { id: threadId },
    data: { status },
  });
}

// ─── Assign Thread ──────────────────────────────────────────

export async function assignThread(threadId: string, adminId: string) {
  return db.messageThread.update({
    where: { id: threadId },
    data: { assignedTo: adminId },
  });
}

// ─── Update Thread Priority ─────────────────────────────────

export async function updateThreadPriority(threadId: string, priority: ThreadPriority) {
  return db.messageThread.update({
    where: { id: threadId },
    data: { priority },
  });
}

// ─── Thread Metrics ─────────────────────────────────────────

export async function getThreadMetrics() {
  const [totalThreads, openThreads, waitingThreads, unreadCount] =
    await Promise.all([
      db.messageThread.count(),
      db.messageThread.count({ where: { status: "OPEN" } }),
      db.messageThread.count({ where: { status: "WAITING" } }),
      db.message.count({ where: { isRead: false, direction: "INBOUND" } }),
    ]);

  // Approximate avg response time by looking at recent outbound messages
  // that follow inbound messages in the same thread
  const recentOutbound = await db.message.findMany({
    where: { direction: "OUTBOUND" },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { threadId: true, createdAt: true },
  });

  let totalResponseMinutes = 0;
  let responseCount = 0;

  for (const msg of recentOutbound) {
    if (!msg.threadId) continue;
    const previousInbound = await db.message.findFirst({
      where: {
        threadId: msg.threadId,
        direction: "INBOUND",
        createdAt: { lt: msg.createdAt },
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    if (previousInbound) {
      const diffMs =
        msg.createdAt.getTime() - previousInbound.createdAt.getTime();
      totalResponseMinutes += diffMs / 60000;
      responseCount++;
    }
  }

  const avgResponseMinutes =
    responseCount > 0
      ? Math.round(totalResponseMinutes / responseCount)
      : 0;

  return {
    totalThreads,
    openThreads,
    waitingThreads,
    unreadCount,
    avgResponseMinutes,
  };
}

// ─── Message Templates ──────────────────────────────────────

export function getMessageTemplates() {
  return [
    {
      id: "welcome",
      name: "Welcome",
      body: "Welcome to Nature's Journey! We're excited to support your weight management journey. Your dedicated care team is here to help. If you have any questions about your treatment plan, medications, or anything else, don't hesitate to reach out.",
    },
    {
      id: "follow-up",
      name: "Follow-up",
      body: "Hi! Just checking in on your progress. How are you feeling with your current treatment? Have you experienced any side effects or have any questions for your care team?",
    },
    {
      id: "refill-reminder",
      name: "Refill Reminder",
      body: "This is a friendly reminder that your medication refill is coming up soon. Please make sure your shipping address is up to date in your dashboard settings. If you need to make any changes to your treatment plan, let us know.",
    },
    {
      id: "check-in",
      name: "Check-in",
      body: "Time for your regular check-in! Please log your latest weight and measurements in your progress tracker. How has your energy and appetite been this week? Your provider will review your progress at your next consultation.",
    },
    {
      id: "cancellation-save",
      name: "Cancellation Save",
      body: "We noticed you may be considering changes to your plan. We'd love to understand how we can better support you. Would you be open to discussing your concerns? We have several options that might work better for your needs, including plan adjustments and flexible scheduling.",
    },
  ];
}
