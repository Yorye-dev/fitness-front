import axios from "axios";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse, PaginatedResponse } from "@/lib/api/types";
import type {
  Consumption,
  DailyNutrition,
  Food,
  FoodInput,
  LogConsumptionInput,
  UpdateConsumptionInput,
} from "../types/nutrition.types";

type FoodResponse = { id: string; name: string } & (
  | {
      nutrition_basis: "per_100g";
      calories_per_100g: number;
      protein_per_100g: number;
      carbs_per_100g: number;
      fat_per_100g: number;
    }
  | {
      nutrition_basis: "per_unit";
      calories_per_unit: number;
      protein_per_unit: number;
      carbs_per_unit: number;
      fat_per_unit: number;
    }
);

function toFood(food: FoodResponse): Food {
  const values =
    food.nutrition_basis === "per_unit"
      ? {
          calories: food.calories_per_unit,
          protein: food.protein_per_unit,
          carbs: food.carbs_per_unit,
          fat: food.fat_per_unit,
        }
      : {
          calories: food.calories_per_100g,
          protein: food.protein_per_100g,
          carbs: food.carbs_per_100g,
          fat: food.fat_per_100g,
        };
  return {
    id: food.id,
    name: food.name,
    nutrition_basis: food.nutrition_basis,
    ...values,
  };
}

function foodRequest(input: FoodInput) {
  const nutrients =
    input.nutrition_basis === "per_unit"
      ? {
          calories_per_unit: input.calories,
          protein_per_unit: input.protein,
          carbs_per_unit: input.carbs,
          fat_per_unit: input.fat,
        }
      : {
          calories_per_100g: input.calories,
          protein_per_100g: input.protein,
          carbs_per_100g: input.carbs,
          fat_per_100g: input.fat,
        };
  return {
    name: input.name,
    nutrition_basis: input.nutrition_basis,
    ...nutrients,
  };
}

export async function getFoods(
  page: number,
  search: string,
  signal: AbortSignal,
): Promise<PaginatedResponse<Food>> {
  const { data } = await apiClient.get<PaginatedResponse<FoodResponse>>(
    "/api/nutrition/meals",
    {
      params: { page, per_page: 10, q: search || undefined },
      signal,
    },
  );
  return { ...data, data: data.data.map(toFood) };
}

export async function saveFood(input: FoodInput, id?: string): Promise<Food> {
  const response = id
    ? await apiClient.put<ApiResponse<FoodResponse>>(
        `/api/nutrition/meals/${id}`,
        foodRequest(input),
      )
    : await apiClient.post<ApiResponse<FoodResponse>>(
        "/api/nutrition/meals",
        foodRequest(input),
      );
  return toFood(response.data.data);
}

export async function archiveFood(id: string): Promise<void> {
  await apiClient.delete(`/api/nutrition/meals/${id}`);
}

export async function logConsumption(
  input: LogConsumptionInput,
): Promise<Consumption> {
  const { data } = await apiClient.post<ApiResponse<Consumption>>(
    "/api/nutrition/consumptions",
    input,
  );
  return data.data;
}

export async function updateConsumption(
  id: string,
  input: UpdateConsumptionInput,
): Promise<Consumption> {
  const { data } = await apiClient.put<ApiResponse<Consumption>>(
    `/api/nutrition/consumptions/${id}`,
    input,
  );
  return data.data;
}

export async function deleteConsumption(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/nutrition/consumptions/${id}`);
  } catch (error) {
    // An already deleted entry is also the intended result, including retries after a timeout.
    if (
      axios.isAxiosError(error) &&
      error.response?.data?.error?.code === "CONSUMPTION_NOT_FOUND"
    )
      return;
    throw error;
  }
}

export async function getDailyNutrition(
  date: string,
  signal: AbortSignal,
): Promise<DailyNutrition> {
  const { data } = await apiClient.get<ApiResponse<DailyNutrition>>(
    "/api/nutrition/daily",
    {
      params: { date },
      signal,
    },
  );
  return data.data;
}
