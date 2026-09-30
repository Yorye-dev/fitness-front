import { useTranslation } from "@/hooks/useTranslation";
import type { DailyNutrition } from "../types/nutrition.types";
import { MacroCard } from "./MacroCard";

export function NutritionSummary({ nutrition }: { nutrition: DailyNutrition }) {
  const t = useTranslation();
  return (
    <section
      aria-label={t.dashboard.summary}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <MacroCard
        name={t.macros.calories}
        {...nutrition.calories}
        unit={t.common.units.calories}
        tone="green"
      />
      <MacroCard
        name={t.macros.protein}
        {...nutrition.macros.protein}
        unit={t.common.units.grams}
        tone="blue"
      />
      <MacroCard
        name={t.macros.carbs}
        {...nutrition.macros.carbs}
        unit={t.common.units.grams}
        tone="orange"
      />
      <MacroCard
        name={t.macros.fat}
        {...nutrition.macros.fat}
        unit={t.common.units.grams}
        tone="purple"
      />
    </section>
  );
}
