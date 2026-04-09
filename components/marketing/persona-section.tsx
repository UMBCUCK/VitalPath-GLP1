import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { cn } from "@/lib/utils";
import { personaImages } from "@/lib/images";

const personas = [
  {
    title: "The serial dieter",
    description: "You've tried keto, WW, Noom, intermittent fasting — maybe all of them. You lose 10-15 lbs then gain it all back. You're not lacking discipline. Your biology is fighting you.",
    signals: [
      "Tried 3+ diets in the past 5 years",
      "Lost weight then gained it back every time",
      "Feel like you have no willpower around food",
      "Think about food constantly throughout the day",
    ],
    color: "from-teal-50 to-sage/30",
    borderColor: "border-teal-100",
  },
  {
    title: "The health-motivated",
    description: "Your doctor mentioned your A1C, blood pressure, or cholesterol. You know the weight needs to come off for health reasons, not just aesthetics. You need something that works.",
    signals: [
      "BMI of 30+ or weight-related health conditions",
      "Doctor recommended weight loss",
      "Pre-diabetic, high blood pressure, or high cholesterol",
      "Family history of obesity or metabolic conditions",
    ],
    color: "from-atlantic/5 to-navy-50",
    borderColor: "border-atlantic/20",
  },
  {
    title: "The busy professional",
    description: "You don't have time for elaborate meal prep, gym routines, or weekly in-person appointments. You need something that works with your schedule, not against it.",
    signals: [
      "Work 50+ hours a week or travel frequently",
      "Can't commit to regular gym or classes",
      "Eating decisions driven by convenience, not planning",
      "Want results without overhauling your entire lifestyle",
    ],
    color: "from-gold-50 to-linen",
    borderColor: "border-gold-200",
  },
];

export function PersonaSection() {
  return (
    <section className="py-20 lg:py-28">
      <SectionShell>
        <SectionHeading
          eyebrow="Is This You?"
          title="VitalPath was built for people who've tried everything"
          description="If any of these sound familiar, you're exactly who this program is designed for."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {personas.map((persona, i) => (
            <AnimateOnView key={persona.title} delay={i * 0.1}>
              <div className={cn(
                "flex h-full flex-col rounded-2xl border bg-gradient-to-br p-6 shadow-premium transition-all duration-300 hover:shadow-premium-lg sm:p-8",
                persona.color,
                persona.borderColor,
              )}>
                {personaImages[i] && (
                  <div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-premium">
                    <Image src={personaImages[i].src} alt={personaImages[i].alt} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-navy">{persona.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-graphite-500">
                  {persona.description}
                </p>

                <div className="mt-5 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400 mb-3">
                    Sound familiar?
                  </p>
                  <ul className="space-y-2">
                    {persona.signals.map((signal) => (
                      <li key={signal} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                        <span className="text-sm text-graphite-600">{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/quiz" className="mt-6">
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    That&apos;s me — check eligibility
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </AnimateOnView>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
