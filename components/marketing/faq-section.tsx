"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { faqs } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

interface FaqSectionProps {
  limit?: number;
  showHeading?: boolean;
  showCta?: boolean;
}

export function FaqSection({ limit, showHeading = true, showCta = true }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const visibleFaqs = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section className="py-20 lg:py-28" id="faq">
      <SectionShell className="max-w-3xl">
        {showHeading && (
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions, clear answers"
          />
        )}

        <div className="space-y-3">
          {visibleFaqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-navy-100/60 bg-white shadow-premium transition-shadow hover:shadow-premium-md"
            >
              <button
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
                onClick={() => {
                  const newIndex = openIndex === i ? null : i;
                  setOpenIndex(newIndex);
                  if (newIndex !== null) {
                    track(ANALYTICS_EVENTS.FAQ_EXPAND, { question: faq.question });
                  }
                }}
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-semibold text-navy">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-graphite-400 transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>

              <div className="faq-answer" data-open={openIndex === i}>
                <div>
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed text-graphite-500">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Post-FAQ CTA */}
        {showCta && (
          <div className="mt-10 text-center">
            <p className="text-sm text-graphite-500 mb-4">Still have questions? Our care team is here to help.</p>
            <Link href="/qualify">
              <Button className="gap-2" onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { location: "faq_section", target: "/qualify" })}>
                Start Your Free Assessment <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </SectionShell>
    </section>
  );
}
