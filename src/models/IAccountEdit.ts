import { Gender, IUser } from "./IUser";

export interface IAccountEditReqBody {
    name: string;
    login: string;
    email: string;
    gender: Gender;
    birthDate: string;
    career: string;
    post: string;
}
export interface IAccountEditResponse {
    user: IUser;
}
