import { Card } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Home, Plus, Receipt, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/(app)/_app/home")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 pb-20 animate-fade-in-scale">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Home className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Welcome Back</h1>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">New Expense</span>
            </div>
          </Card>
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">New Group</span>
            </div>
          </Card>
        </div>

        {/* Overview Cards */}
        <div className="space-y-3 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Total Balance</h3>
                  <p className="text-sm text-muted-foreground">You owe $0.00</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Recent Expenses
                  </h3>
                  <p className="text-sm text-muted-foreground">3 this month</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">View All Groups</span>
              </div>
              <div className="text-sm text-muted-foreground">3 groups</div>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-primary" />
                <span className="font-medium">View All Expenses</span>
              </div>
              <div className="text-sm text-muted-foreground">12 expenses</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
