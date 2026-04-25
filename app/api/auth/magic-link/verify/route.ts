/**
 * /api/auth/magic-link/verify
 * ─────────────────────────────────────────────────────────────
 * Tier 13.3 — Verifies the magic-link JWT, resolves the user, and
 * issues a session cookie. Then redirects to the requested page (or
 * /dashboard by default).
 *
 * Failure modes (all redirect to /login with a `?error=...` query):
 *   - Missing or malformed token         → ?error=link_invalid
 *   - Expired or signature mismatch      → ?error=link_expired
 *   - User no longer exists              → ?error=link_user_missing
 *
 * Side effects:
 *   - Creates a Session row + sets the `vp-session` httpOnly cookie
 *   - Tier 13.5: backfills PatientProfile.telehealthPatientId from
 *     OpenLoop if missing, on a best-effort basis.
 */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { JWT_SECRET } from "@/lib/constants";
import { createSession } from "@/lib/auth";
import { createTelehealthService } from "@/lib/services/telehealth";
import { safeError, safeLog } from "@/lib/logger";

function loginRedirect(req: NextRequest, error: string) {
  const url = new URL("/login", req.url);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const redirectParam = req.nextUrl.searchParams.get("redirect") ?? "/dashboard";

  if (!token) return loginRedirect(req, "link_invalid");

  // 1) Verify token
  let payload: { uid?: string; em?: string; role?: string; kind?: string };
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    payload = verified.payload as typeof payload;
  } catch {
    return loginRedirect(req, "link_expired");
  }

  if (payload.kind !== "magic-link" || !payload.uid || !payload.em) {
    return loginRedirect(req, "link_invalid");
  }

  // 2) Resolve user — re-pull to make sure they still exist + role hasn't drifted
  const user = await db.user.findUnique({
    where: { id: payload.uid },
    select: {
      id: true,
      email: true,
      role: true,
      profile: {
        select: { telehealthPatientId: true, id: true },
      },
    },
  });

  if (!user) return loginRedirect(req, "link_user_missing");
  if (user.email !== payload.em) {
    // Email changed since token was issued — refuse the stale token
    return loginRedirect(req, "link_invalid");
  }

  // 3) Tier 13.5 — best-effort OpenLoop backfill if the local profile has
  //    no telehealthPatientId. This is the moment a member auto-links
  //    their OpenLoop record to their portal account.
  if (!user.profile?.telehealthPatientId) {
    try {
      const telehealth = createTelehealthService();
      const olPatient = await telehealth.findPatientByEmail(user.email);
      if (olPatient) {
        if (user.profile) {
          await db.patientProfile.update({
            where: { id: user.profile.id },
            data: { telehealthPatientId: olPatient.externalId },
          });
        } else {
          await db.patientProfile.create({
            data: {
              userId: user.id,
              telehealthPatientId: olPatient.externalId,
            },
          });
        }
        safeLog("[Magic Link Verify]", `Linked OpenLoop patient for ${user.email}`);
      }
    } catch (err) {
      // Non-blocking — login still succeeds; backfill can run again next time
      safeError("[Magic Link Verify] OpenLoop backfill failed", err);
    }
  }

  // 4) Issue session cookie
  await createSession(user.id, user.email, user.role);

  // 5) Redirect — only allow same-origin redirects
  const safeRedirect =
    redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/dashboard";
  return NextResponse.redirect(new URL(safeRedirect, req.url));
}
