import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Free Protein Calculator — Daily Protein Intake for GLP-1 Weight Loss (2026)",
  description:
    "Calculate your optimal daily protein intake based on weight, activity, and goals. Critical for preserving muscle during GLP-1 treatment. Get per-meal targets and food sources.",
  openGraph: {
    title: "Protein Calculator — How Much Protein Do You Need? | Nature's Journey",
    description:
      "Calculate your optimal daily protein range. Get per-meal targets to support lean muscle during weight loss.",
  },
};

const faqs = [
  {
    question: "How much protein do I need on semaglutide or tirzepatide?",
    answer: "During GLP-1 treatment, most clinical protocols recommend 0.7–1.0 grams of protein per pound of body weight per day (1.5–2.2g per kg). This is higher than standard dietary recommendations because: (1) you're in a caloric deficit which increases the risk of muscle loss, and (2) GLP-1 medications reduce overall appetite, making it easy to under-eat protein. Adequate protein is the single most important nutritional factor for preserving lean mass during treatment.",
  },
  {
    question: "What happens if I don't eat enough protein on GLP-1?",
    answer: "Without adequate protein, a larger proportion of weight lost comes from lean muscle rather than fat. In the STEP-1 trial, approximately 10% of total weight lost was lean mass — but this worsens significantly with low protein intake. Loss of muscle mass reduces your resting metabolic rate, making long-term weight maintenance harder. It also contributes to 'Ozempic face' — the gaunt appearance associated with rapid fat loss alongside muscle loss.",
  },
  {
    question: "What are the best high-protein foods on GLP-1 medication?",
    answer: "When appetite is reduced, protein density matters — you need to maximize protein per calorie. Top choices: Greek yogurt (17–20g per 6oz), cottage cheese (25g per cup), eggs (6g each), chicken breast (31g per 100g), salmon (20g per 3oz), tofu (10g per 100g), edamame (17g per cup), and protein shakes (20–30g per serving). Distributing protein across 3–4 meals rather than one large meal maximizes muscle protein synthesis.",
  },
  {
    question: "Should I eat more protein to preserve muscle during rapid weight loss?",
    answer: "Yes — resistance training plus high protein intake is the most evidence-supported strategy for preserving lean mass during GLP-1-assisted weight loss. A 2023 analysis found patients who maintained higher protein intake (>1.2g/kg/day) had significantly better lean mass preservation at 12 months compared to those who ate the minimum recommended amount. If you can only do one thing beyond taking your medication, prioritize protein.",
  },
];

export default function ProteinLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FAQPageJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Calculators", href: "/calculators" },
          { name: "Protein Calculator", href: "/calculators/protein" },
        ]}
      />
      {children}

      {/* FAQ section */}
      <section className="py-14 bg-cloud/40 border-t border-sage/20">
        <SectionShell className="max-w-3xl">
          <h2 className="text-xl font-bold text-navy mb-2">Protein on GLP-1 medication — FAQ</h2>
          <p className="text-sm text-graphite-500 mb-6">Why protein intake is the most critical nutritional factor during treatment</p>
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
            <Link href="/blog/protein-intake-guide" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              Full protein intake guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/blog/high-protein-recipes-appetite-changes" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              High-protein recipes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/calculators/tdee" className="inline-flex items-center gap-1.5 rounded-full border border-sage/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors">
              TDEE calculator <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </SectionShell>
      </section>
    </>
  );
}
