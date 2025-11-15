import { IAuthor } from "../models/IAuthor";
import { api } from "./axios";

//получить авторов, get
export async function fetchAuthors(): Promise<IAuthor[]> {
    const response = await api.get(`/authors/filter`);
    return response.data as IAuthor[];
}
