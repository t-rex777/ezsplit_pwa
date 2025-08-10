import { BottomNavigation } from "@/components/BottomNavigation";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/(app)/_app")({
  component: RouteComponent,
  loader: ({ context }) => {
    const session = context.queryClient.getQueryData(["session"]);

    if (!session) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense>
        <main className="relative">
          <Outlet />
        </main>
        <BottomNavigation />
      </Suspense>
    </div>
  );
}
