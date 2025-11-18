import { Gender, IUser } from "./IUser";

export interface IAccountEditRequest {
  name: string;
  login: string;
  email: string;
  gender: Gender;          
  birthDate: string;
  career: string;           // по контракту — строка
  post: string;             // по контракту — строка
}
export interface IAccountEditResponse {
  user: IUser
}
