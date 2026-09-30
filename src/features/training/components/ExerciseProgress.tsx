import { useState } from "react";
import { Link } from "react-router-dom";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/hooks/useTranslation";
import { usePreferencesStore } from "@/stores/preferences.store";
import type { TrainingProgress, ProgressMetric } from "../types/progress.types";
import { ProgressChart } from "./ProgressChart";
import { progressValue } from "../lib/progress";

export function ExerciseProgress({
  data,
  onExercise,
}: {
  data: TrainingProgress;
  onExercise: (id: string) => void;
}) {
  const t = useTranslation();
  const p = t.trainingProgress;
  const language = usePreferencesStore((s) => s.language);
  const selected = data.exercises.find(
    (e) => e.id === data.selected_exercise_id,
  );
  const strength = selected?.modality === "strength";
  const [chosen, setChosen] = useState<ProgressMetric>(
    strength ? "max_load_kg" : "duration_seconds",
  );
  const [limit, setLimit] = useState(10);
  const metrics: {
    key: ProgressMetric;
    label: string;
    unit: string;
    hint: string;
  }[] = strength
    ? [
        { key: "max_load_kg", label: p.load, unit: "kg", hint: p.loadHint },
        {
          key: "reps",
          label: p.pointReps,
          unit: t.training.repsUnit,
          hint: p.repsHint,
        },
        {
          key: "volume_kg",
          label: p.volume,
          unit: p.volumeUnit,
          hint: p.volumeHint,
        },
        {
          key: "sets",
          label: p.pointSets,
          unit: t.training.setsUnit,
          hint: p.setsHint,
        },
      ]
    : [
        {
          key: "duration_seconds",
          label: p.duration,
          unit: p.minutes,
          hint: p.durationHint,
        },
        {
          key: "sets",
          label: p.pointSets,
          unit: t.training.setsUnit,
          hint: p.setsHint,
        },
      ];
  const metric = metrics.find((m) => m.key === chosen) ?? metrics[0];
  const format = (n: number) =>
    new Intl.NumberFormat(language, { maximumFractionDigits: 3 }).format(n);
  const dates = (d: string) =>
    new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(
      new Date(`${d}T12:00:00`),
    );
  const values = data.points.flatMap((point) => {
    const value = progressValue(point, metric.key);
    return value === null ? [] : [value];
  });
  const delta =
    values.length > 1 ? values[values.length - 1] - values[0] : null;
  return (
    <section className="panel space-y-6">
      <div>
        <h2 className="text-lg font-medium">{p.trend}</h2>
        <p className="mt-2 text-xs text-text-subtle">{p.scope}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={p.exercise}
          value={selected?.id ?? ""}
          onChange={(e) => onExercise(e.target.value)}
        >
          {data.exercises.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} · {t.training.modalities[e.modality]}
            </option>
          ))}
        </Select>
        <Select
          label={p.metric}
          value={metric.key}
          onChange={(e) => setChosen(e.target.value as ProgressMetric)}
        >
          {metrics.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </Select>
      </div>
      {values.length ? (
        <>
          <div className="grid grid-cols-3 gap-3 border-y border-surface-elevated/40 py-4">
            {[
              { label: p.first, value: format(values[0]) },
              { label: p.latest, value: format(values[values.length - 1]) },
              {
                label: p.change,
                value:
                  delta === null
                    ? "—"
                    : `${delta > 0 ? "+" : ""}${format(delta)}`,
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-text-subtle">{item.label}</p>
                <p className="mt-2 text-lg font-medium tabular-nums sm:text-xl">
                  {item.value}{" "}
                  <span className="text-xs font-normal text-text-subtle">
                    {metric.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-text-subtle">
            {metric.hint}
          </p>
          <ProgressChart
            points={data.points}
            metric={metric.key}
            label={`${selected?.name} · ${metric.label}`}
            unit={metric.unit}
          />
          {values.length === 1 && (
            <p className="text-sm text-text-subtle">{p.fewPoints}</p>
          )}
        </>
      ) : (
        <p className="text-sm text-text-subtle">{p.noExercise}</p>
      )}
      <details className="border-t border-surface-elevated/50 pt-4">
        <summary className="cursor-pointer rounded-lg py-2 text-sm text-green">
          {p.dataTable}
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              {p.results}: {selected?.name}
            </caption>
            <thead className="text-xs text-text-subtle">
              <tr>
                <th scope="col" className="p-2">
                  {p.date}
                </th>
                <th scope="col" className="p-2">
                  {p.pointSets}
                </th>
                {strength ? (
                  <>
                    <th scope="col" className="p-2">
                      {p.load} (kg)
                    </th>
                    <th scope="col" className="p-2">
                      {p.pointReps}
                    </th>
                    <th scope="col" className="p-2">
                      {p.volume} ({p.volumeUnit})
                    </th>
                  </>
                ) : (
                  <th scope="col" className="p-2">
                    {p.duration} ({p.minutes})
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.points
                .slice()
                .reverse()
                .slice(0, limit)
                .map((point) => (
                  <tr
                    key={point.session_id}
                    className="border-t border-surface-elevated/40 tabular-nums"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap p-2 font-normal"
                    >
                      <Link
                        to={`/?date=${point.date}`}
                        className="text-green underline-offset-4 hover:underline"
                      >
                        {dates(point.date)}
                      </Link>
                    </th>
                    <td className="p-2">{point.sets}</td>
                    {strength ? (
                      <>
                        <td className="p-2">
                          {point.max_load_kg === null
                            ? "—"
                            : format(point.max_load_kg)}
                        </td>
                        <td className="p-2">{format(point.reps)}</td>
                        <td className="p-2">{format(point.volume_kg)}</td>
                      </>
                    ) : (
                      <td className="p-2">
                        {format(point.duration_seconds / 60)}
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {limit < data.points.length && (
          <button
            type="button"
            className="secondary-button mt-4"
            onClick={() => setLimit((n) => n + 10)}
          >
            {t.common.next} (+10)
          </button>
        )}
      </details>
    </section>
  );
}
