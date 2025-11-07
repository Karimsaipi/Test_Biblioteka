import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../models/IUser";
import { IAuthResponse } from "../models/IAuth";

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

const AuthSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<IAuthResponse>) {
            const { token, user } = action.payload;
            state.isAuth = true;
            state.token = token;
            state.user = user;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        },
        //обновления профиля
        setUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
            if (state.isAuth) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            }
        },
        //логаут
        logout(state) {
            state.isAuth = false;
            state.token = null;
            state.user = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
});

export const { setCredentials, setUser, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
