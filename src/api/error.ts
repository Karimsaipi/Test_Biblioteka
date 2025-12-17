import axios from "axios";
import { isServerError } from "@/shared/utils/isServerError";

export function getErrorMessage(err: unknown, fallback = "Ошибка"): string {
    if (axios.isAxiosError(err)) {
        const res = err.response;

        if (!res) {
            switch (err.code) {
                case "ECONNABORTED":
                    return "Превышено время ожидания запроса";
                default:
                    return "Сетевая ошибка";
            }
        }

        const { status, data } = res;

        if (isServerError(data)) return data.message;

        // строковый ответ бэка
        if (typeof data === "string" && data.trim()) return data;

        if (data && typeof data === "object") {
            const d = data as { message?: unknown; error?: unknown };
            if (typeof d.message === "string") return d.message;
            if (typeof d.error === "string") return d.error;
        }

        switch (status) {
            case 401:
                return "Не авторизован";
            case 403:
                return "Доступ запрещён";
            case 404:
                return "Ресурс не найден";
            default:
                if (status >= 500) return "Ошибка сервера";
        }

        return err.message || fallback;
    }

    if (isServerError(err)) return err.message;
    if (err instanceof Error && err.message) return err.message;
    if (typeof err === "string") return err;

    return fallback;
}
