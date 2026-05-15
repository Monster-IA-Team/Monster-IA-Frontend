import { apiClient } from "./client";
import type {
    PaginatedResponse,
    UserRes,
    CreateAdminRequest,
    BasicResponse,
    AdminListResponse
} from "./types";

export const adminAPI = {
    getUsers(page: number, size: number = 10): Promise<PaginatedResponse<UserRes>> {
        const query = new URLSearchParams({
            page: String(page),
            size: String(size)
        }).toString();

        return apiClient.get<PaginatedResponse<UserRes>>(`/admin/users?${query}`);
    },

    blockUser(id: string): Promise<BasicResponse> {
        return apiClient.put<BasicResponse>(`/admin/users/${id}/block`, {});
    },

    unblockUser(id: string): Promise<BasicResponse> {
        return apiClient.put<BasicResponse>(`/admin/users/${id}/unblock`, {});
    },

    createAdmin(data: CreateAdminRequest): Promise<BasicResponse> {
        return apiClient.post<BasicResponse>("/admin/admins/create", data, false);
    },

    getAdmins(): Promise<AdminListResponse> {
        return apiClient.get<AdminListResponse>("/admin/admins");
    },

    deleteAdmin(id: string): Promise<BasicResponse> {
        return apiClient.delete<BasicResponse>(`/admin/admins/${id}`);
    }
};