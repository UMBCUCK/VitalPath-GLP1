import { db } from "@/lib/db";

// ── Types ────────────────────────────────────────────────────

interface Condition {
  field: "health_score" | "days_inactive" | "subscription_status" | "churn_risk";
  operator: "gt" | "lt" | "eq" | "gte" | "lte";
  value: string | number;
}

interface ActionDef {
  type: "create_alert" | "send_notification";
  params: Record<string, string>;
}

interface ConditionResult {
  field: string;
  operator: string;
  value: string | number;
  matchedCount: number;
  passed: boolean;
}

// ── Pagination helpers ───────────────────────────────────────

export async function getAutomationRules(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [rules, total] = await Promise.all([
    db.automationRule.findMany({
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
      include: { _count: { select: { executions: true } } },
    }),
    db.automationRule.count(),
  ]);

  return {
    rules: rules.map((r) => ({
      ...r,
      executionCount: r._count.executions,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      lastTriggeredAt: r.lastTriggeredAt?.toISOString() || null,
    })),
    total,
    page,
    limit,
  };
}

// ── CRUD ─────────────────────────────────────────────────────

export async function createAutomationRule(data: {
  name: string;
  description?: string;
  triggerType: string;
  conditions: Condition[];
  actions: ActionDef[];
  cooldownMinutes?: number;
  createdBy: string;
}) {
  const rule = await db.automationRule.create({
    data: {
      name: data.name,
      description: data.description || null,
      triggerType: data.triggerType,
      conditions: JSON.parse(JSON.stringify(data.conditions)),
      actions: JSON.parse(JSON.stringify(data.actions)),
      cooldownMinutes: data.cooldownMinutes ?? 60,
      createdBy: data.createdBy,
    },
  });
  return rule;
}

export async function updateAutomationRule(
  id: string,
  data: {
    name?: string;
    description?: string;
    triggerType?: string;
    conditions?: Condition[];
    actions?: ActionDef[];
    cooldownMinutes?: number;
    isActive?: boolean;
  }
) {
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.triggerType !== undefined) updateData.triggerType = data.triggerType;
  if (data.conditions !== undefined) updateData.conditions = data.conditions;
  if (data.actions !== undefined) updateData.actions = data.actions;
  if (data.cooldownMinutes !== undefined) updateData.cooldownMinutes = data.cooldownMinutes;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return db.automationRule.update({ where: { id }, data: updateData });
}

export async function deleteAutomationRule(id: string) {
  return db.automationRule.update({
    where: { id },
    data: { isActive: false },
  });
}

// ── Execution history ────────────────────────────────────────

export async function getAutomationExecutions(ruleId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [executions, total] = await Promise.all([
    db.automationExecution.findMany({
      where: { ruleId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.automationExecution.count({ where: { ruleId } }),
  ]);

  return {
    executions: executions.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
    })),
    total,
  };
}

// ── Condition evaluation ─────────────────────────────────────

async function evaluateCondition(condition: Condition): Promise<ConditionResult> {
  const { field, operator, value } = condition;
  let matchedCount = 0;

  switch (field) {
    case "health_score": {
      const numVal = Number(value);
      const where = buildNumericWhere("healthScore", operator, numVal);
      matchedCount = await db.patientProfile.count({ where });
      break;
    }

    case "days_inactive": {
      const daysThreshold = Number(value);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysThreshold);

      // Find users whose latest progress entry is older than cutoff
      // We count users with NO entry since the cutoff date
      if (operator === "gt" || operator === "gte") {
        // Users inactive for more than N days: no progress entry since cutoff
        const activeUsers = await db.progressEntry.findMany({
          where: { date: { gte: cutoff } },
          select: { userId: true },
          distinct: ["userId"],
        });
        const activeUserIds = activeUsers.map((u) => u.userId);
        matchedCount = await db.patientProfile.count({
          where: activeUserIds.length > 0 ? { userId: { notIn: activeUserIds } } : {},
        });
      } else {
        // Users active within N days: have a progress entry since cutoff
        const activeUsers = await db.progressEntry.findMany({
          where: { date: { gte: cutoff } },
          select: { userId: true },
          distinct: ["userId"],
        });
        matchedCount = activeUsers.length;
      }
      break;
    }

    case "subscription_status": {
      const statusVal = String(value).toUpperCase() as "ACTIVE" | "PAUSED" | "PAST_DUE" | "CANCELED" | "EXPIRED" | "TRIALING";
      matchedCount = await db.subscription.count({
        where: { status: statusVal },
      });
      break;
    }

    case "churn_risk": {
      const numVal = Number(value);
      const where = buildNumericWhere("churnRisk", operator, numVal);
      matchedCount = await db.patientProfile.count({ where });
      break;
    }
  }

  return {
    field,
    operator,
    value,
    matchedCount,
    passed: matchedCount > 0,
  };
}

function buildNumericWhere(
  dbField: string,
  operator: string,
  value: number
): Record<string, unknown> {
  const opMap: Record<string, string> = {
    gt: "gt",
    lt: "lt",
    eq: "equals",
    gte: "gte",
    lte: "lte",
  };
  const prismaOp = opMap[operator] || "equals";

  if (prismaOp === "equals") {
    return { [dbField]: value };
  }
  return { [dbField]: { [prismaOp]: value } };
}

// ── Action execution ─────────────────────────────────────────

async function executeAction(action: ActionDef, conditionResults: ConditionResult[]): Promise<{ type: string; success: boolean; userCount?: number; error?: string }> {
  switch (action.type) {
    case "create_alert": {
      const severity = action.params.severity || "WARNING";
      const title = action.params.title || "Automation Alert";
      const totalMatched = conditionResults.reduce((sum, c) => sum + c.matchedCount, 0);

      await db.adminAlert.create({
        data: {
          type: "SYSTEM",
          severity,
          title,
          body: `Automation matched ${totalMatched} record(s). Conditions: ${conditionResults.map((c) => `${c.field} ${c.operator} ${c.value}`).join(", ")}`,
        },
      });
      return { type: "create_alert", success: true };
    }

    case "send_notification": {
      const notifTitle = action.params.title || "Notification";
      const notifBody = action.params.body || "";

      // Gather user IDs from condition matches (health_score or churn_risk targets profiles)
      const profiles = await db.patientProfile.findMany({
        select: { userId: true },
        take: 500,
      });

      if (profiles.length > 0) {
        await db.notification.createMany({
          data: profiles.map((p) => ({
            userId: p.userId,
            type: "SYSTEM" as const,
            title: notifTitle,
            body: notifBody,
          })),
        });
      }
      return { type: "send_notification", success: true, userCount: profiles.length };
    }

    default:
      return { type: action.type, success: false, error: "Unknown action type" };
  }
}

// ── Execute a rule ───────────────────────────────────────────

export async function executeAutomationRule(ruleId: string) {
  const rule = await db.automationRule.findUnique({ where: { id: ruleId } });
  if (!rule) throw new Error("Rule not found");

  // Cooldown check
  if (rule.lastTriggeredAt) {
    const cooldownMs = rule.cooldownMinutes * 60 * 1000;
    const elapsed = Date.now() - rule.lastTriggeredAt.getTime();
    if (elapsed < cooldownMs) {
      const execution = await db.automationExecution.create({
        data: {
          ruleId,
          status: "SKIPPED",
          details: { reason: "Cooldown period not elapsed", cooldownMinutes: rule.cooldownMinutes, elapsedMs: elapsed },
        },
      });
      return { execution, skipped: true };
    }
  }

  const conditions = (rule.conditions as unknown as Condition[]) || [];
  const actions = (rule.actions as unknown as ActionDef[]) || [];

  // Evaluate all conditions
  const conditionResults: ConditionResult[] = [];
  for (const condition of conditions) {
    const result = await evaluateCondition(condition);
    conditionResults.push(result);
  }

  const allConditionsMet = conditionResults.length === 0 || conditionResults.every((c) => c.passed);

  if (!allConditionsMet) {
    const execution = await db.automationExecution.create({
      data: {
        ruleId,
        status: "SKIPPED",
        details: JSON.parse(JSON.stringify({ reason: "Conditions not met", conditionResults })),
      },
    });

    return { execution, skipped: true };
  }

  // Execute all actions
  const actionResults: { type: string; success: boolean; userCount?: number; error?: string }[] = [];
  const errors: { action: string; error: string }[] = [];

  for (const action of actions) {
    try {
      const result = await executeAction(action, conditionResults);
      actionResults.push(result);
    } catch (err) {
      errors.push({ action: action.type, error: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  const status = errors.length > 0 ? "FAILED" : "SUCCESS";

  const execution = await db.automationExecution.create({
    data: {
      ruleId,
      status,
      details: JSON.parse(JSON.stringify({ conditionResults, actionsExecuted: actionResults, errors })),
    },
  });

  // Update rule trigger metadata
  await db.automationRule.update({
    where: { id: ruleId },
    data: {
      lastTriggeredAt: new Date(),
      triggerCount: { increment: 1 },
    },
  });

  return { execution, skipped: false };
}
