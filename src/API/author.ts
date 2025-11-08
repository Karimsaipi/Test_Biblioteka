import { IAuthor } from "../models/IAuthor";
import { api } from "./axios";

//получить авторов get
export async function fetchAuthors(): Promise<IAuthor[]> {
    const res = await api.get(`/authors/filter`, {
        validateStatus: (s) => s >= 200 && s < 400,
    });
    return res.data as IAuthor[];
}
