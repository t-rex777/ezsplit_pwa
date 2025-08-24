import { apiCall } from "../client";
import type { ApiResponse, PaginatedResponse, TResource } from "../index";

// Expense-related types
export interface Expense
  extends TResource<{
    name: string;
    amount: number;
    split_type: "equal" | "exact" | "percentage";
    currency: string;
    expense_date: string;
    settled: boolean;
    created_at: string;
    updated_at: string;
    payer: {
      id: string;
      name: string;
      email: string;
    };
    group: {
      id: string;
      name: string;
      description?: string;
    };
    category: {
      id: string;
      name: string;
      color?: string;
    };
    expenses_users: ExpenseParticipant[];
  }> {}

export interface ExpenseParticipant {
  paid: boolean;
  amount: number;
  expense_id: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateExpenseRequest {
  name: string;
  amount: number;
  currency?: string;
  payer_id: string;
  split_type: "equal" | "exact" | "percentage";
  group_id: string;
  category_id: string;
  expense_date?: string;
  settled?: boolean;
  distribution: Array<{
    user_id: string;
    amount: number;
  }>;
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {}

// Expense service methods
export const expenseService = {
  // Get all expenses with pagination
  getExpenses: async (params?: {
    page?: number;
    limit?: number;
    group_id?: string;
    user_id?: string;
  }): Promise<PaginatedResponse<Expense>> => {
    const response = await apiCall<PaginatedResponse<Expense>>({
      method: "GET",
      url: "/expenses",
      params,
    });

    return response;
  },

  // Get single expense by ID
  getExpense: async (
    id: string,
  ): Promise<{ data: Expense; included: TResource[] }> => {
    const response = await apiCall<{ data: Expense; included: TResource[] }>({
      method: "GET",
      url: `/expenses/${id}`,
    });

    return response;
  },

  // Create new expense
  createExpense: async (
    expenseData: CreateExpenseRequest,
  ): Promise<Expense> => {
    const response = await apiCall<ApiResponse<Expense>>({
      method: "POST",
      url: "/expenses",
      data: { expense: expenseData },
    });
    return response.data;
  },

  // Update existing expense
  updateExpense: async (
    id: string,
    expenseData: UpdateExpenseRequest,
  ): Promise<Expense> => {
    const response = await apiCall<ApiResponse<Expense>>({
      method: "PUT",
      url: `/expenses/${id}`,
      data: { expense: expenseData },
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
      data: { user_id: userId },
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
      params: userId ? { user_id: userId } : undefined,
    });
    return response.data;
  },
};
