import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { User } from "@/features/auth/types/auth.types";
import type { ProfileInput } from "../types/profile.types";

export async function updateProfile(input: ProfileInput): Promise<User> {
  const { data } = await apiClient.put<ApiResponse<User>>("/api/me", input);
  return data.data;
}
