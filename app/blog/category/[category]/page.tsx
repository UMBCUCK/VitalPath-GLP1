import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

const categories = {
  medication: {
    title: "GLP-1 Medication Guides",
    description: "Everything about GLP-1 medications — how they work, side effects, cost comparisons, and what to expect during treatment.",
    seoTitle: "GLP-1 Medication Guides: Semaglutide, Tirzepatide & More",
    seoDescription: "Expert guides on GLP-1 weight loss medications. Compare semaglutide vs tirzepatide, understand side effects, cost without insurance, and treatment timelines.",
  },
  nutrition: {
    title: "Weight Loss Nutrition & Recipes",
    description: "High-protein meal plans, recipes, and nutrition strategies designed for patients on GLP-1 weight management programs.",
    seoTitle: "Weight Loss Nutrition: Meal Plans, Recipes & Protein Guides",
    seoDescription: "Free high-protein meal plans, GLP-1-friendly recipes, and nutrition guides. Learn what to eat during weight loss treatment for the best results.",
  },
  lifestyle: {
    title: "Weight Loss Lifestyle & Habits",
    description: "Build lasting habits that sustain your results. Exercise guides, hydration tips, plateau strategies, and maintenance planning.",
    seoTitle: "Weight Loss Lifestyle: Exercise, Habits & Maintenance Guides",
    seoDescription: "Evidence-based lifestyle guides for sustainable weight loss. Walking plans, habit building, breaking plateaus, and transitioning to long-term maintenance.",
  },
  education: {
    title: "Weight Management Education",
    description: "Understand the science behind weight loss, medication costs, compounding safety, and how to choose the right program.",
    seoTitle: "Weight Loss Education: Science, Cost & Program Comparisons",
    seoDescription: "Educational resources on weight management science, GLP-1 medication cost, compounded medication safety, and comparing weight loss programs.",
  },
} as const;

type CategoryKey = keyof typeof categories;

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}

type PageProps = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = categories[category as CategoryKey];
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
  const cat = categories[category as CategoryKey];
  if (!cat) notFound();

  const posts = await db.blogPost.findMany({
    where: { isPublished: true, category },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <MarketingShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: cat.title, href: `/blog/category/${category}` },
        ]}
      />

      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-graphite-400 hover:text-navy transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> All Articles
          </Link>
          <Badge variant="default" className="mb-6">{category}</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {cat.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            {cat.description}
          </p>
        </SectionShell>
      </section>

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
                  <Badge className={`self-start text-[10px] ${categoryColors[category] || ""}`}>
                    {category}
                  </Badge>
                  <h2 className="mt-3 text-base font-bold text-navy group-hover:text-teal transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm text-graphite-400 line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center gap-3 text-xs text-graphite-300">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {estimateReadTime(post.content)} read
                    </span>
                    {post.publishedAt && (
                      <span>{post.publishedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Other categories */}
          <div className="mt-16 text-center">
            <h3 className="text-lg font-bold text-navy mb-4">Explore other topics</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(categories)
                .filter(([key]) => key !== category)
                .map(([key, val]) => (
                  <Link
                    key={key}
                    href={`/blog/category/${key}`}
                    className="rounded-xl border border-navy-100/40 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-teal hover:text-teal transition-colors shadow-sm"
                  >
                    {val.title}
                  </Link>
                ))}
            </div>
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
