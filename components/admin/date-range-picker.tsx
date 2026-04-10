"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  from?: string;
  to?: string;
  onChange: (from: string, to: string) => void;
  className?: string;
}

const presets = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "YTD", days: -1 },
  { label: "1 year", days: 365 },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function ytdStart(): string {
  return `${new Date().getFullYear()}-01-01`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatLabel(from: string, to: string): string {
  const diffDays = Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / 86400000
  );
  const preset = presets.find((p) => p.days === diffDays);
  if (preset) return `Last ${preset.label}`;
  if (from === ytdStart() && to === today()) return "Year to date";
  return `${from} - ${to}`;
}

export function DateRangePicker({ from, to, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentFrom = from || daysAgo(30);
  const currentTo = to || today();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-3 py-2 text-sm text-navy transition-colors hover:border-navy-300"
      >
        <Calendar className="h-4 w-4 text-graphite-400" />
        <span>{formatLabel(currentFrom, currentTo)}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-graphite-400 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-xl border border-navy-100/60 bg-white p-4 shadow-premium">
          <div className="mb-3 space-y-1">
            <p className="text-xs font-medium text-graphite-400 uppercase tracking-wider">Presets</p>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => {
                const pFrom = preset.days === -1 ? ytdStart() : daysAgo(preset.days);
                const pTo = today();
                const isActive = currentFrom === pFrom && currentTo === pTo;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      onChange(pFrom, pTo);
                      setOpen(false);
                    }}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-teal text-white"
                        : "bg-linen/50 text-graphite-500 hover:bg-navy-50"
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-navy-100/40 pt-3">
            <p className="mb-2 text-xs font-medium text-graphite-400 uppercase tracking-wider">Custom Range</p>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={currentFrom}
                onChange={(e) => onChange(e.target.value, currentTo)}
                className="flex-1 rounded-lg border border-navy-200 px-2 py-1.5 text-xs text-navy"
              />
              <span className="text-xs text-graphite-400">to</span>
              <input
                type="date"
                value={currentTo}
                onChange={(e) => onChange(currentFrom, e.target.value)}
                className="flex-1 rounded-lg border border-navy-200 px-2 py-1.5 text-xs text-navy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
