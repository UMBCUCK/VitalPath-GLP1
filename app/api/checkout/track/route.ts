import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, planSlug, source } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await db.lead.create({
      data: {
        email,
        source: source || "checkout_abandon",
        metadata: { planSlug, visitedAt: new Date().toISOString() },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Checkout Track]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
