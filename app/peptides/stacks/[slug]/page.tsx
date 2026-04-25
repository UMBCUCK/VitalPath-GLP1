/**
 * /peptides/stacks/[slug] — dedicated SEO page per peptide stack
 * ─────────────────────────────────────────────────────────────
 * Tier 8.2 — A 2-peptide stack is a different keyword world than the
 * individual peptides (e.g. "ipamorelin cjc stack", "peptide stack for
 * recovery", "GLP-1 peptide stack"). This route gives each of the 3
 * curated stacks from /peptides its own rankable page with:
 *
 *   - Why the pair works together (clinical rationale)
 *   - Dosing schedule combined
 *   - Monthly cost + savings vs buying individually
 *   - Who it's typically prescribed for
 *   - 4–6 stack-specific FAQs with rich-results schema
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
  TrendingUp,
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

interface StackDetail {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  idealFor: string;
  peptides: Array<{
    slug: string;
    name: string;
    role: string;
    priceCents: number;
  }>;
  bundlePriceCents: number;
  originalPriceCents: number;
  rationale: string[];
  protocol: Array<{ day: string; action: string }>;
  expectedBenefits: string[];
  cautions: string[];
  faqs: { question: string; answer: string }[];
  accent: "teal" | "gold" | "rose";
}

const STACKS: Record<string, StackDetail> = {
  recovery: {
    slug: "recovery",
    name: "The Recovery Stack",
    shortName: "Recovery Stack",
    tagline: "BPC-157 + Thymosin Beta-4 — the most-prescribed add-on during active GLP-1 treatment",
    idealFor:
      "Active adults on month 1–3 of GLP-1 therapy focused on digestive comfort, soft-tissue recovery, and overall resilience during rapid weight loss.",
    peptides: [
      {
        slug: "bpc-157",
        name: "BPC-157",
        role: "Gut healing & soft-tissue repair",
        priceCents: 12900,
      },
      {
        slug: "thymosin-beta-4",
        name: "Thymosin Beta-4",
        role: "Recovery & immune support",
        priceCents: 17900,
      },
    ],
    bundlePriceCents: 28900,
    originalPriceCents: 30800,
    accent: "teal",
    rationale: [
      "BPC-157 and TB-4 work on overlapping but distinct repair pathways — BPC-157 focuses on the gastric and connective tissue; TB-4 on cellular migration and immune modulation.",
      "Both are commonly paired in sports-medicine protocols for post-injury recovery. Emerging clinical interest during GLP-1 treatment comes from digestive-comfort benefits (BPC-157) and preservation of healing capacity during caloric deficit (TB-4).",
      "Running them together — rather than sequentially — accelerates the observed benefit window in most members' first 4-week cycle.",
    ],
    protocol: [
      { day: "Week 1–4", action: "Daily BPC-157 subQ + weekly TB-4 subQ. Your provider sets doses based on weight and goals." },
      { day: "Week 5–8", action: "BPC-157 cycles down to 4×/week. TB-4 continues weekly." },
      { day: "Week 9", action: "Provider check-in. Cycle off or extend based on response." },
    ],
    expectedBenefits: [
      "Reduced digestive discomfort during GLP-1 dose escalation",
      "Faster soft-tissue recovery between training sessions",
      "Perceived better immune resilience",
      "Members commonly report the stack feels additive, not duplicative",
    ],
    cautions: [
      "Active malignancy",
      "Pregnancy or breastfeeding",
      "Recent organ transplant or immunosuppressant therapy",
      "Known allergy to either peptide",
    ],
    faqs: [
      {
        question: "Why start the Recovery Stack during GLP-1 treatment specifically?",
        answer:
          "GLP-1 therapy causes rapid weight loss, which can stress soft tissue and the gut microbiome. BPC-157 supports gut comfort and connective tissue, while TB-4 supports general repair. Members starting them together often report smoother dose-titration weeks.",
      },
      {
        question: "Can I just pick one instead of the stack?",
        answer:
          "Yes — either peptide works individually. The stack is priced lower than buying both separately and is our most-prescribed combination. Your provider will confirm the right approach based on your goals.",
      },
      {
        question: "How long is a typical cycle?",
        answer:
          "4–8 weeks for an initial course. Your provider reassesses at the halfway point and can extend, cycle off, or pair with another protocol depending on response.",
      },
      {
        question: "Are these peptides injected?",
        answer:
          "Yes — both are standard subcutaneous injections using a fine 30G insulin syringe. A starter kit with syringes, alcohol swabs, and a plain-English dosing chart ships with your first order.",
      },
    ],
  },
  longevity: {
    slug: "longevity",
    name: "The Longevity Stack",
    shortName: "Longevity Stack",
    tagline: "NAD+ + Sermorelin — the foundational stack for adults 40+ focused on aging well",
    idealFor:
      "Adults 40+ who are stabilized on their GLP-1 protocol and want to layer in cellular-energy (NAD+) and overnight-recovery (Sermorelin) support. Popular with members focused on sleep quality and mental clarity.",
    peptides: [
      {
        slug: "nad-plus",
        name: "NAD+ Injection",
        role: "Cellular energy & mental clarity",
        priceCents: 14900,
      },
      {
        slug: "sermorelin",
        name: "Sermorelin",
        role: "Sleep quality & overnight recovery",
        priceCents: 19900,
      },
    ],
    bundlePriceCents: 32900,
    originalPriceCents: 34800,
    accent: "gold",
    rationale: [
      "NAD+ and Sermorelin address two different levers of age-related decline: cellular energetics (NAD+ supports mitochondrial function) and growth hormone rhythm (Sermorelin supports the natural overnight GH pulse).",
      "Running them together creates a 'daytime energy + overnight recovery' cadence that most members report feeling within 4–6 weeks.",
      "The pair is the most-prescribed longevity-oriented stack in telehealth peptide practice for patients in the 35–60 age bracket.",
    ],
    protocol: [
      { day: "Weekly", action: "1× NAD+ subQ injection (any day, timing flexible)." },
      { day: "Nightly", action: "Sermorelin subQ injection 30–60 min before bed on an empty stomach, 5 nights/week." },
      { day: "Every 3 months", action: "Provider review — Sermorelin cycles are usually 3–6 months on, then reassess." },
    ],
    expectedBenefits: [
      "Improved sleep quality within 2–6 weeks (most commonly reported)",
      "Better perceived mental clarity and sustained daytime energy",
      "Supports lean-mass retention during GLP-1 weight loss",
      "Strong compliance — only 1 weekly + 5 nightly self-injections",
    ],
    cautions: [
      "Active malignancy",
      "Pregnancy or breastfeeding",
      "Severe thyroid dysfunction",
      "Known niacin/B3 sensitivity (NAD+ derivative)",
    ],
    faqs: [
      {
        question: "Which benefit shows up first?",
        answer:
          "Sleep quality from Sermorelin is typically the fastest-noticed change (often within 2–3 weeks). NAD+ benefits on energy and focus usually emerge by week 4–6 of consistent dosing.",
      },
      {
        question: "Do I have to cycle both peptides together?",
        answer:
          "Not necessarily. Many members cycle Sermorelin in 3–6-month blocks while keeping NAD+ running year-round at a lower frequency. Your provider designs a schedule that matches your goals.",
      },
      {
        question: "Is this the same as HGH replacement?",
        answer:
          "No. Sermorelin signals your pituitary to release its own GH in natural pulses rather than replacing it with synthetic HGH. Most clinicians prefer the peptide approach because it preserves physiologic rhythm.",
      },
      {
        question: "Can younger adults (under 35) use the Longevity Stack?",
        answer:
          "Yes, but we typically recommend the Recovery Stack for younger, active members. NAD+ alone (not Sermorelin) is often the better entry point for adults under 35.",
      },
    ],
  },
  glow: {
    slug: "glow",
    name: "The Glow Stack+",
    shortName: "Glow Stack+",
    tagline: "Glow Stack + BPC-157 — skin, hair, and digestive support for rapid weight-loss journeys",
    idealFor:
      "Members 6–12 weeks into rapid weight loss who want to support skin quality, hair thickness, nail strength, and gut comfort simultaneously. Especially popular on higher-dose GLP-1 protocols.",
    peptides: [
      {
        slug: "glow-stack",
        name: "Glow Stack (Glutathione + Biotin)",
        role: "Skin, hair & nail support",
        priceCents: 8900,
      },
      {
        slug: "bpc-157",
        name: "BPC-157",
        role: "Gut healing & digestive comfort",
        priceCents: 12900,
      },
    ],
    bundlePriceCents: 20900,
    originalPriceCents: 21800,
    accent: "rose",
    rationale: [
      "Rapid weight loss taxes both collagen/keratin production (visible as skin, hair, nail changes) and gut function (nausea, irregularity on GLP-1). The Glow Stack+ targets both simultaneously.",
      "Glutathione supports antioxidant status during metabolic stress; biotin supports the keratin/collagen pathways responsible for healthy skin/hair/nails; BPC-157 supports gut mucosa and digestive comfort.",
      "Running the three components together creates compounded visible + felt improvements that individual SKUs cannot match in the same timeframe.",
    ],
    protocol: [
      { day: "Weekly", action: "1× Glow Stack subQ injection OR daily oral lozenge (your choice)." },
      { day: "Daily", action: "1× BPC-157 subQ injection for 4–6 weeks, then re-evaluate." },
      { day: "Month 2", action: "Provider re-check — most members continue Glow Stack and cycle BPC-157 off." },
    ],
    expectedBenefits: [
      "Improved skin quality (reduced sagging perception on rapid loss)",
      "Thicker hair and stronger nails over 8–12 weeks",
      "Reduced digestive discomfort (bloating, nausea) common on GLP-1",
      "Lowest-cost peptide entry — $209/mo for the pair",
    ],
    cautions: [
      "Known allergy to biotin, glutathione, or BPC-157",
      "Pregnancy — discuss with provider",
      "Active malignancy",
    ],
    faqs: [
      {
        question: "Will the Glow Stack stop GLP-1 hair shedding?",
        answer:
          "Hair shedding during rapid weight loss is partly caused by telogen effluvium (a stress-induced shedding cycle). The Glow Stack supports the nutrient pathways for healthy regrowth but doesn't fully reverse shedding already in progress. Starting early in treatment gets the best outcome.",
      },
      {
        question: "Oral lozenge vs injection — which is better?",
        answer:
          "Injection offers slightly higher bioavailability; lozenge is needle-free and easier to travel with. Most members who already inject a GLP-1 prefer the injection; members new to injections often start with the lozenge.",
      },
      {
        question: "Can I add the Glow Stack+ to any GLP-1 protocol?",
        answer:
          "Yes. The Glow Stack doesn't interact meaningfully with GLP-1 mechanism of action. Your provider confirms the combination is appropriate based on your individual profile.",
      },
      {
        question: "What if I only want the skin/hair support without BPC-157?",
        answer:
          "You can start with just the Glow Stack at $89/mo. The BPC-157 add-on brings it to $209/mo but adds the gut-comfort benefit, which is why most 6–12-week GLP-1 members opt for the full stack.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(STACKS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = STACKS[slug];
  if (!s) return { title: "Peptide stack not found" };
  const url = `${siteConfig.url}/peptides/stacks/${slug}`;
  return {
    title: `${s.name} — ${s.tagline.split(" — ")[0]} | Nature's Journey`,
    description: `${s.tagline}. ${s.idealFor.slice(0, 120)}`,
    keywords: [
      `${s.shortName.toLowerCase()} peptide`,
      `${s.shortName.toLowerCase()} stack online`,
      ...s.peptides.map((p) => p.name.toLowerCase()),
      "peptide stack online",
      "GLP-1 peptide stack",
    ],
    openGraph: {
      title: `${s.name} — Nature's Journey`,
      description: s.tagline,
      url,
      type: "website",
    },
    alternates: { canonical: url },
  };
}

export default async function PeptideStackDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = STACKS[slug];
  if (!s) notFound();

  const savings = s.originalPriceCents - s.bundlePriceCents;
  const savingsPct = Math.round((savings / s.originalPriceCents) * 100);

  const accentBg = {
    teal: "from-teal to-atlantic",
    gold: "from-gold to-amber-600",
    rose: "from-rose-400 to-rose-600",
  }[s.accent];

  return (
    <MarketingShell>
      <MedicalWebPageJsonLd
        name={`${s.name} — Nature's Journey`}
        description={`${s.tagline}. ${s.idealFor}`}
        url={`/peptides/stacks/${s.slug}`}
        medicalAudience="Patient"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Peptides", href: "/peptides" },
          { name: s.name, href: `/peptides/stacks/${s.slug}` },
        ]}
      />
      <FAQPageJsonLd faqs={s.faqs} />
      <ViewContentTracker
        contentName={`Peptide Stack: ${s.name}`}
        contentCategory="peptide-stacks"
        contentIds={[s.slug]}
        value={s.bundlePriceCents / 100}
      />

      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${accentBg} text-white py-14 sm:py-20`}>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-2xl" />

        <SectionShell className="relative max-w-3xl text-center">
          <Link
            href="/peptides"
            className="text-xs font-semibold text-white/80 hover:underline"
          >
            &larr; All peptides
          </Link>
          <Badge
            variant="gold"
            className="ml-3 bg-white/20 text-white border-white/30 backdrop-blur"
          >
            Curated stack · {savingsPct}% savings
          </Badge>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{s.name}</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/80">{s.tagline}</p>

          <div className="mt-6 inline-flex items-baseline gap-2 rounded-full bg-white/10 px-5 py-3 backdrop-blur">
            <span className="text-sm text-white/70 line-through">
              ${(s.originalPriceCents / 100).toFixed(0)}
            </span>
            <span className="text-3xl font-bold">
              ${(s.bundlePriceCents / 100).toFixed(0)}
            </span>
            <span className="text-sm text-white/70">/mo bundled</span>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={`/qualify?interest=peptides&stack=${s.slug}`}>
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
                Members: add to plan
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/70">
            Stack pricing is indicative. Actual prescription + pricing confirmed at provider evaluation.
          </p>
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

      {/* What's in the stack */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-4xl">
          <h2 className="text-2xl font-bold text-navy text-center">What's in this stack</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {s.peptides.map((p) => (
              <Link
                key={p.slug}
                href={`/peptides/${p.slug}`}
                className="group rounded-2xl border border-navy-100/60 bg-white p-5 transition-all hover:shadow-premium-lg hover:border-teal"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal">
                      {p.role}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-navy group-hover:text-teal">
                      {p.name}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy">
                    Individually ${(p.priceCents / 100).toFixed(0)}/mo
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-navy-100/40 pt-3">
                  <span className="text-xs text-graphite-500">Read protocol details</span>
                  <ArrowRight className="h-4 w-4 text-graphite-400 group-hover:text-teal transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/40 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal">Bundle savings</p>
            <p className="mt-2 text-2xl font-bold text-navy">
              ${(s.bundlePriceCents / 100).toFixed(0)}/mo bundled · save ${(savings / 100).toFixed(0)}/mo vs individual
            </p>
            <p className="mt-1 text-xs text-graphite-500">
              One invoice. One pharmacy. One provider managing the combined protocol.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* Why the pair works */}
      <section className="py-14 bg-cloud">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy text-center">
            Why these two peptides work together
          </h2>
          <div className="mt-6 space-y-3">
            {s.rationale.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-navy-100/40 bg-white p-4 shadow-premium-sm"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <p className="text-sm leading-relaxed text-graphite-600">{r}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Protocol */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-3xl">
          <div className="text-center mb-8">
            <Badge variant="default" className="mb-3">Typical protocol</Badge>
            <h2 className="text-2xl font-bold text-navy">Schedule at a glance</h2>
            <p className="mt-2 text-sm text-graphite-500">
              Final protocol is set by your licensed provider based on your profile.
            </p>
          </div>
          <div className="space-y-3">
            {s.protocol.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-navy-100/60 bg-cloud/40 p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal text-white font-bold text-xs">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">{step.day}</p>
                  <p className="mt-0.5 text-sm text-graphite-500 leading-relaxed">{step.action}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Benefits + cautions grid */}
      <section className="py-14 bg-cloud">
        <SectionShell className="max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-teal-100 bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-teal" />
                <h3 className="text-lg font-bold text-navy">What to expect</h3>
              </div>
              <ul className="space-y-2">
                {s.expectedBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-graphite-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-red-100 bg-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-red-500" />
                <h3 className="text-lg font-bold text-navy">Contraindications</h3>
              </div>
              <ul className="space-y-2">
                {s.cautions.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-graphite-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-graphite-400">
                Your provider screens for all contraindications during evaluation.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Ideal for */}
      <section className="py-12 bg-white">
        <SectionShell className="max-w-3xl text-center">
          <Sparkles className="mx-auto h-6 w-6 text-gold" />
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-gold-700">
            Typically prescribed for
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-base text-graphite-600 leading-relaxed">
            {s.idealFor}
          </p>
        </SectionShell>
      </section>

      {/* FAQs */}
      <section className="py-14 bg-cloud">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy text-center">Common questions</h2>
          <div className="mt-6 space-y-3">
            {s.faqs.map((f) => (
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
      <section className={`py-14 bg-gradient-to-br ${accentBg} text-white text-center`}>
        <SectionShell className="max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to layer in {s.shortName}?</h2>
          <p className="mt-3 text-white/80">
            Take the free assessment — a licensed provider reviews and prescribes if appropriate.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={`/qualify?interest=peptides&stack=${s.slug}`}>
              <Button variant="gold" size="xl" className="gap-2 rounded-full px-10">
                Start My Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/peptides">
              <Button
                size="xl"
                variant="outline"
                className="gap-2 rounded-full border-white/30 text-white bg-white/5 hover:bg-white/10"
              >
                See other stacks
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
            Compounded peptides are not FDA-approved drug products. Prepared by a state-licensed
            compounding pharmacy under individual prescription. Eligibility, protocol, and dosing
            determined by a licensed provider. Individual results vary.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}
