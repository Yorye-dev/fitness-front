import {
  CheckCircle2,
  Circle,
  Dumbbell,
  LoaderCircle,
  Play,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { RoutineExerciseList } from "@/features/training/components/RoutineExerciseList";
import { WorkoutSessionDialog } from "@/features/training/components/WorkoutSessionDialog";
import { useDailyWorkout } from "@/features/training/hooks/useDailyWorkout";
import { startWorkout } from "@/features/training/services/training.service";
import type { WorkoutSession } from "@/features/training/types/training.types";
import { useTranslation } from "@/hooks/useTranslation";
import { localDateKey } from "@/lib/date";
import { usePreferencesStore } from "@/stores/preferences.store";

export function DailyTraining({
  date,
  revision,
}: {
  date: string;
  revision: number;
}) {
  const t = useTranslation();
  const language = usePreferencesStore((s) => s.language);
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const { state, reload } = useDailyWorkout(date, userId, revision);
  const [editing, setEditing] = useState<WorkoutSession | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flight = useRef(false);
  const future = date > localDateKey();
  const begin = async (routine: string) => {
    if (flight.current) return;
    flight.current = true;
    setBusy(true);
    setError(null);
    try {
      setEditing(await startWorkout(date, routine));
      reload();
    } catch {
      setError(t.workoutLog.startedFailed);
    } finally {
      setBusy(false);
      flight.current = false;
    }
  };
  const format = (n: number) =>
    new Intl.NumberFormat(language, { maximumFractionDigits: 3 }).format(n);
  return (
    <section className="panel self-start">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-green/10 p-3 text-green">
            <Dumbbell size={22} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-medium">{t.dashboard.dailyTraining}</h2>
        </div>
        <div className="flex flex-wrap gap-1">
          <Link
            to="/training/progress"
            className="rounded-lg px-2 py-2 text-xs text-text-subtle underline-offset-4 hover:text-green hover:underline"
          >
            {t.trainingProgress.link}
          </Link>
          <Link
            to="/training"
            className="rounded-lg px-2 py-2 text-xs text-green underline-offset-4 hover:underline"
          >
            {t.training.manage}
          </Link>
        </div>
      </div>
      {state.status === "loading" && (
        <p role="status" className="mt-5 text-sm text-text-subtle">
          {t.training.loading}
        </p>
      )}
      {state.status === "error" && (
        <div role="alert" className="mt-5 space-y-3">
          <p className="text-sm text-text-subtle">{t.training.loadFailed}</p>
          <button type="button" onClick={reload} className="secondary-button">
            {t.common.retry}
          </button>
        </div>
      )}
      {state.status === "success" && (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">
              {t.training.weekdays[state.data.weekday - 1]}
            </p>
            {(state.data.routine || state.data.session) && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${state.data.session?.status === "completed" ? "border-green/30 bg-green/10 text-green" : state.data.session ? "border-yellow/30 bg-yellow/10 text-yellow" : "border-surface-elevated text-text-subtle"}`}
              >
                {state.data.session?.status === "completed" ? (
                  <CheckCircle2 size={14} />
                ) : state.data.session ? (
                  <LoaderCircle size={14} />
                ) : (
                  <Circle size={14} />
                )}
                {state.data.session?.status === "completed"
                  ? t.workoutLog.completed
                  : state.data.session
                    ? t.workoutLog.inProgress
                    : t.workoutLog.pending}
              </span>
            )}
          </div>
          {state.data.session ? (
            <>
              <h3 className="mt-3 break-words text-xl font-semibold">
                {state.data.session.name}
              </h3>
              <p className="mt-2 text-sm text-text-subtle">
                {state.data.session.status === "completed"
                  ? t.workoutLog.finishedHint
                  : t.workoutLog.progressHint}
              </p>
              <p className="mt-3 text-xs text-text-subtle">
                {
                  state.data.session.exercises.filter(
                    (e) => e.status === "completed",
                  ).length
                }{" "}
                / {state.data.session.exercises.length} {t.workoutLog.doneCount}
              </p>
              <div
                className="my-3 h-1.5 overflow-hidden rounded-full bg-surface-elevated/50"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-green transition-all"
                  style={{
                    width: `${(state.data.session.exercises.filter((e) => e.status !== "pending").length / state.data.session.exercises.length) * 100}%`,
                  }}
                />
              </div>
              <ul className="divide-y divide-surface-elevated/50">
                {state.data.session.exercises.map((exercise) => (
                  <li key={exercise.id} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="break-words text-sm font-medium">
                        {exercise.name}
                      </p>
                      <span
                        className={`shrink-0 text-xs ${exercise.status === "completed" ? "text-green" : "text-text-subtle"}`}
                      >
                        {exercise.status === "completed"
                          ? t.workoutLog.completed
                          : exercise.status === "skipped"
                            ? t.workoutLog.skipped
                            : t.workoutLog.pending}
                      </span>
                    </div>
                    {exercise.status === "completed" && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {exercise.sets.map((set, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-surface/60 px-2 py-1 text-xs tabular-nums text-text-subtle"
                          >
                            {i + 1}:{" "}
                            {exercise.modality === "strength"
                              ? `${set.reps} × ${set.load_kg === null ? "—" : format(set.load_kg)} kg`
                              : `${set.duration_seconds} s`}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="secondary-button mt-4 w-full gap-2 text-green"
                onClick={() => setEditing(state.data.session)}
              >
                {state.data.session.status === "completed"
                  ? t.workoutLog.review
                  : t.workoutLog.resume}
              </button>
              <p className="mt-3 text-xs text-text-subtle">
                {t.workoutLog.snapshotHint}
              </p>
            </>
          ) : state.data.routine ? (
            <>
              <h3 className="mt-3 break-words text-xl font-semibold">
                {state.data.routine.name}
              </h3>
              {state.data.routine.description && (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-text-subtle">
                  {state.data.routine.description}
                </p>
              )}
              <p className="mt-3 text-xs text-text-subtle">
                {t.training.plannedLabel}
              </p>
              <RoutineExerciseList exercises={state.data.routine.exercises} />
              <button
                type="button"
                disabled={busy || future}
                className="secondary-button mt-3 w-full gap-2 text-green"
                onClick={() => void begin(state.data.routine!.id)}
              >
                <Play size={16} />
                {busy ? t.common.processing : t.workoutLog.start}
              </button>
              {future && (
                <p className="mt-3 text-xs text-text-subtle">
                  {t.workoutLog.future}
                </p>
              )}
            </>
          ) : (
            <>
              <h3 className="mt-2 font-medium">{t.training.noWorkout}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-subtle">
                {t.training.noWorkoutHint}
              </p>
            </>
          )}
        </div>
      )}
      {error && (
        <p role="alert" className="form-error mt-4">
          {error}
        </p>
      )}
      {editing && (
        <WorkoutSessionDialog
          session={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </section>
  );
}
