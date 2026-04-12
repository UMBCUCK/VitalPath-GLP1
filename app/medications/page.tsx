export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Pill, Check, Shield, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { WebPageJsonLd, MedicalWebPageJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { medications } from "@/lib/medications";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "GLP-1 Medications for Weight Loss — Semaglutide & Tirzepatide Guide",
  description:
    "Compare GLP-1 weight loss medications: semaglutide (Ozempic, Wegovy) vs tirzepatide (Mounjaro, Zepbound). How they work, clinical results, cost comparison, side effects, and how to get prescribed online.",
  openGraph: {
    title: "GLP-1 Weight Loss Medications Guide | Nature's Journey",
    description: "Everything about semaglutide and tirzepatide for weight loss. Compare results, cost, side effects, and get prescribed online from $279/mo.",
  },
};

export default function MedicationsPage() {
  return (
    <MarketingShell>
      <WebPageJsonLd
        title="GLP-1 Medications for Weight Loss"
        description="Complete guide to GLP-1 weight loss medications including semaglutide and tirzepatide."
        path="/medications"
      />
      <MedicalWebPageJsonLd
        name="GLP-1 Medications for Weight Loss — Complete Guide"
        description="Provider-reviewed guide comparing semaglutide and tirzepatide for weight management. Clinical data, side effects, dosing, and how to get prescribed online."
        url="/medications"
        medicalAudience="Patient"
      />
      <FAQPageJsonLd faqs={[
        { question: "What GLP-1 medications are available for weight loss?", answer: "The two primary GLP-1 medications used for weight loss are semaglutide (brand names Ozempic, Wegovy) and tirzepatide (brand names Mounjaro, Zepbound). Compounded versions of both are also available through licensed pharmacies at lower cost." },
        { question: "What is the difference between semaglutide and tirzepatide?", answer: "Semaglutide is a GLP-1 receptor agonist that reduces appetite. Tirzepatide is a dual GIP/GLP-1 receptor agonist, targeting two pathways simultaneously. Clinical trials show tirzepatide produces slightly greater average weight loss (20-22% vs 15-17%)." },
        { question: "Do I need a prescription for GLP-1 weight loss medication?", answer: "Yes, GLP-1 medications require a prescription from a licensed medical provider. Our telehealth platform connects you with a provider who can evaluate your eligibility, prescribe if appropriate, and oversee your treatment plan." },
        { question: "What are the most common side effects of GLP-1 medications?", answer: "The most common side effects are nausea, vomiting, diarrhea, and constipation — particularly in the first few weeks as your dose increases. Most patients experience reduced side effects as their body adjusts to the medication." },
      ]} />
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "GLP-1 Medications", href: "/medications" }]} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <Pill className="h-3.5 w-3.5" /> Medication Guide
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            GLP-1 medications for{" "}
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              weight loss
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Two proven medications, one goal: sustainable weight management. Learn how they work,
            compare results and cost, and find out if you qualify.
          </p>
        </SectionShell>
      </section>

      {/* Medication cards */}
      <section className="py-16">
        <SectionShell>
          <div className="grid gap-6 lg:grid-cols-2">
            {medications.map((med) => (
              <Link
                key={med.slug}
                href={`/medications/${med.slug}`}
                className="group rounded-2xl border border-navy-100/60 bg-white p-8 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                    <Pill className="h-6 w-6 text-teal" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-navy group-hover:text-teal transition-colors">
                      {med.genericName}
                    </h2>
                    <p className="text-sm text-graphite-400">{med.brandName}</p>
                  </div>
                </div>

                <p className="text-sm text-graphite-500 leading-relaxed mb-6">{med.mechanism}</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-xl bg-navy-50/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-graphite-400 mb-1">
                      <TrendingDown className="h-3 w-3" /> Avg Weight Loss
                    </div>
                    <p className="text-sm font-bold text-navy">{med.weightLoss.split('.')[0]}</p>
                  </div>
                  <div className="rounded-xl bg-navy-50/30 p-3">
                    <div className="flex items-center gap-1.5 text-xs text-graphite-400 mb-1">
                      <DollarSign className="h-3 w-3" /> Nature's Journey Price
                    </div>
                    <p className="text-sm font-bold text-teal">{med.vitalpathCost}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {med.keyFacts.slice(0, 3).map((fact) => (
                    <li key={fact} className="flex items-start gap-2 text-xs text-graphite-500">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" /> {fact}
                    </li>
                  ))}
                </ul>

                <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal">
                  Read full guide <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Quick comparison */}
      <section className="bg-premium-gradient py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Side by Side"
            title="Semaglutide vs Tirzepatide at a glance"
          />
          <div className="overflow-x-auto rounded-2xl border border-navy-100/60 bg-white shadow-premium">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40">
                  <th className="px-6 py-4 text-left font-semibold text-navy">Factor</th>
                  <th className="px-6 py-4 text-center font-semibold text-navy">Semaglutide</th>
                  <th className="px-6 py-4 text-center font-semibold text-navy">Tirzepatide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {[
                  ["Mechanism", "GLP-1 agonist", "Dual GLP-1/GIP agonist"],
                  ["Brand names", "Ozempic, Wegovy", "Mounjaro, Zepbound"],
                  ["Avg weight loss", "15-16%", "20-22%"],
                  ["Dosing", "Weekly injection", "Weekly injection"],
                  ["Retail cost", "$935-$1,349+/mo", "$1,023-$1,200+/mo"],
                  ["Nature's Journey cost", "From $279/mo", "From $279/mo"],
                  ["Nausea rate", "44%", "31%"],
                  ["Clinical trials", "STEP (Novo Nordisk)", "SURMOUNT (Eli Lilly)"],
                ].map(([factor, sem, tir]) => (
                  <tr key={factor} className="hover:bg-navy-50/20 transition-colors">
                    <td className="px-6 py-3 font-medium text-navy">{factor}</td>
                    <td className="px-6 py-3 text-center text-graphite-600">{sem}</td>
                    <td className="px-6 py-3 text-center text-graphite-600">{tir}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <Link href="/blog/semaglutide-vs-tirzepatide" className="text-sm font-medium text-teal hover:underline">
              Read the full comparison &rarr;
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Compounded explanation */}
      <section className="py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">What about compounded GLP-1 medications?</h2>
          <p className="mt-4 text-sm leading-relaxed text-graphite-600">
            Compounded versions of semaglutide and tirzepatide contain the same active ingredients but
            are prepared by state-licensed pharmacies at a fraction of the brand-name cost. They are
            legal when prescribed by a licensed provider and prepared by a properly licensed pharmacy.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-graphite-600">
            Nature's Journey partners exclusively with state-licensed 503A and 503B compounding pharmacies
            that meet strict quality standards including sterility testing, potency verification, and
            proper cold-chain shipping.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs">
            <Link href="/blog/compounded-glp1-safety-evidence" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Compounded medication safety →
            </Link>
            <Link href="/blog/understanding-compounded-medications" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              What are compounded medications? →
            </Link>
            <Link href="/compare/compounded-vs-brand-glp1" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Compounded vs brand comparison →
            </Link>
          </div>

          <div className="mt-8 rounded-xl bg-navy-50/30 p-4 text-xs leading-relaxed text-graphite-400">
            <strong>Important:</strong> {siteConfig.compliance.shortDisclaimer}
          </div>
        </SectionShell>
      </section>

      <FaqSection limit={6} />

      <section className="py-12 border-t border-navy-100/40 bg-navy-50/30">
        <SectionShell>
          <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400 mb-4">Further reading</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/semaglutide", tag: "Guide", title: "Semaglutide: Full Treatment Guide" },
              { href: "/tirzepatide", tag: "Guide", title: "Tirzepatide: Full Treatment Guide" },
              { href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison", title: "Tirzepatide vs. Semaglutide in 2026" },
              { href: "/blog/managing-side-effects", tag: "Side Effects", title: "Managing GLP-1 Side Effects" },
              { href: "/blog/compounded-semaglutide-safety", tag: "Safety", title: "Is Compounded GLP-1 Safe?" },
              { href: "/blog/semaglutide-dosing-schedule-guide", tag: "Dosing", title: "GLP-1 Dosing Schedule Guide" },
              { href: "/glp1-cost", tag: "Cost", title: "GLP-1 Cost Without Insurance" },
              { href: "/eligibility", tag: "Eligibility", title: "Check Your Eligibility" },
            ].map(({ href, tag, title }) => (
              <Link key={href} href={href} className="group flex flex-col gap-2 rounded-xl border border-navy-100/60 bg-white p-4 shadow-sm hover:shadow-md hover:border-teal/40 transition-all">
                <span className="text-xs font-semibold uppercase tracking-wide text-teal">{tag}</span>
                <span className="text-sm font-medium text-navy leading-snug group-hover:text-teal transition-colors">{title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-graphite-300 group-hover:text-teal mt-auto transition-colors" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
