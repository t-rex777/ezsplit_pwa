import type { Expense } from "@/api/services/expenses";
import type { User } from "@/api/services/users";
import {
  type UseSuspenseInfiniteQueryOptions,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { ChevronRight, Plus, Receipt, Users } from "lucide-react";
import { type JSX, memo } from "react";

import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

import { ExpenseListEmpty } from "./expenseListEmpty";
import { ExpenseListingCard } from "./expenseListingCard";

interface IExpenseListProps {
  queryOptions: UseSuspenseInfiniteQueryOptions<Expense[], Error>;
  groupId?: string;
  groupName?: string;
}

const ExpenseList = memo(
  ({ queryOptions, groupId, groupName }: IExpenseListProps): JSX.Element => {
    const queryClient = useQueryClient();

    const session = queryClient.getQueryData(["session"]) as User;

    const { data: expenses } = useSuspenseInfiniteQuery(queryOptions);

    return (
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            {groupId && (
              <div className="flex items-center gap-1">
                <Users className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">{groupName}</h1>
                <ChevronRight className="h-6 w-6 text-primary" />
              </div>
            )}

            <Receipt className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Expenses</h1>
          </div>

          <Link to="/expenses/new">
            <Button size="sm" className="rounded-full h-10 w-10 p-0">
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {expenses.length === 0 ? (
          <ExpenseListEmpty />
        ) : (
          <div className="flex flex-col gap-3">
            {expenses.map((expense) => (
              <Link
                to={
                  groupId ? "/groups/$id/expenses/$expenseId" : "/expenses/$id"
                }
                params={{
                  id: groupId ? groupId : expense.id,
                  expenseId: expense.id,
                }}
                key={expense.id}
                className="cursor-pointer"
              >
                <ExpenseListingCard
                  key={expense.id}
                  expense={expense}
                  currentUserId={session?.attributes.id}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  },
);

ExpenseList.displayName = "ExpenseList";

export { ExpenseList };
