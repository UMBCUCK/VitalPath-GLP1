"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Plus, ChefHat, Calendar, Utensils, ChevronDown, ChevronUp,
  ToggleLeft, ToggleRight, Loader2, Trash2,
} from "lucide-react";

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
  sortOrder: number;
  recipe: {
    id: string;
    title: string;
    category: string;
    calories: number | null;
    proteinG: number | null;
  };
}

interface MealPlan {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  weekNumber: number;
  year: number;
  mode: string;
  tierRequired: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  items: MealPlanItem[];
}

interface Props {
  initialMealPlans: MealPlan[];
  recipes: Recipe[];
  total: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];
const MODE_LABELS: Record<string, string> = {
  standard: "Standard",
  high_protein: "High Protein",
  low_effort: "Low Effort",
  family: "Family",
};
const MODE_COLORS: Record<string, string> = {
  standard: "secondary",
  high_protein: "success",
  low_effort: "warning",
  family: "gold",
};

export function MealPlansClient({ initialMealPlans, recipes, total }: Props) {
  const router = useRouter();
  const [mealPlans, setMealPlans] = useState(initialMealPlans);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");

  // Builder state
  const [showBuilder, setShowBuilder] = useState(false);
  const [newPlan, setNewPlan] = useState({ title: "", weekNumber: 15, year: 2026, mode: "standard" });
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function setMeal(day: number, mealType: string, recipeId: string) {
    setAssignments((prev) => ({ ...prev, [`${day}-${mealType}`]: recipeId }));
  }

  const assignedCount = Object.values(assignments).filter(Boolean).length;

  async function togglePublished(id: string) {
    const plan = mealPlans.find((p) => p.id === id);
    if (!plan || toggling) return;
    setToggling(id);
    // Optimistic update
    setMealPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
    try {
      const res = await fetch("/api/admin/meal-plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !plan.isPublished }),
      });
      if (!res.ok) {
        // Revert on failure
        setMealPlans((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPublished: plan.isPublished } : p))
        );
      }
    } catch {
      setMealPlans((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: plan.isPublished } : p))
      );
    } finally {
      setToggling(null);
    }
  }

  async function deletePlan(id: string, title: string) {
    if (!confirm(`Delete meal plan "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/meal-plans?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMealPlans((prev) => prev.filter((p) => p.id !== id));
        if (expandedId === id) setExpandedId(null);
      } else {
        alert("Failed to delete meal plan.");
      }
    } catch {
      alert("Failed to delete meal plan.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSavePlan(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    if (!newPlan.title.trim()) { setSaveError("Title is required."); return; }
    if (assignedCount < 7) { setSaveError("Assign at least 7 meals before saving."); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/meal-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPlan, assignments }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Failed to save meal plan.");
        return;
      }
      setMealPlans((prev) => [data.plan, ...prev]);
      setShowBuilder(false);
      setNewPlan({ title: "", weekNumber: 15, year: 2026, mode: "standard" });
      setAssignments({});
      router.refresh();
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Calendar view for an expanded meal plan
  function CalendarView({ plan }: { plan: MealPlan }) {
    // Build a lookup: items[dayOfWeek][mealType] = recipe
    const grid: Record<number, Record<string, MealPlanItem>> = {};
    for (const item of plan.items) {
      if (!grid[item.dayOfWeek]) grid[item.dayOfWeek] = {};
      grid[item.dayOfWeek][item.mealType] = item;
    }

    // Calculate daily totals
    const dailyCalories: Record<number, number> = {};
    const dailyProtein: Record<number, number> = {};
    for (let d = 0; d < 7; d++) {
      dailyCalories[d] = 0;
      dailyProtein[d] = 0;
      for (const mt of MEAL_TYPES) {
        const item = grid[d]?.[mt];
        if (item?.recipe) {
          dailyCalories[d] += item.recipe.calories || 0;
          dailyProtein[d] += item.recipe.proteinG || 0;
        }
      }
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-navy-100/40">
              <th className="px-2 py-2 text-left font-medium text-graphite-400 w-20">Meal</th>
              {DAYS.map((day, i) => (
                <th key={day} className="px-2 py-2 text-center font-medium text-graphite-400 min-w-[110px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEAL_TYPES.map((mealType) => (
              <tr key={mealType} className="border-b border-navy-100/20">
                <td className="px-2 py-2 font-medium text-navy capitalize">{mealType}</td>
                {DAYS.map((_, dayIdx) => {
                  const item = grid[dayIdx]?.[mealType];
                  return (
                    <td key={dayIdx} className="px-1 py-1">
                      {item ? (
                        <div className="rounded-lg bg-teal-50/40 border border-teal-100/60 p-1.5">
                          <p className="font-medium text-navy text-[11px] leading-tight line-clamp-2">
                            {item.recipe.title}
                          </p>
                          <p className="text-[9px] text-graphite-400 mt-0.5">
                            {item.recipe.calories || 0} cal &middot; {item.recipe.proteinG || 0}g
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-navy-100/40 p-1.5 text-center text-graphite-300">
                          --
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {/* Daily totals row */}
            <tr className="bg-navy-50/30">
              <td className="px-2 py-2 font-semibold text-navy text-[11px]">Daily</td>
              {DAYS.map((_, dayIdx) => (
                <td key={dayIdx} className="px-1 py-2 text-center">
                  <p className="text-[10px] font-semibold text-navy">{dailyCalories[dayIdx]} cal</p>
                  <p className="text-[9px] text-graphite-400">{dailyProtein[dayIdx]}g protein</p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const publishedCount = mealPlans.filter((p) => p.isPublished).length;
  const uniqueModes = new Set(mealPlans.map((p) => p.mode));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Meal Plan Builder</h2>
          <p className="text-sm text-graphite-400">
            Create weekly meal plans by assigning recipes to days
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowBuilder(!showBuilder)}>
          <Plus className="h-4 w-4" /> New Week
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Calendar className="h-5 w-5 text-teal" />
            <div>
              <p className="text-xs text-graphite-400">Total Plans</p>
              <p className="text-xl font-bold text-navy">{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ToggleRight className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-graphite-400">Published</p>
              <p className="text-xl font-bold text-teal">{publishedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ChefHat className="h-5 w-5 text-gold-600" />
            <div>
              <p className="text-xs text-graphite-400">Available Recipes</p>
              <p className="text-xl font-bold text-navy">{recipes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Utensils className="h-5 w-5 text-atlantic" />
            <div>
              <p className="text-xs text-graphite-400">Modes</p>
              <p className="text-xl font-bold text-navy">{uniqueModes.size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Builder */}
      {showBuilder && (
        <Card className="border-teal/30">
          <CardHeader>
            <CardTitle className="text-base">Build New Week</CardTitle>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSavePlan}>
            <div className="grid gap-3 sm:grid-cols-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Title</label>
                <Input
                  value={newPlan.title}
                  onChange={(e) => setNewPlan((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Week 15 - Standard"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Week #</label>
                <Input
                  type="number"
                  value={newPlan.weekNumber}
                  onChange={(e) => setNewPlan((p) => ({ ...p, weekNumber: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Year</label>
                <Input
                  type="number"
                  value={newPlan.year}
                  onChange={(e) => setNewPlan((p) => ({ ...p, year: parseInt(e.target.value) || 2026 }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Mode</label>
                <select
                  value={newPlan.mode}
                  onChange={(e) => setNewPlan((p) => ({ ...p, mode: e.target.value }))}
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
                >
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
                    {MEAL_TYPES.map((t) => (
                      <th key={t} className="px-2 py-2 text-left font-medium text-graphite-400 capitalize">
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS_FULL.map((day, dayIdx) => (
                    <tr key={day} className="border-b border-navy-100/20">
                      <td className="px-2 py-2 font-medium text-navy">{day}</td>
                      {MEAL_TYPES.map((mealType) => (
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
                                if (mealType === "lunch") return ["LUNCH", "MEAL_PREP", "HIGH_PROTEIN"].includes(r.category);
                                if (mealType === "dinner") return ["DINNER", "MEAL_PREP", "HIGH_PROTEIN"].includes(r.category);
                                return ["SNACK", "SMOOTHIE"].includes(r.category);
                              })
                              .map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.title} ({r.calories ?? 0}cal, {r.proteinG ?? 0}g)
                                </option>
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
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowBuilder(false); setSaveError(""); }}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Saving…</> : "Save Meal Plan"}
                </Button>
              </div>
            </div>
            {saveError && <p className="mt-2 text-xs text-red-500">{saveError}</p>}
          </form>
          </CardContent>
        </Card>
      )}

      {/* Meal Plan Cards */}
      <div className="space-y-4">
        {mealPlans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-graphite-300">
              No meal plans yet. Create your first week above.
            </CardContent>
          </Card>
        ) : (
          mealPlans.map((plan) => {
            const isExpanded = expandedId === plan.id;
            return (
              <Card
                key={plan.id}
                className={cn(
                  "transition-all",
                  isExpanded && "ring-1 ring-teal/20 border-teal/30"
                )}
              >
                {/* Card header */}
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : plan.id)}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-graphite-400">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-bold text-navy">
                        {plan.title || `Week ${plan.weekNumber}, ${plan.year}`}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-graphite-400">
                          Week {plan.weekNumber}, {plan.year}
                        </span>
                        <span className="text-graphite-300">&middot;</span>
                        <span className="text-xs text-graphite-400">
                          {plan.items.length} meals
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={(MODE_COLORS[plan.mode] || "secondary") as any} className="text-[10px]">
                      {MODE_LABELS[plan.mode] || plan.mode}
                    </Badge>
                    {plan.tierRequired && (
                      <Badge variant="gold" className="text-[10px]">
                        {plan.tierRequired}
                      </Badge>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePublished(plan.id);
                      }}
                      disabled={toggling === plan.id}
                      className="disabled:opacity-50"
                    >
                      {plan.isPublished ? (
                        <ToggleRight className="h-5 w-5 text-teal" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-graphite-300" />
                      )}
                    </button>
                    <Badge variant={plan.isPublished ? "success" : "secondary"} className="text-[10px]">
                      {plan.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePlan(plan.id, plan.title || `Week ${plan.weekNumber}, ${plan.year}`);
                      }}
                      disabled={deletingId === plan.id}
                      className="text-graphite-300 hover:text-red-500 transition-colors disabled:opacity-50 ml-1"
                      title="Delete meal plan"
                    >
                      {deletingId === plan.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded calendar view */}
                {isExpanded && (
                  <div className="border-t border-navy-100/40 px-6 py-4 bg-linen/20">
                    {plan.items.length === 0 ? (
                      <p className="py-6 text-center text-sm text-graphite-300">
                        No meals assigned to this plan yet.
                      </p>
                    ) : (
                      <CalendarView plan={plan} />
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
