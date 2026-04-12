import Image from "next/image";
import { ArrowRight, Clock, Shield, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { TrackedLink } from "@/components/shared/tracked-link";
import { siteConfig } from "@/lib/site";
import { ctaBackgroundImage } from "@/lib/images";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-navy-gradient py-20 lg:py-28">
      {/* Background image with dark overlay */}
      <Image
        src={ctaBackgroundImage.src}
        alt={ctaBackgroundImage.alt}
        fill
        className="object-cover opacity-15"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={ctaBackgroundImage.blurDataURL}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy/90" />

      <SectionShell className="relative z-10 text-center">
        {/* Urgency — health-based, not fake scarcity */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-2">
          <Clock className="h-4 w-4 text-gold" />
          <span className="text-sm font-semibold text-gold">
            Same-day provider evaluations available
          </span>
        </div>

        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Every month you wait costs you
          <br />
          <span className="bg-gradient-to-r from-teal-300 to-teal-100 bg-clip-text text-transparent">
            another month of results
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-navy-300">
          Your biology won&apos;t change on its own. Take the first step today &mdash;
          a free, private assessment takes just 2 minutes.
        </p>

        {/* Main CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <TrackedLink href="/qualify" cta="final_cta_qualify" location="cta_section">
            <Button size="xl" variant="gold" className="gap-2 px-12 h-16 text-lg rounded-2xl shadow-gold-glow hover:shadow-premium-lg transition-all duration-300 hover:scale-[1.02]">
              See If I Qualify
              <ArrowRight className="h-5 w-5" />
            </Button>
          </TrackedLink>
          <TrackedLink href="/pricing" cta="final_cta_pricing" location="cta_section">
            <Button size="xl" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              View Plans & Pricing
            </Button>
          </TrackedLink>
        </div>

        <p className="mt-4 text-sm text-navy-400">
          Join <span className="font-semibold text-white">18,000+</span> members already on their journey
        </p>

        {/* Trust reinforcement */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-navy-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> 30-day money-back guarantee
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-teal-400" /> No commitment required
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-teal-400" /> Free to start
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-teal-400" /> HIPAA protected
          </span>
        </div>

        {/* Price reminder */}
        <div className="mt-10 mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <p className="text-sm text-white/70">Plans starting at</p>
          <p className="text-3xl font-bold text-white">
            $279<span className="text-lg font-normal text-white/50">/month</span>
          </p>
          <p className="mt-1 text-sm text-white/40 line-through">$1,349/mo brand-name retail</p>
          <p className="mt-2 text-xs text-teal-300 font-semibold">Save up to 79%</p>
        </div>

        <p className="mt-8 text-xs text-navy-600">
          {siteConfig.compliance.eligibilityDisclaimer}
        </p>
      </SectionShell>
    </section>
  );
}
