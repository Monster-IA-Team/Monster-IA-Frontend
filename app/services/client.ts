const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export class APIClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.accessToken = this.getStoredToken("access_token");
    this.refreshToken = this.getStoredToken("refresh_token");
  }

  private getStoredToken(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("refresh_token", token);
    }
  }

  clearAccessToken() {
    this.accessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  }

  clearRefreshToken() {
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("refresh_token");
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      if (data.is_success && data.data) {
        this.setAccessToken(data.data.access_token);
        this.setRefreshToken(data.data.refresh_token);
        return true;
      }
    } catch {
      return false;
    }

    return false;
  }

  async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown,
    isFormData: boolean = false
  ): Promise<T> {
    this.accessToken = this.getStoredToken("access_token");
    this.refreshToken = this.getStoredToken("refresh_token");

    if (this.accessToken && this.isTokenExpired(this.accessToken)) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        this.clearAccessToken();
        this.clearRefreshToken();
        throw new Error("Token expired and refresh failed");
      }
    }

    const url = `${this.baseURL}${path}`;
    const headers = this.getHeaders();

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      if (isFormData) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        }
        options.body = formData;
        delete headers["Content-Type"];
      } else {
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body: unknown, isFormData: boolean = false): Promise<T> {
    return this.request<T>("POST", path, body, isFormData);
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}

export const apiClient = new APIClient();
