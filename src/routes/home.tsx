import { type Group, groupsService } from "@/api/services";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function HomePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await groupsService.getGroups();
        setGroups(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch groups");
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6">
        <div className="text-lg">Loading groups...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-6">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
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
  );
}
