// ABI definition for HealthRecords smart contract
export const HealthRecordsABI = {
  name: "HealthRecords",
  version: "1.0.0",
  functions: [
    {
      name: "init",
      args: [],
      returns: null,
      description: "Initialize the contract",
    },
    {
      name: "create_record",
      args: [
        { name: "patient_id", type: "string" },
        { name: "record_type", type: "string" },
        { name: "ipfs_cid", type: "string" },
        { name: "metadata", type: "object" },
      ],
      returns: { type: "string", description: "Record ID" },
      description: "Create a new health record",
    },
    {
      name: "get_record",
      args: [{ name: "record_id", type: "string" }],
      returns: {
        type: "object",
        fields: {
          id: "string",
          patient_id: "string",
          record_type: "string",
          ipfs_cid: "string",
          creator: "string",
          created_at: "number",
          metadata: "object",
        },
      },
      description: "Get a health record by ID",
    },
    {
      name: "list_patient_records",
      args: [
        { name: "patient_id", type: "string" },
        { name: "record_type", type: "string", optional: true },
      ],
      returns: { type: "array", items: "object" },
      description: "List all records for a patient",
    },
    {
      name: "grant_access",
      args: [
        { name: "grantee_id", type: "string" },
        { name: "record_types", type: "array" },
        { name: "expires_at", type: "number" },
        { name: "reason", type: "string", optional: true },
      ],
      returns: { type: "string", description: "Grant ID" },
      description: "Grant access to records (patient only)",
    },
    {
      name: "revoke_access",
      args: [{ name: "grant_id", type: "string" }],
      returns: null,
      description: "Revoke a previously granted access",
    },
    {
      name: "check_access",
      args: [
        { name: "accessor_id", type: "string" },
        { name: "patient_id", type: "string" },
        { name: "record_type", type: "string" },
      ],
      returns: { type: "boolean" },
      description: "Check if an accessor has permission to view records",
    },
    {
      name: "request_emergency_access",
      args: [
        { name: "patient_id", type: "string" },
        { name: "reason", type: "string" },
        { name: "urgency_level", type: "string" },
      ],
      returns: { type: "string", description: "Emergency access ID" },
      description: "Request emergency access (doctor/paramedic only)",
    },
    {
      name: "get_audit_log",
      args: [
        { name: "patient_id", type: "string" },
        { name: "limit", type: "number", optional: true },
        { name: "offset", type: "number", optional: true },
      ],
      returns: { type: "array", items: "object" },
      description: "Get audit log for a patient's records",
    },
  ],
  events: [
    {
      name: "record_created",
      fields: ["record_id", "patient_id", "record_type", "creator"],
    },
    {
      name: "access_granted",
      fields: ["grant_id", "patient_id", "grantee_id", "record_types", "expires_at"],
    },
    {
      name: "access_revoked",
      fields: ["grant_id", "patient_id", "grantee_id"],
    },
    {
      name: "record_accessed",
      fields: ["record_id", "accessor_id", "access_type"],
    },
    {
      name: "emergency_access_requested",
      fields: ["access_id", "patient_id", "requester_id", "urgency_level"],
    },
  ],
} as const;

// TypeScript types derived from ABI
export interface HealthRecord {
  id: string;
  patient_id: string;
  record_type: string;
  ipfs_cid: string;
  creator: string;
  created_at: number;
  metadata: Record<string, unknown>;
}

export interface AccessGrant {
  id: string;
  patient_id: string;
  grantee_id: string;
  record_types: string[];
  granted_at: number;
  expires_at: number;
  status: "active" | "expired" | "revoked";
  reason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  actor_id: string;
  patient_id: string;
  record_id?: string;
  details?: Record<string, unknown>;
  tx_hash: string;
}

export interface EmergencyAccess {
  id: string;
  patient_id: string;
  requester_id: string;
  reason: string;
  urgency_level: "critical" | "urgent" | "standard";
  granted_at: number;
  expires_at: number;
}
