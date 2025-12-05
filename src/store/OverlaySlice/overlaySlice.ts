import { createSlice } from "@reduxjs/toolkit";

type OverlayState = {
    profileOpen: boolean;
};

const initialState: OverlayState = {
    profileOpen: false,
};

const overlaySlice = createSlice({
    name: "overlay",
    initialState,
    reducers: {
        openProfileOverlay(state) {
            state.profileOpen = true;
        },
        closeProfileOverlay(state) {
            state.profileOpen = false;
        },
        toggleProfileOverlay(state) {
            state.profileOpen = !state.profileOpen;
        },
    },
});

export const { openProfileOverlay, closeProfileOverlay, toggleProfileOverlay } =
    overlaySlice.actions;

export default overlaySlice.reducer;
