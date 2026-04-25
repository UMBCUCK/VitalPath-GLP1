"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Target, ShoppingCart, Heart, Flame, Star, ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  category: string;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  servings: number | null;
  ingredients: unknown;
  instructions: unknown;
  tips: string | null;
  difficulty: string | null;
  tierRequired: string | null;
  imageUrl: string | null;
}

const categoryLabels: Record<string, string> = {
  BREAKFAST: "Breakfast", LUNCH: "Lunch", DINNER: "Dinner",
  SNACK: "Snack", SMOOTHIE: "Smoothie", MEAL_PREP: "Meal Prep",
  HIGH_PROTEIN: "High Protein", LOW_EFFORT: "Low Effort", FAMILY: "Family",
};

export function MealsClient({ recipes }: { recipes: Recipe[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showGrocery, setShowGrocery] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const categories = [...new Set(recipes.map((r) => r.category))];
  const filtered = filter === "all" ? recipes : recipes.filter((r) => r.category === filter);

  function toggleFavorite(id: string) {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  }

  // Aggregate grocery list from all recipes
  const allIngredients = recipes.flatMap((r) => {
    const ing = r.ingredients;
    return Array.isArray(ing) ? ing as string[] : [];
  });
  const uniqueIngredients = [...new Set(allIngredients)].sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Meals & Recipes</h2>
          <p className="text-sm text-graphite-400">{recipes.length} recipes available</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setShowGrocery(!showGrocery)}>
          <ShoppingCart className="h-4 w-4" />
          {showGrocery ? "View Recipes" : "Grocery List"}
        </Button>
      </div>

      {showGrocery ? (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShoppingCart className="h-4 w-4 text-teal" /> Grocery List</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {uniqueIngredients.map((item, i) => (
                <label key={i} className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-navy-50/30 cursor-pointer transition-colors">
                  <input type="checkbox" className="h-4 w-4 rounded border-navy-300 text-teal focus:ring-teal" />
                  <span className="text-sm text-graphite-600">{item}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-graphite-300">{uniqueIngredients.length} items from {recipes.length} recipes</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button onClick={() => setFilter("all")} className={cn("shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", filter === "all" ? "bg-navy text-white" : "bg-white text-graphite-500 hover:bg-navy-50")}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)} className={cn("shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", filter === cat ? "bg-navy text-white" : "bg-white text-graphite-500 hover:bg-navy-50")}>
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {/* Recipe cards */}
          <div className="space-y-3">
            {filtered.map((recipe) => {
              const isExpanded = expandedId === recipe.id;
              const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients as string[] : [];
              const instructions = Array.isArray(recipe.instructions) ? recipe.instructions as string[] : [];

              return (
                <Card key={recipe.id} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : recipe.id)}
                    className="flex w-full items-center gap-4 p-4 text-left"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-teal-50 to-sage flex items-center justify-center">
                      {recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                            (img.nextElementSibling as HTMLElement | null)?.style.setProperty("display", "flex");
                          }}
                        />
                      ) : null}
                      <ChefHat
                        className={cn("h-5 w-5 text-teal items-center justify-center", recipe.imageUrl ? "hidden" : "flex")}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Badge variant="secondary" className="text-[9px]">{categoryLabels[recipe.category] || recipe.category}</Badge>
                        {recipe.difficulty && <Badge variant={recipe.difficulty === "easy" ? "success" : "warning"} className="text-[9px]">{recipe.difficulty}</Badge>}
                        {recipe.tierRequired && <Badge variant="gold" className="text-[9px]">{recipe.tierRequired}</Badge>}
                      </div>
                      <p className="text-sm font-bold text-navy">{recipe.title}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-graphite-400">
                        {recipe.calories && <span className="flex items-center gap-0.5"><Flame className="h-3 w-3" />{recipe.calories} cal</span>}
                        {recipe.proteinG && <span className="flex items-center gap-0.5"><Target className="h-3 w-3" />{recipe.proteinG}g protein</span>}
                        {recipe.prepMinutes && <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{recipe.prepMinutes + (recipe.cookMinutes || 0)} min</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }} className="p-1.5 rounded-lg hover:bg-navy-50">
                        <Star className={cn("h-4 w-4", favorites.includes(recipe.id) ? "fill-gold text-gold" : "text-graphite-300")} />
                      </button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-graphite-400" /> : <ChevronDown className="h-4 w-4 text-graphite-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <CardContent className="border-t border-navy-100/40 pt-4">
                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Macros */}
                        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
                          {[
                            { label: "Calories", value: recipe.calories },
                            { label: "Protein", value: recipe.proteinG ? `${recipe.proteinG}g` : null },
                            { label: "Carbs", value: recipe.carbsG ? `${recipe.carbsG}g` : null },
                            { label: "Fat", value: recipe.fatG ? `${recipe.fatG}g` : null },
                          ].map((m) => (
                            <div key={m.label} className="rounded-lg bg-navy-50/50 p-2">
                              <p className="text-[11px] text-graphite-400">{m.label}</p>
                              <p className="text-sm font-bold text-navy">{m.value || "—"}</p>
                            </div>
                          ))}
                        </div>

                        <div className="text-xs text-graphite-400">
                          {recipe.servings && <p>Servings: {recipe.servings}</p>}
                          {recipe.prepMinutes && <p>Prep: {recipe.prepMinutes} min</p>}
                          {recipe.cookMinutes && <p>Cook: {recipe.cookMinutes} min</p>}
                        </div>
                      </div>

                      {/* Ingredients */}
                      {ingredients.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-bold text-navy mb-2">Ingredients</p>
                          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                            {ingredients.map((ing, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-graphite-600">
                                <Check className="mt-0.5 h-3 w-3 shrink-0 text-teal" />{ing}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Instructions */}
                      {instructions.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-bold text-navy mb-2">Instructions</p>
                          <ol className="space-y-2">
                            {instructions.map((step, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-graphite-600">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-[10px] font-bold text-teal">{i + 1}</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {recipe.tips && (
                        <div className="mt-4 rounded-lg bg-gold-50/50 border border-gold-200/30 px-3 py-2">
                          <p className="text-xs text-gold-700"><span className="font-bold">Tip:</span> {recipe.tips}</p>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {favorites.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-gold fill-gold" /> Favorites ({favorites.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((id) => {
                    const r = recipes.find((rec) => rec.id === id);
                    return r ? <Badge key={id} variant="gold" className="gap-1">{r.title} <button onClick={() => toggleFavorite(id)}>&times;</button></Badge> : null;
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
