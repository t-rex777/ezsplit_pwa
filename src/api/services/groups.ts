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
  getGroup: async (id: string): Promise<Group> => {
    const response = await apiCall<{ data: Group }>({
      method: "GET",
      url: `/groups/${id}`,
    });
    return response.data;
  },

  // Create new group
  createGroup: async (groupData: {
    name: string;
    description?: string;
  }): Promise<Group> => {
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
    groupData: {
      name?: string;
      description?: string;
      user_ids?: string[];
    },
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

  // Delete group
  deleteGroup: async (id: string): Promise<void> => {
    await apiCall({
      method: "DELETE",
      url: `/groups/${id}`,
    });
  },
};
