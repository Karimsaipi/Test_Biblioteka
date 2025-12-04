// ================ ENTITIES (доменные типы) ============

export enum Theme {
    "Авторские права" = 0,
    "Ошибка на сайте" = 1,
    "Другое" = 2,
}

// ===================== DTO (API) ======================

export interface IFeedbackReqBody {
    theme: Theme;
    userName: string;
    email: string;
    message: string;
}
