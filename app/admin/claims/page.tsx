"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Eye, Check, X, AlertTriangle } from "lucide-react";

// Claim categories from the schema
const claimCategories = [
  "STUDY_TETHERED_NUMERIC",
  "NON_NUMERIC_SUPPORT",
  "OPERATIONAL_TRUST",
  "LIFESTYLE_ADHERENCE",
  "TESTIMONIAL_RESULTS",
  "SUPPLEMENT_SUPPORT",
] as const;

const channelOptions = [
  "homepage", "pricing", "checkout", "email", "sms", "ad", "upsell", "product", "dashboard",
] as const;

type ClaimStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "RETIRED";

interface ClaimItem {
  id: string;
  text: string;
  category: typeof claimCategories[number];
  status: ClaimStatus;
  channels: string[];
  numericClaim: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  disclosureText?: string;
  citationSource?: string;
  requiresFootnote: boolean;
  requiresLegalReview: boolean;
  requiresMedicalReview: boolean;
}

// Seed claims for demo
const seedClaims: ClaimItem[] = [
  {
    id: "1",
    text: "Provider-guided care built for real-life consistency",
    category: "NON_NUMERIC_SUPPORT",
    status: "APPROVED",
    channels: ["homepage", "pricing", "ad"],
    numericClaim: false,
    riskLevel: "LOW",
    requiresFootnote: false,
    requiresLegalReview: false,
    requiresMedicalReview: false,
  },
  {
    id: "2",
    text: "In studies of branded GLP-1 medications, adults achieved average weight loss of 15-20% of body weight over approximately one year when used with diet and exercise.",
    category: "STUDY_TETHERED_NUMERIC",
    status: "PENDING_REVIEW",
    channels: ["homepage", "pricing"],
    numericClaim: true,
    riskLevel: "HIGH",
    disclosureText: "Results from clinical trials of branded semaglutide. Individual results vary. Compounded medications have not been studied in the same clinical trials.",
    citationSource: "STEP 1 Trial, NEJM 2021",
    requiresFootnote: true,
    requiresLegalReview: true,
    requiresMedicalReview: true,
  },
  {
    id: "3",
    text: "Medication ships within 24-48 hours of provider approval",
    category: "OPERATIONAL_TRUST",
    status: "APPROVED",
    channels: ["homepage", "pricing", "checkout", "email"],
    numericClaim: false,
    riskLevel: "LOW",
    requiresFootnote: false,
    requiresLegalReview: false,
    requiresMedicalReview: false,
  },
  {
    id: "4",
    text: "Structured support designed to help you build momentum",
    category: "LIFESTYLE_ADHERENCE",
    status: "APPROVED",
    channels: ["homepage", "pricing", "ad", "email", "dashboard"],
    numericClaim: false,
    riskLevel: "LOW",
    requiresFootnote: false,
    requiresLegalReview: false,
    requiresMedicalReview: false,
  },
  {
    id: "5",
    text: "Our metabolic support bundle provides targeted nutritional support for metabolic wellness.",
    category: "SUPPLEMENT_SUPPORT",
    status: "PENDING_REVIEW",
    channels: ["product", "upsell", "email"],
    numericClaim: false,
    riskLevel: "MEDIUM",
    disclosureText: "These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.",
    requiresFootnote: true,
    requiresLegalReview: false,
    requiresMedicalReview: false,
  },
];

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimItem[]>(seedClaims);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filteredClaims = filterStatus === "all"
    ? claims
    : claims.filter((c) => c.status === filterStatus);

  function approveClaim(id: string) {
    setClaims((prev) => prev.map((c) => c.id === id ? { ...c, status: "APPROVED" as ClaimStatus } : c));
  }

  function rejectClaim(id: string) {
    setClaims((prev) => prev.map((c) => c.id === id ? { ...c, status: "REJECTED" as ClaimStatus } : c));
  }

  const statusVariant = (status: ClaimStatus) => {
    switch (status) {
      case "APPROVED": return "success";
      case "PENDING_REVIEW": return "warning";
      case "REJECTED": return "destructive";
      case "DRAFT": return "secondary";
      case "RETIRED": return "outline";
      default: return "secondary" as const;
    }
  };

  const riskColor = (level: string) => {
    switch (level) {
      case "LOW": return "text-emerald-600";
      case "MEDIUM": return "text-amber-600";
      case "HIGH": return "text-orange-600";
      case "CRITICAL": return "text-red-600";
      default: return "text-graphite-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy">Claim Engine</h2>
          <p className="text-sm text-graphite-400">Manage marketing claims, disclosures, and compliance approvals</p>
        </div>
        <Button className="gap-2" onClick={() => setShowCreate(!showCreate)}>
          <Plus className="h-4 w-4" /> New Claim
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Claims", value: claims.length },
          { label: "Approved", value: claims.filter((c) => c.status === "APPROVED").length },
          { label: "Pending Review", value: claims.filter((c) => c.status === "PENDING_REVIEW").length },
          { label: "High Risk", value: claims.filter((c) => c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL").length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-graphite-400">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-navy">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-graphite-400" />
          <input type="text" placeholder="Search claims..." className="w-full bg-transparent text-sm outline-none text-navy placeholder:text-graphite-300" />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="h-4 w-4 text-graphite-400" />
          {["all", "PENDING_REVIEW", "APPROVED", "DRAFT"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filterStatus === s ? "bg-navy text-white" : "bg-white text-graphite-500 hover:bg-navy-50"
              }`}
            >
              {s === "all" ? "All" : s.replace("_", " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Claims table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-navy-50/30">
                  <th className="px-6 py-3 text-left font-medium text-graphite-400">Claim</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Risk</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Channels</th>
                  <th className="px-4 py-3 text-left font-medium text-graphite-400">Flags</th>
                  <th className="px-4 py-3 text-right font-medium text-graphite-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-navy-50/20 transition-colors">
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-navy line-clamp-2">{claim.text}</p>
                      {claim.disclosureText && (
                        <p className="mt-1 text-[10px] text-graphite-300 line-clamp-1">Disclosure: {claim.disclosureText}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="secondary" className="text-[10px]">
                        {claim.category.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={statusVariant(claim.status) as "success" | "warning" | "destructive" | "secondary" | "outline"}>
                        {claim.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold ${riskColor(claim.riskLevel)}`}>
                        {claim.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {claim.channels.slice(0, 3).map((ch) => (
                          <span key={ch} className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] text-graphite-500">
                            {ch}
                          </span>
                        ))}
                        {claim.channels.length > 3 && (
                          <span className="rounded bg-navy-50 px-1.5 py-0.5 text-[10px] text-graphite-400">
                            +{claim.channels.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        {claim.numericClaim && <Badge variant="warning" className="text-[9px] px-1.5">#</Badge>}
                        {claim.requiresFootnote && <Badge variant="secondary" className="text-[9px] px-1.5">FN</Badge>}
                        {claim.requiresLegalReview && <Badge variant="destructive" className="text-[9px] px-1.5">Legal</Badge>}
                        {claim.requiresMedicalReview && <Badge variant="destructive" className="text-[9px] px-1.5">Med</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="rounded-lg p-1.5 text-graphite-400 hover:bg-navy-50 hover:text-navy transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {claim.status === "PENDING_REVIEW" && (
                          <>
                            <button
                              onClick={() => approveClaim(claim.id)}
                              className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50 transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => rejectClaim(claim.id)}
                              className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Claim rules reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Claim Compliance Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Numeric claims require study-backed wording with clear qualifiers",
              "Never invent weight loss numbers or timelines",
              "Prefer percentages over pounds unless substantiated and approved",
              "Medication outcome claims require context and qualifier copy",
              "Supplement claims use structure/function language only",
              "Before/after stories require disclosure modules and moderation",
              "Never imply compounded drugs are FDA-approved",
              "Never imply compounded products are the same as branded drugs",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-amber-50/50 px-3 py-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">
                  {i + 1}
                </span>
                <p className="text-xs text-graphite-600 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
