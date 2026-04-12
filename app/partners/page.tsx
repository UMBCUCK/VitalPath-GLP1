import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, DollarSign, Users, BarChart3, Zap, Gift, Check, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Partner with Nature's Journey | Affiliate & Referral Program",
  description: "Earn up to $100 per referral as a Nature's Journey partner. Tiered commissions, real-time dashboard, marketing assets, and dedicated support. Apply today.",
};

const tiers = [
  { name: "Standard", refs: "1-4", perRef: "$50", color: "bg-navy-200", features: ["Unique referral link", "Real-time dashboard", "Monthly payouts"] },
  { name: "Silver", refs: "5-9", perRef: "$60", color: "bg-slate-400", features: ["Everything in Standard", "Priority support", "Co-branded assets"] },
  { name: "Gold", refs: "10-24", perRef: "$75", color: "bg-gold", features: ["Everything in Silver", "Dedicated manager", "Custom landing pages"] },
  { name: "Ambassador", refs: "25+", perRef: "$100", color: "bg-gradient-to-r from-purple-500 to-pink-500", features: ["Everything in Gold", "Custom commission rates", "Revenue share options", "Featured partner listing"] },
];

const partnerTypes = [
  { icon: Users, title: "Health & Wellness Influencers", description: "Share evidence-based weight loss with your audience. We provide clinical data, compliance-reviewed content, and FTC-compliant disclosure templates." },
  { icon: BarChart3, title: "Healthcare Professionals", description: "Refer patients to a comprehensive GLP-1 program with full medical oversight. Track outcomes and earn per-patient commissions." },
  { icon: Zap, title: "Corporate Wellness Programs", description: "Offer GLP-1 weight management as an employee benefit. Volume pricing and group onboarding available." },
  { icon: Gift, title: "Content Creators & Bloggers", description: "Write about GLP-1 weight loss? Earn commissions by referring readers. We provide SEO content, data sheets, and comparison materials." },
];

const stats = [
  { value: "$2.1M+", label: "Paid to partners" },
  { value: "3,200+", label: "Active partners" },
  { value: "18%", label: "Avg conversion rate" },
  { value: "30 days", label: "Cookie duration" },
];

export default function PartnersPage() {
  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-cloud to-sage/20 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6"><Award className="mr-1 h-3 w-3" /> Partner Program</Badge>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Earn Up to $100 Per Referral
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Join 3,200+ partners earning commissions by sharing Nature&apos;s Journey.
            Tiered payouts, real-time tracking, and marketing assets included.
          </p>
          <div className="mt-8">
            <Link href="/qualify?source=partner">
              <Button size="xl" className="gap-2 h-14 text-lg">Apply to Partner Program <ArrowRight className="h-5 w-5" /></Button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-navy-100/40 bg-white p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-navy">{s.value}</p>
                <p className="text-[10px] text-graphite-400">{s.label}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Tiers */}
      <section className="py-16">
        <SectionShell>
          <h2 className="text-2xl font-bold text-navy text-center mb-10">Commission Tiers</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => (
              <Card key={t.name} className={t.name === "Ambassador" ? "border-2 border-purple-300 ring-4 ring-purple-100" : ""}>
                <CardContent className="p-5">
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold ${t.color}`}>
                    {t.name[0]}
                  </div>
                  <h3 className="mt-3 text-base font-bold text-navy">{t.name}</h3>
                  <p className="text-xs text-graphite-400">{t.refs} referrals</p>
                  <p className="mt-2 text-2xl font-bold text-teal">{t.perRef}<span className="text-xs font-normal text-graphite-400">/referral</span></p>
                  <ul className="mt-3 space-y-1.5">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-graphite-600">
                        <Check className="h-3 w-3 text-teal shrink-0 mt-0.5" />{f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Partner types */}
      <section className="bg-navy-50/30 py-16">
        <SectionShell>
          <h2 className="text-2xl font-bold text-navy text-center mb-10">Who Partners With Us</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {partnerTypes.map((p) => (
              <Card key={p.title}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                      <p.icon className="h-5 w-5 text-teal" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-navy">{p.title}</h3>
                      <p className="mt-1 text-xs text-graphite-500 leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Testimonial */}
      <section className="py-12">
        <SectionShell className="max-w-xl text-center">
          <div className="flex justify-center gap-0.5 mb-3">{[1,2,3,4,5].map((i) => <Star key={i} className="h-5 w-5 text-gold fill-gold" />)}</div>
          <blockquote className="text-lg text-graphite-600 italic">
            &ldquo;I earn $750/month sharing Nature&apos;s Journey with my wellness community. The conversion rate is incredible because the product actually works.&rdquo;
          </blockquote>
          <p className="mt-3 text-sm font-semibold text-navy">— Dr. Amanda R., Health Content Creator</p>
          <p className="text-[10px] text-graphite-400">Gold Tier Partner &middot; 14 referrals/month average</p>
        </SectionShell>
      </section>

      <section className="bg-gradient-to-r from-navy to-atlantic py-16 text-white text-center">
        <SectionShell className="max-w-xl">
          <h2 className="text-2xl font-bold">Ready to earn?</h2>
          <p className="mt-3 text-sm text-navy-300">Apply in 2 minutes. Get your referral link instantly. Start earning today.</p>
          <div className="mt-6">
            <Link href="/qualify?source=partner">
              <Button size="xl" variant="gold" className="gap-2 h-14 text-lg">Apply Now <ArrowRight className="h-5 w-5" /></Button>
            </Link>
          </div>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
