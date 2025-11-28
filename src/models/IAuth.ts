import { Gender, IUser } from "./IUser";

// POST /account/sign-up
export interface IRegisterReqBody {
    login: string;
    password: string;
    name: string;
    gender: Gender;
    email: string;
    birthDate: string; 
    career: string;
    post: string;
}

// POST /account/sign-in
export interface ISignInReqBody {
    login: string;
    password: string;
}

export interface IAuthResponse {
    user: IUser;
    token: string;
}
