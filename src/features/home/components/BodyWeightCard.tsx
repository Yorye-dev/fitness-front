import { Scale } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/stores/preferences.store";

export function BodyWeightCard({ weight }: { weight: number }) {
  const t = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  return (
    <section className="panel self-start">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-text-subtle">
          {t.dashboard.currentBodyWeight}
        </h2>
        <Scale size={20} className="text-green" aria-hidden="true" />
      </div>
      <p className="mt-5 text-3xl font-semibold tabular-nums">
        {new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(
          weight,
        )}{" "}
        <span className="text-sm font-normal text-text-subtle">
          {t.common.units.kilograms}
        </span>
      </p>
      <p className="mt-2 text-xs leading-relaxed text-text-subtle">
        {t.dashboard.currentWeightHint}
      </p>
    </section>
  );
}
