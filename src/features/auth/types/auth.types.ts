// src/features/auth/types/auth.types.ts

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
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
