import { type BaseResource, type PaginatedResponse, apiCall } from "@/api";

export interface Category
  extends BaseResource<{
    name: string;
    icon: string | null;
    color: string | null;
    created_by_id: string;
    created_at: string;
    updated_at: string | null;
  }> {
  type: "category";
}

export const categoryService = {
  async create(
    name: string,
    icon: string | null,
    color: string | null,
    created_by_id: string,
  ): Promise<{ data: Category }> {
    const response = await apiCall<{ data: Category }>({
      url: "/categories",
      method: "POST",
      data: { name, icon, color, created_by_id },
    });

    return response;
  },

  async getCategories(): Promise<PaginatedResponse<Category>> {
    const response = await apiCall<PaginatedResponse<Category>>({
      url: "/categories",
      method: "GET",
    });

    return response;
  },

  async getCategory(id: string): Promise<{ data: Category }> {
    const response = await apiCall<{ data: Category }>({
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
  ): Promise<{ data: Category }> {
    const response = await apiCall<{ data: Category }>({
      url: `/categories/${id}`,
      method: "PUT",
      data: { category: { name, icon, color } },
    });

    return response;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiCall({
      url: `/categories/${id}`,
      method: "DELETE",
    });
  },
};
