import axios, { CanceledError, type InternalAxiosRequestConfig } from "axios";
import { session } from "@/lib/auth/session";
import type { ApiResponse } from "./types";

const config = {
  baseURL: "",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
};
// Public authentication never enters the protected request/refresh interceptors.
export const authClient = axios.create(config);
export const apiClient = axios.create(config);

type SessionRequest = InternalAxiosRequestConfig & {
  retried?: boolean;
  sessionRevision?: number;
};
let refreshing: { revision: number; promise: Promise<string> } | null = null;

function refreshAccessToken(): Promise<string> {
  const revision = session.getRevision();
  if (refreshing?.revision === revision) return refreshing.promise;
  const refreshToken = session.getRefreshToken();
  if (!refreshToken) {
    session.clear();
    return Promise.reject(new Error("Session expired"));
  }

  const promise = authClient
    .post<ApiResponse<{ access_token: string }>>("/auth/refresh", {
      refresh_token: refreshToken,
    })
    .then(({ data }) => {
      if (revision !== session.getRevision())
        throw new CanceledError("Session changed");
      session.updateAccessToken(data.data.access_token);
      return data.data.access_token;
    })
    .catch((error: unknown) => {
      if (
        revision === session.getRevision() &&
        axios.isAxiosError(error) &&
        [401, 403].includes(error.response?.status ?? 0)
      )
        session.clear();
      throw error;
    })
    .finally(() => {
      if (refreshing?.promise === promise) refreshing = null;
    });
  refreshing = { revision, promise };
  return promise;
}

apiClient.interceptors.request.use((request: SessionRequest) => {
  request.sessionRevision ??= session.getRevision();
  if (request.sessionRevision !== session.getRevision())
    throw new CanceledError("Session changed");
  const token = session.getAccessToken();
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    if (
      (response.config as SessionRequest).sessionRevision !==
      session.getRevision()
    ) {
      throw new CanceledError("Session changed");
    }
    return response;
  },
  async (error: unknown) => {
    if (
      !axios.isAxiosError(error) ||
      !error.config ||
      error.response?.status !== 401
    )
      throw error;
    const request = error.config as SessionRequest;
    if (request.sessionRevision !== session.getRevision())
      throw new CanceledError("Session changed");
    if (request.retried) {
      session.clear();
      throw error;
    }
    request.retried = true;
    const currentToken = session.getAccessToken();
    // Another request may already have renewed the token while this one was pending.
    if (
      !currentToken ||
      request.headers.Authorization === `Bearer ${currentToken}`
    ) {
      await refreshAccessToken();
    }
    return apiClient(request);
  },
);
