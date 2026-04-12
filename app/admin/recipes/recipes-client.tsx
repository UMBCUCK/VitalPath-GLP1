"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef, exportToCSV } from "@/components/admin/data-table";
import { ImageUploader } from "@/components/ui/image-uploader";
import { cn } from "@/lib/utils";
import {
  ChefHat, Flame, Target, Clock, Check, Minus,
  ToggleLeft, ToggleRight, ImageIcon, X,
} from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
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

// ── Inline image editor per recipe ───────────────────────────────────────────
function RecipeImageCell({ recipe, onUpdate }: { recipe: Recipe; onUpdate: (id: string, url: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(recipe.imageUrl);

  async function save(url: string | null) {
    setSaving(true);
    try {
      await fetch("/api/admin/recipes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recipe.id, imageUrl: url }),
      });
      onUpdate(recipe.id, url);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] font-medium transition-all",
          recipe.imageUrl
            ? "border-teal/30 bg-teal-50 text-teal-700 hover:border-teal"
            : "border-navy-100 text-graphite-400 hover:border-navy-300 hover:text-navy hover:bg-navy-50"
        )}
        title={recipe.imageUrl ? "Change image" : "Add image"}
      >
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt="" className="h-5 w-5 rounded object-cover" />
          : <ImageIcon className="h-3.5 w-3.5" />}
        {recipe.imageUrl ? "Image ✓" : "Add image"}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-navy-100 bg-white shadow-xl p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-navy">Recipe Image</span>
            <button onClick={() => setOpen(false)} className="text-graphite-300 hover:text-navy">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ImageUploader
            value={pendingUrl}
            onChange={(url) => setPendingUrl(url)}
            hint="Square or 4:3 works best for recipe cards."
            defaultAspect={4 / 3}
          />
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="flex-1 h-8 text-xs" disabled={saving} onClick={() => save(pendingUrl)}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
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

  function updateImage(id: string, url: string | null) {
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, imageUrl: url } : r));
  }

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
      key: "imageUrl",
      header: "Image",
      render: (row) => <RecipeImageCell recipe={row} onUpdate={updateImage} />,
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
