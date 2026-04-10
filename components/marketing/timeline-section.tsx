"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { cn } from "@/lib/utils";

const timeline = [
  {
    week: "Week 1-2",
    title: "Getting started",
    milestone: "First dose, appetite changes begin",
    details: [
      "You'll receive your medication and take your first dose",
      "Most patients notice reduced appetite within the first 7-10 days",
      "Mild nausea is common but typically fades within a few days",
      "Your care team checks in to monitor how you're adjusting",
      "Start using the meal plans — your hunger patterns are already shifting",
    ],
    avgLoss: "2-4 lbs",
    color: "from-navy to-atlantic",
  },
  {
    week: "Week 3-4",
    title: "Building momentum",
    milestone: "Cravings significantly reduced",
    details: [
      "Food noise quiets down — you stop thinking about food constantly",
      "Portion sizes naturally decrease without feeling deprived",
      "Energy levels begin improving as your body adjusts",
      "First dose adjustment may happen based on your response",
      "You're establishing new eating patterns that feel effortless",
    ],
    avgLoss: "5-8 lbs total",
    color: "from-atlantic to-teal",
  },
  {
    week: "Month 2",
    title: "Visible results",
    milestone: "Clothes fitting differently, others notice",
    details: [
      "Consistent weight loss of 1-2 lbs per week becomes the norm",
      "Clothes start fitting noticeably different — time to try on old favorites",
      "Friends and family start asking what you're doing differently",
      "Blood pressure and blood sugar markers often begin improving",
      "Your provider may optimize your dose for maximum effectiveness",
    ],
    avgLoss: "12-18 lbs total",
    color: "from-teal to-teal-600",
  },
  {
    week: "Month 3-4",
    title: "Transformation",
    milestone: "Major health improvements, new confidence",
    details: [
      "Significant, visible transformation — this is where it gets exciting",
      "Lab work often shows improved cholesterol, A1C, and inflammation markers",
      "Sleep quality improves, joint pain decreases with less weight",
      "Exercise becomes easier and more enjoyable",
      "You're building habits that will sustain results long-term",
    ],
    avgLoss: "20-30 lbs total",
    color: "from-teal-600 to-teal-800",
  },
  {
    week: "Month 5-6",
    title: "Goal territory",
    milestone: "Approaching target weight, maintenance planning begins",
    details: [
      "Many patients are approaching or have reached their goal weight",
      "Your provider begins discussing maintenance transition planning",
      "The habits you've built are becoming second nature",
      "Health markers continue improving — many patients reduce other medications",
      "You have a clear plan for sustaining results beyond active treatment",
    ],
    avgLoss: "30-45+ lbs total",
    color: "from-teal-800 to-navy",
  },
];

export function TimelineSection() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28">
      <SectionShell>
        <SectionHeading
          eyebrow="What to Expect"
          title="Your first 6 months, week by week"
          description="Here's exactly what the journey looks like — no surprises, no guesswork."
        />

        <div className="mx-auto max-w-3xl">
          {/* Timeline line */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-navy via-teal to-navy-200 hidden sm:block" />

            <div className="space-y-4">
              {timeline.map((phase, i) => (
                <AnimateOnView key={phase.week} delay={i * 0.08}>
                  <div
                    className={cn(
                      "relative rounded-2xl border bg-white transition-all duration-300",
                      expanded === i
                        ? "border-teal-200 shadow-glow"
                        : "border-navy-100/60 shadow-premium hover:shadow-premium-md"
                    )}
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[5px] top-6 hidden sm:block">
                      <div className={cn(
                        "h-3 w-3 rounded-full border-2 border-white",
                        expanded === i ? "bg-teal" : "bg-navy-200"
                      )} />
                    </div>

                    {/* Header — always visible, clickable */}
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="flex w-full items-center gap-4 p-5 text-left sm:pl-10"
                    >
                      {/* Week badge */}
                      <div className={cn(
                        "shrink-0 rounded-xl bg-gradient-to-br px-3 py-1.5 text-xs font-bold text-white",
                        phase.color
                      )}>
                        {phase.week}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-navy">{phase.title}</h3>
                        <p className="text-sm text-graphite-400 truncate">{phase.milestone}</p>
                      </div>

                      {/* Weight loss badge */}
                      <div className="hidden shrink-0 rounded-full bg-teal-50 px-3 py-1 sm:block">
                        <span className="text-xs font-bold text-teal">~{phase.avgLoss}</span>
                      </div>

                      <ChevronDown className={cn(
                        "h-5 w-5 shrink-0 text-graphite-400 transition-transform duration-200",
                        expanded === i && "rotate-180"
                      )} />
                    </button>

                    {/* Expandable details */}
                    <div className={cn(
                      "grid transition-all duration-300",
                      expanded === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}>
                      <div className="overflow-hidden">
                        <div className="px-5 pb-5 sm:pl-10">
                          {/* Mobile weight badge */}
                          <div className="mb-3 inline-flex rounded-full bg-teal-50 px-3 py-1 sm:hidden">
                            <span className="text-xs font-bold text-teal">Avg: ~{phase.avgLoss}</span>
                          </div>

                          <ul className="space-y-2">
                            {phase.details.map((detail) => (
                              <li key={detail} className="flex items-start gap-2.5">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                                <span className="text-sm text-graphite-500">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnView>
              ))}
            </div>
          </div>

          {/* CTA after timeline */}
          <div className="mt-8 text-center">
            <Link href="/qualify">
              <Button size="lg" className="gap-2">
                Start Your Journey Today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-2 text-xs text-graphite-400">Free assessment &middot; Results in 2 minutes</p>
          </div>

          <p className="mt-6 text-center text-[10px] text-graphite-300">
            Timeline based on average patient outcomes. Individual results vary based on adherence, starting weight, and health factors.
          </p>
        </div>
      </SectionShell>
    </section>
  );
}
