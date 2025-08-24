import {
  type UpdateExpenseRequest,
  expenseService,
} from "@/api/services/expenses";
import EditExpenseForm, {
  type EditExpenseFormData,
} from "@/components/expense/editExpenseForm";
import { useToast } from "@/components/ui/use-toast";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

export const Route = createFileRoute("/(fullscreen)/_fullscreen/expenses/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { id } = useParams({
    from: "/(fullscreen)/_fullscreen/expenses/$id",
  });

  const {
    data: { included, data: expense },
  } = useSuspenseQuery({
    queryKey: ["expenses", id],
    queryFn: async () => await expenseService.getExpense(id),
  });

  // Update expense mutation
  const updateExpenseMutation = useMutation({
    mutationFn: (params: Partial<UpdateExpenseRequest>) =>
      expenseService.updateExpense(id, params),
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Expense updated successfully!",
        variant: "default",
      });

      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      navigate({ to: "/expenses/list" });
    },
    onError: (err) => {
      console.log(err, "LOGGER");
      toast({
        title: "Error",
        description: "Failed to update expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (expense: EditExpenseFormData) => {
    await updateExpenseMutation.mutateAsync(expense);
  };

  return (
    <EditExpenseForm
      onSubmit={handleSubmit}
      defaultValues={{
        amount: expense.attributes.amount,
        category_id: expense.relationships.category.data.id,
        currency: expense.attributes.currency,
        distribution: included
          .filter((item) => item.type === "expenses_users")
          .map((expenseUser) => ({
            amount: expenseUser.attributes.amount,
            user_id: expenseUser.relationships.user.data.id,
          })),
        expense_date: expense.attributes.expense_date,
        group_id: expense.relationships.group.data.id,
        name: expense.attributes.name,
        payer_id: expense.relationships.payer.data.id,
        split_type: expense.attributes.split_type,
        settled: expense.attributes.settled,
      }}
    />
  );
}
