import { apiCall } from "../client";
import type { BaseResource, PaginatedResponse } from "../index";

export interface UserResource extends BaseResource {
  type: "user";
  attributes: {
    id: string;
    first_name: string;
    last_name: string;
    email_address: string;
    phone: string;
    avatar_url?: string;
    date_of_birth: string;
    full_name: string;
    created_at: string;
    updated_at: string;
  };
  relationships?: {
    groups?: {
      data: {
        id: string;
        type: "group";
      }[];
    };
  };
}

// Users response using standardized format
export interface UsersResponse extends PaginatedResponse<UserResource> {}

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
  getUser: async (id: string): Promise<{ data: UserResource }> => {
    const response = await apiCall<{ data: UserResource }>({
      method: "GET",
      url: `/users/${id}`,
    });
    return response;
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
