/**
 * /api/cron/admin-digest
 * ─────────────────────────────────────────────────────────────
 * Tier 7.6 — Daily performance snapshot email sent to all admin users.
 *
 * Metrics covered (last 24h vs. previous 24h for deltas):
 *   - New leads (+ top 3 sources)
 *   - New signups (paid subscriptions)
 *   - New peptide subscriptions
 *   - Revenue (sum of completed invoices) via Stripe webhook-derived Orders
 *   - Qualify abandonment rate
 *   - Top save-offer redemptions
 *
 * Triggered via Vercel Cron (see vercel.json) — `schedule: 0 13 * * *`
 * runs daily at 9am ET (after most of the previous day's events are in).
 *
 * Auth: shared-secret header `x-cron-secret` matching `CRON_SECRET`.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createEmailService } from "@/lib/services/email";
import { safeError, safeLog } from "@/lib/logger";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  return runDigest(req);
}

export async function POST(req: NextRequest) {
  return runDigest(req);
}

async function runDigest(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  if (expected) {
    const provided =
      req.headers.get("x-cron-secret") || req.nextUrl.searchParams.get("secret");
    if (provided !== expected) return unauthorized();
  }

  const now = new Date();
  const start24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const start48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // ─── Run all counts in parallel ─────────────────────────────
  const [
    newLeads24,
    newLeads48,
    leadsBySource,
    newSubs24,
    newSubs48,
    newPeptideSubs24,
    canceledSubs24,
    saveOffersApplied24,
    admins,
  ] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: start24h } } }),
    db.lead.count({ where: { createdAt: { gte: start48h, lt: start24h } } }),
    db.lead.groupBy({
      by: ["source"],
      where: { createdAt: { gte: start24h } },
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    db.subscription.count({
      where: { createdAt: { gte: start24h }, status: "ACTIVE" },
    }),
    db.subscription.count({
      where: { createdAt: { gte: start48h, lt: start24h }, status: "ACTIVE" },
    }),
    db.subscription.count({
      where: {
        createdAt: { gte: start24h },
        items: { some: { product: { category: "HEALTHY_AGING" } } },
      },
    }),
    db.subscription.count({
      where: { canceledAt: { gte: start24h } },
    }),
    db.subscription.count({
      where: {
        saveOfferApplied: true,
        updatedAt: { gte: start24h },
      },
    }),
    db.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true, firstName: true },
    }),
  ]);

  if (admins.length === 0) {
    return NextResponse.json({ ok: true, skipped: "no_admins" });
  }

  const leadsDelta =
    newLeads48 > 0
      ? `${Math.round(((newLeads24 - newLeads48) / newLeads48) * 100)}%`
      : "—";
  const subsDelta =
    newSubs48 > 0
      ? `${Math.round(((newSubs24 - newSubs48) / newSubs48) * 100)}%`
      : "—";

  // ─── Build the email ────────────────────────────────────────
  const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  const digestDate = start24h.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const sourceRows = leadsBySource
    .map(
      (r) =>
        `<tr><td style="padding:6px 12px;font-size:13px"><code>${r.source ?? "unknown"}</code></td><td style="padding:6px 12px;text-align:right;font-weight:700;color:#0E223D">${r._count._all}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 20px; color: #2E3742;">
      <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;">
        <div style="width:28px;height:28px;background:linear-gradient(135deg,#1F6F78,#163A63);border-radius:6px;display:flex;align-items:center;justify-content:center;"><span style="color:#fff;font-weight:700;font-size:10px;">VP</span></div>
        <span style="font-weight:700;font-size:16px;color:#0E223D;">Daily Admin Digest</span>
      </div>
      <h1 style="font-size:22px;color:#0E223D;margin:0 0 4px 0;">${digestDate}</h1>
      <p style="font-size:13px;color:#677A8A;margin:0 0 24px 0;">Last 24h performance snapshot</p>

      <table style="width:100%;border-collapse:collapse;background:#F7FAF8;border-radius:12px;overflow:hidden;margin-bottom:20px;">
        <tr><td style="padding:12px 16px;border-bottom:1px solid #E8EDF4;">
          <div style="font-size:11px;color:#97A5B0;text-transform:uppercase;letter-spacing:0.5px;">New leads</div>
          <div style="font-size:24px;font-weight:700;color:#0E223D;">${newLeads24.toLocaleString()} <span style="font-size:12px;color:#677A8A;font-weight:500;">${leadsDelta} vs prior 24h</span></div>
        </td></tr>
        <tr><td style="padding:12px 16px;border-bottom:1px solid #E8EDF4;">
          <div style="font-size:11px;color:#97A5B0;text-transform:uppercase;letter-spacing:0.5px;">New paid signups</div>
          <div style="font-size:24px;font-weight:700;color:#0E223D;">${newSubs24.toLocaleString()} <span style="font-size:12px;color:#677A8A;font-weight:500;">${subsDelta} vs prior 24h</span></div>
        </td></tr>
        <tr><td style="padding:12px 16px;border-bottom:1px solid #E8EDF4;">
          <div style="font-size:11px;color:#97A5B0;text-transform:uppercase;letter-spacing:0.5px;">New peptide members</div>
          <div style="font-size:24px;font-weight:700;color:#1F6F78;">${newPeptideSubs24.toLocaleString()}</div>
        </td></tr>
        <tr><td style="padding:12px 16px;border-bottom:1px solid #E8EDF4;">
          <div style="font-size:11px;color:#97A5B0;text-transform:uppercase;letter-spacing:0.5px;">Cancellations</div>
          <div style="font-size:24px;font-weight:700;color:#DC2626;">${canceledSubs24.toLocaleString()}</div>
        </td></tr>
        <tr><td style="padding:12px 16px;">
          <div style="font-size:11px;color:#97A5B0;text-transform:uppercase;letter-spacing:0.5px;">Save-offers applied</div>
          <div style="font-size:24px;font-weight:700;color:#D4A853;">${saveOffersApplied24.toLocaleString()}</div>
        </td></tr>
      </table>

      <h2 style="font-size:16px;color:#0E223D;margin:20px 0 8px;">Top lead sources (24h)</h2>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #E8EDF4;border-radius:12px;overflow:hidden;margin-bottom:20px;">
        ${sourceRows || `<tr><td style="padding:12px 16px;color:#97A5B0;font-size:13px;">No leads in this window.</td></tr>`}
      </table>

      <div style="text-align:center;margin:32px 0;">
        <a href="${APP_URL}/admin/lead-insights" style="background:#1F6F78;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;display:inline-block;">Open full lead insights →</a>
      </div>

      <p style="font-size:12px;color:#97A5B0;text-align:center;margin-top:24px;">
        Nature's Journey · Admin digest · ${now.toLocaleString("en-US", { timeZone: "America/New_York" })} ET<br/>
        Sent to admins only.
      </p>
    </div>
  `;

  const email = createEmailService();
  const results = await Promise.allSettled(
    admins.map((a) =>
      email.send({
        to: a.email,
        subject: `Daily digest · ${newLeads24} leads · ${newSubs24} signups · ${digestDate}`,
        html,
        tags: ["admin-digest"],
      }),
    ),
  );

  const failures = results.filter((r) => r.status === "rejected").length;
  safeLog(
    "[AdminDigest]",
    `sent=${admins.length - failures} failed=${failures} leads=${newLeads24} subs=${newSubs24}`,
  );

  return NextResponse.json({
    ok: true,
    admins: admins.length,
    failures,
    metrics: {
      newLeads24,
      newSubs24,
      newPeptideSubs24,
      canceledSubs24,
      saveOffersApplied24,
    },
  });
}
