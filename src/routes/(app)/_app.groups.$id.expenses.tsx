import { expenseService } from "@/api/services/expenses";
import { groupsService } from "@/api/services/groups";
import { ExpenseList } from "@/components/expense/expenseListPage";
import { infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_app/groups/$id/expenses")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id: groupId } = useParams({
    from: "/(app)/_app/groups/$id/expenses",
  });

  // Fetch group data for breadcrumb
  const { data: group } = useSuspenseQuery({
    queryKey: ["group", groupId],
    queryFn: () => groupsService.getGroup(groupId),
  });

  const queryOptions = infiniteQueryOptions({
    queryKey: ["groups", groupId, "expenses"],
    getNextPageParam: (lastPage) =>
      lastPage.meta.next_page ? lastPage.meta.next_page + 1 : undefined,
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) =>
      firstPage.meta.prev_page ? firstPage.meta.prev_page - 1 : undefined,
    queryFn: async () =>
      await expenseService.getExpenses({ group_id: groupId }),
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 pb-20 animate-fade-in-scale">
      <ExpenseList
        // @ts-expect-error will fix it
        queryOptions={queryOptions}
        groupId={groupId}
        groupName={group.data.attributes.name}
      />
    </div>
  );
}
