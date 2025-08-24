import { expenseService } from "@/api/services/expenses";
import EditExpenseForm, {
  type EditExpenseFormData,
} from "@/components/expense/editExpenseForm";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/(fullscreen)/_fullscreen/expenses/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: (params: EditExpenseFormData) =>
      expenseService.createExpense(params),
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Expense created successfully!",
        variant: "default",
      });

      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      navigate({ to: "/expenses/list" });
    },
    onError: (err) => {
      console.log(err, "LOGGER");
      toast({
        title: "Error",
        description: "Failed to create expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (values: EditExpenseFormData): Promise<void> => {
    await createExpenseMutation.mutateAsync(values);
  };

  return <EditExpenseForm onSubmit={handleSubmit} />;
}
