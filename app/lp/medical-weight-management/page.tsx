import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Stethoscope, ClipboardList, Package, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LpConversionWidgets } from "@/components/lp/lp-conversion-widgets";
import { MedicalWebPageJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Medical Weight Management Consultation | Nature's Journey",
  description:
    "Get evaluated by a licensed provider from the comfort of home. Personalized medical weight management programs with ongoing provider support. See if you qualify today.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/lp/medical-weight-management",
  },
};

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Complete a short health assessment",
    body: "Answer questions about your health history, goals, and lifestyle from your phone or computer. Takes about 2 minutes.",
  },
  {
    icon: Stethoscope,
    number: "02",
    title: "A licensed provider reviews your profile",
    body: "A board-certified provider evaluates your assessment and determines whether a medical treatment plan is appropriate for you.",
  },
  {
    icon: Package,
    number: "03",
    title: "Your program begins",
    body: "If eligible, your personalized treatment plan is prepared and shipped directly to your door with free 2-day delivery.",
  },
];

const programFeatures = [
  "Licensed provider evaluation included — no separate consult fee",
  "Ongoing care team access and monthly provider check-ins",
  "Structured nutrition guidance and personalized meal plans",
  "Progress tracking and dose adjustments as clinically appropriate",
  "Secure, HIPAA-compliant messaging with your care team",
  "Free 2-day discreet shipping if a prescription is issued",
  "Cancel, pause, or adjust your plan anytime — no contracts",
  "30-day satisfaction guarantee on membership fees",
];

const faqs = [
  {
    q: "Who is this program for?",
    a: "This program is for adults who want medical evaluation and support for weight management. Eligibility is determined by your licensed provider based on your health profile, medical history, and clinical guidelines.",
  },
  {
    q: "How does the provider evaluation work?",
    a: "After completing the online health assessment, a board-certified provider reviews your information. They evaluate your eligibility for a treatment plan based on clinical criteria. You can message your provider directly through our HIPAA-secure platform.",
  },
  {
    q: "What does the membership include?",
    a: "Your membership covers the provider evaluation, personalized treatment planning, ongoing care team support, nutrition guidance, and progress tracking. If a prescription is issued by your provider, medication pricing is discussed separately before dispensing.",
  },
  {
    q: "Is treatment guaranteed?",
    a: "No — and we're upfront about that. A licensed provider determines whether treatment is clinically appropriate for you. Not all patients qualify for a prescription. If you do not qualify for prescription treatment, we offer alternative support paths.",
  },
  {
    q: "How do I contact my provider?",
    a: "Through our secure, HIPAA-compliant messaging platform included in your membership. Providers typically respond within 1 business day.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no long-term contracts. You can cancel, pause, or change your plan at any time by contacting our care team.",
  },
];

export default function MedicalWeightManagementLP() {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-navy-100/40 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-atlantic">
              <span className="text-xs font-bold text-white">NJ</span>
            </div>
            <span className="text-sm font-bold text-navy">Nature&apos;s Journey</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:18885092745"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-graphite-500 hover:text-navy transition-colors"
            >
              (888) 509-2745
            </a>
            <div className="flex items-center gap-1.5 text-xs text-graphite-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-cloud to-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5">
            <Stethoscope className="h-3.5 w-3.5 text-teal" />
            <span className="text-xs font-semibold text-teal">Provider evaluation available today</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            Medical Weight Management
            <br />
            <span className="bg-gradient-to-r from-teal to-atlantic bg-clip-text text-transparent">
              From the Comfort of Home
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-graphite-500">
            Get evaluated by a board-certified provider without leaving home.
            Personalized treatment plans. Ongoing clinical support.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link href="/qualify">
              <Button
                size="xl"
                className="gap-2 px-12 h-16 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                See If I Qualify — Free Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-xs text-graphite-400">
              Takes 2 minutes &middot; No commitment &middot; HIPAA protected
            </p>
          </div>

          {/* Trust stats */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: "18,000+", label: "Members served" },
              { value: "4.9/5", label: "Member satisfaction" },
              { value: "1 biz day", label: "Provider review" },
              { value: "All 50", label: "States covered" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-navy-100/40 bg-white p-3 text-center shadow-sm">
                <p className="text-lg font-bold text-navy">{stat.value}</p>
                <p className="text-[10px] text-graphite-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-navy-100/40 bg-navy-50/30 py-3">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-graphite-500">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-teal" />
            18,000+ patients served
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Board-certified providers
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-teal" />
            Licensed in all 50 states
          </span>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-center text-sm text-graphite-500">
            Three steps to get started with a licensed provider evaluation.
          </p>

          <div className="mt-10 space-y-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-5 rounded-2xl border border-navy-100/40 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal/10 to-atlantic/10 border border-teal/20">
                  <step.icon className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-graphite-300">
                    Step {step.number}
                  </p>
                  <h3 className="mt-0.5 font-semibold text-navy">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite-500">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-linen/40 py-14">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center text-2xl font-bold text-navy">Everything included in your membership</h2>
          <div className="mt-8 space-y-3">
            {programFeatures.map((f) => (
              <div key={f} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm border border-navy-100/30">
                <Check className="h-5 w-5 shrink-0 text-teal mt-0.5" />
                <span className="text-sm text-navy">{f}</span>
              </div>
            ))}
          </div>

          {/* Medication cost transparency */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-xs font-semibold text-amber-800">About medication pricing</p>
            <p className="mt-1 text-xs text-amber-700 leading-relaxed">
              Membership fees cover program access, provider evaluation, and care team support.
              If your provider issues a prescription, medication pricing is discussed with you before dispensing.
              Medication costs are separate and vary based on dosage and formulation.
            </p>
          </div>
        </div>
      </section>

      {/* Provider credentials */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-navy">
            Your care team
          </h2>
          <p className="mt-3 text-center text-sm text-graphite-500">
            All providers are independently licensed physicians. Credentials are independently verifiable.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                initials: "SC",
                name: "Dr. Sarah Chen, MD",
                title: "Chief Medical Officer",
                credential: "Board-Certified Internal Medicine",
                training: "Stanford School of Medicine",
              },
              {
                initials: "JW",
                name: "Dr. James Walker, DO",
                title: "Medical Director",
                credential: "Board-Certified Family Medicine",
                training: "Johns Hopkins University",
              },
              {
                initials: "MR",
                name: "Dr. Maria Rodriguez, MD",
                title: "Clinical Lead",
                credential: "Board-Certified Endocrinology",
                training: "Mayo Clinic",
              },
            ].map((p) => (
              <div key={p.name} className="rounded-xl border border-navy-100/40 bg-white p-5 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-navy to-atlantic font-bold text-white">
                  {p.initials}
                </div>
                <p className="mt-3 font-semibold text-navy text-sm">{p.name}</p>
                <p className="text-xs text-teal">{p.title}</p>
                <p className="mt-2 text-[11px] text-graphite-400">{p.credential}</p>
                <p className="text-[11px] text-graphite-400">{p.training}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-graphite-400">
            All providers licensed in all 50 states &middot;{" "}
            <Link href="/providers" className="text-teal hover:underline">
              View full credentials &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-linen/40 py-14">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center text-2xl font-bold text-navy">Common questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-navy-100/40 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-navy list-none">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-graphite-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-navy-100/30 px-5 py-4">
                  <p className="text-sm leading-relaxed text-graphite-600">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-2xl font-bold text-navy">
            Get your provider evaluation today
          </h2>
          <p className="mt-3 text-sm text-graphite-500">
            Free 2-minute assessment. Provider review typically within 1 business day.
            No commitment required.
          </p>
          <div className="mt-6">
            <Link href="/qualify">
              <Button size="xl" className="gap-2 px-12 h-14 text-base">
                See If I Qualify <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-graphite-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              30-day membership satisfaction guarantee
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-teal" />
              HIPAA protected
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-teal" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-100/40 py-8">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-[11px] leading-relaxed text-graphite-400">
            Nature&apos;s Journey Health facilitates access to independently licensed healthcare providers and does not practice medicine.
            Treatment eligibility is determined solely by a licensed provider based on a clinical evaluation.
            Prescription treatment is not guaranteed. Individual results vary.
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-graphite-400">
            Compounded medications dispensed through licensed 503A/503B pharmacies are <strong>not FDA-approved drug products</strong> and are not the same
            as brand-name medications. Prescriptions are issued only when clinically appropriate.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-graphite-400">
            <Link href="/legal/terms" className="hover:text-navy transition-colors">Terms</Link>
            <span>·</span>
            <Link href="/legal/privacy" className="hover:text-navy transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/legal/hipaa" className="hover:text-navy transition-colors">HIPAA Notice</Link>
            <span>·</span>
            <Link href="/providers" className="hover:text-navy transition-colors">Provider Credentials</Link>
          </div>
          <p className="mt-3 text-[10px] text-graphite-300">
            &copy; {new Date().getFullYear()} Nature&apos;s Journey Health, LLC. 1209 Orange St, Wilmington, DE 19801.
            All rights reserved.
          </p>
        </div>
      </footer>

      <MedicalWebPageJsonLd name="Medical Weight Management Consultation" description="Get evaluated by a licensed provider for personalized medical weight management." url="/lp/medical-weight-management" />
      <LpConversionWidgets />
    </div>
  );
}
