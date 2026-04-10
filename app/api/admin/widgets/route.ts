import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getWidgetLayout, saveWidgetLayout, type WidgetConfig } from "@/lib/admin-widgets";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const widgets = await getWidgetLayout(session.userId);
  return NextResponse.json({ widgets });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const widgets: WidgetConfig[] = body.widgets;

    if (!Array.isArray(widgets)) {
      return NextResponse.json(
        { error: "widgets must be an array" },
        { status: 400 }
      );
    }

    // Validate each widget has required fields
    for (const widget of widgets) {
      if (!widget.id || !widget.type || !widget.position) {
        return NextResponse.json(
          { error: "Each widget must have id, type, and position" },
          { status: 400 }
        );
      }
    }

    await saveWidgetLayout(session.userId, widgets);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
