import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { usePreferencesStore } from "@/stores/preferences.store";

import { router } from "./router";

function App() {
  const initialize = useAuthStore(
    (state) => state.initialize,
  );

  const theme = usePreferencesStore(
    (state) => state.theme,
  );

  const language = usePreferencesStore(
    (state) => state.language,
  );

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const root = document.documentElement;

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const applyTheme = () => {
      const shouldUseDarkTheme =
        theme === "dark" ||
        (theme === "system" && mediaQuery.matches);

      root.classList.toggle(
        "dark",
        shouldUseDarkTheme,
      );
    };

    applyTheme();

    if (theme !== "system") {
      return;
    }

    mediaQuery.addEventListener(
      "change",
      applyTheme,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        applyTheme,
      );
    };
  }, [theme]);

  return <RouterProvider router={router} />;
}

export default App;
