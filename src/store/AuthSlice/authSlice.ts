import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../models/IUser";

type AuthState = {
    isAuth: boolean;
    user: IUser | null;
    token: string | null;
};

const initialToken = localStorage.getItem("token");
const initialUser = (() => {
    try {
        const raw = localStorage.getItem("user");
        return raw ? (JSON.parse(raw) as IUser) : null;
    } catch {
        return null;
    }
})();

const initialState: AuthState = {
    isAuth: Boolean(initialToken),
    token: initialToken,
    user: initialUser,
};

type CredentialsPayload = { token: string; user: IUser };

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: {
            reducer(state, action: PayloadAction<CredentialsPayload>) {
                state.isAuth = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            },
            prepare(token: string, user: IUser) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                return { payload: { token, user } };
            },
        },

        setUser: {
            reducer(state, action: PayloadAction<IUser>) {
                state.user = action.payload;
            },
            prepare(user: IUser) {
                if (localStorage.getItem("token")) {
                    localStorage.setItem("user", JSON.stringify(user));
                }
                return { payload: user };
            },
        },

        logout: {
            reducer(state) {
                state.isAuth = false;
                state.token = null;
                state.user = null;
            },
            prepare() {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                return { payload: undefined };
            },
        },
    },
});

export const { setCredentials, setUser, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
