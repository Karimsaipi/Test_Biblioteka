import { configureStore } from "@reduxjs/toolkit";
import notify from "./notifySlice";
import auth from "./authSlice";
import lastOpened from "./lastOpenedSlice";

export const store = configureStore({
    reducer: { notify, auth, lastOpened },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
