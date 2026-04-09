/**
 * Pharmacy vendor abstraction layer.
 * Swap between 503A compounding, 503B outsourcing, and brand-medication pathways.
 */

export interface PharmacyOrder {
  id: string;
  patientId: string;
  prescriptionId: string;
  status: "received" | "processing" | "compounding" | "quality_check" | "shipped" | "delivered" | "canceled";
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface PharmacyMedication {
  name: string;
  dosage: string;
  frequency: string;
  source: "503a" | "503b" | "brand";
  ndc?: string;
}

export interface PharmacyProvider {
  submitPrescription(data: {
    patientId: string;
    prescriptionId: string;
    medication: PharmacyMedication;
    shippingAddress: {
      name: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
    };
  }): Promise<PharmacyOrder>;

  getOrderStatus(orderId: string): Promise<PharmacyOrder>;
  getTrackingInfo(orderId: string): Promise<{ trackingNumber: string; carrier: string; trackingUrl: string } | null>;
  requestRefill(orderId: string): Promise<PharmacyOrder>;
  cancelOrder(orderId: string): Promise<boolean>;
}

// ─── Generic pharmacy adapter ───────────────────────────────

class GenericPharmacyAdapter implements PharmacyProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.PHARMACY_API_KEY || "";
    this.baseUrl = process.env.PHARMACY_API_URL || "";
  }

  async submitPrescription(data: Parameters<PharmacyProvider["submitPrescription"]>[0]): Promise<PharmacyOrder> {
    if (!this.baseUrl) throw new Error("Pharmacy API URL not configured");

    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Pharmacy submitPrescription failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      id: result.id,
      patientId: data.patientId,
      prescriptionId: data.prescriptionId,
      status: "received",
    };
  }

  async getOrderStatus(orderId: string): Promise<PharmacyOrder> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    if (!response.ok) {
      throw new Error(`Pharmacy getOrderStatus failed: ${response.status}`);
    }

    return response.json();
  }

  async getTrackingInfo(orderId: string) {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/tracking`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    if (!response.ok) return null;
    return response.json();
  }

  async requestRefill(orderId: string): Promise<PharmacyOrder> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/refill`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    if (!response.ok) {
      throw new Error(`Pharmacy requestRefill failed: ${response.status}`);
    }

    return response.json();
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });

    return response.ok;
  }
}

// ─── Mock adapter for development ───────────────────────────

class MockPharmacyAdapter implements PharmacyProvider {
  async submitPrescription(data: Parameters<PharmacyProvider["submitPrescription"]>[0]): Promise<PharmacyOrder> {
    return {
      id: `mock_order_${Date.now()}`,
      patientId: data.patientId,
      prescriptionId: data.prescriptionId,
      status: "received",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
  }

  async getOrderStatus(orderId: string): Promise<PharmacyOrder> {
    return {
      id: orderId,
      patientId: "mock_patient",
      prescriptionId: "mock_rx",
      status: "shipped",
      trackingNumber: "1Z999AA10123456784",
      carrier: "UPS",
      shippedAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    };
  }

  async getTrackingInfo() {
    return {
      trackingNumber: "1Z999AA10123456784",
      carrier: "UPS",
      trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
    };
  }

  async requestRefill(): Promise<PharmacyOrder> {
    return {
      id: `mock_refill_${Date.now()}`,
      patientId: "mock_patient",
      prescriptionId: "mock_rx",
      status: "received",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };
  }

  async cancelOrder(): Promise<boolean> {
    return true;
  }
}

export function createPharmacyService(): PharmacyProvider {
  const vendor = process.env.PHARMACY_VENDOR || "mock";

  switch (vendor) {
    case "generic":
      return new GenericPharmacyAdapter();
    case "mock":
    default:
      return new MockPharmacyAdapter();
  }
}
