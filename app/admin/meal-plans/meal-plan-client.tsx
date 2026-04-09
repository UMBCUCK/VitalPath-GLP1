"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChefHat, Calendar, Utensils } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  category: string;
  calories: number | null;
  proteinG: number | null;
  prepMinutes: number | null;
}

interface MealPlanItem {
  id: string;
  dayOfWeek: number;
  mealType: string;
  recipe: { title: string; category: string };
}

interface MealPlan {
  id: string;
  title: string;
  slug: string;
  weekNumber: number;
  year: number;
  mode: string;
  isPublished: boolean;
  items: MealPlanItem[];
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

export function MealPlanClient({ recipes, mealPlans }: { recipes: Recipe[]; mealPlans: MealPlan[] }) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [newPlan, setNewPlan] = useState({ title: "", weekNumber: 15, year: 2026, mode: "standard" });
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  function setMeal(day: number, mealType: string, recipeId: string) {
    setAssignments((prev) => ({ ...prev, [`${day}-${mealType}`]: recipeId }));
  }

  const assignedCount = Object.values(assignments).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Meal Plan Builder</h2>
          <p className="text-sm text-graphite-400">Create weekly meal plans by assigning recipes to days</p>
        </div>
        <Button className="gap-2" onClick={() => setShowBuilder(!showBuilder)}>
          <Plus className="h-4 w-4" /> New Week
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-4"><Calendar className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Meal Plans</p><p className="text-xl font-bold text-navy">{mealPlans.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><ChefHat className="h-5 w-5 text-gold-600" /><div><p className="text-xs text-graphite-400">Available Recipes</p><p className="text-xl font-bold text-navy">{recipes.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Utensils className="h-5 w-5 text-atlantic" /><div><p className="text-xs text-graphite-400">Categories</p><p className="text-xl font-bold text-navy">{new Set(recipes.map((r) => r.category)).size}</p></div></CardContent></Card>
      </div>

      {showBuilder && (
        <Card className="border-teal/30">
          <CardHeader>
            <CardTitle className="text-base">Build New Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-4 mb-6">
              <div><label className="block text-xs font-semibold text-navy mb-1">Title</label><Input value={newPlan.title} onChange={(e) => setNewPlan((p) => ({ ...p, title: e.target.value }))} placeholder="Week 15 — Standard" /></div>
              <div><label className="block text-xs font-semibold text-navy mb-1">Week #</label><Input type="number" value={newPlan.weekNumber} onChange={(e) => setNewPlan((p) => ({ ...p, weekNumber: parseInt(e.target.value) }))} /></div>
              <div><label className="block text-xs font-semibold text-navy mb-1">Year</label><Input type="number" value={newPlan.year} onChange={(e) => setNewPlan((p) => ({ ...p, year: parseInt(e.target.value) }))} /></div>
              <div><label className="block text-xs font-semibold text-navy mb-1">Mode</label>
                <select value={newPlan.mode} onChange={(e) => setNewPlan((p) => ({ ...p, mode: e.target.value }))} className="calculator-input text-sm">
                  <option value="standard">Standard</option>
                  <option value="high_protein">High Protein</option>
                  <option value="low_effort">Low Effort</option>
                  <option value="family">Family</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-navy-100/40">
                    <th className="px-2 py-2 text-left font-medium text-graphite-400 w-20">Day</th>
                    {mealTypes.map((t) => (
                      <th key={t} className="px-2 py-2 text-left font-medium text-graphite-400 capitalize">{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, dayIdx) => (
                    <tr key={day} className="border-b border-navy-100/20">
                      <td className="px-2 py-2 font-medium text-navy">{day}</td>
                      {mealTypes.map((mealType) => (
                        <td key={mealType} className="px-2 py-2">
                          <select
                            value={assignments[`${dayIdx}-${mealType}`] || ""}
                            onChange={(e) => setMeal(dayIdx, mealType, e.target.value)}
                            className="w-full rounded-lg border border-navy-200 bg-white px-2 py-1.5 text-xs text-navy"
                          >
                            <option value="">Select...</option>
                            {recipes
                              .filter((r) => {
                                if (mealType === "breakfast") return ["BREAKFAST", "SMOOTHIE"].includes(r.category);
                                if (mealType === "lunch") return ["LUNCH", "MEAL_PREP"].includes(r.category);
                                if (mealType === "dinner") return ["DINNER", "MEAL_PREP"].includes(r.category);
                                return ["SNACK", "SMOOTHIE"].includes(r.category);
                              })
                              .map((r) => (
                                <option key={r.id} value={r.id}>{r.title} ({r.calories}cal, {r.proteinG}g)</option>
                              ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-graphite-400">{assignedCount} meals assigned</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowBuilder(false)}>Cancel</Button>
                <Button size="sm" disabled={assignedCount < 7}>Save Meal Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing meal plans */}
      <Card>
        <CardHeader><CardTitle className="text-base">Published Meal Plans</CardTitle></CardHeader>
        <CardContent>
          {mealPlans.length === 0 ? (
            <p className="py-8 text-center text-sm text-graphite-300">No meal plans yet. Create your first week above.</p>
          ) : (
            <div className="space-y-3">
              {mealPlans.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between rounded-xl border border-navy-100/40 p-4">
                  <div>
                    <p className="text-sm font-bold text-navy">{plan.title || `Week ${plan.weekNumber}, ${plan.year}`}</p>
                    <p className="text-xs text-graphite-400">{plan.items.length} meals &middot; {plan.mode} mode</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={plan.isPublished ? "success" : "secondary"}>
                      {plan.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
