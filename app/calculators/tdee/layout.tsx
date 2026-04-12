import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free TDEE Calculator — Total Daily Energy Expenditure for Weight Loss (2026)",
  description:
    "Calculate your TDEE using the Mifflin-St Jeor equation. Get your maintenance calories, weight loss target, and how GLP-1 medication changes your caloric needs. Free and private.",
  openGraph: {
    title: "TDEE Calculator — How Many Calories Do You Burn? | Nature's Journey",
    description:
      "Calculate your Total Daily Energy Expenditure. Get maintenance, weight loss, and weight gain calorie targets based on your body and activity level.",
  },
};

const faqs = [
  {
    question: "What is TDEE and why does it matter for weight loss?",
    answer: "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, accounting for your basal metabolic rate (BMR) and activity level. To lose weight, you need to consume fewer calories than your TDEE. A deficit of 500 calories per day produces approximately 1 lb of fat loss per week under normal circumstances.",
  },
  {
    question: "Does GLP-1 medication change my TDEE?",
    answer: "GLP-1 medications primarily reduce appetite and food intake rather than directly increasing calorie burn. However, the weight loss they produce does increase TDEE over time — a larger body burns more calories at rest. Research suggests GLP-1 users also tend to be more physically active as energy improves, further increasing TDEE. Your TDEE calculator result will shift downward as you lose weight, so recalculate every 10–15 lbs.",
  },
  {
    question: "How accurate is the Mifflin-St Jeor equation?",
    answer: "Mifflin-St Jeor is considered the most accurate BMR formula for most adults, with studies showing it estimates BMR within 10% for approximately 80% of people. It is more accurate than the older Harris-Benedict formula. Individual variation exists — those with higher muscle mass will have a higher actual TDEE than the formula suggests, and those with metabolic conditions may have a lower one.",
  },
  {
    question: "What calorie deficit is safe during GLP-1 treatment?",
    answer: "Most clinical guidelines recommend a deficit of 500–750 calories per day for sustainable fat loss (1–1.5 lbs/week). On GLP-1 medication, appetite reduction naturally creates a deficit — many patients should focus on eating adequate protein (0.7–1g/lb body weight) rather than aggressively restricting calories further. Eating too little can accelerate muscle loss.",
  },
];

export default function TDEELayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/calculators" },
          { name: "TDEE Calculator", href: "/calculators/tdee" },
        ]}
      />
      {children}

      {/* FAQ section */}
      <section className="py-14 bg-cloud/40 border-t border-sage/20">
        <SectionShell className="max-w-3xl">
          <h2 className="text-xl font-bold text-navy mb-2">TDEE & calorie questions — FAQ</h2>
          <p className="text-sm text-graphite-500 mb-6">How calorie needs change during GLP-1 treatment</p>
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
            <Link href="/calculators/protein" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              Protein calculator <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/blog/what-to-eat-on-semaglutide" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              What to eat on semaglutide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/calculators/bmi" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              BMI calculator <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
