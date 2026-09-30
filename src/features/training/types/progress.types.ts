export interface SessionProgress {
  id: string;
  date: string;
  name: string;
  completed_exercises: number;
  sets: number;
  reps: number;
  volume_kg: number;
  duration_seconds: number;
}
export interface ExerciseProgressPoint {
  session_id: string;
  date: string;
  sets: number;
  reps: number;
  max_load_kg: number | null;
  volume_kg: number;
  duration_seconds: number;
}
export interface TrainingProgress {
  sessions: SessionProgress[];
  exercises: {
    id: string;
    name: string;
    modality: "strength" | "cardio" | "mobility";
  }[];
  selected_exercise_id: string | null;
  points: ExerciseProgressPoint[];
}
export type ProgressMetric =
  "max_load_kg" | "reps" | "volume_kg" | "duration_seconds" | "sets";
