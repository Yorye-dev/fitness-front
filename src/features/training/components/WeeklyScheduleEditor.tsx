import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/hooks/useTranslation";
import type { WeeklySchedule, WorkoutRoutine } from "../types/training.types";

export function WeeklyScheduleEditor({
  schedule,
  routines,
  busy,
  onChange,
}: {
  schedule: WeeklySchedule;
  routines: WorkoutRoutine[];
  busy: boolean;
  onChange: (schedule: WeeklySchedule) => void;
}) {
  const t = useTranslation();
  return (
    <section className="panel space-y-5" aria-busy={busy}>
      <div>
        <h2 className="text-lg font-medium">{t.training.weekTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-subtle">
          {t.training.weekHint}
        </p>
      </div>
      <fieldset
        disabled={busy}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {schedule.days.map((day) => (
          <Select
            key={day.weekday}
            label={t.training.weekdays[day.weekday - 1]}
            value={day.routine_id ?? ""}
            onChange={(event) =>
              onChange({
                days: schedule.days.map((item) =>
                  item.weekday === day.weekday
                    ? { ...item, routine_id: event.target.value || null }
                    : item,
                ),
              })
            }
          >
            <option value="">{t.training.restDay}</option>
            {routines.map((routine) => (
              <option key={routine.id} value={routine.id}>
                {routine.name}
              </option>
            ))}
          </Select>
        ))}
      </fieldset>
      <p role="status" className="text-xs text-text-subtle">
        {busy ? t.training.saving : t.training.autoSaveHint}
      </p>
      {routines.length === 0 && (
        <p className="text-sm text-text-subtle">{t.training.weekEmpty}</p>
      )}
    </section>
  );
}
