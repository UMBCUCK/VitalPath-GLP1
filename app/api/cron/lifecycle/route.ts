/**
 * /api/cron/lifecycle
 * ─────────────────────────────────────────────────────────────
 * Tier 5.2 — Runs all time-based lifecycle email triggers. Designed to be
 * invoked by a scheduler (Vercel Cron, Railway cron, external uptime
 * robot) on an hourly cadence.
 *
 * Auth: pass header `x-cron-secret: <CRON_SECRET>` matching env var.
 *       This prevents random traffic from running the entire email fleet.
 *
 * Triggers wired today:
 *   1. Qualify abandonment — leads created >2h ago, never became a user,
 *      and haven't already received the recovery email. Fires
 *      qualifyResumeEmail with a magic-link JWT.
 *   2. Peptide intro (day 30) — active subscriptions exactly 30 days old,
 *      where user has no HEALTHY_AGING add-on. Fires peptideIntroEmail via
 *      sendPeptideIntro() which consults the upsell engine.
 *   3. Welcome day-3 / day-7 — active users at those intervals.
 *
 * Idempotency: writes a row to Notification on success so the same
 * user can't be paged twice for the same trigger.
 *
 * Response: JSON summary `{ sent: { qualify_resume, peptide_intro,
 * welcome_day3, welcome_day7 }, skipped, errors[] }`
 */
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { db } from "@/lib/db";
import { JWT_SECRET } from "@/lib/constants";
import {
  qualifyResumeEmail,
  welcomeSequence,
  sendLifecycleEmail,
  sendPeptideIntro,
} from "@/lib/services/lifecycle-emails";
import { safeError, safeLog } from "@/lib/logger";

const RESUME_TOKEN_TTL = 60 * 60 * 24 * 14; // 14 days

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  return runLifecycle(req);
}

export async function POST(req: NextRequest) {
  return runLifecycle(req);
}

async function runLifecycle(req: NextRequest) {
  // Shared-secret auth — required in production, optional in dev
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const provided = req.headers.get("x-cron-secret") || req.nextUrl.searchParams.get("secret");
    if (provided !== expected) return unauthorized();
  }

  const now = Date.now();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

  const sent = {
    qualify_resume: 0,
    peptide_intro: 0,
    welcome_day3: 0,
    welcome_day7: 0,
  };
  const errors: string[] = [];

  // ─── Trigger 1: Qualify abandonment ──────────────────────────
  // Leads older than 2h, not yet converted, no prior recovery record.
  try {
    const cutoff = new Date(now - 2 * 60 * 60 * 1000);
    const horizon = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const staleLeads = await db.lead.findMany({
      where: {
        createdAt: { lt: cutoff, gt: horizon },
        convertedAt: null,
        source: { in: ["qualify_bridge_step2", "qualify_text_link", "exit_intent"] },
      },
      select: { id: true, email: true, name: true, metadata: true },
      take: 100,
    });

    for (const lead of staleLeads) {
      const meta = (lead.metadata as Record<string, unknown> | null) ?? {};
      if ((meta as { recoveryEmailSent?: boolean }).recoveryEmailSent) continue;

      try {
        const token = await new SignJWT({ lid: lead.id, kind: "lead-resume" })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime(`${RESUME_TOKEN_TTL}s`)
          .sign(JWT_SECRET);
        const resumeUrl = `${appUrl}/qualify?resume=${encodeURIComponent(token)}`;
        const template = qualifyResumeEmail(lead.name ?? undefined, resumeUrl);
        await sendLifecycleEmail(lead.email, template, ["qualify-resume"]);
        await db.lead.update({
          where: { id: lead.id },
          data: {
            metadata: {
              ...meta,
              recoveryEmailSent: true,
              recoveryEmailSentAt: new Date().toISOString(),
            },
          },
        });
        sent.qualify_resume++;
      } catch (err) {
        errors.push(`qualify_resume:${lead.email}`);
        safeError("[Cron qualify_resume]", err);
      }
    }
  } catch (err) {
    errors.push("qualify_resume:batch");
    safeError("[Cron qualify_resume batch]", err);
  }

  // ─── Trigger 2: Peptide intro at day 30 ──────────────────────
  try {
    const windowStart = new Date(now - 31 * 24 * 60 * 60 * 1000);
    const windowEnd = new Date(now - 29 * 24 * 60 * 60 * 1000);
    const subs = await db.subscription.findMany({
      where: {
        status: "ACTIVE",
        createdAt: { gte: windowStart, lte: windowEnd },
      },
      select: { userId: true },
      take: 200,
    });

    // Dedupe by userId (a user may have multiple active subs)
    const userIds = Array.from(new Set(subs.map((s) => s.userId)));

    for (const userId of userIds) {
      // Idempotency — has a peptide-intro notification already been recorded?
      const already = await db.notification.findFirst({
        where: {
          userId,
          type: "SYSTEM",
          metadata: { path: ["tag"], equals: "peptide_intro_day30" } as unknown as object,
        },
      });
      if (already) continue;

      try {
        const result = await sendPeptideIntro(userId);
        if (result.sent) {
          await db.notification.create({
            data: {
              userId,
              type: "SYSTEM",
              title: "Day 30: peptides unlocked",
              body: "Learn about adding provider-supervised peptides to your plan.",
              link: "/dashboard/shop",
              metadata: { tag: "peptide_intro_day30" },
            },
          });
          sent.peptide_intro++;
        }
      } catch (err) {
        errors.push(`peptide_intro:${userId}`);
        safeError("[Cron peptide_intro]", err);
      }
    }
  } catch (err) {
    errors.push("peptide_intro:batch");
    safeError("[Cron peptide_intro batch]", err);
  }

  // ─── Trigger 3: Welcome day 3 and day 7 ──────────────────────
  for (const { day, key, template } of [
    { day: 3, key: "welcome_day3" as const, template: welcomeSequence.day3 },
    { day: 7, key: "welcome_day7" as const, template: welcomeSequence.day7 },
  ]) {
    try {
      const windowStart = new Date(now - (day + 1) * 24 * 60 * 60 * 1000);
      const windowEnd = new Date(now - day * 24 * 60 * 60 * 1000);
      const users = await db.user.findMany({
        where: {
          createdAt: { gte: windowStart, lte: windowEnd },
          subscriptions: { some: { status: "ACTIVE" } },
        },
        select: { id: true, email: true, firstName: true },
        take: 200,
      });

      for (const user of users) {
        const tag = `welcome_day${day}`;
        const already = await db.notification.findFirst({
          where: {
            userId: user.id,
            type: "SYSTEM",
            metadata: { path: ["tag"], equals: tag } as unknown as object,
          },
        });
        if (already) continue;

        try {
          await sendLifecycleEmail(user.email, template(user.firstName || "there"), [tag]);
          await db.notification.create({
            data: {
              userId: user.id,
              type: "SYSTEM",
              title: `Day ${day} check-in`,
              body: "Tips for getting the most out of your plan.",
              link: "/dashboard",
              metadata: { tag },
            },
          });
          sent[key]++;
        } catch (err) {
          errors.push(`${tag}:${user.id}`);
          safeError(`[Cron ${tag}]`, err);
        }
      }
    } catch (err) {
      errors.push(`welcome_day${day}:batch`);
      safeError(`[Cron welcome_day${day} batch]`, err);
    }
  }

  safeLog("[Cron lifecycle]", `sent=${JSON.stringify(sent)} errors=${errors.length}`);

  return NextResponse.json({ ok: true, sent, errors });
}
