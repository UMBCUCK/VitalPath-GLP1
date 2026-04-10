import { z } from "zod";

// ─── Quiz Schema ────────────────────────────────────────────

export const quizSchema = z.object({
  // Step 1: Goals
  weightRange: z.enum(["150-190", "191-230", "231-270", "271+"]),
  primaryGoal: z.enum(["weight-loss", "body-recomposition", "energy-metabolism", "maintenance", "guided-support"]),
  motivator: z.string().min(2, "Tell us a bit about what's motivating you"),

  // Step 2: Lifestyle
  eatingPattern: z.enum(["regular-meals", "irregular", "snack-heavy", "skip-meals", "emotional-eating"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active"]),
  previousAttempts: z.enum(["none", "diet-only", "otc-supplements", "rx-medication", "surgery"]),

  // Step 3: Support preferences
  wantsMealPlanning: z.boolean().default(false),
  wantsCoaching: z.boolean().default(false),
  wantsSupplements: z.boolean().default(false),
  wantsLabWork: z.boolean().default(false),

  // Step 4: Contact (soft lead capture)
  email: z.string().email("Please enter a valid email").optional(),
  firstName: z.string().min(1).optional(),
  state: z.string().min(2, "Select your state").optional(),
});

export type QuizValues = z.infer<typeof quizSchema>;

// ─── Intake Schema ──────────────────────────────────────────

export const intakeSchema = z.object({
  // Personal
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().min(8, "Date of birth is required"),
  state: z.string().min(2, "State is required"),

  // Physical
  heightFeet: z.number().min(3).max(8),
  heightInches: z.number().min(0).max(11),
  weightLbs: z.number().min(80).max(700),
  goalWeightLbs: z.number().min(80).max(700).optional(),

  // Medical
  medications: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().min(10, "Please provide your medical history"),
  conditions: z.array(z.string()).optional(),

  // Contraindications
  hasThyroidCancer: z.boolean().default(false),
  hasMEN2: z.boolean().default(false),
  isPregnant: z.boolean().default(false),
  hasPancreatitis: z.boolean().default(false),
  hasGastroparesis: z.boolean().default(false),
  hasDiabeticRetinopathy: z.boolean().default(false),
  hasGallbladderDisease: z.boolean().default(false),
  hasKidneyDisease: z.boolean().default(false),
  hasEatingDisorder: z.boolean().default(false),
  hasSuicidalIdeation: z.boolean().default(false),

  // Emergency contact
  emergencyContactName: z.string().min(2, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone is required"),
  emergencyContactRelation: z.string().min(2, "Emergency contact relationship is required"),

  // Medication preference
  medicationInterest: z.string().optional(),
  medicationInterestLabel: z.string().optional(),

  // Consent
  consentTreatment: z.boolean().refine((v) => v, "You must consent to proceed"),
  consentHipaa: z.boolean().refine((v) => v, "HIPAA consent is required"),
  consentTelehealth: z.boolean().refine((v) => v, "Telehealth consent is required"),
  consentMedicationRisks: z.boolean().refine((v) => v, "Medication risk acknowledgment is required"),
});

export type IntakeValues = z.infer<typeof intakeSchema>;

// ─── Lead Schema ────────────────────────────────────────────

export const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
  phone: z.string().max(20).optional(),
  source: z.string().max(80).optional(),
});

export type LeadValues = z.infer<typeof leadSchema>;

// ─── Plan Recommendation Engine ─────────────────────────────

export function recommendPlan(quiz: Partial<QuizValues>): "essential" | "premium" | "complete" {
  let score = 0;

  // Activity + eating patterns suggest more support needed
  if (quiz.activityLevel === "sedentary") score += 2;
  if (quiz.eatingPattern === "emotional-eating" || quiz.eatingPattern === "irregular") score += 2;
  if (quiz.previousAttempts === "rx-medication" || quiz.previousAttempts === "surgery") score += 1;

  // Support preferences
  if (quiz.wantsMealPlanning) score += 2;
  if (quiz.wantsCoaching) score += 2;
  if (quiz.wantsSupplements) score += 1;
  if (quiz.wantsLabWork) score += 1;

  // Goal complexity
  if (quiz.primaryGoal === "body-recomposition") score += 1;
  if (quiz.primaryGoal === "maintenance") score += 1;

  // Weight range
  if (quiz.weightRange === "271+") score += 1;

  if (score >= 7) return "complete";
  if (score >= 4) return "premium";
  return "essential";
}

// ─── Enhanced Plan Recommendation (Qualify Flow) ────────────

export interface QualifyRecommendInput {
  bmi?: number;
  activityLevel?: string;
  eatingPattern?: string;
  primaryGoal?: string;
  conditionsCount?: number;
  hasContraindication?: boolean;
}

export function recommendPlanFromQualify(input: QualifyRecommendInput): "essential" | "premium" | "complete" {
  let score = 0;

  // Activity + eating patterns
  if (input.activityLevel === "sedentary") score += 2;
  if (input.eatingPattern === "emotional-eating" || input.eatingPattern === "irregular") score += 2;

  // Goal complexity
  if (input.primaryGoal === "body-recomposition") score += 1;
  if (input.primaryGoal === "maintenance") score += 1;
  if (input.primaryGoal === "guided-support") score += 2;

  // BMI-based (higher BMI benefits from more comprehensive support)
  if (input.bmi && input.bmi >= 40) score += 2;
  else if (input.bmi && input.bmi >= 35) score += 1;

  // Medical complexity
  if (input.conditionsCount && input.conditionsCount >= 3) score += 1;
  if (input.hasContraindication) score += 1;

  if (score >= 7) return "complete";
  if (score >= 4) return "premium";
  return "essential";
}

// ─── Qualify Schema ─────────────────────────────────────────

export const qualifySchema = z.object({
  // Step 1: BMI
  heightFeet: z.number().min(3).max(8),
  heightInches: z.number().min(0).max(11),
  weightLbs: z.number().min(80).max(700),
  age: z.number().min(18).max(120),
  sex: z.enum(["male", "female"]),

  // Step 2: Goals
  primaryGoal: z.enum(["weight-loss", "body-recomposition", "energy-metabolism", "maintenance", "guided-support"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active"]),
  eatingPattern: z.enum(["regular-meals", "irregular", "snack-heavy", "skip-meals", "emotional-eating"]),

  // Step 3: Medical
  conditions: z.array(z.string()).optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),

  // Step 4: Contraindications
  hasThyroidCancer: z.boolean().default(false),
  hasMEN2: z.boolean().default(false),
  isPregnant: z.boolean().default(false),
  hasPancreatitis: z.boolean().default(false),
  hasGastroparesis: z.boolean().default(false),
  hasDiabeticRetinopathy: z.boolean().default(false),
  hasGallbladderDisease: z.boolean().default(false),
  hasKidneyDisease: z.boolean().default(false),
  hasEatingDisorder: z.boolean().default(false),
  hasSuicidalIdeation: z.boolean().default(false),

  // Step 6: Personal
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  dateOfBirth: z.string().min(8),
  state: z.string().min(2),
  emergencyContactName: z.string().min(2),
  emergencyContactPhone: z.string().min(10),
  emergencyContactRelation: z.string().min(2),
  goalWeightLbs: z.number().optional(),
  medicalHistory: z.string().min(10),

  // Step 7: Consent
  consentTreatment: z.boolean().refine((v) => v, "You must consent to proceed"),
  consentHipaa: z.boolean().refine((v) => v, "HIPAA consent is required"),
  consentTelehealth: z.boolean().refine((v) => v, "Telehealth consent is required"),
  consentMedicationRisks: z.boolean().refine((v) => v, "Medication risk acknowledgment is required"),

  // Enrichment (for analytics/patient profile)
  recommendedPlan: z.string().optional(),
});
