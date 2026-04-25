/**
 * /api/milestone-certificate
 * ─────────────────────────────────────────────────────────────
 * Tier 12.7 — Generates a printable PDF (printed via the browser's
 * Save-as-PDF dialog) celebrating a member milestone. Returns an
 * HTML response styled for 8.5×11" portrait and triggers the print
 * dialog automatically. The browser handles the PDF conversion.
 *
 * Why HTML→print instead of a server-side PDF lib: zero new
 * dependencies, no font-licensing concerns, identical rendering on
 * any platform, and the user gets to choose paper size / margins.
 *
 * Auth: requireAuth() — only the logged-in member can claim their
 * own certificate. We pull their actual lifetime stats from Prisma
 * so the cert isn't easily forgeable.
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeError } from "@/lib/logger";

const MILESTONES = [
  { lbs: 5, title: "First 5 Lbs", subtitle: "The proof-of-concept milestone" },
  { lbs: 10, title: "10 Lbs Down", subtitle: "Meaningful change is here" },
  { lbs: 15, title: "15 Lbs Lighter", subtitle: "Friends are noticing" },
  { lbs: 25, title: "25 Lbs Lost", subtitle: "Quarter of a hundred" },
  { lbs: 50, title: "50 Lbs Lost", subtitle: "A literal small adult" },
  { lbs: 75, title: "75 Lbs Lost", subtitle: "A transformation" },
  { lbs: 100, title: "100 Lbs Down", subtitle: "Triple-digit champion" },
] as const;

function pickMilestone(weightLost: number): (typeof MILESTONES)[number] | null {
  // Highest milestone the user has crossed
  let chosen: (typeof MILESTONES)[number] | null = null;
  for (const m of MILESTONES) {
    if (weightLost >= m.lbs) chosen = m;
  }
  return chosen;
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const url = new URL(req.url);
    const requested = Number(url.searchParams.get("milestone")) || 0;

    const [user, profile, latestProgress] = await Promise.all([
      db.user.findUnique({
        where: { id: session.userId },
        select: { firstName: true, lastName: true, email: true, createdAt: true },
      }),
      db.patientProfile.findUnique({
        where: { userId: session.userId },
        select: { weightLbs: true },
      }),
      db.progressEntry.findFirst({
        where: { userId: session.userId, weightLbs: { not: null } },
        orderBy: { date: "desc" },
        select: { weightLbs: true, date: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const startWeight = profile?.weightLbs ?? 0;
    const currentWeight = latestProgress?.weightLbs ?? startWeight;
    const lifetimeLost =
      startWeight && currentWeight && startWeight > currentWeight
        ? startWeight - currentWeight
        : 0;

    // Default to highest crossed milestone if not specified
    const milestone =
      requested && MILESTONES.find((m) => m.lbs === requested && lifetimeLost >= m.lbs)
        ? MILESTONES.find((m) => m.lbs === requested)!
        : pickMilestone(lifetimeLost);

    if (!milestone) {
      return new Response(
        renderNoMilestoneYet(user.firstName ?? "Member"),
        { headers: { "Content-Type": "text/html; charset=utf-8" } },
      );
    }

    const fullName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.email.split("@")[0];
    const issuedAt = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const memberSinceDays = Math.max(
      1,
      Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000),
    );

    return new Response(
      renderCertificate({
        name: fullName,
        milestoneTitle: milestone.title,
        milestoneSubtitle: milestone.subtitle,
        lbsLost: Math.round(lifetimeLost),
        memberSinceDays,
        issuedAt,
        certificateId: `NJ-${session.userId.slice(-8).toUpperCase()}-${milestone.lbs}`,
      }),
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    safeError("[Milestone Certificate]", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderCertificate(params: {
  name: string;
  milestoneTitle: string;
  milestoneSubtitle: string;
  lbsLost: number;
  memberSinceDays: number;
  issuedAt: string;
  certificateId: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(params.milestoneTitle)} — Nature's Journey Milestone Certificate</title>
<style>
  @page { size: 8.5in 11in; margin: 0; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #f0eee8;
    font-family: Georgia, "Times New Roman", serif;
    color: #0E223D;
  }
  .page {
    width: 8.5in;
    height: 11in;
    margin: 0 auto;
    background: linear-gradient(180deg, #fefcf6 0%, #f6f1e3 100%);
    position: relative;
    padding: 0.7in 0.85in;
    page-break-after: always;
  }
  .page::before {
    content: "";
    position: absolute;
    inset: 0.4in;
    border: 4px double #1F6F78;
    pointer-events: none;
  }
  .corner {
    position: absolute;
    width: 1.6in;
    height: 1.6in;
    border: 2px solid #D4A853;
    opacity: 0.6;
    pointer-events: none;
  }
  .corner.tl { top: 0.4in; left: 0.4in; border-right: 0; border-bottom: 0; }
  .corner.tr { top: 0.4in; right: 0.4in; border-left: 0; border-bottom: 0; }
  .corner.bl { bottom: 0.4in; left: 0.4in; border-right: 0; border-top: 0; }
  .corner.br { bottom: 0.4in; right: 0.4in; border-left: 0; border-top: 0; }
  .crest {
    text-align: center;
    margin-top: 0.4in;
  }
  .crest .leaf {
    display: inline-block;
    width: 56px; height: 56px;
    background: linear-gradient(135deg, #1F6F78, #163A63);
    border-radius: 14px;
    color: #fff;
    font-size: 24px; line-height: 56px;
    font-weight: 700;
  }
  .crest .org {
    margin-top: 8px;
    font-size: 12px; letter-spacing: 4px;
    text-transform: uppercase;
    color: #677A8A;
  }
  .titleblock {
    text-align: center;
    margin-top: 0.3in;
  }
  .titleblock .award {
    font-size: 14px; letter-spacing: 6px;
    text-transform: uppercase;
    color: #D4A853;
    font-weight: 700;
  }
  .titleblock .milestone {
    margin-top: 14px;
    font-family: "Georgia", serif;
    font-size: 64px;
    font-weight: 700;
    color: #0E223D;
    letter-spacing: 1px;
  }
  .titleblock .sub {
    font-size: 16px;
    color: #677A8A;
    margin-top: 6px;
    font-style: italic;
  }
  .body {
    text-align: center;
    margin-top: 0.5in;
    padding: 0 0.8in;
  }
  .body .presented {
    font-size: 14px;
    letter-spacing: 3px;
    color: #677A8A;
    text-transform: uppercase;
  }
  .body .name {
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 48px;
    color: #0E223D;
    margin: 14px 0 6px;
    font-style: italic;
  }
  .body .name-rule {
    width: 60%;
    height: 1px;
    margin: 10px auto;
    background: linear-gradient(90deg, transparent, #D4A853, transparent);
  }
  .body p {
    font-size: 14px;
    line-height: 1.7;
    color: #2E3742;
  }
  .stats {
    display: flex;
    justify-content: center;
    gap: 0.6in;
    margin-top: 0.5in;
  }
  .stats .stat {
    text-align: center;
  }
  .stats .stat .num {
    font-size: 36px;
    font-weight: 700;
    color: #1F6F78;
    font-family: "Georgia", serif;
  }
  .stats .stat .lbl {
    margin-top: 4px;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #677A8A;
  }
  .signrow {
    position: absolute;
    bottom: 0.95in;
    left: 0.85in;
    right: 0.85in;
    display: flex;
    justify-content: space-between;
  }
  .signrow .sign {
    width: 2.6in;
    text-align: center;
  }
  .signrow .sign .signature {
    font-family: "Brush Script MT", "Lucida Handwriting", cursive;
    font-size: 28px;
    color: #0E223D;
  }
  .signrow .sign .rule {
    margin-top: 4px;
    border-top: 1px solid #97A5B0;
  }
  .signrow .sign .role {
    margin-top: 6px;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #677A8A;
  }
  .footer {
    position: absolute;
    bottom: 0.45in;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 9px;
    color: #97A5B0;
    letter-spacing: 1px;
  }
  @media print { body { background: #fff; } }
</style>
</head>
<body onload="window.print()">
  <div class="page">
    <div class="corner tl"></div>
    <div class="corner tr"></div>
    <div class="corner bl"></div>
    <div class="corner br"></div>

    <div class="crest">
      <div class="leaf">VP</div>
      <div class="org">Nature&rsquo;s Journey</div>
    </div>

    <div class="titleblock">
      <div class="award">Certificate of Achievement</div>
      <div class="milestone">${escapeHtml(params.milestoneTitle)}</div>
      <div class="sub">${escapeHtml(params.milestoneSubtitle)}</div>
    </div>

    <div class="body">
      <div class="presented">Proudly presented to</div>
      <div class="name">${escapeHtml(params.name)}</div>
      <div class="name-rule"></div>
      <p>
        For meeting a meaningful milestone in their weight-management journey
        with Nature&rsquo;s Journey. This achievement reflects daily consistency,
        provider-supervised treatment, and the choice to take their long-term
        health seriously. Real progress, earned one day at a time.
      </p>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="num">${params.lbsLost}</div>
        <div class="lbl">Lbs Lost</div>
      </div>
      <div class="stat">
        <div class="num">${params.memberSinceDays}</div>
        <div class="lbl">Days In</div>
      </div>
      <div class="stat">
        <div class="num">${escapeHtml(params.issuedAt.split(" ")[0])}</div>
        <div class="lbl">Issued ${escapeHtml(params.issuedAt.split(" ").slice(1).join(" "))}</div>
      </div>
    </div>

    <div class="signrow">
      <div class="sign">
        <div class="signature">Dr. Alicia Stevens</div>
        <div class="rule"></div>
        <div class="role">Lead Clinical Provider</div>
      </div>
      <div class="sign">
        <div class="signature">Nature&rsquo;s Journey</div>
        <div class="rule"></div>
        <div class="role">Care Team</div>
      </div>
    </div>

    <div class="footer">
      Certificate ID: ${escapeHtml(params.certificateId)} &middot; Verifiable upon request &middot; Nature&rsquo;s Journey Health
    </div>
  </div>
</body>
</html>`;
}

function renderNoMilestoneYet(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Milestone not yet reached</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; color: #0E223D; }
  h1 { font-size: 22px; }
  a { color: #1F6F78; }
</style>
</head>
<body>
  <h1>Hi ${escapeHtml(firstName)} — your first milestone is on its way</h1>
  <p>You haven&rsquo;t hit a 5-lb milestone yet. Once you do, this page will generate
  your certificate automatically. Keep logging your weight on the
  <a href="/dashboard/progress">progress page</a>.</p>
</body>
</html>`;
}
