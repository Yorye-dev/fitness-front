// src/features/auth/services/auth.service.ts

import { apiClient } from "@/lib/api/client";
import type {
  AuthResponse,
  LoginRequest,
  User,
} from "../types/auth.types";

export async function login(
  credentials: LoginRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    "/auth/sign_in",
    credentials,
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>("/api/me");

  return response.data;
}
