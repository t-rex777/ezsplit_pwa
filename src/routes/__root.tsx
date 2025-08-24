import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { authService } from "@/api/services/auth";
import { Toaster } from "@/components/ui/toaster";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";

export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  wrapInSuspense: true,
  beforeLoad: async ({ context }) => {
    const session = context.queryClient.getQueryData(["session"]);

    if (!session) {
      await context.queryClient.fetchQuery({
        queryKey: ["session"],
        queryFn: async () => await authService.getProfile(),
        gcTime: Number.POSITIVE_INFINITY,
        staleTime: Number.POSITIVE_INFINITY,
      });
    }
  },
  component: () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
        <Toaster />
        {/* <TanStackRouterDevtools /> */}
        <ReactQueryDevtools initialIsOpen={false} />
      </Suspense>
    );
  },
});
