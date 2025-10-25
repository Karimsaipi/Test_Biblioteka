import { IAuthResponse, IRegisterPayload, ISignInPayload } from "../models/IAuth";
import { api } from "./axios";


export async function signIn(body: ISignInPayload):Promise<IAuthResponse> {
    const {data} = await api.post<IAuthResponse>("/account/sign-in", body);
    return data;
}

export async function signUp(body: IRegisterPayload):Promise<void> {
    await api.post("/account/sign-up", body)
}