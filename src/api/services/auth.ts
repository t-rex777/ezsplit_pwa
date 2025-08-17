import { apiCall } from "../client";
import type { ApiResponse } from "../index";

// Auth-related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface UserResource {
  id: string;
  type: "user";
  attributes: {
    id: string;
    first_name: string;
    last_name: string;
    email_address: string;
    phone: string;
    avatar_url: string;
    date_of_birth: string;
    full_name: string;
  };
  relationships: {
    groups: {
      data: {
        id: string;
        type: "group";
      }[];
    };
  };
}

// Auth service methods
export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiCall<ApiResponse<LoginResponse>>({
      method: "POST",
      url: "/session",
      data: {
        email_address: credentials.email,
        password: credentials.password,
      },
    });
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<UserResource> => {
    const response = await apiCall<ApiResponse<UserResource>>({
      method: "POST",
      url: "/auth/register",
      data: userData,
    });
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<UserResource> => {
    const response = await apiCall<ApiResponse<UserResource>>({
      method: "GET",
      url: "/session",
    });
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    return await apiCall({
      method: "DELETE",
      url: "/session",
    });
    // Cookies will be cleared by the server
  },

  // Check if user is authenticated (useful for checking auth status)
  checkAuth: async (): Promise<boolean> => {
    try {
      await apiCall({
        method: "GET",
        url: "/auth/check",
      });
      return true;
    } catch {
      return false;
    }
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiCall({
      method: "POST",
      url: "/auth/password-reset",
      data: { email },
    });
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiCall({
      method: "POST",
      url: "/auth/password-reset/confirm",
      data: { token, password: newPassword },
    });
  },
};
