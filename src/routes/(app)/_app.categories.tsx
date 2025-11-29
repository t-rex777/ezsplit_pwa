import { CategoryPage } from "@/components/category/editCategoryPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_app/categories")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CategoryPage />;
}
