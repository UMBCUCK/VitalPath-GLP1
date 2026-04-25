/**
 * /blog/rss.xml
 * ─────────────────────────────────────────────────────────────
 * Tier 11.6 — RSS 2.0 feed for the blog. Powers:
 *
 *   - Email aggregators (Substack, Beehiiv) that subscribe to source feeds
 *   - Apple News, Flipboard syndication
 *   - SEO discovery: Google still indexes RSS items, and feeds count as
 *     a sitemap-equivalent for some content APIs
 *   - Internal newsletter automations (e.g. Mailchimp's "RSS-driven
 *     campaign" feature can auto-build a weekly digest from this feed)
 *
 * 30-minute revalidation keeps it fresh without re-querying on every hit.
 */
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export const revalidate = 1800; // 30 minutes

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : siteConfig.url);

  const posts = await db.blogPost.findMany({
    where: {
      isPublished: true,
      publishedAt: { lte: new Date() }, // never leak scheduled-for-future
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      author: true,
      category: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  const lastBuild = posts[0]?.publishedAt ?? new Date();

  const items = posts
    .map((p) => {
      const url = `${baseUrl}/blog/${p.slug}`;
      const desc = p.excerpt ?? stripHtml(p.content).slice(0, 280);
      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${(p.publishedAt ?? new Date()).toUTCString()}</pubDate>
      <description>${escapeXml(desc)}</description>
      ${p.author ? `<dc:creator>${escapeXml(p.author)}</dc:creator>` : ""}
      ${p.category ? `<category>${escapeXml(p.category)}</category>` : ""}
    </item>`;
    })
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — GLP-1 Weight Loss Blog</title>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Evidence-based articles on GLP-1 medication, semaglutide, tirzepatide, weight loss nutrition, side effects, and habit-building. Written by licensed clinicians.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <generator>Nature's Journey RSS</generator>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, stale-while-revalidate=1800",
    },
  });
}
