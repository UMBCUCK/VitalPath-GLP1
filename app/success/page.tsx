"use client";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { UpsellModal } from "@/components/checkout/upsell-modal";
import { ReferralPrompt } from "@/components/checkout/referral-prompt";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Calendar, MessageCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/shared/section-shell";
import { Badge } from "@/components/ui/badge";
import { track, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function SuccessPage() {
  const [showUpsell, setShowUpsell] = useState(false);

  // Track success page view — critical for conversion attribution
  useEffect(() => {
    track(ANALYTICS_EVENTS.CHECKOUT_COMPLETE, { source: "success_page" });
  }, []);

  // Delay upsell 3.5s so the user absorbs the success moment first
  useEffect(() => {
    const timer = setTimeout(() => setShowUpsell(true), 3500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <MarketingShell><section className="min-h-[80vh] bg-gradient-to-b from-cloud to-sage/20 py-16">
      <SectionShell className="max-w-2xl text-center">
        {/* Success icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal to-atlantic shadow-glow">
          <CheckCircle className="h-10 w-10 text-white" />
        </div>

        <h1 className="mt-8 text-3xl font-bold text-navy sm:text-4xl">
          Welcome to Nature's Journey
        </h1>

        <p className="mt-4 text-lg text-graphite-500">
          Your membership is active. Here&apos;s what happens next.
        </p>

        {/* Next steps */}
        <div className="mt-10 space-y-4 text-left">
          <Card>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                <span className="text-sm font-bold text-teal">1</span>
              </div>
              <div>
                <p className="font-semibold text-navy">Provider review begins</p>
                <p className="mt-1 text-sm text-graphite-500">
                  A licensed provider will review your intake within 24 hours and determine your
                  treatment plan. You&apos;ll receive a notification when your plan is ready.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                <span className="text-sm font-bold text-teal">2</span>
              </div>
              <div>
                <p className="font-semibold text-navy">Set up your dashboard</p>
                <p className="mt-1 text-sm text-graphite-500">
                  Configure your profile, set your goals, and explore the tracking tools
                  available to you. The sooner you start, the more momentum you&apos;ll build.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                <span className="text-sm font-bold text-teal">3</span>
              </div>
              <div>
                <p className="font-semibold text-navy">Medication ships fast</p>
                <p className="mt-1 text-sm text-graphite-500">
                  If your provider prescribes medication, it ships within 24-48 hours from a
                  state-licensed pharmacy with discreet, temperature-controlled packaging.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What your first week looks like — reduces anxiety, increases activation */}
        <Card className="mt-10 text-left">
          <CardContent className="p-6">
            <h3 className="text-base font-bold text-navy mb-4">Your first week at a glance</h3>
            <div className="space-y-3">
              {[
                { day: "Today", action: "Your provider begins reviewing your health profile", icon: "review" },
                { day: "Day 1-2", action: "Provider creates your personalized treatment plan", icon: "plan" },
                { day: "Day 2-3", action: "Medication ships from licensed pharmacy (free 2-day shipping)", icon: "ship" },
                { day: "Day 4-5", action: "Medication arrives — your care team sends first-dose guidance", icon: "arrive" },
                { day: "Day 7", action: "First check-in with your care team to see how you're doing", icon: "checkin" },
              ].map((item, i) => (
                <div key={item.day} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-xs font-bold text-teal">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-teal">{item.day}</span>
                    <p className="text-sm text-graphite-600">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick links */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-2 rounded-xl border border-navy-100/60 bg-white p-4 shadow-premium transition-all hover:shadow-premium-md">
            <Calendar className="h-5 w-5 text-teal" />
            <span className="text-xs font-medium text-navy">Your Dashboard</span>
          </Link>
          <Link href="/dashboard/messages" className="flex flex-col items-center gap-2 rounded-xl border border-navy-100/60 bg-white p-4 shadow-premium transition-all hover:shadow-premium-md">
            <MessageCircle className="h-5 w-5 text-teal" />
            <span className="text-xs font-medium text-navy">Message Care Team</span>
          </Link>
          <Link href="/faq" className="flex flex-col items-center gap-2 rounded-xl border border-navy-100/60 bg-white p-4 shadow-premium transition-all hover:shadow-premium-md">
            <BookOpen className="h-5 w-5 text-teal" />
            <span className="text-xs font-medium text-navy">Read FAQ</span>
          </Link>
        </div>

        {/* Post-purchase offer teaser */}
        <Card className="mt-10 bg-gradient-to-r from-gold-50 to-linen border-gold-200">
          <CardContent className="p-6">
            <Badge variant="gold" className="mb-3">Member Exclusive</Badge>
            <h3 className="text-base font-bold text-navy">
              Add nutrition support to your plan
            </h3>
            <p className="mt-2 text-sm text-graphite-500">
              Members who add meal plans and recipes to their program report higher satisfaction
              and better adherence. Add it now and get your first month at 20% off.
            </p>
            <div className="mt-4">
              <Button variant="gold" className="gap-2">
                Add Meal Plans &mdash; $15/mo first month
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-[10px] text-graphite-300">
              Regular price $19/mo after first month. Cancel anytime.
            </p>
          </CardContent>
        </Card>

        {/* Referral prompt — viral growth lever */}
        <div className="mt-10">
          <ReferralPrompt />
        </div>

        <div className="mt-8">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Go to Your Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionShell>
    </section>
    <UpsellModal show={showUpsell} onClose={() => setShowUpsell(false)} />
  </MarketingShell>
  );
}
