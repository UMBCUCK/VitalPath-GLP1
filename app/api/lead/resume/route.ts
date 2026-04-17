/**
 * /api/lead/resume
 * ─────────────────────────────────────────────────────────────
 * GET  ?token=<jwt>  → verify token, return Lead + saved qualify snapshot
 * POST { email }      → generate signed resume URL and fire recovery email
 *
 * Tokens are signed HS256 with JWT_SECRET, expire in 14 days.
 * This endpoint is how abandoned-qualify droppers re-enter the funnel
 * pre-filled with everything they answered before bailing.
 */
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { db } from "@/lib/db";
import { JWT_SECRET } from "@/lib/constants";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { createEmailService } from "@/lib/services/email";
import { qualifyResumeEmail } from "@/lib/services/lifecycle-emails";
import { safeError } from "@/lib/logger";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const leadId = (payload as { lid?: string }).lid;
    if (!leadId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const lead = await db.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        state: true,
        metadata: true,
        convertedAt: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // If already converted, nudge them to log in instead
    if (lead.convertedAt) {
      return NextResponse.json({
        ok: true,
        converted: true,
        email: lead.email,
      });
    }

    return NextResponse.json({
      ok: true,
      email: lead.email,
      name: lead.name,
      phone: lead.phone,
      state: lead.state,
      snapshot: (lead.metadata as Record<string, unknown> | null)?.qualify ?? null,
    });
  } catch (error) {
    safeError("[Lead Resume GET]", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

const resumePostSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  // Rate limit: 5 recovery sends per minute per IP (prevents enumeration/spam)
  const { success } = await rateLimit(getRateLimitKey(req, "lead-resume"), {
    maxTokens: 5,
  });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  try {
    const body = await req.json();
    const parsed = resumePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const lead = await db.lead.findUnique({ where: { email: parsed.data.email } });

    // Return generic success whether or not lead exists (no email enumeration)
    if (!lead) {
      return NextResponse.json({ ok: true });
    }

    // Sign a short-lived resume token referencing the Lead
    const token = await new SignJWT({ lid: lead.id, kind: "lead-resume" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${TOKEN_TTL_SECONDS}s`)
      .sign(JWT_SECRET);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
    const resumeUrl = `${appUrl}/qualify?resume=${encodeURIComponent(token)}`;

    // Best-effort email send — adapter mocks in dev, Resend in prod
    const email = createEmailService();
    try {
      const tmpl = qualifyResumeEmail(lead.name ?? undefined, resumeUrl);
      await email.send({
        to: lead.email,
        subject: tmpl.subject,
        html: tmpl.html,
      });
    } catch (err) {
      safeError("[Lead Resume email]", err);
      // swallow — we still tell the caller we succeeded
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    safeError("[Lead Resume POST]", error);
    return NextResponse.json({ error: "Failed to send resume link" }, { status: 500 });
  }
}
