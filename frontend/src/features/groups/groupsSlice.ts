import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../app/store.ts";
import { fetchAllGroups, fetchGroupById } from "./groupsThunk.ts";
import {IGroup} from "../../types";

interface GroupsState {
    items: IGroup[];
    item: IGroup | null;
    fetchLoading: boolean;
}

const initialState: GroupsState = {
    items: [],
    item: null,
    fetchLoading: false,
}

export const groupsSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllGroups.pending, (state) => {
                state.fetchLoading = true;
            })
            .addCase(fetchAllGroups.fulfilled, (state, {payload: groups}) => {
                state.items = groups;
                state.fetchLoading = false;
            })
            .addCase(fetchAllGroups.rejected, (state) => {
                state.fetchLoading = false;
            })


            .addCase(fetchGroupById.pending, (state) => {
                state.fetchLoading = true;
            })
            .addCase(fetchGroupById.fulfilled, (state, {payload: group}) => {
                state.fetchLoading = false;
                state.item = group
            })
            .addCase(fetchGroupById.rejected, (state) => {
                state.fetchLoading = false;
            })
    }
})

export const groupsReducer = groupsSlice.reducer;
export const selectGroups = (state: RootState) => state.groups.items;
export const selectGroupById = (state: RootState) => state.groups.item;
export const selectGroupsLoading = (state: RootState) => state.groups.fetchLoading;
