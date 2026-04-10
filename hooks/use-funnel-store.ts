"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "nj-funnel";

export interface QualifyFlowState {
  currentStep?: number;
  // Step 1: BMI
  heightFeet?: number;
  heightInches?: number;
  weightLbs?: number;
  age?: number;
  sex?: "male" | "female";
  bmi?: number;
  // Step 2: Goals
  primaryGoal?: string;
  activityLevel?: string;
  eatingPattern?: string;
  // Step 3: Medical
  conditions?: string[];
  medications?: string;
  allergies?: string;
  // Step 4: Contraindications
  hasThyroidCancer?: boolean;
  hasMEN2?: boolean;
  isPregnant?: boolean;
  hasPancreatitis?: boolean;
  hasGastroparesis?: boolean;
  hasDiabeticRetinopathy?: boolean;
  hasGallbladderDisease?: boolean;
  hasKidneyDisease?: boolean;
  hasEatingDisorder?: boolean;
  hasSuicidalIdeation?: boolean;
  // Step 5: projection shown (no user data)
  projectionShown?: boolean;
  // Step 6: Personal info
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  state?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  // Step 7: Consent
  consentTreatment?: boolean;
  consentHipaa?: boolean;
  consentTelehealth?: boolean;
  consentMedicationRisks?: boolean;
  selectedPlan?: string;
  // Medical history (free text)
  medicalHistory?: string;
  goalWeightLbs?: number;
}

export interface FunnelState {
  quiz?: Record<string, unknown>;
  intake?: Record<string, unknown>;
  recommendedPlan?: string;
  email?: string;
  step?: string;
  qualify?: QualifyFlowState;
  referralCode?: string;
}

export function useFunnelStore() {
  const [state, setState] = useState<FunnelState>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setState(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const update = useCallback((partial: Partial<FunnelState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setState({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { state, update, clear };
}
