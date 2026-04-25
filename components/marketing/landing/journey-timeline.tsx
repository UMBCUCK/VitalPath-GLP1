import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";

interface Milestone {
  when: string;
  label: string;
  metric?: string;
  color?: string;
}

interface Props {
  eyebrow?: string;
  title?: string;
  description?: string;
  milestones?: Milestone[];
  accent?: "teal" | "emerald" | "lavender" | "atlantic" | "gold" | "rose";
}

const gradMap = {
  teal: "from-teal to-atlantic",
  emerald: "from-emerald to-teal",
  lavender: "from-violet-500 to-fuchsia-400",
  atlantic: "from-atlantic to-teal",
  gold: "from-gold to-amber-400",
  rose: "from-rose-500 to-pink-400",
};

const defaultMilestones: Milestone[] = [
  { when: "Day 1", label: "Provider review complete", metric: "Meds shipping" },
  { when: "Week 2", label: "Food noise quiets down", metric: "Hunger ↓ measurably" },
  { when: "Month 1", label: "First visible changes", metric: "3–6 lbs lost" },
  { when: "Month 3", label: "Metabolic markers shift", metric: "BP · A1c · triglycerides ↓" },
  { when: "Month 6", label: "Energy, sleep, mood lift", metric: "~10–12% body weight" },
  { when: "Month 12", label: "New baseline", metric: "13–21% total loss" },
];

export function LandingJourneyTimeline({
  eyebrow = "The journey",
  title = "What the next 12 months actually look like",
  description = "A realistic timeline based on clinical trial outcomes and what our patients consistently report.",
  milestones = defaultMilestones,
  accent = "teal",
}: Props) {
  const grad = gradMap[accent];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cloud/40 to-white py-20">
      <SectionShell>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        {/* Desktop horizontal timeline */}
        <div className="relative mx-auto mt-16 hidden max-w-6xl lg:block">
          {/* Track */}
          <div className="absolute left-8 right-8 top-7 h-1 rounded-full bg-gradient-to-r from-navy-100 via-navy-200 to-navy-100" aria-hidden />
          <div className={`absolute left-8 top-7 h-1 w-[85%] rounded-full bg-gradient-to-r ${grad}`} aria-hidden />

          <div className="relative grid grid-cols-6 gap-3">
            {milestones.map((m, i) => (
              <div key={m.when} className="flex flex-col items-center text-center">
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${grad} text-white shadow-premium-lg ring-4 ring-white`}>
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-wider text-navy">
                  {m.when}
                </div>
                <div className="mt-1 text-sm font-semibold text-navy leading-snug">
                  {m.label}
                </div>
                {m.metric && (
                  <div className="mt-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    {m.metric}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="mx-auto mt-12 max-w-2xl lg:hidden">
          <div className="relative space-y-6">
            <div className={`absolute left-[26px] top-6 bottom-6 w-0.5 bg-gradient-to-b ${grad}`} aria-hidden />
            {milestones.map((m, i) => (
              <div key={m.when} className="relative flex items-start gap-4">
                <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${grad} text-white shadow-premium ring-4 ring-white`}>
                  <span className="text-xs font-bold px-1">{i + 1}</span>
                </div>
                <div className="flex-1 rounded-2xl border border-navy-100/50 bg-white p-4 shadow-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal">{m.when}</span>
                  </div>
                  <div className="mt-1 font-semibold text-navy">{m.label}</div>
                  {m.metric && (
                    <div className="mt-2 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {m.metric}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-graphite-400">
          Ranges based on STEP-1, SURMOUNT-1, and SELECT trial outcomes. Individual results vary based on adherence, dose progression, diet, exercise, and other factors.
        </p>
      </SectionShell>
    </section>
  );
}
