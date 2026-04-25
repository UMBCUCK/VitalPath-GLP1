/**
 * /glp1-cost/medication/[slug]
 * ─────────────────────────────────────────────────────────────
 * Tier 12.5 — Per-medication cost SEO pages. Each captures a specific
 * brand-vs-compounded cost comparison search:
 *
 *   - /glp1-cost/medication/semaglutide
 *   - /glp1-cost/medication/tirzepatide
 *   - /glp1-cost/medication/liraglutide
 *
 * High-intent long-tail queries: "how much does semaglutide cost without
 * insurance", "tirzepatide price compounded", etc. Each page has unique
 * brand/compounded pricing comparison + medication-specific FAQs.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Stethoscope,
  Truck,
  DollarSign,
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

interface MedicationDetail {
  slug: string;
  genericName: string;
  brandNames: string[];
  ourPriceCents: number;
  retailMonthlyCents: number;
  mechanism: string;
  schedule: string;
  averageWeightLoss: string;
  trialReference: string;
  faqs: { question: string; answer: string }[];
}

const MEDS: Record<string, MedicationDetail> = {
  semaglutide: {
    slug: "semaglutide",
    genericName: "Semaglutide",
    brandNames: ["Wegovy", "Ozempic"],
    ourPriceCents: 27900,
    retailMonthlyCents: 134900,
    mechanism:
      "GLP-1 receptor agonist. Slows gastric emptying, suppresses appetite via the hypothalamus, and improves insulin sensitivity.",
    schedule: "Once weekly subcutaneous injection.",
    averageWeightLoss:
      "~14.9% of body weight at 68 weeks (STEP-1 trial, semaglutide 2.4mg + lifestyle).",
    trialReference: "Wilding et al., NEJM 2021 (STEP-1)",
    faqs: [
      {
        question: "How much does semaglutide cost without insurance?",
        answer:
          "Brand-name Wegovy (semaglutide 2.4mg for weight loss) cash-pays at approximately $1,349/month. Brand-name Ozempic (semaglutide for diabetes, often used off-label for weight loss) is approximately $935/month cash-pay. Compounded semaglutide through Nature's Journey starts at $279/month — about 79% less than Wegovy retail.",
      },
      {
        question: "Is compounded semaglutide the same drug as Wegovy?",
        answer:
          "The active ingredient is identical — semaglutide. The clinical efficacy data established for semaglutide applies to the molecule. Differences: Wegovy is FDA-approved as a finished product; compounded semaglutide is prepared under prescription in 503A/503B compounding pharmacies and is not FDA-approved as a finished product. Both are legal under federal compounding regulations.",
      },
      {
        question: "How much weight do people lose on semaglutide?",
        answer:
          "The STEP-1 clinical trial reported an average of ~14.9% body-weight loss at 68 weeks for adults with obesity (BMI ≥30) on semaglutide 2.4mg plus lifestyle intervention, vs ~2.4% on placebo + lifestyle. Individual results vary widely based on starting weight, dose progression, lifestyle adherence, and other factors.",
      },
      {
        question: "What's the dose progression?",
        answer:
          "Semaglutide is titrated up over 16+ weeks: 0.25mg → 0.5mg → 1.0mg → 1.7mg → 2.4mg, each step taken weekly for 4 weeks before increasing. Slow titration minimizes nausea and other GI side effects. Your provider may pause titration if side effects are pronounced.",
      },
      {
        question: "Are side effects the same for compounded vs brand-name?",
        answer:
          "Yes. The molecule and dose drive side-effect profile, not the manufacturing path. Common side effects: nausea, constipation, diarrhea, decreased appetite — usually mild-to-moderate and most pronounced during dose escalation. Serious side effects (pancreatitis, gallbladder issues) are rare but require immediate provider contact.",
      },
    ],
  },
  tirzepatide: {
    slug: "tirzepatide",
    genericName: "Tirzepatide",
    brandNames: ["Zepbound", "Mounjaro"],
    ourPriceCents: 39900,
    retailMonthlyCents: 105900,
    mechanism:
      "Dual GIP / GLP-1 receptor agonist. Activates two appetite-regulating receptors simultaneously, producing larger weight loss than GLP-1 alone.",
    schedule: "Once weekly subcutaneous injection.",
    averageWeightLoss:
      "~22.5% of body weight at 72 weeks (SURMOUNT-1 trial, tirzepatide 15mg).",
    trialReference: "Jastreboff et al., NEJM 2022 (SURMOUNT-1)",
    faqs: [
      {
        question: "How much does tirzepatide cost without insurance?",
        answer:
          "Brand-name Zepbound (tirzepatide for weight loss) cash-pays at approximately $1,059/month. Brand-name Mounjaro (tirzepatide for diabetes, often used off-label for weight loss) runs $1,069/month cash-pay. Compounded tirzepatide through Nature's Journey starts at $399/month — about 62% less than Zepbound retail.",
      },
      {
        question: "Is tirzepatide more effective than semaglutide?",
        answer:
          "Head-to-head data favors tirzepatide. The SURPASS-2 trial (in type 2 diabetes) showed tirzepatide 5/10/15mg outperforming semaglutide 1mg on both A1C and weight loss. SURMOUNT-1 (weight loss in obesity) reported up to 22.5% body-weight loss on tirzepatide vs ~14.9% on semaglutide in STEP-1. Tirzepatide does cost more, both retail and compounded.",
      },
      {
        question: "What's the dose progression?",
        answer:
          "Tirzepatide titrates monthly: 2.5mg → 5mg → 7.5mg → 10mg → 12.5mg → 15mg, each held for 4 weeks before increasing. Many patients reach maximum benefit at 10–15mg. Your provider sets your individual stop point based on response and tolerability.",
      },
      {
        question: "Tirzepatide vs semaglutide — which is right for me?",
        answer:
          "Both work. Tirzepatide tends to produce more weight loss and may be preferred if you have a higher starting BMI or didn't respond well to semaglutide. Semaglutide has more long-term safety data, often costs less, and is widely studied. Your provider will recommend based on your goals, history, and side-effect tolerance.",
      },
      {
        question: "Why does tirzepatide cost more than semaglutide?",
        answer:
          "Tirzepatide is a more complex peptide and the supply chain reflects that. Compounded tirzepatide also commands a premium because of its strong efficacy data and demand. Pricing for both brand and compounded forms reflects manufacturing complexity + market dynamics, not pharmacy markup.",
      },
    ],
  },
  liraglutide: {
    slug: "liraglutide",
    genericName: "Liraglutide",
    brandNames: ["Saxenda", "Victoza"],
    ourPriceCents: 21900,
    retailMonthlyCents: 145100,
    mechanism:
      "GLP-1 receptor agonist (older generation than semaglutide). Once-daily injection, suppresses appetite and slows gastric emptying.",
    schedule: "Once daily subcutaneous injection.",
    averageWeightLoss:
      "~8% of body weight at 56 weeks (SCALE Obesity and Prediabetes trial, liraglutide 3mg).",
    trialReference: "Pi-Sunyer et al., NEJM 2015 (SCALE)",
    faqs: [
      {
        question: "How much does liraglutide cost?",
        answer:
          "Brand-name Saxenda (liraglutide 3mg for weight loss) cash-pays at approximately $1,451/month. Generic liraglutide is starting to be available for diabetes use at $400-700/month. Compounded liraglutide through Nature's Journey starts at $219/month — significantly less than brand-name Saxenda.",
      },
      {
        question: "Why is liraglutide cheaper than semaglutide?",
        answer:
          "Liraglutide is the older-generation GLP-1, with patents expiring and generic competition emerging. Semaglutide and tirzepatide are newer molecules with active patent protection (in the US through the late 2020s). The price difference reflects market lifecycle, not effectiveness on dose-equivalent comparison.",
      },
      {
        question: "Is liraglutide as effective as semaglutide?",
        answer:
          "Liraglutide produces less weight loss head-to-head — about 8% body-weight loss at peak vs 14.9% for semaglutide in their respective pivotal trials. Liraglutide is also a daily injection vs weekly. For some patients, liraglutide is preferable when cost is the primary driver, when daily dosing fits their schedule, or when there's a known semaglutide intolerance.",
      },
      {
        question: "Can I switch from liraglutide to semaglutide?",
        answer:
          "Yes — many patients start on liraglutide and graduate to semaglutide for stronger effect. Your provider manages the transition with appropriate washout and re-titration to minimize side effects.",
      },
      {
        question: "What's the dose progression for liraglutide?",
        answer:
          "Liraglutide titrates weekly: 0.6mg → 1.2mg → 1.8mg → 2.4mg → 3.0mg, each held for 7 days before stepping up. Final dose for weight loss is typically 3.0mg/day.",
      },
    ],
  },
};

// ─── Static params ──────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(MEDS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = MEDS[slug];
  if (!m) return { title: "Medication not found" };
  const url = `${siteConfig.url}/glp1-cost/medication/${slug}`;
  return {
    title: `${m.genericName} Cost in 2026 — From $${(m.ourPriceCents / 100).toFixed(0)}/mo (compounded) | Nature's Journey`,
    description: `How much does ${m.genericName.toLowerCase()} cost? Brand-name (${m.brandNames.join(" / ")}) at $${(m.retailMonthlyCents / 100).toFixed(0)}/mo retail vs compounded ${m.genericName.toLowerCase()} from $${(m.ourPriceCents / 100).toFixed(0)}/mo through Nature's Journey.`,
    keywords: [
      `${m.genericName.toLowerCase()} cost`,
      `${m.genericName.toLowerCase()} price`,
      `${m.genericName.toLowerCase()} without insurance`,
      `compounded ${m.genericName.toLowerCase()}`,
      ...m.brandNames.map((b) => `${b} cost`),
      ...m.brandNames.map((b) => `${b} alternative`),
    ],
    openGraph: {
      title: `${m.genericName} Cost — From $${(m.ourPriceCents / 100).toFixed(0)}/mo`,
      description: `Compounded ${m.genericName.toLowerCase()} prescribed online by licensed providers. ${Math.round(((m.retailMonthlyCents - m.ourPriceCents) / m.retailMonthlyCents) * 100)}% less than brand-name retail.`,
      url,
      type: "website",
    },
    alternates: { canonical: url },
  };
}

export default async function MedicationCostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = MEDS[slug];
  if (!m) notFound();

  const savingsPct = Math.round(
    ((m.retailMonthlyCents - m.ourPriceCents) / m.retailMonthlyCents) * 100,
  );

  return (
    <MarketingShell>
      <MedicalWebPageJsonLd
        name={`${m.genericName} Cost — Nature's Journey`}
        description={`Cost comparison and clinical overview for ${m.genericName} (brand: ${m.brandNames.join(", ")}) — including cash-pay retail vs compounded pricing.`}
        url={`/glp1-cost/medication/${m.slug}`}
        medicalAudience="Patient"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "GLP-1 Cost", href: "/glp1-cost" },
          { name: m.genericName, href: `/glp1-cost/medication/${m.slug}` },
        ]}
      />
      <FAQPageJsonLd faqs={m.faqs} />
      <ViewContentTracker
        contentName={`Medication Cost: ${m.genericName}`}
        contentCategory="medication-cost"
        contentIds={[m.slug]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-14 sm:py-20">
        <SectionShell className="max-w-3xl text-center">
          <Badge variant="default" className="mb-4">
            {m.genericName} cost · 2026
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {m.genericName} cost
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              from ${(m.ourPriceCents / 100).toFixed(0)}/mo
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Brand-name {m.brandNames.join(" / ")} cash-pays at $
            {(m.retailMonthlyCents / 100).toFixed(0)}/mo. Compounded{" "}
            {m.genericName.toLowerCase()} through Nature&apos;s Journey starts at $
            {(m.ourPriceCents / 100).toFixed(0)}/mo — {savingsPct}% less, same active
            ingredient, prescribed online by a licensed provider.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white border border-navy-100/60 px-5 py-2.5 shadow-premium-sm">
            <span className="text-sm text-graphite-400 line-through">
              ${(m.retailMonthlyCents / 100).toFixed(0)}/mo retail
            </span>
            <span className="text-xl font-bold text-navy">
              ${(m.ourPriceCents / 100).toFixed(0)}/mo
            </span>
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">
              Save {savingsPct}%
            </span>
          </div>

          <div className="mt-8">
            <Link href={`/qualify?ref=${m.slug}`}>
              <Button variant="emerald" size="xl" className="gap-2 rounded-full px-10">
                See If I Qualify
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Trust bar */}
      <section className="border-y border-navy-100/40 bg-linen py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-graphite-500">
          <span className="flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-teal" /> US-licensed providers
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" /> 503A/503B pharmacy
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-teal" /> Free 2-day shipping
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-teal" /> No insurance required
          </span>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-navy">
            Brand vs compounded {m.genericName.toLowerCase()}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-graphite-500">
            Same active ingredient. Different regulatory pathway. Wildly different price.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-graphite-500">
                Brand-name retail
              </p>
              <p className="mt-2 text-3xl font-bold text-graphite-400 line-through">
                ${(m.retailMonthlyCents / 100).toFixed(0)}<span className="text-lg font-normal">/mo</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">
                {m.brandNames.join(" / ")} cash-pay without insurance
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-graphite-500">
                <li>✓ FDA-approved finished product</li>
                <li>✗ Frequent shortages 2024–2026</li>
                <li>✗ Insurance often denied</li>
                <li>✗ Extra consult / pharmacy fees</li>
              </ul>
            </div>
            <div className="relative rounded-2xl border-2 border-teal bg-gradient-to-br from-teal-50/60 to-white p-6 shadow-premium">
              <Badge variant="success" className="absolute -top-2.5 right-4">
                {savingsPct}% less
              </Badge>
              <p className="text-xs font-bold uppercase tracking-wider text-teal">
                Nature&apos;s Journey compounded
              </p>
              <p className="mt-2 text-3xl font-bold text-navy">
                ${(m.ourPriceCents / 100).toFixed(0)}<span className="text-lg font-normal text-graphite-500">/mo</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">
                Compounded {m.genericName.toLowerCase()} + provider + shipping, all-inclusive
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-graphite-600">
                <li className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />
                  Same active ingredient
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />
                  Licensed US provider review
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />
                  Free 2-day shipping included
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />
                  Cancel anytime — no contracts
                </li>
              </ul>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Clinical context */}
      <section className="py-14 bg-cloud">
        <SectionShell className="max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-navy">
            What {m.genericName} actually does
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy-100/60 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-teal">
                Mechanism
              </p>
              <p className="mt-2 text-sm text-graphite-600 leading-relaxed">{m.mechanism}</p>
            </div>
            <div className="rounded-2xl border border-navy-100/60 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-teal">
                Schedule
              </p>
              <p className="mt-2 text-sm text-graphite-600 leading-relaxed">{m.schedule}</p>
            </div>
            <div className="rounded-2xl border border-navy-100/60 bg-white p-5 sm:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-teal">
                Average weight loss (clinical trial)
              </p>
              <p className="mt-2 text-sm text-graphite-600 leading-relaxed">
                {m.averageWeightLoss}
              </p>
              <p className="mt-2 text-[10px] text-graphite-400">
                Reference: {m.trialReference}. Individual results vary based on
                starting weight, dose progression, lifestyle, and other factors.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-navy">
            {m.genericName} cost FAQs
          </h2>
          <div className="mt-6 space-y-3">
            {m.faqs.map((f) => (
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

      {/* Related */}
      <section className="py-10 bg-cloud">
        <SectionShell className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-graphite-500 mb-3">
            Related
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.values(MEDS)
              .filter((other) => other.slug !== m.slug)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/glp1-cost/medication/${other.slug}`}
                  className="rounded-lg border border-navy-100/40 bg-white px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors"
                >
                  {other.genericName} cost →
                </Link>
              ))}
            <Link
              href="/glp1-cost"
              className="rounded-lg border border-navy-100/40 bg-white px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              Full GLP-1 cost guide →
            </Link>
            <Link
              href="/sourcing"
              className="rounded-lg border border-navy-100/40 bg-white px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors"
            >
              Where our medication comes from →
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Final CTA */}
      <section className="py-14 bg-gradient-to-br from-navy to-atlantic text-white text-center">
        <SectionShell className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Start with {m.genericName.toLowerCase()} for $
            {(m.ourPriceCents / 100).toFixed(0)}/mo
          </h2>
          <p className="mt-3 text-white/80">
            Free 2-minute assessment. A licensed provider reviews your profile within 1
            business day.
          </p>
          <div className="mt-6">
            <Link href={`/qualify?ref=${m.slug}`}>
              <Button variant="gold" size="xl" className="gap-2 rounded-full px-10">
                Start Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Disclaimer */}
      <section className="bg-linen/60 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Disclaimer text={siteConfig.compliance.shortDisclaimer} size="sm" />
          <p className="mt-3 text-[11px] text-graphite-400">
            Pricing is current as of 2026 and subject to change. Compounded
            medications are not FDA-approved drug products. Prepared by state-licensed
            compounding pharmacies under individual prescription. Eligibility,
            protocol, and final pricing determined at provider evaluation. Individual
            results vary.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
