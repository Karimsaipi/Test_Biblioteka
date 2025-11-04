import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NoticeType = "success" | "error";
type State = { visible: boolean; type: NoticeType; message: string };

const initial: State = { visible: false, type: "success", message: "" };

const notify = createSlice({
    name: "notify",
    initialState: initial,
    reducers: {
        show(state, action: PayloadAction<{ type: NoticeType; message: string }>) {
            state.visible = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        success(state, action: PayloadAction<string>) {
            state.visible = true;
            state.type = "success";
            state.message = action.payload;
        },
        error(state, action: PayloadAction<string>) {
            state.visible = true;
            state.type = "error";
            state.message = action.payload;
        },
        hide(state) {
            state.visible = false;
            state.message = "";
        },
    },
});

export const { show, success, error, hide } = notify.actions;
export default notify.reducer;
