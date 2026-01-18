export type UserRole = "patient" | "doctor" | "pharmacist" | "paramedic" | "admin";

export interface User {
  id: string;
  address: string;
  role: UserRole;
  name?: string;
  email?: string;
  credentials?: {
    licenseNumber?: string;
    licenseState?: string;
    licenseExpiry?: number;
    npiNumber?: string;
    deaNumber?: string;
    facilityId?: string;
  };
  verified: boolean;
  createdAt: number;
  lastLogin?: number;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface Permission {
  action: string;
  resource: string;
  conditions?: Record<string, unknown>;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Resource types for RBAC
export type ResourceType =
  | "health_record"
  | "prescription"
  | "lab_result"
  | "diagnosis"
  | "imaging"
  | "vitals"
  | "audit_log"
  | "access_grant"
  | "patient_list"
  | "dispense_log";

// Action types for RBAC
export type ActionType =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "share"
  | "grant_access"
  | "revoke_access"
  | "emergency_access"
  | "dispense"
  | "prescribe";

// Role-specific feature flags
export interface RoleFeatures {
  canViewOwnRecords: boolean;
  canViewPatientRecords: boolean;
  canCreateRecords: boolean;
  canGrantAccess: boolean;
  canRequestAccess: boolean;
  canPrescribe: boolean;
  canDispense: boolean;
  canEmergencyAccess: boolean;
  canViewAuditLogs: boolean;
  canManagePatients: boolean;
}
