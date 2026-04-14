export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { cn } from "@/lib/utils";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "GLP-1 Telehealth Availability by State | Nature's Journey",
  description: "See which states Nature's Journey GLP-1 weight loss telehealth is available in. Get semaglutide or tirzepatide prescribed online by a licensed provider in your state.",
};

// All US states with availability status
const allStates = [
  { code: "AL", name: "Alabama", available: true }, { code: "AK", name: "Alaska", available: false },
  { code: "AZ", name: "Arizona", available: true }, { code: "AR", name: "Arkansas", available: false },
  { code: "CA", name: "California", available: true }, { code: "CO", name: "Colorado", available: true },
  { code: "CT", name: "Connecticut", available: true }, { code: "DE", name: "Delaware", available: false },
  { code: "FL", name: "Florida", available: true }, { code: "GA", name: "Georgia", available: true },
  { code: "HI", name: "Hawaii", available: false }, { code: "ID", name: "Idaho", available: false },
  { code: "IL", name: "Illinois", available: true }, { code: "IN", name: "Indiana", available: true },
  { code: "IA", name: "Iowa", available: false }, { code: "KS", name: "Kansas", available: false },
  { code: "KY", name: "Kentucky", available: false }, { code: "LA", name: "Louisiana", available: false },
  { code: "ME", name: "Maine", available: false }, { code: "MD", name: "Maryland", available: true },
  { code: "MA", name: "Massachusetts", available: true }, { code: "MI", name: "Michigan", available: true },
  { code: "MN", name: "Minnesota", available: true }, { code: "MS", name: "Mississippi", available: false },
  { code: "MO", name: "Missouri", available: false }, { code: "MT", name: "Montana", available: false },
  { code: "NE", name: "Nebraska", available: false }, { code: "NV", name: "Nevada", available: true },
  { code: "NH", name: "New Hampshire", available: false }, { code: "NJ", name: "New Jersey", available: true },
  { code: "NM", name: "New Mexico", available: false }, { code: "NY", name: "New York", available: true },
  { code: "NC", name: "North Carolina", available: true }, { code: "ND", name: "North Dakota", available: false },
  { code: "OH", name: "Ohio", available: true }, { code: "OK", name: "Oklahoma", available: false },
  { code: "OR", name: "Oregon", available: true }, { code: "PA", name: "Pennsylvania", available: true },
  { code: "RI", name: "Rhode Island", available: false }, { code: "SC", name: "South Carolina", available: false },
  { code: "SD", name: "South Dakota", available: false }, { code: "TN", name: "Tennessee", available: true },
  { code: "TX", name: "Texas", available: true }, { code: "UT", name: "Utah", available: false },
  { code: "VT", name: "Vermont", available: false }, { code: "VA", name: "Virginia", available: true },
  { code: "WA", name: "Washington", available: true }, { code: "WV", name: "West Virginia", available: false },
  { code: "WI", name: "Wisconsin", available: false }, { code: "WY", name: "Wyoming", available: false },
];

const availableCount = allStates.filter((s) => s.available).length;

export default function StatesPage() {
  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={[
        { question: "Which states is GLP-1 telehealth available in?", answer: "Nature's Journey currently serves patients in over 35 states across the US. Each state requires a licensed medical provider to practice telehealth within that state. Check the map above for current availability in your state." },
        { question: "Can I get semaglutide or tirzepatide prescribed online in my state?", answer: "In states where Nature's Journey operates, you can complete your intake assessment online and receive a GLP-1 prescription from a licensed provider — no in-person appointment required. Medication ships from a licensed pharmacy directly to your door." },
        { question: "What if my state is not currently available?", answer: "We are actively expanding to new states. If your state isn't available yet, you can join the waitlist and we'll notify you as soon as we launch in your area." },
        { question: "Do I need to live in a specific city or area within my state?", answer: "No. Nature's Journey's telehealth model serves patients anywhere within a covered state, regardless of whether you're in a major city or a rural area. Medication is shipped directly to your address." },
      ]} />
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "State Availability", href: "/states" }]} />
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> Availability
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Available in {availableCount} states
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Nature's Journey telehealth services are currently available in the states listed below.
            We're expanding regularly — check back if your state isn't listed yet.
          </p>
        </SectionShell>
      </section>

      <section className="py-16">
        <SectionShell>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {allStates.map((state) => (
              <div
                key={state.code}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3 transition-all",
                  state.available
                    ? "border-teal/30 bg-teal-50/30 hover:bg-teal-50/60"
                    : "border-navy-100/40 bg-navy-50/20 opacity-50"
                )}
              >
                {state.available ? (
                  <Check className="h-4 w-4 shrink-0 text-teal" />
                ) : (
                  <Clock className="h-4 w-4 shrink-0 text-graphite-300" />
                )}
                <div className="min-w-0">
                  {state.available ? (
                    <Link href={`/states/${state.name.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-teal transition-colors">
                      <p className="text-sm font-medium truncate text-navy">{state.name}</p>
                      <p className="text-[10px] text-graphite-400">Available</p>
                    </Link>
                  ) : (
                    <>
                      <p className="text-sm font-medium truncate text-graphite-400">{state.name}</p>
                      <p className="text-[10px] text-graphite-400">Coming soon</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-graphite-400 mb-6">
              Don't see your state? We're expanding our provider network regularly.
              Enter your email and we'll notify you when we launch in your area.
            </p>
            <Link href="/qualify">
              <Button size="lg" className="gap-2">
                Check Availability <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
