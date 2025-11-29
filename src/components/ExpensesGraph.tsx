import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mock data generators for expense tracking
function getLast3MonthsData() {
  // Generate data for last 3 months (Apr-Jun)
  const months = ["Apr", "May", "Jun"];
  const data = [];

  for (let monthIndex = 0; monthIndex < 3; monthIndex++) {
    const month = months[monthIndex];
    const daysInMonth = month === "Apr" ? 30 : month === "May" ? 31 : 30;

    for (let day = 1; day <= daysInMonth; day += 6) {
      const date = `${month} ${day}`;
      const personalExpenses = Math.round(Math.random() * 80 + 20);
      const groupExpenses = Math.round(Math.random() * 120 + 40);

      data.push({
        date,
        personal: personalExpenses,
        group: groupExpenses,
        total: personalExpenses + groupExpenses,
      });
    }
  }

  return data;
}

function getLast30DaysData() {
  return Array.from({ length: 30 }, (_, i) => {
    const personalExpenses = Math.round(Math.random() * 60 + 15);
    const groupExpenses = Math.round(Math.random() * 90 + 30);

    return {
      date: `Day ${i + 1}`,
      personal: personalExpenses,
      group: groupExpenses,
      total: personalExpenses + groupExpenses,
    };
  });
}

function getLast7DaysData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => {
    const personalExpenses = Math.round(Math.random() * 50 + 10);
    const groupExpenses = Math.round(Math.random() * 70 + 20);

    return {
      date: day,
      personal: personalExpenses,
      group: groupExpenses,
      total: personalExpenses + groupExpenses,
    };
  });
}

const VIEW_OPTIONS = [
  { label: "Last 3 months", value: "3months" },
  { label: "Last 30 days", value: "30days" },
  { label: "Last 7 days", value: "7days" },
];

function getData(view: string) {
  switch (view) {
    case "3months":
      return getLast3MonthsData();
    case "30days":
      return getLast30DaysData();
    case "7days":
      return getLast7DaysData();
    default:
      return getLast3MonthsData();
  }
}

export const ExpensesGraph: React.FC = () => {
  const [view, setView] = useState<"3months" | "30days" | "7days">("3months");
  const data = getData(view);

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Total Expenses
          </h2>
          <p className="text-sm text-muted-foreground">
            Total for the last{" "}
            {view === "3months"
              ? "3 months"
              : view === "30days"
                ? "30 days"
                : "7 days"}
          </p>
        </div>
        <div className="flex gap-2">
          {VIEW_OPTIONS.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={view === option.value ? "default" : "outline"}
              onClick={() =>
                setView(option.value as "3months" | "30days" | "7days")
              }
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="personalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="groupGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`,
                name === "personal" ? "Personal" : "Group",
              ]}
            />

            {/* Personal Expenses Area */}
            <Area
              type="monotone"
              dataKey="personal"
              stackId="1"
              stroke="#6b7280"
              fill="url(#personalGradient)"
              strokeWidth={1}
            />

            {/* Group Expenses Area */}
            <Area
              type="monotone"
              dataKey="group"
              stackId="1"
              stroke="#9ca3af"
              fill="url(#groupGradient)"
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gray-500" />
          <span className="text-sm text-muted-foreground">Personal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gray-400" />
          <span className="text-sm text-muted-foreground">Group</span>
        </div>
      </div>
    </Card>
  );
};

export default ExpensesGraph;
