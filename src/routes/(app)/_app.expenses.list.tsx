import { expenseService } from "@/api/services/expenses";
import { ExpenseCard } from "@/components/expense/expenseCard";
import { ExpenseListEmpty } from "@/components/expense/expenseListEmpty";
import { ExpenseListLoading } from "@/components/expense/expenseListLoading";
import { Button } from "@/components/ui/button";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Receipt } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/(app)/_app/expenses/list")({
  component: ExpensesPage,
});

function ExpensesPage() {
  const { data: expenses } = useSuspenseInfiniteQuery({
    queryKey: ["expenses"],
    getNextPageParam: (lastPage) => lastPage.meta.next_page + 1,
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.meta.prev_page - 1,
    queryFn: async () => await expenseService.getExpenses(),
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
  });

  return (
    <Suspense fallback={<ExpenseListLoading />}>
      <div className="min-h-[calc(100vh-4rem)] p-4 pb-20 animate-fade-in-scale">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Receipt className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Expenses</h1>
            </div>

            <Link to="/expenses/new">
              <Button size="sm" className="rounded-full h-10 w-10 p-0">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Expenses List */}
          {expenses.length === 0 ? (
            <ExpenseListEmpty />
          ) : (
            <div className="flex flex-col gap-3">
              {expenses.map((expense) => (
                <Link
                  to="/expenses/$id"
                  params={{ id: expense.id }}
                  key={expense.id}
                  className="cursor-pointer"
                >
                  <ExpenseCard key={expense.id} expense={expense} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
