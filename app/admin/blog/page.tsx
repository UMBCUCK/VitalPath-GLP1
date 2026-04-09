"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Eye, Trash2, FileText, ToggleLeft, ToggleRight } from "lucide-react";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  date: string;
  readTime: string;
}

const seedPosts: BlogPostItem[] = [
  { id: "1", title: "What to Expect in Your First Month on a GLP-1 Program", slug: "what-to-expect-first-month-glp1", category: "medication", isPublished: true, date: "Apr 4, 2026", readTime: "6 min" },
  { id: "2", title: "High-Protein Recipes for When Your Appetite Changes", slug: "high-protein-recipes-appetite-changes", category: "nutrition", isPublished: true, date: "Apr 1, 2026", readTime: "5 min" },
  { id: "3", title: "Compounded Medications: What You Should Know", slug: "understanding-compounded-medications", category: "education", isPublished: true, date: "Mar 28, 2026", readTime: "8 min" },
  { id: "4", title: "The Complete Hydration Guide for Weight Management", slug: "hydration-guide-weight-management", category: "lifestyle", isPublished: true, date: "Mar 25, 2026", readTime: "4 min" },
  { id: "5", title: "Building Habits That Outlast the Medication", slug: "building-habits-that-outlast-medication", category: "lifestyle", isPublished: true, date: "Mar 20, 2026", readTime: "7 min" },
  { id: "6", title: "Why Protein Targets Matter More During Weight Loss", slug: "protein-targets-during-weight-loss", category: "nutrition", isPublished: true, date: "Mar 15, 2026", readTime: "5 min" },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>(seedPosts);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  function togglePublish(id: string) {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, isPublished: !p.isPublished } : p));
  }

  function createPost() {
    if (!newTitle) return;
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setPosts((prev) => [...prev, {
      id: String(prev.length + 1),
      title: newTitle,
      slug,
      category: "education",
      isPublished: false,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: "5 min",
    }]);
    setNewTitle("");
    setShowCreate(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Blog & Education</h2>
          <p className="text-sm text-graphite-400">Manage articles, education content, and SEO pages</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4" /> New Article
        </Button>
      </div>

      {showCreate && (
        <Card className="border-teal/30 bg-teal-50/20">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-navy mb-3">Create New Article</h3>
            <div className="flex gap-3">
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Article title..." className="flex-1" />
              <Button onClick={createPost}>Create</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Total Articles</p><p className="text-2xl font-bold text-navy">{posts.length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Published</p><p className="text-2xl font-bold text-teal">{posts.filter((p) => p.isPublished).length}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-graphite-400">Drafts</p><p className="text-2xl font-bold text-navy">{posts.filter((p) => !p.isPublished).length}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100/40 bg-navy-50/30">
                <th className="px-6 py-3 text-left font-medium text-graphite-400">Title</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Category</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-graphite-400">Date</th>
                <th className="px-4 py-3 text-right font-medium text-graphite-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100/30">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-navy-50/20 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-graphite-300 shrink-0" />
                      <div>
                        <p className="font-medium text-navy">{post.title}</p>
                        <p className="text-[10px] text-graphite-400 font-mono">/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{post.category}</Badge></td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(post.id)}>
                      {post.isPublished ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5 text-graphite-300" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-graphite-400">{post.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy"><Eye className="h-3.5 w-3.5" /></button>
                    </div>
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
