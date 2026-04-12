import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free BMI Calculator — Body Mass Index for GLP-1 Eligibility (2026)",
  description:
    "Calculate your BMI instantly. See your BMI category, whether you may qualify for GLP-1 weight loss treatment, and what your result means clinically. Free and private.",
  openGraph: {
    title: "BMI Calculator — Check Your Body Mass Index | Nature's Journey",
    description:
      "Calculate your BMI in seconds. Understand where you stand and whether you may qualify for provider-guided GLP-1 weight management.",
  },
};

const faqs = [
  {
    question: "What BMI qualifies for GLP-1 weight loss medication?",
    answer: "FDA-approved GLP-1 medications (Wegovy, Zepbound) are indicated for adults with a BMI of 30 or higher, or a BMI of 27 or higher with at least one weight-related health condition such as high blood pressure, type 2 diabetes, or high cholesterol. Most telehealth GLP-1 programs follow these same thresholds.",
  },
  {
    question: "Is BMI an accurate measure of health?",
    answer: "BMI is a useful screening tool but has limitations — it does not account for muscle mass, bone density, age, sex, or fat distribution. A person with high muscle mass may have an 'overweight' BMI without excess fat. For clinical decisions, providers consider BMI alongside waist circumference, metabolic markers, and overall health history.",
  },
  {
    question: "What is a healthy BMI range?",
    answer: "The CDC defines BMI ranges as: Underweight (below 18.5), Normal weight (18.5–24.9), Overweight (25–29.9), Obesity Class I (30–34.9), Obesity Class II (35–39.9), Obesity Class III (40+). For GLP-1 eligibility, BMI 27+ with a weight-related condition, or BMI 30+ without, are the key thresholds.",
  },
  {
    question: "How is BMI calculated?",
    answer: "BMI = weight (kg) ÷ height (m)². In imperial units: BMI = (weight in lbs × 703) ÷ (height in inches)². For example, a 5'6\" person weighing 180 lbs has a BMI of approximately 29.0 — in the overweight category.",
  },
];

export default function BMILayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/calculators" },
          { name: "BMI Calculator", href: "/calculators/bmi" },
        ]}
      />
      {children}

      {/* FAQ section */}
      <section className="py-14 bg-cloud/40 border-t border-sage/20">
        <SectionShell className="max-w-3xl">
          <h2 className="text-xl font-bold text-navy mb-2">BMI & GLP-1 eligibility — FAQ</h2>
          <p className="text-sm text-graphite-500 mb-6">Common questions about what your BMI result means</p>
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
            <Link href="/eligibility" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              Full eligibility criteria <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/calculators/tdee" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              TDEE calculator <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/guide" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              Complete GLP-1 guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
