import { Pencil, Trash2, Utensils } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/stores/preferences.store";
import type { DailyMeal } from "../types/nutrition.types";

export function DailyMealList({
  meals,
  onEdit,
  onRemove,
}: {
  meals: DailyMeal[];
  onEdit: (meal: DailyMeal) => void;
  onRemove: (meal: DailyMeal) => void;
}) {
  const t = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  const format = (number: number, decimals = 1) =>
    new Intl.NumberFormat(language, { maximumFractionDigits: decimals }).format(
      number,
    );
  return (
    <section className="panel h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{t.dashboard.dailyIntake}</p>
          <h2 className="mt-2 text-xl font-semibold">{t.dashboard.mealList}</h2>
        </div>
        <span className="rounded-full bg-bg-deep px-3 py-1 text-xs text-text-subtle">
          {meals.length} {t.dashboard.entries}
        </span>
      </div>
      {meals.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-3 py-10 text-center">
          <div className="mb-5 rounded-2xl bg-green/10 p-4 text-green">
            <Utensils size={25} aria-hidden="true" />
          </div>
          <h3 className="font-medium">{t.dashboard.noMeals}</h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-subtle">
            {t.dashboard.noMealsHint}
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-surface-elevated/50">
          {meals.map((meal) => (
            <li
              key={meal.id}
              className="flex items-start justify-between gap-4 py-4"
            >
              <div className="min-w-0">
                <h3 className="break-words text-sm font-medium">{meal.name}</h3>
                <p className="mt-1 text-xs text-text-subtle">
                  {meal.quantity_grams === null ? (
                    <>
                      {format(meal.portion_count ?? 0, 3)}{" "}
                      {meal.portion_count === 1
                        ? t.foodCatalog.unit
                        : t.foodCatalog.units}
                    </>
                  ) : (
                    <>
                      {meal.portion_count != null &&
                        meal.portion_grams != null && (
                          <>
                            {format(meal.portion_count, 3)} ×{" "}
                            {format(meal.portion_grams, 3)} g ·{" "}
                          </>
                        )}
                      {format(meal.quantity_grams, 3)} {t.common.units.grams}
                    </>
                  )}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-subtle">
                  {t.macros.protein} {format(meal.protein)} g · {t.macros.carbs}{" "}
                  {format(meal.carbs)} g · {t.macros.fat} {format(meal.fat)} g
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-sm font-medium tabular-nums">
                  {format(meal.calories)}{" "}
                  <span className="text-xs font-normal text-text-subtle">
                    {t.common.units.calories}
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="icon-button hover:text-green"
                    aria-label={`${t.foodCatalog.editIntake}: ${meal.name}`}
                    title={t.foodCatalog.editIntake}
                    onClick={() => onEdit(meal)}
                  >
                    <Pencil size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-button hover:text-red-light"
                    aria-label={`${t.foodCatalog.remove}: ${meal.name}`}
                    title={t.foodCatalog.remove}
                    onClick={() => onRemove(meal)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
