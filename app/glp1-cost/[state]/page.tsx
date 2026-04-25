/**
 * /glp1-cost/[state] — per-state GLP-1 cost SEO page
 * ─────────────────────────────────────────────────────────────
 * Tier 9.2 — A page per US state to capture geo-modified queries
 * ("how much does semaglutide cost in Texas?", "GLP-1 cost California",
 * etc.). Each page:
 *
 *   - Uses the existing `allStates` registry so availability gates
 *     the CTA (available states → /qualify, unavailable states →
 *     "Join waitlist" signal).
 *   - Shares a single template but personalizes title/description/H1
 *     with the state name for unique, rankable metadata.
 *   - Includes FAQPage JSON-LD, BreadcrumbJsonLd, and
 *     MedicalWebPageJsonLd for rich-results eligibility.
 *   - Registers all 50+ slugs via generateStaticParams() for static
 *     build + Vercel ISR.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  DollarSign,
  ShieldCheck,
  Stethoscope,
  Truck,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionShell } from "@/components/shared/section-shell";
import { Disclaimer } from "@/components/shared/disclaimer";
import {
  MedicalWebPageJsonLd,
  BreadcrumbJsonLd,
  FAQPageJsonLd,
} from "@/components/seo/json-ld";
import { ViewContentTracker } from "@/components/shared/view-content-tracker";
import { siteConfig } from "@/lib/site";
import { allStates } from "@/lib/states";

// ─── Static params ──────────────────────────────────────────
export function generateStaticParams() {
  return allStates.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const info = allStates.find((s) => s.slug === state);
  if (!info) return { title: "State not found" };
  const url = `${siteConfig.url}/glp1-cost/${state}`;
  return {
    title: `GLP-1 Weight Loss Cost in ${info.name} (2026) — From $279/mo | Nature's Journey`,
    description: `How much does GLP-1 weight loss cost in ${info.name}? Compounded semaglutide and tirzepatide ${info.available ? "prescribed online in " + info.name : "coming soon to " + info.name}. From $279/mo — up to 79% less than brand-name retail.`,
    keywords: [
      `GLP-1 cost ${info.name}`,
      `semaglutide cost ${info.name}`,
      `tirzepatide cost ${info.name}`,
      `GLP-1 price ${info.name}`,
      `weight loss medication ${info.name}`,
      `GLP-1 telehealth ${info.name}`,
      `compounded semaglutide ${info.name}`,
      `Ozempic alternative ${info.name}`,
    ],
    openGraph: {
      title: `GLP-1 Weight Loss Cost in ${info.name} — Nature's Journey`,
      description: `${info.available ? `GLP-1 medication prescribed online in ${info.name}` : `Now accepting waitlist in ${info.name}`}. From $279/mo with free 2-day shipping.`,
      url,
      type: "website",
    },
    alternates: { canonical: url },
  };
}

// ─── FAQ helpers (shared across states, personalized with state name) ──
function buildFaqs(stateName: string, available: boolean) {
  return [
    {
      question: `How much does GLP-1 weight loss cost in ${stateName}?`,
      answer: available
        ? `In ${stateName}, compounded GLP-1 medications through Nature's Journey start at $279/mo — that's roughly 79% less than cash-pay retail for brand-name Wegovy ($1,349/mo) or Zepbound ($1,059/mo). The price includes a licensed provider evaluation, medication if prescribed, free 2-day shipping, and ongoing care-team support.`
        : `Nature's Journey is not yet available in ${stateName}. When we launch, compounded GLP-1 pricing will match our national rate of $279/mo — roughly 79% less than retail pricing for FDA-approved brands.`,
    },
    {
      question: `Does insurance cover GLP-1 medications in ${stateName}?`,
      answer: `Insurance coverage for GLP-1 weight-loss medications varies widely in ${stateName}. Brand-name Wegovy and Zepbound are typically covered only when specific BMI + comorbidity criteria are met. Many plans still deny coverage outright. Nature's Journey is cash-pay (no insurance required) with transparent pricing.`,
    },
    {
      question: `Is it legal to get compounded semaglutide in ${stateName}?`,
      answer: `Yes. Compounded medications are legal when prepared by a state-licensed 503A or 503B compounding pharmacy under an individual prescription from a licensed provider. Nature's Journey only sources from licensed pharmacies following FDA compounding regulations. Your provider in ${stateName} will confirm whether compounded semaglutide or tirzepatide is appropriate for you.`,
    },
    {
      question: `Do I need to see a doctor in ${stateName} in person?`,
      answer: `No in-person visits required. ${available ? `${stateName} permits asynchronous telehealth evaluations for GLP-1 prescribing, so your entire care experience — intake, evaluation, dose adjustments — happens online with a licensed provider.` : `We'll offer full telehealth care in ${stateName} once we launch. No in-person visits will be required.`}`,
    },
    {
      question: "What's included in the monthly cost?",
      answer: "Every Nature's Journey plan includes: licensed provider evaluation, personalized treatment plan, medication if prescribed, free 2-day shipping, secure messaging with your care team, progress tracking, and HIPAA-compliant records. No hidden consult fees, no pharmacy fees.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes. All plans are month-to-month. Cancel, pause, or downgrade from your dashboard in two clicks. We also offer a 30-day money-back guarantee on your first month.",
    },
  ];
}

// ─── Page ───────────────────────────────────────────────────
export default async function Glp1CostStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const info = allStates.find((s) => s.slug === state);
  if (!info) notFound();

  const faqs = buildFaqs(info.name, info.available);

  return (
    <MarketingShell>
      <MedicalWebPageJsonLd
        name={`GLP-1 Weight Loss Cost in ${info.name} — Nature's Journey`}
        description={`GLP-1 medication pricing, eligibility, and telehealth availability in ${info.name}. From $279/mo.`}
        url={`/glp1-cost/${state}`}
        medicalAudience="Patient"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "GLP-1 Cost", href: "/glp1-cost" },
          { name: info.name, href: `/glp1-cost/${state}` },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />
      <ViewContentTracker
        contentName={`GLP-1 Cost: ${info.name}`}
        contentCategory="state-cost"
        contentIds={[state]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-14 sm:py-20">
        <SectionShell className="max-w-3xl text-center">
          <Badge variant="default" className="mb-4">
            GLP-1 Cost · {info.name}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            GLP-1 weight loss in {info.name}
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              from $279/mo
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            {info.available
              ? `Compounded semaglutide and tirzepatide prescribed online by licensed ${info.name} providers. Up to 79% less than brand-name retail. Free 2-day shipping.`
              : `We're not yet prescribing in ${info.name}, but you can join the waitlist to be notified the moment we launch — and lock in our $279/mo national pricing.`}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white border border-navy-100/60 px-5 py-2.5 shadow-premium-sm">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-xl font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">
              Save 79%
            </span>
          </div>

          <div className="mt-8">
            {info.available ? (
              <Link href={`/qualify?state=${info.code}`}>
                <Button variant="emerald" size="xl" className="gap-2 rounded-full px-10">
                  See If I Qualify in {info.name}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href={`/states?waitlist=${info.code}`}>
                <Button variant="outline" size="xl" className="gap-2 rounded-full px-10">
                  Join the {info.name} Waitlist
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          <p className="mt-3 text-xs text-graphite-400">
            {info.available
              ? "2-minute assessment · No commitment · Cancel anytime"
              : "No charge until we launch · We'll email you first"}
          </p>
        </SectionShell>
      </section>

      {/* Trust bar */}
      <section className="border-y border-navy-100/40 bg-linen py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-graphite-500">
          <span className="flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-teal" /> Licensed {info.name} providers
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" /> 503A/503B pharmacy
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-teal" /> Free 2-day shipping
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-teal" /> No hidden fees
          </span>
        </div>
      </section>

      {/* Cost breakdown */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-navy">
            What members in {info.name} actually pay
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-graphite-500">
            Side-by-side comparison of monthly out-of-pocket costs — no insurance, no hidden fees,
            no consult add-ons.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-graphite-500">
                Brand-name retail
              </p>
              <p className="mt-3 text-3xl font-bold text-graphite-400 line-through">
                $1,349<span className="text-lg font-normal">/mo</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">
                Cash-pay Wegovy or Zepbound without insurance
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-graphite-500">
                <li>⚠ Frequent shortages</li>
                <li>⚠ Insurance often denied</li>
                <li>⚠ Separate consult fees</li>
              </ul>
            </div>

            <div className="relative rounded-2xl border-2 border-teal bg-gradient-to-br from-teal-50/60 to-white p-6 shadow-premium">
              <Badge variant="success" className="absolute -top-2.5 right-4">
                Most popular in {info.name}
              </Badge>
              <p className="text-xs font-bold uppercase tracking-wider text-teal">
                Nature's Journey
              </p>
              <p className="mt-3 text-3xl font-bold text-navy">
                $279<span className="text-lg font-normal text-graphite-500">/mo</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">
                Compounded GLP-1 + provider + shipping, all-inclusive
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-graphite-600">
                <li className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Licensed {info.name} provider
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Medication + free shipping
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Dose adjustments included
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Cancel anytime
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-graphite-500">
                Big-box telehealth
              </p>
              <p className="mt-3 text-3xl font-bold text-navy">
                $399–$529<span className="text-lg font-normal text-graphite-500">/mo</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">
                Standard telehealth weight-loss pricing in {info.name}
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-graphite-500">
                <li>– Basic provider access</li>
                <li>– Limited support tools</li>
                <li>– Often no nutrition support</li>
              </ul>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-graphite-400">
            Prices reflect 2026 cash-pay averages. Individual pricing may vary based on specific
            medication, dose, and plan level. Compounded medications are not FDA-approved.
          </p>
        </SectionShell>
      </section>

      {/* Availability note */}
      <section className="py-10 bg-cloud">
        <SectionShell className="max-w-3xl">
          <div className="flex items-start gap-3 rounded-2xl border border-navy-100/60 bg-white p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
            <div>
              <p className="text-sm font-bold text-navy">
                Availability in {info.name}
              </p>
              <p className="mt-1 text-sm text-graphite-600 leading-relaxed">
                {info.available
                  ? `Nature's Journey is currently prescribing in ${info.name}. Your provider will be licensed in ${info.name} and your medication will ship from a pharmacy that can dispense into your state. Availability is subject to continuing regulatory compliance in each state.`
                  : `We do not currently prescribe in ${info.name}. Join the waitlist and we'll email you the moment we launch — along with our locked-in national pricing.`}
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-navy">
            GLP-1 cost FAQs — {info.name}
          </h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.question}
                className="group rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium-sm"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-navy">{f.question}</span>
                  <span className="text-graphite-400 group-open:rotate-180 transition-transform">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-graphite-500">{f.answer}</p>
              </details>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Internal links — SEO siloing */}
      <section className="py-10 bg-cloud">
        <SectionShell className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-graphite-500 mb-3">
            Related resources
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href="/glp1-cost"
              className="rounded-lg border border-navy-100/40 bg-white px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              Full GLP-1 cost guide →
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-navy-100/40 bg-white px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              Plans &amp; pricing →
            </Link>
            <Link
              href="/medications"
              className="rounded-lg border border-navy-100/40 bg-white px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              All GLP-1 medications →
            </Link>
            <Link
              href="/compare"
              className="rounded-lg border border-navy-100/40 bg-white px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              Compare programs →
            </Link>
            <Link
              href="/states"
              className="rounded-lg border border-navy-100/40 bg-white px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              All state availability →
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Final CTA */}
      <section className="py-14 bg-gradient-to-br from-navy to-atlantic text-white text-center">
        <SectionShell className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            {info.available
              ? `Start your GLP-1 journey in ${info.name}`
              : `Join the ${info.name} waitlist`}
          </h2>
          <p className="mt-3 text-white/80">
            {info.available
              ? "Free 2-minute assessment. A licensed provider reviews within 1 business day."
              : "Be first in line the moment we launch in your state. No charge until then."}
          </p>
          <div className="mt-6">
            {info.available ? (
              <Link href={`/qualify?state=${info.code}`}>
                <Button variant="gold" size="xl" className="gap-2 rounded-full px-10">
                  Start Free Assessment
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href={`/states?waitlist=${info.code}`}>
                <Button variant="gold" size="xl" className="gap-2 rounded-full px-10">
                  Join Waitlist
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </SectionShell>
      </section>

      {/* Disclaimer */}
      <section className="bg-linen/60 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Disclaimer text={siteConfig.compliance.shortDisclaimer} size="sm" />
          <p className="mt-3 text-[11px] text-graphite-400">
            Compounded GLP-1 medications are not FDA-approved drug products. Prepared by
            state-licensed compounding pharmacies under individual prescription. Availability,
            eligibility, and pricing determined at provider evaluation. Individual results vary.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
