import axios from "axios";
import type { Translation } from "@/config/i18n";

export function nutritionErrorMessage(error: unknown, t: Translation): string {
  if (!axios.isAxiosError(error)) return t.foodCatalog.mutationError;
  if (!error.response) return t.foodCatalog.connectionError;
  if (error.response.data?.error?.code === "CONSUMPTION_NOT_FOUND")
    return t.foodCatalog.entryUnavailable;
  if (error.response.status === 404) return t.foodCatalog.unavailable;
  if (error.response.status === 409) return t.foodCatalog.conflict;
  if ([400, 422].includes(error.response.status)) return t.foodCatalog.invalid;
  return t.foodCatalog.mutationError;
}
