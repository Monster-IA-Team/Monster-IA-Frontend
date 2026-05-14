import { apiClient } from "./client";
import type { Monster, PaginatedResponse, PaginationParams, MonsterInteraction } from "./types";

export const monstersAPI = {
  list(params?: PaginationParams): Promise<PaginatedResponse<Monster>> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.size) query.append("size", String(params.size));
    if (params?.sort_by) query.append("sort_by", params.sort_by);
    if (params?.sort_order) query.append("sort_order", params.sort_order);

    const queryString = query.toString();
    const path = queryString ? `/user-monsters/list?${queryString}` : "/user-monsters/list";

    return apiClient.get<PaginatedResponse<Monster>>(path);
  },

  getById(id: string): Promise<Monster> {
    return apiClient.get<Monster>(`/user-monsters/${id}`);
  },

  interact(interaction: MonsterInteraction): Promise<string> {
    return apiClient.post<string>("/user-monsters/interaction", interaction);
  },

  markDrunk(monsterId: string): Promise<string> {
    return this.interact({
      monster_id: monsterId,
      rating: 1,
      is_drunk: true,
    });
  },

  rateMonster(monsterId: string, rating: number): Promise<string> {
    return this.interact({
      monster_id: monsterId,
      rating,
      is_drunk: false,
    });
  },
};
