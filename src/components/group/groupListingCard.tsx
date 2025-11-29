import type { Group } from "@/api/services/groups";
import type { User } from "@/api/services/users";
import { AvatarStack } from "@/components/ui/avatarStack";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { CURRENCY_MAPPING } from "../expense/expenseListingCard";

export interface GroupListingCardProps {
  group: Group;
  allUsers: User[];
}

export const GroupListingCard = ({
  group,
  allUsers,
}: GroupListingCardProps) => {
  const name = group.attributes.name;
  const expenseSummary = group.attributes.expense_summary;
  const totalExpenses = expenseSummary?.total_expenses || 0;
  const userBalance = expenseSummary?.current_user_balance?.net_balance || 0;

  const groupMembers =
    group.relationships?.users?.data
      .map((user) => allUsers.find((u) => Number(u.id) === Number(user.id)))
      .filter((user) => user !== undefined) ?? [];

  const currency =
    CURRENCY_MAPPING[
      group.attributes.expense_summary.currency as keyof typeof CURRENCY_MAPPING
    ];

  const formatBalance = (balance: number) => {
    if (balance === 0) return "Settled";
    if (balance > 0) return `You're owed $${balance.toFixed(2)}`;
    return `You owe ${currency}${Math.abs(balance).toFixed(2)}`;
  };

  return (
    <Link to="/groups/$id/expenses" params={{ id: group.id }}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{name}</h3>
                <p className="text-sm text-muted-foreground">
                  {group.attributes.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AvatarStack users={groupMembers} />
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2 group">
              <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {totalExpenses} expense{totalExpenses !== 1 ? "s" : ""}
              </span>
            </div>

            <span
              className={clsx(
                "text-xs font-medium",
                userBalance === 0
                  ? "text-muted-foreground"
                  : userBalance > 0
                    ? "text-green-600"
                    : "text-red-600",
              )}
            >
              {formatBalance(userBalance)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default GroupListingCard;
