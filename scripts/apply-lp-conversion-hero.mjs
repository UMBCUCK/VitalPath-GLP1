/**
 * One-shot codemod: apply the /home-v2 conversion pattern to every landing page.
 *
 * New hero pattern per LP:
 *   headline       = "Lose that <audience pain> by May."
 *   headlineAccent = "Same active ingredient as <Brand>."
 *   subtitle       = "<value prop> — may help you lose up to <X> lbs in your first month.* From $..."
 *
 * Compliance guardrails baked in:
 *   • "may help" / "up to" (never absolute claims)
 *   • "Same active ingredient as Ozempic" (NOT "identical to")
 *   • Brand prices kept per LP (semaglutide LPs stay $179, tirzepatide LPs stay $379)
 *   • Postpartum keeps explicit nursing-clearance language
 *
 * Run with: node scripts/apply-lp-conversion-hero.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** @type {Record<string, {old: Record<string, string>, new: Record<string, string>}>} */
const LPS = {
  "app/lp/belly-fat/page.tsx": {
    old: {
      headline: `headline="Finally lose that stubborn belly fat —"`,
      accent: `headlineAccent="Medicine that treats the hormonal cause"`,
      subtitle: `subtitle="Visceral fat is driven by cortisol and insulin, not willpower. Prescribed GLP-1 from US-licensed providers addresses the root cause. 2-minute eligibility. From $179/mo."`,
    },
    new: {
      headline: `headline="Lose that stubborn belly fat by May."`,
      accent: `headlineAccent="Same active ingredient as Ozempic and Wegovy."`,
      subtitle: `subtitle="Doctor-prescribed GLP-1 may help you lose up to 8 lbs in your first month.* Targets visceral fat at the hormonal cause. From $179/mo. 2-minute assessment. Individual results vary."`,
    },
  },

  "app/lp/pcos/page.tsx": {
    old: {
      headline: `headline="GLP-1 care that works with your insulin resistance —"`,
      accent: `headlineAccent="Not against it"`,
      subtitle: `subtitle="PCOS makes calorie math fail because it's not a calorie problem — it's an insulin problem. Prescribed GLP-1 from US-licensed providers targets the root cause. 2-minute eligibility. From $179/mo."`,
    },
    new: {
      headline: `headline="Lose that stubborn PCOS weight by May."`,
      accent: `headlineAccent="Same active ingredient as Ozempic."`,
      subtitle: `subtitle="PCOS-aware GLP-1 that targets insulin resistance — may help you lose up to 6 lbs in your first month.* From $179/mo. 2-minute assessment. Individual results vary."`,
    },
  },

  "app/lp/menopause/page.tsx": {
    old: {
      headline: `headline="Menopause doesn't have to mean 20 extra pounds —"`,
      accent: `headlineAccent="GLP-1 care, from licensed providers"`,
      subtitle: `subtitle="Estrogen decline shifts fat storage, slows metabolism, and makes old diets useless. Prescribed GLP-1 from US-licensed providers addresses the hormonal cause. 2-minute eligibility. From $179/mo."`,
    },
    new: {
      headline: `headline="Lose that stubborn menopause weight by May."`,
      accent: `headlineAccent="Same active ingredient as Ozempic."`,
      subtitle: `subtitle="Hormone-aware GLP-1 care — may help you lose up to 7 lbs in your first month.* Works with estrogen shifts, not against them. From $179/mo. Individual results vary."`,
    },
  },

  "app/lp/postpartum/page.tsx": {
    old: {
      headline: `headline="You gave your body to your baby."`,
      accent: `headlineAccent="Let's get you back — thoughtfully"`,
      subtitle: `subtitle="Postpartum weight isn't a willpower problem. Hormones, sleep, and time all changed. GLP-1 care, after you've weaned, from US-licensed providers who take postpartum seriously. From $179/mo."`,
    },
    new: {
      headline: `headline="Lose that stubborn baby weight by May."`,
      accent: `headlineAccent="Same active ingredient as Ozempic."`,
      subtitle: `subtitle="GLP-1 care for moms cleared by their OB and not currently breastfeeding — may help you lose up to 8 lbs in your first month.* From $179/mo. 2-minute assessment. Individual results vary."`,
    },
  },

  "app/lp/women/page.tsx": {
    old: {
      headline: `headline="Weight-loss care, designed by women,"`,
      accent: `headlineAccent="Prescribed for women"`,
      subtitle: `subtitle="Most programs were built around male metabolism. Your hormones, cycles, and life phases work differently — your care should too. Prescribed GLP-1 from US-licensed providers. 2-minute eligibility. From $179/mo."`,
    },
    new: {
      headline: `headline="Lose that stubborn weight by May."`,
      accent: `headlineAccent="Same active ingredient as Ozempic and Wegovy."`,
      subtitle: `subtitle="Female-designed GLP-1 care that works with your biology — may help you lose up to 7 lbs in your first month.* From $179/mo. 2-minute assessment. Individual results vary."`,
    },
  },

  "app/lp/men/page.tsx": {
    old: {
      headline: `headline="Cut the gut. Built for men."`,
      accent: `headlineAccent="Prescribed by US-licensed doctors."`,
      subtitle: `subtitle="Dadbod isn't a personality — it's a metabolic signal. Doctor-prescribed GLP-1 targets visceral fat and the insulin-cortisol axis that lifting alone can't fix. 2-minute eligibility. From $179/mo."`,
    },
    new: {
      headline: `headline="Cut the gut by May."`,
      accent: `headlineAccent="Same active ingredient as Ozempic and Wegovy."`,
      subtitle: `subtitle="Doctor-prescribed GLP-1 built for men — may help you lose up to 10 lbs in your first month.* Testosterone-aware protocol. From $179/mo. 2-minute assessment. Individual results vary."`,
    },
  },

  "app/lp/women-weight-loss/page.tsx": {
    old: {
      headline: `headline="Weight-loss care for every phase —"`,
      accent: `headlineAccent="cycle, postpartum, perimenopause, menopause"`,
      subtitle: `subtitle="Diets were designed by men who've never lived in your body. Doctor-prescribed GLP-1 from US-licensed providers, tuned for female physiology across every phase of life. 2-minute eligibility. From $179/mo."`,
    },
    new: {
      headline: `headline="Lose that stubborn weight by May — at any phase."`,
      accent: `headlineAccent="Same active ingredient as Ozempic."`,
      subtitle: `subtitle="GLP-1 care tuned for your cycle, postpartum, peri, or menopause — may help you lose up to 7 lbs in your first month.* From $179/mo. 2-minute assessment. Individual results vary."`,
    },
  },

  "app/lp/over40/page.tsx": {
    old: {
      headline: `headline="The weight-loss playbook that actually works"`,
      accent: `headlineAccent="in your 40s"`,
      subtitle: `subtitle="Your body changed the rules at 40 — slower metabolism, shifting hormones, quiet muscle loss. Doctor-prescribed GLP-1 from US-licensed providers addresses the real mechanism. 2-minute eligibility. From $179/mo."`,
    },
    new: {
      headline: `headline="Lose that midlife weight by May."`,
      accent: `headlineAccent="Same active ingredient as Ozempic and Wegovy."`,
      subtitle: `subtitle="Metabolism-aware GLP-1 for your 40s — may help you lose up to 8 lbs in your first month.* Targets the real mechanism behind midlife weight gain. From $179/mo. Individual results vary."`,
    },
  },

  "app/lp/over50/page.tsx": {
    old: {
      headline: `headline="What your doctor won't tell you about"`,
      accent: `headlineAccent="weight loss after 50"`,
      subtitle: `subtitle="Same effort, half the results? Doctor-prescribed GLP-1 from US-licensed providers, coordinated with your PCP and tuned for your current medications. 2-minute eligibility. From $179/mo."`,
    },
    new: {
      headline: `headline="Lose that stubborn weight by May — safely, after 50."`,
      accent: `headlineAccent="Same active ingredient as Ozempic."`,
      subtitle: `subtitle="Slow-titration GLP-1 with PCP coordination — may help you lose up to 6 lbs in your first month.* Muscle and bone-preserving protocol. From $179/mo. Individual results vary."`,
    },
  },

  "app/lp/semaglutide/page.tsx": {
    old: {
      headline: `headline="Compounded semaglutide, prescribed online —"`,
      accent: `headlineAccent="From $179/mo"`,
      subtitle: `subtitle="The same active ingredient studied in brand-name GLP-1 trials. Prescribed by US-licensed providers, dispensed by a US-licensed compounding pharmacy. 2-minute eligibility. Individual results vary."`,
    },
    new: {
      headline: `headline="Start compounded semaglutide by May."`,
      accent: `headlineAccent="Same molecule as Ozempic and Wegovy."`,
      subtitle: `subtitle="Prescribed by US-licensed providers, dispensed by a US-licensed compounding pharmacy — may help you lose up to 8 lbs in your first month.* From $179/mo. Individual results vary."`,
    },
  },

  "app/lp/tirzepatide/page.tsx": {
    old: {
      headline: `headline="Compounded tirzepatide —"`,
      accent: `headlineAccent="The dual-action shot, prescribed online"`,
      subtitle: `subtitle="Tirzepatide is the only medication that activates both GLP-1 and GIP receptors. Prescribed by US-licensed providers, dispensed by a US-licensed compounding pharmacy. 2-minute eligibility. Individual results vary."`,
    },
    new: {
      headline: `headline="Start compounded tirzepatide by May."`,
      accent: `headlineAccent="Same molecule as Mounjaro and Zepbound."`,
      subtitle: `subtitle="Dual GLP-1 + GIP action — may help you lose up to 10 lbs in your first month.* Prescribed by US-licensed providers. Individual results vary."`,
    },
  },

  "app/lp/ozempic-alternative/page.tsx": {
    old: {
      headline: `headline="Same molecule. ~80% less cost."`,
      accent: `headlineAccent="Compounded semaglutide from $179/mo."`,
      subtitle: `subtitle="Compounded semaglutide contains the same active ingredient prepared by a US-licensed compounding pharmacy. Prescribed by US-licensed providers. In stock, free 2-day shipping. Individual results vary."`,
    },
    new: {
      headline: `headline="The Ozempic alternative, available by May."`,
      accent: `headlineAccent="Same active ingredient (semaglutide). Less cost."`,
      subtitle: `subtitle="Compounded semaglutide — same active molecule as Ozempic, prepared by a US-licensed compounding pharmacy. May help you lose up to 8 lbs in your first month.* From $179/mo. Individual results vary."`,
    },
  },

  "app/lp/glp1/page.tsx": {
    old: {
      headline: `headline="Your complete GLP-1 weight-loss program —"`,
      accent: `headlineAccent="Medication, care, coaching. From $179/mo."`,
      subtitle: `subtitle="Not just medication — a supervised program. US-licensed providers, personalized meal plans, care-team messaging, and compounded GLP-1 delivered to your door. 2-minute eligibility. Individual results vary."`,
    },
    new: {
      headline: `headline="Start your GLP-1 journey by May."`,
      accent: `headlineAccent="Same class of medicine as Ozempic and Mounjaro."`,
      subtitle: `subtitle="Complete program — prescription, medication, and provider support in one. May help you lose up to 8 lbs in your first month.* From $179/mo. Individual results vary."`,
    },
  },

  "app/lp/affordable/page.tsx": {
    old: {
      headline: `headline="Prescription GLP-1 for $179/mo —"`,
      accent: `headlineAccent="no insurance needed"`,
      subtitle: `subtitle="Retail GLP-1s run $1,349/mo. Ours is $179/mo flat — medication, provider oversight, and support included. US-licensed pharmacy. 2-minute eligibility check."`,
    },
    new: {
      headline: `headline="Start prescribed GLP-1 by May — from $179/mo."`,
      accent: `headlineAccent="Same active ingredient as Ozempic. No insurance needed."`,
      subtitle: `subtitle="Flat monthly price includes medication, provider, and support — may help you lose up to 8 lbs in your first month.* US-licensed pharmacy. Individual results vary."`,
    },
  },

  "app/lp/no-surgery/page.tsx": {
    old: {
      headline: `headline="Skip the scalpel —"`,
      accent: `headlineAccent="prescribed GLP-1 care from home"`,
      subtitle: `subtitle="A clinically supervised, non-invasive alternative to bariatric surgery for many patients. US-licensed providers. No hospital stay. 2-minute eligibility. From $179/mo."`,
    },
    new: {
      headline: `headline="Lose that weight by May — no scalpel needed."`,
      accent: `headlineAccent="Same active ingredient as Ozempic and Wegovy."`,
      subtitle: `subtitle="At-home weekly injection, no hospital, no recovery — may help you lose up to 8 lbs in your first month.* From $179/mo. 2-minute assessment. Individual results vary."`,
    },
  },

  "app/lp/telehealth/page.tsx": {
    old: {
      headline: `headline="See a Weight Loss Doctor Online \u2014"`,
      accent: `headlineAccent="Get Medication Delivered"`,
      subtitle: `subtitle="Board-certified providers evaluate your health profile within 1 business day. GLP-1 medication ships free if prescribed. No office visits. No insurance required."`,
    },
    new: {
      headline: `headline="Start GLP-1 telehealth care by May."`,
      accent: `headlineAccent="Same active ingredient as Ozempic."`,
      subtitle: `subtitle="100% online. Board-certified providers evaluate you in 1 business day — may help you lose up to 8 lbs in your first month.* From $179/mo. Ships free. Individual results vary."`,
    },
  },

  "app/lp/wegovy-alternative/page.tsx": {
    old: {
      headline: `headline="A Clinically Comparable Alternative to Wegovy —"`,
      accent: `headlineAccent="79% Less"`,
      subtitle: `subtitle="Same active ingredient (semaglutide) prescribed by licensed providers. From $179/mo with free 2-day shipping."`,
    },
    new: {
      headline: `headline="The Wegovy alternative, available by May."`,
      accent: `headlineAccent="Same active ingredient (semaglutide). Less cost."`,
      subtitle: `subtitle="Compounded semaglutide prescribed by US-licensed providers — may help you lose up to 8 lbs in your first month.* From $179/mo. Free 2-day shipping. Individual results vary."`,
    },
  },

  "app/lp/mounjaro-alternative/page.tsx": {
    old: {
      headline: `headline="Looking for a Mounjaro Alternative? Same Active Ingredient,"`,
      accent: `headlineAccent="72% Less."`,
      subtitle: `subtitle="Compounded tirzepatide — the same dual-action GLP-1/GIP — prescribed online. From $379/mo."`,
    },
    new: {
      headline: `headline="The Mounjaro alternative, available by May."`,
      accent: `headlineAccent="Same active ingredient (tirzepatide). Less cost."`,
      subtitle: `subtitle="Compounded tirzepatide — dual GLP-1/GIP, prescribed online by US-licensed providers. May help you lose up to 10 lbs in your first month.* From $379/mo. Individual results vary."`,
    },
  },

  "app/lp/zepbound-alternative/page.tsx": {
    old: {
      headline: `headline="Zepbound-Level Results Without the"`,
      accent: `headlineAccent="Zepbound Price Tag"`,
      subtitle: `subtitle="Compounded tirzepatide delivers the same dual-action mechanism. From $379/mo."`,
    },
    new: {
      headline: `headline="The Zepbound alternative, available by May."`,
      accent: `headlineAccent="Same active ingredient (tirzepatide). Less cost."`,
      subtitle: `subtitle="Compounded tirzepatide — same dual GLP-1/GIP as Zepbound. May help you lose up to 10 lbs in your first month.* From $379/mo. Individual results vary."`,
    },
  },
};

let applied = 0;
let skipped = [];
let errors = [];

for (const [relPath, spec] of Object.entries(LPS)) {
  const absPath = resolve(ROOT, relPath);
  if (!existsSync(absPath)) {
    errors.push(`${relPath}: file not found`);
    continue;
  }
  let src = readFileSync(absPath, "utf8");
  let changed = 0;
  for (const key of ["headline", "accent", "subtitle"]) {
    if (src.includes(spec.old[key])) {
      src = src.replace(spec.old[key], spec.new[key]);
      changed++;
    } else if (src.includes(spec.new[key])) {
      // Already applied — idempotent.
    } else {
      errors.push(`${relPath}: could not find "${key}" — expected:\n  ${spec.old[key].slice(0, 80)}...`);
    }
  }
  if (changed > 0) {
    writeFileSync(absPath, src, "utf8");
    console.log(`  ✓ ${relPath}  (${changed}/3 fields)`);
    applied++;
  } else if (errors.some((e) => e.startsWith(relPath))) {
    // already logged
  } else {
    skipped.push(relPath);
  }
}

console.log(`\n=== summary ===`);
console.log(`applied: ${applied}`);
if (skipped.length) console.log(`already-applied (skipped): ${skipped.length}`);
if (errors.length) {
  console.log(`errors: ${errors.length}`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  process.exit(1);
}
