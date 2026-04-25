/**
 * Telehealth vendor abstraction layer.
 * Swap providers (OpenLoop, Wheel, custom) without touching business logic.
 */

import { safeError, safeLog } from "@/lib/logger";

export interface TelehealthPatient {
  id: string;
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  state: string;
}

export interface TelehealthConsultation {
  id: string;
  patientId: string;
  providerId?: string;
  status: "pending" | "scheduled" | "in_progress" | "completed" | "canceled";
  scheduledAt?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface EligibilityDecision {
  eligible: boolean;
  reason?: string;
  alternativePath?: boolean;
  providerId?: string;
  notes?: string;
}

export interface TelehealthPrescription {
  id: string;
  consultationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  pharmacyRefId?: string;
  prescribedAt: Date;
}

export interface TelehealthProvider {
  createPatient(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth: string;
    state: string;
    medicalHistory: Record<string, unknown>;
  }): Promise<TelehealthPatient>;

  requestConsultation(patientId: string, reason: string): Promise<TelehealthConsultation>;
  getConsultationStatus(consultationId: string): Promise<TelehealthConsultation>;
  getEligibilityDecision(consultationId: string): Promise<EligibilityDecision>;
  getPrescription(consultationId: string): Promise<TelehealthPrescription | null>;

  /**
   * Tier 12.3 — File an adverse-event report with the prescribing
   * provider's pharmacovigilance system. Required for FDA MedWatch
   * compliance when an adverse event is reported by the patient.
   *
   * Returns the provider-side reference ID so we can stamp it on the
   * local AdverseEventReport row for two-way traceability.
   */
  reportAdverseEvent(data: {
    patientExternalId: string;
    severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING";
    description: string;
    medicationName?: string;
    onsetDate?: Date;
    actionTaken?: string;
  }): Promise<{ id: string }>;

  /**
   * Tier 13.1 — Look up a patient by email address. Returns null when no
   * matching patient exists in the telehealth provider's system. Used by
   * the OpenLoop-aware login flow to verify that a magic-link request
   * comes from a real patient before sending the email.
   */
  findPatientByEmail(email: string): Promise<TelehealthPatient | null>;

  /**
   * Tier 13.1 — Fetch a patient by their telehealth-provider-side id
   * (e.g. PatientProfile.telehealthPatientId). Used to hydrate the
   * dashboard with real-time consultation + prescription status.
   */
  getPatient(patientExternalId: string): Promise<TelehealthPatient | null>;
}

// ─── Retry helper ──────────────────────────────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2,
  backoffMs = 1000
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, options);

    // Don't retry client errors (4xx)
    if (response.ok || (response.status >= 400 && response.status < 500)) {
      return response;
    }

    // Retry on server errors (5xx) with exponential backoff
    if (attempt < retries) {
      safeLog("[Telehealth]", `Retry ${attempt + 1}/${retries} for ${url} (status ${response.status})`);
      await new Promise((r) => setTimeout(r, backoffMs * Math.pow(2, attempt)));
    } else {
      return response;
    }
  }
  throw new Error("Unreachable");
}

// ─── Shared OpenLoop helpers ────────────────────────────────

/**
 * Tier 13.1 — Normalize OpenLoop's variable patient JSON shape into our
 * TelehealthPatient interface. OpenLoop responses vary slightly between
 * endpoints (snake_case fields, nested vs flat phone, etc.) — this keeps
 * the noise contained in one place.
 */
function mapOpenLoopPatient(raw: Record<string, unknown>): TelehealthPatient {
  const get = (k: string): string | undefined => {
    const v = raw[k];
    return typeof v === "string" ? v : undefined;
  };
  return {
    id: String(raw.id ?? raw.patient_id ?? raw.uuid ?? ""),
    externalId: String(
      raw.external_id ?? raw.id ?? raw.patient_id ?? raw.uuid ?? "",
    ),
    firstName: get("first_name") ?? get("firstName") ?? "",
    lastName: get("last_name") ?? get("lastName") ?? "",
    email: get("email") ?? "",
    phone: get("phone") ?? get("phone_number"),
    dateOfBirth: get("date_of_birth") ?? get("dateOfBirth") ?? "",
    state: get("state") ?? "",
  };
}

// ─── OpenLoop adapter ───────────────────────────────────────

class OpenLoopAdapter implements TelehealthProvider {
  private apiKey: string;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.apiKey = process.env.TELEHEALTH_API_KEY || "";
    this.baseUrl = process.env.TELEHEALTH_API_URL || "https://api.openloophealth.com/v1";
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async createPatient(data: Parameters<TelehealthProvider["createPatient"]>[0]): Promise<TelehealthPatient> {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      date_of_birth: data.dateOfBirth,
      state: data.state,
      medical_history: {
        medications: data.medicalHistory.medications,
        allergies: data.medicalHistory.allergies,
        conditions: data.medicalHistory.conditions,
        history: data.medicalHistory.history,
      },
    };

    const response = await fetchWithRetry(`${this.baseUrl}/patients`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      safeError("[OpenLoop]", `createPatient failed: ${response.status} ${errorBody}`);
      throw new Error(`OpenLoop createPatient failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      externalId: result.external_id || result.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      state: data.state,
    };
  }

  async requestConsultation(patientId: string, reason: string): Promise<TelehealthConsultation> {
    const payload = {
      patient_id: patientId,
      reason,
      type: "async", // Asynchronous review (no live video needed)
      priority: "standard",
    };

    const response = await fetchWithRetry(`${this.baseUrl}/consultations`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      safeError("[OpenLoop]", `requestConsultation failed: ${response.status} ${errorBody}`);
      throw new Error(`OpenLoop requestConsultation failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      patientId,
      status: "pending",
    };
  }

  async getConsultationStatus(consultationId: string): Promise<TelehealthConsultation> {
    const response = await fetchWithRetry(`${this.baseUrl}/consultations/${consultationId}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`OpenLoop getConsultationStatus failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      patientId: result.patient_id,
      providerId: result.provider_id,
      status: result.status,
      scheduledAt: result.scheduled_at ? new Date(result.scheduled_at) : undefined,
      completedAt: result.completed_at ? new Date(result.completed_at) : undefined,
      notes: result.notes,
    };
  }

  async getEligibilityDecision(consultationId: string): Promise<EligibilityDecision> {
    const response = await fetchWithRetry(`${this.baseUrl}/consultations/${consultationId}/decision`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`OpenLoop getEligibilityDecision failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      eligible: result.eligible,
      reason: result.reason,
      alternativePath: result.alternative_path,
      providerId: result.provider_id,
      notes: result.notes,
    };
  }

  async getPrescription(consultationId: string): Promise<TelehealthPrescription | null> {
    const response = await fetchWithRetry(`${this.baseUrl}/consultations/${consultationId}/prescription`, {
      headers: this.headers,
    });

    if (!response.ok) return null;

    const result = await response.json();
    if (!result.id) return null;

    return {
      id: result.id,
      consultationId,
      medicationName: result.medication_name,
      dosage: result.dosage,
      frequency: result.frequency,
      pharmacyRefId: result.pharmacy_ref_id,
      prescribedAt: new Date(result.prescribed_at),
    };
  }

  // Tier 13.1 — Patient lookup by email (used by OpenLoop magic-link login)
  async findPatientByEmail(email: string): Promise<TelehealthPatient | null> {
    const url = new URL(`${this.baseUrl}/patients`);
    url.searchParams.set("email", email);
    const response = await fetchWithRetry(url.toString(), {
      method: "GET",
      headers: this.headers,
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      safeError("[OpenLoop]", `findPatientByEmail failed: ${response.status}`);
      // Return null on hard failure so the login flow can fall back to
      // local-only auth without leaking the API outage to the user.
      return null;
    }
    const result = (await response.json()) as {
      patients?: Array<Record<string, unknown>>;
      data?: Record<string, unknown>;
    };
    // OpenLoop endpoints variously return { patients: [...] } or { data: {...} }
    const raw =
      Array.isArray(result.patients) && result.patients.length > 0
        ? result.patients[0]
        : result.data;
    if (!raw || typeof raw !== "object") return null;
    return mapOpenLoopPatient(raw);
  }

  // Tier 13.1 — Get a single patient by their OpenLoop ID
  async getPatient(patientExternalId: string): Promise<TelehealthPatient | null> {
    const response = await fetchWithRetry(
      `${this.baseUrl}/patients/${encodeURIComponent(patientExternalId)}`,
      { method: "GET", headers: this.headers },
    );
    if (response.status === 404) return null;
    if (!response.ok) {
      safeError("[OpenLoop]", `getPatient failed: ${response.status}`);
      return null;
    }
    const raw = (await response.json()) as Record<string, unknown>;
    return mapOpenLoopPatient(raw);
  }

  // Tier 12.3 — File adverse event with OpenLoop's pharmacovigilance API
  async reportAdverseEvent(
    data: Parameters<TelehealthProvider["reportAdverseEvent"]>[0],
  ): Promise<{ id: string }> {
    const payload = {
      patient_external_id: data.patientExternalId,
      severity: data.severity,
      description: data.description,
      medication_name: data.medicationName,
      onset_date: data.onsetDate?.toISOString(),
      action_taken: data.actionTaken,
    };
    const response = await fetchWithRetry(`${this.baseUrl}/adverse-events`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      safeError("[OpenLoop]", `reportAdverseEvent failed: ${response.status} ${errorBody}`);
      throw new Error(`OpenLoop reportAdverseEvent failed: ${response.status}`);
    }
    const result = (await response.json()) as { id: string };
    return { id: result.id };
  }
}

// ─── Mock adapter for development ───────────────────────────

class MockTelehealthAdapter implements TelehealthProvider {
  async createPatient(data: Parameters<TelehealthProvider["createPatient"]>[0]): Promise<TelehealthPatient> {
    safeLog("[Telehealth Mock]", `createPatient: ${data.firstName} ${data.lastName}`);
    return {
      id: `mock_patient_${Date.now()}`,
      externalId: `mock_ext_${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      state: data.state,
    };
  }

  async requestConsultation(patientId: string): Promise<TelehealthConsultation> {
    safeLog("[Telehealth Mock]", `requestConsultation for patient ${patientId}`);
    return {
      id: `mock_consult_${Date.now()}`,
      patientId,
      status: "pending",
    };
  }

  async getConsultationStatus(consultationId: string): Promise<TelehealthConsultation> {
    return {
      id: consultationId,
      patientId: "mock_patient",
      status: "completed",
      completedAt: new Date(),
    };
  }

  async getEligibilityDecision(): Promise<EligibilityDecision> {
    return { eligible: true, reason: "Mock: all patients eligible in dev mode" };
  }

  async getPrescription(consultationId: string): Promise<TelehealthPrescription> {
    return {
      id: `mock_rx_${Date.now()}`,
      consultationId,
      medicationName: "Compounded Semaglutide",
      dosage: "0.25mg",
      frequency: "Weekly",
      prescribedAt: new Date(),
    };
  }

  async reportAdverseEvent(
    data: Parameters<TelehealthProvider["reportAdverseEvent"]>[0],
  ): Promise<{ id: string }> {
    safeLog("[Telehealth Mock]", `reportAdverseEvent: ${data.severity} for ${data.patientExternalId}`);
    return { id: `mock_ae_${Date.now()}` };
  }

  // Tier 13.1 — Mock patient lookup. In dev, only seeded demo accounts
  // resolve (jordan@example.com / admin@naturesjourneyhealth.com per CLAUDE.md).
  async findPatientByEmail(email: string): Promise<TelehealthPatient | null> {
    safeLog("[Telehealth Mock]", `findPatientByEmail: ${email}`);
    const normalized = email.toLowerCase().trim();
    if (
      normalized === "jordan@example.com" ||
      normalized === "admin@naturesjourneyhealth.com"
    ) {
      return {
        id: `mock_patient_${normalized}`,
        externalId: `mock_ext_${normalized}`,
        firstName: normalized.split("@")[0],
        lastName: "Demo",
        email: normalized,
        dateOfBirth: "1990-01-01",
        state: "CA",
      };
    }
    return null;
  }

  async getPatient(patientExternalId: string): Promise<TelehealthPatient | null> {
    safeLog("[Telehealth Mock]", `getPatient: ${patientExternalId}`);
    return {
      id: patientExternalId,
      externalId: patientExternalId,
      firstName: "Mock",
      lastName: "Patient",
      email: "mock@example.com",
      dateOfBirth: "1990-01-01",
      state: "CA",
    };
  }
}

// ─── Factory ────────────────────────────────────────────────

export function createTelehealthService(): TelehealthProvider {
  const vendor = process.env.TELEHEALTH_VENDOR || "mock";

  switch (vendor) {
    case "openloop":
      return new OpenLoopAdapter();
    case "mock":
    default:
      return new MockTelehealthAdapter();
  }
}
