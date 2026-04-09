import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { availableStates } from "@/lib/states";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/eligibility`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/results`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/referrals`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/states`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/maintenance`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/meals`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/calculators`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/calculators/bmi`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/calculators/tdee`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/calculators/protein`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/calculators/hydration`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/medications`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/medications/semaglutide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/medications/tirzepatide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog/category/medication`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/category/nutrition`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/category/lifestyle`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/category/education`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/hipaa`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic pages from DB — wrapped in try/catch for build-time when DB isn't available
  let blogPages: MetadataRoute.Sitemap = [];
  let comparePages: MetadataRoute.Sitemap = [];
  let recipePages: MetadataRoute.Sitemap = [];

  try {
    const blogPosts = await db.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    blogPages = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const comparisons = await db.comparisonPage.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    comparePages = comparisons.map((page) => ({
      url: `${baseUrl}/compare/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const recipes = await db.recipe.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    recipePages = recipes.map((recipe) => ({
      url: `${baseUrl}/meals/${recipe.slug}`,
      lastModified: recipe.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB not reachable during build — return static pages only
  }

  // State-specific landing pages (static data, no DB needed)
  const statePages: MetadataRoute.Sitemap = availableStates.map((state) => ({
    url: `${baseUrl}/states/${state.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...comparePages, ...recipePages, ...statePages];
}
