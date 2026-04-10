import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getSegments,
  createSegment,
  updateSegment,
  deleteSegment,
  computeSegmentMembers,
  previewSegment,
  exportSegment,
} from "@/lib/admin-advanced-segments";
import type { SegmentRules } from "@/lib/admin-advanced-segments";
import { safeError } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // Preview: real-time count without saving
    if (action === "preview") {
      const rulesParam = url.searchParams.get("rules");
      if (!rulesParam) {
        return NextResponse.json({ error: "rules parameter required" }, { status: 400 });
      }
      try {
        const rules = JSON.parse(rulesParam) as SegmentRules;
        const result = await previewSegment(rules);
        return NextResponse.json({ preview: result });
      } catch {
        return NextResponse.json({ error: "Invalid rules JSON" }, { status: 400 });
      }
    }

    // Export
    if (action === "export") {
      const segmentId = url.searchParams.get("segmentId");
      const format = (url.searchParams.get("format") || "csv") as "csv" | "json";
      if (!segmentId) {
        return NextResponse.json({ error: "segmentId required" }, { status: 400 });
      }
      const result = await exportSegment(segmentId, format);
      return new NextResponse(result.data, {
        headers: {
          "Content-Type": result.contentType,
          "Content-Disposition": `attachment; filename="${result.filename}"`,
        },
      });
    }

    // Compute members for a segment
    if (action === "compute") {
      const segmentId = url.searchParams.get("segmentId");
      if (!segmentId) {
        return NextResponse.json({ error: "segmentId required" }, { status: 400 });
      }
      const result = await computeSegmentMembers(segmentId);
      return NextResponse.json({ result });
    }

    // Default: list segments
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const data = await getSegments(page, limit);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Advanced Segments GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch segments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();

    const body = await req.json();
    const { name, description, rules, isActive, autoTrigger } = body;

    if (!name || !rules) {
      return NextResponse.json(
        { error: "name and rules are required" },
        { status: 400 }
      );
    }

    const segment = await createSegment({
      name,
      description,
      rules,
      isActive,
      autoTrigger,
      createdBy: session.userId,
    });

    return NextResponse.json({ segment });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Advanced Segments POST]", error);
    return NextResponse.json(
      { error: "Failed to create segment" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Segment id required" }, { status: 400 });
    }

    const segment = await updateSegment(id, data);

    // Auto-compute if rules changed
    if (data.rules) {
      const result = await computeSegmentMembers(id);
      return NextResponse.json({ segment, computed: result });
    }

    return NextResponse.json({ segment });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Advanced Segments PUT]", error);
    return NextResponse.json(
      { error: "Failed to update segment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Segment id required" }, { status: 400 });
    }

    await deleteSegment(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    safeError("[Admin Advanced Segments DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete segment" },
      { status: 500 }
    );
  }
}
