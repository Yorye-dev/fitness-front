import { Activity, ArrowUpRight, RotateCw } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTodayDate } from "@/hooks/useTodayDate";
import { useTranslation } from "@/hooks/useTranslation";
import { isDateKey, shiftDate } from "@/lib/date";
import { usePreferencesStore } from "@/stores/preferences.store";
import { ExerciseProgress } from "../components/ExerciseProgress";
import { TrainingNavigation } from "../components/TrainingNavigation";
import { useTrainingProgress } from "../hooks/useTrainingProgress";
import type { SessionProgress } from "../types/progress.types";

function validRange(from: string | null, to: string | null): boolean {
  return (
    isDateKey(from) &&
    isDateKey(to) &&
    from <= to &&
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
      86400000 <=
      365
  );
}
function DateRange({
  from,
  to,
  onApply,
}: {
  from: string;
  to: string;
  onApply: (from: string, to: string) => void;
}) {
  const t = useTranslation();
  const [start, setStart] = useState(from),
    [end, setEnd] = useState(to);
  const [error, setError] = useState(false);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!validRange(start, end)) {
          setError(true);
          return;
        }
        setError(false);
        onApply(start, end);
      }}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1">
          <Input
            label={t.trainingProgress.from}
            type="date"
            required
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <Input
            label={t.trainingProgress.to}
            type="date"
            required
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
        <button type="submit" className="secondary-button h-12">
          {t.trainingProgress.apply}
        </button>
      </div>
      {error && (
        <p role="alert" className="form-error">
          {t.trainingProgress.invalidDates}
        </p>
      )}
    </form>
  );
}
function WorkoutHistory({ sessions }: { sessions: SessionProgress[] }) {
  const t = useTranslation();
  const language = usePreferencesStore((s) => s.language);
  const [page, setPage] = useState(0);
  const total = Math.ceil(sessions.length / 10);
  const current = Math.min(page, Math.max(0, total - 1));
  return (
    <section className="panel space-y-4">
      <h2 className="text-lg font-medium">{t.trainingProgress.history}</h2>
      <ul className="divide-y divide-surface-elevated/40">
        {sessions.slice(current * 10, current * 10 + 10).map((session) => (
          <li
            key={session.id}
            className="flex flex-wrap items-center justify-between gap-3 py-4"
          >
            <div className="min-w-0">
              <p className="text-xs text-text-subtle">
                {new Intl.DateTimeFormat(language, {
                  dateStyle: "long",
                }).format(new Date(`${session.date}T12:00:00`))}
              </p>
              <h3 className="mt-1 break-words font-medium">{session.name}</h3>
              <p className="mt-1 text-xs text-text-subtle">
                {session.completed_exercises} {t.workoutLog.doneCount} ·{" "}
                {session.sets} {t.training.setsUnit}
              </p>
            </div>
            <Link
              to={`/?date=${session.date}`}
              className="secondary-button gap-2 text-xs"
            >
              {t.trainingProgress.details}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
      {total > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-elevated/40 pt-4">
          <p className="text-xs text-text-subtle">
            {t.common.page} {current + 1} / {total}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="secondary-button"
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
            >
              {t.common.previous}
            </button>
            <button
              type="button"
              className="secondary-button"
              disabled={current === total - 1}
              onClick={() => setPage(current + 1)}
            >
              {t.common.next}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
export function TrainingProgressPage() {
  const t = useTranslation();
  const p = t.trainingProgress;
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const today = useTodayDate();
  const [params, setParams] = useSearchParams();
  const requestedFrom = params.get("from"),
    requestedTo = params.get("to");
  const valid = validRange(requestedFrom, requestedTo);
  const from = valid ? requestedFrom! : shiftDate(today, -89),
    to = valid ? requestedTo! : today;
  const requestedExercise = params.get("exercise");
  const exerciseId =
    requestedExercise &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      requestedExercise,
    ) &&
    requestedExercise !== "00000000-0000-0000-0000-000000000000"
      ? requestedExercise
      : null;
  const { state, reload } = useTrainingProgress(from, to, exerciseId, userId);
  const language = usePreferencesStore((s) => s.language);
  const format = (n: number) => new Intl.NumberFormat(language).format(n);
  const apply = (start: string, end: string) =>
    setParams((previous) => {
      previous.set("from", start);
      previous.set("to", end);
      return previous;
    });
  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{t.navigation.training}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {p.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-subtle">
            {p.description}
          </p>
        </div>
        <button
          type="button"
          className="icon-button mt-2"
          aria-label={p.refresh}
          title={p.refresh}
          disabled={state.status === "loading"}
          onClick={reload}
        >
          <RotateCw size={17} />
        </button>
      </header>
      <TrainingNavigation />
      <section className="panel space-y-5">
        <h2 className="text-sm font-medium">{p.range}</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { days: 30, label: p.days30 },
            { days: 90, label: p.days90 },
            { days: 365, label: p.year },
          ].map((preset) => (
            <button
              type="button"
              key={preset.days}
              aria-pressed={
                from === shiftDate(today, 1 - preset.days) && to === today
              }
              onClick={() => apply(shiftDate(today, 1 - preset.days), today)}
              className={`secondary-button text-xs ${from === shiftDate(today, 1 - preset.days) && to === today ? "border-green/40 text-green" : ""}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <DateRange key={`${from}:${to}`} from={from} to={to} onApply={apply} />
      </section>
      {state.status === "loading" && (
        <p role="status" className="panel text-sm text-text-subtle">
          {p.loading}
        </p>
      )}
      {state.status === "error" && (
        <section role="alert" className="panel space-y-4">
          <p>{p.failed}</p>
          <button type="button" className="secondary-button" onClick={reload}>
            {t.common.retry}
          </button>
        </section>
      )}
      {state.status === "success" && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: p.sessions, value: state.data.sessions.length },
              {
                label: p.sets,
                value: state.data.sessions.reduce((sum, s) => sum + s.sets, 0),
              },
              {
                label: p.reps,
                value: state.data.sessions.reduce((sum, s) => sum + s.reps, 0),
              },
            ].map((item) => (
              <section key={item.label} className="panel">
                <h2 className="text-sm text-text-subtle">{item.label}</h2>
                <p className="mt-4 text-3xl font-semibold tabular-nums">
                  {format(item.value)}
                </p>
              </section>
            ))}
          </div>
          {!state.data.sessions.length ? (
            <section className="panel py-12 text-center">
              <Activity
                size={28}
                className="mx-auto text-green"
                aria-hidden="true"
              />
              <h2 className="mt-4 text-lg font-medium">{p.noData}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-subtle">
                {p.noDataHint}
              </p>
              <Link to="/" className="secondary-button mt-6">
                {p.goHome}
              </Link>
            </section>
          ) : (
            <>
              {state.data.exercises.length > 0 && (
                <ExerciseProgress
                  key={`${from}:${to}:${state.data.selected_exercise_id}`}
                  data={state.data}
                  onExercise={(id) =>
                    setParams((previous) => {
                      previous.set("exercise", id);
                      return previous;
                    })
                  }
                />
              )}
              <WorkoutHistory
                key={`${from}:${to}`}
                sessions={state.data.sessions}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
