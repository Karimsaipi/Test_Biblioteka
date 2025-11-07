import { configureStore } from "@reduxjs/toolkit";
import notify from "./notifySlice";           
import auth from "./authSlice";

export const store = configureStore({
  reducer: { notify, auth},                        
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
