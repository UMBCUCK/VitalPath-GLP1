"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef, exportToCSV } from "@/components/admin/data-table";
import {
  FileText, Plus, Check, Minus, ToggleLeft, ToggleRight,
} from "lucide-react";

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
  initialPosts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  search: string;
  category: string;
  published: string;
}

const BLOG_CATEGORIES = ["education", "nutrition", "medication", "lifestyle", "news"];

export function BlogClient({ initialPosts, total, page, limit, search, category, published }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [toggling, setToggling] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const navigate = useCallback((params: Record<string, string>) => {
    const sp = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    window.location.search = sp.toString();
  }, []);

  async function togglePublished(id: string) {
    const post = posts.find((p) => p.id === id);
    if (!post || toggling) return;
    setToggling(id);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          isPublished: !post.isPublished,
          ...(!post.isPublished && !post.publishedAt ? { publishedAt: new Date().toISOString() } : {}),
        }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  isPublished: !p.isPublished,
                  publishedAt: !p.isPublished ? p.publishedAt || new Date().toISOString() : p.publishedAt,
                }
              : p
          )
        );
      }
    } finally {
      setToggling(null);
    }
  }

  async function createPost() {
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Article",
          slug: `untitled-${Date.now()}`,
          content: "",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/blog/${data.post.slug}/edit`);
      }
    } finally {
      setCreating(false);
    }
  }

  const columns: ColumnDef<BlogPost>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 min-w-[220px]">
          <FileText className="h-4 w-4 text-graphite-300 shrink-0" />
          <div>
            <p className="font-semibold text-navy">{row.title}</p>
            <p className="text-[10px] text-graphite-400 font-mono truncate max-w-[260px]">
              {row.excerpt || `/${row.slug}`}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (row) =>
        row.category ? (
          <Badge variant="secondary" className="text-[10px] capitalize">
            {row.category}
          </Badge>
        ) : (
          <span className="text-xs text-graphite-300">--</span>
        ),
    },
    {
      key: "isPublished",
      header: "Status",
      sortable: true,
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePublished(row.id);
          }}
          disabled={toggling === row.id}
          className="flex items-center gap-1.5 disabled:opacity-50"
        >
          {row.isPublished ? (
            <>
              <ToggleRight className="h-5 w-5 text-teal" />
              <span className="text-[10px] font-medium text-teal">Published</span>
            </>
          ) : (
            <>
              <ToggleLeft className="h-5 w-5 text-graphite-300" />
              <span className="text-[10px] font-medium text-graphite-400">Draft</span>
            </>
          )}
        </button>
      ),
    },
    {
      key: "author",
      header: "Author",
      render: (row) => (
        <span className="text-xs text-graphite-500">{row.author || "--"}</span>
      ),
    },
    {
      key: "publishedAt",
      header: "Published Date",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-graphite-500">
          {row.publishedAt
            ? new Date(row.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "--"}
        </span>
      ),
    },
    {
      key: "seo",
      header: "SEO",
      render: (row) => {
        const hasTitle = !!row.seoTitle;
        const hasDesc = !!row.seoDescription;
        const complete = hasTitle && hasDesc;
        return complete ? (
          <Badge variant="success" className="text-[10px] gap-0.5">
            <Check className="h-3 w-3" /> Complete
          </Badge>
        ) : (
          <Badge variant="warning" className="text-[10px] gap-0.5">
            <Minus className="h-3 w-3" /> Incomplete
          </Badge>
        );
      },
    },
  ];

  const publishedCount = posts.filter((p) => p.isPublished).length;
  const draftCount = posts.filter((p) => !p.isPublished).length;

  function handleExportCSV() {
    exportToCSV(
      posts,
      [
        { key: "title", header: "Title", getValue: (p) => p.title },
        { key: "slug", header: "Slug", getValue: (p) => p.slug },
        { key: "category", header: "Category", getValue: (p) => p.category || "" },
        { key: "author", header: "Author", getValue: (p) => p.author || "" },
        { key: "isPublished", header: "Published", getValue: (p) => (p.isPublished ? "Yes" : "No") },
        { key: "publishedAt", header: "Published Date", getValue: (p) => p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "" },
        { key: "seoTitle", header: "SEO Title", getValue: (p) => p.seoTitle || "" },
        { key: "seoDescription", header: "SEO Description", getValue: (p) => p.seoDescription || "" },
      ],
      "blog-posts"
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Blog & Education</h2>
          <p className="text-sm text-graphite-400">
            Manage articles, education content, and SEO pages
          </p>
        </div>
        <Button className="gap-2" onClick={createPost} disabled={creating}>
          <Plus className="h-4 w-4" /> {creating ? "Creating..." : "New Article"}
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-graphite-400">Total Articles</p>
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
            <p className="text-xs text-graphite-400">Drafts</p>
            <p className="text-2xl font-bold text-navy">{draftCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <DataTable
        data={posts}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        search={search}
        onPageChange={(p) => navigate({ page: String(p) })}
        onLimitChange={(l) => navigate({ limit: String(l), page: "1" })}
        onSearchChange={(s) => navigate({ search: s, page: "1" })}
        searchPlaceholder="Search articles..."
        filters={[
          {
            key: "category",
            label: "Category",
            options: [
              { label: "All Categories", value: "" },
              ...BLOG_CATEGORIES.map((c) => ({ label: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
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
        getRowId={(p) => p.id}
        onRowClick={(p) => router.push(`/admin/blog/${p.slug}/edit`)}
        emptyMessage="No articles match your filters"
      />
    </div>
  );
}
