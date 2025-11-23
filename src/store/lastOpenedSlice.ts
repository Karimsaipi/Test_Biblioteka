import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LastOpenedState = { publicationId: number | null };

const initial: LastOpenedState = { publicationId: null };

const lastOpenedSlice = createSlice({
    name: "lastOpenedBook",
    initialState: initial,
    reducers: {
        setLastOpenedt(state, action: PayloadAction<number>) {
            state.publicationId = action.payload;
            localStorage.setItem("id", String(action.payload));
        },
        restoreLastOpened(state) {
            const raw = localStorage.getItem("lastOpenedPublicationId");
            state.publicationId = raw ? Number(raw) : null;
        },
    },
});

export const { setLastOpenedt, restoreLastOpened } = lastOpenedSlice.actions;
export default lastOpenedSlice.reducer;
