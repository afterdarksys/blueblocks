// ABI definition for Prescriptions smart contract
export const PrescriptionsABI = {
  name: "Prescriptions",
  version: "1.0.0",
  functions: [
    {
      name: "init",
      args: [],
      returns: null,
      description: "Initialize the contract",
    },
    {
      name: "create_prescription",
      args: [
        { name: "patient_id", type: "string" },
        { name: "medication", type: "object" },
        { name: "dosage", type: "string" },
        { name: "frequency", type: "string" },
        { name: "duration_days", type: "number" },
        { name: "refills", type: "number" },
        { name: "notes", type: "string", optional: true },
      ],
      returns: { type: "string", description: "Prescription ID" },
      description: "Create a new prescription (doctor only)",
    },
    {
      name: "get_prescription",
      args: [{ name: "prescription_id", type: "string" }],
      returns: { type: "object" },
      description: "Get prescription details",
    },
    {
      name: "list_patient_prescriptions",
      args: [
        { name: "patient_id", type: "string" },
        { name: "status", type: "string", optional: true },
      ],
      returns: { type: "array", items: "object" },
      description: "List prescriptions for a patient",
    },
    {
      name: "dispense",
      args: [
        { name: "prescription_id", type: "string" },
        { name: "quantity", type: "number" },
        { name: "pharmacy_id", type: "string" },
        { name: "notes", type: "string", optional: true },
      ],
      returns: { type: "string", description: "Dispense record ID" },
      description: "Record a dispense (pharmacist only)",
    },
    {
      name: "get_dispense_history",
      args: [{ name: "prescription_id", type: "string" }],
      returns: { type: "array", items: "object" },
      description: "Get dispense history for a prescription",
    },
    {
      name: "cancel_prescription",
      args: [
        { name: "prescription_id", type: "string" },
        { name: "reason", type: "string" },
      ],
      returns: null,
      description: "Cancel a prescription (prescriber only)",
    },
    {
      name: "verify_prescription",
      args: [{ name: "prescription_id", type: "string" }],
      returns: {
        type: "object",
        fields: {
          valid: "boolean",
          prescriber_verified: "boolean",
          not_expired: "boolean",
          refills_remaining: "number",
        },
      },
      description: "Verify prescription validity",
    },
  ],
  events: [
    {
      name: "prescription_created",
      fields: ["prescription_id", "patient_id", "prescriber_id", "medication"],
    },
    {
      name: "prescription_dispensed",
      fields: ["prescription_id", "dispense_id", "pharmacist_id", "quantity"],
    },
    {
      name: "prescription_cancelled",
      fields: ["prescription_id", "cancelled_by", "reason"],
    },
  ],
} as const;

// TypeScript types
export interface Medication {
  name: string;
  ndc_code?: string; // National Drug Code
  strength: string;
  form: "tablet" | "capsule" | "liquid" | "injection" | "topical" | "inhaler" | "other";
}

export interface Prescription {
  id: string;
  patient_id: string;
  prescriber_id: string;
  prescriber_name?: string;
  medication: Medication;
  dosage: string;
  frequency: string;
  duration_days: number;
  refills_total: number;
  refills_remaining: number;
  status: "active" | "completed" | "cancelled" | "expired";
  created_at: number;
  expires_at: number;
  notes?: string;
}

export interface DispenseRecord {
  id: string;
  prescription_id: string;
  pharmacist_id: string;
  pharmacy_id: string;
  pharmacy_name?: string;
  quantity: number;
  dispensed_at: number;
  notes?: string;
}
