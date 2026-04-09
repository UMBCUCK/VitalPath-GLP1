export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, Heart, Utensils, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Maintenance Program",
  description: "Transition from active treatment to lasting maintenance with structured support, coaching, and habit-building tools.",
};

const features = [
  { icon: TrendingUp, title: "Progress monitoring", description: "Continue tracking weight, measurements, and habits with the same tools you've been using. Your data history carries over seamlessly." },
  { icon: Users, title: "Coaching support", description: "Regular check-ins with your health coach to navigate the transition, adjust strategies, and stay accountable during this critical phase." },
  { icon: Utensils, title: "Adapted nutrition plans", description: "Meal plans adjust as your caloric needs change. Recipes and grocery lists recalibrated for maintenance-level nutrition." },
  { icon: Heart, title: "Habit reinforcement", description: "Weekly focus modules shift from active weight loss to sustaining the habits that got you here. Built to prevent the common regression patterns." },
  { icon: BarChart3, title: "Biomarker tracking", description: "Optional lab work coordination to monitor metabolic markers and ensure your health improvements are holding steady." },
  { icon: Shield, title: "Provider oversight", description: "Your care team remains available for medication tapering guidance, dose adjustments, and clinical questions throughout the transition." },
];

export default function MaintenancePage() {
  return (
    <MarketingShell>
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="gold" className="mb-6">Maintenance Program</Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            The goal isn&apos;t just to lose weight. It&apos;s to keep it off.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Our maintenance program helps you transition from active treatment to lasting results
            with structured support, adapted nutrition, and ongoing accountability.
          </p>
          <div className="mt-10">
            <Link href="/quiz"><Button size="xl" className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </SectionShell>
      </section>

      <section className="py-20">
        <SectionShell>
          <SectionHeading eyebrow="What's Included" title="Support that evolves with you" description="Maintenance isn't the end of your program — it's the phase where habits become permanent." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="card-hover">
                <CardContent className="p-6">
                  <f.icon className="h-6 w-6 text-teal" />
                  <h3 className="mt-4 text-base font-bold text-navy">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite-500">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionShell>
      </section>

      <section className="bg-premium-gradient py-16">
        <SectionShell className="text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-navy">Built into every plan</h2>
          <p className="mt-4 text-graphite-500">
            Maintenance transition planning is included in our Premium and Complete plans from day one.
            Your care team starts discussing maintenance strategies well before you reach your goal,
            so the transition feels natural rather than abrupt.
          </p>
          <div className="mt-8">
            <Link href="/pricing"><Button variant="outline" className="gap-2">View Plans <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
