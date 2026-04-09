import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { AnimateOnView } from "@/components/shared/animate-on-view";

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
        <div className="text-center mb-10">
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
          <Link href="/quiz">
            <Button variant="outline" className="gap-2">
              See If You Qualify <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
