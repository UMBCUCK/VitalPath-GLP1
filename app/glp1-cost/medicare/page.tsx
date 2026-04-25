/**
 * /glp1-cost/medicare — long-tail SEO page
 * ─────────────────────────────────────────────────────────────
 * Tier 10.4 — Captures "Medicare GLP-1" / "Does Medicare cover Wegovy"
 * queries. These are high-volume long-tail searches tied to the 55+
 * demographic — very valuable for a telehealth weight-loss program
 * because this cohort has strong retention characteristics and high
 * lifetime value.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Stethoscope,
  DollarSign,
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

export const metadata: Metadata = {
  title: "Does Medicare Cover GLP-1 for Weight Loss? (2026) — From $279/mo",
  description:
    "Medicare coverage of Wegovy, Zepbound, and Ozempic in 2026. What's covered, what isn't, and the compounded GLP-1 cash-pay path for Medicare beneficiaries — from $279/mo.",
  keywords: [
    "Medicare GLP-1",
    "does Medicare cover Wegovy",
    "Medicare Zepbound coverage",
    "Medicare Ozempic weight loss",
    "GLP-1 for seniors",
    "Part D GLP-1",
    "compounded semaglutide Medicare",
    "weight loss medication over 65",
  ],
  openGraph: {
    title: "Does Medicare Cover GLP-1 for Weight Loss?",
    description:
      "What Medicare does and doesn't cover, plus the cash-pay path from $279/mo for beneficiaries whose weight-loss treatment isn't covered.",
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/glp1-cost/medicare` },
};

const faqs = [
  {
    question: "Does Medicare cover Wegovy or Zepbound for weight loss?",
    answer:
      "Traditional Medicare Part D has historically excluded drugs used for weight loss. As of 2026, some Medicare Advantage plans may cover Wegovy under expanded indications (e.g., cardiovascular-risk reduction based on the 2024 FDA label expansion), but coverage for pure weight-loss use is still limited. Always check your specific plan's formulary.",
  },
  {
    question: "What about Ozempic on Medicare?",
    answer:
      "Ozempic is covered by most Medicare Part D plans when prescribed for type 2 diabetes. It is not covered for off-label weight-loss use. Patients prescribed Ozempic for diabetes who also experience weight loss see it as a covered benefit; those seeking it purely for weight loss typically do not.",
  },
  {
    question: "What's the cash-pay alternative for Medicare patients denied coverage?",
    answer:
      "Compounded semaglutide or tirzepatide prescribed through telehealth (like Nature's Journey) is available cash-pay at $279/mo — roughly 79% less than brand-name retail. The active ingredients are the same as Wegovy or Zepbound. Many Medicare beneficiaries choose this route when their plan excludes weight-loss drugs.",
  },
  {
    question: "Is it safe to use GLP-1 medications at 65+?",
    answer:
      "GLP-1 medications have been safely studied in older adults, though the decision is individualized. A licensed provider will review your full health profile — kidney function, cardiovascular history, other medications — before prescribing. Dosing is often more conservative in older patients and titrated slowly.",
  },
  {
    question: "Can I use HSA funds on Medicare?",
    answer:
      "If you're enrolled in Medicare, you can no longer contribute to an HSA, but you can still withdraw from an existing HSA tax-free for qualified medical expenses including prescription medications. Compounded semaglutide with a licensed prescription qualifies.",
  },
  {
    question: "Are there age limits for Nature's Journey?",
    answer:
      "No upper age limit. A licensed provider evaluates each patient individually. Our providers are experienced with older-adult prescribing and will tailor dosing, monitoring cadence, and drug-interaction screening to your profile.",
  },
];

export default function MedicareGlp1CostPage() {
  return (
    <MarketingShell>
      <MedicalWebPageJsonLd
        name="GLP-1 Weight Loss Cost for Medicare Beneficiaries — Nature's Journey"
        description="Medicare coverage of Wegovy, Zepbound, and Ozempic for weight loss in 2026, plus cash-pay compounded GLP-1 alternatives for beneficiaries."
        url="/glp1-cost/medicare"
        medicalAudience="Patient"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "GLP-1 Cost", href: "/glp1-cost" },
          { name: "Medicare", href: "/glp1-cost/medicare" },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />
      <ViewContentTracker
        contentName="GLP-1 Cost: Medicare"
        contentCategory="cost-long-tail"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-14 sm:py-20">
        <SectionShell className="max-w-3xl text-center">
          <Badge variant="default" className="mb-4">Medicare &amp; GLP-1 · 2026</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Does Medicare cover GLP-1
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              for weight loss?
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            The short answer: mostly no, with a few exceptions as of 2026. The longer answer
            is below — and so is the $279/mo cash-pay path most Medicare beneficiaries choose
            when their plan excludes weight-loss drugs.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white border border-navy-100/60 px-5 py-2.5 shadow-premium-sm">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-xl font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">
              Save 79%
            </span>
          </div>

          <div className="mt-8">
            <Link href="/qualify?ref=medicare">
              <Button variant="emerald" size="xl" className="gap-2 rounded-full px-10">
                See If I Qualify
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-graphite-400">
              No insurance required · No age limit · HSA-eligible
            </p>
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
            <ShieldCheck className="h-3.5 w-3.5 text-teal" /> HIPAA-compliant
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-teal" /> HSA-eligible
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-teal" /> No age limit
          </span>
        </div>
      </section>

      {/* Medicare breakdown */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-navy">
            What Medicare covers — and what it doesn't
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-sm">
              <div className="flex items-center gap-2 mb-3">
                <Check className="h-4 w-4 text-teal" />
                <p className="text-sm font-bold text-navy">Generally covered</p>
              </div>
              <ul className="space-y-2 text-sm text-graphite-600">
                <li>• Ozempic for type 2 diabetes</li>
                <li>• Mounjaro for type 2 diabetes</li>
                <li>• Wegovy under CV-risk-reduction indication (per 2024 FDA label update)</li>
                <li>• Saxenda (less commonly)</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-premium-sm">
              <div className="flex items-center gap-2 mb-3">
                <X className="h-4 w-4 text-red-500" />
                <p className="text-sm font-bold text-navy">Generally NOT covered</p>
              </div>
              <ul className="space-y-2 text-sm text-graphite-600">
                <li>• Wegovy for pure weight-loss indication</li>
                <li>• Zepbound for weight-loss indication</li>
                <li>• Ozempic off-label for weight loss</li>
                <li>• Compounded GLP-1 medications</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-navy-100/60 bg-cloud p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
              <div>
                <p className="text-sm font-bold text-navy">Your plan's formulary is the source of truth</p>
                <p className="mt-1 text-sm text-graphite-600 leading-relaxed">
                  Medicare Advantage plans vary widely in coverage. Check your plan's formulary
                  (drug list) or call the number on your Medicare card to confirm what your
                  specific plan covers for weight management in 2026.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Cash-pay comparison */}
      <section className="py-14 bg-cloud">
        <SectionShell className="max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-navy">
            Compounded GLP-1: the cash-pay path most Medicare patients take
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-graphite-500">
            When coverage isn&apos;t there, compounded semaglutide offers the same active
            ingredient at a fraction of the brand-name retail price.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-graphite-500">
                Brand-name cash-pay
              </p>
              <p className="mt-3 text-3xl font-bold text-graphite-400 line-through">
                $1,349<span className="text-lg font-normal">/mo</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">
                Wegovy or Zepbound out-of-pocket
              </p>
            </div>
            <div className="relative rounded-2xl border-2 border-teal bg-gradient-to-br from-teal-50/60 to-white p-6 shadow-premium">
              <Badge variant="success" className="absolute -top-2.5 right-4">
                Most popular
              </Badge>
              <p className="text-xs font-bold uppercase tracking-wider text-teal">
                Compounded + Nature's Journey
              </p>
              <p className="mt-3 text-3xl font-bold text-navy">
                $279<span className="text-lg font-normal text-graphite-500">/mo</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">
                Same active ingredient, licensed provider, HSA-eligible
              </p>
            </div>
            <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-graphite-500">
                Typical Part D copay (if covered)
              </p>
              <p className="mt-3 text-3xl font-bold text-navy">
                $0–$100<span className="text-lg font-normal text-graphite-500">/mo</span>
              </p>
              <p className="mt-1 text-xs text-graphite-500">
                When prescribed for a covered indication (usually diabetes)
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-navy">
            Medicare &amp; GLP-1 FAQs
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

      {/* Final CTA */}
      <section className="py-14 bg-gradient-to-br from-navy to-atlantic text-white text-center">
        <SectionShell className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Don&apos;t let coverage gaps block your care
          </h2>
          <p className="mt-3 text-white/80">
            $279/mo, same active ingredient, prescribed by a licensed provider, no age limit.
          </p>
          <div className="mt-6">
            <Link href="/qualify?ref=medicare">
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
            Information about Medicare coverage is accurate as of 2026 and subject to plan-level
            variation. Verify with your specific plan. Compounded GLP-1 medications are not
            FDA-approved drug products. Prepared by state-licensed compounding pharmacies under
            individual prescription. Eligibility, protocol, and pricing determined at provider
            evaluation. Individual results vary.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
