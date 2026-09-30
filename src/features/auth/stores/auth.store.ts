import { CanceledError } from "axios";
import { create } from "zustand";
import { session } from "@/lib/auth/session";
import { getCurrentUser, login, registerUser } from "../services/auth.service";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initializationError: boolean;
  signIn: (credentials: LoginRequest) => Promise<void>;
  signUp: (input: RegisterRequest) => Promise<void>;
  initialize: () => Promise<void>;
  logout: () => void;
  reset: () => void;
}

// Registration succeeded, but profile retrieval failed: do not submit registration twice.
export class RegistrationCreatedError extends Error {}
const signedOut = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  initializationError: false,
};
let initialization: { revision: number; promise: Promise<void> } | null = null;

export const useAuthStore = create<AuthState>((set) => {
  const establishSession = async (tokens: AuthResponse) => {
    session.save(tokens);
    const revision = session.getRevision();
    try {
      const user = await getCurrentUser();
      if (revision !== session.getRevision())
        throw new CanceledError("Session changed");
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        initializationError: false,
      });
    } catch (error) {
      if (revision === session.getRevision()) session.clear();
      throw error;
    }
  };
  return {
    ...signedOut,
    isLoading: true,
    signIn: async (credentials) => {
      const revision = session.getRevision();
      const tokens = await login(credentials);
      if (revision !== session.getRevision())
        throw new CanceledError("Session changed");
      await establishSession(tokens);
    },
    signUp: async (input) => {
      const revision = session.getRevision();
      const tokens = await registerUser(input);
      if (revision !== session.getRevision())
        throw new CanceledError("Session changed");
      try {
        await establishSession(tokens);
      } catch {
        throw new RegistrationCreatedError();
      }
    },
    initialize: () => {
      const revision = session.getRevision();
      if (initialization?.revision === revision) return initialization.promise;
      if (!session.getAccessToken() && !session.getRefreshToken()) {
        set(signedOut);
        return Promise.resolve();
      }
      set({ isLoading: true, initializationError: false });
      const promise = getCurrentUser()
        .then((user) => {
          if (revision === session.getRevision())
            set({ user, isAuthenticated: true });
        })
        .catch(() => {
          if (revision === session.getRevision())
            set({ initializationError: true });
        })
        .finally(() => {
          if (revision === session.getRevision()) set({ isLoading: false });
          if (initialization?.promise === promise) initialization = null;
        });
      initialization = { revision, promise };
      return promise;
    },
    logout: () => {
      session.clear();
      set(signedOut);
    },
    reset: () => set(signedOut),
  };
});
