/**
 * Telehealth vendor abstraction layer.
 * Swap providers (OpenLoop, Wheel, custom) without touching business logic.
 */

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
}

// ─── OpenLoop adapter ───────────────────────────────────────

class OpenLoopAdapter implements TelehealthProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.TELEHEALTH_API_KEY || "";
    this.baseUrl = process.env.TELEHEALTH_API_URL || "https://api.openloophealth.com/v1";
  }

  async createPatient(data: Parameters<TelehealthProvider["createPatient"]>[0]): Promise<TelehealthPatient> {
    const response = await fetch(`${this.baseUrl}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
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
    const response = await fetch(`${this.baseUrl}/consultations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ patient_id: patientId, reason }),
    });

    if (!response.ok) {
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
    const response = await fetch(`${this.baseUrl}/consultations/${consultationId}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
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
    const response = await fetch(`${this.baseUrl}/consultations/${consultationId}/decision`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
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
    const response = await fetch(`${this.baseUrl}/consultations/${consultationId}/prescription`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
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
}

// ─── Mock adapter for development ───────────────────────────

class MockTelehealthAdapter implements TelehealthProvider {
  async createPatient(data: Parameters<TelehealthProvider["createPatient"]>[0]): Promise<TelehealthPatient> {
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
