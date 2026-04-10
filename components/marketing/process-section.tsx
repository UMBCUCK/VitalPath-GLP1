import Image from "next/image";
import { ArrowRight, ClipboardCheck, Stethoscope, Package, Clock } from "lucide-react";
import { processSteps } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { TrackedLink } from "@/components/shared/tracked-link";
import { processImages } from "@/lib/images";

const iconMap = { ClipboardCheck, Stethoscope, Package } as const;

export function ProcessSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-sage/20">
      <SectionShell>
        <SectionHeading
          eyebrow="How It Works"
          title="3 simple steps. No waiting rooms."
          description="From assessment to doorstep delivery — most patients start treatment within 48 hours."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {processSteps.map((step, i) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap];
            return (
              <AnimateOnView key={step.step} delay={i * 0.15}>
                <div className="relative flex flex-col overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-premium transition-all duration-300 hover:shadow-premium-lg">
                  {/* Step image */}
                  {processImages[i] && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={processImages[i].src}
                        alt={processImages[i].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                      <div className="absolute bottom-3 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal to-atlantic text-white text-lg font-bold shadow-glow">
                        {step.step}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col p-8 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                        <Icon className="h-5 w-5 text-teal" />
                      </div>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-navy">{step.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite-500">
                      {step.description}
                    </p>

                    <div className="mt-5 inline-flex self-start rounded-full bg-teal-50 px-3 py-1">
                      <span className="text-xs font-semibold text-teal">{step.timeEstimate}</span>
                    </div>
                  </div>

                  {i < processSteps.length - 1 && (
                    <div className="absolute -right-4 top-1/2 z-10 hidden lg:block">
                      <ArrowRight className="h-6 w-6 text-teal-300" />
                    </div>
                  )}
                </div>
              </AnimateOnView>
            );
          })}
        </div>

        <AnimateOnView className="mt-8 text-center" delay={0.4}>
          <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-teal-100 bg-teal-50/50 px-6 py-3">
            <Clock className="h-4 w-4 text-teal" />
            <span className="text-sm text-graphite-600">
              Total time from assessment to medication: <span className="font-bold text-teal">as little as 48 hours</span>
            </span>
          </div>
        </AnimateOnView>

        <AnimateOnView className="mt-8 text-center" delay={0.5}>
          <TrackedLink href="/qualify" cta="process_assessment" location="process_section">
            <Button size="xl" className="gap-2 px-10">
              Start My Assessment
              <ArrowRight className="h-5 w-5" />
            </Button>
          </TrackedLink>
          <p className="mt-3 text-xs text-graphite-400">Takes about 2 minutes. No commitment required.</p>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
