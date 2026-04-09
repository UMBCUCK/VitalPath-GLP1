import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { stateCode, isAvailable } = body;

    if (!stateCode || typeof isAvailable !== "boolean") {
      return NextResponse.json(
        { error: "stateCode and isAvailable are required" },
        { status: 400 }
      );
    }

    const updated = await db.stateAvailability.update({
      where: { stateCode },
      data: { isAvailable },
    });

    return NextResponse.json({ state: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update state" }, { status: 500 });
  }
}
