import { apiCall } from "../client";

// User-related types
export interface User {
  id: string;
  attributes: {
    full_name: string;
    first_name: string;
    last_name: string;
    email_address: string;
    phone: string;
    avatar_url?: string;
    date_of_birth: string;
    created_at: string;
    updated_at: string;
  };
}

export interface UsersResponse {
  data: User[];
  meta?: {
    pagination?: {
      current: number;
      next: number | null;
      prev: number | null;
      total_pages: number;
      total_count: number;
    };
  };
}

// Users service methods
export const usersService = {
  // Get all users
  getUsers: async (): Promise<UsersResponse> => {
    const response = await apiCall<UsersResponse>({
      method: "GET",
      url: "/users",
    });
    return response;
  },

  // Get single user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await apiCall<{ data: User }>({
      method: "GET",
      url: `/users/${id}`,
    });
    return response.data;
  },

  // Search users by name or email
  searchUsers: async (query: string): Promise<UsersResponse> => {
    const response = await apiCall<UsersResponse>({
      method: "GET",
      url: "/users/search",
      params: { term: query, limit: 5 },
    });
    return response;
  },
};
