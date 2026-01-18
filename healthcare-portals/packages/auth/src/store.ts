import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, AuthSession, UserRole } from "./types";
import { getRoleFeatures, type RoleFeatures } from "./permissions";

interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;

  // Computed helpers
  getRole: () => UserRole | null;
  getFeatures: () => RoleFeatures | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      logout: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          error: null,
        }),

      getRole: () => {
        const { user } = get();
        return user?.role ?? null;
      },

      getFeatures: () => {
        const role = get().getRole();
        if (!role) return null;
        return getRoleFeatures(role);
      },
    }),
    {
      name: "blueblocks-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for common patterns
export const selectUser = (state: AuthState) => state.user;
export const selectRole = (state: AuthState) => state.user?.role;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
