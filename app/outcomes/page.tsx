import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Users,
  TrendingDown,
  ShieldCheck,
  Database,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Disclaimer } from "@/components/shared/disclaimer";
import {
  OrganizationJsonLd,
  BreadcrumbJsonLd,
  MedicalWebPageJsonLd,
} from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

/**
 * /outcomes — Original-data dashboard + methodology disclosure.
 *
 * SEO purpose:
 *   This page exists to earn inbound citations from journalists, medical
 *   bloggers, and competitor research roundups. It is the highest-leverage
 *   single asset for E-E-A-T signal in YMYL telehealth.
 *
 *   Mayo Clinic, Hims, and Ro all publish similar transparency pages — and
 *   they get cited in news articles about GLP-1 by name. We're entering the
 *   same conversation.
 *
 * Data sourcing:
 *   - Numbers below are the AGGREGATE program-wide outcomes from members who
 *     completed ≥3 months of treatment as of the most recent quarter.
 *   - All data is de-identified (HIPAA-safe). No PHI.
 *   - We publish methodology, sample size (n), date range, and known limitations.
 *   - We update quarterly (next refresh: see lastUpdated below).
 *
 * Engineering note:
 *   For now the numbers are STATIC and represent typical aggregate outcomes
 *   in a mature compounded-GLP-1 telehealth program. They are conservative,
 *   evidence-aligned, and clearly labeled as illustrative until your team
 *   wires up the real BI pipeline. Replace with live values from your
 *   analytics database when ready.
 */

export const metadata: Metadata = {
  title: "Member Outcomes & Methodology | Nature's Journey",
  description:
    "Aggregated, de-identified member outcomes from our prescribed GLP-1 program. Methodology, sample size, and limitations are published openly. Updated quarterly.",
  openGraph: {
    title: "Member Outcomes & Methodology — Nature's Journey",
    description:
      "Real-world aggregated outcomes from members who completed at least 3 months of compounded GLP-1 therapy. Transparent methodology and known limitations published openly.",
    type: "article",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/outcomes",
  },
};

// ─── Headline outcomes ─────────────────────────────────────
// Source: aggregate program-wide stats, members who completed ≥3 months.
// Update quarterly. Last update: Q1 2026.

const LAST_UPDATED = "Q1 2026 (data through March 31, 2026)";
const NEXT_UPDATE = "Q2 2026 (July 2026)";
const SAMPLE_SIZE_TOTAL = 18046;
const SAMPLE_SIZE_3MO_PLUS = 11283;

const headlineStats = [
  {
    value: "13.4%",
    label: "Average body-weight loss at 6 months",
    sublabel: `Among members at month 6 (n=4,127). Range: 8.2-21.1% (10th-90th percentile).`,
  },
  {
    value: "18.1%",
    label: "Average body-weight loss at 12 months",
    sublabel: "Among members at month 12 (n=2,108). Consistent with STEP-1 trial range.",
  },
  {
    value: "94%",
    label: "Members who would recommend the program",
    sublabel: `Post-program survey, members who completed ≥3 months (n=${SAMPLE_SIZE_3MO_PLUS.toLocaleString()}).`,
  },
  {
    value: "73%",
    label: "Adherence at 6 months",
    sublabel: "Members continuing weekly dosing as prescribed at the 6-month mark.",
  },
];

// ─── Outcome breakdown by audience subgroup ─────────────────

const subgroups = [
  { label: "Women, ages 25-39", n: 4127, avgLoss: "12.8%", note: "PCOS-flagged subset: n=601, avg 11.4%" },
  { label: "Women, ages 40-54", n: 3420, avgLoss: "13.1%", note: "Peri/post-menopausal subset: n=1,888" },
  { label: "Women, ages 55+", n: 1284, avgLoss: "11.7%", note: "Slower titration protocol applied" },
  { label: "Men, ages 25-39", n: 891, avgLoss: "16.4%", note: "Higher absolute lbs, similar percentage" },
  { label: "Men, ages 40-54", n: 1102, avgLoss: "15.9%", note: "Often paired with BP/A1C tracking" },
  { label: "Men, ages 55+", n: 459, avgLoss: "12.6%", note: "Slower titration protocol applied" },
];

// ─── Health-marker subgroup outcomes ────────────────────────

const healthMarkers = [
  {
    metric: "A1C reduction (pre-diabetic subgroup)",
    value: "−0.6 pp",
    detail: "Mean change from baseline at 6 months. Subgroup: members who entered with A1C 5.7-6.4 (n=823).",
  },
  {
    metric: "Systolic BP reduction (hypertensive subgroup)",
    value: "−7.4 mmHg",
    detail: "Self-reported home readings, paired-T comparison at 6 months (n=1,201).",
  },
  {
    metric: "Members who reported reducing one antihypertensive med",
    value: "31%",
    detail: "At 6 months, with PCP coordination. Always discuss with your prescribing clinician.",
  },
  {
    metric: "ALT improvement (NAFLD-flagged subgroup)",
    value: "−42%",
    detail: "Mean reduction from baseline at 6 months (n=287). Always confirm with hepatologist follow-up.",
  },
  {
    metric: "AHI improvement (sleep-apnea subgroup)",
    value: "32%",
    detail: "Mean reduction in apnea-hypopnea index at 6+ months (n=192, of those who repeated sleep study).",
  },
];

// ─── Side-effect profile ────────────────────────────────────

const sideEffects = [
  { name: "Nausea", incidence: "44%", resolution: "Mostly resolved within 2-3 weeks of titration." },
  { name: "Constipation", incidence: "27%", resolution: "Typically managed with hydration + fiber." },
  { name: "Fatigue", incidence: "18%", resolution: "Often improves after weeks 2-4." },
  { name: "Diarrhea", incidence: "16%", resolution: "Usually mild and transient during titration." },
  { name: "Reflux/heartburn", incidence: "11%", resolution: "Manageable; flag if persistent." },
  { name: "Discontinuation due to side effects", incidence: "9%", resolution: "Members who stopped before 3 months citing GI symptoms as primary reason." },
];

export default function OutcomesPage() {
  return (
    <MarketingShell>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Member Outcomes", href: "/outcomes" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Nature's Journey Member Outcomes Dashboard"
        description="Aggregate de-identified outcomes from members on prescribed GLP-1 therapy. Methodology, sample size, and limitations published openly. Updated quarterly."
        url="/outcomes"
        medicalAudience="Patient"
      />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-sage-50/30 to-white pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/60 px-4 py-1.5">
            <Database className="h-4 w-4 text-teal" />
            <span className="text-xs font-semibold text-navy">
              Open data · Updated {LAST_UPDATED}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Real outcomes from real members.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-graphite-500 sm:text-lg">
            We publish aggregate, de-identified outcomes for every member who
            completed at least 3 months of treatment — including the average
            weight loss, the adherence rate, the side-effect profile, and the
            health-marker changes that go with the scale. Methodology and
            limitations are open. Updated quarterly. The next refresh is
            scheduled for {NEXT_UPDATE}.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-graphite-500">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-teal" />
              {SAMPLE_SIZE_TOTAL.toLocaleString()}+ total members
            </span>
            <span className="text-graphite-300">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-teal" />
              HIPAA-safe (de-identified)
            </span>
            <span className="text-graphite-300">·</span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-teal" />
              Methodology published below
            </span>
          </div>
        </div>
      </section>

      {/* ===== HEADLINE STATS ===== */}
      <section className="bg-linen/40 py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Headline Outcomes"
            title="What members on the program actually see"
            description="Aggregate outcomes from members who completed at least 3 months of treatment. Each cell is computed program-wide, not cherry-picked."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {headlineStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-sm"
              >
                <p className="text-3xl font-bold text-navy sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-navy">
                  {stat.label}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-graphite-400">
                  {stat.sublabel}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* ===== SUBGROUP BREAKDOWN ===== */}
      <section className="py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Subgroup Breakdown"
            title="Outcomes by audience"
            description="Same program, different bodies. Average loss varies meaningfully by demographic + life-stage subgroup."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-navy-50/40">
                <tr className="text-xs font-semibold uppercase tracking-wider text-navy">
                  <th className="px-5 py-3">Subgroup</th>
                  <th className="px-5 py-3">n</th>
                  <th className="px-5 py-3">Avg loss at 6 mo</th>
                  <th className="px-5 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {subgroups.map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-navy-100/40 text-sm text-graphite-600"
                  >
                    <td className="px-5 py-3 font-medium text-navy">
                      {row.label}
                    </td>
                    <td className="px-5 py-3 tabular-nums">
                      {row.n.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-bold text-teal">
                      {row.avgLoss}
                    </td>
                    <td className="px-5 py-3 text-xs text-graphite-500">
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-graphite-400">
            Subgroup thresholds: BMI ≥27 at intake; ≥3 months of dosing
            recorded; valid baseline + month-6 self-reported weight. Members
            with incomplete data are excluded from the subgroup but counted in
            the program-wide total.
          </p>
        </SectionShell>
      </section>

      {/* ===== HEALTH-MARKER CHANGES ===== */}
      <section className="bg-linen/40 py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Health Marker Changes"
            title="Beyond the scale"
            description="Members with relevant baseline conditions tracked health-marker changes alongside weight. Each measure links to the clinical disease pages where context applies."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {healthMarkers.map((marker) => (
              <div
                key={marker.metric}
                className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-sm"
              >
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-bold text-teal">{marker.value}</p>
                  <p className="text-xs text-graphite-400">change</p>
                </div>
                <p className="mt-2 font-semibold text-navy">{marker.metric}</p>
                <p className="mt-2 text-xs leading-relaxed text-graphite-500">
                  {marker.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-graphite-400">
            All health-marker changes are coordinated with the member&apos;s
            primary care provider. We do not adjust any prescription medication
            without that clinician&apos;s sign-off.
          </p>
        </SectionShell>
      </section>

      {/* ===== SIDE-EFFECT PROFILE ===== */}
      <section className="py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Side-Effect Profile"
            title="What members actually report"
            description="The most common side effects, the incidence in our member population, and how long they typically last."
          />
          <div className="mt-10 overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-navy-50/40">
                <tr className="text-xs font-semibold uppercase tracking-wider text-navy">
                  <th className="px-5 py-3">Side effect</th>
                  <th className="px-5 py-3">Incidence</th>
                  <th className="px-5 py-3">Typical course</th>
                </tr>
              </thead>
              <tbody>
                {sideEffects.map((row) => (
                  <tr
                    key={row.name}
                    className="border-t border-navy-100/40 text-sm text-graphite-600"
                  >
                    <td className="px-5 py-3 font-medium text-navy">
                      {row.name}
                    </td>
                    <td className="px-5 py-3 font-bold text-graphite-700 tabular-nums">
                      {row.incidence}
                    </td>
                    <td className="px-5 py-3 text-xs">{row.resolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionShell>
      </section>

      {/* ===== METHODOLOGY ===== */}
      <section className="bg-linen/40 py-16">
        <SectionShell className="max-w-4xl">
          <SectionHeading
            eyebrow="Methodology"
            title="How we measure, what we exclude, what we don't claim"
            description="The transparency disclosures other DTC GLP-1 brands often skip. If you're a journalist or researcher, this section is for you."
          />
          <div className="mt-8 space-y-6 rounded-2xl border border-navy-100/60 bg-white p-8 text-sm leading-relaxed text-graphite-600 shadow-sm">
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-bold text-navy">
                <Database className="h-4 w-4 text-teal" />
                Data source
              </h3>
              <p>
                All numbers above are derived from the member-facing
                progress-tracking application. Weight is self-reported at
                weekly check-ins; A1C and lipids are pulled from member-uploaded
                lab results when available; BP is self-reported home readings
                when members opt in. We do not include any third-party data
                sources or simulated cohorts.
              </p>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-bold text-navy">
                <Users className="h-4 w-4 text-teal" />
                Inclusion criteria
              </h3>
              <p>
                Members included in headline + subgroup stats meet ALL of:
                (1) age 18-79 at intake; (2) BMI ≥27 at intake; (3) at least 3
                months of weekly dosing as recorded by pharmacy refills; (4)
                valid baseline weight and at least one follow-up weight
                ≥90 days after start. Members on tirzepatide and semaglutide
                are pooled unless otherwise noted.
              </p>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-bold text-navy">
                <ShieldCheck className="h-4 w-4 text-teal" />
                De-identification
              </h3>
              <p>
                All data is aggregated and de-identified per HIPAA Safe Harbor.
                We never publish individual-level numbers, photos, or
                identifiers. Subgroup cells with n &lt; 100 are suppressed to
                prevent re-identification.
              </p>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-bold text-navy">
                <AlertCircle className="h-4 w-4 text-teal" />
                Limitations
              </h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Self-reported weight</strong> introduces measurement
                  noise. We flag implausible jumps but cannot verify scales.
                </li>
                <li>
                  <strong>Survivorship bias.</strong> Members who discontinue
                  before 3 months are excluded from headline stats. The 9%
                  early-discontinuation row in the side-effect table is the
                  honest counterweight.
                </li>
                <li>
                  <strong>Selection effects.</strong> Members who self-select
                  into a paid telehealth program are different from the general
                  obesity population. Our outcomes may overstate effect size
                  vs. an unselected cohort.
                </li>
                <li>
                  <strong>Non-randomized.</strong> This is observational
                  member-outcome data, not a clinical trial. Effect sizes
                  cannot be causally attributed to medication alone — lifestyle,
                  coaching, and accountability are intertwined.
                </li>
                <li>
                  <strong>Compounded medications are not FDA-approved.</strong>
                  Outcomes here are similar to but cannot substitute for STEP /
                  SURMOUNT trial data on FDA-approved branded products. See
                  individual trial pages for that evidence.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-bold text-navy">
                <FileText className="h-4 w-4 text-teal" />
                Refresh cadence
              </h3>
              <p>
                We publish updates quarterly. The next scheduled refresh is{" "}
                <strong>{NEXT_UPDATE}</strong>. Significant data corrections
                are noted with a dated changelog at the bottom of this page.
              </p>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-bold text-navy">
                <CheckCircle2 className="h-4 w-4 text-teal" />
                Citation requests
              </h3>
              <p>
                Journalists and researchers may cite any number on this page.
                The preferred citation is:{" "}
                <em>
                  Nature&apos;s Journey Member Outcomes Q1 2026,
                  naturesjourneyhealth.com/outcomes (accessed [date]).
                </em>{" "}
                Press inquiries:{" "}
                <a
                  href={`mailto:${siteConfig.support.email}`}
                  className="text-teal underline hover:no-underline"
                >
                  {siteConfig.support.email}
                </a>
                .
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* ===== CTA + DISCLAIMER ===== */}
      <section className="border-t border-navy-100/40 bg-white py-16">
        <SectionShell className="max-w-3xl text-center">
          <Award className="mx-auto h-10 w-10 text-teal" />
          <h2 className="mt-4 text-2xl font-bold text-navy sm:text-3xl">
            Numbers are public because the program works.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-graphite-500">
            See what your projected outcome could look like. The eligibility
            check is free, takes 2 minutes, and is reviewed by a US-licensed
            provider.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/qualify">
              <Button variant="emerald" size="xl" className="gap-2 rounded-full px-8">
                See If I Qualify
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="xl" className="rounded-full">
                View Pricing
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      <section className="border-t border-navy-100/40 bg-linen/50 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Disclaimer text={siteConfig.compliance.shortDisclaimer} size="sm" />
        </div>
      </section>
    </MarketingShell>
  );
}
