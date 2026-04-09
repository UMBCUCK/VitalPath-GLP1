export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Shield, Clock, MapPin, Stethoscope, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/components/seo/json-ld";
import { allStates } from "@/lib/states";
import { siteConfig } from "@/lib/site";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return allStates
    .filter((s) => s.available)
    .map((s) => ({ slug: s.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const state = allStates.find((s) => s.slug === slug);
  if (!state || !state.available) return { title: "State Not Found" };
  return {
    title: `GLP-1 Weight Loss in ${state.name} — Online Treatment Available`,
    description: `Get GLP-1 weight loss medication in ${state.name} through telehealth. Licensed providers, compounded semaglutide from $279/mo, free 2-day shipping to ${state.code}. No clinic visits needed.`,
    openGraph: {
      title: `GLP-1 Weight Loss Treatment in ${state.name} | VitalPath`,
      description: `Online GLP-1 weight management available in ${state.name}. Provider evaluation, medication, meal plans, and coaching — all from home.`,
    },
  };
}

export default async function StatePage({ params }: PageProps) {
  const { slug } = await params;
  const state = allStates.find((s) => s.slug === slug);
  if (!state || !state.available) notFound();

  const nearbyStates = allStates
    .filter((s) => s.available && s.slug !== slug)
    .slice(0, 6);

  return (
    <MarketingShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "States", href: "/states" },
          { name: state.name, href: `/states/${state.slug}` },
        ]}
      />
      <WebPageJsonLd
        title={`GLP-1 Weight Loss in ${state.name}`}
        description={`Online GLP-1 weight management program available to ${state.name} residents. Licensed providers, medication, and support.`}
        path={`/states/${state.slug}`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Available in {state.name}
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            GLP-1 weight loss medication in{" "}
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              {state.name}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Get evaluated by a licensed provider, receive your medication at home in {state.name},
            and access ongoing support — all through telehealth. No clinic visits required.
          </p>
          <div className="mt-10">
            <Link href="/quiz">
              <Button size="xl" className="gap-2 px-10">
                See If I Qualify in {state.code}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-graphite-400">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal" /> 2-minute assessment</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal" /> Free 2-day shipping to {state.code}</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-teal" /> Cancel anytime</span>
          </div>
        </SectionShell>
      </section>

      {/* How it works for this state */}
      <section className="py-16">
        <SectionShell>
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
            How GLP-1 treatment works in {state.name}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-graphite-500">
            VitalPath is licensed to provide telehealth weight management services in {state.name}.
            Here&apos;s how it works:
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Stethoscope,
                title: "1. Online Provider Evaluation",
                description: `Complete a quick health assessment and get evaluated by a licensed provider authorized to practice in ${state.name}. No in-person visit needed.`,
              },
              {
                icon: Package,
                title: "2. Medication Prescribed & Shipped",
                description: `If eligible, your provider prescribes compounded GLP-1 medication. It ships from a licensed pharmacy directly to your ${state.name} address with free 2-day delivery.`,
              },
              {
                icon: Shield,
                title: "3. Ongoing Care & Support",
                description: "Track your progress, follow personalized meal plans, and message your care team anytime. Regular check-ins ensure your treatment stays on track.",
              },
            ].map((step) => (
              <div key={step.title} className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                  <step.icon className="h-6 w-6 text-teal" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-500">{step.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Pricing */}
      <section className="bg-premium-gradient py-16">
        <SectionShell>
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
            {state.name} GLP-1 treatment pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-graphite-500">
            Brand-name GLP-1 medications cost $1,349+/month without insurance. VitalPath plans include
            medication, provider care, and full support — starting at a fraction of retail.
          </p>

          <div className="mt-10 mx-auto max-w-3xl grid gap-4 sm:grid-cols-3">
            {[
              { name: "Essential", price: "$279", features: ["Provider evaluation", "GLP-1 medication", "Free 2-day shipping", "Monthly check-ins"] },
              { name: "Premium", price: "$379", highlight: true, features: ["Everything in Essential", "Weekly meal plans", "Bi-weekly coaching", "Progress tracking"] },
              { name: "Complete", price: "$599", features: ["Everything in Premium", "Weekly coaching", "Supplement bundles", "Lab coordination"] },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl border p-6 ${plan.highlight ? "border-teal ring-1 ring-teal/20 bg-white shadow-glow" : "border-navy-100/60 bg-white shadow-premium"}`}>
                <h3 className="font-bold text-navy">{plan.name}</h3>
                <p className="mt-2"><span className="text-3xl font-bold text-navy">{plan.price}</span><span className="text-sm text-graphite-400">/mo</span></p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-graphite-500">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/quiz?state=${state.code}`} className="mt-4 block">
                  <Button variant={plan.highlight ? "default" : "outline"} size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* State-specific content for SEO */}
      <section className="py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">
            About GLP-1 weight loss treatment in {state.name}
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-graphite-600">
            <p>
              {state.name} residents can now access GLP-1 weight management medication through
              telehealth — without visiting a clinic, waiting for an appointment, or navigating
              insurance pre-authorizations. VitalPath partners with licensed providers in {state.name} to
              deliver comprehensive weight management care entirely online.
            </p>
            <p>
              Our program includes a licensed provider evaluation, compounded GLP-1 medication
              (semaglutide) if prescribed, free 2-day shipping anywhere in {state.name}, and ongoing
              clinical support. Plans start at $279/month — up to 79% less than brand-name
              GLP-1 medications like Ozempic ($935+/mo) or Wegovy ($1,349+/mo).
            </p>
            <p>
              Telehealth weight management is regulated in {state.name}, and all VitalPath providers
              are licensed and authorized to practice in the state. Medication is prepared by
              state-licensed 503A and 503B compounding pharmacies that meet strict quality standards.
            </p>
          </div>

          {/* Internal links */}
          <div className="mt-8 flex flex-wrap gap-3 text-xs">
            <Link href="/eligibility" className="rounded-lg bg-navy-50/30 px-3 py-2 text-graphite-500 hover:text-teal transition-colors">
              Check eligibility →
            </Link>
            <Link href="/how-it-works" className="rounded-lg bg-navy-50/30 px-3 py-2 text-graphite-500 hover:text-teal transition-colors">
              How it works →
            </Link>
            <Link href="/blog/glp1-weight-loss-cost-without-insurance" className="rounded-lg bg-navy-50/30 px-3 py-2 text-graphite-500 hover:text-teal transition-colors">
              GLP-1 cost guide →
            </Link>
            <Link href="/blog/compounded-glp1-safety-evidence" className="rounded-lg bg-navy-50/30 px-3 py-2 text-graphite-500 hover:text-teal transition-colors">
              Compounded medication safety →
            </Link>
            <Link href="/compare" className="rounded-lg bg-navy-50/30 px-3 py-2 text-graphite-500 hover:text-teal transition-colors">
              Compare programs →
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* Nearby states */}
      <section className="bg-navy-50/20 py-12">
        <SectionShell>
          <h2 className="text-center text-lg font-bold text-navy mb-6">
            Also available in nearby states
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {nearbyStates.map((s) => (
              <Link
                key={s.slug}
                href={`/states/${s.slug}`}
                className="rounded-xl border border-navy-100/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors shadow-sm"
              >
                {s.name}
              </Link>
            ))}
            <Link
              href="/states"
              className="rounded-xl border border-navy-100/40 bg-white px-4 py-2 text-sm font-medium text-graphite-400 hover:text-teal transition-colors shadow-sm"
            >
              View all states →
            </Link>
          </div>
        </SectionShell>
      </section>

      <FaqSection limit={6} />
      <CtaSection />
    </MarketingShell>
  );
}
