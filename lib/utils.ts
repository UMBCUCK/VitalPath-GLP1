import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatPriceDecimal(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function calculateBMI(weightLbs: number, heightInches: number): number {
  return (weightLbs / (heightInches * heightInches)) * 703;
}

export function bmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obesity Class I";
  if (bmi < 40) return "Obesity Class II";
  return "Obesity Class III";
}

export function calculateTDEE(
  weightLbs: number,
  heightInches: number,
  age: number,
  sex: "male" | "female",
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
): number {
  const weightKg = weightLbs * 0.453592;
  const heightCm = heightInches * 2.54;

  // Mifflin-St Jeor
  let bmr: number;
  if (sex === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * multipliers[activityLevel]);
}

export function calculateProtein(
  weightLbs: number,
  activityLevel: "low" | "moderate" | "high",
  goal: "maintain" | "lose" | "gain"
): { min: number; max: number } {
  const multipliers = {
    low: { maintain: { min: 0.6, max: 0.8 }, lose: { min: 0.8, max: 1.0 }, gain: { min: 0.8, max: 1.0 } },
    moderate: { maintain: { min: 0.8, max: 1.0 }, lose: { min: 1.0, max: 1.2 }, gain: { min: 1.0, max: 1.2 } },
    high: { maintain: { min: 1.0, max: 1.2 }, lose: { min: 1.2, max: 1.4 }, gain: { min: 1.2, max: 1.6 } },
  };
  const m = multipliers[activityLevel][goal];
  return {
    min: Math.round(weightLbs * m.min),
    max: Math.round(weightLbs * m.max),
  };
}

export function calculateHydration(
  weightLbs: number,
  activityLevel: "low" | "moderate" | "high"
): number {
  const base = weightLbs * 0.5; // oz
  const additions = { low: 0, moderate: 16, high: 32 };
  return Math.round(base + additions[activityLevel]);
}

export function calculateMacros(
  calories: number,
  goal: "lose" | "maintain" | "gain"
): { protein: { grams: number; pct: number }; carbs: { grams: number; pct: number }; fat: { grams: number; pct: number } } {
  const splits = {
    lose: { protein: 0.4, carbs: 0.3, fat: 0.3 },
    maintain: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    gain: { protein: 0.25, carbs: 0.45, fat: 0.3 },
  };
  const s = splits[goal];
  return {
    protein: { grams: Math.round((calories * s.protein) / 4), pct: s.protein * 100 },
    carbs: { grams: Math.round((calories * s.carbs) / 4), pct: s.carbs * 100 },
    fat: { grams: Math.round((calories * s.fat) / 9), pct: s.fat * 100 },
  };
}

export function generateDietAloneProjection(
  currentWeight: number,
  months: number
): number[] {
  // Conservative model: 0.5% body weight/month, decaying, capped at 8%
  const maxLoss = currentWeight * 0.08;
  const baseRate = 0.005;
  const decay = 0.95;
  const weights: number[] = [currentWeight];
  let cumLoss = 0;

  for (let m = 1; m <= months; m++) {
    const loss = currentWeight * baseRate * Math.pow(decay, m - 1);
    cumLoss = Math.min(cumLoss + loss, maxLoss);
    weights.push(Math.round((currentWeight - cumLoss) * 10) / 10);
  }
  return weights;
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  return `${base}${path}`;
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
