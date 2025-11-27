import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LastOpenedState = {
    publicationId: number | null;
    pageNumber: number;
    readerOpen: boolean;
    hydrated: boolean;
};

const LS_KEY = "lastOpenedPublication";

const initial: LastOpenedState = {
    publicationId: null,
    pageNumber: 1,
    readerOpen: false,
    hydrated: false,
};

function saveToLS(state: LastOpenedState) {
    localStorage.setItem(
        LS_KEY,
        JSON.stringify({
            publicationId: state.publicationId,
            pageNumber: state.pageNumber,
            readerOpen: state.readerOpen,
        }),
    );
}

function loadFromLS(): Omit<LastOpenedState, "hydrated"> | null {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return {
            publicationId: typeof parsed.publicationId === "number" ? parsed.publicationId : null,
            pageNumber:
                typeof parsed.pageNumber === "number" && parsed.pageNumber > 0
                    ? parsed.pageNumber
                    : 1,
            readerOpen: !!parsed.readerOpen,
        };
    } catch {
        return null;
    }
}

const lastOpenedSlice = createSlice({
    name: "lastOpenedBook",
    initialState: initial,
    reducers: {
        setLastOpened(state, action: PayloadAction<number>) {
            const nextId = action.payload;

            if (state.publicationId === nextId) return;

            state.publicationId = nextId;
            state.pageNumber = 1;
            state.readerOpen = false;
            saveToLS(state);
        },
        setLastPage(state, action: PayloadAction<number>) {
            state.pageNumber = Math.max(1, action.payload);
            saveToLS(state);
        },
        setReaderOpen(state, action: PayloadAction<boolean>) {
            state.readerOpen = action.payload;
            saveToLS(state);
        },
        restoreLastOpened(state) {
            const saved = loadFromLS();
            if (saved) {
                state.publicationId = saved.publicationId;
                state.pageNumber = saved.pageNumber;
                state.readerOpen = saved.readerOpen;
            }
            state.hydrated = true;
        },
    },
});

export const { setLastOpened, setLastPage, setReaderOpen, restoreLastOpened } =
    lastOpenedSlice.actions;

export default lastOpenedSlice.reducer;
