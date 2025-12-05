import { configureStore } from "@reduxjs/toolkit";
import notify from "./NotifySlice/notifySlice";
import auth from "./AuthSlice/authSlice";
import lastOpened from "./LastOpenedSlice/lastOpenedSlice";
import overlay from "./OverlaySlice/overlaySlice";

export const store = configureStore({
    reducer: { notify, auth, lastOpened, overlay },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
