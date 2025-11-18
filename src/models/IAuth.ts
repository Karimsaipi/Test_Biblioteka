import { Gender, IUser } from "./IUser";

// POST /account/sign-up
export interface IRegisterRequest {
    login: string;
    password: string;
    name: string;
    gender: Gender;
    email: string;
    birthDate: string; // "YYYY-MM-DD"
    career: string;
    post: string;
}

// POST /account/sign-in
export interface ISignInRequest {
    login: string;
    password: string;
}

export interface IAuthResponse {
    user: IUser;
    token: string;
}
