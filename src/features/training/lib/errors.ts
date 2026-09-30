import axios from "axios";
import type { Translation } from "@/config/i18n";

export function trainingErrorMessage(error: unknown, t: Translation): string {
  if (!axios.isAxiosError(error) || !error.response)
    return t.training.saveError;
  if (error.response.status === 404) return t.training.unavailable;
  if (error.response.status === 409) return t.training.conflict;
  if ([400, 422].includes(error.response.status)) return t.training.invalid;
  return t.training.saveError;
}
