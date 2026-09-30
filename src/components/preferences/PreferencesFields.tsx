import { ChevronDown } from "lucide-react";
import { useId } from "react";
import type { Language } from "@/config/i18n";
import { useTranslation } from "@/hooks/useTranslation";
import { type Theme, usePreferencesStore } from "@/stores/preferences.store";

export function PreferencesFields({
  className = "space-y-4",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const t = useTranslation();
  const languageId = useId();
  const themeId = useId();
  const language = usePreferencesStore((s) => s.language),
    theme = usePreferencesStore((s) => s.theme);
  const setLanguage = usePreferencesStore((s) => s.setLanguage),
    setTheme = usePreferencesStore((s) => s.setTheme);
  const fields = [
    {
      id: languageId,
      label: t.preferences.language,
      value: language,
      onChange: (value: string) => setLanguage(value as Language),
      options: [
        { value: "es", label: t.preferences.spanish },
        { value: "en", label: t.preferences.english },
      ],
    },
    {
      id: themeId,
      label: t.preferences.theme,
      value: theme,
      onChange: (value: string) => setTheme(value as Theme),
      options: [
        { value: "system", label: t.preferences.system },
        { value: "light", label: t.preferences.light },
        { value: "dark", label: t.preferences.dark },
      ],
    },
  ];
  return (
    <div className={className}>
      {fields.map((field) => (
        <div
          key={field.id}
          className={
            compact ? "flex items-center justify-between gap-2 pl-2" : undefined
          }
        >
          <label
            htmlFor={field.id}
            className={
              compact
                ? "text-xs text-text-subtle"
                : "mb-2 block text-xs text-text-subtle"
            }
          >
            {field.label}
          </label>
          <div className={compact ? "relative w-28 shrink-0" : undefined}>
            <select
              id={field.id}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className={
                compact
                  ? "preferences-select"
                  : "field-input h-10 rounded-lg bg-bg"
              }
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {compact && (
              <ChevronDown
                size={12}
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-subtle"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
