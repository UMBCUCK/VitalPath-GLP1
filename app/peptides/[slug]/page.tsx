/**
 * /peptides/[slug] — per-peptide SEO landing page
 * ─────────────────────────────────────────────────────────────
 * Tier 5.3 — One dedicated page per peptide so each one ranks for
 * long-tail "<peptide> online / prescribed online" keywords. The content
 * mirrors the /peptides hub but zooms into a single protocol with its
 * own FAQs, benefits, dosing overview, and CTA.
 *
 * All copy is provider-evaluation framed — no therapeutic claims — and
 * reflects the same regulatory disclosures as /peptides.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Stethoscope,
  Truck,
  Clock,
  Sparkles,
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
  ProductJsonLd,
} from "@/components/seo/json-ld";
import { ViewContentTracker } from "@/components/shared/view-content-tracker";
import { siteConfig } from "@/lib/site";

// ─── Peptide data — single source of truth for this route ───
// Each entry drives the page title, hero, benefits, dosing, FAQs,
// SEO metadata, and JSON-LD product schema. Adding a new peptide
// is a one-object change here + a matching row in prisma/seed.ts.
interface PeptideDetail {
  slug: string;
  name: string;
  shortName: string;
  h1: string;
  tagline: string;
  description: string;
  keywords: string[];
  price: number;
  badge?: string;
  dosingSchedule: string;
  administration: string;
  commonUse: string;
  stackPairing: string;
  benefits: string[];
  contraindications: string[];
  faqs: { question: string; answer: string }[];
}

const PEPTIDES: Record<string, PeptideDetail> = {
  "nad-plus": {
    slug: "nad-plus",
    name: "NAD+ Injection",
    shortName: "NAD+",
    h1: "NAD+ Injection Therapy Online",
    tagline: "Cellular energy & mental clarity — prescribed online",
    description:
      "Nicotinamide adenine dinucleotide (NAD+) is a coenzyme present in every cell of your body. Levels naturally decline with age, and many members add NAD+ injections to support cellular energy production and mental clarity.",
    keywords: [
      "NAD+ injection online",
      "NAD plus therapy",
      "NAD+ prescribed online",
      "buy NAD+ injection",
      "NAD+ subcutaneous",
      "anti-aging NAD",
      "nicotinamide adenine dinucleotide",
    ],
    price: 149,
    badge: "Most Popular",
    dosingSchedule: "Weekly subcutaneous injection (typical starter protocol).",
    administration: "Self-administered at home with included starter kit (syringes, swabs, dosing guide).",
    commonUse:
      "Members often pair NAD+ with their GLP-1 protocol at month 2–3 for cellular energy support. Your provider may adjust frequency based on response and labs.",
    stackPairing: "Frequently combined with Sermorelin (sleep/recovery) or BPC-157 (recovery).",
    benefits: [
      "Supports cellular energy production (NAD+ is a critical coenzyme in ATP metabolism)",
      "May support mental clarity and focus",
      "Weekly protocol — easy to fit into a routine",
      "Provider-monitored dosing, shipped from a compounding pharmacy",
    ],
    contraindications: [
      "Active malignancy (check with oncologist)",
      "Pregnancy or breastfeeding",
      "Known niacin/B3 allergy",
      "Uncontrolled hypertension",
    ],
    faqs: [
      {
        question: "How quickly do I feel NAD+?",
        answer:
          "Individual response varies. Some members report improved focus and energy within 2–3 weeks of consistent dosing. Others take longer. Your provider may adjust frequency if response is slow.",
      },
      {
        question: "Is this the same as IV NAD+?",
        answer:
          "No. Subcutaneous NAD+ is self-administered at home, avoiding the time and cost of IV clinics. Bioavailability differs slightly but both approaches support cellular NAD+ levels.",
      },
      {
        question: "Can I combine NAD+ with my GLP-1?",
        answer:
          "Most members do. NAD+ works on a different pathway than GLP-1 medications and does not typically interact. Your provider will confirm compatibility based on your full profile.",
      },
      {
        question: "What are the side effects?",
        answer:
          "Temporary injection-site redness or a brief flushing sensation are the most commonly reported. Any persistent side effect should be reported to your provider immediately.",
      },
    ],
  },
  sermorelin: {
    slug: "sermorelin",
    name: "Sermorelin (GHRH)",
    shortName: "Sermorelin",
    h1: "Sermorelin Therapy Online",
    tagline: "Sleep quality & recovery — prescribed online",
    description:
      "Sermorelin is a growth hormone releasing hormone (GHRH) analog. It signals the pituitary to release its own growth hormone in natural pulses — rather than injecting synthetic HGH directly. Many members use it to support sleep quality and overnight recovery.",
    keywords: [
      "sermorelin online",
      "sermorelin prescribed online",
      "GHRH therapy",
      "sermorelin injection",
      "sermorelin telehealth",
      "sermorelin for sleep",
    ],
    price: 199,
    dosingSchedule: "Nightly subcutaneous injection, typically 5 nights per week.",
    administration: "Self-administered at bedtime with included starter kit.",
    commonUse:
      "Often used by adults over 35 who experience age-related sleep fragmentation and slower recovery. Your provider sets an individualized protocol and adjusts over time.",
    stackPairing: "Pairs well with Ipamorelin/CJC-1295 and Glow Stack for full anti-aging protocol.",
    benefits: [
      "Supports the body's natural growth hormone rhythm (rather than replacing it)",
      "May improve sleep quality (most commonly reported benefit)",
      "Supports lean muscle and overnight recovery",
      "Nightly protocol — fits into bedtime routine",
    ],
    contraindications: [
      "Active malignancy",
      "Pregnancy or breastfeeding",
      "Severe thyroid dysfunction",
      "Known hypersensitivity to the peptide",
    ],
    faqs: [
      {
        question: "Is Sermorelin the same as HGH?",
        answer:
          "No. HGH is synthetic human growth hormone injected directly. Sermorelin signals your pituitary to release its own GH in natural pulses, which most clinicians consider a more physiologic approach.",
      },
      {
        question: "When should I inject?",
        answer:
          "Typically 30–60 minutes before bed on an empty stomach, to align with the body's natural overnight GH pulse. Your provider will confirm timing.",
      },
      {
        question: "How long before I notice sleep benefits?",
        answer:
          "Members most commonly report deeper, more restorative sleep within 2–6 weeks. Full body-composition benefits usually require 3–6 months of consistent dosing.",
      },
    ],
  },
  "ipamorelin-cjc": {
    slug: "ipamorelin-cjc",
    name: "Ipamorelin / CJC-1295",
    shortName: "Ipamorelin",
    h1: "Ipamorelin / CJC-1295 Online",
    tagline: "Body composition & anti-aging synergy",
    description:
      "Ipamorelin and CJC-1295 are often combined in a single protocol. Ipamorelin mimics ghrelin to stimulate GH release; CJC-1295 extends the half-life. Together they're one of the most popular body-composition and anti-aging stacks in telehealth peptide therapy.",
    keywords: [
      "ipamorelin online",
      "CJC-1295 online",
      "ipamorelin CJC stack",
      "ipamorelin prescribed online",
      "CJC-1295 telehealth",
      "body composition peptides",
    ],
    price: 229,
    badge: "Best Value",
    dosingSchedule: "Daily subcutaneous injection, typically 5 days per week, cycled.",
    administration: "Self-administered at home; your provider provides a cycling protocol.",
    commonUse:
      "Most commonly selected by members focused on body recomposition (muscle retention + fat loss) and broader anti-aging support.",
    stackPairing: "Combined with NAD+ or BPC-157 in 3–6 month protocols under provider supervision.",
    benefits: [
      "Synergistic GH pulse — Ipamorelin (release) + CJC-1295 (extended half-life)",
      "Supports body composition goals (lean mass retention)",
      "Daily protocol, cycled as your provider directs",
      "Popular with members 35+ focused on healthy aging",
    ],
    contraindications: [
      "Active malignancy",
      "Pregnancy or breastfeeding",
      "Severe hepatic or renal disease",
      "Uncontrolled thyroid disease",
    ],
    faqs: [
      {
        question: "Why combine the two?",
        answer:
          "Ipamorelin is a short-acting GH releaser; CJC-1295 is long-acting. Combining them produces a more sustained pulse that most clinicians consider optimal for body-composition support.",
      },
      {
        question: "How long should I cycle?",
        answer:
          "Most protocols run 3–6 months on, then evaluate with a provider. Cycling helps maintain receptor sensitivity. Your provider will build a cycle tailored to you.",
      },
      {
        question: "Can I use this while on GLP-1?",
        answer:
          "Yes, and many members do — the goals are complementary (GLP-1 for weight loss, Ipa/CJC for lean-mass support). Your provider confirms compatibility with your labs.",
      },
    ],
  },
  "bpc-157": {
    slug: "bpc-157",
    name: "BPC-157",
    shortName: "BPC-157",
    h1: "BPC-157 Therapy Online",
    tagline: "Gut health & soft-tissue recovery",
    description:
      "BPC-157 (Body Protective Compound) is a synthetic peptide originally derived from a protein found in stomach juice. Many members add it during active GLP-1 treatment to support digestive comfort and soft-tissue recovery.",
    keywords: [
      "BPC-157 online",
      "BPC-157 prescribed",
      "BPC-157 telehealth",
      "body protective compound",
      "BPC-157 recovery",
      "BPC-157 gut health",
    ],
    price: 129,
    dosingSchedule: "Daily subcutaneous injection in 4–6 week protocols.",
    administration: "Self-administered at home with starter kit.",
    commonUse:
      "Commonly layered into the month-1 GLP-1 stack to support digestive comfort. Also used post-injury for soft-tissue recovery under provider supervision.",
    stackPairing: "Popular combined with GLP-1 treatment and Thymosin Beta-4 for recovery protocols.",
    benefits: [
      "Supports gut and digestive comfort (frequently reported benefit on GLP-1)",
      "May support soft-tissue recovery (tendons, ligaments)",
      "Short protocols (4–6 weeks) with provider re-evaluation",
      "Well-tolerated with a long clinical research history",
    ],
    contraindications: [
      "Active malignancy",
      "Pregnancy or breastfeeding",
      "Known allergy to the peptide",
    ],
    faqs: [
      {
        question: "Will BPC-157 help with GLP-1 nausea?",
        answer:
          "Many members report better digestive comfort on GLP-1 when BPC-157 is added during dose escalation, but individual response varies. Your provider will evaluate if it's appropriate.",
      },
      {
        question: "How long is a typical course?",
        answer:
          "4–6 weeks is a common starting course. Your provider may extend or cycle based on response and goals.",
      },
      {
        question: "Oral vs injection?",
        answer:
          "Subcutaneous injection is the most common delivery for systemic effects. Oral formulations may be used for localized gut issues — your provider selects the best route.",
      },
    ],
  },
  "glow-stack": {
    slug: "glow-stack",
    name: "Glow Stack (Glutathione + Biotin)",
    shortName: "Glow Stack",
    h1: "Glow Stack: Glutathione + Biotin",
    tagline: "Skin, hair & nail support for rapid weight-loss journeys",
    description:
      "Rapid weight loss can stress skin, hair, and nails. The Glow Stack pairs glutathione (a master antioxidant) with biotin to support beauty-markers during your program. Delivered as a weekly injection or an oral lozenge, depending on preference.",
    keywords: [
      "glutathione injection online",
      "biotin injection",
      "glow stack telehealth",
      "GLP-1 hair loss support",
      "antioxidant peptide therapy",
    ],
    price: 89,
    dosingSchedule: "Weekly subcutaneous injection OR daily oral lozenge (your choice).",
    administration: "Starter kit ships with whichever format your provider prescribes.",
    commonUse:
      "Most popular 6–12 weeks into GLP-1 treatment, when skin and hair changes from rapid weight loss begin to show.",
    stackPairing: "Pairs with any peptide or GLP-1 protocol.",
    benefits: [
      "Glutathione — supports antioxidant status",
      "Biotin — supports hair, skin, and nail keratin production",
      "Choice of weekly injection or oral lozenge",
      "Lowest-cost peptide option at $89/mo",
    ],
    contraindications: [
      "Known allergy to either component",
      "Pregnancy (discuss with provider)",
    ],
    faqs: [
      {
        question: "Injection or lozenge — which is better?",
        answer:
          "Injection offers slightly higher bioavailability; lozenge is needle-free and easier to travel with. Your provider will recommend based on your goals.",
      },
      {
        question: "Will this stop GLP-1 hair shedding?",
        answer:
          "Hair shedding during rapid weight loss is partially caused by caloric deficit and stress, not something Glow Stack can fully reverse. But it supports the underlying nutrient pathways for healthy hair regrowth.",
      },
    ],
  },
  "thymosin-beta-4": {
    slug: "thymosin-beta-4",
    name: "Thymosin Beta-4",
    shortName: "TB-4",
    h1: "Thymosin Beta-4 Therapy Online",
    tagline: "Recovery & immune support peptide",
    description:
      "Thymosin Beta-4 (TB-4) is a naturally occurring peptide involved in tissue repair and immune modulation. Popular with active members and those focused on longevity.",
    keywords: [
      "thymosin beta-4 online",
      "TB-4 peptide",
      "thymosin beta 4 prescribed",
      "TB-500 alternative",
      "recovery peptide telehealth",
    ],
    price: 179,
    dosingSchedule: "Weekly subcutaneous injection.",
    administration: "Self-administered at home with starter kit.",
    commonUse:
      "Used by members focused on recovery (post-exercise, post-injury) and broader longevity support.",
    stackPairing: "Pairs well with BPC-157 in recovery stacks.",
    benefits: [
      "Supports tissue repair and recovery",
      "May support immune function",
      "Weekly protocol — minimal time commitment",
      "Popular with athletic members",
    ],
    contraindications: [
      "Active malignancy",
      "Pregnancy or breastfeeding",
      "Recent organ transplant",
    ],
    faqs: [
      {
        question: "Is this the same as TB-500?",
        answer:
          "TB-500 is a synthetic fragment of Thymosin Beta-4 sometimes sold in research-use markets. Our compounding pharmacy provides the full TB-4 peptide prescribed by a licensed provider.",
      },
      {
        question: "How long should I run TB-4?",
        answer:
          "4–8 week courses are typical, with provider re-evaluation for extension or cycling.",
      },
    ],
  },
};

// ─── Route metadata ─────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(PEPTIDES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = PEPTIDES[slug];
  if (!p) return { title: "Peptide not found" };
  const url = `${siteConfig.url}/peptides/${slug}`;
  return {
    title: `${p.name} Online — Prescribed by Licensed Providers | Nature's Journey`,
    description: `${p.tagline}. Evaluated by a licensed provider, compounded by a licensed pharmacy, shipped to your door. From $${p.price}/mo. ${p.description.slice(0, 120)}`,
    keywords: p.keywords,
    openGraph: {
      title: `${p.name} Online — Nature's Journey`,
      description: p.tagline,
      url,
      type: "website",
    },
    alternates: { canonical: url },
  };
}

// ─── Page ───────────────────────────────────────────────────
export default async function PeptideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = PEPTIDES[slug];
  if (!p) notFound();

  return (
    <MarketingShell>
      <MedicalWebPageJsonLd
        name={`${p.name} — Nature's Journey`}
        description={`${p.tagline}. ${p.description}`}
        url={`/peptides/${p.slug}`}
        medicalAudience="Patient"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Peptides", href: "/peptides" },
          { name: p.name, href: `/peptides/${p.slug}` },
        ]}
      />
      <FAQPageJsonLd faqs={p.faqs} />
      <ProductJsonLd
        name={p.name}
        description={p.description}
        price={p.price}
        url={`/peptides/${p.slug}`}
      />
      <ViewContentTracker
        contentName={`Peptide: ${p.name}`}
        contentCategory="peptides"
        contentIds={[p.slug]}
        value={p.price}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy via-atlantic to-navy text-white py-14 sm:py-20">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <SectionShell className="relative max-w-3xl text-center">
          <Link
            href="/peptides"
            className="text-xs font-semibold text-gold hover:underline"
          >
            &larr; All peptides
          </Link>
          {p.badge && (
            <Badge variant="gold" className="ml-3 bg-gold/20 text-gold border-gold/30">
              {p.badge}
            </Badge>
          )}

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{p.h1}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">{p.tagline}</p>

          <div className="mt-6 inline-flex items-baseline gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
            <span className="text-xs text-white/70">From</span>
            <span className="text-2xl font-bold">${p.price}</span>
            <span className="text-sm text-white/70">/mo</span>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={`/qualify?interest=peptides&peptide=${p.slug}`}>
              <Button variant="emerald" size="xl" className="gap-2 rounded-full px-10">
                See If I Qualify
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/dashboard/shop?product=${p.slug}`}>
              <Button
                size="xl"
                variant="outline"
                className="gap-2 rounded-full border-white/30 text-white bg-white/5 hover:bg-white/10"
              >
                Members: add to plan
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Trust bar */}
      <section className="border-y border-navy-100/40 bg-linen py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-graphite-500">
          <span className="flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-teal" /> Licensed US providers
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal" /> Compounding pharmacy
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-teal" /> Free 2-day shipping
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-teal" /> Provider review in 1 business day
          </span>
        </div>
      </section>

      {/* Overview + dosing grid */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-navy">About {p.shortName}</h2>
              <p className="mt-3 text-sm text-graphite-600 leading-relaxed">{p.description}</p>

              <h3 className="mt-8 text-lg font-bold text-navy">Benefits</h3>
              <ul className="mt-3 space-y-2">
                {p.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-graphite-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 text-lg font-bold text-navy">Who it's usually for</h3>
              <p className="mt-2 text-sm text-graphite-600 leading-relaxed">{p.commonUse}</p>

              <h3 className="mt-8 text-lg font-bold text-navy">Stacking & pairing</h3>
              <p className="mt-2 text-sm text-graphite-600 leading-relaxed">{p.stackPairing}</p>

              <h3 className="mt-8 text-lg font-bold text-navy">Contraindications</h3>
              <ul className="mt-3 space-y-1.5">
                {p.contraindications.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-graphite-600">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-graphite-400">
                Your provider screens for all contraindications at evaluation. Never self-prescribe.
              </p>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-navy-100/60 bg-sage/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-teal">Dosing at a glance</p>
                <p className="mt-3 text-sm text-navy leading-relaxed">
                  <strong className="block">Schedule</strong>
                  {p.dosingSchedule}
                </p>
                <p className="mt-3 text-sm text-navy leading-relaxed">
                  <strong className="block">Administration</strong>
                  {p.administration}
                </p>
                <p className="mt-4 text-[11px] text-graphite-400">
                  Final protocol set by your licensed provider based on your profile.
                </p>
              </div>

              <div className="rounded-2xl border border-gold-200 bg-gradient-to-br from-gold-50 to-white p-5 text-center">
                <Sparkles className="mx-auto h-5 w-5 text-gold" />
                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-gold-700">
                  Price
                </p>
                <p className="mt-1 text-3xl font-bold text-navy">
                  ${p.price}
                  <span className="text-sm font-normal text-graphite-400">/mo</span>
                </p>
                <Link href={`/qualify?interest=peptides&peptide=${p.slug}`}>
                  <Button variant="emerald" size="lg" className="mt-4 w-full gap-2 rounded-full">
                    Start free assessment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="mt-3 text-[10px] text-graphite-400">
                  No payment info required for the assessment.
                </p>
              </div>
            </aside>
          </div>
        </SectionShell>
      </section>

      {/* FAQs */}
      <section className="py-14 bg-cloud">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy text-center">{p.shortName} FAQs</h2>
          <div className="mt-6 space-y-3">
            {p.faqs.map((f) => (
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

      {/* Related peptides */}
      <section className="py-12 bg-white">
        <SectionShell className="max-w-4xl">
          <h2 className="text-lg font-bold text-navy text-center mb-6">Related peptides</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.values(PEPTIDES)
              .filter((other) => other.slug !== p.slug)
              .slice(0, 3)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/peptides/${other.slug}`}
                  className="group rounded-xl border border-navy-100/60 bg-white p-4 transition-all hover:shadow-md hover:border-teal"
                >
                  <p className="text-sm font-bold text-navy group-hover:text-teal">{other.name}</p>
                  <p className="mt-1 text-xs text-graphite-500 line-clamp-2">{other.tagline}</p>
                  <p className="mt-2 text-xs font-semibold text-navy">From ${other.price}/mo</p>
                </Link>
              ))}
          </div>
        </SectionShell>
      </section>

      {/* Final CTA */}
      <section className="py-14 bg-gradient-to-br from-navy to-atlantic text-white text-center">
        <SectionShell className="max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to see if {p.shortName} is right for you?
          </h2>
          <p className="mt-3 text-white/80">
            Take the free 2-minute assessment — a licensed provider reviews and prescribes if appropriate.
          </p>
          <div className="mt-6">
            <Link href={`/qualify?interest=peptides&peptide=${p.slug}`}>
              <Button variant="gold" size="xl" className="gap-2 rounded-full px-10">
                Start My Free Assessment
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
