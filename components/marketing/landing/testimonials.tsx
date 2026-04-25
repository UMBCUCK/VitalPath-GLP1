import { Star, Quote, TrendingDown } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/lib/site";

export interface LandingTestimonial {
  initials: string;
  name: string;
  location?: string;
  outcome: string;
  outcomeDetail?: string;
  quote: string;
  highlight?: string;
  duration?: string;
}

interface Props {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: LandingTestimonial[];
  accent?: "teal" | "emerald" | "lavender" | "atlantic" | "gold" | "rose";
}

const gradientMap = {
  teal: "from-teal to-atlantic",
  emerald: "from-emerald to-teal",
  lavender: "from-violet-500 to-fuchsia-400",
  atlantic: "from-atlantic to-teal",
  gold: "from-gold to-amber-400",
  rose: "from-rose-500 to-pink-400",
};

export function LandingTestimonials({
  eyebrow = "Real results",
  title = "What real patients are saying",
  description,
  items,
  accent = "teal",
}: Props) {
  const grad = gradientMap[accent];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-cloud to-white py-20">
      <div className="absolute top-0 left-1/2 h-64 w-[56rem] -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" aria-hidden />
      <SectionShell>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        {/* Rating header */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
            </div>
            <span className="font-bold text-navy text-lg">{siteConfig.socialProof.rating}</span>
            <span className="text-sm text-graphite-500">out of 5</span>
          </div>
          <div className="h-5 w-px bg-navy-200 hidden sm:block" />
          <div className="text-sm text-graphite-500">
            <span className="font-semibold text-navy">{siteConfig.socialProof.reviewCount}</span> verified patient reviews
          </div>
          <div className="h-5 w-px bg-navy-200 hidden sm:block" />
          <div className="text-sm text-graphite-500">
            <span className="font-semibold text-navy">{siteConfig.socialProof.memberCount}</span> patients served
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((t, i) => (
            <div
              key={t.name}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-navy-100/60 bg-white p-7 shadow-premium transition-all hover:-translate-y-1 hover:shadow-premium-lg"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Decorative quote */}
              <Quote className="absolute -top-2 right-4 h-16 w-16 text-teal/5" aria-hidden />

              {/* Star rating */}
              <div className="mb-4 flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6 flex-1 text-base leading-relaxed text-navy">
                {t.highlight ? (
                  <>
                    {t.quote.split(t.highlight)[0]}
                    <span className="bg-gold/20 px-0.5 font-semibold">{t.highlight}</span>
                    {t.quote.split(t.highlight)[1]}
                  </>
                ) : (
                  t.quote
                )}
              </blockquote>

              {/* Outcome */}
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2">
                <TrendingDown className="h-4 w-4 text-emerald-600" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-emerald-700">{t.outcome}</div>
                  {t.outcomeDetail && <div className="text-xs text-emerald-600/80">{t.outcomeDetail}</div>}
                </div>
                {t.duration && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    {t.duration}
                  </span>
                )}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-navy-100/40 pt-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${grad} text-white text-sm font-bold`}>
                  {t.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-navy">{t.name}</div>
                  {t.location && <div className="text-xs text-graphite-400">{t.location}</div>}
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-graphite-400">
          Results shown are individual experiences and may not be typical. Outcomes depend on many factors including adherence, diet, and exercise.
        </p>
      </SectionShell>
    </section>
  );
}
