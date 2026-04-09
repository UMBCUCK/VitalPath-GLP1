/**
 * Weight loss projection algorithm based on GLP-1 clinical trial data.
 *
 * Sources:
 * - STEP 1-4 trials (semaglutide): ~15% total body weight loss over 68 weeks
 * - SURMOUNT 1-4 trials (tirzepatide): ~20% total body weight loss over 72 weeks
 *
 * The curve follows a logarithmic taper: rapid initial loss that decelerates over time.
 */

export interface ProjectionParams {
  currentWeight: number; // lbs
  heightInches: number; // total inches
  age: number;
  sex: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  goalWeight?: number; // optional user-specified goal
}

export interface MonthlyDataPoint {
  month: number;
  date: string; // "Jun 2026"
  medicationOnly: number; // projected weight (rounded to 1 decimal)
  withPlan: number; // projected weight with VitalPath plan
}

export interface Milestone {
  month: number;
  date: string;
  weightMedOnly: number;
  weightWithPlan: number;
  totalLostMedOnly: number;
  totalLostWithPlan: number;
}

export interface ProjectionSummary {
  totalLossMedOnly: number;
  totalLossWithPlan: number;
  extraLossFromPlan: number;
  timelineMonths: number;
  projectedWeightMedOnly: number;
  projectedWeightWithPlan: number;
  targetDate: string;
  bmi: number;
}

export interface ProjectionResult {
  monthlyData: MonthlyDataPoint[];
  milestones: Milestone[];
  summary: ProjectionSummary;
}

// ─── Modifiers ─────────────────────────────────────────────

const ACTIVITY_MODIFIERS: Record<string, number> = {
  sedentary: 1.0,
  light: 1.05,
  moderate: 1.1,
  active: 1.15,
};

function getAgeMod(age: number): number {
  if (age < 35) return 1.05;
  if (age <= 50) return 1.0;
  return 0.95;
}

function getSexMod(sex: "male" | "female"): number {
  return sex === "male" ? 1.05 : 1.0;
}

function formatMonthDate(monthsFromNow: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

// ─── Core Algorithm ────────────────────────────────────────

const DECAY_FACTOR = 0.92;
const MED_ONLY_BASE_RATE = 0.02; // 2% of body weight in month 1
const WITH_PLAN_BASE_RATE = 0.025; // 2.5% of body weight in month 1
const MED_ONLY_CAP = 0.15; // 15% total body weight cap
const WITH_PLAN_CAP = 0.20; // 20% total body weight cap
const MONTHS = 18;

export function generateProjection(params: ProjectionParams): ProjectionResult {
  const { currentWeight, heightInches, age, sex, activityLevel, goalWeight } = params;

  const activityMod = ACTIVITY_MODIFIERS[activityLevel] ?? 1.0;
  const ageMod = getAgeMod(age);
  const sexMod = getSexMod(sex);
  const combinedMod = activityMod * ageMod * sexMod;

  const maxLossMedOnly = currentWeight * MED_ONLY_CAP;
  const maxLossWithPlan = currentWeight * WITH_PLAN_CAP;

  const monthlyData: MonthlyDataPoint[] = [];
  let cumulativeMedOnly = 0;
  let cumulativeWithPlan = 0;
  let weightMedOnly = currentWeight;
  let weightWithPlan = currentWeight;

  // Month 0: starting point
  monthlyData.push({
    month: 0,
    date: formatMonthDate(0),
    medicationOnly: round1(currentWeight),
    withPlan: round1(currentWeight),
  });

  for (let m = 1; m <= MONTHS; m++) {
    // Medication only
    const monthlyLossMed = currentWeight * MED_ONLY_BASE_RATE * Math.pow(DECAY_FACTOR, m - 1) * combinedMod;
    if (cumulativeMedOnly + monthlyLossMed <= maxLossMedOnly) {
      cumulativeMedOnly += monthlyLossMed;
    } else {
      cumulativeMedOnly = maxLossMedOnly;
    }
    weightMedOnly = currentWeight - cumulativeMedOnly;

    // With VitalPath plan
    const monthlyLossPlan = currentWeight * WITH_PLAN_BASE_RATE * Math.pow(DECAY_FACTOR, m - 1) * combinedMod;
    if (cumulativeWithPlan + monthlyLossPlan <= maxLossWithPlan) {
      cumulativeWithPlan += monthlyLossPlan;
    } else {
      cumulativeWithPlan = maxLossWithPlan;
    }
    weightWithPlan = currentWeight - cumulativeWithPlan;

    monthlyData.push({
      month: m,
      date: formatMonthDate(m),
      medicationOnly: round1(weightMedOnly),
      withPlan: round1(weightWithPlan),
    });
  }

  // Milestones at months 3, 6, 12
  const milestoneMonths = [3, 6, 12];
  const milestones: Milestone[] = milestoneMonths.map((m) => {
    const dp = monthlyData[m];
    return {
      month: m,
      date: dp.date,
      weightMedOnly: dp.medicationOnly,
      weightWithPlan: dp.withPlan,
      totalLostMedOnly: round1(currentWeight - dp.medicationOnly),
      totalLostWithPlan: round1(currentWeight - dp.withPlan),
    };
  });

  // Find timeline: month where with-plan curve reaches goal or plateaus
  const finalMedOnly = monthlyData[MONTHS].medicationOnly;
  const finalWithPlan = monthlyData[MONTHS].withPlan;
  let timelineMonths = MONTHS;

  if (goalWeight && goalWeight < currentWeight) {
    // Find month closest to goal weight
    for (let i = 1; i <= MONTHS; i++) {
      if (monthlyData[i].withPlan <= goalWeight) {
        timelineMonths = i;
        break;
      }
    }
  } else {
    // Find month where loss rate drops below 0.5 lbs/month (plateau)
    for (let i = 2; i <= MONTHS; i++) {
      const delta = monthlyData[i - 1].withPlan - monthlyData[i].withPlan;
      if (delta < 0.5) {
        timelineMonths = i;
        break;
      }
    }
  }

  const bmi = (currentWeight / (heightInches * heightInches)) * 703;

  const summary: ProjectionSummary = {
    totalLossMedOnly: round1(currentWeight - finalMedOnly),
    totalLossWithPlan: round1(currentWeight - finalWithPlan),
    extraLossFromPlan: round1((currentWeight - finalWithPlan) - (currentWeight - finalMedOnly)),
    timelineMonths,
    projectedWeightMedOnly: finalMedOnly,
    projectedWeightWithPlan: finalWithPlan,
    targetDate: formatMonthDate(timelineMonths),
    bmi: round1(bmi),
  };

  return { monthlyData, milestones, summary };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
