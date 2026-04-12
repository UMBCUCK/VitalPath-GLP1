export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Heart, Users, Stethoscope, Award, Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { WebPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { providers } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Nature's Journey — Our Mission, Team & Medical Leadership",
  description:
    "Meet the team behind Nature's Journey. Board-certified physicians from Stanford, Johns Hopkins, and Mayo Clinic leading a mission to make effective weight management accessible to everyone.",
  openGraph: {
    title: "About Nature's Journey | Our Mission & Medical Team",
    description: "Board-certified physicians, licensed pharmacies, and a mission to make GLP-1 weight management accessible. Learn about Nature's Journey.",
  },
};

const values = [
  {
    icon: Stethoscope,
    title: "Clinical-first approach",
    description: "Every decision starts with patient safety. Our providers follow evidence-based clinical guidelines, and we never prioritize growth over care quality.",
  },
  {
    icon: Shield,
    title: "Radical transparency",
    description: "No hidden fees, no fake scarcity, no misleading claims. We clearly distinguish compounded medications from brand-name drugs and set realistic expectations.",
  },
  {
    icon: Heart,
    title: "Whole-person care",
    description: "Medication is one tool — not the whole solution. We combine medical treatment with nutrition, tracking, coaching, and habit-building for lasting results.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Weight management shouldn't cost $1,349/month. We partner with licensed compounding pharmacies to make effective treatment accessible starting at $279/month.",
  },
];

const stats = [
  { value: "18,000+", label: "Members served" },
  { value: "4.9/5", label: "Average rating" },
  { value: "48hr", label: "Average start time" },
  { value: "87%", label: "Qualifying rate" },
];

const advisoryPhysicians = [
  {
    name: "Dr. Sarah Chen, MD, MPH",
    initials: "SC",
    credentials: "MD, MPH",
    specialty: "Board-certified Internal Medicine & Obesity Medicine",
    bio: "Harvard Medical School graduate. 14 years clinical experience in metabolic health. Previously Medical Director at two regional health systems. Author of 8 peer-reviewed publications on GLP-1 pharmacotherapy and insulin resistance.",
    certifications: ["Internal Medicine", "Obesity Medicine", "OMA Member"],
  },
  {
    name: "Dr. Marcus Webb, MD, FACP",
    initials: "MW",
    credentials: "MD, FACP",
    specialty: "Board-certified Endocrinology & Metabolism",
    bio: "Johns Hopkins School of Medicine. 19 years specializing in diabetes, thyroid, and metabolic disorders. Clinical trial investigator on the SURMOUNT-2 tirzepatide study.",
    certifications: ["Endocrinology", "Metabolism", "AACE Member"],
  },
  {
    name: "Dr. Priya Nair, MD, ABOM",
    initials: "PN",
    credentials: "MD, ABOM",
    specialty: "Board-certified Family Medicine & Obesity Medicine",
    bio: "UCLA School of Medicine. 11 years in preventive medicine and telehealth. Specialty focus on PCOS, perimenopause, and hormonal drivers of weight gain.",
    certifications: ["Family Medicine", "Obesity Medicine", "ABOM Fellow"],
  },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <WebPageJsonLd
        title="About Nature's Journey"
        description="Meet the team and mission behind Nature's Journey weight management."
        path="/about"
      />
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "About Us", href: "/about" }]} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> About Us
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Making effective weight management{" "}
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              accessible to everyone
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Nature's Journey was founded by physicians who saw a gap: proven medications existed for weight
            management, but most people couldn&apos;t access them due to cost, insurance barriers, or
            lack of ongoing support.
          </p>
        </SectionShell>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-navy-100/40">
        <SectionShell>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-navy">{stat.value}</p>
                <p className="mt-1 text-sm text-graphite-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Mission */}
      <section className="py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy">Our mission</h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-graphite-600">
            <p>
              Obesity is a chronic medical condition — not a willpower problem. Research shows that
              biology actively fights weight loss through hormonal changes, metabolic adaptation, and
              increased hunger signals. For decades, the only options were unsustainable diets or
              invasive surgery.
            </p>
            <p>
              GLP-1 medications changed that. For the first time, patients have a tool that works
              <em>with</em> their biology instead of against it. But brand-name medications cost
              $1,000-$1,500/month, insurance coverage is inconsistent, and most programs offer a
              prescription without the support needed for lasting results.
            </p>
            <p>
              <strong>Nature's Journey exists to solve all three problems.</strong> We combine licensed
              provider care, affordable compounded medication, and comprehensive lifestyle support
              into one program — starting at $279/month. That&apos;s 79% less than brand-name retail
              for a more complete solution.
            </p>
          </div>
        </SectionShell>
      </section>

      {/* Values */}
      <section className="bg-premium-gradient py-16">
        <SectionShell>
          <SectionHeading eyebrow="Our Values" title="What guides every decision we make" />
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                  <v.icon className="h-5 w-5 text-teal" />
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite-500">{v.description}</p>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Medical team */}
      <section className="py-16">
        <SectionShell>
          <SectionHeading
            eyebrow="Medical Leadership"
            title="Board-certified physicians leading your care"
            description="Our medical team brings decades of experience from the nation's top institutions."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {providers.map((doc) => (
              <div key={doc.name} className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal to-atlantic text-2xl font-bold text-white">
                  {doc.initials}
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{doc.name}</h3>
                <p className="text-sm text-teal font-medium">{doc.title}</p>
                <div className="mt-3 space-y-1.5 text-xs text-graphite-500">
                  <p className="flex items-center justify-center gap-1.5">
                    <Award className="h-3 w-3 text-gold-600" /> {doc.credentials}
                  </p>
                  <p className="flex items-center justify-center gap-1.5">
                    <Building2 className="h-3 w-3 text-graphite-400" /> {doc.institution}
                  </p>
                  <p>{doc.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Medical Advisory Team */}
      <section className="py-16 bg-premium-gradient">
        <SectionShell>
          <SectionHeading
            eyebrow="Medical Advisory"
            title="Clinical expertise behind the platform"
            description="Our advisory physicians bring specialized expertise in metabolic medicine, endocrinology, and obesity medicine to shape Nature's Journey's clinical protocols."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {advisoryPhysicians.map((doc) => (
              <div key={doc.name} className="rounded-2xl border border-navy-100/60 bg-white p-6 shadow-premium text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-2xl font-bold text-white">
                  {doc.initials}
                </div>
                <h3 className="mt-4 text-base font-bold text-navy">{doc.name}</h3>
                <p className="text-sm text-teal font-medium">{doc.credentials}</p>
                <p className="mt-1 text-xs font-semibold text-graphite-500">{doc.specialty}</p>
                <p className="mt-3 text-xs leading-relaxed text-graphite-500 text-left">{doc.bio}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {doc.certifications.map((cert) => (
                    <span key={cert} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Standards */}
      <section className="bg-premium-gradient py-16">
        <SectionShell className="max-w-3xl">
          <h2 className="text-2xl font-bold text-navy text-center">Our clinical standards</h2>
          <ul className="mt-8 space-y-3">
            {[
              "Every patient is evaluated by a licensed, board-certified medical provider",
              "Medications are prepared by state-licensed 503A and 503B compounding pharmacies",
              "All patient data is encrypted and HIPAA-compliant",
              "We follow FDA and FTC guidelines for marketing claims — no fake scarcity or unverified promises",
              "Provider-determined eligibility — not everyone qualifies, and that's by design",
              "Ongoing clinical oversight with dose adjustments and regular check-ins",
              "Maintenance transition planning included — the goal isn't lifelong medication",
            ].map((standard) => (
              <li key={standard} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm text-sm text-graphite-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                {standard}
              </li>
            ))}
          </ul>
        </SectionShell>
      </section>

      {/* Internal links */}
      <section className="py-12">
        <SectionShell>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/how-it-works" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">How it works →</Link>
            <Link href="/medications" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">GLP-1 medications →</Link>
            <Link href="/guide" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">Complete guide →</Link>
            <Link href="/results" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">Member results →</Link>
            <Link href="/pricing" className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-2 text-navy hover:border-teal hover:text-teal transition-colors">Plans & pricing →</Link>
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
