/**
 * /api/meta-view-content
 * ─────────────────────────────────────────────────────────────
 * Tier 5.1 — Fires Meta CAPI ViewContent for key funnel pages.
 *
 * ViewContent is the warm-audience signal Facebook Ads uses to build
 * retargeting pools and to optimize for mid-funnel actions. Without it,
 * campaigns optimized for "Purchase" or "Lead" can only learn from
 * far-funnel events — which hurts smaller-budget accounts the most.
 *
 * Client calls this from any page that qualifies as "meaningful content":
 *   - /qualify (the funnel)
 *   - /peptides (+ any /peptides/[slug])
 *   - /medications/* product pages
 *   - /lp/* landing pages
 *
 * Body: { content_name, content_category?, value?, currency? }
 * If a session cookie exists we enrich with email+phone for advanced matching.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { trackServerEvent } from "@/lib/analytics";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { safeError } from "@/lib/logger";

const schema = z.object({
  content_name: z.string().min(1).max(200),
  content_category: z.string().max(80).optional(),
  content_ids: z.array(z.string().max(80)).max(20).optional(),
  value: z.number().optional(),
  currency: z.string().length(3).optional(),
});

export async function POST(req: NextRequest) {
  // Generous rate-limit — this fires on every page view
  const { success } = await rateLimit(getRateLimitKey(req, "meta-view"), {
    maxTokens: 60,
  });
  if (!success) {
    return NextResponse.json({ ok: true, skipped: "rate_limit" });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Best-effort advanced matching if the visitor is logged in
    let email: string | undefined;
    let phone: string | undefined;
    try {
      const session = await getSession();
      if (session?.userId) {
        const user = await db.user.findUnique({
          where: { id: session.userId },
          select: { email: true, phone: true },
        });
        email = user?.email;
        phone = user?.phone ?? undefined;
      }
    } catch {
      // Not logged in — proceed with anonymous ViewContent
    }

    await trackServerEvent(
      "ViewContent",
      {
        email,
        phone,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
        userAgent: req.headers.get("user-agent") || undefined,
      },
      {
        content_name: parsed.data.content_name,
        content_category: parsed.data.content_category,
        ...(parsed.data.content_ids ? { content_ids: parsed.data.content_ids.join(",") } : {}),
        ...(typeof parsed.data.value === "number" ? { value: parsed.data.value } : {}),
        currency: parsed.data.currency ?? "USD",
      },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    safeError("[Meta ViewContent]", error);
    // Never block the client
    return NextResponse.json({ ok: true, skipped: "error" });
  }
}
