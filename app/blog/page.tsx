import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CollectionPageJsonLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Education",
  description: "Expert insights on weight management, GLP-1 medication, nutrition, and building lasting healthy habits.",
};

const categoryColors: Record<string, string> = {
  medication: "bg-teal-50 text-teal-700",
  nutrition: "bg-gold-50 text-gold-700",
  education: "bg-atlantic/5 text-atlantic",
  lifestyle: "bg-sage text-navy-700",
};

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const featured = posts.slice(0, 2);
  const recent = posts.slice(2);

  return (
    <MarketingShell>
      <CollectionPageJsonLd
        name="VitalPath Blog & Education"
        description="Expert insights on GLP-1 weight management, nutrition, and healthy habits."
        url="/blog"
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

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-16">
          <SectionShell>
            <h2 className="text-lg font-bold text-navy mb-6">Featured</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {featured.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-0.5 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${categoryColors[post.category || ""] || "bg-navy-50 text-navy"}`}>
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-graphite-300">
                        <Clock className="h-3 w-3" /> {estimateReadTime(post.content)}
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
                </Link>
              ))}
            </div>
          </SectionShell>
        </section>
      )}

      {/* All posts */}
      {recent.length > 0 && (
        <section className="bg-premium-gradient py-16">
          <SectionShell>
            <h2 className="text-lg font-bold text-navy mb-6">Recent Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div className="flex flex-col h-full rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium transition-all hover:shadow-premium-md hover:-translate-y-0.5">
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
                    <div className="mt-3 flex items-center gap-1 text-xs text-graphite-300">
                      <Clock className="h-3 w-3" /> {estimateReadTime(post.content)} read
                    </div>
                  </div>
                </Link>
              ))}
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
