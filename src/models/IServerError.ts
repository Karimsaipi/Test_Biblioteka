// ================ ENTITIES (доменные типы) ============

// ===================== DTO (API) ======================

//пример ошибки от бэка
export interface IServerError {
    code: string | number;
    name: string;
    error: string;
    message: string;
}

export const isServerError = (x: unknown): x is IServerError =>
    !!x &&
    typeof x === "object" &&
    typeof (x as any).code === "string" &&
    typeof (x as any).name === "string" &&
    typeof (x as any).message === "string";
