import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free Hydration Calculator — Daily Water Intake on GLP-1 Medication (2026)",
  description:
    "Calculate your optimal daily water intake. Hydration is especially critical during GLP-1 treatment — reduced appetite can cause under-drinking. Get your daily oz target and hourly schedule.",
  openGraph: {
    title: "Hydration Calculator — How Much Water Should You Drink? | Nature's Journey",
    description:
      "Calculate your daily water goal in ounces, glasses, and liters. Get a time-of-day hydration schedule for optimal results.",
  },
};

const faqs = [
  {
    question: "Why is hydration especially important on semaglutide or tirzepatide?",
    answer: "GLP-1 medications reduce appetite and the desire to eat — but they can also reduce the urge to drink fluids. Nausea and vomiting (common early side effects) further increase fluid loss. Dehydration during GLP-1 treatment can worsen side effects, reduce kidney function (especially in older adults or those with CKD), cause headaches and dizziness, and reduce the effectiveness of treatment. Many providers recommend setting water intake reminders, particularly in the first 8 weeks of treatment.",
  },
  {
    question: "How much water should I drink per day on GLP-1?",
    answer: "General guidelines recommend 8–10 cups (64–80 oz) per day for most adults, but this should be adjusted for body weight, activity level, and climate. A common formula is 0.5 oz per pound of body weight. On GLP-1 medication, aim for the higher end of your target range, especially during dose titration when nausea is most likely.",
  },
  {
    question: "Does coffee or tea count toward hydration?",
    answer: "Yes — moderate coffee and tea consumption (up to 3–4 cups per day) counts toward total fluid intake. Caffeine has a mild diuretic effect, but the fluid content outweighs the diuretic effect at typical consumption levels. Sugary drinks, alcohol, and energy drinks should not be used to meet hydration targets as they have other metabolic effects.",
  },
  {
    question: "What are signs of dehydration during GLP-1 treatment?",
    answer: "Watch for: dark yellow urine (aim for pale yellow), dry mouth, headaches, dizziness when standing, fatigue, constipation, or muscle cramps. Severe dehydration signs (confusion, rapid heartbeat, very dark urine) warrant immediate medical attention. If nausea is preventing adequate fluid intake, contact your provider — anti-nausea medications and IV fluids may be needed.",
  },
];

export default function HydrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/calculators" },
          { name: "Hydration Calculator", href: "/calculators/hydration" },
        ]}
      />
      {children}

      {/* FAQ section */}
      <section className="py-14 bg-cloud/40 border-t border-sage/20">
        <SectionShell className="max-w-3xl">
          <h2 className="text-xl font-bold text-navy mb-2">Hydration on GLP-1 medication — FAQ</h2>
          <p className="text-sm text-graphite-500 mb-6">Why staying hydrated is critical during semaglutide or tirzepatide treatment</p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-navy-100/40 bg-white open:shadow-premium transition-all">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-navy list-none">
                  {faq.question}
                  <ArrowRight className="h-4 w-4 shrink-0 text-graphite-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-graphite-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blog/hydration-guide" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              Full hydration guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/blog/managing-side-effects" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              Managing GLP-1 side effects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/calculators/protein" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              Protein calculator <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
