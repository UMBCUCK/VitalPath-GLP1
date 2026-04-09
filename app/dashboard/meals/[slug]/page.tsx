import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Flame, Target, Users, Printer, Check } from "lucide-react";

type PageProps = { params: Promise<{ slug: string }> };

export default async function RecipeDetailPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { slug } = await params;
  const recipe = await db.recipe.findUnique({ where: { slug } });
  if (!recipe || !recipe.isPublished) notFound();

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients as string[] : [];
  const instructions = Array.isArray(recipe.instructions) ? recipe.instructions as string[] : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/dashboard/meals" className="inline-flex items-center gap-1.5 text-sm text-graphite-400 hover:text-navy transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Recipes
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{recipe.category}</Badge>
          {recipe.difficulty && <Badge variant={recipe.difficulty === "easy" ? "success" : "warning"}>{recipe.difficulty}</Badge>}
          {recipe.tierRequired && <Badge variant="gold">{recipe.tierRequired} plan</Badge>}
          {recipe.isGlp1Friendly && <Badge variant="default">GLP-1 friendly</Badge>}
        </div>
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">{recipe.title}</h1>
        {recipe.description && <p className="mt-2 text-graphite-500">{recipe.description}</p>}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { icon: Flame, label: "Calories", value: recipe.calories ? String(recipe.calories) : "—" },
          { icon: Target, label: "Protein", value: recipe.proteinG ? `${recipe.proteinG}g` : "—" },
          { icon: Clock, label: "Prep", value: recipe.prepMinutes ? `${recipe.prepMinutes} min` : "—" },
          { icon: Clock, label: "Cook", value: recipe.cookMinutes ? `${recipe.cookMinutes} min` : "—" },
          { icon: Users, label: "Servings", value: recipe.servings ? String(recipe.servings) : "—" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-navy-50/50 p-3 text-center">
            <s.icon className="mx-auto h-4 w-4 text-teal mb-1" />
            <p className="text-lg font-bold text-navy">{s.value}</p>
            <p className="text-[10px] text-graphite-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Macros breakdown */}
      <Card>
        <CardContent className="p-5">
          <h2 className="text-sm font-bold text-navy mb-3">Nutrition per Serving</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Calories", value: recipe.calories, unit: "", color: "bg-teal" },
              { label: "Protein", value: recipe.proteinG, unit: "g", color: "bg-gold" },
              { label: "Carbs", value: recipe.carbsG, unit: "g", color: "bg-atlantic" },
              { label: "Fat", value: recipe.fatG, unit: "g", color: "bg-navy-400" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className={`mx-auto h-2 w-full rounded-full ${m.color} opacity-20 mb-2`}>
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${Math.min(100, ((m.value || 0) / (m.label === "Calories" ? 600 : 60)) * 100)}%` }} />
                </div>
                <p className="text-xl font-bold text-navy">{m.value ?? "—"}{m.unit}</p>
                <p className="text-xs text-graphite-400">{m.label}</p>
              </div>
            ))}
          </div>
          {recipe.fiberG && <p className="mt-3 text-xs text-graphite-400">Fiber: {recipe.fiberG}g</p>}
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Ingredients */}
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-bold text-navy mb-3">Ingredients</h2>
            <ul className="space-y-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span className="text-sm text-graphite-600">{ing}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="p-5">
            <h2 className="text-sm font-bold text-navy mb-3">Instructions</h2>
            <ol className="space-y-3">
              {instructions.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal">{i + 1}</span>
                  <span className="text-sm text-graphite-600 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      {recipe.tips && (
        <div className="rounded-xl bg-gold-50/50 border border-gold-200/30 px-5 py-4">
          <p className="text-sm text-gold-800"><span className="font-bold">Pro Tip:</span> {recipe.tips}</p>
        </div>
      )}

      {/* Print button */}
      <div className="flex justify-center print:hidden">
        <Button variant="outline" className="gap-2" onClick={() => typeof window !== "undefined" && window.print()}>
          <Printer className="h-4 w-4" /> Print Recipe
        </Button>
      </div>
    </div>
  );
}
