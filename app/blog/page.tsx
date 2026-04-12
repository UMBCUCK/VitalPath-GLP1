import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CollectionPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss Blog — Semaglutide, Tirzepatide & Nutrition Guides (2026)",
  description: "Evidence-based articles on GLP-1 medication, semaglutide, tirzepatide, weight loss nutrition, side effects, and building lasting healthy habits. Written by licensed clinicians.",
  openGraph: {
    title: "GLP-1 Weight Loss Blog | Nature's Journey",
    description: "Clinical guides on semaglutide, tirzepatide, GLP-1 side effects, nutrition, and weight loss strategies — written and reviewed by licensed providers.",
  },
};

const categoryColors: Record<string, string> = {
  medication: "bg-teal-50 text-teal-700",
  "clinical-research": "bg-indigo-50 text-indigo-700",
  "medication-comparison": "bg-purple-50 text-purple-700",
  "weight-maintenance": "bg-emerald-50 text-emerald-700",
  nutrition: "bg-gold-50 text-gold-700",
  education: "bg-atlantic/5 text-atlantic",
  lifestyle: "bg-sage text-navy-700",
  "mental-health": "bg-rose-50 text-rose-700",
  "success-strategies": "bg-amber-50 text-amber-700",
  news: "bg-blue-50 text-blue-700",
};

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

// ─── Difficulty info ───────────────────────────────────────

interface DifficultyInfo {
  label: string;
  dotClass: string;
  textClass: string;
}

function getDifficulty(category: string | null): DifficultyInfo {
  switch (category) {
    case "medication":
    case "clinical-research":
    case "medication-comparison":
      return { label: "Clinical", dotClass: "bg-atlantic", textClass: "text-atlantic" };
    case "nutrition":
    case "weight-maintenance":
    case "success-strategies":
      return { label: "Intermediate", dotClass: "bg-gold-500", textClass: "text-gold-700" };
    case "lifestyle":
    case "education":
    case "mental-health":
      return { label: "Beginner", dotClass: "bg-teal", textClass: "text-teal-700" };
    case "news":
      return { label: "News", dotClass: "bg-blue-500", textClass: "text-blue-700" };
    default:
      return { label: "General", dotClass: "bg-graphite-300", textClass: "text-graphite-500" };
  }
}

const MOST_POPULAR_SLUGS = [
  "how-much-weight-will-i-lose-semaglutide",
  "semaglutide-vs-diet-exercise-alone",
  "what-is-food-noise",
  "ozempic-vs-wegovy-vs-zepbound",
  "semaglutide-timeline-first-3-months",
  "tirzepatide-vs-semaglutide-2026",
];

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  // Fetch most popular posts by slug
  const popularPosts = await db.blogPost.findMany({
    where: {
      isPublished: true,
      slug: { in: MOST_POPULAR_SLUGS },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      content: true,
      publishedAt: true,
    },
  });

  // Sort popular posts in the defined order
  const popularSorted = MOST_POPULAR_SLUGS
    .map((slug) => popularPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const featured = posts.slice(0, 2);
  const recent = posts.slice(2);

  return (
    <MarketingShell>
      <CollectionPageJsonLd
        name="Nature's Journey Blog & Education"
        description="Evidence-based articles on GLP-1 medication, semaglutide, tirzepatide, weight loss nutrition, and side effects."
        url="/blog"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6">Education Hub</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Expert insights for your journey
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Evidence-informed articles on weight management, medication, nutrition, and building habits that last.
          </p>
        </SectionShell>
      </section>

      {/* Category navigation */}
      <section className="py-8 border-b border-navy-100/40">
        <SectionShell>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "All Articles", href: "/blog" },
              { label: "Medication Guides", href: "/blog/category/medication" },
              { label: "Nutrition & Recipes", href: "/blog/category/nutrition" },
              { label: "Lifestyle & Habits", href: "/blog/category/lifestyle" },
              { label: "Education", href: "/blog/category/education" },
              { label: "Clinical Research", href: "/blog/category/clinical-research" },
              { label: "Comparisons", href: "/blog/category/medication-comparison" },
              { label: "Mental Health", href: "/blog/category/mental-health" },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  cat.href === "/blog"
                    ? "bg-teal text-white"
                    : "border border-navy-100/40 bg-white text-navy hover:border-teal hover:text-teal"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Most Popular */}
      {popularSorted.length > 0 && (
        <section className="py-14">
          <SectionShell>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-navy">Most Popular</h2>
              <span className="text-xs text-graphite-400">Based on reader engagement</span>
            </div>
            {/* Mobile: horizontal scroll; Desktop: 3-col grid */}
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
              {popularSorted.map((post, idx) => {
                const diff = getDifficulty(post.category);
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group shrink-0 w-72 snap-start lg:w-auto flex flex-col rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-[10px] font-bold text-teal">
                        {idx + 1}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[post.category || ""] || "bg-navy-50 text-navy"}`}>
                        {post.category}
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-[10px] text-graphite-300">
                        <Clock className="h-3 w-3" /> {estimateReadTime(post.content)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-navy group-hover:text-teal transition-colors line-clamp-2 flex-1">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px]">
                        <span className={`h-2 w-2 rounded-full ${diff.dotClass}`} />
                        <span className={`font-medium ${diff.textClass}`}>{diff.label}</span>
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-teal opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </SectionShell>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-16 border-t border-navy-100/40">
          <SectionShell>
            <h2 className="text-lg font-bold text-navy mb-6">Featured</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {featured.map((post) => {
                const diff = getDifficulty(post.category);
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <div className="overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-0.5 h-full flex flex-col">
                      {post.imageUrl ? (
                        <div className="aspect-video w-full overflow-hidden bg-graphite-50">
                          <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
                        </div>
                      ) : (
                        <div className="aspect-video w-full bg-gradient-to-br from-navy-50 to-sage/20" />
                      )}
                      <div className="flex flex-col flex-1 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${categoryColors[post.category || ""] || "bg-navy-50 text-navy"}`}>
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-graphite-300">
                            <Clock className="h-3 w-3" /> {estimateReadTime(post.content)}
                          </span>
                          <span className="flex items-center gap-1 ml-auto text-[10px]">
                            <span className={`h-2 w-2 rounded-full ${diff.dotClass}`} />
                            <span className={`font-medium ${diff.textClass}`}>{diff.label}</span>
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-navy group-hover:text-teal transition-colors">{post.title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-graphite-500">{post.excerpt}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[10px] text-graphite-300">
                            {post.publishedAt?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-teal opacity-0 group-hover:opacity-100 transition-opacity">
                            Read <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </SectionShell>
        </section>
      )}

      {/* Newsletter / Lead Magnet */}
      <NewsletterSignup />

      {/* All posts */}
      {recent.length > 0 && (
        <section className="bg-premium-gradient py-16">
          <SectionShell>
            <h2 className="text-lg font-bold text-navy mb-6">Recent Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((post) => {
                const diff = getDifficulty(post.category);
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <div className="overflow-hidden flex flex-col h-full rounded-2xl border border-navy-100/60 bg-white shadow-premium transition-all hover:shadow-premium-md hover:-translate-y-0.5">
                      {post.imageUrl ? (
                        <div className="aspect-video w-full overflow-hidden bg-graphite-50">
                          <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
                        </div>
                      ) : (
                        <div className="h-2 w-full bg-gradient-to-r from-teal/20 to-sage/30" />
                      )}
                      <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[post.category || ""] || "bg-navy-50 text-navy"}`}>
                            {post.category}
                          </span>
                          <span className="text-[10px] text-graphite-300">
                            {post.publishedAt?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-navy group-hover:text-teal transition-colors">{post.title}</h3>
                        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-graphite-400">{post.excerpt}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-graphite-300">
                            <Clock className="h-3 w-3" /> {estimateReadTime(post.content)} read
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <span className={`h-1.5 w-1.5 rounded-full ${diff.dotClass}`} />
                            <span className={`font-medium text-[10px] ${diff.textClass}`}>{diff.label}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </SectionShell>
        </section>
      )}

      {posts.length === 0 && (
        <section className="py-20">
          <SectionShell className="text-center">
            <p className="text-graphite-400">No articles published yet. Check back soon.</p>
          </SectionShell>
        </section>
      )}

      <CtaSection />
    </MarketingShell>
  );
}
