// Export the main API client and utilities
export { apiCall, default as apiClient } from "./client";

// Common API types

export interface TResource<T = unknown> {
  id: string;
  type: string;
  attributes: T;
  relationships: Record<string, ResourceRelationship[] | ResourceRelationships>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface ResourceRelationship {
  data: {
    id: string;
    type: string;
  };
}

export interface ResourceRelationships {
  data: {
    id: string;
    type: string;
  }[];
}

export interface PaginatedResponse<T extends TResource> {
  data: T[];
  included: TResource[];
  meta: {
    current_page: number;
    next_page: number;
    prev_page: number;
    total: number;
    total_pages: number;
  };
}
