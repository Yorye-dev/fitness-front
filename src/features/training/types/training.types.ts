export type ExerciseModality = "strength" | "cardio" | "mobility";
export interface RoutineExercise {
  name: string;
  modality: ExerciseModality;
  target_sets: number;
  target_reps_min: number | null;
  target_reps_max: number | null;
  target_load_kg: number | null;
  target_duration_seconds: number | null;
  rest_seconds: number;
  notes: string;
}
export interface RoutineInput {
  name: string;
  description: string;
  exercises: RoutineExercise[];
}
export interface WorkoutRoutine extends RoutineInput {
  id: string;
}
export interface WeeklyDay {
  weekday: number;
  routine_id: string | null;
}
export interface WeeklySchedule {
  days: WeeklyDay[];
}
export interface TrainingWorkspace {
  routines: WorkoutRoutine[];
  schedule: WeeklySchedule;
}
export interface DailyWorkout {
  session: WorkoutSession | null;
  date: string;
  weekday: number;
  routine: WorkoutRoutine | null;
}

export type ExerciseStatus = "pending" | "completed" | "skipped";
export interface PerformedSet {
  reps: number | null;
  load_kg: number | null;
  duration_seconds: number | null;
}
export interface SessionExercise extends Omit<RoutineExercise, "rest_seconds"> {
  id: string;
  exercise_id: string;
  status: ExerciseStatus;
  sets: PerformedSet[];
}
export interface WorkoutSession {
  id: string;
  routine_id: string | null;
  date: string;
  name: string;
  status: "in_progress" | "completed";
  revision: number;
  exercises: SessionExercise[];
}
export interface SessionUpdate {
  write_id: string;
  revision: number;
  complete: boolean;
  exercises: Pick<SessionExercise, "id" | "status" | "sets">[];
}
