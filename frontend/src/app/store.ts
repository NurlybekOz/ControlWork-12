import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore, } from "redux-persist";
import { usersReducer } from "../features/users/UserSlice";
import {groupsReducer} from "../features/groups/groupsSlice.ts";


const usersPersistConfig = {
    key: 'store: Users',
    storage,
    whitelist: ['user']
};

const rootReducer = combineReducers({
    groups: groupsReducer,
    users:  persistReducer(usersPersistConfig, usersReducer),
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE]
            }
        })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;