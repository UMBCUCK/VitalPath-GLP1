import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight, Award, Building2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { ShareButtons } from "@/components/shared/share-buttons";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { providers } from "@/lib/content";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    openGraph: { title: post.title, description: post.excerpt || undefined },
    other: {
      'article:published_time': post.publishedAt?.toISOString() ?? '',
      'article:modified_time': post.updatedAt.toISOString(),
      'article:author': 'VitalPath Medical Team',
      'article:section': post.category ?? 'Health',
    },
  };
}

function estimateReadTime(content: string): string {
  return `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min`;
}

// ─── TOC utilities ─────────────────────────────────────────

interface HeadingInfo {
  id: string;
  text: string;
  level: 2 | 3;
}

function extractHeadings(html: string): HeadingInfo[] {
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  const headings: HeadingInfo[] = [];
  const idCounts: Record<string, number> = {};
  let match;

  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    let baseId = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (idCounts[baseId]) {
      idCounts[baseId]++;
      baseId = `${baseId}-${idCounts[baseId]}`;
    } else {
      idCounts[baseId] = 1;
    }

    headings.push({ id: baseId, text, level: parseInt(match[1]) as 2 | 3 });
  }

  return headings;
}

function injectHeadingIds(html: string, headings: HeadingInfo[]): string {
  let idx = 0;
  return html.replace(/<h([23])([^>]*)>/gi, (fullMatch, level, attrs) => {
    if (idx < headings.length) {
      const heading = headings[idx++];
      return `<h${level}${attrs} id="${heading.id}">`;
    }
    return fullMatch;
  });
}

// ─── Author matching ───────────────────────────────────────

function getAuthorData(authorName: string | null) {
  if (!authorName) return null;

  const matched = providers.find((p) =>
    authorName.toLowerCase().includes(p.name.split(",")[0].toLowerCase())
  );

  if (matched) {
    return {
      ...matched,
      isDoctor: true,
      reviewLabel: `Medically reviewed by ${matched.name}`,
    };
  }

  return {
    name: authorName,
    title: "Clinical Content Team",
    credentials: "Evidence-based health education",
    institution: "VitalPath",
    experience: "Expert health content",
    initials: authorName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    isDoctor: false,
    reviewLabel: `Written by ${authorName}`,
  };
}

// ─── Page ──────────────────────────────────────────────────

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({ where: { slug } });

  if (!post || !post.isPublished) notFound();

  const related = await db.blogPost.findMany({
    where: {
      isPublished: true,
      category: post.category || undefined,
      slug: { not: post.slug },
    },
    select: { title: true, slug: true, excerpt: true, category: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  // TOC
  const headings = extractHeadings(post.content);
  const rawContent = headings.length >= 3 ? injectHeadingIds(post.content, headings) : post.content;
  const contentWithIds = DOMPurify.sanitize(rawContent, {
    ALLOWED_TAGS: ["h1","h2","h3","h4","h5","h6","p","a","ul","ol","li","strong","em","b","i","br","img","blockquote","pre","code","table","thead","tbody","tr","th","td","span","div","figure","figcaption","hr","sup","sub"],
    ALLOWED_ATTR: ["id","href","src","alt","class","target","rel","width","height","loading"],
    ALLOW_DATA_ATTR: false,
  });

  // Author
  const author = getAuthorData(post.author);

  return (
    <MarketingShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt || ""}
        slug={post.slug}
        datePublished={post.publishedAt?.toISOString() || post.createdAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
        author={post.author}
      />

      <article className="py-12">
        <SectionShell className="max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-graphite-400 hover:text-navy transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>

          <Badge variant="default" className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">{post.title}</h1>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-graphite-400">
              <span>{post.publishedAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              {post.updatedAt && post.publishedAt && post.updatedAt.getTime() - post.publishedAt.getTime() > 86400000 && (
                <span className="text-teal-600 font-medium">
                  Updated {post.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {estimateReadTime(post.content)} read</span>
            </div>
            <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {post.excerpt && (
            <p className="mt-6 text-lg leading-relaxed text-graphite-500 border-l-4 border-teal/30 pl-4">
              {post.excerpt}
            </p>
          )}

          {/* Medically Reviewed banner */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/50 px-4 py-3">
            <Shield className="h-4 w-4 text-teal shrink-0" />
            <div>
              <p className="text-xs font-semibold text-teal-800">Medically Reviewed</p>
              <p className="text-xs text-teal-700">Content reviewed by VitalPath&apos;s licensed medical team for clinical accuracy.</p>
            </div>
            <div className="ml-auto text-xs text-graphite-400">
              {post.updatedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
          </div>

          {/* Table of Contents */}
          {headings.length >= 3 && (
            <nav aria-label="Table of contents" className="mt-8 rounded-2xl border border-navy-100/40 bg-navy-50/20 p-6">
              <h2 className="text-sm font-bold text-navy mb-3">In this article</h2>
              <ol className="space-y-1.5">
                {headings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? "ml-5" : ""}>
                    <a
                      href={`#${h.id}`}
                      className="text-sm text-graphite-500 hover:text-teal transition-colors"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Article content */}
          <div
            className="mt-10 prose prose-navy prose-sm max-w-none
              prose-headings:text-navy prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
              prose-headings:scroll-mt-24
              prose-p:text-graphite-600 prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-graphite-600
              prose-a:text-teal prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          {/* Author bio */}
          {author && (
            <div className="mt-12 rounded-2xl border border-navy-100/40 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal to-atlantic text-lg font-bold text-white">
                  {author.initials}
                </div>
                <div>
                  <p className="text-xs text-graphite-400 mb-1">{author.reviewLabel}</p>
                  <p className="font-bold text-navy">{author.name}</p>
                  <p className="text-sm text-teal">{author.title}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-graphite-500">
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-gold-600" /> {author.credentials}
                    </span>
                    {author.institution !== "VitalPath" && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-graphite-400" /> {author.institution}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contextual tools */}
          <div className="mt-8 rounded-2xl border border-navy-100/40 bg-navy-50/20 p-6">
            <h3 className="text-sm font-bold text-navy mb-3">Free tools related to this article</h3>
            <div className="flex flex-wrap gap-2">
              {(post.category === "nutrition" || post.category === "lifestyle") && (
                <>
                  <Link href="/calculators/protein" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal border border-navy-100/40 hover:border-teal transition-colors">Protein Calculator</Link>
                  <Link href="/calculators/hydration" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal border border-navy-100/40 hover:border-teal transition-colors">Hydration Calculator</Link>
                  <Link href="/meals" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal border border-navy-100/40 hover:border-teal transition-colors">GLP-1 Recipes</Link>
                </>
              )}
              {(post.category === "medication" || post.category === "education") && (
                <>
                  <Link href="/medications" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal border border-navy-100/40 hover:border-teal transition-colors">Medications Guide</Link>
                  <Link href="/eligibility" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal border border-navy-100/40 hover:border-teal transition-colors">Check Eligibility</Link>
                  <Link href="/compare" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal border border-navy-100/40 hover:border-teal transition-colors">Compare Programs</Link>
                </>
              )}
              <Link href="/calculators/bmi" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal border border-navy-100/40 hover:border-teal transition-colors">BMI Calculator</Link>
              <Link href="/calculators/tdee" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal border border-navy-100/40 hover:border-teal transition-colors">TDEE Calculator</Link>
              <Link href="/guide" className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-teal border border-navy-100/40 hover:border-teal transition-colors">Complete GLP-1 Guide</Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-teal-50 to-sage p-8 text-center">
            <h3 className="text-xl font-bold text-navy">Ready to get started?</h3>
            <p className="mt-2 text-sm text-graphite-500">Take our quick assessment to see if our program is right for you.</p>
            <Link href="/qualify"><Button className="mt-4 gap-2">Take the Assessment <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-navy mb-6">Related Articles</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group rounded-2xl border border-navy-100/60 bg-white p-5 shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5"
                  >
                    <Badge variant="secondary" className="mb-3 text-[10px]">
                      {r.category}
                    </Badge>
                    <h3 className="text-sm font-bold text-navy group-hover:text-teal transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    {r.excerpt && (
                      <p className="mt-2 text-xs text-graphite-400 line-clamp-2">{r.excerpt}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </SectionShell>
      </article>
    </MarketingShell>
  );
}
