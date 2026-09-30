// src/features/auth/types/auth.types.ts

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  username: string;
  plain_password: string;
  sex: "male" | "female";
  weight: number;
  height: number;
  age: number;
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extra_active";
  goal: "lose_weight" | "maintain" | "gain_muscle";
}

export interface User {
  id: string;
  username: string;
  sex: string;
  weight: number;
  height: number;
  age: number;
  activity_level: string;
  goal: string;
}
