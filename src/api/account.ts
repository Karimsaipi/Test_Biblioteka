import { IAccountEditRequest, IAccountEditResponse } from "../models/IAccountEdit";
import { api } from "./axios";

export async function editAccount(payload: IAccountEditRequest): Promise<IAccountEditResponse> {
    const { data } = await api.put<IAccountEditResponse>("/account/edit", payload);
    return data;
}
