import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { usePreferencesStore } from "@/stores/preferences.store";
import { useTranslation } from "@/hooks/useTranslation";
import { session } from "@/lib/auth/session";
import { Button } from "@/components/ui/Button";

import { router } from "./router";

function App() {
  const t = useTranslation();
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializationError = useAuthStore(
    (state) => state.initializationError,
  );
  const logout = useAuthStore((state) => state.logout);
  const initialize = useAuthStore((state) => state.initialize);

  const theme = usePreferencesStore((state) => state.theme);

  const language = usePreferencesStore((state) => state.language);

  useEffect(() => {
    const unsubscribe = session.onInvalidate(() => {
      useAuthStore.getState().reset();
      if (session.getAccessToken() || session.getRefreshToken())
        void initialize();
    });
    void initialize();
    return unsubscribe;
  }, [initialize]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const root = document.documentElement;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const shouldUseDarkTheme =
        theme === "dark" || (theme === "system" && mediaQuery.matches);

      root.classList.toggle("dark", shouldUseDarkTheme);
    };

    applyTheme();

    if (theme !== "system") {
      return;
    }

    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [theme]);

  if (isLoading || initializationError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg px-5 text-text">
        {isLoading ? (
          <p role="status" className="text-sm text-text-subtle">
            {t.common.loading}
          </p>
        ) : (
          <section className="panel max-w-sm space-y-4 text-center">
            <h1 className="text-xl font-semibold">{t.auth.sessionError}</h1>
            <p className="text-sm text-text-subtle">
              {t.auth.sessionErrorHint}
            </p>
            <Button onClick={() => void initialize()}>{t.common.retry}</Button>
            <button className="secondary-button w-full" onClick={logout}>
              {t.auth.backToLogin}
            </button>
          </section>
        )}
      </main>
    );
  }
  return <RouterProvider router={router} />;
}

export default App;
