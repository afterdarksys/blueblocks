import type { UserRole, Permission, RoleFeatures, ResourceType, ActionType } from "./types";

// Define permissions for each role
export const rolePermissions: Record<UserRole, Permission[]> = {
  patient: [
    { action: "read", resource: "health_record", conditions: { owner: "self" } },
    { action: "read", resource: "prescription", conditions: { owner: "self" } },
    { action: "read", resource: "lab_result", conditions: { owner: "self" } },
    { action: "read", resource: "diagnosis", conditions: { owner: "self" } },
    { action: "read", resource: "imaging", conditions: { owner: "self" } },
    { action: "read", resource: "vitals", conditions: { owner: "self" } },
    { action: "read", resource: "audit_log", conditions: { owner: "self" } },
    { action: "create", resource: "health_record", conditions: { type: "self_reported" } },
    { action: "create", resource: "vitals", conditions: { owner: "self" } },
    { action: "grant_access", resource: "access_grant" },
    { action: "revoke_access", resource: "access_grant" },
    { action: "share", resource: "health_record", conditions: { owner: "self" } },
  ],

  doctor: [
    { action: "read", resource: "health_record", conditions: { hasAccess: true } },
    { action: "read", resource: "prescription", conditions: { hasAccess: true } },
    { action: "read", resource: "lab_result", conditions: { hasAccess: true } },
    { action: "read", resource: "diagnosis", conditions: { hasAccess: true } },
    { action: "read", resource: "imaging", conditions: { hasAccess: true } },
    { action: "read", resource: "vitals", conditions: { hasAccess: true } },
    { action: "read", resource: "audit_log", conditions: { relatedPatients: true } },
    { action: "read", resource: "patient_list" },
    { action: "create", resource: "health_record" },
    { action: "create", resource: "diagnosis" },
    { action: "create", resource: "vitals" },
    { action: "update", resource: "health_record", conditions: { creator: "self" } },
    { action: "prescribe", resource: "prescription" },
    { action: "request_access", resource: "access_grant" },
    { action: "emergency_access", resource: "health_record" },
  ],

  pharmacist: [
    { action: "read", resource: "prescription", conditions: { hasAccess: true } },
    { action: "read", resource: "health_record", conditions: { type: "allergy", hasAccess: true } },
    { action: "read", resource: "dispense_log" },
    { action: "read", resource: "audit_log", conditions: { type: "dispense" } },
    { action: "create", resource: "dispense_log" },
    { action: "dispense", resource: "prescription" },
    { action: "request_access", resource: "access_grant", conditions: { type: "prescription" } },
  ],

  paramedic: [
    { action: "read", resource: "health_record", conditions: { hasAccess: true } },
    { action: "read", resource: "vitals", conditions: { hasAccess: true } },
    { action: "read", resource: "prescription", conditions: { hasAccess: true } },
    { action: "read", resource: "diagnosis", conditions: { type: "critical", hasAccess: true } },
    { action: "create", resource: "health_record", conditions: { type: "field_notes" } },
    { action: "create", resource: "vitals" },
    { action: "emergency_access", resource: "health_record" },
    { action: "request_access", resource: "access_grant" },
  ],

  admin: [
    { action: "*", resource: "*" },
  ],
};

// Role feature flags
export const roleFeatures: Record<UserRole, RoleFeatures> = {
  patient: {
    canViewOwnRecords: true,
    canViewPatientRecords: false,
    canCreateRecords: true, // self-reported only
    canGrantAccess: true,
    canRequestAccess: false,
    canPrescribe: false,
    canDispense: false,
    canEmergencyAccess: false,
    canViewAuditLogs: true, // own records only
    canManagePatients: false,
  },

  doctor: {
    canViewOwnRecords: false,
    canViewPatientRecords: true,
    canCreateRecords: true,
    canGrantAccess: false,
    canRequestAccess: true,
    canPrescribe: true,
    canDispense: false,
    canEmergencyAccess: true,
    canViewAuditLogs: true,
    canManagePatients: true,
  },

  pharmacist: {
    canViewOwnRecords: false,
    canViewPatientRecords: false,
    canCreateRecords: false,
    canGrantAccess: false,
    canRequestAccess: true,
    canPrescribe: false,
    canDispense: true,
    canEmergencyAccess: false,
    canViewAuditLogs: true, // dispense logs only
    canManagePatients: false,
  },

  paramedic: {
    canViewOwnRecords: false,
    canViewPatientRecords: true,
    canCreateRecords: true, // field notes only
    canGrantAccess: false,
    canRequestAccess: true,
    canPrescribe: false,
    canDispense: false,
    canEmergencyAccess: true,
    canViewAuditLogs: false,
    canManagePatients: false,
  },

  admin: {
    canViewOwnRecords: true,
    canViewPatientRecords: true,
    canCreateRecords: true,
    canGrantAccess: true,
    canRequestAccess: true,
    canPrescribe: false,
    canDispense: false,
    canEmergencyAccess: true,
    canViewAuditLogs: true,
    canManagePatients: true,
  },
};

// Permission checking utilities
export function hasPermission(
  role: UserRole,
  action: ActionType,
  resource: ResourceType,
  context?: Record<string, unknown>
): boolean {
  const permissions = rolePermissions[role];
  if (!permissions) return false;

  for (const permission of permissions) {
    // Admin wildcard
    if (permission.action === "*" && permission.resource === "*") {
      return true;
    }

    // Check action and resource match
    if (permission.action !== action) continue;
    if (permission.resource !== resource && permission.resource !== "*") continue;

    // Check conditions if any
    if (permission.conditions && context) {
      const conditionsMet = Object.entries(permission.conditions).every(([key, value]) => {
        if (value === "self") {
          return context.userId === context.resourceOwnerId;
        }
        if (value === true) {
          return context[key] === true;
        }
        return context[key] === value;
      });
      if (!conditionsMet) continue;
    }

    return true;
  }

  return false;
}

export function getRoleFeatures(role: UserRole): RoleFeatures {
  return roleFeatures[role];
}

export function canAccessResource(
  role: UserRole,
  resourceType: ResourceType,
  resourceOwnerId: string,
  userId: string,
  hasGrantedAccess: boolean = false
): boolean {
  const context = {
    userId,
    resourceOwnerId,
    hasAccess: hasGrantedAccess || userId === resourceOwnerId,
    owner: userId === resourceOwnerId ? "self" : "other",
  };

  return hasPermission(role, "read", resourceType, context);
}
