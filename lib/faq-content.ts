export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQTopic {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  faqs: FAQItem[];
  relatedLinks: { label: string; href: string }[];
}

export const faqTopics: FAQTopic[] = [
  {
    slug: "semaglutide",
    title: "Semaglutide FAQ: Dosing, Side Effects, Results & More",
    description:
      "Honest answers to the most common questions about semaglutide for weight loss — how it works, what to expect, dosing, side effects, and safety.",
    eyebrow: "Semaglutide",
    faqs: [
      {
        question: "What is semaglutide and how does it work for weight loss?",
        answer:
          "Semaglutide is a GLP-1 receptor agonist — a medication that mimics the action of a naturally occurring gut hormone called glucagon-like peptide-1. When injected once weekly, it signals to the brain's appetite centers that you are full, slows the rate at which food leaves the stomach, and reduces cravings. In the STEP-1 trial (2021), adults with obesity who took semaglutide 2.4 mg weekly alongside lifestyle counseling lost an average of 14.9% of their body weight over 68 weeks, compared to 2.4% in the placebo group. The medication does not burn fat directly — it works by reducing overall caloric intake by making food less compelling.",
      },
      {
        question: "What's the difference between Ozempic and Wegovy?",
        answer:
          "Ozempic and Wegovy contain the exact same molecule — semaglutide — but are FDA-approved for different indications and come in different maximum doses. Ozempic (approved 2017) is indicated for type 2 diabetes management and caps at 2 mg weekly. Wegovy (approved 2021) is indicated for chronic weight management and reaches a maintenance dose of 2.4 mg weekly. The higher dose is what drives the greater weight loss outcomes seen in the STEP trials. Because Ozempic is prescribed for diabetes, it is more commonly covered by insurance — some providers prescribe it off-label for weight loss, though this is technically outside its FDA label.",
      },
      {
        question: "How long does semaglutide take to work?",
        answer:
          "Most patients notice reduced appetite within the first one to two weeks of starting semaglutide, though weight loss typically becomes visible after four to eight weeks. The medication is titrated gradually — starting at 0.25 mg weekly — so the full appetite-suppressing effect builds over three to five months as doses increase. In the STEP-1 trial, meaningful weight loss continued accumulating through week 60 before plateauing, suggesting the medication has long-term effects beyond the initial phase. Patients who do not see any appetite change after four weeks at a given dose should discuss dose adjustment with their provider.",
      },
      {
        question: "What is the semaglutide dosing schedule?",
        answer:
          "The standard titration for Wegovy starts at 0.25 mg weekly for four weeks, increases to 0.5 mg for four weeks, then 1 mg for four weeks, then 1.7 mg for four weeks, and finally reaches the 2.4 mg maintenance dose at week 17. This slow escalation is designed to minimize GI side effects. Compounded semaglutide programs typically follow the same schedule. Some providers use a slower titration if side effects are problematic. Once at maintenance dose, patients continue weekly injections indefinitely — there is no maximum treatment duration.",
      },
      {
        question: "How much weight will I lose on semaglutide?",
        answer:
          "The STEP-1 trial average of approximately 15% body weight loss at 68 weeks is the most cited figure, but results vary considerably. About one-third of STEP-1 participants lost 20% or more of their body weight, while roughly 10% lost less than 5%. Factors that influence outcomes include adherence to the dosing schedule, dietary habits, physical activity, starting weight, and individual metabolic response. Compounded semaglutide uses the same active molecule as Wegovy, so equivalent outcomes are expected at equivalent doses. Setting realistic expectations — meaningful but variable — leads to better long-term outcomes than expecting the trial average precisely.",
      },
      {
        question: "What are the most common side effects of semaglutide?",
        answer:
          "The most commonly reported side effects are gastrointestinal: nausea (reported in approximately 44% of STEP-1 participants), vomiting, diarrhea, and constipation. These tend to be most pronounced during dose escalation and improve for most patients within two to four weeks of reaching a stable dose. Fatigue, burping, and acid reflux are also reported by a meaningful minority of patients. Serious adverse events — pancreatitis, gallbladder disease, and acute kidney injury from dehydration — are rare but real. The medication carries an FDA black box warning for thyroid C-cell tumors based on rodent studies, though a causal link in humans has not been established.",
      },
      {
        question: "How do I inject semaglutide correctly?",
        answer:
          "Semaglutide is injected subcutaneously — into the fatty tissue just under the skin — once weekly. Common injection sites include the abdomen (at least two inches from the navel), the outer thigh, or the upper arm. Rotate sites weekly to prevent lipohypertrophy (fatty lumps from repeated injection in the same spot). Before injecting, clean the site with an alcohol swab and allow it to dry. Insert the needle at a 90-degree angle, depress the plunger slowly, hold for five to ten seconds, then withdraw. Dispose of used needles in a sharps container. Never inject into muscle, a vein, skin that is tender, bruised, or scarred, or into the same spot two weeks in a row.",
      },
      {
        question: "Can I take semaglutide if I have type 2 diabetes?",
        answer:
          "Yes — semaglutide (as Ozempic) was originally developed specifically for type 2 diabetes management and has been widely prescribed for that indication since 2017. Patients with type 2 diabetes benefit from semaglutide's glucose-lowering effects in addition to weight loss. However, if you are taking other diabetes medications, particularly sulfonylureas or insulin, combining them with semaglutide may increase hypoglycemia risk and dose adjustments may be needed. Always inform your prescribing provider of all diabetes medications before starting semaglutide.",
      },
      {
        question: "Is compounded semaglutide as safe as Wegovy?",
        answer:
          "Compounded semaglutide uses the same active pharmaceutical ingredient as Wegovy but is prepared by state-licensed 503A or 503B compounding pharmacies rather than manufactured by Novo Nordisk. These pharmacies are regulated by state boards of pharmacy and, for 503B facilities, by the FDA. The active molecule is identical, but compounded products have not undergone the same large-scale clinical trials and FDA approval process as Wegovy. The practical safety implication is that compounding quality, sterility, and concentration accuracy depend on the specific pharmacy. Reputable telehealth programs use pharmacies with verified quality controls. Compounded medications are not FDA-approved and cannot make FDA-approved claims.",
      },
      {
        question: "What should I eat on semaglutide?",
        answer:
          "Semaglutide does not require a specific diet, but certain eating patterns work better alongside it. Prioritizing protein (aim for 100–130g daily) helps preserve muscle mass during weight loss, which is especially important since GLP-1 medications can cause muscle loss alongside fat loss if protein intake is insufficient. Smaller, more frequent meals tend to work better than large portions, since the medication slows gastric emptying and large meals can cause nausea or discomfort. Reducing ultra-processed foods, refined carbohydrates, and alcohol improves outcomes. Greasy or high-fat meals are more likely to trigger nausea on semaglutide.",
      },
      {
        question: "Can I drink alcohol on semaglutide?",
        answer:
          "Alcohol is not contraindicated with semaglutide, but several interactions are worth knowing. Semaglutide slows gastric emptying, which can change how quickly alcohol is absorbed — many patients report feeling the effects of alcohol more intensely than expected with their usual amount. The medication also appears to reduce the reward response to alcohol for many patients, a phenomenon being studied as a potential treatment for alcohol use disorder. Practically: if you drink, be aware that your tolerance may shift. There are no dangerous drug interactions, but alcohol is calorie-dense, increases nausea risk, and can undermine the metabolic progress you're making.",
      },
      {
        question: "What happens if I miss a dose?",
        answer:
          "If you miss a dose of semaglutide and your next scheduled injection is five or more days away, take the missed dose as soon as you remember. If the missed dose is within five days of your next scheduled injection, skip it and resume your regular weekly schedule — do not take two doses within five days. A single missed dose is unlikely to significantly impact your progress. However, patients who miss multiple doses over several weeks may notice appetite returning before it would otherwise, since the medication's steady-state blood level will drop. Contact your provider if you are regularly missing doses to discuss strategies.",
      },
      {
        question: "Will I gain weight back if I stop semaglutide?",
        answer:
          "Weight regain after stopping semaglutide is well-documented. A landmark 2022 follow-up study (STEP-1 extension) found that participants who stopped semaglutide after 68 weeks regained approximately two-thirds of their lost weight within one year, with many metabolic markers returning toward baseline. This suggests that for most people, semaglutide functions more like a chronic treatment for a chronic condition (obesity) than a short-term intervention with lasting effects. Some patients transition to a lower maintenance dose rather than stopping entirely. For patients who stop, maintaining dietary habits, protein intake, strength training, and adequate sleep gives the best chance of preserving weight loss.",
      },
      {
        question: "Can I take semaglutide if I'm pregnant or planning to get pregnant?",
        answer:
          "Semaglutide is contraindicated during pregnancy. Animal studies showed fetal harm at doses used in humans, and while human data is limited, the FDA advises against use during pregnancy. Women who could become pregnant should use effective contraception while on semaglutide. Because semaglutide takes approximately five weeks to clear the body after the last injection, it is recommended to discontinue the medication at least two months before attempting conception. If you become pregnant while taking semaglutide, contact your provider immediately. Women who are breastfeeding should also avoid semaglutide, as it is unknown whether it passes into breast milk.",
      },
      {
        question: "What are the contraindications for semaglutide?",
        answer:
          "Semaglutide should not be used by patients with a personal or family history of medullary thyroid carcinoma (MTC) or Multiple Endocrine Neoplasia syndrome type 2 (MEN 2), due to a black box warning based on animal studies. Additional contraindications include a prior serious hypersensitivity reaction to semaglutide or any component of the formulation. Use with caution — and discuss with your provider — if you have a history of pancreatitis, gallbladder disease, diabetic retinopathy, or serious kidney disease. The medication is not appropriate for patients who are pregnant or breastfeeding. A comprehensive clinical intake by a licensed provider is required before prescribing.",
      },
    ],
    relatedLinks: [
      { label: "Semaglutide Program Overview", href: "/semaglutide" },
      { label: "Medications: Semaglutide vs Tirzepatide", href: "/medications/semaglutide" },
      { label: "GLP-1 Cost & Pricing Guide", href: "/glp1-cost" },
      { label: "Side Effects FAQ", href: "/faq/side-effects" },
      { label: "Getting Started FAQ", href: "/faq/getting-started" },
      { label: "Check Your Eligibility", href: "/eligibility" },
    ],
  },
  {
    slug: "tirzepatide",
    title: "Tirzepatide FAQ: Dosing, Results, Side Effects & Cost",
    description:
      "Everything you want to know about tirzepatide for weight loss — how it compares to semaglutide, expected weight loss, dosing schedule, side effects, and who it's best for.",
    eyebrow: "Tirzepatide",
    faqs: [
      {
        question: "What is tirzepatide and how is it different from semaglutide?",
        answer:
          "Tirzepatide is a dual GIP/GLP-1 receptor agonist — it activates two distinct hormone pathways simultaneously, compared to semaglutide which activates only the GLP-1 pathway. GIP (glucose-dependent insulinotropic polypeptide) is another gut hormone involved in insulin secretion, fat storage, and energy regulation. The combination of dual agonism appears to produce synergistic effects on appetite reduction and metabolic function. The SURMOUNT-1 trial (2022) demonstrated that tirzepatide at its highest dose (15 mg) produced an average of 22.5% body weight loss over 72 weeks — the largest average weight loss ever observed in a pharmaceutical weight management trial.",
      },
      {
        question: "What are Zepbound and Mounjaro?",
        answer:
          "Zepbound and Mounjaro contain the same active ingredient — tirzepatide — manufactured by Eli Lilly. Mounjaro was approved by the FDA in 2022 for type 2 diabetes management. Zepbound received FDA approval in November 2023 specifically for chronic weight management in adults with obesity or overweight with at least one weight-related condition. The two products are dosed identically, but Zepbound's approval means providers can prescribe tirzepatide specifically for weight management rather than off-label through the diabetes indication. Insurance coverage pathways differ between the two products.",
      },
      {
        question: "How much weight can I lose on tirzepatide?",
        answer:
          "The SURMOUNT-1 trial reported average weight losses of 15.0%, 19.5%, and 22.5% at the 5 mg, 10 mg, and 15 mg doses respectively over 72 weeks. Approximately 57% of participants on the highest dose lost 20% or more of their body weight — a threshold rarely reached with any prior medication. The SURMOUNT-5 trial (2025) directly compared tirzepatide to semaglutide and found tirzepatide produced approximately 47% greater relative weight loss. Individual results vary considerably based on adherence, diet, activity level, and individual metabolic response. These figures represent averages from clinical trial populations with lifestyle counseling.",
      },
      {
        question: "What is the tirzepatide dosing schedule?",
        answer:
          "Tirzepatide is initiated at 2.5 mg weekly for four weeks, then increased to 5 mg weekly (the first maintenance dose option). Subsequent dose increases — to 7.5 mg, 10 mg, 12.5 mg, and 15 mg — occur every four weeks as tolerated, with patients and providers targeting the dose that provides optimal weight loss with manageable side effects. Not all patients need to reach 15 mg; some achieve excellent results at lower maintenance doses with fewer side effects. The medication is injected once weekly subcutaneously, following the same injection technique as semaglutide.",
      },
      {
        question: "Is tirzepatide better than semaglutide?",
        answer:
          "On pure efficacy measures, tirzepatide outperforms semaglutide in clinical trials. The SURMOUNT-5 trial, designed specifically as a head-to-head comparison, confirmed tirzepatide's superiority with roughly 47% greater relative weight reduction. However, 'better' depends on the individual. Some patients respond very well to semaglutide alone, and side effect profiles are similar between the two drugs. Tirzepatide also tends to be more expensive, and insurance coverage may differ. Patients who have tried semaglutide and hit a plateau — or who want to maximize weight loss probability from the start — may be good candidates for tirzepatide.",
      },
      {
        question: "What are the side effects of tirzepatide?",
        answer:
          "Side effects are broadly similar to semaglutide: nausea, vomiting, diarrhea, and constipation are the most common, particularly during dose escalation. In the SURMOUNT-1 trial, nausea was reported in 31–39% of participants across doses, compared to 44% with semaglutide in STEP-1. This suggests tirzepatide may be slightly better tolerated GI-wise than semaglutide, though direct comparison is difficult due to different trial populations. Serious adverse events — pancreatitis, gallbladder disease — are rare but carry the same warnings as the GLP-1 class. Tirzepatide carries the same thyroid C-cell tumor black box warning as semaglutide.",
      },
      {
        question: "How do I inject tirzepatide?",
        answer:
          "Tirzepatide is injected subcutaneously once weekly, using the same technique as semaglutide. Common injection sites are the abdomen (at least two inches from the navel), outer thigh, or upper arm. Rotate sites each week. Clean the skin with an alcohol swab, allow to dry, then insert the auto-injector pen straight against the skin, press the button, and hold for five to ten seconds before removing. Dispose of used pens in an approved sharps container. Zepbound is available as an auto-injector pen; compounded tirzepatide typically comes in a vial requiring a syringe. Your provider or pharmacist will walk you through your specific formulation.",
      },
      {
        question: "Who should choose tirzepatide over semaglutide?",
        answer:
          "Tirzepatide is a strong first choice for patients who want to maximize weight loss probability, patients with higher starting BMIs, patients with type 2 diabetes (where the dual GIP mechanism provides additional metabolic benefits), and patients who previously tried semaglutide and did not achieve sufficient results. Semaglutide may be preferable when cost is a limiting factor (it is more commonly covered by insurance for diabetes via Ozempic), when simplicity is preferred, or when a patient has a history of particularly good response to pure GLP-1 agonism. Both are highly effective and the right choice depends on individual circumstances and provider evaluation.",
      },
      {
        question: "Is compounded tirzepatide available?",
        answer:
          "Yes — compounded tirzepatide has been available from 503A and 503B compounding pharmacies, particularly during periods when brand Zepbound/Mounjaro has been on the FDA shortage list. The FDA removed tirzepatide from the shortage list in early 2025, which may affect compounding pharmacy availability going forward — regulations around compounding changed following shortage resolution. Check with your telehealth provider for current availability and sourcing. As with compounded semaglutide, the active molecule is the same but the product is not FDA-approved and is prepared by state-licensed pharmacies.",
      },
      {
        question: "How long until tirzepatide starts working?",
        answer:
          "Most patients notice appetite suppression within the first one to two weeks at the 2.5 mg starting dose, though this varies. Meaningful scale weight changes typically appear within four to eight weeks. Because tirzepatide is titrated slowly over several months, weight loss continues to accelerate as doses increase — many patients lose the most weight between weeks 12 and 36. In SURMOUNT-1, weight loss continued accumulating through approximately week 60 before plateauing at the highest doses. Patients who notice appetite changes even at low starting doses tend to have better long-term outcomes.",
      },
      {
        question: "Can people with type 2 diabetes use tirzepatide?",
        answer:
          "Yes — tirzepatide was approved for type 2 diabetes management (as Mounjaro) before it was approved for weight management (as Zepbound). The dual GIP/GLP-1 mechanism makes tirzepatide particularly effective for diabetes: in the SURPASS clinical trials, tirzepatide produced greater HbA1c reductions than any other available diabetes medication including insulin. For patients with both type 2 diabetes and obesity, tirzepatide is an excellent option that addresses both conditions simultaneously. Patients on other diabetes medications, particularly insulin or sulfonylureas, should discuss dose adjustments with their endocrinologist or diabetes care provider.",
      },
      {
        question: "What does tirzepatide cost per month?",
        answer:
          "Brand Zepbound has a list price of approximately $1,060/month, though manufacturer savings programs can bring this down significantly for eligible patients — Eli Lilly's Zepbound Savings Card can reduce cost to as low as $550/month for commercially insured patients. Without insurance or savings programs, brand tirzepatide is cost-prohibitive for most patients. Compounded tirzepatide through telehealth programs typically ranges from $279–$399/month for the medication, though some all-inclusive programs bundle provider fees, medication, shipping, and coaching support into a single monthly fee.",
      },
      {
        question: "Are the results from tirzepatide permanent?",
        answer:
          "Weight loss from tirzepatide is not permanent once the medication is stopped. Studies examining what happens after discontinuation show patterns similar to semaglutide — significant weight regain over the following six to twelve months. A 2023 study in the New England Journal of Medicine found that participants who stopped tirzepatide after one year regained approximately half of their lost weight within a year. This reflects obesity's nature as a chronic condition requiring ongoing management. Options for maintaining results include continuing at a reduced maintenance dose, transitioning to a maintenance-focused program, and establishing lasting dietary and exercise habits during the treatment period.",
      },
      {
        question: "What foods should I avoid on tirzepatide?",
        answer:
          "No foods are strictly forbidden on tirzepatide, but some are more likely to cause problems. High-fat, greasy foods frequently trigger nausea because tirzepatide slows gastric emptying — already-slow digestion plus a fatty meal can cause significant discomfort. Alcohol is tolerated by most patients but may have amplified effects and can increase nausea risk. Very large meals should be avoided; the medication's effect on gastric emptying makes large-volume eating uncomfortable and sometimes painful. Foods most compatible with tirzepatide treatment: lean proteins, vegetables, moderate carbohydrates, smaller portions spread across the day.",
      },
      {
        question: "Can tirzepatide be taken with other medications?",
        answer:
          "Tirzepatide has relatively few major drug interactions, but certain combinations warrant attention. Because it slows gastric emptying, it can affect the absorption rate of oral medications — patients taking oral contraceptives should be aware of potential reduced absorption and may want to use backup contraception during the first four weeks at each new dose. For patients on other diabetes medications (insulin, sulfonylureas), dose adjustments are typically needed to prevent hypoglycemia. Levothyroxine (thyroid medication) absorption may also be affected. Always provide your complete medication list to your prescribing provider before starting tirzepatide.",
      },
    ],
    relatedLinks: [
      { label: "Tirzepatide Program Overview", href: "/tirzepatide" },
      { label: "Medications: Tirzepatide vs Semaglutide", href: "/medications/tirzepatide" },
      { label: "GLP-1 Cost & Pricing Guide", href: "/glp1-cost" },
      { label: "Semaglutide FAQ", href: "/faq/semaglutide" },
      { label: "Side Effects FAQ", href: "/faq/side-effects" },
      { label: "Check Your Eligibility", href: "/eligibility" },
    ],
  },
  {
    slug: "cost",
    title: "GLP-1 Medication Cost FAQ: Insurance, Pricing & Savings",
    description:
      "Straightforward answers to the most common questions about the cost of GLP-1 medications like Wegovy, Zepbound, and compounded alternatives — including insurance coverage, savings programs, and what an all-inclusive program actually costs.",
    eyebrow: "Cost & Pricing",
    faqs: [
      {
        question: "How much does semaglutide cost per month?",
        answer:
          "Brand Wegovy has a list price of approximately $1,350/month at the 2.4 mg maintenance dose without insurance. Novo Nordisk's Wegovy Savings Program can reduce out-of-pocket cost to $0–$650/month for eligible commercially insured patients. Without any coverage or savings programs, most patients turn to compounded semaglutide, which typically ranges from $200–$400/month depending on the provider and dose. All-inclusive telehealth programs like Nature's Journey bundle provider fees, medication, and support, making the true cost comparison more straightforward than comparing medication prices alone.",
      },
      {
        question: "Does insurance cover GLP-1 medication for weight loss?",
        answer:
          "Coverage for GLP-1 medications prescribed specifically for weight management (Wegovy, Zepbound) is inconsistent across insurance plans. As of 2026, most commercial insurance plans do not cover weight management medications, though some employers — particularly large self-insured companies — have added coverage. When prescribed for type 2 diabetes (Ozempic, Mounjaro), coverage is much more common. Medicaid coverage varies significantly by state. Medicare was prohibited from covering weight loss drugs until late 2025 when limited coverage for certain patients was introduced. Always call the member services number on your insurance card to check your specific plan's formulary.",
      },
      {
        question: "What is the difference between brand and compounded GLP-1 medication?",
        answer:
          "Brand medications (Wegovy, Zepbound) are FDA-approved products manufactured under rigorous pharmaceutical quality standards by Novo Nordisk and Eli Lilly respectively. Compounded GLP-1 medications contain the same active pharmaceutical ingredient but are prepared by state-licensed compounding pharmacies (503A for individual patients, 503B for larger-scale production). Compounded versions are significantly less expensive — often 70–80% cheaper than brand pricing — but are not FDA-approved and have not undergone the same clinical trials. Quality varies by pharmacy. Reputable programs work with verified compounding pharmacies with documented quality controls, sterility testing, and accurate concentration verification.",
      },
      {
        question: "How do manufacturer savings cards work for Wegovy?",
        answer:
          "Novo Nordisk's Wegovy Savings Program (sometimes called a co-pay card or savings card) works for commercially insured patients who meet eligibility requirements. Eligible patients can pay as little as $0/month for the first month and reduced rates thereafter, though the program caps at a maximum savings amount per fill. The savings card does not work for Medicare, Medicaid, or federally funded insurance plans — use with government insurance is prohibited and constitutes fraud. Eligibility, the specific savings amount, and program terms change periodically. Visit Wegovy.com or ask your pharmacy for current program details.",
      },
      {
        question: "Can I use GoodRx for Wegovy or Zepbound?",
        answer:
          "GoodRx and similar discount programs typically do not provide meaningful savings on brand Wegovy or Zepbound, because these medications are not yet widely available in generic form and brand manufacturers sometimes have agreements that limit discount program applicability. The manufacturer savings cards (when you qualify) are almost always a better option than GoodRx for brand GLP-1 medications. GoodRx can be useful for older, generic diabetes medications. For the most current pricing information, compare the manufacturer savings program, your insurance formulary, and pharmacy-specific pricing directly.",
      },
      {
        question: "Why is GLP-1 medication so expensive?",
        answer:
          "Brand GLP-1 medications are priced at a premium for several reasons: the underlying peptide chemistry is complex and expensive to manufacture, clinical trials cost hundreds of millions of dollars, and patent protection allows manufacturers to price without generic competition. Novo Nordisk and Eli Lilly cite the clinical development investment as justification for brand pricing. The medications were originally developed for diabetes, where the market is large and pricing precedents were set before weight management indications were added. In international markets where price negotiation is common, these medications cost significantly less — Wegovy in the UK costs roughly 20% of the US list price.",
      },
      {
        question: "How much does compounded semaglutide cost?",
        answer:
          "Compounded semaglutide pricing varies by dose, program, and pharmacy, but generally ranges from $150–$400/month. At starting doses (0.25 mg, 0.5 mg), costs tend to be on the lower end. At full maintenance dose (2.4 mg equivalent), costs are higher. Some all-inclusive telehealth programs include the medication, provider consultation, shipping, and support for a flat monthly fee in the $279–$399/month range. It is important to compare what is included — a lower medication price that requires separate provider visit fees may end up costing more than an all-inclusive program. Always verify the pharmacy's credentials and quality assurance practices.",
      },
      {
        question: "What does an all-inclusive telehealth GLP-1 program cost?",
        answer:
          "All-inclusive telehealth GLP-1 programs typically bundle medical evaluation, ongoing provider access, medication, shipping, and support features into a single monthly fee. Pricing generally ranges from $249–$599/month depending on the medication, dose level, and what support features are included. Nature's Journey's programs start at $279/month and include medical evaluation, compounded medication, unlimited provider messaging, nutrition guidance, progress tracking tools, and a referral program. When comparing programs, evaluate: medication quality and sourcing, provider availability, included support, and whether pricing is truly all-inclusive or requires additional fees for certain services.",
      },
      {
        question: "Will Medicare or Medicaid cover GLP-1 for weight loss?",
        answer:
          "Medicare historically excluded weight loss medications from coverage under Part D. In late 2025, CMS introduced limited coverage for GLP-1 medications for certain high-risk cardiovascular patients, following the SELECT trial results showing cardiovascular risk reduction with semaglutide. However, broad Medicare coverage for weight management indications remains limited and varies by plan. Medicaid coverage varies significantly by state — some states have added weight management medication coverage while others have not. Patients on government insurance programs should contact their plan directly, as coverage policy in this area is actively evolving.",
      },
      {
        question: "Are there any programs to help with the cost of GLP-1 medication?",
        answer:
          "Several options exist for reducing GLP-1 medication costs. Manufacturer savings programs (Novo Nordisk for Wegovy, Eli Lilly for Zepbound) can significantly reduce costs for commercially insured patients who qualify. Patient assistance programs from both manufacturers provide free or deeply discounted medication for patients who meet income criteria — check NovoCare.com and LillyInsulinValue.com for current programs. Compounded semaglutide or tirzepatide through telehealth programs is the most accessible option for patients without insurance coverage. Some employers have begun offering GLP-1 coverage as a health benefit — worth reviewing your employer benefits plan during open enrollment.",
      },
    ],
    relatedLinks: [
      { label: "GLP-1 Cost & Pricing Guide", href: "/glp1-cost" },
      { label: "Pricing & Plans", href: "/pricing" },
      { label: "Semaglutide FAQ", href: "/faq/semaglutide" },
      { label: "Tirzepatide FAQ", href: "/faq/tirzepatide" },
      { label: "Compare Programs", href: "/compare" },
      { label: "Start Your Assessment", href: "/quiz" },
    ],
  },
  {
    slug: "side-effects",
    title: "GLP-1 Side Effects FAQ: What to Expect and How to Manage",
    description:
      "Honest, detailed answers about GLP-1 medication side effects — which are common, which are serious, how to manage nausea and constipation, and when to call your provider.",
    eyebrow: "Side Effects",
    faqs: [
      {
        question: "What are the most common side effects of GLP-1 medication?",
        answer:
          "The most frequently reported side effects are gastrointestinal: nausea (affecting 30–44% of patients in clinical trials), constipation (24% in STEP trials), diarrhea, vomiting, and stomach pain. These occur most often during dose escalation — the body is adjusting to slower gastric emptying and changes in digestive hormone signaling. Most GI side effects improve within two to four weeks of reaching a stable dose. Non-GI side effects reported by a meaningful minority of patients include fatigue, headache, burping, acid reflux, and injection site reactions. Serious adverse events are rare but include pancreatitis, gallbladder disease, and kidney injury from severe dehydration.",
      },
      {
        question: "How do I manage nausea on semaglutide or tirzepatide?",
        answer:
          "Several strategies reliably reduce GLP-1-related nausea: eating smaller, more frequent meals rather than large portions; avoiding greasy, spicy, or high-fat foods that compound delayed gastric emptying; eating slowly and stopping when comfortably full rather than stuffed; staying well hydrated with water or electrolyte drinks; avoiding lying down immediately after eating; and taking the injection on a day when you can rest if nausea is bothersome. Over-the-counter antiemetics (ginger supplements, vitamin B6, ondansetron if prescribed) can provide additional relief. If nausea is severe and persistent, contact your provider — a dose reduction or slower titration schedule can significantly improve tolerability.",
      },
      {
        question: "Does GLP-1 medication cause constipation?",
        answer:
          "Yes — constipation is among the most common GLP-1 side effects, reported in approximately 24% of semaglutide users in the STEP trials compared to 6% of placebo users. It is often underreported because patients don't always connect it to the medication, especially if it develops gradually. The mechanism is straightforward: GLP-1 receptor agonists slow gastric emptying and intestinal motility, which means food and waste move through the digestive system more slowly. Effective management includes increasing water intake significantly, adding soluble fiber (psyllium, oats, legumes) to your diet, staying physically active, and using osmotic laxatives like MiraLAX if needed. Notify your provider if constipation becomes severe or lasts more than two weeks.",
      },
      {
        question: "What causes fatigue on semaglutide?",
        answer:
          "Fatigue on semaglutide has several potential contributors. Significantly reduced caloric intake — one of the medication's primary mechanisms — means less energy available for daily function, particularly in the initial weeks of treatment. The body also expends energy adapting to a new hormonal environment and changes in gut motility. Dehydration from nausea or vomiting can compound fatigue. Some patients experience fatigue specifically around injection day as the medication peaks in their system. For most patients, fatigue improves after the first few weeks of treatment. If fatigue is severe or persistent, discuss with your provider — it may signal inadequate protein or caloric intake, or indicate a need to slow the titration.",
      },
      {
        question: "Is hair loss a side effect of GLP-1 medication?",
        answer:
          "Hair loss (telogen effluvium) has been reported by a meaningful subset of GLP-1 users, though it is not listed as a common side effect in the prescribing information for either semaglutide or tirzepatide. The most likely cause is not the medication itself but the rapid caloric restriction and significant weight loss it enables — the same pattern of hair shedding seen with any rapid weight loss intervention, including bariatric surgery. Telogen effluvium typically begins two to four months after the onset of rapid weight loss and is temporary, with hair regrowth occurring over the following six to twelve months. Ensuring adequate protein intake (100+ grams daily) is the most evidence-supported strategy for minimizing this effect.",
      },
      {
        question: "What is 'Ozempic face' and can it be prevented?",
        answer:
          "'Ozempic face' is a colloquial term describing the gaunt, aged facial appearance that some patients develop with significant GLP-1-mediated weight loss. It is not caused by the medication itself but rather by the loss of facial fat that accompanies overall body fat reduction — the same phenomenon that occurs with rapid weight loss from any cause. Because facial fat distributes differently than body fat and tends to give skin a full, smooth appearance, rapid facial volume loss can make skin appear loose or sunken. Prevention strategies are limited — slower weight loss generally preserves facial appearance better than rapid loss, and maintaining adequate nutrition helps. Dermal fillers or other cosmetic interventions are options some patients pursue.",
      },
      {
        question: "Does GLP-1 medication cause gallstones?",
        answer:
          "GLP-1 medications are associated with an increased risk of gallbladder disease, including gallstones and cholecystitis (gallbladder inflammation). The STEP-1 trial reported gallbladder-related adverse events in approximately 2.6% of semaglutide participants versus 1.2% in the placebo group. The proposed mechanism involves both the medication's effect on gallbladder motility (reduced contraction can cause bile to pool and crystallize) and the effects of rapid weight loss itself, which is independently associated with gallstone formation. Patients with a history of gallbladder disease should discuss this risk with their provider before starting GLP-1 therapy. Symptoms of gallbladder problems — right upper abdominal pain, especially after eating — should be reported promptly.",
      },
      {
        question: "Can GLP-1 medication affect mental health or mood?",
        answer:
          "Current evidence suggests GLP-1 medications do not negatively impact mental health and may improve it for many patients. The SELECT trial, a large cardiovascular outcomes trial with semaglutide, found improved mood scores and quality of life measures in the treatment group. Depression is often co-morbid with obesity, and the weight loss from GLP-1 treatment generally improves depression symptoms. However, a very small number of case reports of suicidal ideation led the FDA to investigate the class in 2023 — the subsequent review did not establish a causal relationship. Patients with preexisting mental health conditions should continue regular monitoring with their mental health providers, and any new or worsening mood symptoms should be reported.",
      },
      {
        question: "Are there serious side effects I should know about?",
        answer:
          "Several serious adverse events, while rare, are associated with GLP-1 medications. Pancreatitis (inflammation of the pancreas) has been reported; symptoms include severe, persistent abdominal pain radiating to the back. Gallbladder disease (see above) occurs at approximately twice the placebo rate. Serious hypoglycemia can occur in patients also taking insulin or sulfonylureas. Severe nausea and vomiting leading to dehydration and acute kidney injury is a serious but preventable complication — staying well hydrated is critical. Diabetic retinopathy complications have been reported in some patients with preexisting retinopathy. The black box thyroid cancer warning, based on rodent studies, has not been confirmed in human data but warrants caution in patients with thyroid risk factors.",
      },
      {
        question: "Do side effects get better over time?",
        answer:
          "Yes — for the majority of patients, GI side effects improve substantially after the first four to eight weeks at a stable dose. The body adapts to the slowed gastric motility and changes in gut hormone signaling over time. Patients who follow a slow titration schedule — not rushing to the highest dose — tend to have significantly better tolerability. In the STEP trials, the discontinuation rate due to side effects was approximately 7% for semaglutide and similar for tirzepatide — meaning most patients tolerated the medication well enough to continue. If side effects remain unacceptable after eight weeks at the same dose, your provider can consider dose reduction, slower titration, or medication adjustment.",
      },
      {
        question: "What injection site reactions are normal?",
        answer:
          "Mild injection site reactions are common and expected: redness, minor swelling, and brief pain or stinging at the injection site that resolves within hours are all normal. Slight bruising occasionally occurs. These reactions are typically mild and decrease as patients become more comfortable with the injection technique. Reactions that warrant provider attention include: persistent lumps or nodules under the skin (lipohypertrophy from repeated injection in the same site — prevented by rotating sites), severe pain that lasts more than a few hours, significant swelling or warmth suggesting infection, or rash spreading away from the injection site suggesting an allergic reaction.",
      },
      {
        question: "When should I contact my provider about side effects?",
        answer:
          "Contact your provider promptly if you experience: severe persistent abdominal pain (particularly radiating to the back), which could indicate pancreatitis; severe right upper abdominal pain after eating, which may indicate gallbladder issues; inability to keep fluids down for more than 24 hours (dehydration risk); heart rate changes that feel abnormal; new or worsening vision problems (diabetic retinopathy concern); signs of a severe allergic reaction (hives, facial swelling, difficulty breathing); or significant mood changes or thoughts of self-harm. For manageable but persistent GI side effects, schedule a routine check-in rather than waiting for your next scheduled appointment — your provider may be able to adjust your titration schedule or prescribe additional symptom management.",
      },
    ],
    relatedLinks: [
      { label: "Semaglutide FAQ", href: "/faq/semaglutide" },
      { label: "Tirzepatide FAQ", href: "/faq/tirzepatide" },
      { label: "Getting Started FAQ", href: "/faq/getting-started" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Meal Plans & Recipes", href: "/meals" },
      { label: "Check Your Eligibility", href: "/eligibility" },
    ],
  },
  {
    slug: "getting-started",
    title: "Getting Started with Nature's Journey: FAQ",
    description:
      "Everything you need to know before starting — how to qualify, what the intake process looks like, how quickly you can get medication, and what's included in your membership.",
    eyebrow: "Getting Started",
    faqs: [
      {
        question: "How do I know if I qualify for GLP-1 medication?",
        answer:
          "GLP-1 medications are FDA-approved for adults with a BMI of 30 or higher (clinical obesity), or a BMI of 27 or higher with at least one weight-related health condition such as high blood pressure, high cholesterol, type 2 diabetes, or sleep apnea. Eligibility is ultimately determined by a licensed medical provider who reviews your health history, current medications, and any contraindications — not by a BMI calculation alone. Certain conditions — a personal or family history of medullary thyroid carcinoma, Multiple Endocrine Neoplasia type 2, prior pancreatitis, or current pregnancy — are absolute contraindications. The best way to know is to complete our brief eligibility assessment and have a provider evaluate your information.",
      },
      {
        question: "What does the Nature's Journey intake process look like?",
        answer:
          "The Nature's Journey intake is a three-step process completed online, typically in 15–20 minutes. Step one collects your basic health information: height, weight, medical history, current medications, and health goals. Step two covers medical screening — including contraindication screening, lab history review, and consent to telehealth services. Step three is your plan selection and checkout. After submission, a licensed provider reviews your intake and either approves a prescription, requests additional information, or (if contraindicated) explains why medication is not appropriate for you. The entire intake is HIPAA-compliant and your medical information is stored securely.",
      },
      {
        question: "How long does it take to get my first prescription?",
        answer:
          "Most patients receive a provider decision within 24–48 hours of completing their intake. Once approved, the prescription is sent to our pharmacy partner. Standard shipping typically takes three to five business days. Expedited shipping is available. Most new patients have their first shipment in hand within one week of completing intake. During periods of high volume or pharmacy fulfillment delays, this timeline may extend slightly — your patient dashboard will show real-time order status. If you have not received a shipping confirmation within five business days of approval, contact our care team.",
      },
      {
        question: "What happens at my provider evaluation?",
        answer:
          "Your provider evaluation is asynchronous — the reviewing provider reads your submitted intake information rather than conducting a live video call for initial enrollment. This allows for faster review and approval without requiring you to schedule an appointment. The provider evaluates your health history for contraindications, reviews your medications for interactions, assesses your BMI and any qualifying conditions, and makes a clinical decision about the appropriate starting dose and titration plan. Ongoing provider communication happens through the secure messaging system in your patient dashboard. In-person or video follow-ups are available for complex cases.",
      },
      {
        question: "What information do I need to provide at intake?",
        answer:
          "You will need to provide: current height and weight (self-reported is fine for initial assessment); basic medical history including any diagnosed conditions; a complete current medication list including supplements and over-the-counter medications; family history relevant to GLP-1 contraindications (specifically thyroid cancer history); contact information and shipping address; payment method; and acknowledgment of consent forms covering telehealth services, HIPAA privacy practices, and treatment consent. You do not need lab work to start — your provider will let you know if they need any additional health information after reviewing your intake.",
      },
      {
        question: "How is medication shipped?",
        answer:
          "Medication is shipped from our licensed compounding pharmacy partner in temperature-appropriate packaging. Injectable medications require cold-chain shipping to maintain potency; they are shipped with appropriate cold packs and insulation. Standard shipping is USPS Priority Mail or equivalent (three to five business days). Expedited options are available at checkout. Refills are shipped automatically on your subscription cycle so you do not run out — the dashboard shows your next refill date and allows early refill requests if needed. You will receive tracking information via email when your order ships.",
      },
      {
        question: "Do I need to be monitored by a doctor while on GLP-1?",
        answer:
          "Yes — GLP-1 medications require ongoing medical oversight, and this is built into the Nature's Journey membership. Your treatment includes access to licensed providers through the secure messaging system for any questions or concerns, regular check-in prompts at key milestones, dose escalation reviews before increasing to higher doses, and safety monitoring protocols for patients with relevant health conditions. You should also maintain communication with any other providers managing related conditions — particularly if you have type 2 diabetes, cardiovascular disease, or take medications that may interact with GLP-1 treatment. Nature's Journey providers cannot replace your primary care physician but complement your overall care.",
      },
      {
        question: "What is included in my Nature's Journey membership?",
        answer:
          "Nature's Journey membership includes: licensed provider evaluation and ongoing provider access via secure messaging; compounded GLP-1 medication with dosing appropriate to your treatment phase; free shipping on all orders; a personalized treatment plan; access to the patient dashboard with progress tracking, weight logging, and photo comparison; structured meal plans and recipe library curated for GLP-1 treatment; a referral program that earns you credits for each person you refer; and provider-led notifications and check-ins throughout your treatment. The monthly fee is all-inclusive — there are no separate visit fees, per-message charges, or hidden pharmacy markups.",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "Yes — Nature's Journey subscriptions can be cancelled at any time through your account settings, with no cancellation fees. Your coverage continues through the end of your current billing period. We do ask patients who are considering cancellation to speak with a member of our care team first — we can often address concerns, adjust your plan, or pause your subscription rather than a full cancellation. If you are cancelling due to side effects, financial concerns, or a life event, our care team has options that may better fit your situation. For patients who cancel and later want to restart, the reactivation process uses your existing account and prior intake information.",
      },
      {
        question: "What if I'm prescribed medication and have concerns after starting?",
        answer:
          "Message your provider through the patient dashboard at any time — provider messaging is included in your membership at no additional cost. For non-urgent questions about side effects, dose timing, or dietary guidance, responses typically come within one business day. For urgent concerns — severe abdominal pain, inability to keep fluids down, signs of an allergic reaction — do not wait for a message response: call emergency services or go to an urgent care or emergency room. Your patient dashboard also includes dosing reminders, escalation tracking, and symptom-logging features that help you track patterns and share useful context with your provider.",
      },
    ],
    relatedLinks: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing & Plans", href: "/pricing" },
      { label: "Check Your Eligibility", href: "/eligibility" },
      { label: "Semaglutide FAQ", href: "/faq/semaglutide" },
      { label: "Side Effects FAQ", href: "/faq/side-effects" },
      { label: "Take the Quiz", href: "/quiz" },
    ],
  },
];
