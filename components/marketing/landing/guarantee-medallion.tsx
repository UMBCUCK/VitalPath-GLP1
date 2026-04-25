import { ShieldCheck, Clock, RefreshCw, Award } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";

interface Props {
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

export function LandingGuaranteeMedallion({ accent = "emerald" }: Props) {
  const grad = gradMap[accent];

  return (
    <section className="py-16">
      <SectionShell>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cloud p-8 shadow-premium-lg sm:p-12">
          {/* Decorative */}
          <div className={`absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br ${grad} opacity-10 blur-3xl`} aria-hidden />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden />

          <div className="relative grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
            {/* Medallion */}
            <div className="mx-auto md:mx-0">
              <div className="relative">
                {/* Outer ring */}
                <div className={`flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br ${grad} shadow-[0_20px_50px_rgba(5,150,105,0.35)] sm:h-40 sm:w-40`}>
                  {/* Inner circle */}
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white/95 backdrop-blur-sm sm:h-32 sm:w-32">
                    <ShieldCheck className="mb-1 h-7 w-7 text-emerald-600" />
                    <div className="text-2xl font-bold text-navy leading-none">30-Day</div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-graphite-500">
                      Money-Back
                    </div>
                  </div>
                </div>
                {/* Ribbon accent */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Our Promise
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-navy sm:text-3xl">
                If you don't see results in 30 days, we'll refund you — no questions asked.
              </h3>
              <p className="mt-3 text-base leading-relaxed text-graphite-600">
                We're confident because the science is. If your first month doesn't meet your expectations, email us and we'll issue a full refund of your program fee.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Clock, text: "30 days to decide" },
                  { icon: RefreshCw, text: "Full program refund" },
                  { icon: Award, text: "No questions asked" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 backdrop-blur-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium text-navy">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}
