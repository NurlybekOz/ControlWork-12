import {GlobalError, IGroup, User, ValidationError} from "../../types";
import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../app/store.ts";
import {googleLogin, login, register} from "./UserThunks.ts";
import {fetchUserGroups} from "../groups/groupsThunk.ts";

interface UsersState {
    user: User | null;
    userGroups: IGroup[] | null;
    registerLoading: boolean;
    registerError: ValidationError | null;
    loginLoading: boolean;
    loginError: GlobalError | null;
}

const initialState: UsersState = {
    user: null,
    userGroups: [],
    registerLoading: false,
    registerError: null,
    loginError: null,
    loginLoading: false,
}

export const selectUser = (state: RootState) => state.users.user;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectUserGroups = (state: RootState) => state.users.userGroups;


export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        unsetUser: (state) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loginLoading = true;
                state.loginError = null;
            })
            .addCase(login.fulfilled, (state, {payload: user}) => {
                state.user = user;
                state.loginLoading = false;
            })
            .addCase(login.rejected, (state, {payload: error}) => {
                state.loginLoading = false;
                state.loginError = error || null;
            })

            .addCase(register.pending, (state) => {
                state.registerLoading = true;
                state.registerError = null;
            })
            .addCase(register.fulfilled, (state, {payload}) => {
                state.user = payload.user;
                state.registerLoading = false;
            })
            .addCase(register.rejected, (state, {payload: error}) => {
                state.registerLoading = false;
                state.registerError = error || null;
            })


            .addCase(googleLogin.pending, (state) => {
                state.loginLoading = true;
                state.loginError = null;
            })
            .addCase(googleLogin.fulfilled, (state, {payload: user}) => {
                state.user = user;
                state.loginLoading = false;
            })
            .addCase(googleLogin.rejected, (state, {payload: error}) => {
                state.loginLoading = false;
                state.loginError = error || null;
            })

            builder.addCase(fetchUserGroups.fulfilled, (state, action) => {
                state.userGroups = action.payload;
            });


    }
});

export const usersReducer = usersSlice.reducer;
export const {unsetUser} = usersSlice.actions;