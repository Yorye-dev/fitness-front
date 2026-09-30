import { Settings } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { PreferencesFields } from "./PreferencesFields";

export function PreferencesMenu() {
  const t = useTranslation();
  return (
    <details className="group relative">
      <summary
        aria-label={t.preferences.title}
        title={t.preferences.title}
        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg text-text-subtle transition hover:bg-surface/40 hover:text-text group-open:bg-surface/40 group-open:text-text [&::-webkit-details-marker]:hidden"
      >
        <Settings className="h-4 w-4" aria-hidden="true" />
      </summary>
      <div
        role="group"
        aria-label={t.preferences.title}
        className="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg border border-surface-elevated/50 bg-bg-deep p-2 shadow-md shadow-bg-deep/20"
      >
        <PreferencesFields compact className="space-y-1" />
      </div>
    </details>
  );
}
