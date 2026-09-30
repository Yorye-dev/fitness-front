import type { RegisterRequest } from "@/features/auth/types/auth.types";

export type ProfileInput = Pick<
  RegisterRequest,
  "weight" | "height" | "age" | "activity_level" | "goal"
>;
