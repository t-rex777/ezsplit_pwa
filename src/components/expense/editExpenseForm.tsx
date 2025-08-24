import type { JSX } from "react";
import { FieldInfo } from "@/components/formFieldInfo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm, useStore } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { DollarSign, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserResource } from "@/api/services/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CURRENCIES } from "@/constants/currencies";
import { categoryService } from "@/api/services/categories";
import { groupsService } from "@/api/services/groups";

interface EditExpenseFormProps {
  defaultValues?: Partial<EditExpenseFormData>;
  onSubmit: (values: EditExpenseFormData) => Promise<void>;
}

export interface EditExpenseFormData {
  name: string;
  amount: number;
  currency: string;
  payer_id: string;
  split_type: "equal" | "exact" | "percentage";
  group_id: string;
  category_id: string;
  expense_date: string;
  settled: boolean;
  distribution: Array<{
    user_id: string;
    amount: number;
  }>;
}

const EditExpenseForm = ({
  defaultValues,
  onSubmit,
}: EditExpenseFormProps): JSX.Element => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [splitType, setSplitType] = useState<"equal" | "exact" | "percentage">(
    defaultValues?.split_type || "equal",
  );

  const session = queryClient.getQueryData(["session"]) as UserResource;

  const { data: categories } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await categoryService.getCategories();
    },
    select: (data) =>
      data.data.map((category) => {
        return {
          id: category.id,
          name: category.attributes.name,
          icon: category.attributes.icon,
        };
      }),
  });

  const { data: groups } = useSuspenseQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      return await groupsService.getGroups();
    },
    select: (data) => {
      const members = (data.included ?? []).filter(
        (member) => member.type === "user",
      ) as unknown as UserResource[];

      const membersOptions = members.map((user) => ({
        id: user.id,
        name: user.attributes.full_name,
        email: user.attributes.email_address,
      }));

      return data.data.map((group) => {
        return {
          id: group.id,
          name: group.attributes.name,
          members: membersOptions,
        };
      });
    },
  });

  const form = useForm({
    defaultValues: defaultValues ?? {
      name: "",
      amount: 0,
      currency: "USD", // Default currency
      payer_id: session.id, // Default payer to current user
      split_type: "equal",
      group_id: "",
      category_id: "",
      expense_date: new Date().toISOString().split("T")[0], // Default to current date
      settled: false,
      distribution: [],
    },
    onSubmit: async ({ value }) => {
      // const expensesUsersAttributes = value.expenses_users_attributes.map(
      //   (attr) => ({
      //     user_id: attr.user_id,
      //     amount: attr.amount,
      //     paid: attr.paid,
      //   }),
      // );
      await onSubmit({
        ...value,
        distribution: (
          groups.find((group) => group.id === selectedGroupId)?.members || []
        ).map((member) => ({
          user_id: member.id,
          amount: value.amount / selectedGroupMembers.length,
        })),
      });
    },
  });

  const isCreate = defaultValues === undefined;

  const selectedGroupId = useStore(form.store, (state) => {
    return state.values.group_id;
  });

  const selectedGroupMembers =
    groups.find((group) => group.id === selectedGroupId)?.members || [];

  return (
    <form
      className="p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">
              {isCreate ? "Create New Expense" : "Edit Expense"}
            </h1>
            <p className="text-muted-foreground">
              {isCreate
                ? "Enter the details for your new expense"
                : "Modify the details of this expense"}
            </p>
          </div>

          {/* Expense Details Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <DollarSign className="w-5 h-5 text-primary" />
                Expense Details
              </CardTitle>
              <CardDescription>
                Basic information about the expense
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="name">
                {(field) => (
                  <>
                    <Label htmlFor={field.name}>Expense Name</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Groceries"
                      className="animate-fade-in"
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>

              <form.Field name="amount">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Amount</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      step="0.01"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                      placeholder="100.00"
                      className="animate-fade-in"
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="currency">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Currency</Label>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="animate-fade-in w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>

              <form.Field name="expense_date">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Date</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="animate-fade-in"
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>

              {/*TODO: put them under pills*/}
              <form.Field name="category_id">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Category</Label>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="animate-fade-in w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </CardContent>
          </Card>

          {/* Payer and Split Card */}
          <Card className="animate-slide-up animation-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Wallet className="w-5 h-5 text-primary" />
                Payer & Split
              </CardTitle>
              <CardDescription>
                Who paid for the expense and how it's split
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form.Field name="group_id">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Select Group</Label>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger className="animate-fade-in w-full">
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>

              {selectedGroupId && (
                <form.Field name="payer_id">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Paid By</Label>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger className="animate-fade-in w-full">
                          <SelectValue placeholder="Select payer" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedGroupMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldInfo field={field} />
                    </div>
                  )}
                </form.Field>
              )}

              <div className="space-y-2">
                <Label>Split Type</Label>
                <RadioGroup
                  value={splitType}
                  onValueChange={(value: "equal" | "exact" | "percentage") =>
                    setSplitType(value)
                  }
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equal" id="split-equal" />
                    <Label htmlFor="split-equal">Equal</Label>
                  </div>
                  {/*<div className="flex items-center space-x-2">
                    <RadioGroupItem value="exact" id="split-exact" />
                    <Label htmlFor="split-exact">Exact Amounts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="split-percentage" />
                    <Label htmlFor="split-percentage">Percentages</Label>
                  </div>*/}
                </RadioGroup>
              </div>

              {/* Expense Participants based on Split Type */}

              {/*<form.Subscribe
                selector={(state) => [
                  state.values.amount,
                  state.values.split_type,
                ]}
              >
                {([totalAmount = 0, splitType]) => (
                  <form.Field name="distribution">
                    {(field) => (
                      <div className="space-y-4">
                        <Label>Who owes what?</Label>
                        {selectedGroupMembers.map((participant, index) => {
                          let amount = 0;

                          switch (splitType) {
                            case "equal":
                              amount =
                                totalAmount / selectedGroupMembers.length;
                              break;
                            case "percentage":
                              amount =
                                (totalAmount * participant.percentage) / 100;
                              break;
                            default:
                              break;
                          }

                          return (
                            <div
                              key={participant.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-slide-in"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                  {participant.name.split(" ")[0][0]}
                                  {participant.name.split(" ")[1][0]}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {participant.name}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {splitType === "equal" && (
                                  <Input
                                    type="text"
                                    value={participant.amount.toFixed(2)}
                                    readOnly
                                    className="w-24 text-right"
                                  />
                                )}
                                {splitType === "exact" && (
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={participant.amount}
                                    onChange={(e) => {
                                      const newAmount = Number(e.target.value);
                                      field.handleChange(
                                        field.state.value?.map((p, i) =>
                                          i === index
                                            ? { ...p, amount: newAmount }
                                            : p,
                                        ),
                                      );
                                    }}
                                    className="w-24 text-right"
                                  />
                                )}
                                {splitType === "percentage" && (
                                  <div className="flex items-center">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={participant.amount}
                                      onChange={(e) => {
                                        const newPercentage = Number(
                                          e.target.value,
                                        );
                                        field.handleChange(
                                          field.state.value?.map((p, i) =>
                                            i === index
                                              ? { ...p, amount: newPercentage }
                                              : p,
                                          ),
                                        );
                                      }}
                                      className="w-24 text-right"
                                    />
                                    <span className="ml-2">%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </form.Field>
                )}
              </form.Subscribe>*/}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <CardFooter className="flex gap-3 justify-end animate-slide-up animation-delay-400 md:flex-row flex-col">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/expenses/list" })} // Adjust navigation as needed
              className="animate-fade-in w-full md:w-fit"
            >
              Cancel
            </Button>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {() => (
                <Button
                  type="submit"
                  className="animate-fade-in w-full md:w-fit cursor-pointer"
                >
                  {isCreate
                    ? form.state.isSubmitting
                      ? "Creating..."
                      : "Create Expense"
                    : form.state.isSubmitting
                      ? "Updating..."
                      : "Update Expense"}
                </Button>
              )}
            </form.Subscribe>
          </CardFooter>
        </div>
      </div>
    </form>
  );
};

export default EditExpenseForm;
