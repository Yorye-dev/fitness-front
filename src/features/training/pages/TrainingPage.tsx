import { Archive, Dumbbell, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useTranslation } from "@/hooks/useTranslation";
import { newEntryId } from "@/lib/uuid";
import { RoutineEditorDialog } from "../components/RoutineEditorDialog";
import { RoutineExerciseList } from "../components/RoutineExerciseList";
import { WeeklyScheduleEditor } from "../components/WeeklyScheduleEditor";
import { TrainingNavigation } from "../components/TrainingNavigation";
import { useTrainingWorkspace } from "../hooks/useTrainingWorkspace";
import { trainingErrorMessage } from "../lib/errors";
import {
  archiveRoutine,
  saveWeeklySchedule,
} from "../services/training.service";
import type { WeeklySchedule, WorkoutRoutine } from "../types/training.types";

type Action =
  | { type: "create"; id: string }
  | { type: "edit" | "archive"; routine: WorkoutRoutine }
  | null;
export function TrainingPage() {
  const t = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? "");
  const { state, reload } = useTrainingWorkspace(userId);
  const [action, setAction] = useState<Action>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const changed = (message: string) => {
    setAction(null);
    setError(null);
    setNotice(message);
    reload();
  };
  const updateWeek = async (schedule: WeeklySchedule) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await saveWeeklySchedule(schedule);
      changed(t.training.weekSaved);
    } catch (failure) {
      setError(trainingErrorMessage(failure, t));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">{t.training.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {t.training.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-subtle">
            {t.training.description}
          </p>
        </div>
        <button
          type="button"
          className="secondary-button gap-2 text-green"
          disabled={busy}
          onClick={() => {
            setError(null);
            setNotice(null);
            setAction({ type: "create", id: newEntryId() });
          }}
        >
          <Plus size={17} aria-hidden="true" />
          {t.training.newRoutine}
        </button>
      </header>
      <TrainingNavigation />
      {notice && (
        <p
          role="status"
          className="rounded-xl border border-green/30 bg-green/5 px-4 py-3 text-sm text-green"
        >
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {state.status === "loading" && (
        <p role="status" className="panel text-sm text-text-subtle">
          {t.training.loading}
        </p>
      )}
      {state.status === "error" && (
        <section role="alert" className="panel space-y-4">
          <p>{t.training.loadFailed}</p>
          <button type="button" className="secondary-button" onClick={reload}>
            {t.common.retry}
          </button>
        </section>
      )}
      {state.status === "success" && (
        <>
          <WeeklyScheduleEditor
            schedule={state.data.schedule}
            routines={state.data.routines}
            busy={busy}
            onChange={(schedule) => {
              void updateWeek(schedule);
            }}
          />
          <section className="space-y-4">
            <h2 className="text-lg font-medium">{t.training.routinesTitle}</h2>
            {state.data.routines.length === 0 ? (
              <div className="panel py-10 text-center">
                <Dumbbell
                  size={26}
                  className="mx-auto text-green"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-medium">{t.training.noRoutines}</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-text-subtle">
                  {t.training.noRoutinesHint}
                </p>
              </div>
            ) : (
              <div className="grid items-start gap-5 lg:grid-cols-2">
                {state.data.routines.map((routine) => (
                  <article key={routine.id} className="panel">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-medium">
                          {routine.name}
                        </h3>
                        <p className="mt-1 text-xs text-text-subtle">
                          {routine.exercises.length} {t.training.exercisesLabel}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          className="icon-button"
                          disabled={busy}
                          title={t.training.editRoutine}
                          aria-label={`${t.training.editRoutine}: ${routine.name}`}
                          onClick={() => setAction({ type: "edit", routine })}
                        >
                          <Pencil size={16} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          disabled={busy}
                          title={t.training.archiveRoutine}
                          aria-label={`${t.training.archiveRoutine}: ${routine.name}`}
                          onClick={() =>
                            setAction({ type: "archive", routine })
                          }
                        >
                          <Archive size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    {routine.description && (
                      <p className="mt-3 whitespace-pre-wrap break-words text-sm text-text-subtle">
                        {routine.description}
                      </p>
                    )}
                    <details className="mt-4">
                      <summary className="cursor-pointer rounded-lg py-2 text-sm text-green">
                        {t.training.viewExercises}
                      </summary>
                      <RoutineExerciseList exercises={routine.exercises} />
                    </details>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
      {(action?.type === "create" || action?.type === "edit") && (
        <RoutineEditorDialog
          id={action.type === "create" ? action.id : action.routine.id}
          routine={action.type === "edit" ? action.routine : undefined}
          onClose={() => setAction(null)}
          onSaved={() => changed(t.training.routineSaved)}
        />
      )}
      {action?.type === "archive" && (
        <ConfirmDialog
          title={t.training.archiveRoutine}
          onClose={() => setAction(null)}
          errorMessage={(failure) => trainingErrorMessage(failure, t)}
          onConfirm={async () => {
            await archiveRoutine(action.routine.id);
            changed(t.training.archived);
          }}
        >
          <p className="break-words font-medium">{action.routine.name}</p>
          <p className="text-sm leading-relaxed text-text-subtle">
            {t.training.archiveHint}
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
