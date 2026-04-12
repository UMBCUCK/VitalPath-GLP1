"use client";

import { useState } from "react";
import { ChevronDown, Shield, Pill, Scale, Heart, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const objections = [
  {
    icon: Pill,
    question: "Is GLP-1 medication safe?",
    answer: "GLP-1 medications (semaglutide, tirzepatide) have been studied in clinical trials with over 25,000 participants. They're FDA-approved for weight management. Our board-certified providers review your complete medical history before prescribing, and monitor you throughout treatment.",
    stat: "25,000+",
    statLabel: "clinical trial participants",
  },
  {
    icon: Scale,
    question: "What if I don't lose weight?",
    answer: "Clinical studies show an average of 15-20% total body weight loss over 12-16 months. If you're not seeing results within 90 days, your provider will adjust your treatment plan at no additional cost. We also offer a 30-day money-back guarantee.",
    stat: "15-20%",
    statLabel: "average body weight loss",
  },
  {
    icon: Heart,
    question: "What about side effects?",
    answer: "The most common side effect is mild nausea in the first 1-2 weeks, which typically resolves as your body adjusts. Your provider starts you at a low dose and gradually increases it. Our care team is available to help manage any side effects.",
    stat: "85%",
    statLabel: "report side effects resolve within 2 weeks",
  },
  {
    icon: DollarSign,
    question: "Why is this cheaper than brand-name?",
    answer: "We use compounded semaglutide from state-licensed 503A/503B compounding pharmacies. Compounded medications are not FDA-approved drug products, but are prepared under licensed pharmacist supervision using pharmaceutical-grade active ingredients. Your provider determines whether compounded medication is appropriate for you.",
    stat: "79%",
    statLabel: "less than brand-name retail",
  },
  {
    icon: Clock,
    question: "What happens if I stop taking it?",
    answer: "Gradual dose tapering is recommended when discontinuing. Many members maintain their weight loss by combining medication with the lifestyle habits they develop during treatment. Your provider creates a personalized transition plan.",
    stat: "68%",
    statLabel: "maintain results with lifestyle changes",
  },
  {
    icon: Shield,
    question: "Is my information private?",
    answer: "We're fully HIPAA compliant with 256-bit encryption. Your health data is never shared with employers, insurers, or third parties. All provider consultations are private and confidential.",
    stat: "100%",
    statLabel: "HIPAA compliant",
  },
];

export function ObjectionHandler() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    const next = openIndex === index ? null : index;
    setOpenIndex(next);
    if (next !== null) {
      track("objection_viewed", { question: objections[index].question });
    }
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">Common Concerns</p>
          <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">
            Questions you&apos;re probably thinking right now
          </h2>
          <p className="mt-2 text-sm text-graphite-500">
            We answer these hundreds of times a week. Here&apos;s the honest truth.
          </p>
        </div>

        <div className="space-y-3">
          {objections.map((obj, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl border-2 transition-all duration-200",
                openIndex === i
                  ? "border-teal bg-teal-50/30 shadow-sm"
                  : "border-navy-100 bg-white hover:border-navy-200"
              )}
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                    openIndex === i ? "bg-teal text-white" : "bg-navy-50 text-navy"
                  )}
                >
                  <obj.icon className="h-4.5 w-4.5" />
                </div>
                <span className="flex-1 text-sm font-bold text-navy">{obj.question}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-graphite-400 transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>

              {openIndex === i && (
                <div className="px-5 pb-5">
                  <div className="ml-12">
                    <p className="text-sm leading-relaxed text-graphite-600">{obj.answer}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
                      <span className="text-lg font-bold text-teal">{obj.stat}</span>
                      <span className="text-xs text-graphite-500">{obj.statLabel}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
