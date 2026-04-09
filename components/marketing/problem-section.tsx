import Link from "next/link";
import Image from "next/image";
import { Brain, TrendingDown, DollarSign, ArrowRight } from "lucide-react";
import { problemPoints } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { problemImage } from "@/lib/images";

const iconMap = { Brain, TrendingDown, DollarSign } as const;

export function ProblemSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-linen/50">
      <SectionShell>
        <SectionHeading
          eyebrow="The Real Problem"
          title="It's not your fault. Diets are designed to fail."
          description="Your body has powerful biological systems that fight weight loss. Understanding why is the first step to finally overcoming it."
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {problemPoints.map((point, i) => {
            const Icon = iconMap[point.icon as keyof typeof iconMap];
            return (
              <AnimateOnView key={point.title} delay={i * 0.12}>
                <div className="group relative rounded-2xl border border-red-100/60 bg-white p-8 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-0.5">
                  {/* Red accent top border */}
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-red-400 to-red-300" />

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                    <Icon className="h-7 w-7 text-red-500" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-navy">{point.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-graphite-500">
                    {point.description}
                  </p>
                </div>
              </AnimateOnView>
            );
          })}
        </div>

        {/* Transition statement with image */}
        <AnimateOnView className="mt-16" delay={0.4}>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/50">
            <div className="grid items-center md:grid-cols-5">
              {/* Image */}
              <div className="relative hidden h-full min-h-[200px] md:col-span-2 md:block">
                <Image
                  src={problemImage.src}
                  alt={problemImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 0px, 40vw"
                  placeholder="blur"
                  blurDataURL={problemImage.blurDataURL}
                />
              </div>
              {/* Text */}
              <div className="p-8 text-center md:col-span-3 md:text-left">
                <p className="text-xl font-bold text-navy">
                  But there&apos;s a breakthrough.
                </p>
                <p className="mt-2 text-base text-graphite-500">
                  GLP-1 medications work with your biology to reduce hunger at the source &mdash;
                  giving you the advantage that diets and willpower alone never could.
                </p>
                <p className="mt-3 text-sm font-semibold text-teal">
                  Clinical trials show 15-20% body weight loss &mdash; that&apos;s 25-50 lbs for most patients.
                </p>
                <Link href="/quiz" className="mt-4 inline-block">
                  <Button size="sm" className="gap-1.5">
                    See If You Qualify <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
