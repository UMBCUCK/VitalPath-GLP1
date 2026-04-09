import { Check, ShieldCheck, Thermometer, Clock, Pill } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "Same active ingredient",
    description: "Contains semaglutide — the same FDA-approved active ingredient found in Ozempic and Wegovy.",
  },
  {
    icon: Thermometer,
    title: "Temperature-controlled shipping",
    description: "Ships in insulated packaging with cold packs to maintain medication integrity from pharmacy to your door.",
  },
  {
    icon: Clock,
    title: "Once-weekly injection",
    description: "A tiny subcutaneous injection once per week — takes about 30 seconds. Most patients say they barely feel it.",
  },
  {
    icon: Pill,
    title: "Gradual dose escalation",
    description: "Start low, go slow. Your provider carefully increases dosage over weeks to minimize side effects and optimize results.",
  },
];

const dosageSchedule = [
  { week: "Weeks 1-4", dose: "0.25mg", purpose: "Body adjustment period" },
  { week: "Weeks 5-8", dose: "0.5mg", purpose: "Appetite reduction begins" },
  { week: "Weeks 9-12", dose: "1.0mg", purpose: "Full therapeutic effect" },
  { week: "Week 13+", dose: "Up to 2.4mg", purpose: "Optimized for your response" },
];

export function MedicationSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-cloud">
      <SectionShell>
        <SectionHeading
          eyebrow="Your Medication"
          title="What you'll receive"
          description="Compounded semaglutide — prescribed by your provider, prepared by a licensed pharmacy, delivered to your door."
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left: Visual product representation */}
          <AnimateOnView animation="fade-in-left">
            <div className="relative">
              {/* Medication card */}
              <div className="rounded-3xl border border-navy-100/60 bg-white p-8 shadow-premium-lg sm:p-10">
                {/* Product visual placeholder */}
                <div className="relative mx-auto aspect-square max-w-xs rounded-2xl bg-gradient-to-br from-teal-50 via-white to-sage/30 p-8 flex flex-col items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal to-atlantic shadow-glow">
                    <Pill className="h-12 w-12 text-white" />
                  </div>
                  <p className="mt-4 text-lg font-bold text-navy">Semaglutide</p>
                  <p className="text-sm text-graphite-400">Compounded GLP-1 injection</p>

                  {/* Floating badges */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="default" className="text-[10px]">Rx Only</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="success" className="text-[10px]">US Pharmacy</Badge>
                  </div>
                </div>

                {/* Key facts */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-navy-50 p-3">
                    <p className="text-lg font-bold text-navy">1x</p>
                    <p className="text-[10px] text-graphite-400">Per week</p>
                  </div>
                  <div className="rounded-xl bg-teal-50 p-3">
                    <p className="text-lg font-bold text-teal">30sec</p>
                    <p className="text-[10px] text-teal-600">To inject</p>
                  </div>
                  <div className="rounded-xl bg-navy-50 p-3">
                    <p className="text-lg font-bold text-navy">Free</p>
                    <p className="text-[10px] text-graphite-400">Shipping</p>
                  </div>
                </div>
              </div>

              {/* Compliance note */}
              <p className="mt-4 text-center text-[10px] text-graphite-300">
                Compounded medications are not FDA-approved. They are prepared by state-licensed pharmacies
                and prescribed by licensed providers when clinically appropriate.
              </p>
            </div>
          </AnimateOnView>

          {/* Right: Features + dosing schedule */}
          <div>
            {/* Feature callouts */}
            <div className="space-y-5">
              {features.map((feature, i) => (
                <AnimateOnView key={feature.title} delay={i * 0.1}>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                      <feature.icon className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-graphite-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimateOnView>
              ))}
            </div>

            {/* Dosage schedule */}
            <AnimateOnView className="mt-8" delay={0.5}>
              <div className="rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium">
                <h3 className="text-sm font-bold text-navy mb-4">Typical dosing schedule</h3>
                <div className="space-y-2">
                  {dosageSchedule.map((phase, i) => (
                    <div
                      key={phase.week}
                      className="flex items-center gap-3 rounded-xl bg-navy-50/50 p-3"
                    >
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        i === dosageSchedule.length - 1 ? "bg-teal" : "bg-navy-200"
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-semibold text-navy">{phase.week}</span>
                          <span className="text-xs font-bold text-teal">{phase.dose}</span>
                        </div>
                        <p className="text-[11px] text-graphite-400">{phase.purpose}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-graphite-300">
                  Your provider adjusts dosing based on your individual response and tolerance.
                </p>
              </div>
            </AnimateOnView>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
