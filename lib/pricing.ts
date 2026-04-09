export interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number; // cents
  priceQuarterly?: number;
  priceAnnual?: number;
  stripePriceId: string;
  badge?: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  description: string;
  iconName: string;
  category: string;
}

export const plans: PricingPlan[] = [
  {
    id: "essential",
    name: "Essential",
    slug: "essential",
    priceMonthly: 27900, // $279 (charm pricing — left-digit bias)
    priceAnnual: 267840, // $2,678.40 ($223.20/mo — 20% off)
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ESSENTIAL_PRICE_ID || "price_essential_monthly",
    description: "Provider-guided treatment with medication, if prescribed, plus clinical support.",
    features: [
      "Licensed provider evaluation",
      "Personalized treatment plan",
      "Medication, if prescribed",
      "24-48 hour pharmacy shipping",
      "Secure messaging with care team",
      "Monthly check-ins",
      "Basic progress tracking",
      "Refill coordination",
    ],
    highlighted: false,
  },
  {
    id: "premium",
    name: "Premium",
    slug: "premium",
    priceMonthly: 37900, // $379 (charm pricing — left-digit bias)
    priceAnnual: 363840, // $3,638.40 ($303.20/mo — 20% off)
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || "price_premium_monthly",
    badge: "Most Popular",
    description: "Everything in Essential plus nutrition tools, tracking, and coaching check-ins.",
    features: [
      "Everything in Essential",
      "Weekly meal plans & recipes",
      "Grocery list generator",
      "Progress photo vault",
      "Body measurement tracking",
      "Bi-weekly coaching check-ins",
      "Hydration & protein tracking",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "complete",
    name: "Complete",
    slug: "complete",
    priceMonthly: 59900, // $599 (widened gap — decoy effect makes Premium the obvious choice)
    priceAnnual: 575040, // $5,750.40 ($479.20/mo — 20% off)
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_COMPLETE_PRICE_ID || "price_complete_monthly",
    badge: "Best Results",
    description: "The full system: treatment, nutrition, supplements, coaching, and all premium tools.",
    features: [
      "Everything in Premium",
      "Metabolic support supplement bundle",
      "Protein & hydration bundle",
      "Digestive comfort support",
      "Weekly coaching sessions",
      "Personalized recipe recommendations",
      "Lab work coordination",
      "Maintenance transition planning",
    ],
    highlighted: false,
  },
];

export const addOns: AddOn[] = [
  {
    id: "metabolic-support",
    name: "Metabolic Support Bundle",
    slug: "metabolic-support",
    priceMonthly: 3900,
    description: "Targeted nutritional support for metabolic wellness during your program.",
    iconName: "Flame",
    category: "supplements",
  },
  {
    id: "protein-hydration",
    name: "Protein & Hydration Bundle",
    slug: "protein-hydration",
    priceMonthly: 3400,
    description: "Premium protein and electrolyte support to complement your treatment plan.",
    iconName: "Droplets",
    category: "supplements",
  },
  {
    id: "digestive-comfort",
    name: "Digestive Comfort Bundle",
    slug: "digestive-comfort",
    priceMonthly: 2900,
    description: "Gentle digestive support designed for patients on GLP-1 medication regimens.",
    iconName: "Leaf",
    category: "supplements",
  },
  {
    id: "meal-plan-subscription",
    name: "Meal Plans & Recipes",
    slug: "meal-plans",
    priceMonthly: 1900,
    description: "Weekly meal plans, high-protein recipes, and grocery lists tailored to your goals.",
    iconName: "ChefHat",
    category: "nutrition",
  },
  {
    id: "coaching-upgrade",
    name: "Premium Coaching",
    slug: "coaching-upgrade",
    priceMonthly: 4900,
    description: "Weekly 1-on-1 coaching sessions with a certified health coach.",
    iconName: "Users",
    category: "coaching",
  },
  {
    id: "lab-membership",
    name: "Lab Membership",
    slug: "lab-membership",
    priceMonthly: 2900,
    description: "Quarterly metabolic panels and biomarker tracking to inform your treatment plan.",
    iconName: "TestTube",
    category: "labs",
  },
];

export function calculateSavings(plan: PricingPlan, interval: "monthly" | "quarterly" | "annual"): number {
  const monthlyTotal = plan.priceMonthly * (interval === "quarterly" ? 3 : interval === "annual" ? 12 : 1);
  const actualPrice = interval === "quarterly" && plan.priceQuarterly
    ? plan.priceQuarterly
    : interval === "annual" && plan.priceAnnual
      ? plan.priceAnnual
      : monthlyTotal;
  return monthlyTotal - actualPrice;
}
