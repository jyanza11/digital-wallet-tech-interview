"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "digital-wallet-session";

export interface SessionUser {
  id: string;
  document: string;
  name: string;
  email: string;
  phone: string;
  walletBalance?: number;
}

interface SessionState {
  user: SessionUser | null;
  hasHydrated: boolean;
  setUser: (user: SessionUser) => void;
  clearUser: () => void;
  updateWalletBalance: (balance: number) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      updateWalletBalance: (balance) =>
        set((state) =>
          state.user
            ? { user: { ...state.user, walletBalance: balance } }
            : state,
        ),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
