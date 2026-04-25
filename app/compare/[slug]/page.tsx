import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { siteConfig } from "@/lib/site";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await db.comparisonPage.findUnique({ where: { slug } });
  if (!page) return { title: "Comparison Not Found" };
  const description = page.seoDescription || `Compare ${siteConfig.name} vs ${page.title}. See features, pricing, and clinical support side by side.`;
  return {
    title: page.seoTitle || `${page.title} vs ${siteConfig.name}`,
    description,
    openGraph: { title: page.seoTitle || page.title, description },
  };
}

const relatedResources = [
  { label: "How GLP-1 Medications Work", href: "/blog/understanding-glp1" },
  { label: "GLP-1 Cost & Pricing Guide", href: "/glp1-cost" },
  { label: "How to Get GLP-1 Without Insurance", href: "/blog/how-to-get-glp1-without-insurance" },
  { label: "Semaglutide vs Tirzepatide (2026)", href: "/blog/tirzepatide-vs-semaglutide-2026" },
  { label: "Compounded vs Brand-Name GLP-1", href: "/compare/compounded-vs-brand-glp1" },
  { label: "View All Comparisons", href: "/compare" },
];

const comparisonFaqs = [
  {
    question: "What makes a GLP-1 telehealth program worth paying for?",
    answer: "The key differentiators are: licensed provider oversight, access to FDA-regulated compounded medications, ongoing dose adjustments, and 24/7 support. Programs without clinical supervision can leave patients without guidance on side effects or dosing — which significantly impacts outcomes and safety.",
  },
  {
    question: "Is compounded semaglutide as effective as Ozempic or Wegovy?",
    answer: "Compounded semaglutide contains the same active ingredient (semaglutide) as branded medications. Clinical evidence on semaglutide efficacy applies to the molecule itself. The key is sourcing from state-licensed 503A or 503B pharmacies under provider supervision — which is how reputable telehealth programs source their medications.",
  },
  {
    question: "How much can I expect to pay for GLP-1 treatment without insurance?",
    answer: "Brand-name Wegovy costs approximately $1,349/month and Zepbound costs approximately $1,059/month without insurance. Compounded alternatives through telehealth programs typically range from $150–$400/month, representing 70–85% savings while using the same active ingredient under licensed provider care.",
  },
  {
    question: "What should I look for when comparing GLP-1 programs?",
    answer: "Evaluate five things: (1) provider credentials and supervision model, (2) pharmacy sourcing (503A vs 503B licensed), (3) included support (coaching, messaging, check-ins), (4) transparent pricing with no hidden fees, and (5) what happens if you have side effects or need a dose adjustment.",
  },
];

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;

  const [page, otherComparisons] = await Promise.all([
    db.comparisonPage.findUnique({ where: { slug } }),
    db.comparisonPage.findMany({
      where: { isPublished: true, NOT: { slug } },
      select: { slug: true, title: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!page || !page.isPublished) notFound();

  const features = (typeof page.features === "string" ? JSON.parse(page.features) : page.features) as Array<{ feature: string; us: boolean | string; them: boolean | string }>;
  const keyDiffs = page.keyDifferences
    ? (typeof page.keyDifferences === "string" ? JSON.parse(page.keyDifferences) : page.keyDifferences) as string[]
    : [];

  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={comparisonFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Compare", href: "/compare" },
          { name: page.title, href: `/compare/${page.slug}` },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Comparison</Badge>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            {page.heroHeadline}
          </h1>
          {page.heroDescription && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">{page.heroDescription}</p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-graphite-400">
            <span>Side-by-side comparison</span>
            <span>&middot;</span>
            <span>Updated 2026</span>
            <span>&middot;</span>
            <span>Evidence-based</span>
          </div>
        </SectionShell>
      </section>

      {/* Feature table */}
      {features.length > 0 && (
        <section className="py-16">
          <SectionShell>
            <div className="overflow-x-auto rounded-2xl border border-navy-100/60 bg-white shadow-premium">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-navy-50/30">
                    <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-navy">Feature</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold text-teal">Nature&apos;s Journey</th>
                    <th className="px-3 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold text-graphite-500">Competitor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {features.map((row, i) => (
                    <tr key={i} className="hover:bg-navy-50/20 transition-colors">
                      <td className="px-3 py-3 sm:px-6 text-xs sm:text-sm text-graphite-600">{row.feature}</td>
                      {[row.us, row.them].map((val, j) => (
                        <td key={j} className="px-3 py-3 sm:px-6 text-center">
                          {val === true ? <Check className="mx-auto h-4 w-4 text-teal" /> :
                           val === false ? <X className="mx-auto h-4 w-4 text-graphite-300" /> :
                           <span className="text-xs text-graphite-500">{String(val)}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionShell>
        </section>
      )}

      {/* Key differences */}
      {keyDiffs.length > 0 && (
        <section className="bg-premium-gradient py-16">
          <SectionShell className="max-w-3xl">
            <h2 className="text-2xl font-bold text-navy mb-8 text-center">Key differences</h2>
            <div className="space-y-4">
              {keyDiffs.map((diff, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-premium">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-bold text-navy">{i + 1}</div>
                  <p className="text-sm leading-relaxed text-graphite-600">{diff}</p>
                </div>
              ))}
            </div>
          </SectionShell>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <SectionShell className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-navy">{page.ctaHeadline || "See which plan is right for you"}</h2>
          <p className="mt-4 text-graphite-500">{page.ctaDescription || "Take our quick assessment and a licensed provider will evaluate the best approach."}</p>
          <Link href="/qualify"><Button size="xl" className="mt-8 gap-2">Take the Assessment <ArrowRight className="h-4 w-4" /></Button></Link>
          <p className="mt-6 text-xs text-graphite-300">{siteConfig.compliance.shortDisclaimer}</p>
        </SectionShell>
      </section>

      {/* FAQ section */}
      <section className="py-16 bg-white border-t border-navy-100/40">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy mb-2 text-center">Frequently asked questions</h2>
          <p className="text-graphite-500 text-center mb-8">Common questions when comparing GLP-1 weight loss programs</p>
          <div className="space-y-4">
            {comparisonFaqs.map((faq, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-navy-100/40 bg-cloud/30 open:bg-white open:shadow-premium transition-all"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-sm font-semibold text-navy list-none">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 shrink-0 text-graphite-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed text-graphite-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Related Resources */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold text-navy mb-4">Related resources</h2>
            <div className="flex flex-wrap gap-3">
              {relatedResources.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors"
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Other comparisons */}
      {otherComparisons.length > 0 && (
        <section className="py-12 bg-white">
          <SectionShell>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-semibold text-navy mb-4">Compare other programs</h2>
              <div className="flex flex-wrap gap-3">
                {otherComparisons.map((comp) => (
                  <Link
                    key={comp.slug}
                    href={`/compare/${comp.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-navy-100/40 bg-navy-50/20 px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors"
                  >
                    vs {comp.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          </SectionShell>
        </section>
      )}
    </MarketingShell>
  );
}
