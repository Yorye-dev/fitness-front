import { create } from "zustand";

import type { Language } from "@/config/i18n";

export type Theme = "system" | "light" | "dark";

interface PreferencesState {
  language: Language;
  theme: Theme;

  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
}

function getInitialLanguage(): Language {
  const storedLanguage = localStorage.getItem("language");

  if (storedLanguage === "es" || storedLanguage === "en") {
    return storedLanguage;
  }

  return navigator.language.toLowerCase().startsWith("es")
    ? "es"
    : "en";
}

function getInitialTheme(): Theme {
  const storedTheme = localStorage.getItem("theme");

  if (
    storedTheme === "system" ||
    storedTheme === "light" ||
    storedTheme === "dark"
  ) {
    return storedTheme;
  }

  return "system";
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  language: getInitialLanguage(),
  theme: getInitialTheme(),

  setLanguage: (language) => {
    localStorage.setItem("language", language);

    set({
      language,
    });
  },

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);

    set({
      theme,
    });
  },
}));
