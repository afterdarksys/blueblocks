// Types
export type {
  User,
  UserRole,
  AuthSession,
  Permission,
  RolePermissions,
  ResourceType,
  ActionType,
  RoleFeatures,
} from "./types";

// Permissions
export {
  rolePermissions,
  roleFeatures,
  hasPermission,
  getRoleFeatures,
  canAccessResource,
} from "./permissions";

// Store
export { useAuthStore, selectUser, selectRole, selectIsAuthenticated, selectIsLoading } from "./store";

// React exports
export {
  AuthProvider,
  useAuth,
  useUser,
  useRole,
  useFeatures,
  usePermission,
  RoleGuard,
  PermissionGuard,
  FeatureGuard,
  withRoleGuard,
  withPermissionGuard,
  withFeatureGuard,
  ShowForRole,
  HideFromRole,
} from "./react";
