"use client";

import * as React from "react";
import { useAuthStore } from "../store";
import type { User, AuthSession, UserRole } from "../types";
import { getRoleFeatures, hasPermission, type RoleFeatures } from "../permissions";
import type { ActionType, ResourceType } from "../types";

interface AuthContextValue {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  role: UserRole | null;
  features: RoleFeatures | null;

  // Actions
  login: (address: string, signature: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;

  // Permission checks
  can: (action: ActionType, resource: ResourceType, context?: Record<string, unknown>) => boolean;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  apiUrl?: string;
  onAuthError?: (error: Error) => void;
}

export function AuthProvider({ children, apiUrl = "/api/auth", onAuthError }: AuthProviderProps) {
  const store = useAuthStore();

  const role = store.user?.role ?? null;
  const features = role ? getRoleFeatures(role) : null;

  const login = React.useCallback(
    async (address: string, signature: string) => {
      store.setLoading(true);
      store.setError(null);

      try {
        const response = await fetch(`${apiUrl}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, signature }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Login failed");
        }

        const session: AuthSession = await response.json();
        store.setSession(session);
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        store.setError(err.message);
        onAuthError?.(err);
        throw err;
      } finally {
        store.setLoading(false);
      }
    },
    [apiUrl, onAuthError, store]
  );

  const logout = React.useCallback(() => {
    store.logout();
    // Optionally call logout endpoint
    fetch(`${apiUrl}/logout`, { method: "POST" }).catch(() => {});
  }, [apiUrl, store]);

  const refreshSession = React.useCallback(async () => {
    if (!store.session?.refreshToken) return;

    store.setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: store.session.refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Session refresh failed");
      }

      const session: AuthSession = await response.json();
      store.setSession(session);
    } catch (error) {
      store.logout();
      const err = error instanceof Error ? error : new Error("Session expired");
      onAuthError?.(err);
    } finally {
      store.setLoading(false);
    }
  }, [apiUrl, onAuthError, store]);

  const can = React.useCallback(
    (action: ActionType, resource: ResourceType, context?: Record<string, unknown>): boolean => {
      if (!role) return false;
      return hasPermission(role, action, resource, context);
    },
    [role]
  );

  // Auto-refresh session before expiry
  React.useEffect(() => {
    if (!store.session?.expiresAt) return;

    const expiresIn = store.session.expiresAt * 1000 - Date.now();
    const refreshAt = expiresIn - 5 * 60 * 1000; // 5 minutes before expiry

    if (refreshAt <= 0) {
      refreshSession();
      return;
    }

    const timeout = setTimeout(refreshSession, refreshAt);
    return () => clearTimeout(timeout);
  }, [store.session?.expiresAt, refreshSession]);

  const value: AuthContextValue = {
    user: store.user,
    session: store.session,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    role,
    features,
    login,
    logout,
    refreshSession,
    can,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Convenience hooks
export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useRole() {
  const { role } = useAuth();
  return role;
}

export function useFeatures() {
  const { features } = useAuth();
  return features;
}

export function usePermission(action: ActionType, resource: ResourceType) {
  const { can } = useAuth();
  return React.useCallback(
    (context?: Record<string, unknown>) => can(action, resource, context),
    [can, action, resource]
  );
}
