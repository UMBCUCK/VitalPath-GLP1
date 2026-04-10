import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { exportEntity } from "@/lib/admin-export";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity");
  const format = (searchParams.get("format") || "csv") as "csv" | "json";
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const status = searchParams.get("status") || undefined;

  if (!entity) {
    return NextResponse.json(
      { error: "entity parameter is required" },
      { status: 400 }
    );
  }

  const validEntities = ["customers", "orders", "subscriptions", "analytics", "consultations"];
  if (!validEntities.includes(entity)) {
    return NextResponse.json(
      { error: `Invalid entity. Must be one of: ${validEntities.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const result = await exportEntity(entity, { from, to, status }, format);

    return new Response(result.data, {
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
