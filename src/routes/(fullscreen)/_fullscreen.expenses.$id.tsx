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
      expenseService.updateExpense(id, { ...params }),
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Expense updated successfully!",
        variant: "success",
      });

      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      await navigate({ to: "/expenses/list" });
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
        category_id: (() => {
          const categoryRel = expense.relationships?.category;
          if (
            categoryRel &&
            "data" in categoryRel &&
            !Array.isArray(categoryRel.data)
          ) {
            return categoryRel.data.id;
          }
          return "";
        })(),
        currency: expense.attributes.currency,
        distribution: included
          .filter((item) => item.type === "expenses_users")
          .map((expenseUser) => {
            const userRel = expenseUser.relationships?.user;
            if (userRel && "data" in userRel && !Array.isArray(userRel.data)) {
              return {
                amount: expenseUser.attributes.amount as number,
                user_id: userRel.data.id,
              };
            }
            return null;
          })
          .filter(
            (item): item is { amount: number; user_id: string } =>
              item !== null,
          ),
        expense_date: expense.attributes.expense_date,
        group_id: (() => {
          const groupRel = expense.relationships?.group;
          if (groupRel && "data" in groupRel && !Array.isArray(groupRel.data)) {
            return groupRel.data.id;
          }
          return "";
        })(),
        name: expense.attributes.name,
        payer_id: (() => {
          const payerRel = expense.relationships?.payer;
          if (payerRel && "data" in payerRel && !Array.isArray(payerRel.data)) {
            return payerRel.data.id;
          }
          return "";
        })(),
        split_type: expense.attributes.split_type,
        settled: expense.attributes.settled,
      }}
    />
  );
}
