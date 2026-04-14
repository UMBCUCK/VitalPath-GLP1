"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface LpFaqProps {
  faqs: readonly FaqItem[];
  heading?: string;
  subheading?: string;
}

export function LpFaq({
  faqs,
  heading = "Frequently Asked Questions",
  subheading,
}: LpFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-14">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="mb-2 text-center text-2xl font-bold text-lp-heading">
          {heading}
        </h2>
        {subheading && (
          <p className="mb-8 text-center text-sm text-lp-body-muted">
            {subheading}
          </p>
        )}
        {!subheading && <div className="mb-8" />}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border bg-[var(--lp-card-bg,#fff)]"
              style={{ borderColor: "var(--lp-stat-border)" }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between p-4 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="pr-4 text-sm font-semibold text-lp-heading">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-lp-body-muted transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-sm leading-relaxed text-lp-body">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
