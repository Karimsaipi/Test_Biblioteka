export type Gender = "male" | "female";

export interface IUser {
    role: number;
    login: string;
    name: string;
    gender: Gender;
    email: string;
    birthDate: string;
    career: string;
    post: string;
    canPublish: boolean;
    creationDate: string;
    token?: string;
}
