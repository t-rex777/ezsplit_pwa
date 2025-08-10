import type { Expense } from "@/api/services/expenses";
import { type JSX, memo } from "react";
import { Card } from "../ui/card";

const CURRENCY_MAPPING = {
  INR: "₹",
  USD: "$",
};

interface IExpenseCardProps {
  expense: Expense;
}

const ExpenseCard = memo(({ expense }: IExpenseCardProps): JSX.Element => {
  return (
    <Card key={expense.id} className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-1">
            {expense.attributes.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {new Date(expense.attributes.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg">
            {
              CURRENCY_MAPPING[
                expense.attributes.currency as keyof typeof CURRENCY_MAPPING
              ]
            }
            {Number(expense.attributes.amount).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
});

ExpenseCard.displayName = "ExpenseCard";

export { ExpenseCard };
