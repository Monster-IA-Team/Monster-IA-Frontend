import { apiClient } from "./client";
import type { ScheduleRequest, ScheduleResponse, PlannerHistoryResponse, PlannerPaginationParams, PlannerDetailsResponse } from "./types";

export const plannerAPI = {
  createSchedule(schedule: ScheduleRequest): Promise<ScheduleResponse> {
    return apiClient.post<ScheduleResponse>("/schedule/calculate", schedule);
  },

  getHistory(params?: PlannerPaginationParams): Promise<PlannerHistoryResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.size) query.append("size", String(params.size));
    if (params?.sort_order) query.append("sort_order", params.sort_order);

    const queryString = query.toString();
    const path = queryString ? `/schedule?${queryString}` : "/schedule";

    return apiClient.get<PlannerHistoryResponse>(path);
  },

  getPlannerDetails(plannerId: string): Promise<PlannerDetailsResponse> {
    return apiClient.get<PlannerDetailsResponse>(`/schedule/${plannerId}`);
  },

  deletePlanner(plannerId: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/schedule/${plannerId}`);
  },
};


