import axios from "axios";
import type { Translation } from "@/config/i18n";
import type { ApiErrorResponse } from "./types";

export function authErrorMessage(
  error: unknown,
  t: Translation,
  registering = false,
): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error))
    return t.auth.unexpectedError;
  if (!error.response) return t.auth.connectionError;
  if (error.response.status === 429) return t.auth.tooManyRequests;
  if (registering && error.response.status === 409) return t.auth.usernameTaken;
  if (error.response.status === 401) return t.auth.invalidCredentials;
  if ([400, 422].includes(error.response.status)) return t.auth.invalidFields;
  return t.auth.unexpectedError;
}
