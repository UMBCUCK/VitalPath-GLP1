import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Flame, Target, Users, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { RecipeJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  const recipes = await db.recipe.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return recipes.map((r) => ({ slug: r.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await db.recipe.findUnique({ where: { slug } });
  if (!recipe) return { title: "Recipe Not Found" };
  return {
    title: `${recipe.title} — High-Protein Recipe`,
    description: `${recipe.title}: ${recipe.calories} cal, ${recipe.proteinG}g protein. Ready in ${(recipe.prepMinutes || 0) + (recipe.cookMinutes || 0)} minutes. Free GLP-1-friendly recipe from VitalPath.`,
    openGraph: {
      title: `${recipe.title} | VitalPath Recipes`,
      description: `${recipe.calories} cal, ${recipe.proteinG}g protein. ${recipe.difficulty} difficulty. GLP-1-friendly recipe.`,
    },
  };
}

export default async function PublicRecipePage({ params }: PageProps) {
  const { slug } = await params;
  const recipe = await db.recipe.findUnique({ where: { slug } });
  if (!recipe || !recipe.isPublished) notFound();

  const ingredients = Array.isArray(recipe.ingredients) ? (recipe.ingredients as string[]) : [];
  const instructions = Array.isArray(recipe.instructions) ? (recipe.instructions as string[]) : [];
  const tips = typeof recipe.tips === "string" ? recipe.tips : "";

  return (
    <MarketingShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Meals & Recipes", href: "/meals" },
          { name: recipe.title, href: `/meals/${recipe.slug}` },
        ]}
      />
      <RecipeJsonLd
        name={recipe.title}
        description={`${recipe.title} — a high-protein, GLP-1-friendly recipe with ${recipe.proteinG}g protein and ${recipe.calories} calories.`}
        prepTime={recipe.prepMinutes || 0}
        cookTime={recipe.cookMinutes || 0}
        servings={recipe.servings || 1}
        calories={recipe.calories || 0}
        protein={recipe.proteinG || 0}
        ingredients={ingredients}
        instructions={instructions}
        slug={recipe.slug}
      />

      <article className="py-12">
        <SectionShell className="max-w-3xl">
          <Link href="/meals" className="inline-flex items-center gap-1.5 text-sm text-graphite-400 hover:text-navy transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> All Recipes
          </Link>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary">{recipe.category}</Badge>
            {recipe.difficulty && <Badge variant={recipe.difficulty === "easy" ? "success" : "warning"}>{recipe.difficulty}</Badge>}
            {recipe.isGlp1Friendly && <Badge variant="default">GLP-1 Friendly</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">{recipe.title}</h1>

          {/* Nutrition stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl bg-navy-50/30 p-3">
              <Flame className="h-4 w-4 text-gold-600" />
              <div><p className="text-xs text-graphite-400">Calories</p><p className="font-bold text-navy">{recipe.calories}</p></div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-navy-50/30 p-3">
              <Target className="h-4 w-4 text-teal" />
              <div><p className="text-xs text-graphite-400">Protein</p><p className="font-bold text-navy">{recipe.proteinG}g</p></div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-navy-50/30 p-3">
              <Clock className="h-4 w-4 text-atlantic" />
              <div><p className="text-xs text-graphite-400">Time</p><p className="font-bold text-navy">{(recipe.prepMinutes || 0) + (recipe.cookMinutes || 0)} min</p></div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-navy-50/30 p-3">
              <Users className="h-4 w-4 text-graphite-400" />
              <div><p className="text-xs text-graphite-400">Servings</p><p className="font-bold text-navy">{recipe.servings}</p></div>
            </div>
          </div>

          {/* Macros detail */}
          {(recipe.carbsG || recipe.fatG || recipe.fiberG) && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-graphite-500">
              {recipe.carbsG && <span>Carbs: <strong>{recipe.carbsG}g</strong></span>}
              {recipe.fatG && <span>Fat: <strong>{recipe.fatG}g</strong></span>}
              {recipe.fiberG && <span>Fiber: <strong>{recipe.fiberG}g</strong></span>}
            </div>
          )}

          {/* Ingredients */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-navy mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {ingredients.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-graphite-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-navy mb-4">Instructions</h2>
            <ol className="space-y-4">
              {instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal text-white text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-graphite-600 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {tips && (
            <div className="mt-10 rounded-2xl bg-teal-50 border border-teal-100 p-6">
              <h3 className="text-base font-bold text-navy mb-2">Pro Tip</h3>
              <p className="text-sm leading-relaxed text-graphite-600">{tips}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-teal-50 to-sage p-8 text-center">
            <h3 className="text-xl font-bold text-navy">Want weekly meal plans like this?</h3>
            <p className="mt-2 text-sm text-graphite-500">
              VitalPath Premium includes personalized weekly meal plans, grocery lists, and 100+ GLP-1-friendly recipes.
            </p>
            <Link href="/quiz">
              <Button className="mt-4 gap-2">
                See If You Qualify <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Related links */}
          <div className="mt-8 flex flex-wrap gap-3 text-xs">
            <Link href="/blog/best-high-protein-foods-weight-loss" className="rounded-lg bg-navy-50/30 px-3 py-2 text-graphite-500 hover:text-teal transition-colors">
              20 best protein foods →
            </Link>
            <Link href="/blog/7-day-high-protein-meal-plan-weight-loss" className="rounded-lg bg-navy-50/30 px-3 py-2 text-graphite-500 hover:text-teal transition-colors">
              7-day meal plan →
            </Link>
            <Link href="/calculators/protein" className="rounded-lg bg-navy-50/30 px-3 py-2 text-graphite-500 hover:text-teal transition-colors">
              Protein calculator →
            </Link>
          </div>
        </SectionShell>
      </article>
    </MarketingShell>
  );
}
