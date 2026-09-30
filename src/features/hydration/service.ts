import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { DailyWater } from "./types";
export async function getWater(
  date: string,
  signal?: AbortSignal,
): Promise<DailyWater> {
  const { data } = await apiClient.get<ApiResponse<DailyWater>>(
    "/api/water/daily",
    { params: { date }, signal },
  );
  return data.data;
}
export async function addWater(
  date: string,
  id: string,
  amount_ml: number,
): Promise<DailyWater> {
  const { data } = await apiClient.post<ApiResponse<DailyWater>>(
    "/api/water/intakes",
    { date, id, amount_ml },
  );
  return data.data;
}
export async function removeWater(id: string): Promise<void> {
  await apiClient.delete(`/api/water/intakes/${id}`);
}
export async function setWaterGoal(
  date: string,
  goal_ml: number,
): Promise<DailyWater> {
  const { data } = await apiClient.put<ApiResponse<DailyWater>>(
    "/api/water/goal",
    { date, goal_ml },
  );
  return data.data;
}
