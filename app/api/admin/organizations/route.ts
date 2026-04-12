import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  getOrganizationDetail,
  addOrganizationMember,
  removeOrganizationMember,
  getOrganizationMetrics,
} from "@/lib/admin-organizations";
import { safeError } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "metrics") {
      const metrics = await getOrganizationMetrics();
      return NextResponse.json(metrics);
    }

    if (action === "detail") {
      const id = url.searchParams.get("id");
      if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
      const detail = await getOrganizationDetail(id);
      if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(detail);
    }

    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "25");
    const type = url.searchParams.get("type") || undefined;

    const data = await getOrganizations(page, limit, type);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Organizations GET]", error);
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { action, ...data } = body;

    if (action === "addMember") {
      const { orgId, userId, role } = data;
      if (!orgId || !userId) {
        return NextResponse.json({ error: "orgId and userId required" }, { status: 400 });
      }
      const member = await addOrganizationMember(orgId, userId, role);
      return NextResponse.json({ member });
    }

    if (action === "removeMember") {
      const { orgId, userId } = data;
      if (!orgId || !userId) {
        return NextResponse.json({ error: "orgId and userId required" }, { status: 400 });
      }
      await removeOrganizationMember(orgId, userId);
      return NextResponse.json({ ok: true });
    }

    // Create organization
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }
    const org = await createOrganization(data);
    return NextResponse.json({ organization: org });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Organizations POST]", error);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Organization ID required" }, { status: 400 });

    const org = await updateOrganization(id, data);
    return NextResponse.json({ organization: org });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Organizations PUT]", error);
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}
