import { NextRequest, NextResponse } from "next/server";
import { intakeSchema } from "@/lib/funnel";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTelehealthService } from "@/lib/services/telehealth";
import { createEmailService, emailTemplates } from "@/lib/services/email";
import { trackServerEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = intakeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const session = await getSession();

    // Create or find user
    let userId = session?.userId;

    if (!userId) {
      const existing = await db.user.findUnique({ where: { email: data.email } });
      if (existing) {
        userId = existing.id;
      } else {
        const newUser = await db.user.create({
          data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
        });
        userId = newUser.id;
      }
    }

    // Create intake submission
    const intake = await db.intakeSubmission.upsert({
      where: { userId },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        state: data.state,
        heightFeet: data.heightFeet,
        heightInches: data.heightInches,
        weightLbs: data.weightLbs,
        goalWeightLbs: data.goalWeightLbs,
        medications: data.medications,
        allergies: data.allergies,
        medicalHistory: data.medicalHistory,
        conditions: data.conditions || [],
        consentGiven: data.consentTreatment,
        hipaaConsent: data.consentHipaa,
        status: "SUBMITTED",
        eligibilityResult: (data.hasThyroidCancer || data.hasMEN2 || data.isPregnant || data.hasPancreatitis)
          ? "ALTERNATIVE_PATH"
          : "PENDING_REVIEW",
      },
      create: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        state: data.state,
        heightFeet: data.heightFeet,
        heightInches: data.heightInches,
        weightLbs: data.weightLbs,
        goalWeightLbs: data.goalWeightLbs,
        medications: data.medications,
        allergies: data.allergies,
        medicalHistory: data.medicalHistory,
        conditions: data.conditions || [],
        consentGiven: data.consentTreatment,
        hipaaConsent: data.consentHipaa,
        status: "SUBMITTED",
        eligibilityResult: (data.hasThyroidCancer || data.hasMEN2 || data.isPregnant || data.hasPancreatitis)
          ? "ALTERNATIVE_PATH"
          : "PENDING_REVIEW",
      },
    });

    // Update patient profile
    await db.patientProfile.upsert({
      where: { userId },
      update: {
        heightInches: data.heightFeet * 12 + data.heightInches,
        weightLbs: data.weightLbs,
        goalWeightLbs: data.goalWeightLbs,
        state: data.state,
        medications: data.medications,
        allergies: data.allergies,
        medicalHistory: data.medicalHistory,
        contraindications: data.hasThyroidCancer || data.hasMEN2 || data.isPregnant || data.hasPancreatitis,
      },
      create: {
        userId,
        heightInches: data.heightFeet * 12 + data.heightInches,
        weightLbs: data.weightLbs,
        goalWeightLbs: data.goalWeightLbs,
        state: data.state,
        medications: data.medications,
        allergies: data.allergies,
        medicalHistory: data.medicalHistory,
        contraindications: data.hasThyroidCancer || data.hasMEN2 || data.isPregnant || data.hasPancreatitis,
      },
    });

    // Trigger telehealth service
    const telehealth = createTelehealthService();
    try {
      const patient = await telehealth.createPatient({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        state: data.state,
        medicalHistory: {
          medications: data.medications,
          allergies: data.allergies,
          conditions: data.conditions,
          history: data.medicalHistory,
        },
      });

      await db.intakeSubmission.update({
        where: { id: intake.id },
        data: { telehealthReferralId: patient.externalId },
      });

      await telehealth.requestConsultation(patient.id, "GLP-1 weight management evaluation");
    } catch (err) {
      console.error("[Intake] Telehealth service error:", err);
    }

    // Send welcome email
    const emailService = createEmailService();
    try {
      const template = emailTemplates.welcome(data.firstName);
      await emailService.send({ to: data.email, ...template });
    } catch (err) {
      console.error("[Intake] Email send error:", err);
    }

    await trackServerEvent("SubmitIntake", { email: data.email }, { state: data.state });

    return NextResponse.json({ ok: true, intakeId: intake.id });
  } catch (error) {
    console.error("[Intake API]", error);
    return NextResponse.json({ error: "Intake submission failed" }, { status: 500 });
  }
}
