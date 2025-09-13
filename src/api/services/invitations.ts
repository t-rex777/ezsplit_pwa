import { apiCall } from "../client";
import type { ApiResponse } from "../index";

// Invitation-related types
export interface InviteUserRequest {
  email_address: string;
  message: string;
}

export interface InviteUserResponse {
  message: string;
  invitation_sent: boolean;
}

// Invitations service methods
export const invitationsService = {
  // Send invitation to user by email
  sendInvitation: async (
    inviteData: InviteUserRequest,
  ): Promise<InviteUserResponse> => {
    const response = await apiCall<ApiResponse<InviteUserResponse>>({
      method: "POST",
      url: "/invitations",
      data: {
        invitation: {
          email_address: inviteData.email_address,
          message: inviteData.message,
        },
      },
    });
    return response.data;
  },
};
