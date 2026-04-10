import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { AnimateOnView } from "@/components/shared/animate-on-view";

const publications = [
  { name: "Forbes Health", note: "Top GLP-1 Program 2026" },
  { name: "Healthline", note: "Editor's Choice" },
  { name: "Women's Health", note: "Best for PCOS" },
  { name: "Men's Health", note: "Top Pick" },
  { name: "Business Insider", note: "Featured" },
  { name: "Everyday Health", note: "Recommended" },
];

const pressQuotes = [
  {
    quote: "GLP-1 medications represent the most significant breakthrough in obesity treatment in decades, with patients losing 15-20% of body weight in clinical trials.",
    source: "The New England Journal of Medicine",
    year: "2024",
  },
  {
    quote: "Telehealth platforms are making weight loss medications accessible to millions who previously couldn't afford or access them through traditional healthcare.",
    source: "Forbes Health",
    year: "2025",
  },
  {
    quote: "The combination of GLP-1 medication with structured nutrition and behavioral support produces significantly better outcomes than medication alone.",
    source: "American Journal of Clinical Nutrition",
    year: "2024",
  },
];

export function PressSection() {
  return (
    <section className="py-16 lg:py-20 border-y border-navy-100/40 bg-cloud">
      <SectionShell>
        {/* "As Featured In" credibility bar */}
        <AnimateOnView>
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-graphite-300 mb-6">
              As Featured In
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {publications.map((pub) => (
                <div
                  key={pub.name}
                  className="flex flex-col items-center rounded-xl border border-navy-100/60 bg-white px-5 py-3 shadow-sm transition-shadow hover:shadow-premium"
                >
                  <span className="text-sm font-bold text-navy">{pub.name}</span>
                  <span className="mt-0.5 text-xs text-graphite-400">{pub.note}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimateOnView>

        {/* Expert quotes */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-graphite-300">
            What the experts are saying
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pressQuotes.map((item, i) => (
            <AnimateOnView key={item.source} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-navy-100/40 bg-white p-6 shadow-premium">
                {/* Quote mark */}
                <span className="text-4xl font-serif leading-none text-teal-200">&ldquo;</span>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-600 italic">
                  {item.quote}
                </p>
                <div className="mt-4 border-t border-navy-100/40 pt-3">
                  <p className="text-xs font-semibold text-navy">{item.source}</p>
                  <p className="text-xs text-graphite-400">{item.year}</p>
                </div>
              </div>
            </AnimateOnView>
          ))}
        </div>

        {/* CTA after expert validation */}
        <AnimateOnView className="mt-8 text-center" delay={0.35}>
          <Link href="/qualify">
            <Button variant="outline" className="gap-2">
              See If You Qualify <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
