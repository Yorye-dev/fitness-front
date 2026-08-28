import { translations } from "@/config/i18n";
import { usePreferencesStore } from "@/stores/preferences.store";

export function useTranslation() {
  const language = usePreferencesStore((state) => state.language);

  return translations[language];
}
