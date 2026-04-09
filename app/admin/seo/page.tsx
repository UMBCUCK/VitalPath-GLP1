"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, FileText, Link2, Target, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

const topicSuggestions = [
  { topic: "Semaglutide vs Tirzepatide: Key Differences", keyword: "semaglutide vs tirzepatide", volume: "22K/mo", difficulty: "Medium", gap: "No existing content", priority: "high" },
  { topic: "GLP-1 Medication Cost Without Insurance", keyword: "glp-1 cost without insurance", volume: "14K/mo", difficulty: "Low", gap: "No existing content", priority: "high" },
  { topic: "Best Protein Sources During Weight Loss", keyword: "protein sources weight loss", volume: "9K/mo", difficulty: "Medium", gap: "Related: protein calculator", priority: "medium" },
  { topic: "How Long Does It Take to See GLP-1 Results?", keyword: "glp-1 results timeline", volume: "8K/mo", difficulty: "Low", gap: "Partial: first month article", priority: "high" },
  { topic: "Compounded Semaglutide Safety and Regulation", keyword: "compounded semaglutide safety", volume: "6K/mo", difficulty: "Low", gap: "Partial: compounding article", priority: "medium" },
  { topic: "Meal Prep Ideas for GLP-1 Patients", keyword: "glp-1 meal prep", volume: "4K/mo", difficulty: "Low", gap: "Related: recipes exist", priority: "medium" },
  { topic: "Exercise Guide While Taking GLP-1 Medication", keyword: "exercise on glp-1", volume: "5K/mo", difficulty: "Low", gap: "Partial: exercise article", priority: "low" },
  { topic: "GLP-1 vs Bariatric Surgery Comparison", keyword: "glp-1 vs bariatric surgery", volume: "7K/mo", difficulty: "Medium", gap: "No comparison page", priority: "medium" },
];

const internalLinks = [
  { from: "BMI Calculator", to: "Eligibility Page", reason: "BMI > 27/30 users should see eligibility criteria", status: "suggested" },
  { from: "Protein Calculator", to: "Meal Plans", reason: "Users calculating protein need recipe recommendations", status: "suggested" },
  { from: "First Month Article", to: "Check-In Flow", reason: "Readers should know about weekly check-in support", status: "suggested" },
  { from: "Hydration Calculator", to: "Hydration Guide Article", reason: "Calculator users want more depth", status: "implemented" },
  { from: "Pricing Page", to: "Comparison Pages", reason: "Evaluating users compare with competitors", status: "implemented" },
  { from: "Eligibility Page", to: "Quiz", reason: "Direct funnel from eligibility understanding to action", status: "implemented" },
];

export default function SEOPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">SEO Content Pipeline</h2>
        <p className="text-sm text-graphite-400">Topic opportunities, keyword gaps, and internal linking</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="flex items-center gap-3 p-4"><FileText className="h-5 w-5 text-teal" /><div><p className="text-xs text-graphite-400">Published Articles</p><p className="text-xl font-bold text-navy">10</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Target className="h-5 w-5 text-gold-600" /><div><p className="text-xs text-graphite-400">Topic Opportunities</p><p className="text-xl font-bold text-navy">{topicSuggestions.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><Link2 className="h-5 w-5 text-atlantic" /><div><p className="text-xs text-graphite-400">Internal Links</p><p className="text-xl font-bold text-navy">{internalLinks.length}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><TrendingUp className="h-5 w-5 text-emerald-500" /><div><p className="text-xs text-graphite-400">Comparison Pages</p><p className="text-xl font-bold text-navy">5</p></div></CardContent></Card>
      </div>

      {/* Topic suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-600" /> Suggested Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Topic</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Target Keyword</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Volume</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Difficulty</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Gap</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Priority</th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {topicSuggestions.map((t) => (
                  <tr key={t.keyword} className="hover:bg-navy-50/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-navy max-w-xs">{t.topic}</td>
                    <td className="px-4 py-3 font-mono text-xs text-graphite-500">{t.keyword}</td>
                    <td className="px-4 py-3 text-graphite-500">{t.volume}</td>
                    <td className="px-4 py-3"><Badge variant={t.difficulty === "Low" ? "success" : "warning"} className="text-[9px]">{t.difficulty}</Badge></td>
                    <td className="px-4 py-3 text-xs text-graphite-400">{t.gap}</td>
                    <td className="px-4 py-3"><Badge variant={t.priority === "high" ? "destructive" : t.priority === "medium" ? "warning" : "secondary"} className="text-[9px]">{t.priority}</Badge></td>
                    <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm" className="gap-1 text-xs">Create <ArrowRight className="h-3 w-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Internal linking */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Link2 className="h-4 w-4 text-atlantic" /> Internal Link Map</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {internalLinks.map((link, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-navy-100/40 px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-navy">{link.from}</span>
                  <ArrowRight className="h-3 w-3 text-graphite-300" />
                  <span className="font-medium text-teal">{link.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-graphite-400">{link.reason}</span>
                  <Badge variant={link.status === "implemented" ? "success" : "warning"} className="text-[9px]">{link.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
