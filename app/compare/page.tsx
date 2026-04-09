import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compare Weight Management Programs",
  description: "See how VitalPath compares to other weight management programs. Honest, side-by-side comparisons.",
};

export default async function ComparePage() {
  const comparisons = await db.comparisonPage.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Comparisons</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            How VitalPath compares
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Honest, side-by-side comparisons to help you make an informed decision about your weight management program.
          </p>
        </SectionShell>
      </section>

      {/* SEO intro content */}
      <section className="py-12 border-b border-navy-100/40">
        <SectionShell className="max-w-3xl">
          <div className="space-y-4 text-sm leading-relaxed text-graphite-600">
            <p>
              Choosing a weight management program is a medical decision — and it deserves the same
              level of research you&apos;d give any healthcare choice. We created these comparisons to
              give you transparent, fact-based information so you can evaluate your options with confidence.
            </p>
            <p>
              <strong>What we compare:</strong> Each comparison evaluates programs across five criteria
              that matter most for long-term success — monthly cost, clinical outcomes (average weight
              loss backed by published data), provider access and credentials, what&apos;s included beyond
              medication, and program flexibility (cancellation, plan changes, maintenance support).
            </p>
            <p>
              We include our own program in every comparison because we believe transparency builds
              trust. Where a competitor offers something we don&apos;t, we say so. Our goal is to help
              you find the right program for <em>your</em> needs — even if that&apos;s not VitalPath.
            </p>
          </div>
        </SectionShell>
      </section>

      <section className="py-16">
        <SectionShell>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((page) => (
              <Link key={page.id} href={`/compare/${page.slug}`} className="group">
                <div className="flex flex-col h-full rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
                    <Scale className="h-6 w-6 text-teal" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy group-hover:text-teal transition-colors">{page.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-graphite-500">{page.heroDescription || page.heroHeadline}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal">
                    Read comparison <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {comparisons.length === 0 && (
            <p className="py-12 text-center text-graphite-400">No comparisons published yet.</p>
          )}
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
