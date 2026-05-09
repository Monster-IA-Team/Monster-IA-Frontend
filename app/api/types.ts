export interface AuthResponse {
  is_success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    user_id: string;
    email: string;
    username: string;
    roles: string[];
  };
  message: string;
  status_code: number;
  errors: string[];
}

export interface ValidationError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
    input: string;
    ctx: Record<string, unknown>;
  }>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
  is_prefers_sugar_free: boolean;
  is_prefers_sweet: boolean;
  is_prefers_sour: boolean;
  is_prefers_moderate: boolean;
}

export interface RegisterResponse {
  is_success: boolean;
  data: null;
  message: string;
  status_code: number;
  errors: string[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
}
