import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Star, Heart, Sparkles, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "GLP-1 Weight Loss for Women | PCOS, Perimenopause, Hormonal Weight | Nature's Journey",
  description: "GLP-1 medication designed around women's biology. Specialized protocols for PCOS, perimenopause, and hormonal weight gain. Board-certified providers. From $279/mo.",
};

const womenSpecificBenefits = [
  { title: "PCOS-Informed Protocols", description: "Our providers understand the insulin resistance and hormonal imbalances that make weight loss with PCOS feel impossible. GLP-1 medication addresses both.", icon: Heart },
  { title: "Perimenopause Support", description: "Metabolic changes during perimenopause slow weight loss. We adjust treatment plans to account for hormonal shifts and changing metabolism.", icon: Sparkles },
  { title: "Thyroid-Aware Treatment", description: "Hypothyroidism affects 1 in 8 women. Our providers screen for thyroid issues and adjust GLP-1 protocols accordingly.", icon: ShieldCheck },
  { title: "Reproductive Health Safety", description: "Comprehensive screening for pregnancy planning, breastfeeding, and fertility treatments. Your safety is never compromised.", icon: Heart },
];

const testimonials = [
  { name: "Rachel K.", age: 38, condition: "PCOS", lbs: 34, months: 5, quote: "After years of being told to 'just eat less,' finally a treatment that works with my PCOS — not against it." },
  { name: "Lisa M.", age: 47, condition: "Perimenopause", lbs: 28, months: 4, quote: "Perimenopause weight was the last straw. Down 28 lbs and my hot flashes have even improved." },
  { name: "Priya S.", age: 33, condition: "Hormonal", lbs: 42, months: 6, quote: "My provider understood that my weight wasn't about willpower. The meal plans for GLP-1 were a game-changer." },
];

const stats = [
  { value: "6,200+", label: "Women members" },
  { value: "4.9/5", label: "Average rating" },
  { value: "94%", label: "Would recommend" },
  { value: "18%", label: "Avg body weight loss" },
];

export default function WomenLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header */}
      <header className="border-b border-navy-100/40 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-atlantic">
              <span className="text-xs font-bold text-white">NJ</span>
            </div>
            <span className="text-sm font-bold text-navy">Nature&apos;s Journey</span>
          </div>
          <Badge variant="outline" className="text-xs gap-1">
            <Heart className="h-3 w-3 text-pink-500" /> Women&apos;s Health
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-pink-50/50 via-cloud to-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">
            <Heart className="mr-1 h-3 w-3" /> Designed for Women&apos;s Biology
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            GLP-1 Weight Loss That<br />
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Understands Your Body
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Specialized protocols for PCOS, perimenopause, thyroid conditions, and hormonal weight gain.
            Prescribed by providers who understand women&apos;s health.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-navy-50 px-6 py-2">
            <span className="text-sm text-graphite-400 line-through">$1,349/mo retail</span>
            <span className="text-lg font-bold text-navy">$279/mo</span>
            <span className="rounded-full bg-pink-500 px-2.5 py-0.5 text-xs font-bold text-white">Save 79%</span>
          </div>

          <div className="mt-8">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-12 h-16 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-graphite-400">Free 2-minute assessment. HIPAA protected. Cancel anytime.</p>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-pink-100 bg-white p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-navy">{s.value}</p>
                <p className="text-[10px] text-graphite-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Women-specific benefits */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-2">Built for Women&apos;s Health</h2>
          <p className="text-center text-sm text-graphite-500 mb-10">Your biology is different. Your treatment should be too.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {womenSpecificBenefits.map((b) => (
              <Card key={b.title}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50">
                      <b.icon className="h-5 w-5 text-pink-500" />
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

      {/* Provider highlight */}
      <section className="bg-pink-50/30 py-14">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-xl font-bold text-white mb-4">PN</div>
          <h3 className="text-lg font-bold text-navy">Dr. Priya Nair, MD</h3>
          <p className="text-sm text-graphite-500">UCLA School of Medicine &middot; 11 years experience</p>
          <p className="mt-3 text-sm text-graphite-600 leading-relaxed max-w-lg mx-auto">
            &ldquo;Women&apos;s weight management requires understanding the hormonal landscape — PCOS, perimenopause,
            thyroid function. GLP-1 medication is remarkably effective when the protocol accounts for these factors.&rdquo;
          </p>
          <div className="mt-3 flex justify-center gap-1">
            {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4 text-gold fill-gold" />)}
            <span className="ml-1 text-xs text-graphite-400">4.8/5 (612 reviews)</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-navy text-center mb-8">Real Women, Real Results</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-5">
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="h-3.5 w-3.5 text-gold fill-gold" />)}
                  </div>
                  <p className="text-xs text-graphite-600 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-navy">{t.name}, {t.age}</p>
                      <p className="text-[10px] text-graphite-400">{t.condition}</p>
                    </div>
                    <Badge className="bg-pink-100 text-pink-700 text-[10px]">-{t.lbs} lbs</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-[10px] text-graphite-400">Verified members. Individual results vary.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-14">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-2xl font-bold text-navy">Your body deserves a treatment built for it</h2>
          <p className="mt-3 text-sm text-graphite-500">Free 2-minute assessment. Provider reviews typically within 1 business day.</p>
          <div className="mt-6">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-12 h-14 text-lg">See If I Qualify <ArrowRight className="h-5 w-5" /></Button>
            </Link>
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
