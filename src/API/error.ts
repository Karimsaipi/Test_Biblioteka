import axios from "axios";
import { isServerError } from "../models/IServerError";

export function getErrorMessage(err: unknown, fallback = "Ошибка"): string {
    if (axios.isAxiosError(err)) {
        const res = err.response;

        if (!res) {
            if (err.code === "ECONNABORTED") return "Превышено время ожидания запроса";
            return "Сетевая ошибка";
        }

        const { status, data } = res;

        if (isServerError(data)) return data.message;

        // Строковый ответ бэка
        if (typeof data === "string" && data.trim()) return data;

        // Популярные поля
        if (data && typeof data === "object") {
            const d: any = data;
            if (typeof d.message === "string") return d.message;
            if (typeof d.error === "string") return d.error;
            if (typeof d.detail === "string") return d.detail; // RFC7807
            if (typeof d.title === "string") return d.title; // RFC7807
        }

        // Дефолты по статусу
        if (status === 401) return "Не авторизован";
        if (status === 403) return "Доступ запрещён";
        if (status === 404) return "Ресурс не найден";
        if (status >= 500) return "Ошибка сервера";

        return err.message || fallback;
    }

    if (isServerError(err)) return err.message;
    if (err instanceof Error && err.message) return err.message;
    if (typeof err === "string") return err;

    return fallback;
}
