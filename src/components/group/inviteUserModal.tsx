import { invitationsService } from "@/api/services/invitations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@radix-ui/react-label";
import { useForm } from "@tanstack/react-form";
import { Mail } from "lucide-react";
import { memo, useState } from "react";

interface IInviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

const InviteUserModal = memo(({ isOpen, onClose }: IInviteUserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      email_address: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        await invitationsService.sendInvitation({
          email_address: value.email_address,
          message: value.message,
        });

        toast({
          title: "Invitation Sent",
          description: `Invitation sent to ${value.email_address}`,
          variant: "success",
        });

        // Reset form and close modal
        form.reset();
        onClose();
      } catch (error) {
        toast({
          title: "Failed to Send Invitation",
          description:
            error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Invite User
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join this group
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field name="email_address">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email Address</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="user@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="message">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Message (Optional)</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="Join our group to split expenses!"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.state.canSubmit}
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

InviteUserModal.displayName = "InviteUserModal";

export { InviteUserModal };
