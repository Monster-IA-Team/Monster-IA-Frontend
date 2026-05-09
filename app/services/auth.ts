import { apiClient } from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from "./types";

export const authAPI = {
  login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      "/auth/login",
      {
        grant_type: "password",
        username: credentials.email,
        password: credentials.password,
      },
      true
    );
  },

  register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("/auth/register", data, false);
  },

  logout(): Promise<void> {
    apiClient.clearAccessToken();
    return Promise.resolve();
  },

  refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      "/auth/refresh",
      { refresh_token: refreshToken },
      false
    );
  },
};
