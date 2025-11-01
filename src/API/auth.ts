import { IAuthResponse, IRegisterPayload, ISignInPayload } from "../models/IAuth";
import { api } from "./axios";

//Post/Авторизоваться
export async function signIn(body: ISignInPayload):Promise<IAuthResponse> {
    const {data} = await api.post<IAuthResponse>("/account/sign-in", body);
    return data;
}

//Post/Зарегистрироваться
export async function signUp(body: IRegisterPayload): Promise<IAuthResponse> {
  try {
    const { data } = await api.post<IAuthResponse>("/account/sign-up", body);
    return data;
  } catch (err: any) {
    throw err.response?.data ?? err;
  }
}
