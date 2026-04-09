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

  // Consent
  consentTreatment: z.boolean().refine((v) => v, "You must consent to proceed"),
  consentHipaa: z.boolean().refine((v) => v, "HIPAA consent is required"),
  consentTelehealth: z.boolean().refine((v) => v, "Telehealth consent is required"),
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
