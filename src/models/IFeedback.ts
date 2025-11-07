export enum Theme {
    'Авторские права' = 0,
    'Ошибка на сайте' = 1,
    'Другое' = 2,
}

export interface IFeedbackRequest {
    theme: Theme;
    userName: string;
    email: string;
    message: string;
}

