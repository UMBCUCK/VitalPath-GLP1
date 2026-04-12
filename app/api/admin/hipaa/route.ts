import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getHipaaAuditLog,
  getDataRequests,
  createDataRequest,
  processDataRequest,
  getHipaaMetrics,
} from "@/lib/admin-hipaa";
import { safeError } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "metrics") {
      const metrics = await getHipaaMetrics();
      return NextResponse.json(metrics);
    }

    if (action === "requests") {
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "25");
      const status = url.searchParams.get("status") || undefined;
      const data = await getDataRequests(page, limit, status);
      return NextResponse.json(data);
    }

    // Default: audit log
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const actionFilter = url.searchParams.get("actionFilter") || undefined;
    const resourceType = url.searchParams.get("resourceType") || undefined;
    const patientId = url.searchParams.get("patientId") || undefined;

    const data = await getHipaaAuditLog(page, limit, actionFilter, resourceType, patientId);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin HIPAA GET]", error);
    return NextResponse.json({ error: "Failed to fetch HIPAA data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { userId, type } = body;

    if (!userId || !type) {
      return NextResponse.json({ error: "userId and type are required" }, { status: 400 });
    }

    const request = await createDataRequest(userId, type);
    return NextResponse.json({ request });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin HIPAA POST]", error);
    return NextResponse.json({ error: "Failed to create data request" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    const { id, action, notes, exportUrl } = body;

    if (!id || !action) {
      return NextResponse.json({ error: "id and action required" }, { status: 400 });
    }

    const request = await processDataRequest(id, action, session.userId, notes, exportUrl);
    return NextResponse.json({ request });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin HIPAA PUT]", error);
    return NextResponse.json({ error: "Failed to process data request" }, { status: 500 });
  }
}
