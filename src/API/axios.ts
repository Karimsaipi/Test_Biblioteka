import axios from "axios";

export const api = axios.create({
  baseURL: process.env.API_URL || '/',
  headers: { "Content-Type": "application/json" },
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
