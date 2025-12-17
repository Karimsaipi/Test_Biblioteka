// ================ ENTITIES (доменные типы) ============

// ===================== DTO (API) ======================

//пример ошибки от бэка
export interface IServerError {
    code: string | number;
    name: string;
    error: string;
    message: string;
}

