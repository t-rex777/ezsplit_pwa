import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Group } from "@/api/services/groups";
import type { User } from "@/api/services/users";
import { AvatarStack } from "@/components/ui/avatarStack";

export interface GroupListingCardProps {
  group: Group;
  allUsers: User[];
}

export const GroupListingCard = ({
  group,
  allUsers,
}: GroupListingCardProps) => {
  const name = group.attributes.name;

  const groupMembers =
    group.relationships?.users?.data
      .map((user) => allUsers.find((u) => Number(u.id) === Number(user.id)))
      .filter((user) => user !== undefined) ?? [];

  return (
    <Link to="/groups/$id" params={{ id: group.id }}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <h3 className="font-medium text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">
                {group.attributes.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AvatarStack users={groupMembers} />
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default GroupListingCard;
