import { Plus, Receipt } from "lucide-react";
import { type JSX, memo } from "react";
import { Button } from "../ui/button";

const ExpenseListEmpty = memo((): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Receipt className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground mb-2">
        No expenses yet
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Start tracking your group expenses by adding your first expense.
      </p>
      <Button className="rounded-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Expense
      </Button>
    </div>
  );
});

ExpenseListEmpty.displayName = "ExpenseListEmpty";

export { ExpenseListEmpty };
