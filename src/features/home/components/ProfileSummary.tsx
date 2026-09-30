import { Target } from "lucide-react";
import type { User } from "@/features/auth/types/auth.types";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/stores/preferences.store";

export function ProfileSummary({ user }: { user: User }) {
  const t = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  const goalLabels: Record<string, string> = {
    loseweight: t.goals.loseWeight,
    maintain: t.goals.maintainWeight,
    gainmuscle: t.goals.gainMuscle,
  };
  const goal =
    goalLabels[user.goal.replaceAll("_", "").toLowerCase()] ?? t.goals.unknown;
  return (
    <section className="panel">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{t.dashboard.profile}</p>
        <Target size={19} className="text-green" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-semibold">{goal}</h2>
      <p className="mt-1 text-xs text-text-subtle">{t.dashboard.goal}</p>
      <div className="mt-6 border-t border-surface-elevated/50 pt-5">
        <p className="text-3xl font-semibold tabular-nums">
          {new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(
            user.weight,
          )}{" "}
          <span className="text-sm font-normal text-text-subtle">
            {t.common.units.kilograms}
          </span>
        </p>
        <p className="mt-1 text-xs text-text-subtle">
          {t.dashboard.currentBodyWeight}
        </p>
      </div>
    </section>
  );
}
