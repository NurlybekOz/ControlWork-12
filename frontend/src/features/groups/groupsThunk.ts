import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import {GroupMutation, IGroup} from "../../types";

export const fetchAllGroups = createAsyncThunk<IGroup[], string | null>(
    'groups/fetchAllGroups',
    async (userId) => {
        let url = '/groups';
        if (userId) {
            url = `/groups?user=${userId}`;
        }
        const response = await axiosApi<IGroup[]>(url)
        return response.data || [];
    }
)

export const fetchGroupById = createAsyncThunk<IGroup, string>(
    'groups/fetchGroupById',
    async (groupId) => {
        const response = await axiosApi<IGroup>(`/groups/${groupId}`)
        return response.data || null;
    }
)

export const createGroup = createAsyncThunk<void, GroupMutation>(
    'groups/createGroup',
    async (groupToAdd) => {
        const formData = new FormData();

        const keys = Object.keys(groupToAdd) as (keyof GroupMutation)[];
        keys.forEach(key => {
            const value = groupToAdd[key];
            if (value !== null && value !== undefined) {
                    formData.append(key, value as string);
            }
        });

        await axiosApi.post('/groups', formData);
    }
);

export const patchGroup = createAsyncThunk<
    void,
    string
>(
    'groups/patchGroup',
    async (groupId) => {
        const response = await axiosApi.patch(`/admin/groups/${groupId}`)
        return response.data;
    }
)
export const deleteGroup = createAsyncThunk<
    void,
    string
>(
    'groups/deleteGroup',
    async (groupId) => {
        const response = await axiosApi.delete(`/admin/groups/${groupId}`)
        return response.data;
    }
)
export const deleteGroupByAuthor = createAsyncThunk<
    void,
    string
>(
    'groups/deleteGroupByAuthor',
    async (groupId) => {
        const response = await axiosApi.delete(`/groups/${groupId}`)
        return response.data;
    }
)

export const joinGroup = createAsyncThunk<void, { groupId: string, userId: string }>(
    'groups/joinGroup',
    async ({ groupId, userId }) => {
        await axiosApi.patch(`/groups/${groupId}/join`, { userId });
    }
);

export const leaveGroup = createAsyncThunk<void, { groupId: string, userId: string }>(
    'groups/leaveGroup',
    async ({ groupId, userId }) => {
        await axiosApi.patch(`/groups/${groupId}/leave`, { userId });
    }
);


export const fetchUserGroups = createAsyncThunk<IGroup[], string>(
    'groups/fetchUserGroups',
    async (userId) => {
            const response = await axiosApi<IGroup[]>(`/groups/userGroups?userId=${userId}`);
            return response.data || [];
    }
);

export const removeUserFromGroup = createAsyncThunk<
    void,
    { groupId: string; userIdToRemove: string }
>(
    'groups/removeUserFromGroup',
    async ({ groupId, userIdToRemove }) => {
        await axiosApi.patch(`/groups/${groupId}/removeUser`, { userIdToRemove });
    }
);
