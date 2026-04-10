import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

export async function GET() {
  try {
    await requireAdmin();

    const codes = await db.referralCode.findMany({
      where: { isActive: true },
      orderBy: { totalReferred: "desc" },
      take: 100,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    const referrals = codes.map((c) => ({
      code: c.code,
      userName: [c.user.firstName, c.user.lastName].filter(Boolean).join(" ") || c.user.email,
      totalReferred: c.totalReferred,
    }));

    return NextResponse.json({ referrals });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Widget Referrals API]", error);
    return NextResponse.json({ referrals: [] });
  }
}
