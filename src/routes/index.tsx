import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Redirect to home page
    throw redirect({ to: "/home" });
  },
  component: () => null,
});
