import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { siteConfig } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
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

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await db.comparisonPage.findUnique({ where: { slug } });

  if (!page || !page.isPublished) notFound();

  const features = (typeof page.features === "string" ? JSON.parse(page.features) : page.features) as Array<{ feature: string; us: boolean | string; them: boolean | string }>;
  const keyDiffs = page.keyDifferences
    ? (typeof page.keyDifferences === "string" ? JSON.parse(page.keyDifferences) : page.keyDifferences) as string[]
    : [];

  return (
    <MarketingShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Compare", href: "/compare" },
          { name: page.title, href: `/compare/${page.slug}` },
        ]}
      />
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Comparison</Badge>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            {page.heroHeadline}
          </h1>
          {page.heroDescription && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">{page.heroDescription}</p>
          )}
        </SectionShell>
      </section>

      {features.length > 0 && (
        <section className="py-16">
          <SectionShell>
            <div className="overflow-x-auto rounded-2xl border border-navy-100/60 bg-white shadow-premium">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100/40 bg-navy-50/30">
                    <th className="px-6 py-4 text-left font-semibold text-navy">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-teal">VitalPath</th>
                    <th className="px-6 py-4 text-center font-semibold text-graphite-500">Competitor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/30">
                  {features.map((row, i) => (
                    <tr key={i} className="hover:bg-navy-50/20 transition-colors">
                      <td className="px-6 py-3 text-graphite-600">{row.feature}</td>
                      {[row.us, row.them].map((val, j) => (
                        <td key={j} className="px-6 py-3 text-center">
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

      <section className="py-16">
        <SectionShell className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-navy">{page.ctaHeadline || "See which plan is right for you"}</h2>
          <p className="mt-4 text-graphite-500">{page.ctaDescription || "Take our quick assessment and a licensed provider will evaluate the best approach."}</p>
          <Link href="/qualify"><Button size="xl" className="mt-8 gap-2">Take the Assessment <ArrowRight className="h-4 w-4" /></Button></Link>
          <p className="mt-6 text-xs text-graphite-300">{siteConfig.compliance.shortDisclaimer}</p>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
