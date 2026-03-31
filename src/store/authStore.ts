// src/store/authStore.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, UserRole } from "@/types";

interface AuthState {
  user:       AuthUser | null;
  isLoading:  boolean;
  setUser:    (u: AuthUser | null) => void;
  setLoading: (v: boolean) => void;
  logout:     () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:       null,
      isLoading:  true,
      setUser:    (user)      => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout:     ()          => {
        set({ user: null, isLoading: false });
        if (typeof window !== "undefined") localStorage.removeItem("waku-auth");
      },
    }),
    {
      name:       "waku-auth",
      partialize: (s) => ({ user: s.user }),
    }
  )
);

export const useCurrentUser  = () => useAuthStore((s) => s.user);
export const useIsAdmin      = () => {
  const r = useAuthStore((s) => s.user?.role);
  return r === "ADMIN" || r === "SUPER_ADMIN";
};
export const useIsSuperAdmin = () => useAuthStore((s) => s.user?.role === "SUPER_ADMIN");
