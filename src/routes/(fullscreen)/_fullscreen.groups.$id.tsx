import { type CreateGroupParams, groupsService } from "@/api/services/groups";
import type { User } from "@/api/services/users";
import EditGroupForm, {
  type EditGroupFormData,
} from "@/components/group/editGroupForm";
import { useToast } from "@/components/ui/use-toast";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";

export const Route = createFileRoute("/(fullscreen)/_fullscreen/groups/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { id } = useParams({
    from: "/(fullscreen)/_fullscreen/groups/$id",
  });

  const {
    data: { data: group, included },
  } = useSuspenseQuery({
    queryKey: ["group", id],
    queryFn: () => groupsService.getGroup(id),
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (params: Partial<CreateGroupParams>) =>
      groupsService.updateGroup(id, params),
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Group updated successfully!",
        variant: "default",
      });

      await queryClient.invalidateQueries({ queryKey: ["groups"] });
      navigate({ to: "/groups/list" });
    },
    onError: (err) => {
      console.log(err, "LOGGER");
      toast({
        title: "Error",
        description: "Failed to update group. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (values: CreateGroupParams) => {
    await createGroupMutation.mutateAsync(values);
  };

  const userIds = group.relationships?.users?.data.map((user) => user.id) ?? [];
  const users = included?.filter(
    (user) => userIds?.includes(user.id) && user.type === "user",
  ) as User[] | undefined;

  const defaultValues: EditGroupFormData = {
    name: group.attributes.name,
    description: group.attributes.description,
    users: users || [],
    created_by_id: group.attributes.created_by_id,
    user_ids: userIds,
  };

  return (
    <EditGroupForm onSubmit={handleSubmit} defaultValues={defaultValues} />
  );
}
