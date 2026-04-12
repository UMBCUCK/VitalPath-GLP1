import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, RefreshCw, HeartHandshake, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { AnimateOnView } from "@/components/shared/animate-on-view";
import { guaranteeImage } from "@/lib/images";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Satisfaction Promise",
    description:
      "If you're not seeing results within 90 days of following your treatment plan, we'll work with your provider to adjust your plan at no additional cost.",
  },
  {
    icon: RefreshCw,
    title: "Cancel Anytime",
    description:
      "No contracts, no cancellation fees, no hidden charges. Pause or cancel your subscription from your dashboard in two clicks.",
  },
  {
    icon: HeartHandshake,
    title: "Care Team Support",
    description:
      "Questions or concerns? Your care team responds within hours, not days. Real people who know your name and your health goals.",
  },
  {
    icon: Clock,
    title: "Fast Start Guarantee",
    description:
      "Get evaluated within 24 hours of completing your intake on business days. If prescribed, medication ships the same business day with free 2-day delivery.",
  },
];

export function GuaranteeSection() {
  return (
    <section className="py-16 lg:py-20">
      <SectionShell>
        <AnimateOnView>
          <div className="overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/30 via-white to-sage/20">
            {/* Care team photo banner */}
            <div className="relative h-48 w-full sm:h-56">
              <Image
                src={guaranteeImage.src}
                alt={guaranteeImage.alt}
                fill
                className="object-cover"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={guaranteeImage.blurDataURL}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-premium-lg">
                  <ShieldCheck className="h-7 w-7 text-teal" />
                </div>
              </div>
            </div>

            <div className="p-8 sm:p-12">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                  Our promise to you
                </h2>
                <p className="mt-2 text-base text-graphite-500">
                  We&apos;re confident this works. That&apos;s why we make it risk-free to start.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {guarantees.map((g) => (
                  <div key={g.title} className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-premium">
                      <g.icon className="h-6 w-6 text-teal" />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-navy">{g.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-graphite-500">
                      {g.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link href="/qualify">
                  <Button size="lg" className="gap-2">
                    Start Risk-Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="mt-2 text-xs text-graphite-400">Free assessment &middot; No commitment &middot; Cancel anytime</p>
              </div>
            </div>
          </div>
        </AnimateOnView>
      </SectionShell>
    </section>
  );
}
