import type { User } from "@/api/services/users";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar"; // Adjust import path as needed

type AvatarStackProps = {
  users: User[];
};

const MAX_AVATARS = 3;

export const AvatarStack: React.FC<AvatarStackProps> = ({ users }) => {
  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      {users.slice(0, MAX_AVATARS).map((user, idx) => (
        <Avatar key={user.id}>
          <AvatarImage
            src={user.attributes.avatar_url}
            alt={
              user.attributes.full_name
                ? `@${user.attributes.full_name}`
                : `User ${idx + 1}`
            }
          />
          <AvatarFallback className="bg-amber-800">
            {user.attributes.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}

      {users.length > MAX_AVATARS && (
        <Avatar>
          <AvatarImage src="/images/avatar.svg" alt="More users" />
          <AvatarFallback className="bg-amber-800">
            +{users.length - MAX_AVATARS}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
