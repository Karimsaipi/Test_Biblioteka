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

// глобальная обработка ошибок: любой фейл → текст из getErrorMessage → тост
api.interceptors.response.use(
  (r) => r,
  (e) => {
    pushError?.(getErrorMessage(e, "Ошибка"));
    return Promise.reject(e);
  }
);