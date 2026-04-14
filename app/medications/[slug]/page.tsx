export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, AlertTriangle, Pill, DollarSign, Clock, TrendingDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { medications } from "@/lib/medications";
import { siteConfig } from "@/lib/site";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return medications.map((m) => ({ slug: m.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const med = medications.find((m) => m.slug === slug);
  if (!med) return { title: "Medication Not Found" };
  return {
    title: `${med.genericName} (${med.brandName}) for Weight Loss — Cost, Results & How to Get It`,
    description: `Everything about ${med.genericName} for weight loss: how it works, clinical results (${med.weightLoss.split('.')[0]}), cost (${med.retailCost} retail vs ${med.vitalpathCost} with Nature's Journey), side effects, and how to get prescribed online.`,
    openGraph: {
      title: `${med.genericName} Weight Loss: Cost, Results & Availability | Nature's Journey`,
      description: `Get ${med.genericName} (${med.brandName}) online from ${med.vitalpathCost}. ${med.savings} less than retail. Licensed providers, free shipping.`,
    },
  };
}

export default async function MedicationPage({ params }: PageProps) {
  const { slug } = await params;
  const med = medications.find((m) => m.slug === slug);
  if (!med) notFound();

  const otherMeds = medications.filter((m) => m.slug !== slug);

  return (
    <MarketingShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Medications", href: "/guide" },
          { name: med.genericName, href: `/medications/${med.slug}` },
        ]}
      />
      <WebPageJsonLd
        title={`${med.genericName} for Weight Loss`}
        description={`Complete guide to ${med.genericName} (${med.brandName}) for weight management.`}
        path={`/medications/${med.slug}`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <Pill className="h-3.5 w-3.5" /> Medication Guide
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {med.genericName} for weight loss
          </h1>
          <p className="mx-auto mt-2 text-lg text-graphite-400">
            Brand names: {med.brandName} &middot; Manufacturer: {med.manufacturer}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            {med.mechanism}
          </p>
          <div className="mt-8">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-10">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Key stats */}
      <section className="py-12">
        <SectionShell>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: TrendingDown, label: "Avg Weight Loss", value: med.weightLoss.split('.')[0], color: "text-teal" },
              { icon: DollarSign, label: "Retail Cost", value: med.retailCost, color: "text-graphite-400" },
              { icon: DollarSign, label: "Nature's Journey Cost", value: med.vitalpathCost, color: "text-teal" },
              { icon: Clock, label: "Dosing", value: med.dosing.split('.')[0], color: "text-atlantic" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium">
                <div className="flex items-center gap-2 text-xs text-graphite-400 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  {stat.label}
                </div>
                <p className="text-sm font-bold text-navy">{stat.value}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* How it works */}
      <section className="bg-premium-gradient py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">How {med.genericName} works</h2>
          <p className="mt-4 text-sm leading-relaxed text-graphite-600">{med.mechanism}</p>

          <h3 className="mt-8 text-lg font-bold text-navy">Clinical results</h3>
          <p className="mt-2 text-sm leading-relaxed text-graphite-600">{med.weightLoss}</p>

          <h3 className="mt-8 text-lg font-bold text-navy">FDA-approved uses</h3>
          <p className="mt-2 text-sm leading-relaxed text-graphite-600">{med.approvedFor}</p>

          <h3 className="mt-8 text-lg font-bold text-navy">Dosing schedule</h3>
          <p className="mt-2 text-sm leading-relaxed text-graphite-600">{med.dosing}</p>
        </SectionShell>
      </section>

      {/* Side effects */}
      <section className="py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">Common side effects</h2>
          <p className="mt-2 text-sm text-graphite-500 mb-6">
            Most side effects are mild, temporary, and improve during the first 2-4 weeks as your body adjusts.
          </p>
          <div className="space-y-2">
            {med.sideEffects.map((effect) => (
              <div key={effect} className="flex items-center gap-3 rounded-xl bg-navy-50/30 px-4 py-3 text-sm text-graphite-600">
                <AlertTriangle className="h-4 w-4 shrink-0 text-gold-600" />
                {effect}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/blog/managing-side-effects" className="text-sm font-medium text-teal hover:underline">
              Read our complete side effects management guide &rarr;
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Cost comparison */}
      <section className="bg-premium-gradient py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">{med.genericName} cost comparison</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy-100/60 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400">Brand-name retail</p>
              <p className="mt-2 text-3xl font-bold text-graphite-400 line-through">{med.retailCost}</p>
              <p className="mt-1 text-xs text-graphite-400">Without insurance, no support included</p>
            </div>
            <div className="rounded-2xl border-2 border-teal bg-white p-6 shadow-glow">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">Nature's Journey</p>
              <p className="mt-2 text-3xl font-bold text-navy">{med.vitalpathCost}</p>
              <p className="mt-1 text-xs text-teal-600">Save {med.savings} — includes provider care, medication & support</p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/blog/glp1-weight-loss-cost-without-insurance" className="text-sm font-medium text-teal hover:underline">
              See our complete cost breakdown &rarr;
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Key facts */}
      <section className="py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">Key facts about {med.genericName}</h2>
          <ul className="mt-6 space-y-3">
            {med.keyFacts.map((fact) => (
              <li key={fact} className="flex items-start gap-3 text-sm text-graphite-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                {fact}
              </li>
            ))}
          </ul>
        </SectionShell>
      </section>

      {/* How to get it */}
      <section className="bg-premium-gradient py-16">
        <SectionShell className="max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
            How to get {med.genericName} online
          </h2>
          <p className="mt-4 text-graphite-500">
            Nature's Journey offers compounded {med.genericName.toLowerCase()} through a simple 3-step process.
            No clinic visits, no insurance hassles.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
            {[
              { step: "1", title: "Take the assessment", desc: "2-minute online health questionnaire" },
              { step: "2", title: "Provider evaluation", desc: "Licensed provider reviews your profile within 1 business day" },
              { step: "3", title: "Medication delivered", desc: "Free 2-day shipping to your door" },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-navy-100/60 bg-white p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal text-white text-sm font-bold">{s.step}</div>
                <h3 className="mt-3 text-sm font-bold text-navy">{s.title}</h3>
                <p className="mt-1 text-xs text-graphite-400">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-10">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Related links */}
      <section className="py-12">
        <SectionShell className="max-w-3xl">
          <h2 className="text-lg font-bold text-navy mb-4">Related resources</h2>
          <div className="flex flex-wrap gap-3 text-xs">
            {med.comparisonSlug && (
              <Link href={`/blog/${med.comparisonSlug}`} className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
                Semaglutide vs Tirzepatide comparison →
              </Link>
            )}
            <Link href="/blog/glp1-weight-loss-cost-without-insurance" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              GLP-1 cost guide →
            </Link>
            <Link href="/blog/compounded-glp1-safety-evidence" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Compounded medication safety →
            </Link>
            <Link href="/blog/what-to-expect-first-month-glp1" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              First month guide →
            </Link>
            <Link href="/blog/managing-side-effects" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Side effects guide →
            </Link>
            <Link href="/guide" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Complete GLP-1 guide →
            </Link>
            {otherMeds.map((m) => (
              <Link key={m.slug} href={`/medications/${m.slug}`} className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
                {m.genericName} guide →
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Disclaimer */}
      <section className="py-6">
        <SectionShell className="max-w-3xl">
          <div className="rounded-xl bg-navy-50/30 p-4 text-xs leading-relaxed text-graphite-400">
            <p><strong>Important:</strong> {siteConfig.compliance.shortDisclaimer}</p>
            <p className="mt-2">{siteConfig.compliance.eligibilityDisclaimer}</p>
          </div>
        </SectionShell>
      </section>

      <FaqSection limit={6} />
      <CtaSection />
    </MarketingShell>
  );
}
