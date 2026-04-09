import Link from "next/link";
import { Award, GraduationCap, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { providers } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";

export function ProviderSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-linen/30 to-white">
      <SectionShell>
        <SectionHeading
          eyebrow="Your Care Team"
          title="Board-certified providers who specialize in weight management"
          description="Every treatment plan is created and managed by physicians with deep expertise in obesity medicine and metabolic health."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {providers.map((provider, i) => (
            <AnimateOnView key={provider.name} delay={i * 0.12}>
              <div className="flex flex-col items-center rounded-2xl border border-navy-100/60 bg-white p-8 text-center shadow-premium transition-all duration-300 hover:shadow-premium-lg">
                {/* Avatar placeholder */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-navy to-atlantic text-2xl font-bold text-white shadow-glow">
                  {provider.initials}
                </div>

                <h3 className="mt-5 text-lg font-bold text-navy">{provider.name}</h3>
                <p className="text-sm font-medium text-teal">{provider.title}</p>

                <div className="mt-5 w-full space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm text-graphite-500">{provider.credentials}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm text-graphite-500">{provider.institution}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm text-graphite-500">{provider.experience}</span>
                  </div>
                </div>
              </div>
            </AnimateOnView>
          ))}
        </div>

        {/* Trust signals */}
        <AnimateOnView className="mt-12" delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-sm text-graphite-500">
              <ShieldCheck className="h-5 w-5 text-teal" />
              Licensed in all 50 states
            </div>
            <div className="flex items-center gap-2 text-sm text-graphite-500">
              <Award className="h-5 w-5 text-teal" />
              Board-certified physicians
            </div>
            <div className="flex items-center gap-2 text-sm text-graphite-500">
              <Clock className="h-5 w-5 text-teal" />
              Same-day evaluations available
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link href="/quiz">
              <Button className="gap-2">
                Get Matched with a Provider <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
