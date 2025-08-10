import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(fullscreen)/_fullscreen")({
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
    <div className="min-h-[calc(100vh-4vh)] p-6 animate-fade-in-scale overflow-hidden">
      <Outlet />
    </div>
  );
}
