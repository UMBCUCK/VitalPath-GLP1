import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Star, Clock, Stethoscope, Activity, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss for Adults Over 40 | Nature's Journey",
  description: "Medically supervised GLP-1 weight loss designed for adults 40+. Providers experienced with metabolic slowdown, joint health, and age-related weight gain. From $279/mo.",
};

const ageSpecificBenefits = [
  { title: "Metabolic Slowdown Support", description: "After 40, your metabolism drops ~5% per decade. GLP-1 medication works at the hormonal level to counteract this biological shift.", icon: Activity },
  { title: "Joint-Conscious Approach", description: "Less impact on joints than aggressive exercise programs. Weight loss through GLP-1 reduces joint stress while preserving mobility.", icon: Shield },
  { title: "Comprehensive Health Monitoring", description: "Blood pressure, cholesterol, blood sugar, and metabolic markers all improve with GLP-1 treatment. Your provider tracks it all.", icon: Stethoscope },
  { title: "Muscle Preservation Focus", description: "Our protein-optimized meal plans and strength guidance preserve lean muscle mass — critical after 40 when muscle loss accelerates.", icon: Activity },
];

const testimonials = [
  { name: "Robert T.", age: 54, lbs: 47, months: 7, quote: "At 54, I'd accepted the weight. Down 47 lbs in 7 months. My knees feel like they did in my 30s." },
  { name: "Karen W.", age: 46, lbs: 31, months: 4, quote: "My doctor said my cholesterol and A1C both improved dramatically. The weight loss is a bonus." },
  { name: "James L.", age: 62, lbs: 38, months: 6, quote: "I was skeptical at my age. My provider adjusted everything for my medications. Best health investment I've made." },
];

export default function Over40LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-navy-100/40 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-atlantic">
              <span className="text-xs font-bold text-white">NJ</span>
            </div>
            <span className="text-sm font-bold text-navy">Nature&apos;s Journey</span>
          </div>
          <Badge variant="outline" className="text-xs gap-1">
            <Stethoscope className="h-3 w-3 text-teal" /> Provider-Guided
          </Badge>
        </div>
      </header>

      <section className="bg-gradient-to-b from-cloud to-sage/20 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge className="mb-4 bg-navy-100 text-navy border-navy-200">
            <Stethoscope className="mr-1 h-3 w-3" /> Designed for Adults 40+
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Weight Loss That Works<br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              With Your Age, Not Against It
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            After 40, biology changes. Your metabolism slows, hormones shift, and the old rules stop working.
            GLP-1 medication addresses the root cause — with providers experienced in age-appropriate care.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-lg font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">All-inclusive</span>
          </div>

          <div className="mt-8">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-12 h-16 text-lg rounded-2xl shadow-lg">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-graphite-400">Free assessment. Board-certified providers. Cancel anytime.</p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-10">Why GLP-1 Works Differently After 40</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {ageSpecificBenefits.map((b) => (
              <Card key={b.title}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                      <b.icon className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy">{b.title}</h3>
                      <p className="mt-1 text-xs text-graphite-500 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-50/30 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">Members Over 40 Share Their Results</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-5">
                  <div className="flex gap-0.5 mb-2">{[1,2,3,4,5].map((i) => <Star key={i} className="h-3.5 w-3.5 text-gold fill-gold" />)}</div>
                  <p className="text-xs text-graphite-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs font-bold text-navy">{t.name}, age {t.age}</p>
                    <Badge variant="default" className="text-[10px]">-{t.lbs} lbs in {t.months}mo</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-[10px] text-graphite-400">Verified members. Individual results vary.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-2xl font-bold text-navy">It&apos;s not too late. It&apos;s actually the perfect time.</h2>
          <p className="mt-3 text-sm text-graphite-500">Free assessment. Provider reviews typically within 1 business day. Medication ships free.</p>
          <div className="mt-6">
            <Link href="/qualify"><Button size="xl" className="gap-2 px-12 h-14 text-lg">See If I Qualify <ArrowRight className="h-5 w-5" /></Button></Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-graphite-400">
            <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> 30-day guarantee</span>
            <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-teal" /> No commitment</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-teal" /> Same-day evaluation</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-navy-100/40 py-6 text-center text-[10px] text-graphite-400">
        <p>Nature&apos;s Journey Health &middot; Compounded medications from licensed pharmacies &middot; Eligibility determined by providers</p>
      </footer>
    </div>
  );
}
