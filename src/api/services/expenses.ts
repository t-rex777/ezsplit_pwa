import { apiCall } from "../client";
import type { ApiResponse, PaginatedResponse } from "../index";

// Expense-related types
export interface Expense {
  id: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  paidBy: string; // user ID
  splitType: "equal" | "exact" | "percentage";
  participants: ExpenseParticipant[];
  groupId?: string;
  category?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseParticipant {
  userId: string;
  amount: number;
  paid: boolean;
}

export interface CreateExpenseRequest {
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  paidBy: string;
  splitType: "equal" | "exact" | "percentage";
  participants: Omit<ExpenseParticipant, "paid">[];
  groupId?: string;
  category?: string;
  date?: string;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  id: string;
}

// Expense service methods
export const expenseService = {
  // Get all expenses with pagination
  getExpenses: async (params?: {
    page?: number;
    limit?: number;
    groupId?: string;
    userId?: string;
  }): Promise<PaginatedResponse<Expense>> => {
    const response = await apiCall<PaginatedResponse<Expense>>({
      method: "GET",
      url: "/expenses",
      params,
    });
    return response;
  },

  // Get single expense by ID
  getExpense: async (id: string): Promise<Expense> => {
    const response = await apiCall<ApiResponse<Expense>>({
      method: "GET",
      url: `/expenses/${id}`,
    });
    return response.data;
  },

  // Create new expense
  createExpense: async (
    expenseData: CreateExpenseRequest,
  ): Promise<Expense> => {
    const response = await apiCall<ApiResponse<Expense>>({
      method: "POST",
      url: "/expenses",
      data: expenseData,
    });
    return response.data;
  },

  // Update existing expense
  updateExpense: async (
    expenseData: UpdateExpenseRequest,
  ): Promise<Expense> => {
    const { id, ...data } = expenseData;
    const response = await apiCall<ApiResponse<Expense>>({
      method: "PUT",
      url: `/expenses/${id}`,
      data,
    });
    return response.data;
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    await apiCall({
      method: "DELETE",
      url: `/expenses/${id}`,
    });
  },

  // Mark expense as paid by a participant
  markAsPaid: async (expenseId: string, userId: string): Promise<Expense> => {
    const response = await apiCall<ApiResponse<Expense>>({
      method: "POST",
      url: `/expenses/${expenseId}/pay`,
      data: { userId },
    });
    return response.data;
  },

  // Get user's balance summary
  getUserBalance: async (
    userId?: string,
  ): Promise<{
    totalOwed: number;
    totalOwing: number;
    netBalance: number;
  }> => {
    const response = await apiCall<
      ApiResponse<{
        totalOwed: number;
        totalOwing: number;
        netBalance: number;
      }>
    >({
      method: "GET",
      url: "/expenses/balance",
      params: userId ? { userId } : undefined,
    });
    return response.data;
  },
};
