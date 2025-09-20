import type { Expense } from "@/api/services/expenses";
import clsx from "clsx";
import { type JSX, memo, useMemo } from "react";
import { Card } from "../ui/card";

const CURRENCY_MAPPING = {
  INR: "₹",
  USD: "$",
};

interface IExpenseCardProps {
  expense: Expense;
  currentUserId: string;
}

function getCurrentUserMoney(
  amount: number,
  splitType: "equal" | "percentage" | "exact",
): number {
  switch (splitType) {
    case "equal":
      return amount / 2;
    case "percentage":
      throw Error("handle percentage type");
    case "exact":
      throw Error("handle exact type");

    default:
      throw Error(`Unknown split type: ${splitType}`);
  }
}

const ExpenseCard = memo(
  ({ expense, currentUserId }: IExpenseCardProps): JSX.Element => {
    const currency =
      CURRENCY_MAPPING[
        expense.attributes.currency as keyof typeof CURRENCY_MAPPING
      ];

    const moneyLentOrBorrowed = useMemo(() => {
      if (
        !Array.isArray(expense.relationships?.payer) &&
        !Array.isArray(expense.relationships?.payer.data)
      ) {
        const amount = getCurrentUserMoney(
          expense.attributes.amount,
          expense.attributes.split_type,
        );

        return Number(expense.relationships?.payer.data.id) ===
          Number(currentUserId)
          ? `You lent ${currency}${amount}`
          : `You borrowed ${currency}${amount}`;
      }

      throw new Error("payer data is corrupt");
    }, [expense, currentUserId, currency]);

    return (
      <Card key={expense.id} className="p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-1">
              {expense.attributes.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {new Date(expense.attributes.expense_date).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">
              {currency}
              {Number(expense.attributes.amount).toFixed(2)}
            </p>

            <p
              className={clsx("text-sm mt-1", {
                "text-green-500": moneyLentOrBorrowed.includes("lent"),
                "text-red-500": moneyLentOrBorrowed.includes("borrowed"),
              })}
            >
              {moneyLentOrBorrowed}
            </p>
          </div>
        </div>
      </Card>
    );
  },
);

ExpenseCard.displayName = "ExpenseCard";

export { ExpenseCard };
