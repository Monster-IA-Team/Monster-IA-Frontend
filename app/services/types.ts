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

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
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

export interface Can {
  id: string;
  name: string;
  description: string;
  image_url: string;
  average_rating: number;
  is_drunk_by_user: boolean;
}

export interface Monster extends Can {}

export interface PaginatedResponse<T> {
  is_success: boolean;
  data: {
    items: T[];
    total_elements: number;
    total_pages: number;
    current_page: number;
    size: number;
  };
  message: string;
  status_code: number;
  errors: string[];
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface Task {
  title?: string;
  start: string;
  end: string;
}

export interface ScheduleRequest {
  wake: string;
  sleep: string;
  tasks: Task[];
  monster_count: number;
}

export interface ScheduleResponse {
  is_success: boolean;
  data: string;
  message: string;
  status_code: number;
  errors: string[];
}

export interface PlannerTableRes {
  id: string;
  wake_time: string;
  sleep_time: string;
  desired_count: number | null;
  created_at: string;
  sessions_count: number;
}

export interface PlannerHistoryResponse {
  is_success: boolean;
  data: {
    items: PlannerTableRes[];
    total_elements: number;
    total_pages: number;
    current_page: number;
    size: number;
  };
  message: string;
  status_code: number;
  errors: string[];
}

export interface PlannerPaginationParams {
  page?: number;
  size?: number;
  sort_order?: "asc" | "desc";
}

export interface TaskDetailRes {
  id: string;
  title: string | null;
  start_time: string;
  end_time: string;
}

export interface DrinkSession {
  time: string;
  amount?: string;
  [key: string]: any;
}
export interface PlannerInfo {
  drink_sessions?: DrinkSession[];
  covered_hours?: number;
  effectiveness?: number;
  [key: string]: any;
}

export interface PlannerDetailRes {
  id: string;
  wake_time: string;
  sleep_time: string;
  desired_count: number | null;
  created_at: string | null;
  planner: PlannerInfo;
  tasks: TaskDetailRes[];
}

export interface PlannerDetailsResponse {
  is_success: boolean;
  data: PlannerDetailRes;
  message: string;
  status_code: number;
  errors: string[];
}

export interface UserRes {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateAdminRequest {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

export interface BasicResponse {
  is_success: boolean;
  data: null;
  message: string;
  status_code: number;
  errors: string[];
}

export interface AdminListResponse {
  is_success: boolean;
  data: UserRes[];
  message: string;
  status_code: number;
  errors: string[];
}