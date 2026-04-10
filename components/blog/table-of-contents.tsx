"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

interface HeadingInfo {
  id: string;
  text: string;
  level: 2 | 3;
}

export function TableOfContents({ headings }: { headings: HeadingInfo[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-navy-100/40 bg-navy-50/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-bold text-navy">
          <List className="h-4 w-4 text-teal" />
          In this article
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-graphite-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-graphite-400" />
        )}
      </button>

      {open && (
        <ol className="px-5 pb-4 space-y-2 border-t border-navy-100/30">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? "ml-4 mt-1.5" : "mt-2"}>
              <a
                href={`#${h.id}`}
                onClick={() => setOpen(false)}
                className="block text-sm text-graphite-500 hover:text-teal transition-colors leading-snug"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
