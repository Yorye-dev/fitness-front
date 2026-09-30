import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/stores/preferences.store";
import type { RoutineExercise } from "../types/training.types";

export function RoutineExerciseList({
  exercises,
}: {
  exercises: RoutineExercise[];
}) {
  const t = useTranslation();
  const language = usePreferencesStore((state) => state.language);
  const format = (value: number) =>
    new Intl.NumberFormat(language, { maximumFractionDigits: 3 }).format(value);
  return (
    <ol className="divide-y divide-surface-elevated/50">
      {exercises.map((exercise, index) => (
        <li key={index} className="flex gap-3 py-4">
          <span className="mt-0.5 text-xs tabular-nums text-text-subtle">
            {index + 1}.
          </span>
          <div className="min-w-0 flex-1">
            <p className="break-words text-sm font-medium">{exercise.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-text-subtle">
              {exercise.target_sets} {t.training.setsUnit} ×{" "}
              {exercise.modality === "strength" ? (
                <>
                  {exercise.target_reps_min}
                  {exercise.target_reps_max !== exercise.target_reps_min && (
                    <>–{exercise.target_reps_max}</>
                  )}{" "}
                  {t.training.repsUnit}
                </>
              ) : (
                <>
                  {exercise.target_duration_seconds} {t.training.secondsUnit}
                </>
              )}
              {exercise.target_load_kg !== null && (
                <> · {format(exercise.target_load_kg)} kg</>
              )}
              {" · "}
              {t.training.restLabel} {exercise.rest_seconds}{" "}
              {t.training.secondsUnit}
            </p>
            {exercise.notes && (
              <p className="mt-2 whitespace-pre-wrap break-words text-xs text-text-subtle">
                {exercise.notes}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
