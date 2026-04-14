"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { plans } from "@/lib/pricing";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

/* ─── Animated Counter ─────────────────────────────────────── */

export function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const num = parseFloat(target.replace(/[^0-9.]/g, ""));
          const hasPlus = target.includes("+");
          const hasComma = target.includes(",");
          const isPercent = target.includes("%");
          const duration = 1500;
          const steps = 40;
          const stepDuration = duration / steps;
          let step = 0;

          const interval = setInterval(() => {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3);
            let current = Math.round(num * eased * 10) / 10;
            if (num >= 100) current = Math.round(current);

            let formatted = hasComma
              ? current.toLocaleString()
              : num < 10
                ? current.toFixed(1)
                : String(Math.round(current));

            if (isPercent) formatted += "%";
            if (hasPlus) formatted += "+";
            formatted += suffix;
            setDisplay(formatted);

            if (step >= steps) {
              clearInterval(interval);
              setDisplay(target + suffix);
            }
          }, stepDuration);
        }
      },
      { rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <span ref={ref}>{display}</span>;
}

/* ─── Weekly Starters (Women) ──────────────────────────────── */

export function WomenWeeklyStarters() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const seeded = 47 + ((dayOfYear * 37 + 13) % 45);
    setCount(seeded);
  }, []);

  if (count === null) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-graphite-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-pink-500" />
      </span>
      <span><strong className="text-navy">{count} women</strong> started treatment this week</span>
    </div>
  );
}

/* ─── FAQ Accordion ────────────────────────────────────────── */

interface FaqItem {
  question: string;
  answer: string;
}

export function WomenFaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-2xl border border-navy-100/40 bg-white overflow-hidden transition-all"
        >
          <button
            onClick={() => {
              const isOpening = openIndex !== i;
              setOpenIndex(isOpening ? i : null);
              if (isOpening) {
                track(ANALYTICS_EVENTS.FAQ_EXPAND, { question: faq.question, page: "women_weight_loss" });
              }
            }}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="text-sm font-semibold text-navy pr-4">{faq.question}</span>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-graphite-400 transition-transform duration-200", openIndex === i && "rotate-180")} />
          </button>
          <div className={cn("grid transition-all duration-200", openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
              <p className="px-5 pb-4 text-sm text-graphite-500 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Pricing Toggle Section ───────────────────────────────── */

function DailyCost({ cents }: { cents: number }) {
  const daily = (cents / 100 / 30).toFixed(2);
  return <span className="text-sm text-graphite-400">Just ${daily}/day</span>;
}

export function WomenPricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <div>
      {/* Billing toggle */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-navy-100/60 bg-white p-1.5 shadow-sm">
          <button
            onClick={() => setAnnual(false)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
              !annual ? "bg-navy text-white shadow-sm" : "text-graphite-500 hover:text-navy"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={cn(
              "relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
              annual ? "bg-navy text-white shadow-sm" : "text-graphite-500 hover:text-navy"
            )}
          >
            Annual
            <span className="absolute -top-2 -right-2 flex h-5 items-center rounded-full bg-pink-500 px-2 text-[10px] font-bold text-white">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Retail anchor */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-pink-200 bg-pink-50/50 px-6 py-3">
          <Flame className="h-5 w-5 text-pink-500" />
          <span className="text-sm text-graphite-600">
            Brand-name GLP-1 retail:{" "}
            <span className="font-bold text-graphite-400 line-through">$1,349+/mo*</span>
            {" "}&rarr;{" "}
            Nature&apos;s Journey from{" "}
            <span className="font-bold text-pink-600">{annual ? "$223/mo" : "$279/mo"}</span>
          </span>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const monthlyEquivalent = annual && plan.priceAnnual
            ? Math.round(plan.priceAnnual / 12)
            : plan.priceMonthly;
          const annualSavings = annual && plan.priceAnnual
            ? plan.priceMonthly * 12 - plan.priceAnnual
            : 0;

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex h-full flex-col transition-all duration-300",
                plan.highlighted && "border-pink-400 ring-2 ring-pink-200 shadow-lg scale-[1.02] lg:scale-105"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-pink-500 text-white shadow-lg">{plan.badge}</Badge>
                </div>
              )}
              <CardHeader className={cn(plan.badge && "pt-8")}>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-navy">{formatPrice(monthlyEquivalent)}</span>
                    <span className="text-sm text-graphite-400">/month</span>
                  </div>
                  {annual && annualSavings > 0 ? (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-graphite-400 line-through">{formatPrice(plan.priceMonthly)}/mo</span>
                      <Badge className="bg-pink-100 text-pink-700 text-[10px]">Save {formatPrice(annualSavings)}/year</Badge>
                    </div>
                  ) : (
                    <DailyCost cents={monthlyEquivalent} />
                  )}
                  {annual && plan.priceAnnual && (
                    <p className="mt-1 text-xs text-graphite-400">Billed as {formatPrice(plan.priceAnnual)}/year</p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4 rounded-lg bg-pink-50/60 border border-pink-100 px-3 py-2">
                  <p className="text-xs font-semibold text-pink-700">
                    Includes provider evaluation + GLP-1 medication (if prescribed) + ongoing support
                  </p>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
                      <span className="text-sm text-graphite-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Link
                  href={`/qualify?plan=${plan.slug}`}
                  className="w-full"
                  onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { cta: `pricing_${plan.slug}`, location: "women_wl_pricing" })}
                >
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                    className={cn("w-full gap-2", plan.highlighted && "bg-pink-500 hover:bg-pink-600")}
                  >
                    {plan.highlighted ? "See If I'm Eligible" : "Get Started"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-center text-graphite-400">Cancel anytime &middot; No hidden fees</p>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Disclaimers */}
      <p className="mt-8 text-center text-xs text-graphite-400">
        All plans include a licensed provider evaluation. Treatment eligibility is determined by your provider.
        Medication is only available to eligible patients. Cancel or adjust anytime.
      </p>
      <p className="mt-2 text-center text-xs text-graphite-400">
        Membership fees cover the program, provider evaluation, and care team access. <strong>Medication pricing is separate</strong> and determined at the time of prescribing based on dose, formulation, and pharmacy.
      </p>
      <p className="mt-2 text-center text-[10px] text-graphite-300">
        *Brand-name retail price based on published U.S. cash-pay pricing for FDA-approved GLP-1 medications as of 2025. Prices vary by pharmacy and location. Compounded medications are not FDA-approved drug products.
      </p>
    </div>
  );
}

/* ─── Tracked CTA Button ───────────────────────────────────── */

export function TrackedCta({ location, label = "See If I'm Eligible", href = "/qualify", variant = "default", className }: {
  location: string;
  label?: string;
  href?: string;
  variant?: "default" | "outline";
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={() => track(ANALYTICS_EVENTS.CTA_CLICK, { cta: "qualify", location })}
    >
      <Button
        size="xl"
        variant={variant}
        className={cn("gap-2 px-12 h-16 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]", className)}
      >
        {label} <ArrowRight className="h-5 w-5" />
      </Button>
    </Link>
  );
}
