import { Settings } from "lucide-react";

import type { Language } from "@/config/i18n";
import { useTranslation } from "@/hooks/useTranslation";
import {
  type Theme,
  usePreferencesStore,
} from "@/stores/preferences.store";

export function PreferencesMenu() {
  const t = useTranslation();

  const language = usePreferencesStore(
    (state) => state.language,
  );

  const theme = usePreferencesStore(
    (state) => state.theme,
  );

  const setLanguage = usePreferencesStore(
    (state) => state.setLanguage,
  );

  const setTheme = usePreferencesStore(
    (state) => state.setTheme,
  );

  return (
    <details className="relative">
      <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-surface-elevated/60 bg-surface/40 text-text-subtle transition hover:bg-surface hover:text-text [&::-webkit-details-marker]:hidden">
        <Settings className="h-4 w-4" />
      </summary>

      <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-surface-elevated bg-bg-deep p-4 shadow-2xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-text-subtle">
          {t.preferences.title}
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="language"
              className="mb-2 block text-xs text-text-subtle"
            >
              {t.preferences.language}
            </label>

            <select
              id="language"
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value as Language,
                )
              }
              className="h-10 w-full rounded-lg border border-surface-elevated bg-bg px-3 text-sm text-text outline-none focus:border-green-light"
            >
              <option value="es">
                {t.preferences.spanish}
              </option>

              <option value="en">
                {t.preferences.english}
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="theme"
              className="mb-2 block text-xs text-text-subtle"
            >
              {t.preferences.theme}
            </label>

            <select
              id="theme"
              value={theme}
              onChange={(event) =>
                setTheme(
                  event.target.value as Theme,
                )
              }
              className="h-10 w-full rounded-lg border border-surface-elevated bg-bg px-3 text-sm text-text outline-none focus:border-green-light"
            >
              <option value="system">
                {t.preferences.system}
              </option>

              <option value="light">
                {t.preferences.light}
              </option>

              <option value="dark">
                {t.preferences.dark}
              </option>
            </select>
          </div>
        </div>
      </div>
    </details>
  );
}
