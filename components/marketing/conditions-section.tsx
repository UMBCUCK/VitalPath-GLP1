import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/shared/section-shell";

const conditions = [
  {
    href: "/semaglutide",
    label: "Semaglutide",
    sub: "Ozempic / Wegovy active ingredient",
    color: "from-teal-50 to-sage/60",
    border: "border-teal/20 hover:border-teal/50",
  },
  {
    href: "/tirzepatide",
    label: "Tirzepatide",
    sub: "Mounjaro / Zepbound active ingredient",
    color: "from-atlantic/5 to-navy-50",
    border: "border-atlantic/20 hover:border-atlantic/50",
  },
  {
    href: "/obesity",
    label: "Obesity (BMI 30+)",
    sub: "FDA-approved indication",
    color: "from-gold-50 to-linen",
    border: "border-gold-200 hover:border-gold-400",
  },
  {
    href: "/type-2-diabetes",
    label: "Type 2 Diabetes",
    sub: "GLP-1 as first-line therapy",
    color: "from-sage/40 to-cloud",
    border: "border-sage hover:border-teal/50",
  },
  {
    href: "/prediabetes",
    label: "Prediabetes",
    sub: "Reverse insulin resistance",
    color: "from-emerald-50 to-sage/40",
    border: "border-emerald-200 hover:border-emerald-400",
  },
  {
    href: "/pcos",
    label: "PCOS",
    sub: "Hormonal weight management",
    color: "from-pink-50 to-linen",
    border: "border-pink-200 hover:border-pink-300",
  },
  {
    href: "/heart-health",
    label: "Heart Health",
    sub: "Cardiovascular risk reduction",
    color: "from-red-50 to-linen",
    border: "border-red-200 hover:border-red-300",
  },
  {
    href: "/sleep-apnea",
    label: "Sleep Apnea",
    sub: "FDA-approved 2024 indication",
    color: "from-indigo-50 to-navy-50",
    border: "border-indigo-200 hover:border-indigo-400",
  },
  {
    href: "/women",
    label: "Women",
    sub: "Hormonal & metabolic factors",
    color: "from-purple-50 to-linen",
    border: "border-purple-200 hover:border-purple-300",
  },
  {
    href: "/men",
    label: "Men",
    sub: "Testosterone & metabolic health",
    color: "from-blue-50 to-navy-50",
    border: "border-blue-200 hover:border-blue-300",
  },
  {
    href: "/over-50",
    label: "Adults Over 50",
    sub: "Slower metabolism support",
    color: "from-amber-50 to-linen",
    border: "border-amber-200 hover:border-amber-300",
  },
];

export function ConditionsSection() {
  return (
    <section className="py-16 bg-white border-t border-navy-100/40">
      <SectionShell>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal mb-2">Who we help</p>
          <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            GLP-1 treatment for your specific situation
          </h2>
          <p className="mt-3 text-graphite-500 max-w-xl mx-auto text-sm">
            Whether you&apos;re managing a chronic condition or pursuing weight loss, our programs are tailored to your health profile.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {conditions.map(({ href, label, sub, color, border }) => (
            <Link
              key={href}
              href={href}
              className={`group flex flex-col gap-1.5 rounded-xl border bg-gradient-to-br p-4 transition-all hover:shadow-md hover:-translate-y-0.5 ${color} ${border}`}
            >
              <span className="text-sm font-semibold text-navy group-hover:text-teal transition-colors leading-tight">
                {label}
              </span>
              <span className="text-xs text-graphite-400 leading-snug">{sub}</span>
              <ArrowRight className="h-3 w-3 text-graphite-300 group-hover:text-teal mt-auto transition-colors" />
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-graphite-300">
          Treatment eligibility determined by a licensed medical provider.{" "}
          <Link href="/eligibility" className="underline hover:text-teal transition-colors">
            See full eligibility criteria →
          </Link>
        </p>
      </SectionShell>
    </section>
  );
}
