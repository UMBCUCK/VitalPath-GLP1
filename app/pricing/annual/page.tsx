export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Star, Shield, Clock, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { plans } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Annual Plans — Save 20%",
  description: "Switch to annual billing and save 20% on your VitalPath membership. Same premium care, better value.",
};

export default function AnnualPricingPage() {
  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="gold" className="mb-6 gap-1.5">
            <DollarSign className="h-3.5 w-3.5" /> Save 20%
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Commit to your goals. Save on your plan.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Annual members save 20% and get locked-in pricing. Same provider-guided care, same tools, better value.
          </p>
        </SectionShell>
      </section>

      {/* Plan comparison: monthly vs annual */}
      <section className="py-16">
        <SectionShell>
          <SectionHeading eyebrow="Compare" title="Monthly vs. Annual" />
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const annualTotal = Math.round(plan.priceMonthly * 12 * 0.8);
              const annualPerMonth = Math.round(annualTotal / 12);
              const savings = plan.priceMonthly * 12 - annualTotal;

              return (
                <Card key={plan.id} className={plan.highlighted ? "border-teal ring-1 ring-teal/20 shadow-glow" : ""}>
                  <CardContent className="p-6">
                    {plan.badge && (
                      <Badge variant="gold" className="mb-3">{plan.badge}</Badge>
                    )}
                    <h3 className="text-xl font-bold text-navy">{plan.name}</h3>

                    {/* Monthly price */}
                    <div className="mt-4 rounded-xl bg-navy-50/50 p-4">
                      <p className="text-xs font-medium text-graphite-400 uppercase">Monthly</p>
                      <p className="mt-1 text-2xl font-bold text-graphite-400 line-through">{formatPrice(plan.priceMonthly)}/mo</p>
                    </div>

                    {/* Annual price */}
                    <div className="mt-3 rounded-xl bg-gradient-to-r from-gold-50 to-linen border border-gold-200/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gold-700 uppercase">Annual</p>
                        <Badge variant="gold" className="text-[10px]">Save {formatPrice(savings)}/yr</Badge>
                      </div>
                      <p className="mt-1 text-3xl font-bold text-navy">{formatPrice(annualPerMonth)}/mo</p>
                      <p className="text-xs text-graphite-400">Billed {formatPrice(annualTotal)}/year</p>
                    </div>

                    <ul className="mt-4 space-y-2">
                      {plan.features.slice(0, 5).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-graphite-600">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />{f}
                        </li>
                      ))}
                    </ul>

                    <Link href={`/checkout?plan=${plan.slug}&interval=annual`} className="mt-6 block">
                      <Button variant={plan.highlighted ? "default" : "outline"} size="lg" className="w-full gap-2">
                        Start Annual Plan <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </SectionShell>
      </section>

      {/* Why annual */}
      <section className="bg-premium-gradient py-16">
        <SectionShell>
          <SectionHeading eyebrow="Why Annual?" title="Built for members who are serious about results" />
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: DollarSign, title: "Save 20% instantly", description: "Lower your monthly cost immediately. The savings add up to hundreds of dollars over the year." },
              { icon: Calendar, title: "Locked-in pricing", description: "Your rate is guaranteed for 12 months. No price increases, no surprises." },
              { icon: Shield, title: "Full commitment support", description: "Annual members get priority support and early access to new features and program expansions." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6">
                  <item.icon className="h-6 w-6 text-teal" />
                  <h3 className="mt-3 text-base font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm text-graphite-500">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Testimonial */}
      <section className="py-16">
        <SectionShell className="max-w-2xl text-center">
          <div className="flex justify-center gap-0.5 mb-4">
            {[1,2,3,4,5].map((i) => <Star key={i} className="h-5 w-5 fill-gold text-gold" />)}
          </div>
          <blockquote className="text-lg leading-relaxed text-graphite-600">
            &ldquo;Switching to annual was the best decision. Not just for the savings — it was a commitment to myself that I was taking this seriously. Eight months in and I haven&apos;t looked back.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-semibold text-navy">Morgan L.</p>
          <p className="text-xs text-graphite-400">Complete member, 8 months</p>
          <p className="mt-2 text-[10px] text-graphite-300">Individual experience. Results vary.</p>
        </SectionShell>
      </section>

      {/* FAQ */}
      <section className="bg-navy-gradient py-16">
        <SectionShell className="max-w-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Annual plan questions</h2>
          <div className="space-y-4">
            {[
              { q: "Can I cancel an annual plan?", a: "Yes. Annual plans can be canceled anytime. You'll retain access through the end of your paid period. Partial refunds are available within the first 30 days." },
              { q: "Can I upgrade mid-year?", a: "Absolutely. You can upgrade from Essential to Premium or Complete at any time. We'll prorate the difference." },
              { q: "What if I need to pause?", a: "Annual members can pause for up to 3 months. Your billing extends by the paused period." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl bg-white/5 border border-white/10 p-5">
                <p className="text-sm font-semibold text-white">{faq.q}</p>
                <p className="mt-2 text-sm text-navy-300">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/checkout?plan=premium&interval=annual">
              <Button size="xl" variant="gold" className="gap-2">
                Start Your Annual Plan <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
