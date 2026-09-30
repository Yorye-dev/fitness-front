import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { RoutineExerciseList } from "@/features/training/components/RoutineExerciseList";
import { useDailyWorkout } from "@/features/training/hooks/useDailyWorkout";
import { useTranslation } from "@/hooks/useTranslation";

export function DailyTraining({
  date,
  revision,
}: {
  date: string;
  revision: number;
}) {
  const t = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? "");
  const { state, reload } = useDailyWorkout(date, userId, revision);
  return (
    <section className="panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-green/10 p-3 text-green">
            <Dumbbell size={22} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-medium">{t.dashboard.dailyTraining}</h2>
        </div>
        <Link
          to="/training"
          className="rounded-lg px-2 py-2 text-xs text-green underline-offset-4 hover:underline"
        >
          {t.training.manage}
        </Link>
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
          <p className="eyebrow">
            {t.training.weekdays[state.data.weekday - 1]}
          </p>
          {state.data.routine ? (
            <>
              <h3 className="mt-2 break-words text-xl font-semibold">
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
    </section>
  );
}
