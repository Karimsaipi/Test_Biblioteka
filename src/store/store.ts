import { configureStore } from "@reduxjs/toolkit";
import notify from "./notifySlice";           

export const store = configureStore({
  reducer: { notify },                        
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
