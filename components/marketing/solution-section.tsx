import Image from "next/image";
import { Check, Pill, Activity, ShieldCheck, TrendingUp } from "lucide-react";
import { solutionPoints } from "@/lib/content";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { solutionImage } from "@/lib/images";

const solutionIcons = [Pill, Activity, ShieldCheck, TrendingUp];

export function SolutionSection() {
  return (
    <section className="py-20 lg:py-28">
      <SectionShell>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Visual / Key stat */}
          <AnimateOnView animation="fade-in-left">
            <div className="relative">
              {/* Lifestyle image strip (desktop only) */}
              <div className="relative mb-6 hidden overflow-hidden rounded-2xl lg:block">
                <Image
                  src={solutionImage.src}
                  alt={solutionImage.alt}
                  width={solutionImage.width}
                  height={solutionImage.height}
                  className="aspect-[16/9] w-full object-cover"
                  sizes="(max-width: 1024px) 0px, 50vw"
                  placeholder="blur"
                  blurDataURL={solutionImage.blurDataURL}
                />
              </div>

              {/* Big stat card */}
              <div className="rounded-3xl bg-gradient-to-br from-navy to-atlantic p-10 text-white shadow-premium-xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-teal-300">
                  Clinical Trial Results
                </p>
                <p className="mt-4 text-6xl font-bold sm:text-7xl">
                  15-20%
                </p>
                <p className="mt-2 text-xl text-navy-300">
                  average body weight lost
                </p>
                <p className="mt-1 text-sm text-teal-300">
                  That&apos;s 25-50 lbs for most patients
                </p>
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-teal-300" />
                    <span className="text-sm text-navy-200">
                      Same active ingredient as Ozempic &amp; Wegovy
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-teal-300" />
                    <span className="text-sm text-navy-200">
                      FDA-approved active ingredients
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-teal-300" />
                    <span className="text-sm text-navy-200">
                      Prescribed by licensed providers
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-teal-300" />
                    <span className="text-sm text-navy-200">
                      3x more effective than diet alone
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating price comparison */}
              <div className="absolute -bottom-6 -right-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-premium-lg sm:-right-8">
                <p className="text-xs font-semibold text-graphite-400">Your price</p>
                <p className="text-2xl font-bold text-teal">$279<span className="text-sm font-normal text-graphite-400">/mo</span></p>
                <p className="mt-1 text-xs text-graphite-300 line-through">$1,349/mo retail</p>
                <div className="mt-2 rounded-full bg-teal-50 px-3 py-1">
                  <p className="text-xs font-bold text-teal">Save 79%</p>
                </div>
              </div>
            </div>
          </AnimateOnView>

          {/* Right: Solution points */}
          <div>
            <SectionHeading
              eyebrow="The Science"
              title="The science that finally explains why nothing else worked"
              align="left"
            />

            <div className="space-y-6">
              {solutionPoints.map((point, i) => {
                const Icon = solutionIcons[i];
                return (
                  <AnimateOnView
                    key={point.title}
                    className="flex gap-4"
                    delay={i * 0.1}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                      <Icon className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-navy">{point.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-graphite-500">
                        {point.description}
                      </p>
                    </div>
                  </AnimateOnView>
                );
              })}
            </div>

            {/* CTA — after science explanation, catch visitors ready to act */}
            <AnimateOnView className="mt-8" delay={0.5}>
              <a
                href="/qualify"
                className="inline-flex items-center gap-2 rounded-full bg-emerald px-8 py-4 text-base font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.35)] transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-700"
              >
                Start Free Assessment →
              </a>
              <p className="mt-2 text-xs text-graphite-400">Takes 2 minutes. Same-day provider evaluation.</p>
            </AnimateOnView>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
