import { AlertCircle, Plus } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTranslation } from "@/hooks/useTranslation";
import { isDateKey, localDateKey } from "@/lib/date";
import { DailyMealList } from "../components/DailyMealList";
import { DateNavigation } from "../components/DateNavigation";
import { EditConsumptionDialog } from "../components/EditConsumptionDialog";
import { LogConsumptionDialog } from "../components/LogConsumptionDialog";
import { useDailyNutrition } from "../hooks/useDailyNutrition";
import { nutritionErrorMessage } from "../lib/errors";
import { deleteConsumption } from "../services/nutrition.service";
import type { DailyMeal } from "../types/nutrition.types";

type Action =
  | { type: "log" }
  | { type: "edit" | "remove"; meal: DailyMeal; date: string }
  | null;

export function IntakeHistoryPage() {
  const t = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [params, setParams] = useSearchParams();
  const requestedDate = params.get("date");
  const date = isDateKey(requestedDate) ? requestedDate : localDateKey();
  const { state, reload } = useDailyNutrition(date, user?.id ?? "");
  const [action, setAction] = useState<Action>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const changeDate = (nextDate: string) => {
    if (!isDateKey(nextDate)) return;
    setNotice(null);
    setParams((previous) => {
      previous.set("date", nextDate);
      return previous;
    });
  };
  const saved = (entryDate: string, message: string) => {
    setAction(null);
    changeDate(entryDate);
    setNotice(message);
    reload();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <header>
        <p className="eyebrow">{t.dashboard.dailyIntake}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {t.intakeHistory.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-subtle">
          {t.intakeHistory.description}
        </p>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DateNavigation
          date={date}
          onDateChange={changeDate}
          onRefresh={reload}
          loading={state.status === "loading"}
          dateLabel={t.intakeHistory.date}
          refreshLabel={t.intakeHistory.refresh}
        />
        <button
          type="button"
          onClick={() => setAction({ type: "log" })}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-text-subtle transition hover:bg-surface/50 hover:text-green"
        >
          <Plus size={16} aria-hidden="true" />
          {t.foodCatalog.addToDay}
        </button>
      </div>
      {notice && (
        <p
          role="status"
          className="rounded-xl border border-green/30 bg-green/5 px-4 py-3 text-sm text-green"
        >
          {notice}
        </p>
      )}
      {state.status === "loading" && (
        <section className="panel" aria-busy="true">
          <p role="status" className="text-sm text-text-subtle">
            {t.intakeHistory.loading}
          </p>
        </section>
      )}
      {state.status === "error" && (
        <section
          role="alert"
          className="panel flex flex-wrap items-center gap-4 border-orange/40"
        >
          <AlertCircle className="text-orange" size={24} aria-hidden="true" />
          <div className="flex-1">
            <h2 className="font-medium">{t.intakeHistory.loadError}</h2>
            <p className="mt-1 text-sm text-text-subtle">
              {t.dashboard.loadErrorHint}
            </p>
          </div>
          <button type="button" onClick={reload} className="secondary-button">
            {t.common.retry}
          </button>
        </section>
      )}
      {state.status === "success" && (
        <DailyMealList
          meals={state.data.meals}
          onEdit={(meal) => setAction({ type: "edit", meal, date })}
          onRemove={(meal) => setAction({ type: "remove", meal, date })}
        />
      )}

      {action?.type === "log" && (
        <LogConsumptionDialog
          date={date}
          onClose={() => setAction(null)}
          onSaved={(entry) => saved(entry.date, t.foodCatalog.logged)}
        />
      )}
      {action?.type === "edit" && (
        <EditConsumptionDialog
          meal={action.meal}
          date={action.date}
          onClose={() => setAction(null)}
          onSaved={(entry) => saved(entry.date, t.foodCatalog.intakeUpdated)}
        />
      )}
      {action?.type === "remove" && (
        <ConfirmDialog
          title={t.foodCatalog.remove}
          onClose={() => setAction(null)}
          errorMessage={(error) => nutritionErrorMessage(error, t)}
          onConfirm={async () => {
            await deleteConsumption(action.meal.id);
            saved(action.date, t.foodCatalog.removed);
          }}
        >
          <p className="break-words font-medium">
            {action.meal.name} ·{" "}
            {action.meal.quantity_grams === null
              ? `${action.meal.portion_count} ${action.meal.portion_count === 1 ? t.foodCatalog.unit : t.foodCatalog.units}`
              : `${action.meal.quantity_grams} g`}
          </p>
          <p className="text-sm leading-relaxed text-text-subtle">
            {t.foodCatalog.removeHint}
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
