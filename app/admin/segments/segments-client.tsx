"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Crown, AlertTriangle, Zap, UserPlus, RefreshCw } from "lucide-react";

interface Segment {
  key: string;
  name: string;
  count: number;
  description: string;
  color: "gold" | "red" | "teal" | "blue" | "amber";
}

interface Props {
  segments: Segment[];
}

const colorStyles: Record<Segment["color"], { border: string; bg: string; text: string; badge: string }> = {
  gold:  { border: "border-gold-200", bg: "bg-gold-50/40", text: "text-gold-700", badge: "border-gold-200 bg-gold-50 text-gold-800" },
  red:   { border: "border-red-200", bg: "bg-red-50/40", text: "text-red-600", badge: "border-red-200 bg-red-50 text-red-700" },
  teal:  { border: "border-teal-200", bg: "bg-teal-50/40", text: "text-teal", badge: "border-teal-100 bg-teal-50 text-teal-800" },
  blue:  { border: "border-blue-200", bg: "bg-blue-50/40", text: "text-blue-600", badge: "border-blue-200 bg-blue-50 text-blue-700" },
  amber: { border: "border-amber-200", bg: "bg-amber-50/40", text: "text-amber-600", badge: "border-amber-200 bg-amber-50 text-amber-700" },
};

const segmentIcons: Record<string, typeof Crown> = {
  "high-value": Crown,
  "at-risk": AlertTriangle,
  "power-users": Zap,
  "new": UserPlus,
  "re-engagement": RefreshCw,
};

export function SegmentsClient({ segments }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">Patient Segments</h2>
        <p className="text-sm text-graphite-400">
          Pre-built cohorts for targeted outreach and monitoring
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment) => {
          const styles = colorStyles[segment.color];
          const Icon = segmentIcons[segment.key] || Zap;

          return (
            <Card
              key={segment.key}
              className={cn("relative overflow-hidden transition-shadow hover:shadow-premium-md", styles.border)}
            >
              {/* Subtle colored top accent */}
              <div className={cn("absolute inset-x-0 top-0 h-1", styles.bg)} />

              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", styles.bg)}>
                    <Icon className={cn("h-5 w-5", styles.text)} />
                  </div>
                  <Badge className={styles.badge}>
                    {segment.count} {segment.count === 1 ? "patient" : "patients"}
                  </Badge>
                </div>

                <h3 className="mt-4 text-lg font-bold text-navy">{segment.name}</h3>
                <p className="mt-1 text-sm text-graphite-500 leading-relaxed">
                  {segment.description}
                </p>

                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/customers?segment=${segment.key}`}>
                      View Segment
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
