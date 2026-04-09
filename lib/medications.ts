export interface MedicationInfo {
  slug: string;
  brandName: string;
  genericName: string;
  manufacturer: string;
  activeIngredient: string;
  approvedFor: string;
  dosing: string;
  retailCost: string;
  vitalpathCost: string;
  savings: string;
  mechanism: string;
  weightLoss: string;
  sideEffects: string[];
  keyFacts: string[];
  comparisonSlug?: string;
}

export const medications: MedicationInfo[] = [
  {
    slug: "semaglutide",
    brandName: "Ozempic / Wegovy",
    genericName: "Semaglutide",
    manufacturer: "Novo Nordisk",
    activeIngredient: "Semaglutide",
    approvedFor: "Ozempic: Type 2 diabetes. Wegovy: Chronic weight management in adults with BMI 30+ or 27+ with weight-related conditions.",
    dosing: "Weekly subcutaneous injection. Titrated from 0.25mg to target dose (up to 2.4mg for Wegovy) over 16-20 weeks.",
    retailCost: "$935-$1,349+/month",
    vitalpathCost: "From $279/month",
    savings: "Up to 79%",
    mechanism: "GLP-1 receptor agonist. Mimics the natural GLP-1 hormone to reduce appetite, slow gastric emptying, and improve insulin sensitivity.",
    weightLoss: "STEP clinical trials showed average weight loss of 15-16% of body weight over 68 weeks. 86% of participants lost at least 5% of body weight.",
    sideEffects: ["Nausea (44%)", "Diarrhea (30%)", "Vomiting (24%)", "Constipation (24%)", "Headache (14%)"],
    keyFacts: [
      "Most widely prescribed GLP-1 for weight management",
      "Once-weekly injection",
      "Extensive clinical trial data (STEP trials)",
      "Available as compounded semaglutide at significant savings",
      "Effects are reversible — weight management requires ongoing use or habit changes",
    ],
    comparisonSlug: "semaglutide-vs-tirzepatide",
  },
  {
    slug: "tirzepatide",
    brandName: "Mounjaro / Zepbound",
    genericName: "Tirzepatide",
    manufacturer: "Eli Lilly",
    activeIngredient: "Tirzepatide",
    approvedFor: "Mounjaro: Type 2 diabetes. Zepbound: Chronic weight management in adults with BMI 30+ or 27+ with weight-related conditions.",
    dosing: "Weekly subcutaneous injection. Titrated from 2.5mg to target dose (up to 15mg) over 20+ weeks.",
    retailCost: "$1,023-$1,200+/month",
    vitalpathCost: "From $279/month",
    savings: "Up to 75%",
    mechanism: "Dual-action GLP-1/GIP receptor agonist. Targets two hormone pathways for potentially stronger appetite suppression and metabolic improvement.",
    weightLoss: "SURMOUNT clinical trials showed average weight loss of 20-22% of body weight at the highest dose over 72 weeks. One of the highest weight loss percentages seen in medication trials.",
    sideEffects: ["Nausea (31%)", "Diarrhea (23%)", "Decreased appetite (20%)", "Vomiting (12%)", "Constipation (11%)"],
    keyFacts: [
      "Dual-action mechanism (GLP-1 + GIP) — unique among weight loss medications",
      "Highest average weight loss in clinical trials of any medication",
      "Once-weekly injection",
      "Newer medication with growing real-world data",
      "May produce fewer GI side effects than semaglutide in some patients",
    ],
    comparisonSlug: "semaglutide-vs-tirzepatide",
  },
];
