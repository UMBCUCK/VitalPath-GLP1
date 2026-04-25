import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loginUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { createTelehealthService } from "@/lib/services/telehealth";
import { safeError, safeLog } from "@/lib/logger";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  // Rate limit: 5 attempts per minute per IP
  const { success, remaining } = await rateLimit(getRateLimitKey(req, "auth-login"), {
    maxTokens: 5,
  });

  if (!success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const result = await loginUser(parsed.data.email, parsed.data.password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Tier 13.5 — Auto-link OpenLoop patient on every login if missing.
    // Best-effort, non-blocking: if the API call fails, the login still
    // succeeds. The portal continues to function without an OpenLoop
    // link until the next sync.
    if (result.user?.id) {
      const profile = await db.patientProfile.findUnique({
        where: { userId: result.user.id },
        select: { id: true, telehealthPatientId: true },
      });
      if (!profile?.telehealthPatientId) {
        try {
          const telehealth = createTelehealthService();
          const olPatient = await telehealth.findPatientByEmail(
            parsed.data.email.toLowerCase().trim(),
          );
          if (olPatient) {
            if (profile) {
              await db.patientProfile.update({
                where: { id: profile.id },
                data: { telehealthPatientId: olPatient.externalId },
              });
            } else {
              await db.patientProfile.create({
                data: {
                  userId: result.user.id,
                  telehealthPatientId: olPatient.externalId,
                  state: olPatient.state || null,
                },
              });
            }
            safeLog(
              "[Login]",
              `Linked OpenLoop patient ${olPatient.externalId} for ${parsed.data.email}`,
            );
          }
        } catch (err) {
          safeError("[Login] OpenLoop backfill failed", err);
        }
      }
    }

    const response = NextResponse.json({ user: result.user });
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  } catch (error) {
    safeError("[Login API]", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
