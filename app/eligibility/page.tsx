export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Stethoscope, AlertTriangle, Heart, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/marketing/cta-section";
import { siteConfig } from "@/lib/site";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "GLP-1 Eligibility Criteria | Who May Qualify for Treatment?",
  description: "Learn about the clinical criteria for GLP-1 weight management treatment. Eligibility is determined by a licensed medical provider based on your health history. Take our free 2-minute assessment.",
  openGraph: {
    title: "GLP-1 Eligibility Criteria | Who May Qualify for Treatment?",
    description: "Learn who may be a candidate for provider-guided GLP-1 weight management. Eligibility is always determined by a licensed provider. Find out in 2 minutes.",
  },
};

export default function EligibilityPage() {
  return (
    <MarketingShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Eligibility", href: "/eligibility" },
        ]}
      />
      <FAQPageJsonLd faqs={[
        { question: "What BMI do you need to qualify for GLP-1 medication?", answer: "Clinical guidelines for GLP-1 medications generally cover adults with a BMI of 30 or higher, or BMI 27 or higher with at least one weight-related health condition such as type 2 diabetes, prediabetes, hypertension, or sleep apnea. Eligibility is always determined by a licensed provider based on a complete health evaluation." },
        { question: "Do I need to visit a doctor in person to get a GLP-1 prescription?", answer: "No. Nature's Journey uses a telehealth model — you complete an online medical intake, and a licensed provider reviews your health history and determines eligibility remotely. No in-person appointment required." },
        { question: "What conditions disqualify you from GLP-1 treatment?", answer: "Contraindications include a personal or family history of medullary thyroid carcinoma (MTC), Multiple Endocrine Neoplasia syndrome type 2 (MEN 2), active pancreatitis, or pregnancy. Your provider will screen for all contraindications during intake." },
        { question: "How quickly can I get approved for GLP-1 treatment?", answer: "Most patients receive a provider decision within 1 business day of completing the online intake. If approved, medication typically ships within 2-3 business days." },
      ]} />
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <Stethoscope className="h-3.5 w-3.5" /> Provider-Determined Eligibility
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Who qualifies for treatment?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Treatment eligibility is always determined by a licensed medical provider. Here's what the evaluation considers.
          </p>
        </SectionShell>
      </section>

      <section className="py-16">
        <SectionShell>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* May qualify */}
            <Card className="border-teal/20 bg-teal-50/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-5 w-5 text-teal" />
                  <h2 className="text-lg font-bold text-navy">You may be eligible if</h2>
                </div>
                <ul className="space-y-3">
                  {[
                    "You are an adult (18+) with a BMI of 27 or higher with at least one weight-related condition, or a BMI of 30 or higher",
                    "You have tried diet and exercise and are looking for additional medical support",
                    "You live in a state where our telehealth services are available",
                    "You are not currently pregnant or planning to become pregnant",
                    "You do not have a personal or family history of medullary thyroid carcinoma",
                    "You do not have Multiple Endocrine Neoplasia syndrome type 2 (MEN2)",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      <span className="text-sm text-graphite-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* May not qualify */}
            <Card className="border-amber-200/40 bg-amber-50/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-bold text-navy">You may not be eligible if</h2>
                </div>
                <ul className="space-y-3">
                  {[
                    "You have a personal or family history of medullary thyroid carcinoma (MTC)",
                    "You have Multiple Endocrine Neoplasia syndrome type 2 (MEN2)",
                    "You are pregnant, planning to become pregnant, or breastfeeding",
                    "You have a history of pancreatitis",
                    "You have a BMI under 27 without weight-related health conditions",
                    "You are under 18 years of age",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <span className="text-sm text-graphite-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </SectionShell>
      </section>

      <section className="bg-premium-gradient py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Important to Understand"
            title="How the evaluation works"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Stethoscope, title: "Provider evaluation", description: "A licensed medical provider reviews your complete health profile, medical history, current medications, and goals to determine if GLP-1 medication is clinically appropriate." },
              { icon: ShieldCheck, title: "Not everyone qualifies", description: "This is by design. Responsible prescribing means some patients are not good candidates for medication-based treatment. Your provider follows established clinical guidelines." },
              { icon: Heart, title: "Alternative paths", description: "If you're not eligible for medication, your provider will discuss alternative approaches. We offer nutrition-focused programs, coaching, and lifestyle tools." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-6">
                  <item.icon className="h-6 w-6 text-teal" />
                  <h3 className="mt-3 text-base font-bold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-500">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      <section className="py-16">
        <SectionShell className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-navy">Not sure if you qualify?</h2>
          <p className="mt-4 text-graphite-500">
            Adults with a BMI of 27+ and a weight-related condition, or a BMI of 30+, often meet the clinical criteria. A licensed provider will review your full health profile to determine eligibility.
          </p>
          <div className="mt-6 mx-auto max-w-sm rounded-xl bg-teal-50/50 border border-teal-100 p-4">
            <p className="text-sm text-graphite-600">
              Adults with a BMI of 27+ and a weight-related health condition, or a BMI of 30+, often meet the clinical criteria used by providers. <span className="font-medium text-navy">Final eligibility is always determined by your licensed provider.</span>
            </p>
          </div>
          <div className="mt-6">
            <Link href="/qualify">
              <Button size="xl" className="gap-2">Take the Assessment <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <p className="mt-6 text-xs text-graphite-300">{siteConfig.compliance.eligibilityDisclaimer}</p>
        </SectionShell>
      </section>

      {/* Related resources */}
      <section className="py-12">
        <SectionShell>
          <h2 className="text-lg font-bold text-navy mb-4">Learn more</h2>
          <div className="flex flex-wrap gap-3 text-xs">
            <Link href="/medications" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              GLP-1 medications guide →
            </Link>
            <Link href="/calculators/bmi" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              BMI calculator →
            </Link>
            <Link href="/blog/how-to-get-glp1-without-insurance" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Cost without insurance →
            </Link>
            <Link href="/guide" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Complete GLP-1 guide →
            </Link>
            <Link href="/blog/managing-side-effects" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">
              Side effects guide →
            </Link>
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
