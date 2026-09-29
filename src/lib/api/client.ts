// src/lib/api/client.ts

import axios from "axios";

export const apiClient = axios.create({
  // Vite and Nginx forward /api and /auth to Axum on the same origin.
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
