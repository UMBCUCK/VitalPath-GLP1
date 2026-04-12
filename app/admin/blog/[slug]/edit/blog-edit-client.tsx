"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/ui/image-uploader";
import {
  ArrowLeft, Save, Eye, ToggleLeft, ToggleRight, Check, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  imageUrl: string | null;
  author: string | null;
  category: string | null;
  tags: unknown;
  isPublished: boolean;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  post: BlogPost;
}

const BLOG_CATEGORIES = ["education", "nutrition", "medication", "lifestyle", "news"];

export function BlogEditClient({ post: initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial.title,
    slug: initial.slug,
    excerpt: initial.excerpt || "",
    content: initial.content,
    imageUrl: initial.imageUrl || "",
    author: initial.author || "",
    category: initial.category || "",
    tags: Array.isArray(initial.tags) ? (initial.tags as string[]).join(", ") : "",
    isPublished: initial.isPublished,
    publishedAt: initial.publishedAt
      ? new Date(initial.publishedAt).toISOString().slice(0, 16)
      : "",
    seoTitle: initial.seoTitle || "",
    seoDescription: initial.seoDescription || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const updateField = useCallback(
    <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
      setSaved(false);
    },
    []
  );

  // Auto-generate slug from title
  function handleTitleChange(value: string) {
    updateField("title", value);
    if (initial.title === "Untitled Article" || !initial.slug.includes("-")) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      updateField("slug", slug);
    }
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const tagsArray = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initial.id,
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt || null,
          content: form.content,
          imageUrl: form.imageUrl || null,
          author: form.author || null,
          category: form.category || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          isPublished: form.isPublished,
          publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      setSaved(true);
      // If slug changed, redirect to the new URL
      if (form.slug !== initial.slug) {
        router.push(`/admin/blog/${form.slug}/edit`);
      }
    } finally {
      setSaving(false);
    }
  }

  const seoComplete = !!form.seoTitle && !!form.seoDescription;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/blog")}
            className="rounded-lg p-2 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-navy">Edit Article</h2>
            <p className="text-sm text-graphite-400">
              Last updated{" "}
              {new Date(initial.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {form.isPublished && form.slug && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-medium text-graphite-500 hover:bg-navy-50 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </a>
          )}
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              "Saving..."
            ) : saved ? (
              <>
                <Check className="h-4 w-4" /> Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content — spans 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Article title"
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Slug</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-graphite-400">/blog/</span>
                  <Input
                    value={form.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="article-slug"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  placeholder="Brief summary for listings and social cards..."
                  rows={2}
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content (Markdown)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <textarea
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="Write your article content in Markdown..."
                rows={20}
                className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 font-mono text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30 resize-y"
              />
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className={cn(seoComplete ? "border-teal/30" : "border-amber-200")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">SEO</CardTitle>
                <Badge variant={seoComplete ? "success" : "warning"} className="text-[10px]">
                  {seoComplete ? "Complete" : "Incomplete"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  SEO Title
                  <span className="font-normal text-graphite-400 ml-1">
                    ({form.seoTitle.length}/60)
                  </span>
                </label>
                <Input
                  value={form.seoTitle}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  placeholder="SEO-optimized title (50-60 chars recommended)"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  SEO Description
                  <span className="font-normal text-graphite-400 ml-1">
                    ({form.seoDescription.length}/160)
                  </span>
                </label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => updateField("seoDescription", e.target.value)}
                  placeholder="Meta description for search engines (120-160 chars recommended)"
                  rows={2}
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy placeholder:text-graphite-300 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30 resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — 1 col */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-navy">Published</span>
                <button onClick={() => updateField("isPublished", !form.isPublished)}>
                  {form.isPublished ? (
                    <ToggleRight className="h-6 w-6 text-teal" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-graphite-300" />
                  )}
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Publish Date
                </label>
                <Input
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) => updateField("publishedAt", e.target.value)}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Author */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
                >
                  <option value="">Select category</option>
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Author</label>
                <Input
                  value={form.author}
                  onChange={(e) => updateField("author", e.target.value)}
                  placeholder="Author name"
                />
              </div>
              <div>
                <ImageUploader
                  label="Cover Image"
                  value={form.imageUrl || null}
                  onChange={(url) => updateField("imageUrl", url ?? "")}
                  hint="Shown as the blog post header and in social previews."
                  defaultAspect={16 / 9}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">
                  Tags
                  <span className="font-normal text-graphite-400 ml-1">(comma-separated)</span>
                </label>
                <Input
                  value={form.tags}
                  onChange={(e) => updateField("tags", e.target.value)}
                  placeholder="glp-1, nutrition, weight loss"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
