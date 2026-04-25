/**
 * /api/auth/magic-link
 * ─────────────────────────────────────────────────────────────
 * Tier 13.2 — Passwordless login backed by OpenLoop. Flow:
 *
 *   1. Client POSTs { email }
 *   2. Server checks: does this email map to a local User?
 *      Yes → ok, send magic link
 *      No  → fall through to OpenLoop check
 *   3. Server checks OpenLoop: findPatientByEmail(email)
 *      Yes → auto-create local User + PatientProfile, link
 *            telehealthPatientId, send magic link
 *      No  → return 200 anyway (anti-enumeration); silently noop
 *   4. Magic link is a 15-minute signed JWT. Click → /api/auth/magic-link/verify
 *
 * Anti-enumeration: we always respond { ok: true } even when the email
 * isn't recognized, to prevent attackers from probing valid emails.
 *
 * Rate limiting: 5 sends per 5 minutes per IP via the existing
 * rate-limit helper, capped to 20 per email per day to prevent abuse.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SignJWT } from "jose";
import { db } from "@/lib/db";
import { JWT_SECRET } from "@/lib/constants";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { createTelehealthService } from "@/lib/services/telehealth";
import { sendLifecycleEmail, magicLinkSignInEmail } from "@/lib/services/lifecycle-emails";
import { safeError, safeLog } from "@/lib/logger";

const MAGIC_LINK_TTL_SECONDS = 15 * 60; // 15 minutes
const PER_EMAIL_DAILY_CAP = 20;

const schema = z.object({
  email: z.string().email().toLowerCase().trim(),
  redirect: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  // Per-IP rate limit — 5 per minute window (matches the rest of the auth flow)
  const { success } = await rateLimit(getRateLimitKey(req, "magic-link"), {
    maxTokens: 5,
    windowSeconds: 60,
  });
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const { email, redirect } = parsed.data;

    // Per-email daily cap (counted via Lead.metadata for simplicity — no new
    // table). We tag a Lead row with the email + day; if we exceed the cap,
    // silently no-op (still return 200 to avoid leaking the limit).
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sentToday = await db.lead.count({
      where: {
        email,
        source: "magic_link",
        createdAt: { gte: today },
      },
    });
    if (sentToday >= PER_EMAIL_DAILY_CAP) {
      safeLog("[Magic Link]", `Daily cap hit for ${email} (${sentToday})`);
      return NextResponse.json({ ok: true });
    }

    // 1) Local lookup
    let user = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true, role: true },
    });

    // 2) If not local, try OpenLoop. If they're a real telehealth patient,
    //    auto-provision a local User + PatientProfile so they can sign in.
    if (!user) {
      try {
        const telehealth = createTelehealthService();
        const olPatient = await telehealth.findPatientByEmail(email);
        if (olPatient) {
          user = await db.user.create({
            data: {
              email,
              firstName: olPatient.firstName || null,
              lastName: olPatient.lastName || null,
              phone: olPatient.phone || null,
              role: "PATIENT",
              profile: {
                create: {
                  telehealthPatientId: olPatient.externalId,
                  state: olPatient.state || null,
                },
              },
            },
            select: { id: true, email: true, firstName: true, role: true },
          });
          safeLog(
            "[Magic Link]",
            `Auto-provisioned local user from OpenLoop patient for ${email}`,
          );
        }
      } catch (err) {
        // OpenLoop API hiccup — fall through to "no match" with 200.
        safeError("[Magic Link] OpenLoop lookup failed", err);
      }
    }

    // 3) No match anywhere → return 200 anyway (anti-enumeration)
    if (!user) {
      // Track the unmatched attempt so we can refine the funnel later.
      await db.lead
        .upsert({
          where: { email },
          update: { metadata: { lastMagicLinkUnmatchedAt: new Date().toISOString() } },
          create: {
            email,
            source: "magic_link_unmatched",
            metadata: { lastMagicLinkUnmatchedAt: new Date().toISOString() },
          },
        })
        .catch(() => undefined);
      return NextResponse.json({ ok: true });
    }

    // 4) Sign a 15-min magic-link token with the user id + role
    const token = await new SignJWT({
      uid: user.id,
      em: user.email,
      role: user.role,
      kind: "magic-link",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${MAGIC_LINK_TTL_SECONDS}s`)
      .sign(JWT_SECRET);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
    const safeRedirect =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/dashboard";
    const link = `${appUrl}/api/auth/magic-link/verify?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(safeRedirect)}`;

    // 5) Send email
    try {
      const tmpl = magicLinkSignInEmail(user.firstName ?? undefined, link);
      await sendLifecycleEmail(email, tmpl, ["magic-link-signin"]);
    } catch (err) {
      safeError("[Magic Link] Email send failed", err);
      // Still return 200 — don't reveal email-delivery failures
    }

    // Track for daily cap counting
    await db.lead
      .create({
        data: {
          email,
          source: "magic_link",
          name: user.firstName ?? null,
          metadata: { sentAt: new Date().toISOString() },
        },
      })
      .catch(() => undefined);

    return NextResponse.json({ ok: true });
  } catch (error) {
    safeError("[Magic Link]", error);
    // Generic 500 — don't reveal details
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
