import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth")({
  component: RouteComponent,
  loader: ({ context }) => {
    const session = context.queryClient.getQueryData(["session"]);

    if (session) {
      throw redirect({ to: "/home" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
