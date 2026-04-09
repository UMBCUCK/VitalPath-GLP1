"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, ChefHat, Target, Clock, Flame, ToggleLeft, ToggleRight } from "lucide-react";

interface RecipeItem {
  id: string;
  title: string;
  category: string;
  calories: number;
  protein: number;
  prepMin: number;
  difficulty: string;
  tierRequired: string | null;
  isPublished: boolean;
  isGlp1Friendly: boolean;
}

const seedRecipes: RecipeItem[] = [
  { id: "1", title: "Greek Yogurt Power Bowl", category: "BREAKFAST", calories: 380, protein: 32, prepMin: 5, difficulty: "easy", tierRequired: null, isPublished: true, isGlp1Friendly: true },
  { id: "2", title: "Grilled Chicken Quinoa Bowl", category: "LUNCH", calories: 520, protein: 45, prepMin: 20, difficulty: "easy", tierRequired: null, isPublished: true, isGlp1Friendly: true },
  { id: "3", title: "Lemon Herb Salmon with Asparagus", category: "DINNER", calories: 480, protein: 42, prepMin: 25, difficulty: "medium", tierRequired: null, isPublished: true, isGlp1Friendly: true },
  { id: "4", title: "Protein Smoothie with Berries", category: "SMOOTHIE", calories: 340, protein: 35, prepMin: 5, difficulty: "easy", tierRequired: null, isPublished: true, isGlp1Friendly: true },
  { id: "5", title: "Turkey & Avocado Lettuce Wraps", category: "LUNCH", calories: 420, protein: 38, prepMin: 10, difficulty: "easy", tierRequired: "premium", isPublished: true, isGlp1Friendly: true },
  { id: "6", title: "Lean Beef Stir Fry", category: "DINNER", calories: 510, protein: 44, prepMin: 20, difficulty: "medium", tierRequired: "premium", isPublished: true, isGlp1Friendly: true },
  { id: "7", title: "Cottage Cheese & Fruit Plate", category: "SNACK", calories: 220, protein: 28, prepMin: 5, difficulty: "easy", tierRequired: null, isPublished: true, isGlp1Friendly: true },
  { id: "8", title: "Baked Chicken Thighs with Sweet Potato", category: "DINNER", calories: 540, protein: 42, prepMin: 30, difficulty: "medium", tierRequired: "complete", isPublished: true, isGlp1Friendly: true },
];

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeItem[]>(seedRecipes);

  function togglePublish(id: string) {
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, isPublished: !r.isPublished } : r));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Recipes</h2>
          <p className="text-sm text-graphite-400">Manage recipe content, nutrition data, and tier access</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Recipe</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Total Recipes</p><p className="text-2xl font-bold text-navy">{recipes.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Published</p><p className="text-2xl font-bold text-teal">{recipes.filter((r) => r.isPublished).length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">GLP-1 Friendly</p><p className="text-2xl font-bold text-navy">{recipes.filter((r) => r.isGlp1Friendly).length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Premium Only</p><p className="text-2xl font-bold text-navy">{recipes.filter((r) => r.tierRequired).length}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100/40 bg-navy-50/30">
                <th className="px-6 py-3 text-left font-medium text-graphite-400">Recipe</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Category</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Nutrition</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Difficulty</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Tier</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Published</th>
                <th className="px-4 py-3 text-right font-medium text-graphite-400">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100/30">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-navy-50/20 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4 text-teal shrink-0" />
                      <span className="font-medium text-navy">{recipe.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{recipe.category}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-graphite-400">
                      <span className="flex items-center gap-0.5"><Flame className="h-3 w-3" />{recipe.calories}</span>
                      <span className="flex items-center gap-0.5"><Target className="h-3 w-3" />{recipe.protein}g</span>
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{recipe.prepMin}m</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={recipe.difficulty === "easy" ? "success" : "warning"} className="text-[10px]">{recipe.difficulty}</Badge></td>
                  <td className="px-4 py-3 text-xs text-graphite-400">{recipe.tierRequired || "Free"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(recipe.id)}>
                      {recipe.isPublished ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy"><Edit2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
