import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PreferencesMenu } from "@/components/preferences/PreferencesMenu";
import { Logo } from "@/components/ui/Logo";
import { safeReturnPath } from "@/features/auth/lib/redirect";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTranslation } from "@/hooks/useTranslation";

export function AuthLayout() {
  const t = useTranslation();
  const location = useLocation();
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  if (authenticated)
    return <Navigate to={safeReturnPath(location.state)} replace />;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-bg px-4 py-20 text-text sm:px-6 sm:py-12">
      <div className="absolute right-4 top-4 z-50 sm:right-6 sm:top-6">
        <PreferencesMenu />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-light/5 blur-3xl" />
        <div className="auth-grid absolute inset-0" />
      </div>

      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <header className="flex flex-col items-center text-center">
          <Logo className="mb-4 h-20 w-20 object-contain sm:h-24 sm:w-24" />
          <p className="text-2xl font-semibold tracking-tight">{t.app.name}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-text-subtle">
            {t.app.tagline}
          </p>
        </header>
        <Outlet />
      </div>
    </main>
  );
}
