"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ClipboardList,
  FileCheck,
  CreditCard,
  TrendingUp,
  Award,
  RefreshCw,
  UserX,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ── Types ───────────────────────────────────────────────────

interface JourneyNode {
  id: string;
  label: string;
  count: number;
}

interface JourneyLink {
  source: string;
  target: string;
  value: number;
}

interface StageRow {
  stage: string;
  count: number;
  pctOfPrevious: number | null;
  dropOffPct: number | null;
  avgDaysInStage: number | null;
}

interface Props {
  nodes: JourneyNode[];
  links: JourneyLink[];
  stageTable: StageRow[];
}

// ── Stage Config ────────────────────────────────────────────

const stageConfig: Record<
  string,
  { icon: LucideIcon; color: string; bg: string; column: number }
> = {
  lead: {
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    column: 0,
  },
  quiz: {
    icon: ClipboardList,
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200",
    column: 0,
  },
  intake: {
    icon: FileCheck,
    color: "text-violet-600",
    bg: "bg-violet-50 border-violet-200",
    column: 1,
  },
  subscribed: {
    icon: CreditCard,
    color: "text-teal-600",
    bg: "bg-teal-50 border-teal-200",
    column: 1,
  },
  active30d: {
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    column: 2,
  },
  milestone: {
    icon: Award,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    column: 2,
  },
  renewed: {
    icon: RefreshCw,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    column: 3,
  },
  churned: {
    icon: UserX,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    column: 3,
  },
};

// Column definitions for the flow diagram
const flowColumns = [
  { title: "Acquisition", stages: ["lead", "quiz"] },
  { title: "Conversion", stages: ["intake", "subscribed"] },
  { title: "Engagement", stages: ["active30d", "milestone"] },
  { title: "Retention", stages: ["renewed", "churned"] },
];

// ── Component ───────────────────────────────────────────────

export function JourneyClient({ nodes, links, stageTable }: Props) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const totalLeads = nodeMap.get("lead")?.count ?? 1;

  // Get links originating from a source
  function getLinksFrom(sourceId: string) {
    return links.filter((l) => l.source === sourceId);
  }

  // Get the drop-off between two stages
  function getDropOff(sourceId: string, targetId: string) {
    const sourceNode = nodeMap.get(sourceId);
    const link = links.find(
      (l) => l.source === sourceId && l.target === targetId
    );
    if (!sourceNode || !link || sourceNode.count === 0) return null;
    const conversionRate = (link.value / sourceNode.count) * 100;
    return {
      converted: link.value,
      rate: conversionRate,
      dropOff: 100 - conversionRate,
    };
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Customer Journey</h2>
        <p className="text-sm text-graphite-400 mt-1">
          Visualize how users progress through the acquisition funnel and
          retention stages
        </p>
      </div>

      {/* Flow Diagram */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {flowColumns.map((col, colIdx) => (
              <div key={col.title} className="space-y-3">
                {/* Column header */}
                <div className="text-center">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-graphite-400">
                    {col.title}
                  </h3>
                  <div className="mt-1 h-0.5 bg-gradient-to-r from-transparent via-navy-100 to-transparent" />
                </div>

                {/* Stage nodes */}
                {col.stages.map((stageId) => {
                  const node = nodeMap.get(stageId);
                  const config = stageConfig[stageId];
                  if (!node || !config) return null;
                  const Icon = config.icon;
                  const pctOfTotal =
                    totalLeads > 0
                      ? ((node.count / totalLeads) * 100).toFixed(1)
                      : "0";

                  return (
                    <div
                      key={stageId}
                      className={cn(
                        "rounded-xl border p-4 transition-all hover:shadow-md",
                        config.bg
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={cn("h-4 w-4", config.color)} />
                        <span className="text-xs font-semibold text-navy">
                          {node.label}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-navy">
                        {node.count.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-graphite-400 mt-0.5">
                        {pctOfTotal}% of total leads
                      </p>

                      {/* Show transition arrows from this node */}
                      {getLinksFrom(stageId).length > 0 && (
                        <div className="mt-2 space-y-1">
                          {getLinksFrom(stageId).map((link) => {
                            const targetNode = nodeMap.get(link.target);
                            if (!targetNode) return null;
                            const rate =
                              node.count > 0
                                ? ((link.value / node.count) * 100).toFixed(1)
                                : "0";
                            return (
                              <div
                                key={link.target}
                                className="flex items-center gap-1 text-[10px]"
                              >
                                <ArrowRight className="h-3 w-3 text-graphite-300" />
                                <span className="text-graphite-500">
                                  {targetNode.label}:
                                </span>
                                <span className="font-semibold text-navy">
                                  {link.value}
                                </span>
                                <span className="text-graphite-300">
                                  ({rate}%)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Drop-off badges between adjacent columns */}
                {colIdx < 3 && (
                  <div className="flex justify-center pt-1">
                    {(() => {
                      const pairs: [string, string][] = [
                        ["lead", "quiz"],
                        ["quiz", "intake"],
                        ["intake", "subscribed"],
                        ["subscribed", "active30d"],
                      ];
                      const pair = pairs[colIdx];
                      if (!pair) return null;
                      const info = getDropOff(pair[0], pair[1]);
                      if (!info) return null;
                      return (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            info.dropOff > 50
                              ? "bg-red-100 text-red-700"
                              : info.dropOff > 25
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                          )}
                        >
                          {info.dropOff.toFixed(1)}% drop-off
                        </Badge>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Flow link bars */}
          <div className="mt-6 pt-4 border-t border-navy-100/40">
            <h4 className="text-xs font-semibold text-graphite-400 uppercase tracking-wider mb-3">
              Transition Flow
            </h4>
            <div className="space-y-2">
              {links
                .filter((l) => l.value > 0)
                .map((link) => {
                  const sourceNode = nodeMap.get(link.source);
                  const targetNode = nodeMap.get(link.target);
                  if (!sourceNode || !targetNode) return null;
                  const maxVal = Math.max(...links.map((l) => l.value), 1);
                  const widthPct = (link.value / maxVal) * 100;
                  const isChurn = link.target === "churned";

                  return (
                    <div
                      key={`${link.source}-${link.target}`}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs text-graphite-500 w-32 truncate text-right">
                        {sourceNode.label}
                      </span>
                      <ArrowRight className="h-3 w-3 text-graphite-300 shrink-0" />
                      <div className="flex-1 h-5 rounded-full bg-navy-50 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            isChurn ? "bg-red-400" : "bg-teal-400"
                          )}
                          style={{ width: `${Math.max(widthPct, 2)}%` }}
                        />
                      </div>
                      <span className="text-xs text-graphite-500 w-32 truncate">
                        {targetNode.label}
                      </span>
                      <span className="text-xs font-semibold text-navy w-12 text-right">
                        {link.value}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage-by-Stage Table */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-navy mb-4">
            Stage Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100/40 bg-linen/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    % of Previous
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Drop-off %
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-graphite-400 uppercase tracking-wider">
                    Funnel Visual
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/30">
                {stageTable.map((row, i) => {
                  const funnelPct =
                    totalLeads > 0
                      ? (row.count / totalLeads) * 100
                      : 0;
                  return (
                    <tr key={i} className="hover:bg-linen/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-navy">
                          {row.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-semibold text-navy">
                          {row.count.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.pctOfPrevious !== null ? (
                          <span
                            className={cn(
                              "text-sm font-medium",
                              row.pctOfPrevious >= 50
                                ? "text-emerald-600"
                                : row.pctOfPrevious >= 25
                                  ? "text-amber-600"
                                  : "text-red-600"
                            )}
                          >
                            {row.pctOfPrevious}%
                          </span>
                        ) : (
                          <span className="text-xs text-graphite-300">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.dropOffPct !== null && row.dropOffPct > 0 ? (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-[10px]",
                              row.dropOffPct > 50
                                ? "bg-red-100 text-red-700"
                                : row.dropOffPct > 25
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                            )}
                          >
                            -{row.dropOffPct}%
                          </Badge>
                        ) : (
                          <span className="text-xs text-graphite-300">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-24 h-2 rounded-full bg-navy-50 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-teal-400 transition-all"
                              style={{
                                width: `${Math.max(funnelPct, 1)}%`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-graphite-400 w-10 text-right">
                            {funnelPct.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
