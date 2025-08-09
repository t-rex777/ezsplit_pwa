import { groupsService } from "@/api/services/groups";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/(app)/_app/home")({
  component: HomePage,
});

function HomePage() {
  const {
    data: { data: groups },
  } = useSuspenseQuery({
    queryKey: ["groups"],
    queryFn: async () => await groupsService.getGroups(),
  });

  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh flex-col items-center justify-center p-6">
          <div className="text-lg">Loading groups...</div>
        </div>
      }
    >
      <div className="min-h-svh p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Groups</h1>

          {groups.length === 0 ? (
            <div className="text-gray-500 text-lg">No groups found</div>
          ) : (
            <div className="space-y-2">
              {groups.map((group) => (
                <div key={group.id} className="text-lg">
                  {group.attributes.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
