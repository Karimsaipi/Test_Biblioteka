import axios from "axios";
import { isServerError } from "../models/IServerError";
import { getErrorMessage } from "./error";

export const api = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
  paramsSerializer: (params) => {
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((v) => {
          search.append(`${key}[]`, String(v));
        });
      } else {
        // если НЕ массив -> всё равно шлём как массив
        search.append(`${key}[]`, String(value));
      }
    });

    return search.toString();
  },
});

// Подставляем токен из localStorage (если есть)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

let pushError: ((msg: string) => void) | null = null;
export const bindAxiosNotifier = (fn: (msg: string) => void) => { pushError = fn; };

//любая ошибка → текст из getErrorMessage идет в тост
api.interceptors.response.use(
  (r) => r,
  (e) => {
    console.log("[AXIOS ERROR]", e?.response?.status, e?.response?.data);
    const msg = getErrorMessage(e, "Ошибка");
    console.log("[TOAST MSG]", msg);
    pushError?.(msg);
    return Promise.reject(e);
  }
);