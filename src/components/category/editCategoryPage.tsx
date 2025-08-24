import { type Category, categoryService } from "@/api/services/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Edit2, Plus, X } from "lucide-react";
import { useState } from "react";

const CategoryPage = (): React.JSX.Element => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categoriesResponse } = useSuspenseQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });

  const categories = categoriesResponse?.data || [];

  // Get current user from session
  const session = queryClient.getQueryData(["session"]) as
    | { user?: { id: string } }
    | { id: string }
    | undefined;
  const currentUserId =
    session && "user" in session && session.user
      ? session.user.id
      : session && "id" in session
        ? session.id
        : undefined;

  // Early return if no user ID available
  if (!currentUserId) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-muted-foreground">
          Unable to load user information. Please try refreshing the page.
        </div>
      </div>
    );
  }

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) =>
      categoryService.create(name, null, null, currentUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewCategoryName("");
      toast({
        title: "Success",
        variant: "success",
        description: "Category created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create category: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      categoryService.updateCategory(id, name, null, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      setEditName("");
      toast({
        title: "Success",
        variant: "success",
        description: "Category updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }
    createCategoryMutation.mutate(newCategoryName.trim());
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.attributes.name);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }
    updateCategoryMutation.mutate({
      id: editingCategory.id,
      name: editName.trim(),
    });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName("");
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>

        {/* Add new category form */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateCategory()}
            className="flex-1"
          />
          <Button
            onClick={handleCreateCategory}
            disabled={createCategoryMutation.isPending}
            className="px-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Categories list */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No categories found. Create your first category above.
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                {editingCategory?.id === category.id ? (
                  // Edit mode
                  <div className="flex gap-2 items-center">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleUpdateCategory()
                      }
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={handleUpdateCategory}
                      disabled={updateCategoryMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  // View mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {category.attributes.icon && (
                        <span className="text-lg">
                          {category.attributes.icon}
                        </span>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {category.attributes.name}
                        </span>
                        <span
                          className="text-xs text-muted-foreground cursor-help"
                          title={`Created on ${new Date(category.attributes.created_at).toLocaleString()}`}
                        >
                          {formatRelativeTime(category.attributes.created_at)}
                        </span>
                      </div>
                      {category.attributes.color && (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.attributes.color }}
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

CategoryPage.displayName = "CategoryPage";

export { CategoryPage };
