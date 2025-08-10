import { type JSX, memo } from "react";

const ExpenseListLoading = memo((): JSX.Element => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-6">
      <div className="text-lg">Loading expenses...</div>
    </div>
  );
});

ExpenseListLoading.displayName = "ExpenseListLoading";

export { ExpenseListLoading };
