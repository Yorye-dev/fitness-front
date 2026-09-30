import axios from "axios";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { TrainingProgress } from "../types/progress.types";
import type {
  WorkoutSession,
  SessionUpdate,
  DailyWorkout,
  RoutineInput,
  TrainingWorkspace,
  WeeklySchedule,
  WorkoutRoutine,
} from "../types/training.types";

export async function getTrainingWorkspace(
  signal: AbortSignal,
): Promise<TrainingWorkspace> {
  const [routines, schedule] = await Promise.all([
    apiClient.get<ApiResponse<WorkoutRoutine[]>>("/api/training/routines", {
      signal,
    }),
    apiClient.get<ApiResponse<WeeklySchedule>>("/api/training/week", {
      signal,
    }),
  ]);
  return { routines: routines.data.data, schedule: schedule.data.data };
}

export async function getTrainingProgress(
  from: string,
  to: string,
  exerciseId: string | null,
  signal: AbortSignal,
): Promise<TrainingProgress> {
  const { data } = await apiClient.get<ApiResponse<TrainingProgress>>(
    "/api/training/progress",
    { params: { from, to, exercise_id: exerciseId ?? undefined }, signal },
  );
  return data.data;
}
export async function saveRoutine(
  id: string,
  input: RoutineInput,
): Promise<WorkoutRoutine> {
  const { data } = await apiClient.put<ApiResponse<WorkoutRoutine>>(
    `/api/training/routines/${id}`,
    input,
  );
  return data.data;
}
export async function archiveRoutine(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/training/routines/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return;
    throw error;
  }
}
export async function saveWeeklySchedule(
  schedule: WeeklySchedule,
): Promise<WeeklySchedule> {
  const { data } = await apiClient.put<ApiResponse<WeeklySchedule>>(
    "/api/training/week",
    schedule,
  );
  return data.data;
}
export async function getDailyWorkout(
  date: string,
  signal: AbortSignal,
): Promise<DailyWorkout> {
  const { data } = await apiClient.get<ApiResponse<DailyWorkout>>(
    "/api/training/daily",
    { params: { date }, signal },
  );
  return data.data;
}

export async function startWorkout(
  date: string,
  routine_id: string,
): Promise<WorkoutSession> {
  const { data } = await apiClient.post<ApiResponse<WorkoutSession>>(
    "/api/training/sessions",
    { date, routine_id },
  );
  return data.data;
}
export async function saveWorkout(
  id: string,
  input: SessionUpdate,
): Promise<WorkoutSession> {
  const { data } = await apiClient.put<ApiResponse<WorkoutSession>>(
    `/api/training/sessions/${id}`,
    input,
  );
  return data.data;
}
