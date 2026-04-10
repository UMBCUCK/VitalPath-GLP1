import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  searchAuditTrail,
  getEntityTimeline,
  getAuditStats,
  exportAuditTrail,
  getAuditFilterOptions,
} from "@/lib/admin-audit-trail";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.searchParams;
  const mode = url.get("mode"); // "search" | "timeline" | "stats" | "export" | "filters"

  if (mode === "stats") {
    const from = url.get("from") ? new Date(url.get("from")!) : undefined;
    const to = url.get("to") ? new Date(url.get("to")!) : undefined;
    const stats = await getAuditStats(from, to);
    return NextResponse.json(stats);
  }

  if (mode === "timeline") {
    const entity = url.get("entity") ?? "";
    const entityId = url.get("entityId") ?? "";
    if (!entity || !entityId) {
      return NextResponse.json({ error: "entity and entityId required" }, { status: 400 });
    }
    const timeline = await getEntityTimeline(entity, entityId);
    return NextResponse.json(timeline);
  }

  if (mode === "filters") {
    const options = await getAuditFilterOptions();
    return NextResponse.json(options);
  }

  // Build search params
  const params = {
    page: parseInt(url.get("page") ?? "1"),
    limit: parseInt(url.get("limit") ?? "25"),
    search: url.get("search") ?? undefined,
    adminId: url.get("adminId") ?? undefined,
    entity: url.get("entity") ?? undefined,
    action: url.get("action") ?? undefined,
    from: url.get("from") ? new Date(url.get("from")!) : undefined,
    to: url.get("to") ? new Date(url.get("to")!) : undefined,
  };

  if (mode === "export") {
    const csv = await exportAuditTrail(params);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="audit-trail-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const data = await searchAuditTrail(params);
  return NextResponse.json(data);
}
