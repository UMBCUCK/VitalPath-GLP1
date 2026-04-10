import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { firstName, lastName, phone } = await req.json();

    await db.user.update({
      where: { id: session.userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Profile API]", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
