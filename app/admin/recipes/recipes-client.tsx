"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef, exportToCSV } from "@/components/admin/data-table";
import { cn } from "@/lib/utils";
import {
  ChefHat, Flame, Target, Clock, Check, Minus,
  ToggleLeft, ToggleRight,
} from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  fiberG: number | null;
  prepMinutes: number | null;
  cookMinutes: number | null;
  servings: number | null;
  difficulty: string | null;
  tierRequired: string | null;
  isPublished: boolean;
  isGlp1Friendly: boolean;
  createdAt: string;
}

interface Props {
  initialRecipes: Recipe[];
  total: number;
  page: number;
  limit: number;
  search: string;
  category: string;
  published: string;
}

const CATEGORIES = [
  "BREAKFAST", "LUNCH", "DINNER", "SNACK", "SMOOTHIE",
  "MEAL_PREP", "HIGH_PROTEIN", "LOW_EFFORT", "FAMILY",
];

const difficultyVariant = (d: string | null) => {
  if (d === "easy") return "success";
  if (d === "medium") return "warning";
  if (d === "advanced") return "destructive";
  return "secondary";
};

export function RecipesClient({ initialRecipes, total, page, limit, search, category, published }: Props) {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [toggling, setToggling] = useState<string | null>(null);

  // Navigation helper — pushes new searchParams
  const navigate = useCallback((params: Record<string, string>) => {
    const sp = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    window.location.search = sp.toString();
  }, []);

  async function togglePublished(id: string) {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe || toggling) return;
    setToggling(id);
    try {
      const res = await fetch("/api/admin/recipes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !recipe.isPublished }),
      });
      if (res.ok) {
        setRecipes((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isPublished: !r.isPublished } : r))
        );
      }
    } finally {
      setToggling(null);
    }
  }

  const columns: ColumnDef<Recipe>[] = [
    {
      key: "title",
      header: "Recipe",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 min-w-[200px]">
          <ChefHat className="h-4 w-4 text-teal shrink-0" />
          <div>
            <p className="font-semibold text-navy">{row.title}</p>
            <p className="text-[10px] text-graphite-400 font-mono">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (row) => (
        <Badge variant="secondary" className="text-[10px]">
          {row.category.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "calories",
      header: "Calories / Protein",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 text-xs text-graphite-500">
          <span className="flex items-center gap-0.5">
            <Flame className="h-3 w-3" />
            {row.calories ?? "--"}
          </span>
          <span className="flex items-center gap-0.5">
            <Target className="h-3 w-3" />
            {row.proteinG != null ? `${row.proteinG}g` : "--"}
          </span>
        </div>
      ),
    },
    {
      key: "time",
      header: "Time",
      render: (row) => (
        <span className="flex items-center gap-0.5 text-xs text-graphite-500">
          <Clock className="h-3 w-3" />
          {row.prepMinutes ?? 0}+{row.cookMinutes ?? 0} min
        </span>
      ),
    },
    {
      key: "difficulty",
      header: "Difficulty",
      sortable: true,
      render: (row) => (
        <Badge variant={difficultyVariant(row.difficulty) as any} className="text-[10px] capitalize">
          {row.difficulty || "unknown"}
        </Badge>
      ),
    },
    {
      key: "isPublished",
      header: "Published",
      sortable: true,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePublished(row.id);
          }}
          disabled={toggling === row.id}
          className="disabled:opacity-50"
        >
          {row.isPublished ? (
            <ToggleRight className="h-5 w-5 text-teal" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-graphite-300" />
          )}
        </button>
      ),
    },
    {
      key: "isGlp1Friendly",
      header: "GLP-1",
      render: (row) =>
        row.isGlp1Friendly ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Minus className="h-4 w-4 text-graphite-300" />
        ),
    },
  ];

  const publishedCount = recipes.filter((r) => r.isPublished).length;
  const glp1Count = recipes.filter((r) => r.isGlp1Friendly).length;
  const premiumCount = recipes.filter((r) => r.tierRequired).length;

  function handleExportCSV() {
    exportToCSV(
      recipes,
      [
        { key: "title", header: "Title", getValue: (r) => r.title },
        { key: "slug", header: "Slug", getValue: (r) => r.slug },
        { key: "category", header: "Category", getValue: (r) => r.category },
        { key: "calories", header: "Calories", getValue: (r) => String(r.calories ?? "") },
        { key: "proteinG", header: "Protein (g)", getValue: (r) => String(r.proteinG ?? "") },
        { key: "prepMinutes", header: "Prep (min)", getValue: (r) => String(r.prepMinutes ?? "") },
        { key: "cookMinutes", header: "Cook (min)", getValue: (r) => String(r.cookMinutes ?? "") },
        { key: "difficulty", header: "Difficulty", getValue: (r) => r.difficulty || "" },
        { key: "isPublished", header: "Published", getValue: (r) => r.isPublished ? "Yes" : "No" },
        { key: "isGlp1Friendly", header: "GLP-1 Friendly", getValue: (r) => r.isGlp1Friendly ? "Yes" : "No" },
        { key: "tierRequired", header: "Tier", getValue: (r) => r.tierRequired || "Free" },
      ],
      "recipes"
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Recipes</h2>
        <p className="text-sm text-graphite-400">
          Manage recipe content, nutrition data, and tier access
        </p>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-graphite-400">Total Recipes</p>
            <p className="text-2xl font-bold text-navy">{total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-graphite-400">Published</p>
            <p className="text-2xl font-bold text-teal">{publishedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-graphite-400">GLP-1 Friendly</p>
            <p className="text-2xl font-bold text-navy">{glp1Count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-graphite-400">Premium Only</p>
            <p className="text-2xl font-bold text-navy">{premiumCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={recipes}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        search={search}
        onPageChange={(p) => navigate({ page: String(p) })}
        onLimitChange={(l) => navigate({ limit: String(l), page: "1" })}
        onSearchChange={(s) => navigate({ search: s, page: "1" })}
        searchPlaceholder="Search recipes..."
        filters={[
          {
            key: "category",
            label: "Category",
            options: [
              { label: "All Categories", value: "" },
              ...CATEGORIES.map((c) => ({ label: c.replace(/_/g, " "), value: c })),
            ],
          },
          {
            key: "published",
            label: "Status",
            options: [
              { label: "All", value: "" },
              { label: "Published", value: "true" },
              { label: "Draft", value: "false" },
            ],
          },
        ]}
        activeFilters={{ category, published }}
        onFilterChange={(key, value) => navigate({ [key]: value, page: "1" })}
        onExportCSV={handleExportCSV}
        getRowId={(r) => r.id}
        emptyMessage="No recipes match your filters"
      />
    </div>
  );
}
