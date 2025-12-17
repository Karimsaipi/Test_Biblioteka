import { IServerError } from "@/models/IServerError";

export const isServerError = (x: unknown): x is IServerError => {
    if (typeof x !== "object" || x === null) return false;

    const e = x as Record<string, unknown>;

    return (
        typeof e.code === "string" && typeof e.name === "string" && typeof e.message === "string"
    );
};
