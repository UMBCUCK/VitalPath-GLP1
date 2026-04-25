import { SectionShell } from "@/components/shared/section-shell";

const outlets = [
  { name: "The New York Times", short: "NYT" },
  { name: "Forbes", short: "Forbes" },
  { name: "CNBC", short: "CNBC" },
  { name: "Good Morning America", short: "GMA" },
  { name: "WebMD", short: "WebMD" },
  { name: "Healthline", short: "Healthline" },
];

export function LandingPressBar() {
  return (
    <section className="border-y border-navy-100/40 bg-white py-10">
      <SectionShell>
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-graphite-400">
          As featured in
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
          {outlets.map((o) => (
            <div
              key={o.name}
              className="group flex items-center"
              aria-label={o.name}
              title={o.name}
            >
              <span className="font-serif text-lg font-bold tracking-tight text-graphite-400 transition-colors group-hover:text-navy sm:text-xl">
                {o.name}
              </span>
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}
