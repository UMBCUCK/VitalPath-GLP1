export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChefHat, ShoppingCart, Utensils, Clock, Target, Sparkles, Heart, Users, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { db } from "@/lib/db";
import { FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Meal Plans & Recipes",
  description: "Weekly meal plans, high-protein recipes, and grocery lists designed for GLP-1 patients and weight management.",
};

const mealModes = [
  { icon: Utensils, title: "Standard", description: "Balanced weekly plans with variety and proper macronutrient distribution." },
  { icon: Target, title: "High-Protein", description: "Protein-forward meals to support muscle preservation during weight management." },
  { icon: Clock, title: "Low-Effort", description: "Quick-prep meals under 20 minutes for busy schedules. No complicated techniques." },
  { icon: Users, title: "Family Mode", description: "Plans that work for the whole family. One prep, everyone eats well." },
];

const features = [
  "Weekly meal plans updated every Monday",
  "Automated grocery lists organized by store section",
  "High-protein recipes optimized for GLP-1 patients",
  "Portion guidance that adapts to appetite changes",
  "Quick-prep options for days you're low on time",
  "Nutritional breakdown for every recipe",
  "Filter by dietary preferences and restrictions",
  "Save favorites and build custom weekly plans",
];

export default async function MealsPage() {
  const recipes = await db.recipe.findMany({
    where: { isPublished: true },
    select: { title: true, slug: true, category: true, calories: true, proteinG: true, prepMinutes: true, cookMinutes: true, difficulty: true, imageUrl: true },
    orderBy: { category: "asc" },
  });

  return (
    <MarketingShell>
      <FAQPageJsonLd faqs={[
        { question: "What should I eat while taking semaglutide or tirzepatide?", answer: "Focus on high-protein, nutrient-dense foods: lean meats, fish, eggs, Greek yogurt, legumes, and non-starchy vegetables. GLP-1 medications reduce appetite significantly — prioritizing protein helps preserve lean muscle mass during weight loss. Avoid high-fat, greasy foods which can worsen nausea." },
        { question: "How much protein do I need on GLP-1 medication?", answer: "Most clinical guidelines recommend 1.2-1.6 grams of protein per kilogram of body weight per day during active weight loss on GLP-1 medication. For a 200 lb (91kg) person, that's approximately 110-145g of protein daily. Our protein calculator can give you a personalized target." },
        { question: "Are there foods I should avoid on GLP-1 medication?", answer: "High-fat, greasy foods (fried foods, heavy sauces, fatty meats) worsen nausea — a common side effect especially during dose escalation. Sugary beverages, alcohol, and large portions can also interfere with results. Focus on smaller, more frequent meals." },
        { question: "Can I get recipe suggestions specific to my GLP-1 treatment?", answer: "Yes. Nature's Journey members get access to a curated recipe library specifically designed for GLP-1 patients — high protein, appropriate portion sizes, and easy on the stomach. Our meal plans are built by registered dietitians familiar with the nutritional needs during GLP-1 treatment." },
      ]} />
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "GLP-1 Recipes & Meal Plans", href: "/meals" }]} />
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <ChefHat className="h-3.5 w-3.5" /> Nutrition Support
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Meal plans that actually work with your treatment
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            When your appetite changes on medication, knowing what to eat matters more than ever.
            Our plans are designed specifically for patients on GLP-1 treatment.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/qualify"><Button size="xl" className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/pricing"><Button size="xl" variant="outline">View Plans</Button></Link>
          </div>
        </SectionShell>
      </section>

      {/* Meal modes */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading eyebrow="Choose Your Style" title="Four meal plan modes to match your life" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mealModes.map((mode) => (
              <Card key={mode.title} className="card-hover text-center">
                <CardContent className="p-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
                    <mode.icon className="h-6 w-6 text-teal" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-navy">{mode.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-500">{mode.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Features */}
      <section className="bg-premium-gradient py-20">
        <SectionShell>
          <SectionHeading eyebrow="What's Included" title="Everything you need in the kitchen" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-premium">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <span className="text-sm text-graphite-600">{f}</span>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Recipe grid */}
      {recipes.length > 0 && (
        <section className="py-20">
          <SectionShell>
            <SectionHeading eyebrow="Free Recipes" title="GLP-1-friendly recipes to get started" description="High-protein, easy-to-digest meals designed for patients on weight management medication." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((r) => (
                <Link key={r.slug} href={`/meals/${r.slug}`} className="group overflow-hidden rounded-2xl border border-navy-100/60 bg-white shadow-premium transition-all hover:shadow-premium-lg hover:-translate-y-0.5">
                  {/* Recipe image hero */}
                  {r.imageUrl ? (
                    <div className="aspect-video w-full overflow-hidden bg-graphite-50">
                      <img
                        src={r.imageUrl}
                        alt={r.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-sage/30">
                      <ChefHat className="h-10 w-10 text-teal/40" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-[10px]">{r.category}</Badge>
                      {r.difficulty && <Badge variant={r.difficulty === "easy" ? "success" : "warning"} className="text-[10px]">{r.difficulty}</Badge>}
                    </div>
                    <h3 className="text-sm font-bold text-navy group-hover:text-teal transition-colors">{r.title}</h3>
                    <div className="mt-3 flex items-center gap-4 text-xs text-graphite-400">
                      <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> {r.calories} cal</span>
                      <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {r.proteinG}g protein</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {(r.prepMinutes || 0) + (r.cookMinutes || 0)} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-graphite-400">Members get 100+ recipes, weekly meal plans, and grocery lists.</p>
            </div>
          </SectionShell>
        </section>
      )}

      {/* Pricing */}
      <section className="py-20">
        <SectionShell className="text-center max-w-2xl">
          <SectionHeading title="Available with Premium and Complete plans" description="Meal plans and recipes are included in our Premium ($379/mo) and Complete ($599/mo) membership plans. Or add as a standalone subscription for $19/mo with any plan." />
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/pricing"><Button size="lg" className="gap-2">See All Plans <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
          <p className="mt-6 text-xs text-graphite-300">
            Meal plans are nutritional wellness tools, not medical treatment. They complement but do not replace your provider-directed treatment plan.
          </p>
        </SectionShell>
      </section>

      <section className="py-12 border-t border-navy-100/40 bg-navy-50/30">
        <SectionShell>
          <p className="text-xs font-semibold uppercase tracking-wider text-graphite-400 mb-4">Related nutrition guides</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/blog/what-to-eat-on-semaglutide", label: "What to eat on GLP-1" },
              { href: "/blog/protein-intake-guide", label: "Protein intake guide" },
              { href: "/blog/hydration-guide", label: "Hydration guide" },
              { href: "/blog/high-protein-recipes-appetite-changes", label: "High-protein recipes" },
              { href: "/blog/semaglutide-foods-to-avoid", label: "Foods to avoid" },
              { href: "/blog/glp1-nausea-remedies", label: "Nausea remedies" },
              { href: "/calculators/protein", label: "Protein calculator" },
              { href: "/calculators/tdee", label: "Calorie calculator" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="rounded-full border border-navy-100/60 bg-white px-4 py-2 text-sm font-medium text-teal hover:bg-teal hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
