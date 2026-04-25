import { Stethoscope, GraduationCap, ShieldCheck, Star } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";

interface Provider {
  initials: string;
  name: string;
  title: string;
  credentials: string;
  school: string;
  years: string;
  focus: string;
  npi: string;
}

const defaultProviders: Provider[] = [
  {
    initials: "SM",
    name: "Dr. Sarah Mitchell, MD",
    title: "Medical Director · Obesity Medicine",
    credentials: "ABOM Certified",
    school: "Johns Hopkins School of Medicine",
    years: "14 years",
    focus: "Metabolic & hormonal health",
    npi: "NPI · 1528××××××",
  },
  {
    initials: "JR",
    name: "Dr. James Reyes, DO",
    title: "Senior Provider · Cardiometabolic",
    credentials: "Board-Certified IM",
    school: "UCSF Medical School",
    years: "11 years",
    focus: "CV risk + diabetes prevention",
    npi: "NPI · 1765××××××",
  },
  {
    initials: "PK",
    name: "Dr. Priya Kapoor, MD",
    title: "Provider · Women's Health",
    credentials: "FACOG · Endocrine focus",
    school: "Mount Sinai School of Medicine",
    years: "9 years",
    focus: "PCOS · perimenopause · menopause",
    npi: "NPI · 1893××××××",
  },
];

interface Props {
  title?: string;
  eyebrow?: string;
  description?: string;
  providers?: Provider[];
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

export function LandingProviderTeam({
  title = "Real providers. Not a bot. Not a questionnaire.",
  eyebrow = "Meet your care team",
  description = "Every prescription at Nature's Journey is evaluated by a board-certified physician licensed in your state. Here's who reviews your intake.",
  providers = defaultProviders,
  accent = "teal",
}: Props) {
  const grad = gradMap[accent];

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="absolute top-0 left-1/2 h-56 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-teal/5 via-emerald/5 to-gold/5 blur-3xl" aria-hidden />
      <SectionShell>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {providers.map((p) => (
            <div
              key={p.name}
              className="group relative overflow-hidden rounded-3xl border border-navy-100/50 bg-white p-7 shadow-premium transition-all hover:-translate-y-1 hover:shadow-premium-lg"
            >
              <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${grad} opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-[0.15]`} />

              <div className="relative flex items-start gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} text-white text-xl font-bold shadow-premium`}>
                  {p.initials}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy leading-tight">{p.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-teal uppercase tracking-wider">
                    {p.title}
                  </p>
                </div>
              </div>

              <div className="relative mt-5 space-y-2.5 border-t border-navy-100/40 pt-4 text-sm">
                <div className="flex items-start gap-2 text-graphite-600">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{p.credentials}</span>
                </div>
                <div className="flex items-start gap-2 text-graphite-600">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-atlantic" />
                  <span>{p.school}</span>
                </div>
                <div className="flex items-start gap-2 text-graphite-600">
                  <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  <span>{p.years} · {p.focus}</span>
                </div>
              </div>

              <div className="relative mt-5 flex items-center justify-between rounded-xl bg-navy-50/60 px-3 py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-graphite-400">
                  {p.npi}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3 w-3 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-graphite-400">
          All providers are independently contracted, fully licensed in your state, and maintain active DEA registration where applicable. NPI numbers verifiable via NPPES.
        </p>
      </SectionShell>
    </section>
  );
}
