import type { Metadata } from "next";
import {
  Check,
  Star,
  Video,
  Clock,
  Shield,
  Truck,
  Stethoscope,
  Lock,
  MessageCircle,
  CalendarCheck,
  Salad,
  HeartPulse,
  Laptop,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LpHeader } from "@/components/lp/lp-header";
import { LpFooter } from "@/components/lp/lp-footer";
import { LpFaq } from "@/components/lp/lp-faq";
import { LpCtaSection } from "@/components/lp/lp-cta-section";
import { LpSocialProofBar } from "@/components/lp/lp-social-proof-bar";
import { LpConversionWidgets } from "@/components/lp/lp-conversion-widgets";
import { LpHeroBlock } from "@/components/lp/lp-hero-block";
import { LpMidCta } from "@/components/lp/lp-mid-cta";
import { LpProblemSection } from "@/components/lp/lp-problem-section";
import { LpComparisonTable } from "@/components/lp/lp-comparison-table";
import { LpInternalLinks } from "@/components/lp/lp-internal-links";
import {
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
  BreadcrumbJsonLd,
  HowToJsonLd,
} from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "See a Weight Loss Doctor Online \u2014 Medication Delivered | Nature\u2019s Journey",
  description:
    "Board-certified weight loss providers online. GLP-1 medication prescribed and shipped free if eligible. Telehealth evaluation within 1 business day. From $179/mo.",
  keywords: [
    "online weight loss doctor",
    "telehealth weight loss",
    "virtual weight loss clinic",
    "online GLP-1 prescription",
  ],
  openGraph: {
    title:
      "See a Weight Loss Doctor Online \u2014 Medication Delivered | Nature\u2019s Journey",
    description:
      "Board-certified weight loss providers online. GLP-1 medication prescribed and shipped free if eligible. Telehealth evaluation within 1 business day.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/lp/telehealth" },
};

/* ─── DATA ─────────────────────────────────────────────────── */

const heroStats = [
  { value: "18,000+", label: "Members served" },
  { value: "4.9", label: "Average rating", suffix: "/5" },
  { value: "<24hr", label: "Provider review" },
  { value: "Free", label: "2-day shipping" },
] as const;

const problemCards = [
  {
    icon: Clock,
    title: "In-Person Clinics Mean Waiting Weeks",
    description:
      "Long waitlists, time off work, and driving to appointments. By the time you get seen, your motivation has already faded.",
  },
  {
    icon: Shield,
    title: "Insurance Gatekeeping Delays Treatment",
    description:
      "Prior authorizations, step therapy requirements, and formulary restrictions can delay treatment by months \u2014 or block it entirely.",
  },
  {
    icon: Salad,
    title: "Most Weight Loss Programs Skip the Medicine",
    description:
      "Diet-only programs ignore the biological component of weight gain. Without addressing hormonal drivers, the cycle of loss and regain continues.",
  },
] as const;

const howItWorksSteps = [
  {
    icon: CalendarCheck,
    title: "Complete Assessment",
    time: "2 min, free",
    description:
      "Answer a short health questionnaire from your phone or computer. No payment required to start.",
  },
  {
    icon: Stethoscope,
    title: "Provider Review",
    time: "Within 24 hours",
    description:
      "A board-certified provider evaluates your health profile and determines if GLP-1 medication is appropriate for you.",
  },
  {
    icon: Truck,
    title: "Medication Ships",
    time: "Free 2-day delivery",
    description:
      "If prescribed, your medication ships directly to your door. No pharmacy lines. No extra trips.",
  },
];

const comparisonRows = [
  { feature: "Wait time", us: "<24 hours", them: "2-6 weeks" },
  { feature: "Monthly cost", us: "From $179/mo", them: "$300+ per visit + Rx" },
  { feature: "Insurance required", us: "No", them: "Usually yes" },
  { feature: "Provider access", us: "Messaging anytime", them: "Scheduled visits only" },
  { feature: "Medication delivery", us: "Free 2-day shipping", them: "Pharmacy pickup" },
  { feature: "Meal plans", us: true, them: false },
] as const;

const benefitsGrid = [
  {
    icon: Video,
    title: "100% Virtual Care",
    description:
      "Every step happens online \u2014 from assessment to prescription to ongoing check-ins. No office visits required.",
  },
  {
    icon: Stethoscope,
    title: "Board-Certified Providers",
    description:
      "Licensed weight loss providers evaluate your profile and manage your treatment with ongoing clinical oversight.",
  },
  {
    icon: Truck,
    title: "Free 2-Day Shipping",
    description:
      "Medication ships directly to your door in discreet packaging. No pharmacy trips, no waiting in line.",
  },
  {
    icon: Salad,
    title: "Personalized Meal Plans",
    description:
      "Nutrition guidance designed specifically for GLP-1 patients \u2014 included with every membership at no extra cost.",
  },
  {
    icon: MessageCircle,
    title: "Care Team Messaging",
    description:
      "Message your care team anytime with questions or concerns. Responses within 24 hours, not weeks.",
  },
  {
    icon: DollarSign,
    title: "No Insurance Required",
    description:
      "One transparent monthly price covers everything \u2014 provider evaluation, medication if prescribed, meal plans, and support.",
  },
];

const objections = [
  {
    icon: Stethoscope,
    question: "Is telehealth as good as in-person?",
    answer:
      "Yes. Our providers are the same board-certified clinicians you would see in person. Telehealth allows more frequent check-ins and faster adjustments to your treatment plan.",
    stat: "4.9/5",
    statLabel: "average member rating",
  },
  {
    icon: HeartPulse,
    question: "How do you prescribe without seeing me?",
    answer:
      "Our detailed health questionnaire collects the same information as an in-person visit. Your provider reviews your medical history, current medications, and health goals before making any prescribing decision.",
    stat: "Same",
    statLabel: "standard of care",
  },
  {
    icon: MessageCircle,
    question: "What if I need to talk to my provider?",
    answer:
      "Your care team is available through secure messaging. Questions are answered within 24 hours. If your provider needs more information, they will reach out directly.",
    stat: "<24hr",
    statLabel: "average response time",
  },
  {
    icon: Lock,
    question: "Is my information secure?",
    answer:
      "All data is protected with 256-bit encryption and stored in HIPAA-compliant systems. We follow the same security standards as major healthcare systems.",
    stat: "HIPAA",
    statLabel: "compliant platform",
  },
];

const testimonials = [
  {
    quote:
      "No waiting room, no driving across town. My provider reviewed my assessment the same day and my medication arrived two days later.",
    name: "Dana M.",
    age: 41,
    location: "Phoenix",
  },
  {
    quote:
      "I was skeptical about telehealth, but my provider is more accessible than any doctor I have had. I can message her anytime.",
    name: "Kevin L.",
    age: 53,
    location: "Charlotte",
  },
  {
    quote:
      "Between my job and two kids, I could never make it to a clinic. This program fits into my life instead of the other way around.",
    name: "Priya S.",
    age: 36,
    location: "Austin",
  },
];

const faqs = [
  {
    question: "How does telehealth weight loss work?",
    answer:
      "You start with a free 2-minute health assessment online. A board-certified provider reviews your profile within 1 business day. If GLP-1 medication is appropriate for you, it ships directly to your door with free 2-day delivery. Your provider monitors your progress and adjusts your plan through secure messaging.",
  },
  {
    question: "Is it safe to get weight loss medication online?",
    answer:
      "Yes. Our providers follow the same clinical guidelines as in-person weight loss clinics. Every prescription decision is made by a licensed, board-certified provider based on your complete health profile. Medications are dispensed from licensed US pharmacies.",
  },
  {
    question: "How quickly can I see a provider?",
    answer:
      "Most assessments are reviewed within 1 business day. There are no waitlists and no scheduling required. You complete your assessment when it is convenient for you, and your provider reviews it promptly.",
  },
  {
    question: "What medications can be prescribed through telehealth?",
    answer:
      "Our providers can prescribe GLP-1 receptor agonists including compounded semaglutide and tirzepatide. Your provider will determine the most appropriate medication based on your health profile, goals, and medical history.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Our membership includes everything \u2014 provider evaluation, medication if prescribed, personalized meal plans, and ongoing care team support. One transparent monthly price with no hidden fees.",
  },
  {
    question: "What if I am not eligible for GLP-1 medication?",
    answer:
      "If your provider determines that GLP-1 medication is not appropriate for you, you will not be charged. Your provider may recommend alternative treatment options based on your health profile.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. There are no long-term contracts. You can cancel your membership at any time through your dashboard or by contacting our care team.",
  },
];

const internalLinks = [
  {
    title: "Semaglutide Online",
    description:
      "The most prescribed GLP-1 for weight management \u2014 from $179/mo.",
    href: "/lp/semaglutide",
  },
  {
    title: "Affordable Weight Loss Plans",
    description:
      "Compare plans and find the right option for your budget.",
    href: "/lp/affordable",
  },
  {
    title: "Women\u2019s Weight Loss Program",
    description:
      "GLP-1 treatment designed around women\u2019s hormonal health.",
    href: "/lp/women-weight-loss",
  },
  {
    title: "Men\u2019s Weight Loss Program",
    description:
      "Provider-guided weight management built for men\u2019s physiology.",
    href: "/lp/men",
  },
];

/* ─── PAGE ─────────────────────────────────────────────────── */

export default function TelehealthPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="Virtual Weight Loss Clinic"
        badgeIcon={Laptop}
        badgeIconColor="text-teal"
      />

      {/* 1. HERO */}
      <LpHeroBlock
        badge="Now accepting new patients \u2014 telehealth evaluation available"
        headline="Start GLP-1 telehealth care by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="100% online. Board-certified providers evaluate you in 1 business day — may help you lose up to 8 lbs in your first month.* From $179/mo. Ships free. Individual results vary."
        stats={heroStats}
        ctaLocation="telehealth-hero"
      />

      {/* 2. SOCIAL PROOF BAR */}
      <LpSocialProofBar />

      {/* 3. PROBLEM SECTION */}
      <LpProblemSection
        cards={problemCards}
        heading="Why Getting Treatment Shouldn\u2019t Be This Hard"
        transitionText="Telehealth removes the barriers between you and effective treatment."
        ctaLocation="telehealth-problem"
      />

      {/* 4. HOW IT WORKS */}
      <section
        className="py-14 sm:py-16"
        style={{ backgroundColor: "var(--lp-section-alt, #f8fbfd)" }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-lp-body-muted">
            3 Simple Steps
          </p>
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-3">
            How It Works
          </h2>
          <p className="text-center text-sm text-lp-body mb-10 max-w-2xl mx-auto">
            From assessment to medication delivery &mdash; everything happens
            online.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {howItWorksSteps.map((step, i) => (
              <Card
                key={step.title}
                className="rounded-xl border bg-[var(--lp-card-bg,#fff)] opacity-0 animate-fade-in-up"
                style={{
                  borderColor: "var(--lp-card-border)",
                  animationDelay: `${0.1 + i * 0.1}s`,
                  animationFillMode: "forwards",
                }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--lp-icon-bg)" }}
                  >
                    <span
                      className="text-base font-bold"
                      style={{ color: "var(--lp-icon)" }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-lp-heading mb-1">
                    {step.title}
                  </h3>
                  <span
                    className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3"
                    style={{
                      backgroundColor: "var(--lp-icon-bg)",
                      color: "var(--lp-icon)",
                    }}
                  >
                    {step.time}
                  </span>
                  <p className="text-sm text-lp-body leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MID-PAGE CTA */}
      <LpMidCta
        headline="See if you qualify for telehealth weight loss"
        subtext="Free 2-minute assessment. Provider reviews within 1 business day."
        location="telehealth-mid"
      />

      {/* 6. COMPARISON TABLE */}
      <LpComparisonTable
        heading="Telehealth vs. In-Person Clinic"
        themLabel="In-Person Clinic"
        rows={comparisonRows}
      />

      {/* 7. BENEFITS GRID */}
      <section
        className="py-14 sm:py-16"
        style={{ backgroundColor: "var(--lp-section-alt, #f8fbfd)" }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-3">
            Everything You Need, All Online
          </h2>
          <p className="text-center text-sm text-lp-body mb-10 max-w-2xl mx-auto">
            Your membership includes provider care, medication, meal plans, and
            ongoing support &mdash; no hidden fees.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefitsGrid.map((benefit, i) => (
              <div
                key={benefit.title}
                className="rounded-xl border bg-[var(--lp-card-bg,#fff)] p-5 opacity-0 animate-fade-in-up"
                style={{
                  borderColor: "var(--lp-card-border)",
                  animationDelay: `${0.1 + i * 0.08}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "var(--lp-icon-bg)" }}
                >
                  <benefit.icon
                    className="h-5 w-5"
                    style={{ color: "var(--lp-icon)" }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-lp-heading mb-1">
                  {benefit.title}
                </h3>
                <p className="text-sm text-lp-body leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. OBJECTION HANDLER */}
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-3">
            Common Concerns, Straight Answers
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Everything you want to know about getting weight loss treatment
            online.
          </p>
          <div className="space-y-4">
            {objections.map((obj, i) => (
              <div
                key={i}
                className="rounded-xl border bg-[var(--lp-card-bg,#fff)] p-5 opacity-0 animate-fade-in-up"
                style={{
                  borderColor: "var(--lp-card-border)",
                  animationDelay: `${0.1 + i * 0.08}s`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "var(--lp-icon-bg)" }}
                  >
                    <obj.icon
                      className="h-5 w-5"
                      style={{ color: "var(--lp-icon)" }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-lp-heading mb-1">
                      {obj.question}
                    </h3>
                    <p className="text-sm text-lp-body leading-relaxed">
                      {obj.answer}
                    </p>
                    <div
                      className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
                      style={{ backgroundColor: "var(--lp-icon-bg)" }}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--lp-icon)" }}
                      >
                        {obj.stat}
                      </span>
                      <span className="text-xs text-lp-body-muted">
                        {obj.statLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section
        className="py-14"
        style={{ backgroundColor: "var(--lp-section-alt, #f8fbfd)" }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-10">
            Why Members Choose Telehealth
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="rounded-xl border bg-[var(--lp-card-bg,#fff)]"
                style={{ borderColor: "var(--lp-card-border)" }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-gold fill-gold"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm text-lp-body italic leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="text-sm font-semibold text-lp-heading">
                    {t.name}, {t.age}
                  </div>
                  <div className="text-xs text-lp-body-muted">
                    {t.location}
                  </div>
                  <p className="mt-2 text-[10px] text-lp-body-muted">
                    Verified member. Individual results vary.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <LpFaq
        faqs={faqs}
        subheading="Common questions about telehealth weight loss treatment."
      />

      {/* 11. INTERNAL LINKS */}
      <LpInternalLinks
        links={internalLinks}
        heading="Explore Related Programs"
      />

      {/* 12. FINAL CTA */}
      <LpCtaSection headline="Start your telehealth weight loss journey today" />

      <LpFooter />

      {/* JSON-LD Schemas */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Telehealth Weight Loss", href: "/lp/telehealth" },
        ]}
      />
      <HowToJsonLd
        name="How to See a Weight Loss Doctor Online"
        description="Three simple steps to get GLP-1 medication prescribed online through Nature's Journey telehealth."
        steps={[
          {
            title: "Complete a Free Assessment",
            description:
              "Answer a 2-minute health questionnaire online. No payment required.",
          },
          {
            title: "Provider Review",
            description:
              "A board-certified provider evaluates your health profile within 1 business day.",
          },
          {
            title: "Medication Delivered",
            description:
              "If prescribed, GLP-1 medication ships to your door with free 2-day delivery.",
          },
        ]}
      />
      <FAQPageJsonLd faqs={faqs} />
      <MedicalWebPageJsonLd
        name="See a Weight Loss Doctor Online"
        description="Board-certified weight loss providers online. GLP-1 medication prescribed and shipped free if eligible. Telehealth evaluation within 1 business day."
        url="/lp/telehealth"
      />
      <LpConversionWidgets />
    </div>
  );
}
