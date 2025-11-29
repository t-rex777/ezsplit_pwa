import { EditExpensePage } from "@/components/expense/editExpensePage";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/(fullscreen)/_fullscreen/expenses/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/(fullscreen)/_fullscreen/expenses/$id",
  });

  return <EditExpensePage expenseId={id} />;
}
