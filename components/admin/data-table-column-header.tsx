"use client";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps {
  title: string;
  sortKey?: string;
  currentSort?: string;
  currentOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  className?: string;
}

export function DataTableColumnHeader({
  title,
  sortKey,
  currentSort,
  currentOrder,
  onSort,
  className,
}: DataTableColumnHeaderProps) {
  if (!sortKey || !onSort) {
    return <span className={cn("text-graphite-400 font-medium", className)}>{title}</span>;
  }

  const isActive = currentSort === sortKey;

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "inline-flex items-center gap-1.5 text-graphite-400 font-medium hover:text-navy transition-colors",
        isActive && "text-navy",
        className
      )}
    >
      {title}
      {isActive ? (
        currentOrder === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
      )}
    </button>
  );
}
