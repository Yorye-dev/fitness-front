import { useEffect, useState } from "react";

import { usePreferencesStore } from "@/stores/preferences.store";

export type ResolvedTheme = "light" | "dark";

export function useResolvedTheme(): ResolvedTheme {
  const theme = usePreferencesStore((state) => state.theme);

  const [systemTheme, setSystemTheme] =
    useState<ResolvedTheme>(() =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    );

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  if (theme === "system") {
    return systemTheme;
  }

  return theme;
}
