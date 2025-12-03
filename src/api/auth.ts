import { IAuthResponse, IRegisterReqBody, ISignInReqBody } from "@/models/IAuth";
import { api } from "./axios";

//Post/Авторизоваться
export async function signIn(body: ISignInReqBody): Promise<IAuthResponse> {
    const { data } = await api.post<IAuthResponse>("/account/sign-in", body);
    return data;
}

//Post/Зарегистрироваться
export async function signUp(body: IRegisterReqBody): Promise<IAuthResponse> {
    const { data } = await api.post<IAuthResponse>("/account/sign-up", body);
    return data;
}
