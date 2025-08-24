import { groupsService } from "@/api/services/groups";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Plus, Users } from "lucide-react";

export const Route = createFileRoute("/(app)/_app/groups/list")({
  component: GroupsPage,
});

function GroupsPage() {
  const {
    data: { data: groups },
  } = useSuspenseQuery({
    queryKey: ["groups"],
    queryFn: async () => await groupsService.getGroups(),
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 pb-20 animate-fade-in-scale">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Groups</h1>
          </div>

          <Link to="/groups/new">
            <Button
              size="sm"
              className="rounded-full h-10 w-10 p-0 cursor-pointer"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Groups List */}
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No groups yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Create your first group to start splitting expenses with friends.
            </p>
            <Button className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {groups.map((group) => (
              <Link to="/groups/$id" params={{ id: group.id }} key={group.id}>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {group.attributes.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          3 members • $45.50 pending
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
