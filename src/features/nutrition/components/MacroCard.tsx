import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/stores/preferences.store";
import type { Nutrient } from "../types/nutrition.types";

interface MacroCardProps extends Nutrient {
  name: string;
  unit: string;
  tone: "green" | "blue" | "orange" | "purple";
}

const tones = {
  green: "bg-green",
  blue: "bg-blue",
  orange: "bg-orange",
  purple: "bg-purple",
};

export function MacroCard({
  name,
  consumed,
  target,
  unit,
  tone,
}: MacroCardProps) {
  const t = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  const format = (value: number) =>
    new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(value);
  const percentage = target > 0 ? Math.max(0, (consumed / target) * 100) : 0;
  const difference = target - consumed;

  return (
    <article className="panel">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${tones[tone]}`}
          aria-hidden="true"
        />
        <h3 className="text-sm font-medium text-text-muted">{name}</h3>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight tabular-nums">
        {format(consumed)}{" "}
        <span className="text-sm font-normal text-text-subtle">{unit}</span>
      </p>
      <p className="mt-1 text-xs text-text-subtle">
        {target > 0
          ? `${t.macros.of} ${format(target)} ${unit}`
          : t.dashboard.noTarget}
      </p>
      <div
        role="progressbar"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, Math.round(percentage))}
        aria-valuetext={
          target > 0
            ? `${format(consumed)} ${t.macros.of} ${format(target)} ${unit}`
            : t.dashboard.noTarget
        }
        className="my-5 h-1.5 overflow-hidden rounded-full bg-bg-deep"
      >
        <div
          className={`h-full rounded-full transition-[width] ${tones[tone]}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      <p className="text-xs text-text-subtle">
        {target > 0 ? (
          <>
            <span
              className={difference < 0 ? "text-orange" : "text-text-muted"}
            >
              {format(Math.abs(difference))} {unit}
            </span>{" "}
            · {difference < 0 ? t.dashboard.over : t.dashboard.remaining}
          </>
        ) : (
          "—"
        )}
      </p>
    </article>
  );
}
