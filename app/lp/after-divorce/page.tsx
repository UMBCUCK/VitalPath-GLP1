import type { Metadata } from "next";
import {
  Check,
  Star,
  Flame,
  Brain,
  Clock,
  Scale,
  Heart,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LpHeader } from "@/components/lp/lp-header";
import { LpFooter } from "@/components/lp/lp-footer";
import { LpFaq } from "@/components/lp/lp-faq";
import { LpCtaSection } from "@/components/lp/lp-cta-section";
import { LpSocialProofBar } from "@/components/lp/lp-social-proof-bar";
import { LpConversionWidgets } from "@/components/lp/lp-conversion-widgets";
import { LpHeroBlock } from "@/components/lp/lp-hero-block";
import { LpMidCta } from "@/components/lp/lp-mid-cta";
import { LpProblemSection } from "@/components/lp/lp-problem-section";
import { LpInternalLinks } from "@/components/lp/lp-internal-links";
import { LpOutcomeStats } from "@/components/lp/lp-outcome-stats";
import { LpPriceCompare } from "@/components/lp/lp-price-compare";
import { LpProviderCredential } from "@/components/lp/lp-provider-credential";
import { LpJourneyRoadmap } from "@/components/lp/lp-journey-roadmap";
import {
  FAQPageJsonLd,
  MedicalWebPageJsonLd,
  BreadcrumbJsonLd,
} from "@/components/seo/json-ld";

// ============================================================================
// AI-IMAGE PROMPT (hero background — optional, wire into LpHeroBlock when ready)
// Aspect ratio: 16:9
// "Editorial photograph of a confident woman in her late 40s standing at her
//  kitchen island in the morning, flowing hair with silver streaks, cream
//  linen robe, pouring coffee into a ceramic mug, warm natural window light,
//  peaceful confident smile, soft depth of field, Canon R5 50mm f/1.8.
//  Emphasis on grounded independence, a new morning, an open life."
// ============================================================================

export const metadata: Metadata = {
  // Primary keywords: post-divorce weight loss, weight loss new chapter, divorce weight gain, reinvention GLP-1, midlife divorce glow up
  title: "Post-Divorce Weight Loss | GLP-1 | From $179/mo | Nature's Journey",
  description:
    "The next chapter is yours. Prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Same active ingredient as Ozempic. From $179/mo. Individual results vary.",
  openGraph: {
    title: "Post-Divorce Weight Loss — GLP-1 from $179/mo",
    description:
      "You survived. Now thrive. Prescribed GLP-1 from licensed US providers. Same active ingredient as Ozempic. 2-minute eligibility.",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/lp/after-divorce",
  },
};

const heroStats = [
  { value: "Your time", label: "Now" },
  { value: "15-20%*", label: "Avg weight loss" },
  { value: "$179/mo", label: "Starting at" },
  { value: "18,000+", label: "Members" },
];

const outcomeStats = [
  {
    value: "18,000+",
    label: "Members on program",
    sublabel: "A community rewriting their next chapter.",
  },
  {
    value: "15-20%*",
    label: "Avg total body weight loss",
    sublabel: "Clinical-trial range for GLP-1 therapy over 12+ months.",
  },
  {
    value: "94%",
    label: "Would recommend",
    sublabel: "Member survey — those who completed ≥3 months.",
  },
];

const lpProblemCards = [
  {
    icon: Clock,
    title: "Divorce years pack the weight on",
    description:
      "Chronic stress hormones, sleep loss, emotional eating — it adds up slowly, invisibly, until one day the scale has quietly shifted 20+ lbs.",
  },
  {
    icon: Brain,
    title: "Dating again feels impossible at this weight",
    description:
      "Except crash diets fail. Your body needs a biological intervention that matches the biological weight gain.",
  },
  {
    icon: Heart,
    title: "Your doctor won't prescribe Ozempic without a diagnosis",
    description:
      "A compounded alternative, prescribed through telehealth by a licensed provider, opens the door.",
  },
] as const;

const problemCards = [
  {
    icon: Flame,
    title: "A Decade of Stress Cortisol",
    description:
      "The years leading up to divorce — and the years after — keep cortisol elevated. Cortisol directs fat storage toward the abdomen and resists every diet you've tried.",
  },
  {
    icon: Scale,
    title: "Disrupted Sleep",
    description:
      "Interrupted sleep through the split drops leptin and raises ghrelin. Hunger climbs, fullness fades. You eat more without meaning to for months on end.",
  },
  {
    icon: Heart,
    title: "Peri/Menopause Overlap",
    description:
      "Many women going through divorce are also mid-hormonal transition. Estrogen shifts make fat redistribute, muscle drop, and scale numbers climb with fewer calories.",
  },
];

const solutionCards = [
  {
    title: "Targets underlying insulin resistance",
    description:
      "GLP-1 normalizes how your body processes glucose — the exact mechanism driving midlife belly fat and resistant weight.",
  },
  {
    title: "Quiets the emotional grazing",
    description:
      "The medication mutes constant appetite signals, so the unconscious snacking of a hard decade finally stops on its own.",
  },
  {
    title: "Steady, sustainable loss (not crash)",
    description:
      "Crash diets don't hold. GLP-1 paired with provider oversight delivers gradual loss — the kind you keep well beyond the first year.",
  },
];

const journeyMilestones = [
  {
    month: "Day 1",
    label: "Eligibility in 2 minutes",
    description:
      "Online assessment reviewed by a US-licensed provider. No waiting rooms.",
  },
  {
    month: "Week 1",
    label: "Medication ships",
    description:
      "Compounded GLP-1 delivered discreetly. Video onboarding with your care team.",
  },
  {
    month: "Month 1",
    label: "First 4-8 lbs",
    description:
      "Appetite softens. Waistbands loosen. Sleep starts to repair.",
  },
  {
    month: "Month 3",
    label: "10-15 lbs down",
    description:
      "Friends notice. You start telling people about the divorce — on your terms.",
  },
  {
    month: "Month 6",
    label: "15-20% body weight",
    description:
      "Energy up, inflammation down. The version of you from before the hard years starts showing up in the mirror.",
  },
  {
    month: "Month 12+",
    label: "Maintenance",
    description:
      "Your provider tailors a long-term dose that protects the new chapter.",
  },
];

const provider = {
  name: "Dr. Elena Martinez, MD",
  credentials: "Internal Medicine · Women's Midlife Health · 16 years practice",
  bio: "Divorce is one of the highest-impact stressors a body can experience. Weight gained through that years-long process responds to tools the body can actually use. GLP-1 gives us one for the first time.",
  imagePrompt:
    "Professional editorial headshot of a 48-year-old Latina female physician, shoulder-length silver-streaked hair, warm confident smile, white coat over navy blouse, softly lit clinic background, natural daylight, Hasselblad quality, 1:1 aspect ratio.",
};

const priceColumns = [
  {
    name: "Brand-Name Wegovy / Ozempic",
    price: "$1,349/mo",
    priceSubtext: "retail cash-pay*",
    features: [
      { label: "FDA-approved", included: true },
      { label: "Insurance denials + partial coverage common", included: false },
      { label: "Pharmacy shortages in 2025–26", included: false },
      { label: "Ongoing provider support", included: false },
      { label: "Free 2-day shipping", included: false },
      { label: "30-day money-back guarantee", included: false },
    ],
  },
  {
    name: "Nature's Journey Next Chapter Plan",
    price: "$179/mo",
    priceSubtext: "no insurance needed",
    highlight: true,
    features: [
      { label: "Same active semaglutide molecule", included: true },
      { label: "Compounded by US 503A pharmacy", included: true },
      { label: "No insurance hurdles — flat monthly price", included: true },
      { label: "Ongoing provider + care-team support", included: true },
      { label: "Free 2-day shipping to all 50 states (where legally available)", included: true },
      { label: "30-day money-back guarantee", included: true },
    ],
    ctaLabel: "See If I Qualify →",
    ctaHref: "/qualify",
  },
];

const testimonials = [
  {
    name: "Lauren M.",
    age: 47,
    location: "Denver",
    lbs: 41,
    months: 6,
    quote:
      "Twenty-two years of marriage, eighteen months of divorce, and suddenly I had no idea who I was. This was the thing that helped me find out.",
  },
  {
    name: "Patrice W.",
    age: 52,
    location: "Atlanta",
    lbs: 38,
    months: 7,
    quote:
      "I gained 30 lbs during the divorce. I honestly didn't know how to lose it. Six months on the program and it's gone — plus a little more.",
  },
  {
    name: "Gina F.",
    age: 58,
    location: "Phoenix",
    lbs: 33,
    months: 6,
    quote:
      "My cardiologist reduced one of my medications. My daughter said I look like myself again. Both of those are worth more than the scale.",
  },
  {
    name: "Diane S.",
    age: 42,
    location: "Minneapolis",
    lbs: 29,
    months: 5,
    quote:
      "Started the week I moved into my new place. It felt like the first thing I was doing just for me in years.",
  },
];

const faqs = [
  {
    question: "Is it too late to lose divorce weight in my 40s or 50s?",
    answer:
      "Absolutely not. GLP-1 is especially effective for the insulin-resistance and cortisol-driven weight that accumulates in midlife. Published data shows meaningful results across ages 40-65+. Your provider adjusts dosing to your specific biology. Individual results vary.",
  },
  {
    question: "Is GLP-1 safe if I'm on blood pressure medications?",
    answer:
      "In most cases yes — and many members see their BP improve as they lose weight, sometimes allowing their primary care doctor to reduce doses. Share your complete medication list with your provider. They review every case individually and flag any interactions before prescribing.",
  },
  {
    question: "Can I start before my divorce is final?",
    answer:
      "Yes. The eligibility assessment is between you and a licensed provider — your marital status doesn't affect it. Many members start during separation. Your care is private; we don't share records outside your legal medical chart.",
  },
  {
    question: "What about HRT? Can I combine the two?",
    answer:
      "Generally yes. GLP-1 and hormone replacement therapy target different systems and are commonly used together for midlife women. Your provider will review your HRT regimen when assessing your eligibility and coordinate with your gynecologist or endocrinologist as needed.",
  },
  {
    question: "Is this the same as Ozempic?",
    answer:
      "Compounded semaglutide contains the same active ingredient as Ozempic and Wegovy, prepared by a state-licensed compounding pharmacy under an individual prescription. It is not FDA-approved as a branded drug product. Our program is for patients for whom this is medically appropriate as determined by a licensed provider.",
  },
  {
    question: "Do I need insurance?",
    answer:
      "No. Plans start at $179/month — a flat price that includes compounded medication, provider oversight, and care-team messaging. No pre-authorizations, no surprise co-pays, no insurance denials. Cancel anytime. 30-day money-back guarantee on your first month.",
  },
  {
    question: "What side effects should I expect?",
    answer:
      "Most common are mild gastrointestinal symptoms (nausea, constipation, reflux) during dose titration. Your provider starts low and steps up slowly specifically to minimize these. Persistent or serious side effects are reviewed promptly and dosing is adjusted or paused accordingly.",
  },
  {
    question: "Can I drink wine while on this?",
    answer:
      "Moderate alcohol is generally fine; many members naturally want less. Heavy drinking isn't recommended. Your provider will flag any interactions with your specific medications or conditions. Let your care team know if you notice changes in how alcohol affects you.",
  },
  {
    question: "What if I reach my goal and want to stop?",
    answer:
      "Your provider builds a maintenance plan — often a lower dose or periodic pauses — to protect your progress long-term. GLP-1 therapy isn't one-size-fits-all. Many members stay on a reduced dose indefinitely; others taper off gradually with provider guidance.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No long-term commitment. You can pause or cancel any time through your dashboard. If a licensed provider determines you're not eligible — for safety or contraindications — you aren't charged for medication. The 2-minute eligibility assessment is free and non-binding.",
  },
];

const internalLinks = [
  {
    title: "Menopause Weight Loss",
    description: "GLP-1 protocols tuned for peri- and post-menopausal biology.",
    href: "/lp/menopause",
  },
  {
    title: "Weight Loss After 40",
    description: "Age-appropriate dosing for metabolic slowdown and midlife changes.",
    href: "/lp/over40",
  },
  {
    title: "Weight Loss After 50",
    description: "Programs designed for the 50+ metabolism and hormonal landscape.",
    href: "/lp/over50",
  },
  {
    title: "See Pricing Plans",
    description: "Essential, Premium, Complete — compare what's included at each tier.",
    href: "/pricing",
  },
  {
    title: "Check Eligibility",
    description: "2 minutes. No cost. No commitment. Licensed-provider review.",
    href: "/qualify",
  },
  {
    title: "How It Works",
    description: "The full journey from assessment to shipment to support.",
    href: "/how-it-works",
  },
] as const;

export default function AfterDivorceLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LpHeader
        badgeText="New Chapter"
        badgeIcon={Sparkles}
      />

      {/* ======================================================================
          HERO
          AI-IMAGE PROMPT (hero right-side portrait — optional enhancement)
          Aspect ratio: 4:5
          "Editorial portrait of a woman in her late 40s, elegant shoulder-length
           silver-streaked hair, cream cashmere turtleneck, standing in a sunlit
           loft kitchen, holding a ceramic mug, quiet confident half-smile,
           looking slightly off-camera. Natural window light. Shallow depth of
           field. Body language: grounded, self-possessed. No logos."
          ====================================================================== */}
      <LpHeroBlock
        badge="New Chapter"
        headline="The next chapter starts by May."
        headlineAccent="Same active ingredient as Ozempic."
        subtitle="You survived. Now thrive. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Same active molecule as Ozempic. From $179/mo. Individual results vary."
        stats={heroStats}
        ctaLocation="hero-after-divorce"
      />

      <LpSocialProofBar />

      <LpOutcomeStats
        stats={outcomeStats}
        heading="What members actually see"
        subheading="Program outcomes, not marketing numbers."
      />

      <LpProblemSection
        eyebrow="WHY DIVORCE WEIGHT STAYS"
        heading="The weight of a hard decade is biological."
        cards={lpProblemCards}
        transitionText="A chronic-stress weight problem needs a chronic-biology solution."
        ctaLocation="problem-after-divorce"
      />

      {/* Why Post-Divorce Weight Is Different */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            Why post-divorce weight is different
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            Years of elevated cortisol, broken sleep, and hormonal transition compound.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {problemCards.map((card) => (
              <Card key={card.title}>
                <CardContent className="p-5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl mb-3"
                    style={{ backgroundColor: "var(--lp-icon-bg)" }}
                  >
                    <card.icon className="h-5 w-5" style={{ color: "var(--lp-icon)" }} />
                  </div>
                  <h3 className="text-sm font-bold text-lp-heading">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-lp-body leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How GLP-1 Fits the New Chapter */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-2">
            How GLP-1 fits the new chapter
          </h2>
          <p className="text-center text-sm text-lp-body mb-10">
            A tool your body can actually use — for the first time.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {solutionCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border bg-white p-5"
                style={{ borderColor: "var(--lp-card-border)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--lp-icon-bg)" }}
                  >
                    <Check className="h-3.5 w-3.5" style={{ color: "var(--lp-icon)" }} />
                  </div>
                  <h3 className="text-sm font-bold text-lp-heading">
                    {card.title}
                  </h3>
                </div>
                <p className="text-xs text-lp-body leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LpMidCta
        headline="Ready for your next chapter?"
        subtext="Free 2-minute assessment. Licensed providers. No commitment."
        location="mid-after-divorce"
      />

      <LpJourneyRoadmap
        milestones={journeyMilestones}
        heading="What to expect, month by month"
        subheading="The realistic post-divorce treatment arc your provider will build with you."
      />

      <LpPriceCompare
        columns={priceColumns}
        heading="Same active ingredient. Plans from $179/mo."
        subheading="Your next chapter shouldn't depend on whether an insurance company approves."
      />

      <LpProviderCredential
        provider={provider}
        heading="Every plan is overseen by a real clinician"
      />

      {/* Testimonials */}
      <section className="py-14" style={{ backgroundColor: "var(--lp-section-alt)" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-lp-heading text-center mb-8">
            Members who started the next chapter
          </h2>
          {/* AI-IMAGE PROMPT (optional — testimonial avatars)
              Aspect ratio: 1:1
              "Four photorealistic headshot portraits, diverse women and men
               ages 42-60, soft natural window light, genuine warm expressions,
               neutral backgrounds in cream and dusty rose tones, editorial
               photojournalism style, candid not posed, Sony A7R 85mm f/1.8.
               No logos."
          */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-5">
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 text-gold fill-gold"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-lp-body italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-lp-heading">
                        {t.name}, {t.age}
                      </p>
                      <p className="text-[10px] text-lp-body-muted">
                        {t.location}
                      </p>
                    </div>
                    <Badge
                      className="text-[10px]"
                      style={{
                        backgroundColor: "var(--lp-badge-bg)",
                        color: "var(--lp-badge-text)",
                      }}
                    >
                      -{t.lbs} lbs / {t.months}mo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-[10px] text-lp-body-muted">
            Individual experiences. Results not typical. Compounded medications are not FDA-approved.
          </p>
        </div>
      </section>

      <LpFaq
        faqs={faqs}
        heading="Post-divorce weight & GLP-1: your questions"
        subheading="Everything you need to know about prescribed GLP-1 as part of the rebuild."
      />

      <LpInternalLinks heading="Keep exploring" links={internalLinks} />

      <LpCtaSection
        headline="The next chapter starts tonight."
        bgClassName="bg-gradient-to-r from-rose-50 to-amber-50"
      />

      <LpFooter />

      {/* JSON-LD */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Post-Divorce Weight Loss", href: "/lp/after-divorce" },
        ]}
      />
      <MedicalWebPageJsonLd
        name="Post-Divorce Weight Loss with GLP-1"
        description="Divorce weight is chronic-stress weight. Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month. Licensed US providers. From $179/mo. Individual results vary."
        url="/lp/after-divorce"
      />
      <FAQPageJsonLd faqs={faqs} />
      <LpConversionWidgets />
    </div>
  );
}
