import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { ApiError } from "./index";

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Log request in development
    if (import.meta.env.DEV) {
      console.log("API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors, logging, etc.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log("API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login (cookies will be handled by browser)
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.error("Forbidden: Insufficient permissions");
    }

    if (error.response?.status && error.response.status >= 500) {
      console.error("Server error:", error.response?.data);
    }

    console.error("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  },
);

// Helper function for making API calls with better TypeScript support
export const apiCall = async <T = unknown>(
  config: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    // Enhanced error handling with proper types
    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        console.error("Not Found", error);
      } else if (error.response?.status === 500) {
        console.error("Internal Server Error", error);
      } else if (error.response?.status === 422) {
        console.error("Validation Error", error.response?.data);
      } else if (error.response?.status === 429) {
        console.error("Rate Limit Exceeded", error);
      }
    }

    throw error;
  }
};

export default apiClient;
