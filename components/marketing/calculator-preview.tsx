import Link from "next/link";
import { ArrowRight, Calculator, Droplets, Flame, Target } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { Button } from "@/components/ui/button";

const calculators = [
  {
    icon: Calculator,
    title: "BMI Calculator",
    description: "Understand where you stand with a quick body mass index check.",
    href: "/calculators/bmi",
    color: "from-teal-50 to-sage",
    iconColor: "text-teal",
  },
  {
    icon: Flame,
    title: "TDEE Calculator",
    description: "Learn how many calories your body burns daily to plan effectively.",
    href: "/calculators/tdee",
    color: "from-gold-50 to-linen",
    iconColor: "text-gold-600",
  },
  {
    icon: Target,
    title: "Protein Calculator",
    description: "Find your ideal daily protein intake based on your activity and goals.",
    href: "/calculators/protein",
    color: "from-atlantic/5 to-navy-50",
    iconColor: "text-atlantic",
  },
  {
    icon: Droplets,
    title: "Hydration Calculator",
    description: "Calculate your optimal daily water intake for better energy and recovery.",
    href: "/calculators/hydration",
    color: "from-blue-50 to-teal-50",
    iconColor: "text-blue-500",
  },
];

export function CalculatorPreview() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <SectionShell>
        <SectionHeading
          eyebrow="Health Tools"
          title="Free calculators to support your journey"
          description="Evidence-based tools to help you understand your body and make informed decisions."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {calculators.map((calc, i) => (
            <AnimateOnView
              key={calc.title}
              delay={i * 0.08}
            >
              <Link
                href={calc.href}
                className="group flex flex-col rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-0.5"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${calc.color}`}>
                  <calc.icon className={`h-5 w-5 ${calc.iconColor}`} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-navy">{calc.title}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-graphite-400">
                  {calc.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-teal opacity-0 transition-opacity group-hover:opacity-100">
                  Try it <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </AnimateOnView>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/calculators">
            <Button variant="outline" className="gap-2">
              View All Calculators
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionShell>
    </section>
  );
}
