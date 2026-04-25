/**
 * /sourcing — 503A vs 503B pharmacy transparency page
 * ─────────────────────────────────────────────────────────────
 * Tier 12.4 — A trust-building page that explains EXACTLY where
 * compounded medications come from, the difference between 503A
 * and 503B compounding pharmacies, and how Nature's Journey's
 * pharmacy network meets each regulation.
 *
 * Conversion role: most "is this safe?" / "where does this come
 * from?" anxiety in compounded GLP-1 dies right here. Trust + SEO.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Award,
  FileText,
  Clipboard,
  AlertCircle,
  Check,
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
  title: "Where Our Compounded GLP-1 Comes From — 503A & 503B Pharmacy Network",
  description:
    "Full transparency on Nature's Journey's compounding pharmacy network. 503A vs 503B explained, FDA inspection records, sterility testing standards, and how we verify every batch.",
  keywords: [
    "503A 503B compounding pharmacy",
    "compounded semaglutide pharmacy",
    "where does compounded GLP-1 come from",
    "is compounded semaglutide safe",
    "FDA 503A 503B difference",
    "compounding pharmacy regulation",
    "Nature's Journey pharmacy",
  ],
  openGraph: {
    title: "Where Our Compounded GLP-1 Comes From",
    description:
      "How 503A and 503B compounding pharmacies are regulated, and how Nature's Journey verifies every batch.",
    type: "website",
  },
  alternates: { canonical: `${siteConfig.url}/sourcing` },
};

const faqs = [
  {
    question: "What's the difference between a 503A and a 503B pharmacy?",
    answer:
      "503A pharmacies compound medications for individual patients on receipt of a specific prescription, regulated primarily by state boards of pharmacy. 503B 'outsourcing facilities' compound in larger volumes under direct FDA oversight (cGMP standards), don't require a per-patient prescription, and undergo regular FDA inspection. Both are legal, regulated paths. 503B has the higher manufacturing-grade compliance bar.",
  },
  {
    question: "Which type does Nature's Journey use?",
    answer:
      "Both, depending on the medication and your provider's prescription. Most of our compounded semaglutide and tirzepatide is dispensed from 503B outsourcing facilities (FDA-registered, cGMP-compliant). For specialty peptides and personalized formulations, we use 503A pharmacies licensed in your state. Every dispensing pharmacy is named on your prescription label.",
  },
  {
    question: "Are these pharmacies inspected by the FDA?",
    answer:
      "Yes. 503B outsourcing facilities are subject to scheduled FDA cGMP inspections — typically every 1–2 years. 503A pharmacies are inspected by state boards of pharmacy and must comply with USP 797 (sterile compounding) and USP 800 (hazardous drug handling) standards. Inspection reports for 503Bs are publicly searchable on FDA's website by facility name.",
  },
  {
    question: "How do you verify every batch?",
    answer:
      "Every compounded batch our network dispenses includes a Certificate of Analysis (CoA) confirming sterility, endotoxin levels, and active-ingredient potency. CoAs are reviewed by the dispensing pharmacist before release. If a batch fails any spec, it doesn't ship — period.",
  },
  {
    question: "Is compounded semaglutide the same molecule as Wegovy or Ozempic?",
    answer:
      "Yes. The active ingredient — semaglutide — is the same compound. The clinical research that established semaglutide's efficacy applies to the molecule. The differences are formulation (vehicle, dose flexibility), packaging (vial vs. pre-filled pen), regulatory pathway (compounded vs. FDA-approved), and price. Compounded semaglutide is not FDA-approved, but it is legal and dispensed under prescription.",
  },
  {
    question: "What if there's a problem with my medication?",
    answer:
      "Stop using it immediately and contact our care team via secure messaging. We'll route the issue to the dispensing pharmacy, file an FDA MedWatch report if appropriate, and replace the medication at no charge. Adverse events are also reported to the prescribing telehealth network for pharmacovigilance tracking.",
  },
];

export default function SourcingPage() {
  return (
    <MarketingShell>
      <MedicalWebPageJsonLd
        name="Where Our Compounded GLP-1 Comes From — Nature's Journey"
        description="503A vs 503B compounding pharmacy explanation, FDA inspection records, sterility testing standards, and batch verification process for Nature's Journey's compounded GLP-1 network."
        url="/sourcing"
        medicalAudience="Patient"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Pharmacy sourcing", href: "/sourcing" },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />
      <ViewContentTracker
        contentName="Pharmacy Sourcing"
        contentCategory="trust"
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-14 sm:py-20">
        <SectionShell className="max-w-3xl text-center">
          <Badge variant="default" className="mb-4 gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            Pharmacy transparency
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Exactly where your medication
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              comes from.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            We dispense compounded GLP-1 medications from a curated network of
            FDA-registered 503B outsourcing facilities and state-licensed 503A
            compounding pharmacies. Here&apos;s how each one is regulated,
            inspected, and verified — before anything ships to you.
          </p>
        </SectionShell>
      </section>

      {/* 503A vs 503B compare */}
      <section className="py-14 bg-white">
        <SectionShell className="max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-navy">
            503A vs 503B at a glance
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium-sm">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-5 w-5 text-teal" />
                <h3 className="text-lg font-bold text-navy">503A pharmacies</h3>
              </div>
              <p className="text-sm text-graphite-500 leading-relaxed">
                Traditional compounding pharmacies. Prepare medications for individual
                patients on receipt of a specific prescription.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-graphite-600">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Regulated by state boards of pharmacy
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Must comply with USP 797 / USP 800 standards
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Best for personalized formulations + specialty peptides
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-teal bg-gradient-to-br from-teal-50/40 to-white p-6 shadow-premium">
              <Badge variant="success" className="mb-3">
                Most of our GLP-1 dispenses here
              </Badge>
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-teal" />
                <h3 className="text-lg font-bold text-navy">
                  503B outsourcing facilities
                </h3>
              </div>
              <p className="text-sm text-graphite-500 leading-relaxed">
                FDA-registered facilities that compound in larger volumes under
                manufacturing-grade quality controls.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-graphite-600">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Direct FDA registration + scheduled inspection
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Must follow current Good Manufacturing Practices (cGMP)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Per-batch Certificate of Analysis (sterility + potency)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
                  Highest compliance bar in compounding pharmacy
                </li>
              </ul>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Verification chain */}
      <section className="py-14 bg-cloud">
        <SectionShell className="max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-navy">
            Every batch passes 4 checks before it ships
          </h2>
          <div className="mt-8 space-y-3">
            {[
              {
                step: "1",
                Icon: FileText,
                title: "Provider prescription verified",
                desc: "Your prescription is reviewed and digitally signed by your licensed provider before any pharmacy sees it.",
              },
              {
                step: "2",
                Icon: Building2,
                title: "Pharmacy verified for your state",
                desc: "We only dispense from pharmacies licensed to ship into your state. The dispensing pharmacy name appears on your prescription label.",
              },
              {
                step: "3",
                Icon: Clipboard,
                title: "Certificate of Analysis on file",
                desc: "Every compounded batch ships with a CoA confirming sterility (USP 71), endotoxin levels (USP 85), and active-ingredient potency. We retain copies for 7 years.",
              },
              {
                step: "4",
                Icon: ShieldCheck,
                title: "Cold-chain shipping verified",
                desc: "Temperature-controlled packaging with a tracking thermometer when required. We replace any package that arrives out of spec — no questions asked.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex items-start gap-4 rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal text-white font-bold text-sm">
                  {s.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <s.Icon className="h-4 w-4 text-teal" />
                    <p className="text-sm font-bold text-navy">{s.title}</p>
                  </div>
                  <p className="mt-1 text-sm text-graphite-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Honest caveat */}
      <section className="py-12 bg-white">
        <SectionShell className="max-w-3xl">
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/40 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-navy">
                  Compounded medications are not FDA-approved drug products.
                </p>
                <p className="mt-2 text-sm text-graphite-600 leading-relaxed">
                  This is the most important fact to understand. Compounded GLP-1
                  medications contain the same active ingredient as FDA-approved
                  brands like Wegovy and Zepbound — but the compounded preparation
                  itself is not FDA-approved. It is, however, legal,
                  prescription-only, and dispensed under federal compounding
                  regulations (FDCA 503A / 503B). We display this disclaimer on
                  every page and at every step of treatment.
                </p>
              </div>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-cloud">
        <SectionShell className="max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-navy">
            Sourcing FAQs
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
            Ready to start with full transparency?
          </h2>
          <p className="mt-3 text-white/80">
            See if you qualify in 2 minutes. The dispensing pharmacy and CoA are
            visible on every prescription label.
          </p>
          <div className="mt-6">
            <Link href="/qualify">
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
        </div>
      </section>
    </MarketingShell>
  );
}
