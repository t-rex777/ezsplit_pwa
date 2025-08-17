import type { TResource } from "@/api";
import { apiCall } from "../client";

// Group-related types
export interface Group {
  id: string;
  attributes: {
    name: string;
    description: string;
    created_by_id: string;
    created_at: string;
    updated_at: string;
  };
  relationships?: {
    users?: {
      data: Array<{
        id: string;
        type: string;
      }>;
    };
  };
}

export interface GroupsResponse {
  data: Group[];
  meta?: {
    pagination?: {
      current: number;
      next: number | null;
      prev: number | null;
      total_pages: number;
      total_count: number;
    };
  };
}

export interface CreateGroupParams {
  name: string;
  description: string;
  created_by_id: string;
  user_ids: string[];
}

// Groups service methods
export const groupsService = {
  // Get all groups
  getGroups: async (): Promise<GroupsResponse> => {
    const response = await apiCall<GroupsResponse>({
      method: "GET",
      url: "/groups",
    });
    return response;
  },

  // Get single group by ID
  getGroup: async (
    id: string,
  ): Promise<{ data: Group; included: TResource[] }> => {
    const response = await apiCall<{ data: Group; included: TResource[] }>({
      method: "GET",
      url: `/groups/${id}`,
    });
    return response;
  },

  // Create new group
  createGroup: async (groupData: CreateGroupParams): Promise<Group> => {
    const response = await apiCall<{ data: Group }>({
      method: "POST",
      url: "/groups",
      data: {
        group: groupData,
      },
    });
    return response.data;
  },

  // Update group
  updateGroup: async (
    id: string,
    groupData: Partial<CreateGroupParams>,
  ): Promise<Group> => {
    const response = await apiCall<{ data: Group }>({
      method: "PUT",
      url: `/groups/${id}`,
      data: {
        group: groupData,
      },
    });
    return response.data;
  },

  // Add users to group
  addUsersToGroup: async (
    groupId: string,
    userIds: string[],
  ): Promise<Group> => {
    const response = await apiCall<{ data: Group }>({
      method: "POST",
      url: `/groups/${groupId}/add_users`,
      data: {
        user_ids: userIds,
      },
    });
    return response.data;
  },

  // Remove users from group
  removeUsersFromGroup: async (
    groupId: string,
    userIds: string[],
  ): Promise<Group> => {
    const response = await apiCall<{ data: Group }>({
      method: "DELETE",
      url: `/groups/${groupId}/remove_users`,
      data: {
        user_ids: userIds,
      },
    });
    return response.data;
  },

  // Delete group
  deleteGroup: async (id: string): Promise<void> => {
    await apiCall({
      method: "DELETE",
      url: `/groups/${id}`,
    });
  },
};
