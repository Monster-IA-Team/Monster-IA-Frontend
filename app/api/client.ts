const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export class APIClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.accessToken = this.getStoredToken();
  }

  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  clearAccessToken() {
    this.accessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
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

  async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    body?: unknown,
    isFormData: boolean = false
  ): Promise<T> {
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
