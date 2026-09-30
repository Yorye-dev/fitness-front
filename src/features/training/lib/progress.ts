import type {
  ExerciseProgressPoint,
  ProgressMetric,
} from "../types/progress.types";

export function progressValue(
  point: ExerciseProgressPoint,
  metric: ProgressMetric,
): number | null {
  return metric === "duration_seconds"
    ? point.duration_seconds / 60
    : point[metric];
}
