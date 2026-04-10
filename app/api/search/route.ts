import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { faqs } from "@/lib/content";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.toLowerCase().trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Search blog posts
  const blogs = await db.blogPost.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query } },
        { excerpt: { contains: query } },
        { content: { contains: query } },
      ],
    },
    select: { title: true, slug: true, excerpt: true, category: true },
    take: 5,
  });

  // Search recipes
  const recipes = await db.recipe.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    },
    select: { title: true, slug: true, category: true, calories: true, proteinG: true },
    take: 5,
  });

  // Search FAQs (from static content)
  const faqResults = faqs
    .filter((f) => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query))
    .slice(0, 3)
    .map((f) => ({ question: f.question, answer: f.answer.substring(0, 120) + "..." }));

  // Static pages
  const pages = [
    { title: "How It Works", href: "/how-it-works", keywords: "process steps assessment intake provider" },
    { title: "Pricing & Plans", href: "/pricing", keywords: "cost price essential premium complete subscription" },
    { title: "Eligibility", href: "/eligibility", keywords: "qualify eligible bmi weight provider" },
    { title: "BMI Calculator", href: "/calculators/bmi", keywords: "body mass index bmi calculator" },
    { title: "TDEE Calculator", href: "/calculators/tdee", keywords: "calories energy expenditure tdee" },
    { title: "Protein Calculator", href: "/calculators/protein", keywords: "protein intake daily" },
    { title: "Hydration Calculator", href: "/calculators/hydration", keywords: "water hydration daily" },
    { title: "Results & Stories", href: "/results", keywords: "results testimonials stories reviews" },
    { title: "Referral Program", href: "/referrals", keywords: "referral refer friend earn credit" },
    { title: "State Availability", href: "/states", keywords: "state available where" },
    { title: "Maintenance Program", href: "/maintenance", keywords: "maintenance keep off transition" },
    { title: "Meal Plans", href: "/meals", keywords: "meal plan recipe grocery nutrition" },
    { title: "FAQ", href: "/faq", keywords: "questions answers faq help" },
  ].filter((p) => p.title.toLowerCase().includes(query) || p.keywords.includes(query)).slice(0, 5);

  return NextResponse.json(
    {
      results: {
        blogs: blogs.map((b) => ({ type: "blog" as const, title: b.title, href: `/blog/${b.slug}`, subtitle: b.excerpt || b.category })),
        recipes: recipes.map((r) => ({ type: "recipe" as const, title: r.title, href: `/dashboard/meals`, subtitle: `${r.calories} cal · ${r.proteinG}g protein` })),
        faqs: faqResults.map((f) => ({ type: "faq" as const, title: f.question, href: "/faq", subtitle: f.answer })),
        pages: pages.map((p) => ({ type: "page" as const, title: p.title, href: p.href })),
      },
      query,
    },
    {
      headers: {
        // Cache search results at CDN for 2 minutes — same query string = same results
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=30",
      },
    }
  );
}
