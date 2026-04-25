/**
 * /peptides — Anti-aging & recovery peptides landing page
 * ─────────────────────────────────────────────────────────────
 * Tier 3.5 — Secondary SEO funnel targeting peptide-therapy keywords
 * (NAD+, sermorelin, BPC-157, ipamorelin). Serves two audiences:
 *   1. New visitors → pushed to /qualify?interest=peptides (still has
 *      to qualify for GLP-1 or a standalone peptide consult).
 *   2. Existing members → pushed to /dashboard/shop (marketplace).
 *
 * Compliance: peptides are provider-prescribed only, dispensed via
 * licensed compounding pharmacy (same 503A/503B adapter GLP-1 uses).
 * NO therapeutic claims — all language is provider-evaluation framing.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  ShieldCheck,
  Stethoscope,
  Truck,
  Users,
  Zap,
  Sparkles,
  HeartHandshake,
  Moon,
  Activity,
  Droplet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { SectionShell } from "@/components/shared/section-shell";
import { Disclaimer } from "@/components/shared/disclaimer";
import { MedicalWebPageJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";
import { ViewContentTracker } from "@/components/shared/view-content-tracker";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Peptide Therapy Online — Provider-Guided Anti-Aging & Recovery | Nature's Journey",
  description:
    "Prescription peptides — NAD+, BPC-157, Sermorelin, Ipamorelin/CJC-1295, Glow Stack — prescribed online by licensed providers and shipped from a compounding pharmacy. From $89/mo. Member-exclusive after 30 days on treatment.",
  keywords: [
    "peptide therapy online",
    "NAD+ injection online",
    "sermorelin online",
    "BPC-157 online",
    "ipamorelin CJC-1295",
    "anti-aging peptides",
    "peptides prescribed online",
    "telehealth peptide therapy",
    "compounded peptides",
  ],
  openGraph: {
    title: "Peptide Therapy Online — Provider-Guided Anti-Aging & Recovery",
    description:
      "Prescription peptides from licensed providers. Provider-supervised dosing, compounding pharmacy fulfillment, no membership fees. From $89/mo.",
    type: "website",
    url: `${siteConfig.url}/peptides`,
  },
  alternates: {
    canonical: `${siteConfig.url}/peptides`,
  },
};

// Tier 5.7 — FAQ data lifted from the JSX block below so it can drive
// both the rendered accordion and the FAQPage JSON-LD for SERP rich results.
const peptideFaqs = [
  {
    question: "Are peptides FDA-approved?",
    answer:
      "Compounded peptides are not FDA-approved finished products. They are prepared by state-licensed compounding pharmacies under individual prescriptions from a licensed provider. This is the same regulatory framework used for compounded semaglutide and tirzepatide.",
  },
  {
    question: "Who qualifies?",
    answer:
      "Eligibility is determined by a licensed provider based on your health profile, goals, and any relevant labs. Peptides are generally offered to healthy adults over 21 without contraindicated conditions. Your provider makes the final call.",
  },
  {
    question: "Do I have to be a GLP-1 member first?",
    answer:
      "No. You can start directly on peptides with a provider evaluation. Many members do combine GLP-1 and peptide protocols — pricing is per-medication, not per-program.",
  },
  {
    question: "How are peptides delivered?",
    answer:
      "Most peptides are self-administered via subcutaneous injection on a protocol designed by your provider. A starter kit with syringes, alcohol swabs, and dosing instructions ships with your first order.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Yes. All peptide subscriptions are month-to-month. Cancel, pause, or change from your dashboard anytime.",
  },
  {
    question: "Is this safe?",
    answer:
      "Safety depends on appropriate provider evaluation, proper dosing, and fulfillment from a licensed compounding pharmacy. We use the same pharmacy network and provider review process as our GLP-1 program. Follow your provider's instructions exactly and report any adverse effects immediately.",
  },
];

const peptides = [
  {
    slug: "nad-plus",
    name: "NAD+ Injection",
    tagline: "Cellular energy & mental clarity",
    description:
      "Nicotinamide adenine dinucleotide — a coenzyme involved in cellular energy production. Weekly self-administered subcutaneous injection.",
    price: 149,
    badge: "Most Popular",
    icon: Zap,
    color: "text-gold",
    bgColor: "bg-gold-50",
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    tagline: "Sleep quality & recovery",
    description:
      "Growth hormone releasing hormone analog. Nightly subcutaneous injection protocol, adjusted by your provider.",
    price: 199,
    icon: Moon,
    color: "text-atlantic",
    bgColor: "bg-blue-50",
  },
  {
    slug: "ipamorelin-cjc",
    name: "Ipamorelin / CJC-1295",
    tagline: "Body composition & anti-aging",
    description:
      "Synergistic peptide combination used for body composition support. Daily injection, provider-customized dosing.",
    price: 229,
    badge: "Best Value",
    icon: Activity,
    color: "text-teal",
    bgColor: "bg-teal-50",
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    tagline: "Gut health & soft-tissue recovery",
    description:
      "Body protective compound. Frequently added to GLP-1 regimens for digestive comfort and recovery support.",
    price: 129,
    icon: HeartHandshake,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    slug: "glow-stack",
    name: "Glow Stack",
    tagline: "Skin, hair & nail support",
    description:
      "Glutathione + biotin combination. Weekly injection or oral lozenge. Popular during rapid weight loss.",
    price: 89,
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    slug: "thymosin-beta-4",
    name: "Thymosin Beta-4",
    tagline: "Recovery & immune support",
    description:
      "Naturally occurring peptide used for recovery and repair. Weekly subcutaneous injection.",
    price: 179,
    icon: Droplet,
    color: "text-rose-500",
    bgColor: "bg-rose-50",
  },
];

export default function PeptidesPage() {
  return (
    <MarketingShell>
      <MedicalWebPageJsonLd
        name="Peptide Therapy Online — Nature's Journey"
        description="Provider-prescribed peptide therapy including NAD+, Sermorelin, BPC-157, Ipamorelin/CJC-1295, Glow Stack, and Thymosin Beta-4. Compounding pharmacy fulfillment."
        url="/peptides"
        medicalAudience="Patient"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Peptides", href: "/peptides" },
        ]}
      />
      {/* Tier 5.7 — FAQ rich-results schema */}
      <FAQPageJsonLd faqs={peptideFaqs} />

      {/* Tier 5.1 — Meta CAPI ViewContent for retargeting */}
      <ViewContentTracker
        contentName="Peptides Landing Page"
        contentCategory="peptides"
        contentIds={peptides.map((p) => p.slug)}
      />

      {/* ═══ Hero ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy via-atlantic to-navy text-white py-16 sm:py-24">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal/10 blur-3xl" />

        <SectionShell className="relative max-w-3xl text-center">
          <Badge variant="gold" className="mb-4 gap-1.5 bg-gold/20 text-gold border-gold/30">
            <Sparkles className="h-3 w-3" /> Provider-supervised peptide therapy
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Peptide therapy,
            <br />
            <span className="bg-gradient-to-r from-gold via-gold to-white bg-clip-text text-transparent">
              prescribed online.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            NAD+, Sermorelin, BPC-157, Ipamorelin/CJC-1295, Glow Stack, and
            Thymosin Beta-4 — evaluated by a licensed provider, compounded by a
            licensed pharmacy, shipped to your door. From <strong className="text-white">$89/mo</strong>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/qualify?interest=peptides">
              <Button variant="emerald" size="xl" className="gap-2 rounded-full px-10">
                See If I Qualify
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard/shop">
              <Button
                size="xl"
                variant="outline"
                className="gap-2 rounded-full border-white/30 text-white bg-white/5 hover:bg-white/10"
              >
                Existing member? Add to plan
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-white/85">
            Eligibility, protocol, and dosing determined by a licensed provider based on your
            individual health profile. Compounded peptides are not FDA-approved products.
          </p>
        </SectionShell>
      </section>

      {/* ═══ Trust bar ═══ */}
      <section className="border-y border-navy-100/40 bg-linen py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-graphite-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" /> Licensed US providers
          </span>
          <span className="flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-teal" /> Compounding pharmacy
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-teal" /> Free 2-day shipping
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-teal" /> 18,000+ patients served
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal" /> Typically reviewed in 1 business day
          </span>
        </div>
      </section>

      {/* ═══ Peptide grid ═══ */}
      <section className="py-16 sm:py-20 bg-cloud">
        <SectionShell>
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-3">
              Available peptides
            </Badge>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">Choose your protocol</h2>
            <p className="mx-auto mt-3 max-w-2xl text-graphite-500">
              Every peptide is provider-evaluated before prescribing. Pricing reflects monthly
              cost at the most common provider-prescribed dose.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {peptides.map((p) => (
              <div
                key={p.slug}
                className="group relative rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-sm transition-all hover:shadow-premium-lg hover:border-teal/40"
              >
                {p.badge && (
                  <Badge
                    variant="gold"
                    className="absolute -top-2.5 right-4 text-[10px] uppercase tracking-wider"
                  >
                    {p.badge}
                  </Badge>
                )}
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.bgColor}`}>
                  <p.icon className={`h-6 w-6 ${p.color}`} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{p.name}</h3>
                <p className="mt-0.5 text-xs font-semibold text-teal">{p.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-graphite-500">{p.description}</p>
                <div className="mt-5 flex items-baseline gap-1.5 border-t border-navy-100/40 pt-4">
                  <span className="text-xs text-graphite-400">From</span>
                  <span className="text-2xl font-bold text-navy">${p.price}</span>
                  <span className="text-sm text-graphite-400">/mo</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-graphite-400">
            Prices are examples of typical monthly cost at provider-prescribed doses.
            Final pricing, availability, and eligibility confirmed at provider evaluation.
          </p>
        </SectionShell>
      </section>

      {/* ═══ How it works ═══ */}
      <section className="py-16 bg-white">
        <SectionShell className="max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-navy">How it works</h2>
            <p className="mt-3 text-graphite-500">
              Same process as our GLP-1 program — built to be compliant, safe, and simple.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "1",
                title: "Free online evaluation",
                desc: "Complete a 2-minute health profile. A US-licensed provider reviews your eligibility.",
                icon: Stethoscope,
              },
              {
                n: "2",
                title: "Custom protocol",
                desc: "If appropriate, your provider designs a peptide protocol tailored to your goals and labs.",
                icon: Sparkles,
              },
              {
                n: "3",
                title: "Shipped from pharmacy",
                desc: "A licensed compounding pharmacy ships your peptides — free 2-day delivery. Refills on autopilot.",
                icon: Truck,
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-sm text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal font-bold text-lg">
                  {step.n}
                </div>
                <step.icon className="mx-auto mt-3 h-5 w-5 text-teal" />
                <h3 className="mt-3 text-lg font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-graphite-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Tier 6.7 — Pre-built peptide stacks.
          Curated 2-peptide bundles reduce decision fatigue for first-time
          peptide buyers and anchor AOV higher than single-SKU browsing. */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-5xl">
          <div className="text-center mb-8">
            <Badge variant="gold" className="mb-3">Stacks</Badge>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              Pre-built stacks — provider-reviewed combinations
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-graphite-500">
              Not sure where to start? These are the most-prescribed peptide pairings at your
              life stage. Your provider confirms the combination fits your profile before any
              prescription is issued.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                slug: "recovery",
                name: "The Recovery Stack",
                subtitle: "For active adults + GLP-1 month 1",
                pieces: ["BPC-157", "Thymosin Beta-4"],
                priceCents: 28900,
                originalCents: 30800,
                note: "Most popular add-on to GLP-1",
                accent: "teal",
              },
              {
                slug: "longevity",
                name: "The Longevity Stack",
                subtitle: "For adults 40+ focused on aging well",
                pieces: ["NAD+", "Sermorelin"],
                priceCents: 32900,
                originalCents: 34800,
                note: "Best for sleep, energy, recovery",
                accent: "gold",
              },
              {
                slug: "glow",
                name: "The Glow Stack+",
                subtitle: "For rapid weight-loss journeys",
                pieces: ["Glow Stack", "BPC-157"],
                priceCents: 20900,
                originalCents: 21800,
                note: "Targets skin, hair & digestion",
                accent: "rose",
              },
            ].map((stack) => (
              // Tier 8.2 — link to the new /peptides/stacks/[slug] detail
              // page instead of jumping straight into /qualify. The detail
              // page has the full rationale + FAQ that high-intent stack
              // shoppers want to read before committing.
              <Link
                key={stack.slug}
                href={`/peptides/stacks/${stack.slug}`}
                className="group relative rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium-sm transition-all hover:shadow-premium-lg hover:border-teal/40"
              >
                <Badge
                  variant={stack.accent === "gold" ? "gold" : "default"}
                  className="absolute -top-2 left-4 text-[9px] uppercase tracking-wider"
                >
                  {stack.note}
                </Badge>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-teal">
                  {stack.subtitle}
                </p>
                <h3 className="mt-1 text-lg font-bold text-navy">{stack.name}</h3>
                <ul className="mt-3 space-y-1">
                  {stack.pieces.map((piece) => (
                    <li key={piece} className="flex items-center gap-2 text-sm text-graphite-600">
                      <Check className="h-3.5 w-3.5 shrink-0 text-teal" />
                      <span>{piece}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-baseline justify-between border-t border-navy-100/40 pt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-graphite-400 line-through">
                      ${(stack.originalCents / 100).toFixed(0)}
                    </span>
                    <span className="text-xl font-bold text-navy">
                      ${(stack.priceCents / 100).toFixed(0)}
                      <span className="text-xs font-normal text-graphite-400">/mo</span>
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-graphite-400 group-hover:text-teal transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-6 text-center text-[11px] text-graphite-400">
            Stack pricing is indicative. Actual prescription + pricing confirmed at provider evaluation.
          </p>
        </SectionShell>
      </section>

      {/* ═══ Combined protocol callout ═══ */}
      <section className="py-16 bg-gradient-to-b from-sage/20 to-white">
        <SectionShell className="max-w-3xl">
          <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-8 text-center">
            <Badge variant="default" className="mb-3">
              Most popular combination
            </Badge>
            <h3 className="text-2xl font-bold text-navy">
              GLP-1 + peptides — the full-stack protocol
            </h3>
            <p className="mt-3 text-graphite-500 max-w-xl mx-auto">
              Many members start with GLP-1 therapy for weight management, then add peptides
              once they've stabilized (typically around day 30). You only pay for what your
              provider prescribes. No bundling, no gimmicks.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "GLP-1 base protocol: $179/mo — medication if prescribed",
                "Peptide add-on: from $89/mo — NAD+, BPC-157, etc.",
                "One pharmacy. One provider. One monthly invoice.",
                "Cancel or pause either anytime — no contracts.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 rounded-xl bg-white border border-teal-100 p-3 text-left"
                >
                  <Check className="h-4 w-4 shrink-0 text-teal mt-0.5" />
                  <span className="text-sm text-navy">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/qualify?interest=peptides">
                <Button variant="emerald" size="lg" className="gap-2 rounded-full">
                  Start with a free assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 bg-white">
        <SectionShell className="max-w-3xl">
          <h2 className="text-3xl font-bold text-navy text-center">Common questions</h2>
          <div className="mt-8 space-y-3">
            {peptideFaqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium-sm"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-navy">{item.question}</span>
                  <span className="text-graphite-400 group-open:rotate-180 transition-transform">
                    ⌄
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-graphite-500">{item.answer}</p>
              </details>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* ═══ Final CTA ═══ */}
      <section className="py-16 bg-gradient-to-br from-navy to-atlantic text-white text-center">
        <SectionShell className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to see if peptides are right for you?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Start with a free 2-minute assessment — no payment info required.
          </p>
          <div className="mt-8">
            <Link href="/qualify?interest=peptides">
              <Button variant="gold" size="xl" className="gap-2 rounded-full px-10">
                See If I Qualify
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Bottom disclaimer */}
      <section className="bg-linen/60 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Disclaimer text={siteConfig.compliance.shortDisclaimer} size="sm" />
          <p className="mt-3 text-[11px] text-graphite-400">
            Compounded peptides are not FDA-approved drug products. Prepared by a state-licensed
            compounding pharmacy under individual prescription. Eligibility, protocol, and dosing
            determined by a licensed provider. Individual results vary.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
