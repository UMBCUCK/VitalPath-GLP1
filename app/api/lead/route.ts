import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/funnel";
import { db } from "@/lib/db";
import { trackServerEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { email, name, source, phone } = parsed.data;

    // Persist to database — upsert to avoid duplicates
    await db.lead.upsert({
      where: { email },
      update: {
        name: name || undefined,
        source: source || undefined,
        phone: phone || undefined,
      },
      create: {
        email,
        name: name || null,
        source: source || "website",
        phone: phone || null,
      },
    });

    // Track server-side for Meta CAPI
    await trackServerEvent("Lead", { email }, {
      lead_source: source,
      lead_name: name,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Lead API] Failed to capture lead");
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
  }
}
