import { apiClient } from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, ActivationResponse } from "./types";

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

  activate(token: string): Promise<ActivationResponse> {
    return apiClient.get<ActivationResponse>(`/auth/activate?token=${encodeURIComponent(token)}`);
  },

  resetPassword(email: string): Promise<ActivationResponse> {
    return apiClient.post<ActivationResponse>(`/auth/reset-password?email=${encodeURIComponent(email)}`, {});
  },

  logout(): Promise<void> {
    apiClient.clearAccessToken();
    apiClient.clearRefreshToken();
    return Promise.resolve();
  },

  confirmResetPassword(data: {
    token: string,
    password: string,
    confirm_password: string
  }) : Promise<ActivationResponse> {
    return apiClient.post<ActivationResponse>(
        "/auth/reset-password/confirm",
        data,
        false
    );
  },

  refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      "/auth/refresh",
      { refresh_token: refreshToken },
      false
    );
  },
};
