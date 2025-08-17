import { type CreateGroupParams, groupsService } from "@/api/services/groups";
import EditGroupForm from "@/components/group/editGroupForm";

import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

// TODO: add debounce
export const Route = createFileRoute("/(fullscreen)/_fullscreen/groups/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (params: CreateGroupParams) =>
      groupsService.createGroup(params),
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Group created successfully!",
        variant: "default",
      });

      await queryClient.invalidateQueries({ queryKey: ["groups"] });
      navigate({ to: "/groups/list" });
    },
    onError: (err) => {
      console.log(err, "LOGGER");
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (values: CreateGroupParams) => {
    await createGroupMutation.mutateAsync(values);
  };

  return <EditGroupForm onSubmit={handleSubmit} />;
}
