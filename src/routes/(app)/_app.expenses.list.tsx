import { expenseService } from "@/api/services/expenses";
import { ExpenseList } from "@/components/expense/expenseListPage";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_app/expenses/list")({
  component: ExpensesPage,
});

function ExpensesPage() {
  const queryOptions = infiniteQueryOptions({
    queryKey: ["expenses"],
    getNextPageParam: (lastPage) =>
      lastPage.meta.next_page ? lastPage.meta.next_page + 1 : undefined,
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) =>
      firstPage.meta.prev_page ? firstPage.meta.prev_page - 1 : undefined,
    queryFn: async () => await expenseService.getExpenses(),
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 pb-20 animate-fade-in-scale">
      {/* @ts-expect-error will fix it */}
      <ExpenseList queryOptions={queryOptions} />
    </div>
  );
}
