import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Beaker, Zap, TrendingDown, DollarSign, Syringe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { medications } from "@/lib/medications";
import { medicationShowcaseImages } from "@/lib/images";
import { cn } from "@/lib/utils";

const medicationCards = [
  {
    data: medications[0], // Semaglutide
    image: medicationShowcaseImages.semaglutide,
    accentColor: "teal",
    badge: "Most Popular",
    badgeVariant: "success" as const,
    highlights: [
      { icon: TrendingDown, label: "15-16% avg weight loss" },
      { icon: Beaker, label: "Extensive STEP trial data" },
      { icon: Syringe, label: "Once-weekly injection" },
    ],
    gradient: "from-teal-50 to-sage/20",
    borderColor: "border-teal-100",
    iconBg: "bg-teal-50",
    iconColor: "text-teal",
    statColor: "text-teal",
  },
  {
    data: medications[1], // Tirzepatide
    image: medicationShowcaseImages.tirzepatide,
    accentColor: "atlantic",
    badge: "Strongest Results",
    badgeVariant: "default" as const,
    highlights: [
      { icon: TrendingDown, label: "20-22% avg weight loss" },
      { icon: Zap, label: "Dual-action GLP-1 + GIP" },
      { icon: Syringe, label: "Once-weekly injection" },
    ],
    gradient: "from-atlantic/5 to-navy-50",
    borderColor: "border-atlantic/20",
    iconBg: "bg-atlantic/10",
    iconColor: "text-atlantic",
    statColor: "text-atlantic",
  },
];

export function MedicationShowcase() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-cloud to-white">
      <SectionShell>
        <SectionHeading
          eyebrow="GLP-1 Medications"
          title="Clinically proven medications, available for a fraction of the cost"
          description="Your provider will determine the best medication for your needs. Both contain the same FDA-approved active ingredients as leading brand-name medications."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {medicationCards.map((card, i) => (
            <AnimateOnView key={card.data.slug} delay={i * 0.15}>
              <div className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-3xl border bg-gradient-to-br shadow-premium-lg transition-all duration-300 hover:shadow-premium-xl",
                card.gradient,
                card.borderColor,
              )}>
                {/* Product image */}
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={card.image.blurDataURL}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-[1]">
                    <Badge variant={card.badgeVariant} className="text-xs shadow-md">
                      {card.badge}
                    </Badge>
                  </div>

                  {/* Price overlay */}
                  <div className="absolute bottom-4 right-4 z-[1] rounded-xl bg-white/90 backdrop-blur-sm border border-navy-100/40 px-4 py-2 shadow-premium">
                    <p className="text-[10px] text-graphite-400 line-through">{card.data.retailCost}</p>
                    <p className={cn("text-lg font-bold", card.statColor)}>
                      {card.data.vitalpathCost}
                    </p>
                    <p className="text-[10px] font-semibold text-teal">Save {card.data.savings}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  {/* Title */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400">
                      Same active ingredient as
                    </p>
                    <h3 className="mt-1 text-2xl font-bold text-navy">
                      {card.data.brandName}
                    </h3>
                    <p className="mt-1 text-sm text-graphite-500">
                      Compounded {card.data.genericName} &middot; {card.data.manufacturer} active ingredient
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="mt-5 space-y-3">
                    {card.highlights.map((h) => (
                      <div key={h.label} className="flex items-center gap-3">
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", card.iconBg)}>
                          <h.icon className={cn("h-4 w-4", card.iconColor)} />
                        </div>
                        <span className="text-sm font-medium text-navy">{h.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key facts */}
                  <div className="mt-5 space-y-2">
                    {card.data.keyFacts.slice(0, 3).map((fact) => (
                      <div key={fact} className="flex items-start gap-2">
                        <Check className={cn("mt-0.5 h-4 w-4 shrink-0", card.iconColor)} />
                        <span className="text-xs leading-relaxed text-graphite-500">{fact}</span>
                      </div>
                    ))}
                  </div>

                  {/* Clinical data bar */}
                  <div className="mt-6 rounded-xl bg-white/80 border border-navy-100/40 p-4">
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs font-semibold text-graphite-400">Clinical weight loss</p>
                      <p className={cn("text-2xl font-bold", card.statColor)}>
                        {card.data.slug === "semaglutide" ? "15-16%" : "20-22%"}
                      </p>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-navy-100/40">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          card.data.slug === "semaglutide"
                            ? "bg-gradient-to-r from-teal to-teal-600 w-[72%]"
                            : "bg-gradient-to-r from-atlantic to-navy w-[88%]"
                        )}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-graphite-300">
                      {card.data.slug === "semaglutide" ? "STEP trials, 68 weeks" : "SURMOUNT trials, 72 weeks"}
                    </p>
                  </div>

                  {/* Side effects preview */}
                  <div className="mt-4">
                    <p className="text-[10px] text-graphite-400">
                      Common side effects: {card.data.sideEffects.slice(0, 3).map(s => s.split(" (")[0].toLowerCase()).join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnView>
          ))}
        </div>

        {/* CTA + compliance */}
        <AnimateOnView className="mt-10 text-center" delay={0.3}>
          <p className="mb-6 text-sm text-graphite-500">
            Your provider will recommend the best option based on your health profile, goals, and medical history.
          </p>
          <Link href="/quiz">
            <Button size="lg" className="gap-2">
              <DollarSign className="h-4 w-4" />
              See If You Qualify — From $279/mo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 mx-auto max-w-2xl text-[10px] text-graphite-300">
            Compounded medications are not FDA-approved. They contain the same active ingredients as brand-name
            medications and are prepared by state-licensed 503A/503B pharmacies under strict quality controls.
            Branded product names are trademarks of their respective manufacturers and are used for comparison only.
          </p>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
