"use client";

import * as React from "react";
import { useAuth } from "./AuthProvider";
import type { UserRole, ActionType, ResourceType, RoleFeatures } from "../types";

interface RoleGuardProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function RoleGuard({ children, roles, fallback, redirectTo }: RoleGuardProps) {
  const { role, isAuthenticated, isLoading } = useAuth();

  // Handle loading state
  if (isLoading) {
    return fallback ?? null;
  }

  // Not authenticated
  if (!isAuthenticated || !role) {
    if (redirectTo && typeof window !== "undefined") {
      window.location.href = redirectTo;
      return null;
    }
    return fallback ?? null;
  }

  // Check if user's role is allowed
  if (!roles.includes(role)) {
    return fallback ?? null;
  }

  return <>{children}</>;
}

interface PermissionGuardProps {
  children: React.ReactNode;
  action: ActionType;
  resource: ResourceType;
  context?: Record<string, unknown>;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  children,
  action,
  resource,
  context,
  fallback,
}: PermissionGuardProps) {
  const { can, isLoading } = useAuth();

  if (isLoading) {
    return fallback ?? null;
  }

  if (!can(action, resource, context)) {
    return fallback ?? null;
  }

  return <>{children}</>;
}

interface FeatureGuardProps {
  children: React.ReactNode;
  feature: keyof RoleFeatures;
  fallback?: React.ReactNode;
}

export function FeatureGuard({ children, feature, fallback }: FeatureGuardProps) {
  const { features, isLoading } = useAuth();

  if (isLoading) {
    return fallback ?? null;
  }

  if (!features || !features[feature]) {
    return fallback ?? null;
  }

  return <>{children}</>;
}

// Higher-order component versions
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  roles: UserRole[],
  fallback?: React.ReactNode
) {
  return function WithRoleGuard(props: P) {
    return (
      <RoleGuard roles={roles} fallback={fallback}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}

export function withPermissionGuard<P extends object>(
  Component: React.ComponentType<P>,
  action: ActionType,
  resource: ResourceType,
  fallback?: React.ReactNode
) {
  return function WithPermissionGuard(props: P) {
    return (
      <PermissionGuard action={action} resource={resource} fallback={fallback}>
        <Component {...props} />
      </PermissionGuard>
    );
  };
}

export function withFeatureGuard<P extends object>(
  Component: React.ComponentType<P>,
  feature: keyof RoleFeatures,
  fallback?: React.ReactNode
) {
  return function WithFeatureGuard(props: P) {
    return (
      <FeatureGuard feature={feature} fallback={fallback}>
        <Component {...props} />
      </FeatureGuard>
    );
  };
}

// Utility component for conditional rendering based on role
interface ShowForRoleProps {
  children: React.ReactNode;
  roles: UserRole[];
}

export function ShowForRole({ children, roles }: ShowForRoleProps) {
  const { role } = useAuth();
  if (!role || !roles.includes(role)) return null;
  return <>{children}</>;
}

// Utility component for hiding content from specific roles
interface HideFromRoleProps {
  children: React.ReactNode;
  roles: UserRole[];
}

export function HideFromRole({ children, roles }: HideFromRoleProps) {
  const { role } = useAuth();
  if (role && roles.includes(role)) return null;
  return <>{children}</>;
}
