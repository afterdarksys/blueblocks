// ABIs
export { HealthRecordsABI } from "./abis/HealthRecords";
export type {
  HealthRecord,
  AccessGrant,
  AuditLogEntry,
  EmergencyAccess,
} from "./abis/HealthRecords";

export { PrescriptionsABI } from "./abis/Prescriptions";
export type { Medication, Prescription, DispenseRecord } from "./abis/Prescriptions";

// Hooks
export { useHealthRecords, usePatientRecords } from "./hooks/useHealthRecords";
export { usePrescriptions, useDispenseWorkflow } from "./hooks/usePrescriptions";

// Contract addresses (to be configured per environment)
export const CONTRACT_ADDRESSES = {
  mainnet: {
    healthRecords: "",
    prescriptions: "",
  },
  testnet: {
    healthRecords: "",
    prescriptions: "",
  },
  devnet: {
    healthRecords: "",
    prescriptions: "",
  },
} as const;
