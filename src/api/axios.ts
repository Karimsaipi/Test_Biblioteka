import axios, { AxiosRequestHeaders } from "axios";
import { getErrorMessage } from "./error";
import { store } from "@/store/store";
import { logout } from "@/store/AuthSlice/authSlice";
import { error } from "@/store/NotifySlice/notifySlice";
import { openProfileOverlay } from "@/store/OverlaySlice/overlaySlice";

export const api = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
    timeout: 30000,
    paramsSerializer: (params) => {
        const search = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value == null) return;

            const values = Array.isArray(value) ? value : [value];

            values.forEach((v) => {
                search.append(`${key}[]`, String(v));
            });
        });

        return search.toString();
    },
});

// Подставляем токен из localStorage (если есть)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

//любая ошибка → текст из getErrorMessage идет в тост
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;

        if (status === 401) {
            store.dispatch(logout());
            store.dispatch(openProfileOverlay());
        } else {
            const msg = getErrorMessage(err, "Ошибка");
            store.dispatch(error(msg));
        }
        console.log("[AXIOS ERROR]", err?.response?.status, err?.response?.data);
        return Promise.reject(err);
    },
);
