import { db } from "@/lib/db";

// ─── Journey Stage Definitions ─────────────────────────────

export interface JourneyNode {
  id: string;
  label: string;
  count: number;
}

export interface JourneyLink {
  source: string;
  target: string;
  value: number;
}

export interface JourneyFlowData {
  nodes: JourneyNode[];
  links: JourneyLink[];
  stageTable: StageRow[];
}

export interface StageRow {
  stage: string;
  count: number;
  pctOfPrevious: number | null;
  dropOffPct: number | null;
  avgDaysInStage: number | null;
}

export interface TransitionUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
}

// ─── Get Journey Flow Data ─────────────────────────────────

export async function getJourneyFlowData(): Promise<JourneyFlowData> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // Count users at each stage
  const [
    leadCount,
    quizCount,
    intakeCount,
    subscribedCount,
    active30dCount,
    milestoneCount,
    renewedCount,
    churnedCount,
  ] = await Promise.all([
    // Leads
    db.lead.count(),
    // Quiz completed
    db.quizSubmission.count(),
    // Intake submitted
    db.intakeSubmission.count(),
    // Subscribed (any subscription created)
    db.subscription.count(),
    // Active 30d+ (active subscription created 30+ days ago)
    db.subscription.count({
      where: {
        status: "ACTIVE",
        createdAt: { lte: thirtyDaysAgo },
      },
    }),
    // Milestone (users with 10+ progress entries)
    db.progressEntry
      .groupBy({
        by: ["userId"],
        _count: { id: true },
        having: { id: { _count: { gte: 10 } } },
      })
      .then((r) => r.length),
    // Renewed (active subscription 90+ days)
    db.subscription.count({
      where: {
        status: "ACTIVE",
        createdAt: { lte: ninetyDaysAgo },
      },
    }),
    // Churned (canceled subscriptions)
    db.subscription.count({
      where: { status: "CANCELED" },
    }),
  ]);

  // Build nodes
  const nodes: JourneyNode[] = [
    { id: "lead", label: "Lead", count: leadCount },
    { id: "quiz", label: "Quiz Completed", count: quizCount },
    { id: "intake", label: "Intake Submitted", count: intakeCount },
    { id: "subscribed", label: "Subscribed", count: subscribedCount },
    { id: "active30d", label: "Active 30d+", count: active30dCount },
    { id: "milestone", label: "Milestone (10+)", count: milestoneCount },
    { id: "renewed", label: "Renewed (90d+)", count: renewedCount },
    { id: "churned", label: "Churned", count: churnedCount },
  ];

  // Count transitions between stages by checking which users appear in both
  const [
    leadToQuiz,
    quizToIntake,
    intakeToSubscribed,
    subscribedToActive,
    subscribedToChurned,
    activeToMilestone,
    activeToRenewed,
  ] = await Promise.all([
    // Lead -> Quiz: leads that also have a quiz submission (by email match)
    db.$queryRawUnsafe<[{ cnt: number }]>(
      `SELECT COUNT(*) as cnt FROM Lead l WHERE EXISTS (SELECT 1 FROM QuizSubmission q JOIN User u ON q.userId = u.id WHERE u.email = l.email)`
    ).then((r) => Number(r[0]?.cnt ?? 0)),

    // Quiz -> Intake: users with both quiz and intake
    db.$queryRawUnsafe<[{ cnt: number }]>(
      `SELECT COUNT(*) as cnt FROM QuizSubmission q WHERE q.userId IS NOT NULL AND EXISTS (SELECT 1 FROM IntakeSubmission i WHERE i.userId = q.userId)`
    ).then((r) => Number(r[0]?.cnt ?? 0)),

    // Intake -> Subscribed: users with both intake and subscription
    db.$queryRawUnsafe<[{ cnt: number }]>(
      `SELECT COUNT(*) as cnt FROM IntakeSubmission i WHERE EXISTS (SELECT 1 FROM Subscription s WHERE s.userId = i.userId)`
    ).then((r) => Number(r[0]?.cnt ?? 0)),

    // Subscribed -> Active 30d+
    db.subscription.count({
      where: {
        status: "ACTIVE",
        createdAt: { lte: thirtyDaysAgo },
      },
    }),

    // Subscribed -> Churned
    db.subscription.count({
      where: { status: "CANCELED" },
    }),

    // Active -> Milestone
    db.$queryRawUnsafe<[{ cnt: number }]>(
      `SELECT COUNT(*) as cnt FROM Subscription s WHERE s.status = 'ACTIVE' AND s.createdAt <= ? AND EXISTS (SELECT 1 FROM ProgressEntry p WHERE p.userId = s.userId GROUP BY p.userId HAVING COUNT(p.id) >= 10)`,
      thirtyDaysAgo.toISOString()
    ).then((r) => Number(r[0]?.cnt ?? 0)),

    // Active -> Renewed (90d+)
    db.subscription.count({
      where: {
        status: "ACTIVE",
        createdAt: { lte: ninetyDaysAgo },
      },
    }),
  ]);

  const links: JourneyLink[] = [
    { source: "lead", target: "quiz", value: leadToQuiz },
    { source: "quiz", target: "intake", value: quizToIntake },
    { source: "intake", target: "subscribed", value: intakeToSubscribed },
    { source: "subscribed", target: "active30d", value: subscribedToActive },
    { source: "subscribed", target: "churned", value: subscribedToChurned },
    { source: "active30d", target: "milestone", value: activeToMilestone },
    { source: "active30d", target: "renewed", value: activeToRenewed },
  ];

  // Build stage-by-stage table
  const orderedStages = [
    { stage: "Lead", count: leadCount },
    { stage: "Quiz Completed", count: quizCount },
    { stage: "Intake Submitted", count: intakeCount },
    { stage: "Subscribed", count: subscribedCount },
    { stage: "Active 30d+", count: active30dCount },
    { stage: "Milestone (10+)", count: milestoneCount },
    { stage: "Renewed (90d+)", count: renewedCount },
    { stage: "Churned", count: churnedCount },
  ];

  const stageTable: StageRow[] = orderedStages.map((s, i) => {
    const prev = i > 0 ? orderedStages[i - 1].count : null;
    const pctOfPrevious =
      prev !== null && prev > 0
        ? Math.round((s.count / prev) * 1000) / 10
        : null;
    const dropOffPct =
      prev !== null && prev > 0
        ? Math.round(((prev - s.count) / prev) * 1000) / 10
        : null;

    return {
      stage: s.stage,
      count: s.count,
      pctOfPrevious,
      dropOffPct,
      avgDaysInStage: null, // Would require per-user timestamp analysis
    };
  });

  return { nodes, links, stageTable };
}

// ─── Get Transition Users ──────────────────────────────────

export async function getTransitionUsers(
  fromStage: string,
  toStage: string,
  page = 1,
  limit = 20
): Promise<{ users: TransitionUser[]; total: number }> {
  const skip = (page - 1) * limit;

  // Map stage pairs to queries
  if (fromStage === "lead" && toStage === "quiz") {
    const users = await db.user.findMany({
      where: {
        quizSubmission: { isNot: null },
      },
      select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
    });
    const total = await db.user.count({
      where: { quizSubmission: { isNot: null } },
    });
    return { users, total };
  }

  if (fromStage === "quiz" && toStage === "intake") {
    const users = await db.user.findMany({
      where: {
        quizSubmission: { isNot: null },
        intakeSubmission: { isNot: null },
      },
      select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
    });
    const total = await db.user.count({
      where: {
        quizSubmission: { isNot: null },
        intakeSubmission: { isNot: null },
      },
    });
    return { users, total };
  }

  if (fromStage === "intake" && toStage === "subscribed") {
    const users = await db.user.findMany({
      where: {
        intakeSubmission: { isNot: null },
        subscriptions: { some: {} },
      },
      select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
    });
    const total = await db.user.count({
      where: {
        intakeSubmission: { isNot: null },
        subscriptions: { some: {} },
      },
    });
    return { users, total };
  }

  return { users: [], total: 0 };
}
