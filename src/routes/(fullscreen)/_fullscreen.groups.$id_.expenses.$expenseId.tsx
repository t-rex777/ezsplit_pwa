import { EditExpensePage } from "@/components/expense/editExpensePage";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(fullscreen)/_fullscreen/groups/$id_/expenses/$expenseId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { expenseId } = useParams({
    from: "/(fullscreen)/_fullscreen/groups/$id_/expenses/$expenseId",
  });

  return <EditExpensePage expenseId={expenseId} />;
}
