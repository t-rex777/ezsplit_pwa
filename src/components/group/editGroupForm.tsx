import type { UserResource } from "@/api/services/users";
import { usersService } from "@/api/services/users";
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
import { useForm } from "@tanstack/react-form";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Search, UserPlus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

interface EditGroupFormProps {
  defaultValues?: Partial<EditGroupFormData>;
  onSubmit: (values: EditGroupFormData) => Promise<void>;
}

export interface EditGroupFormData {
  name: string;
  description: string;
  created_by_id: string;
  users: UserResource[];
  user_ids: string[]; // Required to match CreateGroupParams
}

const EditGroupForm = ({ defaultValues, onSubmit }: EditGroupFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserResource[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Fetch users for search
  const { data: usersData, isLoading: usersLoading } = useInfiniteQuery({
    queryKey: ["users", searchQuery],
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage) => lastPage.meta.next_page,
    initialPageParam: 1,
    queryFn: async () => await usersService.searchUsers(searchQuery),
    enabled: searchQuery.length > 0 || showSearchResults,
    select: (data) => {
      return data.pages.flatMap((page) => page.data);
    },
  });

  const session = queryClient.getQueryData(["session"]) as UserResource;

  const form = useForm({
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      created_by_id: "",
      user_ids: [],
    },
    onSubmit: async ({ value }) => {
      const params = {
        name: value.name || "",
        description: value.description || "",
        created_by_id: session.id,
        user_ids: [
          ...new Set([...selectedUsers.map((user) => user.id), session.id]),
        ],
        users: selectedUsers, // Include the users array for the interface
      };

      await onSubmit(params as EditGroupFormData);
    },
  });

  const handleUserSelect = (user: UserResource) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // TODO: pre select current user, and choose other users
  const filteredUsers =
    usersData?.filter(
      (user) => !selectedUsers.find((selected) => selected.id === user.id),
    ) || [];

  const isCreate = defaultValues === undefined;

  useEffect(() => {
    if (Number(defaultValues?.users?.length) > 0) {
      setSelectedUsers(defaultValues?.users ?? []);
      // Also update the form's user_ids field
      form.setFieldValue(
        "user_ids",
        defaultValues?.users?.map((user) => user.id) || [],
      );
    }
  }, [defaultValues, form]);

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
              Create New Group
            </h1>
            <p className="text-muted-foreground">
              Set up a group and add members to start splitting expenses
            </p>
          </div>

          {/* Group Details Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="w-5 h-5 text-primary" />
                Group Information
              </CardTitle>
              <CardDescription>
                Basic details about your new group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="name">
                {(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Group Name</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Group X"
                        className="animate-fade-in"
                      />

                      <FieldInfo field={field} />
                    </>
                  );
                }}
              </form.Field>

              <form.Field name="description">
                {(field) => {
                  return (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Description</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Sikkim trip"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="animate-fade-in"
                      />
                    </div>
                  );
                }}
              </form.Field>
            </CardContent>
          </Card>

          {/* Add Members Card */}
          <Card className="animate-slide-up animation-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <UserPlus className="w-5 h-5 text-primary" />
                Add Members
              </CardTitle>
              <CardDescription>
                Search and add users to your group
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  className="pl-10 animate-fade-in"
                />
              </div>

              {/* Search Results */}
              {showSearchResults && (
                <div className="space-y-2 animate-fade-in">
                  {usersLoading ? (
                    <div className="text-center py-4 text-gray-500">
                      Loading...
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredUsers.map((user, index) => (
                        // biome-ignore lint/a11y/useKeyWithClickEvents: this is fine
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer animate-slide-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                          onClick={() => handleUserSelect(user)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.attributes.first_name[0]}
                              {user.attributes.last_name[0]}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.attributes.full_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.attributes.email_address}
                              </div>
                            </div>
                          </div>
                          <UserPlus className="w-5 h-5 text-green-600" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No users found
                    </div>
                  )}
                </div>
              )}

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="space-y-2 animate-fade-in">
                  <Label>Selected Members ({selectedUsers.length})</Label>
                  <div className="space-y-2">
                    {selectedUsers.map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg animate-slide-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.attributes.first_name[0]}
                            {user.attributes.last_name[0]}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.attributes.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.attributes.email_address}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserRemove(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <CardFooter className="flex gap-3 justify-end animate-slide-up animation-delay-400 md:flex-row flex-col">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/groups/list" })}
              className="animate-fade-in w-full md:w-fit"
            >
              Cancel
            </Button>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {() => {
                return (
                  <Button
                    type="submit"
                    className="animate-fade-in w-full md:w-fit cursor-pointer"
                  >
                    {isCreate
                      ? form.state.isSubmitting
                        ? "Creating..."
                        : "Create Group"
                      : form.state.isSubmitting
                        ? "Updating..."
                        : "Update Group"}
                  </Button>
                );
              }}
            </form.Subscribe>
          </CardFooter>
        </div>
      </div>
    </form>
  );
};

export default EditGroupForm;
