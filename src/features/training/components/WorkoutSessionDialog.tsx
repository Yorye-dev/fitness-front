import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useBlocker } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/hooks/useTranslation";
import { newEntryId } from "@/lib/uuid";
import { saveWorkout } from "../services/training.service";
import type {
  ExerciseStatus,
  PerformedSet,
  SessionExercise,
  SessionUpdate,
  WorkoutSession,
} from "../types/training.types";

const numberValue = (value: string) => (value === "" ? null : Number(value));
const validInt = (n: number | null, min: number, max: number) =>
  n !== null && Number.isInteger(n) && n >= min && n <= max;

export function WorkoutSessionDialog({
  session,
  onClose,
  onSaved,
}: {
  session: WorkoutSession;
  onClose: () => void;
  onSaved: (saved: WorkoutSession) => void;
}) {
  const t = useTranslation();
  const [exercises, setExercises] = useState<SessionExercise[]>(() =>
    structuredClone(session.exercises),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  const dirty = JSON.stringify(exercises) !== JSON.stringify(session.exercises);
  const blocker = useBlocker(dirty);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (error || closing || blocker.state === "blocked") {
      feedback.current?.scrollIntoView({ block: "nearest" });
    }
  }, [error, closing, blocker.state]);
  useEffect(() => {
    if (!dirty) return;
    const leave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [dirty]);
  const change = (index: number, patch: Partial<SessionExercise>) => {
    setError(null);
    setExercises((current) =>
      current.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );
  };
  const changeSet = (
    index: number,
    setIndex: number,
    patch: Partial<PerformedSet>,
  ) =>
    change(index, {
      sets: exercises[index].sets.map((s, i) =>
        i === setIndex ? { ...s, ...patch } : s,
      ),
    });
  const submit = async (complete: boolean) => {
    if (busy) return;
    setError(null);
    if (
      complete &&
      (exercises.some((e) => e.status === "pending") ||
        !exercises.some((e) => e.status === "completed"))
    ) {
      setError(t.workoutLog.unresolved);
      return;
    }
    const invalid = exercises.some(
      (e) =>
        e.sets.length < 1 ||
        e.sets.length > 100 ||
        (e.status !== "skipped" &&
          e.sets.some((s) => {
            if (e.modality === "strength") {
              const weight = s.load_kg;
              return (
                (s.reps !== null && !validInt(s.reps, 1, 1000)) ||
                (weight !== null &&
                  (!Number.isFinite(weight) ||
                    weight < 0 ||
                    weight >= 100000 ||
                    Math.abs(weight * 1000 - Math.round(weight * 1000)) >=
                      0.000001)) ||
                (e.status === "completed" &&
                  (s.reps === null || weight === null))
              );
            }
            return (
              (s.duration_seconds !== null &&
                !validInt(s.duration_seconds, 1, 86400)) ||
              (e.status === "completed" && s.duration_seconds === null)
            );
          })),
    );
    if (invalid) {
      setError(t.workoutLog.invalid);
      return;
    }
    const results = exercises.map((e) => ({
      id: e.id,
      status: e.status,
      sets: e.sets.map((s) => ({
        reps:
          e.status === "skipped" || e.modality !== "strength" ? null : s.reps,
        load_kg:
          e.status === "skipped" || e.modality !== "strength"
            ? null
            : s.load_kg,
        duration_seconds:
          e.status === "skipped" || e.modality === "strength"
            ? null
            : s.duration_seconds,
      })),
    }));
    const payload = JSON.stringify({
      revision: session.revision,
      complete,
      exercises: results,
    });
    if (attempt.current?.payload !== payload)
      attempt.current = { payload, id: newEntryId() };
    const input: SessionUpdate = {
      revision: session.revision,
      complete,
      exercises: results,
      write_id: attempt.current.id,
    };
    setBusy(true);
    try {
      onSaved(await saveWorkout(session.id, input));
    } catch (failure) {
      setError(
        axios.isAxiosError(failure) && failure.response?.status === 409
          ? t.workoutLog.conflict
          : t.workoutLog.failed,
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      title={t.workoutLog.title}
      busy={busy}
      onClose={() => (dirty ? setClosing(true) : onClose())}
    >
      <div className="space-y-5">
        <div>
          <h3 className="break-words font-medium">{session.name}</h3>
          <p className="mt-1 text-xs text-text-subtle">
            {t.workoutLog.date}: {session.date}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-subtle">
            {t.workoutLog.hint}
          </p>
        </div>
        <fieldset disabled={busy} className="space-y-4">
          <button
            type="button"
            className="secondary-button w-full"
            onClick={() =>
              setExercises((current) =>
                current.map((e) =>
                  e.status === "pending" ? { ...e, status: "completed" } : e,
                ),
              )
            }
          >
            {t.workoutLog.allDone}
          </button>
          {exercises.map((exercise, index) => (
            <details
              key={exercise.id}
              open={index === 0 || undefined}
              className="rounded-xl border border-surface-elevated/60 p-4"
            >
              <summary className="cursor-pointer text-sm font-medium">
                <span className="break-words">
                  {index + 1}. {exercise.name}
                </span>
                <span
                  className={`mt-1 block text-xs ${exercise.status === "completed" ? "text-green" : "text-text-subtle"}`}
                >
                  {exercise.status === "pending"
                    ? t.workoutLog.pending
                    : exercise.status === "completed"
                      ? t.workoutLog.completed
                      : t.workoutLog.skipped}{" "}
                  · {exercise.sets.length} {t.training.setsUnit}
                </span>
              </summary>
              <div className="mt-4 space-y-4">
                <p className="text-xs text-text-subtle">
                  {t.workoutLog.planned}: {exercise.target_sets} ×{" "}
                  {exercise.modality === "strength"
                    ? `${exercise.target_reps_min}–${exercise.target_reps_max} ${t.training.repsUnit}`
                    : `${exercise.target_duration_seconds} s`}
                  {exercise.target_load_kg !== null
                    ? ` · ${exercise.target_load_kg} kg`
                    : ""}
                </p>
                {exercise.notes && (
                  <p className="whitespace-pre-wrap break-words text-xs text-text-subtle">
                    {exercise.notes}
                  </p>
                )}
                <Select
                  label={t.workoutLog.status}
                  value={exercise.status}
                  onChange={(event) =>
                    change(index, {
                      status: event.target.value as ExerciseStatus,
                    })
                  }
                >
                  <option value="pending">{t.workoutLog.pending}</option>
                  <option value="completed">{t.workoutLog.completed}</option>
                  <option value="skipped">{t.workoutLog.skipped}</option>
                </Select>
                {exercise.status !== "skipped" && (
                  <>
                    {exercise.modality === "strength" && (
                      <p className="text-xs text-text-subtle">
                        {t.workoutLog.unknownWeight}
                      </p>
                    )}
                    {exercise.sets.map((set, setIndex) => (
                      <div
                        key={setIndex}
                        className="space-y-2 border-t border-surface-elevated/40 pt-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">
                            {t.workoutLog.set} {setIndex + 1}
                          </span>
                          <button
                            type="button"
                            className="icon-button h-8 w-8"
                            disabled={exercise.sets.length <= 1}
                            aria-label={`${t.workoutLog.removeSet} ${setIndex + 1}`}
                            onClick={() =>
                              change(index, {
                                sets: exercise.sets.filter(
                                  (_, i) => i !== setIndex,
                                ),
                              })
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {exercise.modality === "strength" ? (
                            <>
                              <Input
                                label={t.workoutLog.weight}
                                type="number"
                                inputMode="decimal"
                                min={0}
                                max={99999.999}
                                step="0.001"
                                value={set.load_kg ?? ""}
                                onChange={(e) =>
                                  changeSet(index, setIndex, {
                                    load_kg: numberValue(e.target.value),
                                  })
                                }
                              />
                              <Input
                                label={t.workoutLog.reps}
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={1000}
                                step={1}
                                value={set.reps ?? ""}
                                onChange={(e) =>
                                  changeSet(index, setIndex, {
                                    reps: numberValue(e.target.value),
                                  })
                                }
                              />
                            </>
                          ) : (
                            <Input
                              label={t.workoutLog.seconds}
                              type="number"
                              inputMode="numeric"
                              min={1}
                              max={86400}
                              step={1}
                              value={set.duration_seconds ?? ""}
                              onChange={(e) =>
                                changeSet(index, setIndex, {
                                  duration_seconds: numberValue(e.target.value),
                                })
                              }
                            />
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="secondary-button gap-2"
                      disabled={exercise.sets.length >= 100}
                      onClick={() =>
                        change(index, {
                          sets: [
                            ...exercise.sets,
                            { ...exercise.sets[exercise.sets.length - 1] },
                          ],
                        })
                      }
                    >
                      <Plus size={15} />
                      {t.workoutLog.addSet}
                    </button>
                  </>
                )}
              </div>
            </details>
          ))}
        </fieldset>
        <div ref={feedback} className="space-y-3">
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {dirty && (
            <p className="text-xs text-text-subtle">{t.workoutLog.dirty}</p>
          )}
          {(closing || blocker.state === "blocked") && (
            <div
              role="alert"
              className="space-y-3 rounded-xl border border-orange/40 p-4"
            >
              <p className="text-sm">{t.workoutLog.closeHint}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setClosing(false);
                    if (blocker.state === "blocked") blocker.reset();
                  }}
                >
                  {t.workoutLog.keepEditing}
                </button>
                <button
                  type="button"
                  className="secondary-button text-red-light"
                  onClick={() => {
                    if (blocker.state === "blocked") blocker.proceed();
                    else onClose();
                  }}
                >
                  {t.workoutLog.discard}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-3 border-t border-surface-elevated/50 pt-4">
          {session.status !== "completed" && (
            <button
              type="button"
              disabled={busy}
              className="secondary-button w-full"
              onClick={() => void submit(false)}
            >
              {t.workoutLog.saveProgress}
            </button>
          )}
          <Button
            type="button"
            loading={busy}
            loadingLabel={t.workoutLog.saving}
            onClick={() => void submit(true)}
          >
            {session.status === "completed"
              ? t.workoutLog.saveCorrection
              : t.workoutLog.finish}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
