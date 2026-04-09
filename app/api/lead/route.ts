import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/funnel";
import { db } from "@/lib/db";
import { trackServerEvent } from "@/lib/analytics";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { safeError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  // Rate limit: 10 lead captures per minute per IP
  const { success } = await rateLimit(getRateLimitKey(req, "lead"), {
    maxTokens: 10,
  });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

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
    safeError("[Lead API]", error);
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
  }
}
