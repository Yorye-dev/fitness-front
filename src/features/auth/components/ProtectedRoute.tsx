// src/features/auth/components/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/features/auth/stores/auth.store";

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading,
  );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg text-text">
        <p className="text-sm text-text-subtle">
          Loading FitNess...
        </p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
