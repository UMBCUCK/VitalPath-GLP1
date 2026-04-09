import {
  Stethoscope,
  Utensils,
  TrendingUp,
  MessageCircle,
  Calculator,
  Gift,
} from "lucide-react";
import { valueProps } from "@/lib/content";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";

const iconMap = {
  Stethoscope,
  Utensils,
  TrendingUp,
  MessageCircle,
  Calculator,
  Gift,
} as const;

export function ValuePropsSection() {
  return (
    <section className="bg-premium-gradient py-20 lg:py-28">
      <SectionShell>
        <SectionHeading
          eyebrow="Beyond the Prescription"
          title="Support that makes the difference"
          description="Medication is just one part of the equation. Our platform gives you the tools, guidance, and accountability to build lasting habits."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueProps.map((prop, i) => {
            const Icon = iconMap[prop.icon as keyof typeof iconMap];
            return (
              <AnimateOnView
                key={prop.title}
                className="group rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-0.5"
                delay={i * 0.08}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-sage transition-colors group-hover:from-teal-100 group-hover:to-sage">
                  <Icon className="h-6 w-6 text-teal" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy">{prop.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-500">{prop.description}</p>
              </AnimateOnView>
            );
          })}
        </div>
      </SectionShell>
    </section>
  );
}
