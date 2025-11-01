import axios from "axios";

export const api = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
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
