import { apiCall, type PaginatedResponse, type TResource } from "@/api";

export interface Category
  extends TResource<{
    name: string;
    icon: string | null;
    color: string | null;
    created_by_id: string;
    created_at: string;
    updated_at: string | null;
  }> {}

export const categoryService = {
  async create(
    name: string,
    icon: string | null,
    color: string | null,
    created_by_id: string,
  ) {
    const response = await apiCall<PaginatedResponse<Category>>({
      url: "/categories",
      method: "POST",
      data: { name, icon, color, created_by_id },
    });

    return response;
  },

  async getCategories() {
    const response = await apiCall<PaginatedResponse<Category>>({
      url: "/categories",
      method: "GET",
    });

    return response;
  },

  async getCategory(id: string) {
    const response = await apiCall<PaginatedResponse<Category>>({
      url: `/categories/${id}`,
      method: "GET",
    });

    return response;
  },

  async updateCategory(
    id: string,
    name: string,
    icon: string | null,
    color: string | null,
  ) {
    const response = await apiCall<PaginatedResponse<Category>>({
      url: `/categories/${id}`,
      method: "PUT",

      data: { name, icon, color },
    });

    return response;
  },
};
