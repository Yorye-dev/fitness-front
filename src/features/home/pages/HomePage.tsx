import { AlertCircle, Plus } from "lucide-react";
import { useReducer, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { DateNavigation } from "@/features/nutrition/components/DateNavigation";
import { NutritionSummary } from "@/features/nutrition/components/NutritionSummary";
import { useDailyNutrition } from "@/features/nutrition/hooks/useDailyNutrition";
import { LogConsumptionDialog } from "@/features/nutrition/components/LogConsumptionDialog";
import { useTranslation } from "@/hooks/useTranslation";
import { isDateKey, localDateKey } from "@/lib/date";
import { DailyTraining } from "../components/DailyTraining";
import { BodyWeightCard } from "../components/BodyWeightCard";

export function HomePage() {
  const t = useTranslation();
  const location = useLocation();
  const [logging, setLogging] = useState(false);
  const [trainingRevision, refreshTraining] = useReducer(
    (value: number) => value + 1,
    0,
  );
  const [notice, setNotice] = useState<string | null>(
    location.state?.intakeLogged ? t.foodCatalog.logged : null,
  );
  const user = useAuthStore((state) => state.user);
  const [params, setParams] = useSearchParams();
  const requestedDate = params.get("date");
  const date = isDateKey(requestedDate) ? requestedDate : localDateKey();
  const { state, reload } = useDailyNutrition(date, user?.id ?? "");
  const changeDate = (nextDate: string) => {
    if (!isDateKey(nextDate)) return;
    setNotice(null);
    setParams((previous) => {
      previous.set("date", nextDate);
      return previous;
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div className="min-w-0">
          <p className="eyebrow">{t.dashboard.eyebrow}</p>
          <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight sm:text-4xl">
            {t.dashboard.welcomeBack}
            <span className="text-green">, {user?.username}</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-subtle">
            {t.dashboard.description}
          </p>
        </div>
        <DateNavigation
          date={date}
          onDateChange={changeDate}
          onRefresh={() => {
            reload();
            refreshTraining();
          }}
          loading={state.status === "loading"}
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-medium">{t.dashboard.summary}</h2>
        <button
          type="button"
          onClick={() => setLogging(true)}
          title={t.foodCatalog.log}
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
        <section aria-busy="true" aria-label={t.dashboard.summary}>
          <p role="status" className="mb-4 text-sm text-text-subtle">
            {t.dashboard.loading}
          </p>
          <div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="panel h-52 animate-pulse">
                <div className="h-3 w-20 rounded bg-surface-elevated/50" />
                <div className="mt-7 h-9 w-28 rounded bg-surface-elevated/50" />
              </div>
            ))}
          </div>
        </section>
      )}
      {state.status === "error" && (
        <section
          role="alert"
          className="panel flex flex-wrap items-center gap-4 border-orange/40"
        >
          <AlertCircle className="text-orange" size={24} aria-hidden="true" />
          <div className="flex-1">
            <h2 className="font-medium">{t.dashboard.loadError}</h2>
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
        <NutritionSummary nutrition={state.data} />
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <DailyTraining date={date} revision={trainingRevision} />
        {user && <BodyWeightCard weight={user.weight} />}
      </div>
      {logging && (
        <LogConsumptionDialog
          date={date}
          onClose={() => setLogging(false)}
          onSaved={(entry) => {
            setLogging(false);
            changeDate(entry.date);
            setNotice(t.foodCatalog.logged);
            reload();
          }}
        />
      )}
    </div>
  );
}
