import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { executeAutomationRule } from "@/lib/admin-automations";
import { safeError } from "@/lib/logger";

// ── POST: Execute a rule manually ────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const { ruleId } = body;
    if (!ruleId) {
      return NextResponse.json({ error: "ruleId is required" }, { status: 400 });
    }

    const result = await executeAutomationRule(ruleId);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message === "Rule not found") {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }
    safeError("[Admin Automations Execute]", error);
    return NextResponse.json({ error: "Failed to execute rule" }, { status: 500 });
  }
}
