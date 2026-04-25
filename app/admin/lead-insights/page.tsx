/**
 * /admin/lead-insights
 * ─────────────────────────────────────────────────────────────
 * Tier 7.5 — Admin-only dashboard surfacing the new lead sources
 * introduced in Tier 1–6:
 *
 *   - Lead breakdown by source (calculator_bmi, exit_intent,
 *     qualify_bridge_step2, nurse_text_widget, pricing_help_card, etc.)
 *   - Lead → user conversion rate per source
 *   - Peptide category adoption (active subscriptions with any
 *     HEALTHY_AGING item)
 *   - 30-day peptide MRR contribution
 *
 * Server-fetches data directly from Prisma — no API round-trip needed
 * because this is a server component.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, TrendingUp, Users, Sparkles, DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { computeChurnRisk } from "@/lib/admin-churn";

export const dynamic = "force-dynamic";

export default async function LeadInsightsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // ─── Lead source breakdown (last 30 days) ────────────────────
  const leadsBySource = await db.lead.groupBy({
    by: ["source"],
    where: { createdAt: { gte: thirtyDaysAgo } },
    _count: { _all: true },
    orderBy: { _count: { id: "desc" } },
  });

  // Conversion per source: Leads where convertedAt not null / total
  const convertedBySource = await db.lead.groupBy({
    by: ["source"],
    where: {
      createdAt: { gte: thirtyDaysAgo },
      convertedAt: { not: null },
    },
    _count: { _all: true },
  });
  const convertedMap = new Map(
    convertedBySource.map((row) => [row.source ?? "unknown", row._count._all]),
  );

  const totalLeads30d = leadsBySource.reduce((sum, r) => sum + r._count._all, 0);
  const totalConverted30d = convertedBySource.reduce((sum, r) => sum + r._count._all, 0);
  const overallConvRate =
    totalLeads30d > 0 ? (totalConverted30d / totalLeads30d) * 100 : 0;

  // ─── Peptide adoption ───────────────────────────────────────
  // Count active subscriptions with any HEALTHY_AGING item
  const peptideSubscriptions = await db.subscription.findMany({
    where: {
      status: "ACTIVE",
      items: {
        some: {
          product: { category: "HEALTHY_AGING" },
        },
      },
    },
    select: {
      id: true,
      createdAt: true,
      items: {
        where: { product: { category: "HEALTHY_AGING" } },
        select: {
          product: { select: { slug: true, name: true, priceMonthly: true } },
        },
      },
    },
  });

  const peptideMembers = peptideSubscriptions.length;
  const peptideMRR = peptideSubscriptions.reduce((sum, sub) => {
    const subTotal = sub.items.reduce((s, i) => s + (i.product?.priceMonthly ?? 0), 0);
    return sum + subTotal;
  }, 0);
  const newPeptide30d = peptideSubscriptions.filter(
    (s) => s.createdAt >= thirtyDaysAgo,
  ).length;

  // By-product rollup
  const peptideProductCounts = new Map<
    string,
    { name: string; count: number; mrrCents: number }
  >();
  for (const sub of peptideSubscriptions) {
    for (const item of sub.items) {
      if (!item.product) continue;
      const existing = peptideProductCounts.get(item.product.slug) || {
        name: item.product.name,
        count: 0,
        mrrCents: 0,
      };
      existing.count += 1;
      existing.mrrCents += item.product.priceMonthly;
      peptideProductCounts.set(item.product.slug, existing);
    }
  }
  const peptideByProduct = Array.from(peptideProductCounts.entries())
    .map(([slug, data]) => ({ slug, ...data }))
    .sort((a, b) => b.count - a.count);

  // ─── Total active member count for peptide adoption rate ────
  const totalActiveMembers = await db.subscription.count({
    where: { status: "ACTIVE" },
  });
  const peptideAdoptionRate =
    totalActiveMembers > 0 ? (peptideMembers / totalActiveMembers) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Lead &amp; Peptide Insights</h1>
          <p className="text-sm text-graphite-400">
            Last 30 days · breakdown of new lead sources and peptide cross-sell adoption
          </p>
        </div>
        <Link
          href="/admin/analytics"
          className="text-sm font-semibold text-teal hover:underline"
        >
          Full analytics →
        </Link>
      </div>

      {/* Top-line KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard
          label="Leads (30d)"
          value={totalLeads30d.toLocaleString()}
          icon={Users}
          accent="teal"
        />
        <KpiCard
          label="Lead→conversion"
          value={`${overallConvRate.toFixed(1)}%`}
          icon={TrendingUp}
          accent="emerald"
        />
        <KpiCard
          label="Peptide members"
          value={peptideMembers.toLocaleString()}
          sub={`${peptideAdoptionRate.toFixed(1)}% of active`}
          icon={Sparkles}
          accent="gold"
        />
        <KpiCard
          label="Peptide MRR"
          value={`$${(peptideMRR / 100).toLocaleString()}`}
          sub={`+${newPeptide30d} new this month`}
          icon={DollarSign}
          accent="teal"
        />
      </div>

      {/* Lead source table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lead sources — last 30 days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 text-left text-xs text-graphite-400">
                  <th className="py-2 font-semibold">Source</th>
                  <th className="py-2 font-semibold text-right">Leads</th>
                  <th className="py-2 font-semibold text-right">Converted</th>
                  <th className="py-2 font-semibold text-right">Conv rate</th>
                  <th className="py-2 font-semibold text-right">Share of leads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {leadsBySource.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-graphite-400">
                      No leads captured in the last 30 days.
                    </td>
                  </tr>
                )}
                {leadsBySource.map((row) => {
                  const source = row.source ?? "unknown";
                  const converted = convertedMap.get(source) ?? 0;
                  const conv = row._count._all > 0 ? (converted / row._count._all) * 100 : 0;
                  const share = totalLeads30d > 0
                    ? (row._count._all / totalLeads30d) * 100
                    : 0;
                  return (
                    <tr key={source} className="text-navy">
                      <td className="py-3">
                        <code className="rounded bg-navy-50/60 px-2 py-0.5 text-xs">
                          {source}
                        </code>
                      </td>
                      <td className="py-3 text-right font-semibold">{row._count._all}</td>
                      <td className="py-3 text-right text-teal font-semibold">
                        {converted}
                      </td>
                      <td className="py-3 text-right">
                        <Badge
                          variant={conv >= 10 ? "success" : conv >= 3 ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {conv.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="py-3 text-right text-xs text-graphite-500">
                        {share.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-graphite-400">
            Sources with conv-rate ≥ 10% are your highest-intent funnels. Double
            down on paid + SEO spend targeting those channels.
          </p>
        </CardContent>
      </Card>

      {/* Peptide by-product */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            Peptide adoption by product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 text-left text-xs text-graphite-400">
                  <th className="py-2 font-semibold">Product</th>
                  <th className="py-2 font-semibold text-right">Active members</th>
                  <th className="py-2 font-semibold text-right">MRR</th>
                  <th className="py-2 font-semibold text-right">Avg $/member</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {peptideByProduct.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-graphite-400">
                      No peptide subscriptions yet. Once members pass day 30 the
                      upsell engine will start converting.
                    </td>
                  </tr>
                )}
                {peptideByProduct.map((p) => (
                  <tr key={p.slug} className="text-navy">
                    <td className="py-3 font-semibold">{p.name}</td>
                    <td className="py-3 text-right">{p.count}</td>
                    <td className="py-3 text-right">
                      ${(p.mrrCents / 100).toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-xs text-graphite-500">
                      ${(p.mrrCents / 100 / Math.max(1, p.count)).toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-graphite-400">
            Peptide MRR compounds: each active peptide member adds ~$89–$229/mo
            on top of their core GLP-1 subscription. See{" "}
            <Link href="/admin/products" className="text-teal hover:underline">
              Admin → Products
            </Link>{" "}
            to add new peptides or adjust pricing.
          </p>
        </CardContent>
      </Card>

      {/* Tier 8.5 — Cohort retention widget */}
      <CohortRetentionCard />

      {/* Tier 9.6 — Top at-risk members for proactive outreach */}
      <ChurnRiskCard />

      {/* Quick links */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-graphite-500">Jump to:</span>
            <Link
              href="/admin/analytics"
              className="rounded-full border border-navy-100/60 px-3 py-1 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              Acquisition analytics →
            </Link>
            <Link
              href="/admin/subscriptions"
              className="rounded-full border border-navy-100/60 px-3 py-1 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              Subscriptions →
            </Link>
            <Link
              href="/admin/products"
              className="rounded-full border border-navy-100/60 px-3 py-1 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              Product catalog →
            </Link>
            <Link
              href="/admin/insights"
              className="rounded-full border border-navy-100/60 px-3 py-1 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              Insights (AI) →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Cohort retention widget (Tier 8.5) ─────────────────────
// Computes 4-month retention curves for the last 4 signup cohorts.
// Renders as a simple heatmap-style table — admin eyeballs churn shape.
async function CohortRetentionCard() {
  const now = new Date();

  // Define 4 monthly cohorts ending today
  const cohorts: Array<{ label: string; start: Date; end: Date }> = [];
  for (let i = 3; i >= 0; i--) {
    const end = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
    cohorts.push({
      label: start.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      start,
      end,
    });
  }

  // For each cohort, find subscriptions created in the window and compute
  // retention at +30 / +60 / +90 / +120 days (ACTIVE or PAST_DUE = retained)
  const rows = await Promise.all(
    cohorts.map(async (c) => {
      const signups = await db.subscription.findMany({
        where: { createdAt: { gte: c.start, lt: c.end } },
        select: { id: true, createdAt: true, status: true, canceledAt: true, pausedUntil: true },
      });

      const total = signups.length;
      const retainedAt = (days: number) => {
        const horizon = new Date(c.start.getTime() + days * 86400000);
        // If the window end hasn't arrived yet, mark as "—"
        if (horizon > now) return null;
        const retained = signups.filter((s) => {
          // Retained if: not canceled before horizon
          const canceledBefore =
            s.canceledAt && s.canceledAt < horizon;
          return !canceledBefore;
        }).length;
        return total > 0 ? Math.round((retained / total) * 100) : 0;
      };

      return {
        label: c.label,
        total,
        d30: retainedAt(30),
        d60: retainedAt(60),
        d90: retainedAt(90),
        d120: retainedAt(120),
      };
    }),
  );

  function heatColor(pct: number | null): string {
    if (pct === null) return "bg-navy-50 text-graphite-300";
    if (pct >= 85) return "bg-emerald-100 text-emerald-800";
    if (pct >= 70) return "bg-teal-100 text-teal-800";
    if (pct >= 55) return "bg-gold-100 text-gold-800";
    return "bg-red-100 text-red-700";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-teal" />
          Cohort retention (4 months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100/40 text-left text-xs text-graphite-400">
                <th className="py-2 font-semibold">Cohort</th>
                <th className="py-2 font-semibold text-right">Signups</th>
                <th className="py-2 font-semibold text-right">Day 30</th>
                <th className="py-2 font-semibold text-right">Day 60</th>
                <th className="py-2 font-semibold text-right">Day 90</th>
                <th className="py-2 font-semibold text-right">Day 120</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100/30">
              {rows.map((r) => (
                <tr key={r.label} className="text-navy">
                  <td className="py-2.5 font-semibold">{r.label}</td>
                  <td className="py-2.5 text-right">{r.total}</td>
                  {[r.d30, r.d60, r.d90, r.d120].map((pct, i) => (
                    <td key={i} className="py-2 text-right">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${heatColor(pct)}`}
                      >
                        {pct === null ? "—" : `${pct}%`}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-graphite-400">
          Heat: <span className="text-emerald-700 font-semibold">green ≥85%</span>,{" "}
          <span className="text-teal-700 font-semibold">teal ≥70%</span>,{" "}
          <span className="text-gold-700 font-semibold">gold ≥55%</span>,{" "}
          <span className="text-red-600 font-semibold">red &lt;55%</span>.
          — cells are the % of the cohort still on an active subscription at
          that day. "—" means the horizon hasn't arrived yet.
        </p>
      </CardContent>
    </Card>
  );
}

// Small local KPI card — intentionally inline so this page is self-contained
function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "teal" | "emerald" | "gold" | "navy";
}) {
  const accentMap = {
    teal: "bg-teal-50 text-teal",
    emerald: "bg-emerald-50 text-emerald-600",
    gold: "bg-gold-50 text-gold-700",
    navy: "bg-navy-50 text-navy",
  } as const;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentMap[accent]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-graphite-400">{label}</p>
            <p className="text-lg font-bold text-navy">{value}</p>
            {sub && <p className="text-[10px] text-graphite-400 mt-0.5">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Churn-risk widget (Tier 9.6) ────────────────────────────
// Surfaces the top 10 active members with the highest computed churn-risk
// score (0–100). Admin eyeballs the list and can reach out proactively —
// free coaching, dose review, discount, etc. — before they cancel.
async function ChurnRiskCard() {
  // Pull active subs + recent creation (skip the freshest 3 days to avoid
  // showing brand-new signups whose scores are all high due to no history).
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const candidates = await db.subscription.findMany({
    where: {
      status: { in: ["ACTIVE", "PAST_DUE"] },
      createdAt: { lt: threeDaysAgo },
    },
    orderBy: { createdAt: "desc" },
    take: 80, // cap the scoring loop
    select: {
      id: true,
      userId: true,
      status: true,
      createdAt: true,
      user: { select: { email: true, firstName: true, lastName: true } },
    },
  });

  // Score each candidate — computeChurnRisk is small + parallelizable.
  // Cap to 80 so we don't blow the request budget on first load.
  const scored = await Promise.all(
    candidates.map(async (sub) => ({
      ...sub,
      risk: await computeChurnRisk(sub.userId),
    })),
  );
  const topRisk = scored
    .filter((s) => s.risk >= 50)
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 10);

  function riskColor(risk: number): string {
    if (risk >= 80) return "bg-red-100 text-red-700 border-red-200";
    if (risk >= 65) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-gold-100 text-gold-800 border-gold-200";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Top at-risk members (proactive outreach)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topRisk.length === 0 ? (
          <p className="py-6 text-center text-sm text-graphite-400">
            No members scoring above 50 right now. Good retention health.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 text-left text-xs text-graphite-400">
                  <th className="py-2 font-semibold">Member</th>
                  <th className="py-2 font-semibold text-right">Days in</th>
                  <th className="py-2 font-semibold text-right">Risk</th>
                  <th className="py-2 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {topRisk.map((r) => {
                  const daysIn = Math.floor(
                    (Date.now() - r.createdAt.getTime()) / 86400000,
                  );
                  const name =
                    [r.user?.firstName, r.user?.lastName]
                      .filter(Boolean)
                      .join(" ") ||
                    r.user?.email ||
                    "—";
                  return (
                    <tr key={r.id} className="text-navy">
                      <td className="py-3">
                        <p className="text-sm font-semibold">{name}</p>
                        <p className="text-[11px] text-graphite-400">
                          {r.user?.email}
                        </p>
                      </td>
                      <td className="py-3 text-right">{daysIn}d</td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-semibold ${riskColor(r.risk)}`}
                        >
                          {r.risk}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/customers?search=${encodeURIComponent(r.user?.email ?? "")}`}
                          className="text-xs font-semibold text-teal hover:underline"
                        >
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs text-graphite-400">
          Churn-risk score factors: health score, tracking inactivity, payment health,
          engagement decay, lifecycle stage. Members ≥65 benefit most from a proactive
          coaching outreach or dose review.
        </p>
      </CardContent>
    </Card>
  );
}
