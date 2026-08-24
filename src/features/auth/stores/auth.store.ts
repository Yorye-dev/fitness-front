// src/features/auth/stores/auth.store.ts

import { create } from "zustand";

import { getCurrentUser, login } from "../services/auth.service";
import type { LoginRequest, User } from "../types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  signIn: (credentials: LoginRequest) => Promise<void>;
  initialize: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  signIn: async (credentials) => {
    const auth = await login(credentials);

    localStorage.setItem("access_token", auth.access_token);

    const user = await getCurrentUser();

    set({
      user,
      isAuthenticated: true,
    });
  },

  initialize: async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return;
    }

    try {
      const user = await getCurrentUser();

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem("access_token");

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");

    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
