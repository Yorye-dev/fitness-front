import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useTranslation } from "@/hooks/useTranslation";

import { useAuthStore } from "../stores/auth.store";

export function ProtectedRoute() {
  const t = useTranslation();

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  const isLoading =
    useAuthStore(
      (state) => state.isLoading,
    );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg text-text">
        <p className="text-sm text-text-subtle">
          {t.common.loading}
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}
