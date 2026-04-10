import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { BreadcrumbJsonLd, FAQPageJsonLd, CollectionPageJsonLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

// ─── Category metadata ─────────────────────────────────────

const categoryMeta = {
  medication: {
    eyebrow: "Medication Guides",
    title: "GLP-1 Medication: Semaglutide, Tirzepatide & How They Work",
    description: "Evidence-based guides on GLP-1 medications — dosing, side effects, what to expect, and how compounded versions compare to brand names. Written by our clinical team.",
    seoTitle: "GLP-1 Medication Guides: Semaglutide, Tirzepatide & More",
    seoDescription: "Expert guides on GLP-1 weight loss medications. Compare semaglutide vs tirzepatide, understand side effects, cost without insurance, and treatment timelines.",
    intro: `GLP-1 receptor agonists — semaglutide and tirzepatide — are the most effective weight management medications ever studied. But understanding them takes more than a drug pamphlet. This category covers the clinical science in plain language: how the mechanism works, what the STEP and SURMOUNT trials actually showed, how side effects are managed, and what patients consistently wish they'd known before starting. Whether you're deciding between semaglutide and tirzepatide, trying to understand your dosing schedule, or troubleshooting why the scale stopped moving, these guides give you the specific, honest answers that are hard to find elsewhere.`,
    faqs: [
      { question: "What's the difference between semaglutide and tirzepatide?", answer: "Semaglutide (Wegovy/Ozempic) is a GLP-1 receptor agonist — it mimics one gut hormone. Tirzepatide (Zepbound/Mounjaro) activates both GLP-1 and GIP receptors, producing larger average weight loss (21% vs 15% in clinical trials). Both are once-weekly injections. Tirzepatide is newer and typically produces better results; semaglutide has a longer safety track record." },
      { question: "How long does it take to see results?", answer: "Most patients notice appetite suppression at the 0.5mg semaglutide dose (weeks 5-8). Meaningful weight loss typically begins months 2-3. Maximum weight loss is usually seen between months 12-18 at therapeutic dosing." },
      { question: "Is compounded semaglutide as effective as Wegovy?", answer: "The active molecule is chemically identical. Effectiveness depends on source quality — compounded medication from an FDA-registered 503B outsourcing facility meets the same manufacturing standards as brand-name drugs." },
    ] as { question: string; answer: string }[],
  },
  nutrition: {
    eyebrow: "Nutrition & Recipes",
    title: "Eating Well on GLP-1 Medication: Protein, Recipes & Meal Planning",
    description: "What you eat on GLP-1 medication matters more than most people realize. These guides cover protein targets, foods to avoid, meal planning strategies, and recipes designed for reduced appetite.",
    seoTitle: "Weight Loss Nutrition: Meal Plans, Recipes & Protein Guides",
    seoDescription: "Free high-protein meal plans, GLP-1-friendly recipes, and nutrition guides. Learn what to eat during weight loss treatment for the best results.",
    intro: `GLP-1 medication changes your relationship with food in profound ways — smaller appetite, slower digestion, and different food tolerances than before. Most people don't get much nutritional guidance alongside their prescription, which is a significant gap. The research is clear: patients who maintain high protein intake (0.7-1g per pound of body weight) preserve significantly more lean mass during weight loss. The recipes and guides in this section are designed specifically for GLP-1 users — high-protein, easy to prepare in smaller portions, and chosen to minimize common GI side effects. You'll also find meal planning frameworks that work with, not against, the medication's effects on appetite and gastric motility.`,
    faqs: [
      { question: "How much protein should I eat on semaglutide?", answer: "Aim for 0.7-1 gram of protein per pound of body weight per day. This higher target (vs standard recommendations) is specifically important on GLP-1 medication because significant caloric restriction combined with lower protein accelerates muscle loss. Use a protein tracker for the first few weeks to calibrate." },
      { question: "What foods should I avoid on GLP-1 medication?", answer: "High-fat fried foods, very greasy meals, carbonated drinks, and high-sugar foods tend to worsen nausea and GI discomfort — especially in the first 2-3 months. Alcohol has unpredictable effects on blood alcohol levels due to slower gastric emptying. Spicy foods are a common trigger for reflux at higher doses." },
      { question: "Can I do intermittent fasting on semaglutide?", answer: "Yes, many patients combine IF with GLP-1 therapy. The appetite suppression from medication makes shorter eating windows more tolerable. The main caution: ensure protein targets are still met within the eating window, which requires planning." },
    ] as { question: string; answer: string }[],
  },
  lifestyle: {
    eyebrow: "Lifestyle & Habits",
    title: "Building Habits That Last: Exercise, Sleep & Long-Term Weight Management",
    description: "Medication works — but the habits built during treatment determine long-term success. These guides cover exercise protocols, sleep optimization, stress management, and the transition off medication.",
    seoTitle: "Weight Loss Lifestyle: Exercise, Habits & Maintenance Guides",
    seoDescription: "Evidence-based lifestyle guides for sustainable weight loss. Walking plans, habit building, breaking plateaus, and transitioning to long-term maintenance.",
    intro: `One of the most common questions patients ask after 6 months on GLP-1 medication: 'What happens when I stop?' The honest answer from the STEP-4 withdrawal trial is that about two-thirds of lost weight returns within a year without continuation. That data isn't a reason for despair — it's a reason to treat the treatment period as a window to build habits. The guides in this section are about what those habits look like in practice: how much resistance training matters (a lot), why sleep quality directly affects hunger hormones, how to navigate social eating during weight loss, and how to plan a medication taper that gives the best chance of maintaining results.`,
    faqs: [
      { question: "Will I gain all the weight back when I stop GLP-1 medication?", answer: "The STEP-4 trial showed approximately two-thirds of lost weight returns within a year of stopping semaglutide without lifestyle changes. Patients who built consistent resistance training habits, maintained high protein intake, and underwent a structured medication taper kept more weight off. This is why the treatment period is so important for habit building." },
      { question: "How much exercise should I do on GLP-1 medication?", answer: "The most important form of exercise is resistance training — 2-3 sessions per week. This preserves lean mass during weight loss, which maintains your metabolic rate. Cardio is beneficial for cardiovascular health but should not replace resistance training." },
      { question: "Does alcohol affect weight loss on GLP-1?", answer: "Yes, several ways: alcohol provides empty calories and suppresses fat oxidation for 12-24 hours after drinking. GLP-1 medication also changes how alcohol is absorbed (slower gastric emptying = less predictable blood alcohol). Many patients find their alcohol tolerance drops significantly." },
    ] as { question: string; answer: string }[],
  },
  education: {
    eyebrow: "Education Hub",
    title: "Understanding GLP-1 Weight Loss: Science, Eligibility & Real Expectations",
    description: "Everything you need to make an informed decision about GLP-1 treatment — from the clinical science to realistic expectations, cost, insurance, and how the process works.",
    seoTitle: "Weight Loss Education: Science, Cost & Program Comparisons",
    seoDescription: "Educational resources on weight management science, GLP-1 medication cost, compounded medication safety, and comparing weight loss programs.",
    intro: `Most people come to GLP-1 weight management having already tried multiple approaches. They deserve complete, honest information — not a sales pitch. The education guides in this section cover the science behind why GLP-1 medications work when other approaches fail, what realistic outcomes look like based on actual clinical trial data, how the process of starting treatment works, and what questions to ask a provider. We also cover the harder topics: what happens to weight when medication stops, how to compare costs across different providers, and how to evaluate whether a telehealth GLP-1 provider is operating at the standard of care you should expect.`,
    faqs: [
      { question: "Do I qualify for GLP-1 medication?", answer: "FDA criteria: BMI ≥30, or BMI ≥27 with at least one weight-related condition (hypertension, type 2 diabetes, sleep apnea, etc.). Final eligibility is always determined by a licensed provider after a clinical evaluation. About 87% of adults with BMI 27+ qualify after medical intake." },
      { question: "How is telehealth GLP-1 treatment different from seeing a doctor in person?", answer: "The clinical evaluation, contraindication screening, and prescription process are identical — they're just conducted via asynchronous questionnaire and/or video visit rather than in-person. Telehealth providers are bound by the same prescribing standards as in-person physicians. The advantage is accessibility and cost." },
      { question: "What should I look for in a GLP-1 telehealth provider?", answer: "Licensed physicians (MD/DO) doing evaluations, 503B pharmacy sourcing for compounded medication, all-inclusive transparent pricing, a clinical intake that asks about contraindications (MEN2, medullary thyroid carcinoma history, pancreatitis), and ongoing provider access — not just a one-time prescription." },
    ] as { question: string; answer: string }[],
  },
} as const;

type CategoryKey = keyof typeof categoryMeta;

// ─── Difficulty ────────────────────────────────────────────

interface DifficultyInfo {
  label: string;
  dotClass: string;
  textClass: string;
}

function getDifficulty(category: string): DifficultyInfo {
  switch (category) {
    case "medication":
      return { label: "Clinical", dotClass: "bg-atlantic", textClass: "text-atlantic" };
    case "nutrition":
      return { label: "Intermediate", dotClass: "bg-gold-500", textClass: "text-gold-700" };
    case "lifestyle":
      return { label: "Beginner", dotClass: "bg-teal", textClass: "text-teal-700" };
    case "education":
      return { label: "Beginner", dotClass: "bg-teal", textClass: "text-teal-700" };
    default:
      return { label: "General", dotClass: "bg-graphite-300", textClass: "text-graphite-500" };
  }
}

export function generateStaticParams() {
  return Object.keys(categoryMeta).map((category) => ({ category }));
}

type PageProps = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryMeta[category as CategoryKey];
  if (!cat) return { title: "Category Not Found" };
  return {
    title: cat.seoTitle,
    description: cat.seoDescription,
    openGraph: { title: cat.seoTitle, description: cat.seoDescription },
  };
}

const categoryColors: Record<string, string> = {
  medication: "bg-teal-50 text-teal-700",
  nutrition: "bg-gold-50 text-gold-700",
  education: "bg-atlantic/5 text-atlantic",
  lifestyle: "bg-sage text-navy-700",
};

function estimateReadTime(content: string): string {
  return `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min`;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cat = categoryMeta[category as CategoryKey];
  if (!cat) notFound();

  const posts = await db.blogPost.findMany({
    where: { isPublished: true, category },
    orderBy: { publishedAt: "desc" },
  });

  const diff = getDifficulty(category);

  return (
    <MarketingShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: cat.title, href: `/blog/category/${category}` },
        ]}
      />
      <FAQPageJsonLd faqs={cat.faqs} />
      <CollectionPageJsonLd
        name={cat.title}
        description={cat.description}
        url={`/blog/category/${category}`}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-graphite-400 hover:text-navy transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> All Articles
          </Link>
          <Badge variant="default" className="mb-6">{cat.eyebrow}</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {cat.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            {cat.description}
          </p>
        </SectionShell>
      </section>

      {/* Editorial intro */}
      <section className="py-12 border-b border-navy-100/40">
        <SectionShell className="max-w-3xl">
          <p className="text-base leading-relaxed text-graphite-600">
            {cat.intro}
          </p>
        </SectionShell>
      </section>

      {/* Post grid */}
      <section className="py-16">
        <SectionShell>
          {posts.length === 0 ? (
            <p className="text-center text-graphite-400">No articles in this category yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`self-start text-[10px] ${categoryColors[category] || ""}`}>
                      {category}
                    </Badge>
                    <span className="ml-auto flex items-center gap-1 text-[10px] text-graphite-300">
                      <Clock className="h-3 w-3" /> {estimateReadTime(post.content)} read
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-navy group-hover:text-teal transition-colors line-clamp-2 flex-1">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-graphite-400 line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px]">
                        <span className={`h-2 w-2 rounded-full ${diff.dotClass}`} />
                        <span className={`font-medium ${diff.textClass}`}>{diff.label}</span>
                      </span>
                      {post.publishedAt && (
                        <span className="text-[10px] text-graphite-300">
                          {post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-graphite-300 opacity-0 group-hover:opacity-100 group-hover:text-teal transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Other categories */}
          <div className="mt-16 text-center">
            <h3 className="text-lg font-bold text-navy mb-4">Explore other topics</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {(Object.entries(categoryMeta) as [CategoryKey, typeof categoryMeta[CategoryKey]][])
                .filter(([key]) => key !== category)
                .map(([key, val]) => (
                  <Link
                    key={key}
                    href={`/blog/category/${key}`}
                    className="rounded-xl border border-navy-100/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors shadow-sm"
                  >
                    {val.eyebrow}
                  </Link>
                ))}
            </div>
            <div className="mt-6">
              <Link href="/qualify">
                <Button className="gap-2">
                  See If You Qualify <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* FAQ section */}
      <section className="py-16 border-t border-navy-100/40 bg-premium-gradient">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {cat.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-navy-100/40 bg-white p-6">
                <h3 className="text-sm font-bold text-navy mb-2">{faq.question}</h3>
                <p className="text-sm text-graphite-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
