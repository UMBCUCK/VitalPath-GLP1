import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, BookOpen, Calculator, Scale, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionShell } from "@/components/shared/section-shell";

const popularPages = [
  { icon: Scale, label: "Take the Assessment", href: "/quiz", description: "See if you qualify for GLP-1 treatment" },
  { icon: BookOpen, label: "GLP-1 Guide", href: "/guide", description: "Complete guide to GLP-1 weight loss" },
  { icon: Calculator, label: "BMI Calculator", href: "/calculators/bmi", description: "Check your body mass index" },
  { icon: Utensils, label: "Recipes", href: "/meals", description: "High-protein GLP-1-friendly meals" },
];

const quickLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Compare Programs", href: "/compare" },
  { label: "State Availability", href: "/states" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "Glossary", href: "/glossary" },
];

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center py-20">
      <SectionShell className="max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy-50">
          <Search className="h-8 w-8 text-navy-300" />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-navy">Page not found</h1>
        <p className="mt-3 text-graphite-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Try one of these instead:
        </p>

        {/* Popular pages */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {popularPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group flex items-start gap-3 rounded-2xl border border-navy-100/60 bg-white p-4 text-left shadow-sm transition-all hover:shadow-premium hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                <page.icon className="h-5 w-5 text-teal" />
              </div>
              <div>
                <p className="text-sm font-bold text-navy group-hover:text-teal transition-colors">{page.label}</p>
                <p className="text-xs text-graphite-400">{page.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-graphite-300 mb-3">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-navy-100/40 bg-navy-50/20 px-3 py-1.5 text-xs font-medium text-navy hover:border-teal hover:text-teal transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link href="/quiz">
            <Button size="lg" className="gap-2">
              See If I Qualify <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </SectionShell>
    </section>
  );
}
