import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getPlaybooks,
  createPlaybook,
  updatePlaybook,
  deletePlaybook,
  getPlaybookDetail,
  enrollUser,
  advanceStep,
  convertEnrollment,
  exitEnrollment,
  evaluatePlaybookTriggers,
} from "@/lib/admin-retention-playbooks";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Number(searchParams.get("limit")) || 20);

  try {
    if (id) {
      const detail = await getPlaybookDetail(id);
      if (!detail) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(detail);
    }

    const result = await getPlaybooks(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Playbooks GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // Evaluate triggers
    if (action === "evaluate") {
      const count = await evaluatePlaybookTriggers();
      return NextResponse.json({ enrolled: count });
    }

    // Enroll user
    if (action === "enroll") {
      const { playbookId, userId } = body;
      if (!playbookId || !userId) {
        return NextResponse.json({ error: "playbookId and userId required" }, { status: 400 });
      }
      const enrollment = await enrollUser(playbookId, userId);
      return NextResponse.json(enrollment);
    }

    // Create playbook
    const { name, triggerType, triggerConfig, steps } = body;
    if (!name || !triggerType || !steps) {
      return NextResponse.json({ error: "name, triggerType, and steps required" }, { status: 400 });
    }

    const playbook = await createPlaybook({
      name,
      triggerType,
      triggerConfig: triggerConfig || {},
      steps,
      createdBy: session.userId,
    });

    return NextResponse.json(playbook, { status: 201 });
  } catch (error) {
    console.error("Playbooks POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, id } = body;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    // Advance step
    if (action === "advance") {
      const result = await advanceStep(id);
      if (!result) {
        return NextResponse.json({ error: "Enrollment not found or not active" }, { status: 404 });
      }
      return NextResponse.json(result);
    }

    // Convert enrollment
    if (action === "convert") {
      const result = await convertEnrollment(id);
      if (!result) {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
      }
      return NextResponse.json(result);
    }

    // Exit enrollment
    if (action === "exit") {
      const { reason } = body;
      const result = await exitEnrollment(id, reason || "Manual exit");
      return NextResponse.json(result);
    }

    // Update playbook
    const { name, triggerType, triggerConfig, steps, isActive } = body;
    const playbook = await updatePlaybook(id, {
      name,
      triggerType,
      triggerConfig,
      steps,
      isActive,
    });

    return NextResponse.json(playbook);
  } catch (error) {
    console.error("Playbooks PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    await deletePlaybook(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Playbooks DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
