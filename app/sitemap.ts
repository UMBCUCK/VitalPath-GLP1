import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { availableStates, allStates } from "@/lib/states";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/qualify`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/eligibility`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq/semaglutide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq/tirzepatide`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq/cost`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq/side-effects`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq/getting-started`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq/nutrition`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq/exercise`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
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
    { url: `${baseUrl}/peptides`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/peptides/nad-plus`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/peptides/sermorelin`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/peptides/ipamorelin-cjc`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/peptides/bpc-157`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/peptides/glow-stack`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/peptides/thymosin-beta-4`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/peptides/stacks/recovery`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/peptides/stacks/longevity`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/peptides/stacks/glow`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog/category/medication`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/category/nutrition`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/category/lifestyle`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/category/education`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/category/clinical-research`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/category/medication-comparison`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/blog/category/weight-maintenance`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/blog/category/mental-health`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/blog/category/success-strategies`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/semaglutide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/tirzepatide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/women`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/men`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/glp1-cost`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pcos`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/heart-health`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/sleep-apnea`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/over-50`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/prediabetes`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/obesity`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/type-2-diabetes`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/calculators/timeline`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/calculators/complete`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/hipaa`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/baa`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/free-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/press`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },

    // Landing pages — high-value conversion pages for paid ads and organic search
    { url: `${baseUrl}/lp/glp1`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/ozempic-alternative`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/semaglutide`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/tirzepatide`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/women`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/women-weight-loss`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/men`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/over40`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/over50`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/menopause`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/pcos`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/belly-fat`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/no-surgery`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/affordable`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/postpartum`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/wegovy-alternative`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/mounjaro-alternative`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/zepbound-alternative`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/telehealth`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/medical-weight-management`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    // Life-event LPs (Wave 2 + 3)
    { url: `${baseUrl}/lp/after-breakup`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/lp/after-divorce`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/lp/before-wedding`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/lp/empty-nester`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/lp/reunion`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // Clinical LPs (Wave 2 + 3) — high E-E-A-T pages
    { url: `${baseUrl}/lp/pre-diabetes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/sleep-apnea`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/blood-pressure`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/lp/fatty-liver`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },

    // /home-v2 is intentionally noindex; not in sitemap

    // /outcomes — original member-data dashboard for E-E-A-T + earned links
    { url: `${baseUrl}/outcomes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
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

  // Tier 9.2 — per-state GLP-1 cost pages (ALL states, including waitlist)
  const stateCostPages: MetadataRoute.Sitemap = allStates.map((state) => ({
    url: `${baseUrl}/glp1-cost/${state.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: state.available ? 0.7 : 0.5,
  }));

  // Tier 10.4 — long-tail GLP-1 cost verticals (insurance-denied, Medicare)
  const longtailCostPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/glp1-cost/insurance-denied`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.75 },
    { url: `${baseUrl}/glp1-cost/medicare`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.75 },
    // Tier 12.5 — per-medication cost pages
    { url: `${baseUrl}/glp1-cost/medication/semaglutide`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/glp1-cost/medication/tirzepatide`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/glp1-cost/medication/liraglutide`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    // Tier 12.4 — pharmacy sourcing transparency
    { url: `${baseUrl}/sourcing`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  return [
    ...staticPages,
    ...blogPages,
    ...comparePages,
    ...recipePages,
    ...statePages,
    ...stateCostPages,
    ...longtailCostPages,
  ];
}
