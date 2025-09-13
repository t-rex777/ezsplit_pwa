// Export the main API client and utilities
export { apiCall, default as apiClient } from "./client";

// Common API types

// Base resource interface - more flexible than before
export interface BaseResource<T = Record<string, unknown>> {
  id: string;
  type: string;
  attributes: T;
  relationships?: Record<
    string,
    ResourceRelationship | ResourceRelationships | ResourceRelationship[]
  >;
}

// Standardized API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

// Standardized error response
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Resource relationship types
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

// Standardized pagination metadata
export interface PaginationMeta {
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
  total: number;
  total_pages: number;
  per_page?: number;
}

// Standardized paginated response
export interface PaginatedResponse<T> {
  data: T[];
  included?: BaseResource[];
  meta: PaginationMeta;
}

// Alternative pagination format for backward compatibility
export interface LegacyPaginatedResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      current: number;
      next: number | null;
      prev: number | null;
      total_pages: number;
      total_count: number;
      per_page?: number;
    };
  };
}
