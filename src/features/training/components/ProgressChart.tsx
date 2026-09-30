import { useId } from "react";
import { usePreferencesStore } from "@/stores/preferences.store";
import { progressValue } from "../lib/progress";
import type {
  ExerciseProgressPoint,
  ProgressMetric,
} from "../types/progress.types";

export function ProgressChart({
  points,
  metric,
  label,
  unit,
}: {
  points: ExerciseProgressPoint[];
  metric: ProgressMetric;
  label: string;
  unit: string;
}) {
  const language = usePreferencesStore((s) => s.language);
  const title = useId();
  const format = (n: number) =>
    new Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(n);
  const date = (d: string) =>
    new Intl.DateTimeFormat(language, {
      day: "numeric",
      month: "short",
    }).format(new Date(`${d}T12:00:00`));
  const values = points.flatMap((p) => {
    const value = progressValue(p, metric);
    return value === null ? [] : [{ ...p, value }];
  });
  if (!values.length) return null;
  const left = 68,
    right = 738,
    top = 16,
    bottom = 226;
  const time = (d: string) => Date.parse(`${d}T12:00:00Z`);
  const start = time(values[0].date),
    end = time(values[values.length - 1].date);
  const ceiling = Math.max(1, ...values.map((p) => p.value)) * 1.1;
  const x = (d: string) =>
    start === end
      ? (left + right) / 2
      : left + ((time(d) - start) / (end - start)) * (right - left);
  const y = (n: number) => bottom - (n / ceiling) * (bottom - top);
  const line = values
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.date)},${y(p.value)}`)
    .join(" ");
  return (
    <svg
      viewBox="0 0 760 266"
      role="img"
      aria-labelledby={title}
      className="w-full overflow-visible"
    >
      <title id={title}>
        {label} ({unit}): {date(values[0].date)} –{" "}
        {date(values[values.length - 1].date)}
      </title>
      {[0, 0.5, 1].map((ratio) => (
        <g key={ratio}>
          <line
            x1={left}
            x2={right}
            y1={y(ceiling * ratio)}
            y2={y(ceiling * ratio)}
            stroke="var(--color-surface-elevated)"
            strokeOpacity="0.6"
            strokeDasharray={ratio === 0 ? undefined : "3 5"}
          />
          <text
            x={left - 10}
            y={y(ceiling * ratio) + 4}
            textAnchor="end"
            fontSize="12"
            fill="var(--color-text-subtle)"
          >
            {format(ceiling * ratio)}
          </text>
        </g>
      ))}
      <path
        d={line}
        fill="none"
        stroke="var(--color-green)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {values.map((p) => (
        <circle
          key={p.session_id}
          cx={x(p.date)}
          cy={y(p.value)}
          r={values.length > 60 ? 2 : 3.5}
          fill="var(--color-green)"
          stroke="var(--color-bg)"
          strokeWidth="1.5"
        >
          <title>
            {p.date}: {format(p.value)} {unit}
          </title>
        </circle>
      ))}
      <text
        x={start === end ? (left + right) / 2 : left}
        y={253}
        textAnchor={start === end ? "middle" : "start"}
        fontSize="12"
        fill="var(--color-text-subtle)"
      >
        {date(values[0].date)}
      </text>
      {start !== end && (
        <text
          x={right}
          y={253}
          textAnchor="end"
          fontSize="12"
          fill="var(--color-text-subtle)"
        >
          {date(values[values.length - 1].date)}
        </text>
      )}
    </svg>
  );
}
