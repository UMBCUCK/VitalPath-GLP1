import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getAutomationRules,
  createAutomationRule,
  updateAutomationRule,
  deleteAutomationRule,
  getAutomationExecutions,
} from "@/lib/admin-automations";
import { safeError } from "@/lib/logger";

// ── GET: List rules (with optional execution history) ────────

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdmin();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
    const ruleId = searchParams.get("ruleId");

    // If ruleId provided, return execution history for that rule
    if (ruleId) {
      const data = await getAutomationExecutions(ruleId, page, limit);
      return NextResponse.json(data);
    }

    const data = await getAutomationRules(page, limit);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Automations GET]", error);
    return NextResponse.json({ error: "Failed to fetch automation rules" }, { status: 500 });
  }
}

// ── POST: Create rule ────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();

    const { name, description, triggerType, conditions, actions, cooldownMinutes } = body;

    if (!name || !triggerType || !conditions || !actions) {
      return NextResponse.json(
        { error: "name, triggerType, conditions, and actions are required" },
        { status: 400 }
      );
    }

    const validTriggers = ["SCHEDULE", "EVENT", "THRESHOLD"];
    if (!validTriggers.includes(triggerType)) {
      return NextResponse.json(
        { error: `triggerType must be one of: ${validTriggers.join(", ")}` },
        { status: 400 }
      );
    }

    const rule = await createAutomationRule({
      name,
      description,
      triggerType,
      conditions,
      actions,
      cooldownMinutes: cooldownMinutes ?? 60,
      createdBy: session.userId,
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Automations POST]", error);
    return NextResponse.json({ error: "Failed to create automation rule" }, { status: 500 });
  }
}

// ── PUT: Update rule ─────────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Rule ID is required" }, { status: 400 });
    }

    const rule = await updateAutomationRule(id, updates);
    return NextResponse.json({ rule });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Automations PUT]", error);
    return NextResponse.json({ error: "Failed to update automation rule" }, { status: 500 });
  }
}

// ── DELETE: Soft-delete (deactivate) ─────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Rule ID is required" }, { status: 400 });
    }

    await deleteAutomationRule(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Automations DELETE]", error);
    return NextResponse.json({ error: "Failed to deactivate rule" }, { status: 500 });
  }
}
