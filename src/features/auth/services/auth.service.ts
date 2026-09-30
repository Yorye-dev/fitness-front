import { apiClient, authClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types/auth.types";

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await authClient.post<ApiResponse<AuthResponse>>(
    "/auth/sign_in",
    credentials,
  );
  return data.data;
}

export async function registerUser(
  input: RegisterRequest,
): Promise<AuthResponse> {
  const { data } = await authClient.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    input,
  );
  return data.data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>("/api/me");
  return data.data;
}
