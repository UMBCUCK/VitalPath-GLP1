"use client";

const publications = [
  "Forbes Health",
  "Healthline",
  "Women's Health",
  "Men's Health",
  "Business Insider",
  "Everyday Health",
];

export function PressBar() {
  return (
    <section className="border-y border-navy-100/30 bg-cloud/60 py-4">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-graphite-300">
            As featured in
          </span>
          {/* Desktop: horizontal row */}
          <div className="hidden sm:flex flex-1 items-center justify-between gap-4 overflow-x-auto">
            {publications.map((pub) => (
              <span
                key={pub}
                className="whitespace-nowrap text-sm font-bold text-graphite-300/70 tracking-tight opacity-70 hover:opacity-90 transition-opacity"
              >
                {pub}
              </span>
            ))}
          </div>
          {/* Mobile: scrollable row */}
          <div className="flex sm:hidden w-full overflow-x-auto gap-5 pb-1 no-scrollbar">
            {publications.map((pub) => (
              <span
                key={pub}
                className="shrink-0 text-sm font-bold text-graphite-300/70 tracking-tight"
              >
                {pub}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
