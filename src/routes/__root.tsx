import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { authService } from "@/api/services/auth";
import type { QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import Header from "../components/Header";

export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  wrapInSuspense: true,
  beforeLoad: async ({ context }) => {
    await context.queryClient.fetchQuery({
      queryKey: ["session"],
      queryFn: async () => await authService.getProfile(),
    });
  },
  component: () => {
    return (
      <Suspense>
        <Header />
        <Outlet />
        <TanStackRouterDevtools />
      </Suspense>
    );
  },
});
