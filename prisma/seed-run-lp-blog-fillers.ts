/**
 * Seed runner for LP-supporting blog posts.
 *
 * Why: 5 landing pages (belly-fat, pcos, women, menopause, postpartum) include
 * internal links to /blog/<slug> URLs that returned 404. These broken links
 * bled link equity and hurt topical-authority signal. This script inserts the
 * 5 backing posts so the links resolve.
 *
 * Idempotent — uses upsert on slug, so it's safe to run multiple times.
 *
 * Usage on Railway prod:
 *   railway run -- npx tsx prisma/seed-run-lp-blog-fillers.ts
 *   # or, with DATABASE_URL set explicitly:
 *   DATABASE_URL="postgresql://..." npx tsx prisma/seed-run-lp-blog-fillers.ts
 *
 * Usage on local dev (sqlite):
 *   npx tsx prisma/seed-run-lp-blog-fillers.ts
 */
import { PrismaClient } from "@prisma/client";
import { LP_SUPPORTING_POSTS } from "./seed-lp-supporting-posts";
import { LP_SUPPORTING_POSTS_B } from "./seed-lp-supporting-posts-batch-b";

const prisma = new PrismaClient();

type SeedPost = {
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  content: string;
  imageUrl?: string;
  readTime?: number;
};

function estimateReadTime(html: string): number {
  // Strip HTML tags then count words; assume 200 wpm reading speed.
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function upsertPost(post: SeedPost) {
  const data = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? null,
    content: post.content,
    imageUrl: post.imageUrl ?? null,
    author: post.author ?? "VitalPath Clinical Team",
    category: post.category ?? "education",
    // Prisma `tags` is Json — store as array
    tags: (post.tags ?? []) as unknown as object,
    isPublished: post.isPublished ?? true,
    publishedAt: post.publishedAt ?? new Date(),
    readTime: post.readTime ?? estimateReadTime(post.content),
    seoTitle: post.seoTitle ?? post.title,
    seoDescription: post.seoDescription ?? post.excerpt ?? null,
  };

  return prisma.blogPost.upsert({
    where: { slug: post.slug },
    create: data,
    update: data,
  });
}

async function main() {
  const allPosts: SeedPost[] = [
    ...(LP_SUPPORTING_POSTS as unknown as SeedPost[]),
    ...(LP_SUPPORTING_POSTS_B as unknown as SeedPost[]),
  ];

  console.log(
    `Seeding ${allPosts.length} LP-supporting blog posts...\n`
  );

  let created = 0;
  let updated = 0;

  for (const post of allPosts) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });
    const result = await upsertPost(post);
    if (existing) {
      updated++;
      console.log(`  ↻ updated:  ${result.slug}  (id=${result.id})`);
    } else {
      created++;
      console.log(`  ✓ created:  ${result.slug}  (id=${result.id})`);
    }
  }

  console.log(`\nDone. ${created} created, ${updated} updated.`);
}

main()
  .catch((err) => {
    console.error("\n✗ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
