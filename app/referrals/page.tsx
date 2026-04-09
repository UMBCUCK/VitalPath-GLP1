export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Users, DollarSign, TrendingUp, ArrowRight, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Refer a Friend",
  description:
    "Share VitalPath with friends and earn credit toward your membership. Our referral program rewards you for spreading the word.",
};

const tiers = [
  { name: "Member", referrals: "1-4", reward: "$50", color: "from-teal-50 to-sage" },
  { name: "Silver", referrals: "5-9", reward: "$60", color: "from-navy-50 to-sage/50" },
  { name: "Gold", referrals: "10-24", reward: "$75", color: "from-gold-50 to-linen" },
  { name: "Ambassador", referrals: "25+", reward: "$100", color: "from-gold-100 to-gold-50" },
];

const steps = [
  { title: "Share your link", description: "Get a unique referral link from your dashboard. Share it with friends, family, or on social media." },
  { title: "They subscribe", description: "When someone uses your link to start a VitalPath membership, they get a welcome discount too." },
  { title: "You earn credit", description: "Earn membership credit for every successful referral. Credits are applied to your next billing cycle." },
];

export default function ReferralsPage() {
  return (
    <MarketingShell>
      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="gold" className="mb-6 gap-1.5">
            <Gift className="h-3.5 w-3.5" />
            Referral Program
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Share VitalPath, earn credit
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Know someone who could benefit from provider-guided weight management?
            Earn membership credit for every friend who subscribes.
          </p>
          <div className="mt-10">
            <Link href="/dashboard/referrals">
              <Button size="xl" className="gap-2">
                Get Your Referral Link
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>

      {/* How it works */}
      <section className="py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="How It Works"
            title="Three simple steps to start earning"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-50 to-sage text-xl font-bold text-teal">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-500">{step.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Reward tiers */}
      <section className="bg-premium-gradient py-20">
        <SectionShell>
          <SectionHeading
            eyebrow="Reward Tiers"
            title="The more you share, the more you earn"
            description="Earn increasing rewards as you reach referral milestones."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <Card key={tier.name} className="text-center">
                <CardContent className="p-6">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tier.color}`}>
                    <DollarSign className="h-7 w-7 text-navy" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-navy">{tier.name}</h3>
                  <p className="mt-1 text-3xl font-bold text-teal">{tier.reward}</p>
                  <p className="text-sm text-graphite-400">per referral</p>
                  <Badge variant="secondary" className="mt-3">
                    {tier.referrals} referrals
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Stats */}
      <section className="py-20">
        <SectionShell>
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <Users className="h-5 w-5 text-teal" />
                <span className="text-3xl font-bold text-navy">3,200+</span>
              </div>
              <p className="mt-1 text-sm text-graphite-400">Active referrers</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <DollarSign className="h-5 w-5 text-gold-600" />
                <span className="text-3xl font-bold text-navy">$247K+</span>
              </div>
              <p className="mt-1 text-sm text-graphite-400">Total credits earned</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5">
                <TrendingUp className="h-5 w-5 text-teal" />
                <span className="text-3xl font-bold text-navy">4.2</span>
              </div>
              <p className="mt-1 text-sm text-graphite-400">Avg referrals per member</p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* CTA */}
      <section className="bg-navy-gradient py-20">
        <SectionShell className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start earning today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-navy-300">
            Log in to your dashboard to get your unique referral link and start sharing.
          </p>
          <div className="mt-8">
            <Link href="/dashboard/referrals">
              <Button size="xl" variant="gold" className="gap-2">
                Go to Referral Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionShell>
      </section>
    </MarketingShell>
  );
}
