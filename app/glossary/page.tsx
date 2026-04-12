export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionShell } from "@/components/shared/section-shell";
import { CtaSection } from "@/components/marketing/cta-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { WebPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Weight Loss & GLP-1 Glossary — Key Terms Explained",
  description:
    "Complete glossary of weight loss and GLP-1 medication terms. Clear definitions for BMI, semaglutide, tirzepatide, metabolic rate, compounding, and 40+ more terms.",
  openGraph: {
    title: "Weight Loss Glossary: GLP-1, BMI, Semaglutide & More | Nature's Journey",
    description: "Simple definitions for every weight loss and GLP-1 term you need to know.",
  },
};

const glossary = [
  { term: "503A Pharmacy", definition: "A traditional compounding pharmacy regulated by state boards of pharmacy. Prepares medications based on individual prescriptions from licensed providers.", link: "/blog/compounded-glp1-safety-evidence" },
  { term: "503B Outsourcing Facility", definition: "A larger compounding facility that operates under direct FDA oversight and follows Current Good Manufacturing Practice (cGMP) requirements. Provides an additional layer of quality assurance compared to 503A pharmacies." },
  { term: "Appetite Suppression", definition: "A reduction in the desire to eat. GLP-1 medications achieve this by activating receptors in the brain's hypothalamus that regulate hunger and satiety signals." },
  { term: "Bariatric Surgery", definition: "Surgical procedures designed to produce significant weight loss by altering the digestive system. Includes gastric bypass, sleeve gastrectomy, and gastric banding. Typically requires BMI 35+ with health conditions or BMI 40+.", link: "/compare/glp1-vs-bariatric-surgery" },
  { term: "BMI (Body Mass Index)", definition: "A screening tool that estimates body fat based on height and weight. Calculated as weight (lbs) ÷ height (in)² × 703. Used as an initial eligibility criterion for weight management programs. Not a diagnostic measure — does not account for muscle mass or body composition.", link: "/calculators/bmi" },
  { term: "Body Composition", definition: "The proportions of fat, muscle, bone, and water in your body. More informative than weight alone — two people at the same weight can have very different body compositions." },
  { term: "Calorie Deficit", definition: "Consuming fewer calories than your body burns, which is required for weight loss. A 500-calorie daily deficit produces approximately 1 pound of weight loss per week.", link: "/calculators/tdee" },
  { term: "cGMP (Current Good Manufacturing Practice)", definition: "FDA regulations that ensure pharmaceutical products are consistently produced and controlled according to quality standards. 503B compounding facilities must follow cGMP." },
  { term: "Clinical Trial", definition: "A research study conducted with human participants to evaluate the safety and effectiveness of medications. GLP-1 drugs like semaglutide and tirzepatide have extensive clinical trial data (STEP and SURMOUNT trials)." },
  { term: "Compounded Medication", definition: "A medication custom-prepared by a licensed pharmacy using pharmaceutical-grade active ingredients. Compounded GLP-1 medications contain the same active ingredient as brand-name versions but are not FDA-approved. Legal when prescribed by a licensed provider.", link: "/blog/understanding-compounded-medications" },
  { term: "CLS (Cumulative Layout Shift)", definition: "A web performance metric that measures visual stability — how much page content unexpectedly shifts during loading. Important for user experience and SEO rankings." },
  { term: "Dose Titration", definition: "The process of gradually increasing medication dosage over time. GLP-1 medications start at low doses and increase every 2-4 weeks to minimize side effects and find the optimal therapeutic dose.", link: "/blog/what-to-expect-first-month-glp1" },
  { term: "FDA (Food and Drug Administration)", definition: "The U.S. federal agency responsible for approving medications, regulating food safety, and overseeing pharmaceutical manufacturing. Brand-name GLP-1 medications are FDA-approved; compounded versions are not." },
  { term: "Gastric Emptying", definition: "The rate at which food leaves the stomach and enters the small intestine. GLP-1 medications slow gastric emptying, which helps you feel full longer after eating." },
  { term: "GIP (Glucose-dependent Insulinotropic Polypeptide)", definition: "A hormone that stimulates insulin release and has metabolic effects. Tirzepatide (Mounjaro/Zepbound) targets both GIP and GLP-1 receptors, which may produce stronger weight loss effects.", link: "/blog/semaglutide-vs-tirzepatide" },
  { term: "GLP-1 (Glucagon-Like Peptide-1)", definition: "A natural hormone produced in the intestines after eating. It signals fullness to the brain, slows gastric emptying, and improves insulin sensitivity. GLP-1 medications mimic this hormone to reduce appetite and support weight loss.", link: "/blog/understanding-glp1" },
  { term: "GLP-1 Receptor Agonist", definition: "A class of medications that activates GLP-1 receptors in the body. Includes semaglutide (Ozempic, Wegovy) and tirzepatide (Mounjaro, Zepbound). Used for type 2 diabetes and weight management." },
  { term: "Ghrelin", definition: "The \"hunger hormone\" produced primarily in the stomach. Ghrelin levels rise before meals and fall after eating. During weight loss, ghrelin increases — one reason weight regain is common after dieting." },
  { term: "HIPAA", definition: "Health Insurance Portability and Accountability Act. Federal law that protects the privacy and security of personal health information (PHI). All telehealth providers must comply with HIPAA regulations.", link: "/legal/hipaa" },
  { term: "Hypothalamus", definition: "A region of the brain that regulates hunger, thirst, body temperature, and other basic functions. GLP-1 receptors in the hypothalamus are the primary target for appetite suppression." },
  { term: "Insulin Sensitivity", definition: "How effectively your body responds to insulin. Better insulin sensitivity means your body processes blood sugar more efficiently and stores less fat. GLP-1 medications improve insulin sensitivity." },
  { term: "Lean Muscle Mass", definition: "The total weight of your muscles, bones, organs, and water — everything except body fat. Preserving lean muscle during weight loss is critical for maintaining metabolic rate.", link: "/blog/best-high-protein-foods-weight-loss" },
  { term: "Leptin", definition: "The \"satiety hormone\" produced by fat cells. Tells your brain you have enough energy stored. During weight loss, leptin levels drop, increasing hunger — a key driver of weight regain." },
  { term: "Metabolic Adaptation", definition: "Your body's response to calorie restriction: lowered metabolic rate, increased hunger hormones, and improved calorie absorption efficiency. This is why diets have a 95% long-term failure rate.", link: "/blog/why-diets-fail-biology-weight-regain" },
  { term: "Metabolic Rate (Basal/Resting)", definition: "The number of calories your body burns at rest to maintain basic functions like breathing, circulation, and cell production. Represents 60-70% of total daily calorie expenditure.", link: "/calculators/tdee" },
  { term: "Mounjaro", definition: "Brand name for tirzepatide, manufactured by Eli Lilly. Originally approved for type 2 diabetes, also prescribed off-label for weight management. Dual-action GLP-1/GIP receptor agonist.", link: "/blog/semaglutide-vs-tirzepatide" },
  { term: "NEAT (Non-Exercise Activity Thermogenesis)", definition: "Calories burned through daily movement that isn't formal exercise — fidgeting, walking, standing, household chores. NEAT often decreases unconsciously during weight loss.", link: "/blog/break-weight-loss-plateau" },
  { term: "Ozempic", definition: "Brand name for semaglutide injection, manufactured by Novo Nordisk. FDA-approved for type 2 diabetes, commonly prescribed off-label for weight management. Weekly injection.", link: "/blog/understanding-glp1" },
  { term: "Plateau", definition: "A period of 2-4+ weeks where weight stops decreasing despite maintaining the same diet and exercise. A normal part of weight loss caused by metabolic adaptation.", link: "/blog/break-weight-loss-plateau" },
  { term: "Protein (Dietary)", definition: "An essential macronutrient made of amino acids. Critical for preserving muscle during weight loss. Recommended intake during active weight loss: 0.7-1.0g per pound of body weight daily.", link: "/calculators/protein" },
  { term: "Semaglutide", definition: "A GLP-1 receptor agonist medication used for diabetes (Ozempic) and weight management (Wegovy). Administered as a weekly injection. Clinical trials show average weight loss of 15-16% of body weight.", link: "/blog/semaglutide-vs-tirzepatide" },
  { term: "Set Point Theory", definition: "The concept that your brain maintains a preferred body weight and actively resists changes through hormonal adjustments. Explains why weight regain after dieting feels automatic." },
  { term: "Subcutaneous Injection", definition: "An injection administered into the fatty tissue just under the skin, typically in the abdomen, thigh, or upper arm. GLP-1 medications are given as subcutaneous injections." },
  { term: "TDEE (Total Daily Energy Expenditure)", definition: "The total number of calories your body burns in a day, including basal metabolism, physical activity, and the thermic effect of food. The starting point for calculating a weight loss calorie target.", link: "/calculators/tdee" },
  { term: "Telehealth", definition: "Healthcare services delivered remotely through technology (video, phone, or messaging). Allows patients to receive provider evaluations, prescriptions, and ongoing care without visiting a clinic.", link: "/how-it-works" },
  { term: "Thermic Effect of Food (TEF)", definition: "The energy your body uses to digest, absorb, and process nutrients. Protein has the highest TEF (20-30%), meaning your body burns 20-30% of protein calories during digestion." },
  { term: "Tirzepatide", definition: "A dual-action GLP-1/GIP receptor agonist medication. Brand names: Mounjaro (diabetes) and Zepbound (weight management). May produce greater weight loss than semaglutide in some patients.", link: "/blog/semaglutide-vs-tirzepatide" },
  { term: "Titration", definition: "See Dose Titration." },
  { term: "Visceral Fat", definition: "Fat stored deep in the abdominal cavity, surrounding internal organs. Metabolically active — produces inflammatory compounds and worsens insulin resistance. Men disproportionately store visceral fat. GLP-1 medications preferentially reduce visceral fat.", link: "/men" },
  { term: "Wegovy", definition: "Brand name for semaglutide 2.4mg injection, manufactured by Novo Nordisk. FDA-approved specifically for chronic weight management in adults with BMI ≥30 or ≥27 with a weight-related condition. Different from Ozempic (lower dose, diabetes-only approval).", link: "/semaglutide" },
  { term: "Zepbound", definition: "Brand name for tirzepatide at higher doses (up to 15mg), manufactured by Eli Lilly. FDA-approved specifically for weight management. The same molecule as Mounjaro, which is approved for type 2 diabetes.", link: "/tirzepatide" },
  { term: "Obstructive Sleep Apnea (OSA)", definition: "A sleep disorder where breathing repeatedly stops and starts during sleep due to throat muscle relaxation. Obesity is a primary driver. Tirzepatide (Zepbound) received FDA approval in 2024 as the first medication approved to treat OSA.", link: "/sleep-apnea" },
  { term: "PCOS (Polycystic Ovary Syndrome)", definition: "A hormonal disorder in women causing irregular periods, excess androgen, and ovarian cysts. Associated with insulin resistance and weight gain. GLP-1 medications improve insulin sensitivity and produce weight loss that can reduce PCOS symptoms.", link: "/pcos" },
  { term: "Prediabetes", definition: "A condition where blood sugar levels are higher than normal but not yet in the type 2 diabetes range (A1c 5.7–6.4%). GLP-1 medications significantly reduce the risk of progression to type 2 diabetes and can reverse prediabetes in many patients.", link: "/prediabetes" },
  { term: "SELECT Trial", definition: "A landmark 2023 clinical trial (New England Journal of Medicine) that enrolled 17,604 adults with obesity and cardiovascular disease (no diabetes). Semaglutide 2.4mg reduced major adverse cardiovascular events by 20% vs placebo — the first weight management medication to demonstrate cardiovascular risk reduction.", link: "/heart-health" },
  { term: "SURMOUNT Trials", definition: "A series of phase 3 clinical trials evaluating tirzepatide for weight management. SURMOUNT-1 showed average weight loss of 20.9% at maximum dose (15mg), with 57% of participants losing 20%+ of body weight — the highest weight loss percentage ever recorded in a weight management medication trial.", link: "/tirzepatide" },
  { term: "Compounding Pharmacy (503B)", definition: "An FDA-registered outsourcing facility that manufactures medications in bulk under current Good Manufacturing Practice (cGMP) standards — the same manufacturing standards as branded pharmaceutical companies. Compounded semaglutide and tirzepatide from 503B pharmacies offer the same active molecule at significantly lower cost.", link: "/medications" },
  { term: "GLP-1 Food Noise", definition: "A colloquial term for the reduction in intrusive food thoughts and cravings that most patients experience on GLP-1 medication. Caused by GLP-1 receptors in the brain's reward and appetite centers reducing the psychological salience of food. One of the most commonly reported quality-of-life improvements.", link: "/blog/glp1-mental-health-food-noise" },
  { term: "Maintenance Phase", definition: "The period after reaching goal weight when the focus shifts from active weight loss to preventing regain. May involve dose reduction, continued medication at lower dose, or tapering off medication with structured lifestyle support.", link: "/maintenance" },
];

// Group by first letter
const grouped = glossary.reduce<Record<string, typeof glossary>>((acc, item) => {
  const letter = item.term[0].toUpperCase();
  if (!acc[letter]) acc[letter] = [];
  acc[letter].push(item);
  return acc;
}, {});

const letters = Object.keys(grouped).sort();

export default function GlossaryPage() {
  return (
    <MarketingShell>
      <WebPageJsonLd
        title="Weight Loss & GLP-1 Glossary"
        description="Complete glossary of weight loss and GLP-1 medication terms."
        path="/glossary"
      />
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "GLP-1 Glossary", href: "/glossary" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "Weight Loss & GLP-1 Glossary",
            description: "Complete glossary of weight loss and GLP-1 medication terms.",
            hasDefinedTerm: glossary.map((g) => ({
              "@type": "DefinedTerm",
              name: g.term,
              description: g.definition,
            })),
          }),
        }}
      />

      <section className="bg-gradient-to-b from-cloud to-sage/30 py-16 sm:py-24">
        <SectionShell className="text-center">
          <Badge variant="default" className="mb-6 gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> Reference
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Weight Loss & GLP-1 Glossary
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-graphite-500">
            Clear, simple definitions for every term you&apos;ll encounter on your weight management
            journey. From medical terminology to nutrition concepts.
          </p>
        </SectionShell>
      </section>

      {/* Letter navigation */}
      <section className="sticky top-16 z-40 border-b border-navy-100/40 bg-white/90 backdrop-blur-lg py-3">
        <SectionShell>
          <div className="flex flex-wrap justify-center gap-1.5">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-navy hover:bg-teal-50 hover:text-teal transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </SectionShell>
      </section>

      {/* Most searched — optimized for featured snippets */}
      <section className="py-12 border-b border-navy-100/40">
        <SectionShell className="max-w-4xl">
          <h2 className="text-lg font-bold text-navy mb-6">Most searched terms</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {glossary
              .filter((g) => ["Semaglutide", "Tirzepatide", "GLP-1 (Glucagon-Like Peptide-1)", "BMI (Body Mass Index)", "Compounded Medication", "Metabolic Adaptation"].includes(g.term))
              .map((item) => (
                <div key={item.term} className="rounded-xl border border-navy-100/40 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-navy">{item.term}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-graphite-500">{item.definition.slice(0, 200)}{item.definition.length > 200 ? "..." : ""}</p>
                  {item.link && (
                    <Link href={item.link} className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-teal hover:underline">
                      Learn more &rarr;
                    </Link>
                  )}
                </div>
              ))}
          </div>
        </SectionShell>
      </section>

      {/* Terms */}
      <section className="py-12">
        <SectionShell className="max-w-4xl">
          {letters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="mb-10 scroll-mt-32">
              <h2 className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal to-atlantic text-xl font-bold text-white shadow-glow">
                {letter}
              </h2>
              <div className="space-y-4">
                {grouped[letter].map((item) => (
                  <div
                    key={item.term}
                    className="rounded-xl border border-navy-100/40 bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-base font-bold text-navy">{item.term}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-graphite-500">
                      {item.definition}
                    </p>
                    {item.link && (
                      <Link
                        href={item.link}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal hover:underline"
                      >
                        Learn more &rarr;
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </SectionShell>
      </section>

      {/* Deep-dive blog links */}
      <section className="py-12 bg-cloud/40 border-y border-sage/20">
        <SectionShell className="max-w-4xl">
          <h2 className="text-lg font-semibold text-navy mb-2">Deeper reading</h2>
          <p className="text-sm text-graphite-500 mb-6">Articles that explain these terms in clinical context</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "How GLP-1 Receptor Agonists Work", href: "/blog/understanding-glp1", tag: "Science" },
              { label: "Semaglutide vs Tirzepatide (2026)", href: "/blog/tirzepatide-vs-semaglutide-2026", tag: "Comparison" },
              { label: "Managing Common Side Effects", href: "/blog/managing-side-effects", tag: "Side Effects" },
              { label: "Compounded Semaglutide Safety", href: "/blog/compounded-semaglutide-safety", tag: "Safety" },
              { label: "What to Eat on Semaglutide", href: "/blog/what-to-eat-on-semaglutide", tag: "Nutrition" },
              { label: "GLP-1 Weight Loss Timeline", href: "/blog/semaglutide-timeline-first-3-months", tag: "Results" },
            ].map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group flex items-start justify-between gap-2 rounded-xl border border-navy-100/40 bg-white p-4 hover:border-teal/30 hover:shadow-premium transition-all"
              >
                <div>
                  <span className="text-xs font-medium text-teal">{article.tag}</span>
                  <p className="mt-0.5 text-sm font-medium text-navy group-hover:text-teal transition-colors leading-snug">{article.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-graphite-300 group-hover:text-teal transition-colors mt-0.5" />
              </Link>
            ))}
          </div>
        </SectionShell>
      </section>

      <CtaSection />
    </MarketingShell>
  );
}
